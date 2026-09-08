"use client";

import { useState, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  FileText,
  ChevronRight,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  RotateCw,
  Search,
  Plus,
  Upload,
  Download,
  MoreVertical,
  Eye,
  X,
  Building2,
  CheckCircle2,
  LayoutGrid,
  List,
  HardDrive,
  Star,
  Trash2,
} from "lucide-react";
import {
  INITIAL_HR_DOCUMENTS,
  INITIAL_FOLDERS,
  type HRDocument,
  type ExplorerFolder,
} from "@/types/document";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function WindowsFolderIcon({
  className = "h-14 w-14",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 52"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Back Tab */}
      <path
        d="M4 8C4 5.79086 5.79086 4 8 4H22C23.6 4 25 5 25.6 6.4L27.6 10.4C28.2 11.6 29.4 12.4 30.8 12.4H56C58.2091 12.4 60 14.1909 60 16.4V44C60 46.2091 58.2091 48 56 48H8C5.79086 48 4 46.2091 4 44V8Z"
        fill="#E5A910"
      />
      {/* Document Sheet Peek */}
      <rect
        x="16"
        y="9"
        width="32"
        height="24"
        rx="2"
        fill="#FFFFFF"
        opacity="0.9"
      />
      <line
        x1="20"
        y1="15"
        x2="38"
        y2="15"
        stroke="#D1D5DB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="20"
        x2="32"
        y2="20"
        stroke="#E5E7EB"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Front Flap with Gold Gradient */}
      <path
        d="M2.5 17.5C2.5 15.8431 3.84315 14.5 5.5 14.5H58.5C60.1569 14.5 61.5 15.8431 61.5 17.5V44.5C61.5 46.433 59.933 48 58 48H6C4.067 48 2.5 46.433 2.5 44.5V17.5Z"
        fill="url(#win11_folder_grad)"
      />
      <defs>
        <linearGradient
          id="win11_folder_grad"
          x1="32"
          y1="14.5"
          x2="32"
          y2="48"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FFC83B" />
          <stop offset="1" stopColor="#F5B014" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HRDocumentsView() {
  // Explorer States
  const [folders, setFolders] = useState<ExplorerFolder[]>(INITIAL_FOLDERS);
  const [documents, setDocuments] =
    useState<HRDocument[]>(INITIAL_HR_DOCUMENTS);

  // Active Directory & History State
  const [currentFolderId, setCurrentFolderId] = useState<string>("f-root");
  const [history, setHistory] = useState<string[]>(["f-root"]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<string>>(
    new Set(["f-root", "f-legal"]),
  );

  // View & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Modals & PDF Preview State
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newFolderDialogOpen, setNewFolderDialogOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [previewDoc, setPreviewDoc] = useState<HRDocument | null>(null);

  const handleOpenPreview = (doc: HRDocument) => {
    setPreviewDoc(doc);
  };

  // New Document Upload Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Personal Documents");
  const [newVersion, setNewVersion] = useState("v.1.0");
  const [newStatus, setNewStatus] = useState<"Published" | "Expired">(
    "Published",
  );
  const [newNeedsAck, setNewNeedsAck] = useState(false);
  const [newExpiresOn, setNewExpiresOn] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");

  // Navigation Handlers
  const navigateToFolder = (folderId: string) => {
    if (folderId === currentFolderId) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setSelectedItemId(null);

    // Expand folder in tree
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      next.add(folderId);
      return next;
    });
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setCurrentFolderId(history[prevIndex]);
      setSelectedItemId(null);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setCurrentFolderId(history[nextIndex]);
      setSelectedItemId(null);
    }
  };

  const handleUp = () => {
    const currentFolder = folders.find((f) => f.id === currentFolderId);
    if (currentFolder && currentFolder.parentId) {
      navigateToFolder(currentFolder.parentId);
    }
  };

  const toggleFolderExpand = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  // Compute Breadcrumb Path
  const breadcrumbPath = useMemo(() => {
    const path: ExplorerFolder[] = [];
    let curr: ExplorerFolder | undefined = folders.find(
      (f) => f.id === currentFolderId,
    );
    while (curr) {
      path.unshift(curr);
      curr = folders.find((f) => f.id === curr?.parentId);
    }
    return path;
  }, [folders, currentFolderId]);

  // Child Folders & Documents in current directory
  const currentChildFolders = useMemo(() => {
    if (searchQuery.trim()) {
      return folders.filter(
        (f) =>
          f.id !== "f-root" &&
          f.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return folders.filter((f) => f.parentId === currentFolderId);
  }, [folders, currentFolderId, searchQuery]);

  const currentChildDocuments = useMemo(() => {
    if (searchQuery.trim()) {
      return documents.filter(
        (d) =>
          d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.version.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return documents.filter(
      (d) => (d.folderId || "f-root") === currentFolderId,
    );
  }, [documents, currentFolderId, searchQuery]);

  // Count items inside a folder (subfolders + documents recursively)
  const getFolderItemCount = (folderId: string) => {
    const directFolders = folders.filter((f) => f.parentId === folderId).length;
    const directDocs = documents.filter(
      (d) => (d.folderId || "f-root") === folderId,
    ).length;
    return directFolders + directDocs;
  };

  // Handlers for creation & deletion
  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const newFolder: ExplorerFolder = {
      id: `f-${Date.now()}`,
      name: newFolderName.trim(),
      parentId: currentFolderId,
      dateCreated: new Date().toISOString().split("T")[0],
    };

    setFolders((prev) => [...prev, newFolder]);
    setExpandedFolderIds((prev) => new Set([...prev, currentFolderId]));
    setNewFolderName("");
    setNewFolderDialogOpen(false);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const categoryColor = "primary";
    const topStripeColor = "hsl(var(--primary))";

    const newDoc: HRDocument = {
      id: `doc-${Date.now()}`,
      title: newTitle,
      lastUpdate: new Date().toISOString().split("T")[0],
      category: newCategory,
      categoryColor,
      version: newVersion || "v.1.0",
      status: newStatus,
      needsAck: newNeedsAck,
      expiresOn: newExpiresOn || undefined,
      downloadCount: 0,
      author: "Company",
      topStripeColor,
      fileSize: "1.0 MB",
      folderId: currentFolderId,
    };

    setDocuments((prev) => [newDoc, ...prev]);

    // Reset Form
    setNewTitle("");
    setNewCategory("Personal Documents");
    setNewVersion("v.1.0");
    setNewStatus("Published");
    setNewNeedsAck(false);
    setNewExpiresOn("");
    setUploadedFileName("");
    setUploadDialogOpen(false);
  };

  const handleDeleteFolder = (folderId: string) => {
    setFolders((prev) =>
      prev.filter((f) => f.id !== folderId && f.parentId !== folderId),
    );
    setDocuments((prev) => prev.filter((d) => d.folderId !== folderId));
    if (currentFolderId === folderId) {
      setCurrentFolderId("f-root");
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const rootFolder = folders.find((f) => f.id === "f-root") || folders[0];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col gap-4 p-6 transition-colors duration-200">
      {/* HEADER RIBBON & BREADCRUMBS BAR */}
      <div className="bg-card border-border flex flex-col gap-3 rounded-xl border p-4 shadow-xs">
        {/* ROW 1: CONTROLS & ACTION BUTTONS */}
        <div className="border-border/60 flex flex-wrap items-center justify-between gap-3 border-b pb-3">
          {/* NAVIGATION BUTTONS */}
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              disabled={historyIndex <= 0}
              onClick={handleBack}
              className="border-border h-8 w-8 rounded-lg"
              title="Back"
            >
              <ArrowLeft className="text-foreground h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={historyIndex >= history.length - 1}
              onClick={handleForward}
              className="border-border h-8 w-8 rounded-lg"
              title="Forward"
            >
              <ArrowRight className="text-foreground h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              disabled={
                !folders.find((f) => f.id === currentFolderId)?.parentId
              }
              onClick={handleUp}
              className="border-border h-8 w-8 rounded-lg"
              title="Up to Parent Folder"
            >
              <ArrowUp className="text-foreground h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSearchQuery("")}
              className="border-border h-8 w-8 rounded-lg"
              title="Refresh Folder"
            >
              <RotateCw className="text-foreground h-3.5 w-3.5" />
            </Button>
          </div>

          {/* ACTION BUTTONS (NEW FOLDER & UPLOAD FILE) */}
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setNewFolderDialogOpen(true)}
              variant="outline"
              className="border-border h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold"
            >
              <FolderPlus className="text-primary h-4 w-4" /> New Folder
            </Button>

            <Button
              onClick={() => setUploadDialogOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 gap-1.5 rounded-lg px-3 text-xs font-semibold shadow-sm"
            >
              <Plus className="h-4 w-4" /> Upload Document
            </Button>
          </div>
        </div>

        {/* ROW 2: ADDRESS BREADCRUMB BAR, SEARCH BAR, & VIEW TOGGLE */}
        <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          {/* PROMINENT BREADCRUMB PATH BAR */}
          <div className="bg-secondary/50 border-border no-scrollbar flex min-w-0 flex-1 items-center gap-1.5 overflow-x-auto rounded-lg border px-3 py-1.5">
            <button
              type="button"
              onClick={() => navigateToFolder("f-root")}
              className="text-muted-foreground hover:text-primary flex shrink-0 items-center gap-1.5 font-mono text-xs transition-colors"
            >
              <HardDrive className="text-primary h-4 w-4 shrink-0" />
              <span>Documents</span>
            </button>
            <ChevronRight className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />

            {breadcrumbPath.map((folder, idx) => {
              const isLast = idx === breadcrumbPath.length - 1;
              const count = getFolderItemCount(folder.id);
              return (
                <div
                  key={folder.id}
                  className="flex shrink-0 items-center gap-1"
                >
                  <button
                    type="button"
                    onClick={() => navigateToFolder(folder.id)}
                    className={`flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium transition-all ${
                      isLast
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Folder
                      className={`h-3.5 w-3.5 ${isLast ? "text-primary-foreground" : "text-primary"}`}
                    />
                    <span>{folder.name}</span>
                    <span
                      className={`rounded-full px-1 font-mono text-[10px] ${
                        isLast
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                  {!isLast && (
                    <ChevronRight className="text-muted-foreground/60 h-3.5 w-3.5 shrink-0" />
                  )}
                </div>
              );
            })}
          </div>

          {/* SEARCH EXPLORER & VIEW TOGGLE */}
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative w-full sm:w-60">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                placeholder="Search Explorer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-border bg-secondary/30 text-foreground h-8 rounded-lg pl-8 text-xs"
              />
            </div>

            <div className="bg-secondary/50 border-border flex items-center gap-1 rounded-lg border p-1">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`flex items-center rounded-md p-1 text-xs transition-all ${
                  viewMode === "grid"
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Large Icons Grid"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`flex items-center rounded-md p-1 text-xs transition-all ${
                  viewMode === "list"
                    ? "bg-card text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Details List View"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN WINDOWS EXPLORER FULL WIDTH CONTAINER */}
      <div className="bg-card border-border flex min-h-[65vh] w-full flex-1 flex-col justify-between rounded-xl border p-4 shadow-xs">
        <div>
          {/* CURRENT FOLDER TITLE HEADER */}
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <FolderOpen className="text-primary h-5 w-5" />
              <div>
                <h2 className="text-foreground text-sm font-bold">
                  {folders.find((f) => f.id === currentFolderId)?.name ||
                    "HR Vault"}
                </h2>
                <p className="text-muted-foreground text-[11px]">
                  {currentChildFolders.length} folders,{" "}
                  {currentChildDocuments.length} files
                </p>
              </div>
            </div>

            {searchQuery && (
              <Badge variant="outline" className="font-mono text-xs">
                Results for &quot;{searchQuery}&quot;
              </Badge>
            )}
          </div>

          {/* EMPTY STATE */}
          {currentChildFolders.length === 0 &&
          currentChildDocuments.length === 0 ? (
            <div className="text-muted-foreground space-y-2 py-20 text-center">
              <FolderOpen className="text-muted-foreground/40 mx-auto h-10 w-10" />
              <p className="text-xs font-medium">This folder is empty.</p>
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setNewFolderDialogOpen(true)}
                  className="h-8 gap-1 text-xs"
                >
                  <FolderPlus className="text-primary h-3.5 w-3.5" /> Create
                  Folder
                </Button>
                <Button
                  size="sm"
                  onClick={() => setUploadDialogOpen(true)}
                  className="h-8 gap-1 text-xs"
                >
                  <Plus className="h-3.5 w-3.5" /> Upload File
                </Button>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* WINDOWS EXPLORER LARGE ICONS GRID VIEW */
            <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-4 sm:gap-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
              {/* SUB-FOLDERS GRID TILES */}
              {currentChildFolders.map((folder) => {
                const isSelected = selectedItemId === folder.id;
                const count = getFolderItemCount(folder.id);
                return (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedItemId(folder.id)}
                    onDoubleClick={() => navigateToFolder(folder.id)}
                    className={`group relative flex cursor-pointer flex-col items-center justify-start rounded-xl p-2 text-center transition-all ${
                      isSelected
                        ? "bg-primary/10 ring-primary/40 shadow-xs ring-2"
                        : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-foreground hover:bg-background/80 rounded p-1 transition-colors"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => navigateToFolder(folder.id)}
                          >
                            <FolderOpen className="text-primary mr-2 h-3.5 w-3.5" />{" "}
                            Open Folder
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteFolder(folder.id)}
                            className="text-muted-foreground focus:text-foreground"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                            Folder
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="my-1 shrink-0 transition-transform group-hover:scale-105">
                      <WindowsFolderIcon className="h-14 w-14 drop-shadow-xs sm:h-16 sm:w-16" />
                    </div>

                    <div className="mt-1 w-full">
                      <div className="text-foreground line-clamp-2 px-0.5 text-xs leading-tight font-medium break-words">
                        {folder.name}
                      </div>
                      <div className="text-muted-foreground mt-0.5 font-mono text-[10px]">
                        {count} items
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* DOCUMENT FILES GRID TILES */}
              {currentChildDocuments.map((doc) => {
                const isSelected = selectedItemId === doc.id;
                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedItemId(doc.id)}
                    onDoubleClick={() => handleOpenPreview(doc)}
                    className={`group relative flex cursor-pointer flex-col items-center justify-start rounded-xl p-2 text-center transition-all ${
                      isSelected
                        ? "bg-primary/10 ring-primary/40 shadow-xs ring-2"
                        : "hover:bg-secondary/60"
                    }`}
                  >
                    <div className="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="text-muted-foreground hover:text-foreground hover:bg-background/80 rounded p-1 transition-colors"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="text-xs">
                          <DropdownMenuItem
                            onClick={() => handleOpenPreview(doc)}
                          >
                            <Eye className="text-primary mr-2 h-3.5 w-3.5" />{" "}
                            Open Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              alert(
                                `Downloading "${doc.title}" (${doc.fileSize || "1.0 MB"})...`,
                              )
                            }
                          >
                            <Download className="mr-2 h-3.5 w-3.5" /> Download
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="text-muted-foreground focus:text-foreground"
                          >
                            <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="bg-primary/10 text-primary border-primary/20 my-1 shrink-0 rounded-xl border p-2 transition-transform group-hover:scale-105">
                      <FileText className="h-10 w-10 sm:h-12 sm:w-12" />
                    </div>

                    <div className="mt-1 w-full">
                      <div
                        onClick={() => handleOpenPreview(doc)}
                        className="text-foreground hover:text-primary line-clamp-2 px-0.5 text-xs leading-tight font-medium break-words transition-colors"
                      >
                        {doc.title}
                      </div>
                      <div className="text-muted-foreground mt-0.5 font-mono text-[10px]">
                        {doc.fileSize || "1.2 MB"}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* WINDOWS EXPLORER DETAILS TABLE VIEW */
            <div className="border-border overflow-hidden rounded-lg border">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-muted/50 border-border text-muted-foreground border-b text-[11px] font-bold uppercase">
                    <th className="px-3 py-2.5">Name</th>
                    <th className="px-3 py-2.5">Date Modified</th>
                    <th className="px-3 py-2.5">Type</th>
                    <th className="px-3 py-2.5">Size</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {/* SUB-FOLDERS ROWS */}
                  {currentChildFolders.map((folder) => (
                    <tr
                      key={folder.id}
                      onClick={() => setSelectedItemId(folder.id)}
                      onDoubleClick={() => navigateToFolder(folder.id)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="text-foreground px-3 py-2.5 font-semibold">
                        <div className="flex items-center gap-2">
                          <WindowsFolderIcon className="h-5 w-5 shrink-0" />
                          <span
                            onClick={() => navigateToFolder(folder.id)}
                            className="hover:text-primary transition-colors"
                          >
                            {folder.name}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 font-mono text-[11px]">
                        {folder.dateCreated || "2024-01-01"}
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 text-[11px]">
                        File Folder
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 font-mono text-[11px]">
                        {getFolderItemCount(folder.id)} items
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigateToFolder(folder.id)}
                          className="text-primary h-7 px-2 text-xs"
                        >
                          Open
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {/* DOCUMENT ROWS */}
                  {currentChildDocuments.map((doc) => (
                    <tr
                      key={doc.id}
                      onClick={() => setSelectedItemId(doc.id)}
                      onDoubleClick={() => handleOpenPreview(doc)}
                      className="hover:bg-muted/40 cursor-pointer transition-colors"
                    >
                      <td className="text-foreground px-3 py-2.5 font-semibold">
                        <div className="flex items-center gap-2">
                          <FileText className="text-primary h-4 w-4 shrink-0" />
                          <span
                            onClick={() => handleOpenPreview(doc)}
                            className="hover:text-primary transition-colors"
                          >
                            {doc.title}
                          </span>
                        </div>
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 font-mono text-[11px]">
                        {doc.lastUpdate}
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 text-[11px]">
                        PDF Document ({doc.category})
                      </td>
                      <td className="text-muted-foreground px-3 py-2.5 font-mono text-[11px]">
                        {doc.fileSize || "1.2 MB"}
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleOpenPreview(doc)}
                            className="text-primary h-7 px-2 text-xs"
                          >
                            Preview
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground rounded p-1"
                              >
                                <MoreVertical className="h-3.5 w-3.5" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="text-xs"
                            >
                              <DropdownMenuItem
                                onClick={() => handleOpenPreview(doc)}
                              >
                                <Eye className="text-primary mr-2 h-3.5 w-3.5" />{" "}
                                Open Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  alert(
                                    `Downloading "${doc.title}" (${doc.fileSize || "1.0 MB"})...`,
                                  )
                                }
                              >
                                <Download className="mr-2 h-3.5 w-3.5" />{" "}
                                Download
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteDocument(doc.id)}
                                className="text-muted-foreground focus:text-foreground"
                              >
                                <Trash2 className="mr-2 h-3.5 w-3.5" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* EXPLORER STATUS BAR (FOOTER) */}
        <div className="border-border/60 text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs">
          <div>
            <span>{currentChildFolders.length} folders, </span>
            <span>{currentChildDocuments.length} files</span>
          </div>
          <div>
            <span>Monochromatic Explorer Active</span>
          </div>
        </div>
      </div>

      {/* NEW FOLDER DIALOG MODAL */}
      <Dialog open={newFolderDialogOpen} onOpenChange={setNewFolderDialogOpen}>
        <DialogContent className="bg-card border-border max-w-sm rounded-xl p-5 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-2 text-sm font-bold">
              <FolderPlus className="text-primary h-4 w-4" /> Create New Folder
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Add a new folder inside &quot;
              {folders.find((f) => f.id === currentFolderId)?.name}&quot;.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateFolder} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-semibold">
                Folder Name
              </Label>
              <Input
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Compliance Reports 2026"
                className="border-border bg-secondary/30 text-foreground h-9 rounded-md text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setNewFolderDialogOpen(false)}
                className="h-8 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary text-primary-foreground h-8 px-4 text-xs font-semibold"
              >
                Create Folder
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* UPLOAD DOCUMENT DIALOG MODAL */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-card border-border max-w-lg rounded-xl p-6 shadow-2xl">
          <DialogHeader className="border-border/70 border-b pb-3">
            <DialogTitle className="text-foreground flex items-center gap-2 text-base font-bold">
              <Upload className="text-primary h-4 w-4" /> Upload Document
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Uploading to folder: &quot;
              {folders.find((f) => f.id === currentFolderId)?.name}&quot;
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUploadSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-semibold">
                Document Title <span className="text-red-500">*</span>
              </Label>
              <Input
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Employee Handbook 2026"
                className="border-border bg-secondary/30 text-foreground h-9 rounded-md text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold">
                  Category
                </Label>
                <Select value={newCategory} onValueChange={setNewCategory}>
                  <SelectTrigger className="border-border bg-secondary/30 text-foreground h-9 rounded-md text-xs">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Personal Documents">
                      Personal Documents
                    </SelectItem>
                    <SelectItem value="Legal Documents">
                      Legal Documents
                    </SelectItem>
                    <SelectItem value="Financial Documents">
                      Financial Documents
                    </SelectItem>
                    <SelectItem value="Employment Documents">
                      Employment Documents
                    </SelectItem>
                    <SelectItem value="Training Certificates">
                      Training Certificates
                    </SelectItem>
                    <SelectItem value="Performance Records">
                      Performance Records
                    </SelectItem>
                    <SelectItem value="Medical Records">
                      Medical Records
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold">
                  Version
                </Label>
                <Input
                  value={newVersion}
                  onChange={(e) => setNewVersion(e.target.value)}
                  placeholder="v.1.0"
                  className="border-border bg-secondary/30 text-foreground h-9 rounded-md font-mono text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold">
                  Status
                </Label>
                <Select
                  value={newStatus}
                  onValueChange={(val) =>
                    setNewStatus(val as "Published" | "Expired")
                  }
                >
                  <SelectTrigger className="border-border bg-secondary/30 text-foreground h-9 rounded-md text-xs">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border text-foreground">
                    <SelectItem value="Published">Published</SelectItem>
                    <SelectItem value="Expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold">
                  Expiration Date (Optional)
                </Label>
                <Input
                  type="date"
                  value={newExpiresOn}
                  onChange={(e) => setNewExpiresOn(e.target.value)}
                  className="border-border bg-secondary/30 text-foreground h-9 rounded-md text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={newNeedsAck}
                  onChange={(e) => setNewNeedsAck(e.target.checked)}
                  className="accent-primary h-4 w-4 rounded"
                />
                Requires Employee Acknowledgment
              </label>
            </div>

            {/* FILE DROPZONE */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-semibold">
                Document File
              </Label>
              <label className="border-border hover:border-primary bg-secondary/20 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-4 transition-colors">
                <Upload className="text-muted-foreground mb-1 h-6 w-6" />
                <span className="text-foreground text-xs font-medium">
                  {uploadedFileName || "Click or drag file to upload"}
                </span>
                <span className="text-muted-foreground mt-0.5 text-[10px]">
                  PDF, DOCX, CSV up to 25MB
                </span>
                <input
                  type="file"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setUploadedFileName(e.target.files[0].name);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>

            <DialogFooter className="border-border border-t pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadDialogOpen(false)}
                className="border-border h-9 rounded-md text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 rounded-md px-5 text-xs font-semibold"
              >
                Upload & Publish
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DOCUMENT PDF PREVIEW MODAL */}
      {previewDoc && (
        <Dialog open={!!previewDoc} onOpenChange={() => setPreviewDoc(null)}>
          <DialogContent className="flex h-[92vh] w-[96vw] max-w-[96vw] flex-col overflow-hidden rounded-2xl border-slate-800 bg-slate-900 p-0 shadow-2xl sm:max-w-[96vw]">
            {/* TOP PDF TOOLBAR */}
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 text-white">
              {/* Left Title & Format Badge */}
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-primary/10 text-primary border-primary/20 flex shrink-0 items-center gap-1.5 rounded-lg border p-2">
                  <FileText className="text-primary h-4 w-4" />
                  <span className="text-[10px] font-bold tracking-wider uppercase">
                    PDF
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-xs font-bold text-slate-100">
                    {previewDoc.title.replace(/\s+/g, "_")}_{previewDoc.version}
                    .pdf
                  </h3>
                  <p className="truncate text-[10px] text-slate-400">
                    {previewDoc.category} • {previewDoc.fileSize || "1.2 MB"} •
                    Last update {previewDoc.lastUpdate}
                  </p>
                </div>
              </div>
            </div>

            {/* MAIN CANVAS SCROLL VIEWPORT */}
            <div className="flex flex-1 items-start justify-center overflow-auto bg-slate-950 p-6">
              {/* PAPER A4 CANVAS */}
              <div
                className="rounded-sm border border-slate-300 bg-white text-slate-900 shadow-2xl"
                style={{
                  width: "100%",
                  maxWidth: "1000px",
                  minHeight: "850px",
                  padding: "48px",
                }}
              >
                {/* OFFICIAL LETTERHEAD HEADER */}
                <div className="mb-6 flex items-end justify-between border-b-2 border-slate-900 pb-4">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-black tracking-widest text-slate-900 uppercase">
                      <Building2 className="h-4 w-4 text-slate-800" />
                      GLOBAL ENTERPRISE HR PORTAL
                    </div>
                    <div className="mt-0.5 font-mono text-[10px] text-slate-500">
                      Corporate Governance & Compliance Specification
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="inline-block rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-700">
                      CONFIDENTIAL / INTERNAL USE ONLY
                    </div>
                    <div className="mt-1 text-[10px] text-slate-500">
                      Ref: {previewDoc.id.toUpperCase()} • Ver:{" "}
                      {previewDoc.version}
                    </div>
                  </div>
                </div>

                {/* DOCUMENT TITLE & SPEC METADATA */}
                <div className="my-6 space-y-2 text-center">
                  <h1 className="text-base font-extrabold tracking-wide text-slate-900 uppercase">
                    {previewDoc.title}
                  </h1>
                  <div className="text-[11px] font-semibold text-slate-600">
                    Category:{" "}
                    <span className="text-slate-900">
                      {previewDoc.category}
                    </span>{" "}
                    | Effective Date: {previewDoc.lastUpdate}
                  </div>
                </div>

                {/* METADATA SPEC BOX */}
                <div className="mb-6 grid grid-cols-4 gap-2 rounded border border-slate-200 bg-slate-50 p-3 text-[11px]">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Document ID
                    </span>
                    <div className="font-mono font-bold text-slate-800">
                      {previewDoc.id}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Revision
                    </span>
                    <div className="font-mono font-bold text-slate-800">
                      {previewDoc.version}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Status
                    </span>
                    <div className="font-bold text-slate-900">
                      {previewDoc.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      Requirement
                    </span>
                    <div className="font-bold text-slate-800">
                      {previewDoc.needsAck ? "Mandatory Ack" : "Standard Info"}
                    </div>
                  </div>
                </div>

                {/* CONTINUOUS DOCUMENT CONTENT */}
                <div className="space-y-6 text-xs leading-relaxed text-slate-700">
                  <section>
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      1. Purpose & Policy Overview
                    </h2>
                    <p>
                      This document sets forth the official operational policies
                      and requirements regarding{" "}
                      <strong className="text-slate-900">
                        {previewDoc.title}
                      </strong>{" "}
                      across all departments and branch locations of the
                      organization. All active employees, managers, and
                      contractors must review and adhere strictly to the
                      directives specified herein.
                    </p>
                    <p className="mt-2">
                      The primary objective of this policy is to guarantee
                      transparency, data protection compliance, and standardized
                      corporate governance. Failure to comply with these
                      regulations may result in administrative review or
                      disciplinary action as defined in the Corporate Standards
                      Manual.
                    </p>
                  </section>

                  <section className="pt-2">
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      2. Scope & Applicability
                    </h2>
                    <ul className="list-disc space-y-1 pl-5 text-slate-600">
                      <li>
                        Applies to all full-time, part-time, and contractual
                        staff globally.
                      </li>
                      <li>
                        Requires bi-annual audit review by the Human Resources
                        Operations unit.
                      </li>
                      <li>
                        Overrides legacy departmental guidelines established
                        prior to {previewDoc.lastUpdate}.
                      </li>
                    </ul>
                  </section>

                  <section className="pt-2">
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      3. Core Directives & Standards
                    </h2>
                    <p>
                      Employees must ensure that all documentation and data
                      submitted under this policy are accurate, updated, and
                      submitted through official enterprise channels.
                      Confidentiality must be maintained at all times.
                    </p>
                  </section>

                  <section className="pt-2">
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      4. Standard Operating Procedures & Execution
                    </h2>
                    <p>
                      Detailed procedural steps must be followed when submitting
                      or updating information under the{" "}
                      <strong>{previewDoc.title}</strong> framework:
                    </p>
                    <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-slate-600">
                      <li>
                        Access the HR Portal and verify personal and
                        departmental credentials.
                      </li>
                      <li>
                        Complete all mandatory input fields and attach
                        supporting verification files.
                      </li>
                      <li>
                        Obtain digital authorization from designated Department
                        Head or PM.
                      </li>
                      <li>
                        Archive completed submission in compliance with 5-year
                        retention rules.
                      </li>
                    </ol>
                  </section>

                  <section className="pt-3">
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      5. Operational Compliance Table
                    </h2>
                    <div className="mt-2 overflow-hidden rounded border border-slate-300">
                      <table className="w-full border-collapse text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-300 bg-slate-100 font-bold text-slate-800">
                            <th className="border-r border-slate-300 p-2">
                              Phase
                            </th>
                            <th className="border-r border-slate-300 p-2">
                              Responsible Role
                            </th>
                            <th className="border-r border-slate-300 p-2">
                              Target SLA
                            </th>
                            <th className="p-2">Verification Method</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          <tr>
                            <td className="border-r border-slate-300 p-2 font-medium">
                              Submission
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              Employee
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              Day 1
                            </td>
                            <td className="p-2">Digital Signature</td>
                          </tr>
                          <tr>
                            <td className="border-r border-slate-300 p-2 font-medium">
                              Review
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              HR Manager
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              48 Hours
                            </td>
                            <td className="p-2">Portal Audit Log</td>
                          </tr>
                          <tr>
                            <td className="border-r border-slate-300 p-2 font-medium">
                              Approval
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              Department Head
                            </td>
                            <td className="border-r border-slate-300 p-2">
                              72 Hours
                            </td>
                            <td className="p-2">Authorized Badge</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>

                  <section className="pt-3">
                    <h2 className="mb-2 border-b border-slate-200 pb-1 text-xs font-bold tracking-wide text-slate-900 uppercase">
                      6. Authorization & Employee Acknowledgment
                    </h2>
                    <p>
                      By digitally signing or acknowledging this document in the
                      HR Portal, the employee confirms that they have read,
                      understood, and agreed to adhere to all terms, policies,
                      and responsibilities set forth in{" "}
                      <strong className="text-slate-900">
                        {previewDoc.title} ({previewDoc.version})
                      </strong>
                      .
                    </p>
                  </section>

                  {/* DIGITAL SIGNATURE & VERIFICATION STAMP BOX */}
                  <div className="mt-4 space-y-3 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase">
                        <CheckCircle2 className="h-4 w-4 text-slate-800" />
                        DIGITAL ACKNOWLEDGMENT & SIGNATURE STAMP
                      </span>
                      <span className="rounded border border-slate-300 bg-slate-200 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-800">
                        VERIFIED & STAMPED
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[11px]">
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Document Title
                        </span>
                        <div className="font-bold text-slate-900">
                          {previewDoc.title}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Issuing Authority
                        </span>
                        <div className="font-bold text-slate-900">
                          {previewDoc.author} HR Operations
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Signee Status
                        </span>
                        <div className="font-bold text-slate-900">
                          {previewDoc.needsAck
                            ? "Acknowledgment Required"
                            : "Read & Confirmed"}
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase">
                          Date Stamp
                        </span>
                        <div className="font-mono font-bold text-slate-900">
                          {previewDoc.lastUpdate}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PAGE FOOTER STAMP */}
                  <div className="flex items-center justify-between border-t border-slate-200 pt-8 font-mono text-[10px] text-slate-400">
                    <span>Document Code: {previewDoc.id}</span>
                    <span>End of Document</span>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
