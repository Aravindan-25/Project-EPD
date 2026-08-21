"use client";

import { useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { useQueryState, parseAsString, parseAsInteger } from "nuqs";
import {
  ArrowUpDown,
  Search,
  ChevronLeft,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  Archive,
} from "lucide-react";
import { type Task } from "@/types/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DiceDataTableProps {
  data: Task[];
}

export function DiceDataTable({ data }: DiceDataTableProps) {
  // Sync state with URL search params using nuqs
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );
  const [statusFilter, setStatusFilter] = useQueryState(
    "status",
    parseAsString.withDefault("all"),
  );
  const [sortColumn, setSortColumn] = useQueryState(
    "sort",
    parseAsString.withDefault("title"),
  );
  const [sortOrder, setSortOrder] = useQueryState(
    "order",
    parseAsString.withDefault("asc"),
  );
  const [pageIndex, setPageIndex] = useQueryState(
    "page",
    parseAsInteger.withDefault(1),
  );

  // Compute TanStack sorting state
  const sorting: SortingState = useMemo(() => {
    return [{ id: sortColumn, desc: sortOrder === "desc" }];
  }, [sortColumn, sortOrder]);

  const handleSortingChange = useCallback(
    (colId: string) => {
      if (sortColumn === colId) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
      } else {
        setSortColumn(colId);
        setSortOrder("asc");
      }
    },
    [sortColumn, sortOrder, setSortColumn, setSortOrder],
  );

  // Filter data based on searchQuery & statusFilter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [data, searchQuery, statusFilter]);

  const columns = useMemo<ColumnDef<Task>[]>(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        cell: (info) => (
          <span className="text-primary font-mono text-xs font-semibold">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "title",
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleSortingChange("title")}
            className="text-muted-foreground hover:text-foreground -ml-3 h-8 text-xs font-semibold tracking-wider uppercase"
          >
            Task Title
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: (info) => (
          <span className="text-foreground font-medium">
            {String(info.getValue())}
          </span>
        ),
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: (info) => (
          <Badge
            variant="outline"
            className="border-border/60 bg-secondary/50 font-normal"
          >
            {String(info.getValue())}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: (info) => {
          const status = String(info.getValue());
          switch (status) {
            case "completed":
              return (
                <Badge className="gap-1 border-emerald-500/30 bg-emerald-500/15 font-medium text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </Badge>
              );
            case "in_progress":
              return (
                <Badge className="gap-1 border-blue-500/30 bg-blue-500/15 font-medium text-blue-400">
                  <Clock className="h-3 w-3" /> In Progress
                </Badge>
              );
            case "todo":
              return (
                <Badge className="gap-1 border-amber-500/30 bg-amber-500/15 font-medium text-amber-400">
                  <AlertCircle className="h-3 w-3" /> To Do
                </Badge>
              );
            default:
              return (
                <Badge className="gap-1 border-slate-500/30 bg-slate-500/15 font-medium text-slate-400">
                  <Archive className="h-3 w-3" /> Archived
                </Badge>
              );
          }
        },
      },
      {
        accessorKey: "priority",
        header: "Priority",
        cell: (info) => {
          const priority = String(info.getValue());
          const priorityColors: Record<string, string> = {
            urgent: "text-red-400 font-bold",
            high: "text-orange-400 font-semibold",
            medium: "text-yellow-400",
            low: "text-slate-400",
          };
          return (
            <span
              className={`text-xs tracking-wide uppercase ${priorityColors[priority] || ""}`}
            >
              {priority}
            </span>
          );
        },
      },
      {
        accessorKey: "budget",
        header: () => (
          <Button
            variant="ghost"
            onClick={() => handleSortingChange("budget")}
            className="text-muted-foreground hover:text-foreground -ml-3 h-8 text-xs font-semibold tracking-wider uppercase"
          >
            Budget
            <ArrowUpDown className="ml-2 h-3.5 w-3.5" />
          </Button>
        ),
        cell: (info) => (
          <span className="font-mono font-medium text-emerald-400">
            ${Number(info.getValue()).toLocaleString()}
          </span>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Created Date",
        cell: (info) => (
          <span className="text-muted-foreground text-xs">
            {String(info.getValue())}
          </span>
        ),
      },
    ],
    [sortColumn, sortOrder],
  );

  const pageSize = 5;

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      pagination: {
        pageIndex: pageIndex - 1,
        pageSize,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const nextState = updater({
          pageIndex: pageIndex - 1,
          pageSize,
        });
        setPageIndex(nextState.pageIndex + 1);
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;

  return (
    <div className="border-border/70 bg-card/60 space-y-4 rounded-xl border p-5 shadow-xl backdrop-blur-md">
      {/* Control Toolbar (Dice UI Table Pattern) */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
            <Input
              placeholder="Search tasks, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value || null)}
              className="bg-secondary/30 border-border focus-visible:ring-primary pl-9 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery(null)}
                className="text-muted-foreground hover:text-foreground absolute top-2.5 right-2.5"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Select
            value={statusFilter}
            onValueChange={(val) => setStatusFilter(val === "all" ? null : val)}
          >
            <SelectTrigger className="bg-secondary/30 border-border w-[140px] text-xs">
              <Filter className="text-muted-foreground mr-1.5 h-3.5 w-3.5" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="text-muted-foreground flex items-center gap-2 text-xs">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          <span>
            State synced with{" "}
            <code className="bg-primary/10 text-primary rounded px-1 py-0.5 font-mono">
              nuqs
            </code>{" "}
            URL params
          </span>
        </div>
      </div>

      {/* Data Table */}
      <div className="border-border/60 bg-card overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-secondary/40">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border/60 hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="text-muted-foreground py-3 text-xs font-semibold tracking-wider uppercase"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border/40 hover:bg-secondary/30 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-muted-foreground h-32 text-center"
                >
                  No tasks found matching your filter criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-xs">
          Showing{" "}
          <span className="text-foreground font-semibold">
            {filteredData.length}
          </span>{" "}
          total entries
        </p>

        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-xs">
            Page {pageIndex} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(Math.max(1, pageIndex - 1))}
            disabled={pageIndex <= 1}
            className="border-border h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(Math.min(totalPages, pageIndex + 1))}
            disabled={pageIndex >= totalPages}
            className="border-border h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
