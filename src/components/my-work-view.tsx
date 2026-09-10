"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckSquare,
  Briefcase,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  Clock,
  Calendar,
  Filter,
  FileText,
  Layers,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useUserRole } from "@/lib/user-role-context";
import { cn } from "@/lib/utils";

export interface MyWorkItem {
  id: string;
  workType: "Production" | "QC" | "Rework";
  projectName: string;
  projectId: string;
  batchName: string;
  batchId: string;
  segmentId: string;
  segmentNumber: string;
  sourceUnitRange: string;
  status: "In Progress" | "Completed" | "Passed" | "Failed";
  allocatedAt: string;
  lastUpdated: string;
  isNew?: boolean;
}

const MOCK_MY_WORK_DATA: MyWorkItem[] = [
  {
    id: "work-1",
    workType: "Production",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Parish Register 1890 Batch 01",
    batchId: "BAT-101-01",
    segmentId: "SEG-001",
    segmentNumber: "001",
    sourceUnitRange: "001–010",
    status: "In Progress",
    allocatedAt: "14 Aug, 2026 09:00am",
    lastUpdated: "6 Sep, 2026 04:45pm",
    isNew: true,
  },
  {
    id: "work-2",
    workType: "Production",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Parish Register 1890 Batch 01",
    batchId: "BAT-101-01",
    segmentId: "SEG-002",
    segmentNumber: "002",
    sourceUnitRange: "051–100",
    status: "In Progress",
    allocatedAt: "14 Aug, 2026 09:00am",
    lastUpdated: "8 Sep, 2026 11:30am",
    isNew: true,
  },
  {
    id: "work-3",
    workType: "Production",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Parish Register 1890 Batch 01",
    batchId: "BAT-101-01",
    segmentId: "SEG-003",
    segmentNumber: "003",
    sourceUnitRange: "101–120",
    status: "Completed",
    allocatedAt: "14 Aug, 2026 09:00am",
    lastUpdated: "9 Sep, 2026 05:15pm",
  },
  {
    id: "work-4",
    workType: "QC",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Parish Register 1890 Batch 01",
    batchId: "BAT-101-01",
    segmentId: "SEG-005",
    segmentNumber: "005",
    sourceUnitRange: "201–250",
    status: "In Progress",
    allocatedAt: "18 Aug, 2026 10:00am",
    lastUpdated: "10 Sep, 2026 10:30am",
    isNew: true,
  },
  {
    id: "work-5",
    workType: "Rework",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Parish Register 1890 Batch 01",
    batchId: "BAT-101-01",
    segmentId: "SEG-006",
    segmentNumber: "006",
    sourceUnitRange: "251–300",
    status: "In Progress",
    allocatedAt: "20 Aug, 2026 02:00pm",
    lastUpdated: "10 Sep, 2026 08:30am",
  },
  {
    id: "work-6",
    workType: "QC",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Civil Registry 1902 Batch 02",
    batchId: "BAT-101-02",
    segmentId: "SEG-011",
    segmentNumber: "011",
    sourceUnitRange: "001–045",
    status: "Passed",
    allocatedAt: "22 Aug, 2026 11:00am",
    lastUpdated: "26 Aug, 2026 04:10pm",
  },
  {
    id: "work-7",
    workType: "QC",
    projectName: "Historical Vital Records Digitization",
    projectId: "DP-PRJ-101",
    batchName: "Vital Records - Civil Registry 1902 Batch 02",
    batchId: "BAT-101-02",
    segmentId: "SEG-012",
    segmentNumber: "012",
    sourceUnitRange: "046–090",
    status: "Passed",
    allocatedAt: "22 Aug, 2026 11:00am",
    lastUpdated: "26 Aug, 2026 05:30pm",
  },
];

export function MyWorkView() {
  const router = useRouter();
  const { currentProfile, role } = useUserRole();
  const [activeTab, setActiveTab] = useState<"all" | "in_progress" | "completed">("all");

  const filteredWork = useMemo(() => {
    return MOCK_MY_WORK_DATA.filter((item) => {
      if (activeTab === "in_progress") {
        return item.status === "In Progress";
      }
      if (activeTab === "completed") {
        return item.status === "Completed" || item.status === "Passed";
      }
      return true;
    });
  }, [activeTab]);

  const handleOpenWork = (item: MyWorkItem) => {
    const tabParam = item.workType.toLowerCase();
    router.push(`/myprojects?projectId=${item.projectId.toLowerCase()}&batchId=${item.batchId.toLowerCase()}&tab=${tabParam}&role=${role}`);
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-xl font-bold tracking-tight flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-primary" />
              My Work
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-xs font-semibold">
              {currentProfile.name}
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Central employee work list for assigned Production, QC, and Rework tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-rose-500/40 bg-rose-500/10 text-rose-500 rounded-none px-3 py-1 text-xs font-bold flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            3 New Work Assignments
          </Badge>
        </div>
      </div>

      {/* WORK STATUS TABS */}
      <Card className="bg-card border-border rounded-none p-5 shadow-none flex flex-col gap-5 border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as any)} className="w-auto">
            <TabsList className="h-9 bg-secondary/50 p-0.5 rounded-none space-x-1">
              <TabsTrigger
                value="all"
                className="text-xs rounded-none px-4 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
              >
                All ({MOCK_MY_WORK_DATA.length})
              </TabsTrigger>
              <TabsTrigger
                value="in_progress"
                className="text-xs rounded-none px-4 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
              >
                In Progress ({MOCK_MY_WORK_DATA.filter((i) => i.status === "In Progress").length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="text-xs rounded-none px-4 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
              >
                Completed ({MOCK_MY_WORK_DATA.filter((i) => i.status === "Completed" || i.status === "Passed").length})
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Filter className="h-3.5 w-3.5 text-primary" />
            <span>Showing {filteredWork.length} Assigned Work Segments</span>
          </div>
        </div>

        {/* WORK TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                <th className="p-3">Work Type</th>
                <th className="p-3">Segment ID & Number</th>
                <th className="p-3">Project</th>
                <th className="p-3">Batch</th>
                <th className="p-3">Source Unit Range</th>
                <th className="p-3">Status</th>
                <th className="p-3">Allocated At</th>
                <th className="p-3">Last Updated</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-border/60 divide-y">
              {filteredWork.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-6 text-center text-muted-foreground">
                    No work items found for the selected tab.
                  </td>
                </tr>
              ) : (
                filteredWork.map((item) => (
                  <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                    {/* Work Type Badge */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        {item.workType === "Production" && (
                          <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 rounded-none py-0.5 px-2 text-[10px] font-bold">
                            Production
                          </Badge>
                        )}
                        {item.workType === "QC" && (
                          <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 rounded-none py-0.5 px-2 text-[10px] font-bold">
                            QC
                          </Badge>
                        )}
                        {item.workType === "Rework" && (
                          <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 rounded-none py-0.5 px-2 text-[10px] font-bold">
                            Rework
                          </Badge>
                        )}
                        {item.isNew && (
                          <span className="text-[9px] bg-rose-500 text-white font-bold px-1 py-0.2 rounded-none uppercase">
                            New
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Segment ID & Number */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-mono font-bold text-foreground text-xs">{item.segmentId}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">#{item.segmentNumber}</span>
                      </div>
                    </td>

                    {/* Project */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-foreground text-xs">{item.projectName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.projectId}</span>
                      </div>
                    </td>

                    {/* Batch */}
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground text-xs">{item.batchName}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">{item.batchId}</span>
                      </div>
                    </td>

                    {/* Source Unit Range */}
                    <td className="p-3 font-mono font-semibold text-foreground">
                      {item.sourceUnitRange}
                    </td>

                    {/* Status */}
                    <td className="p-3">
                      {item.status === "Completed" || item.status === "Passed" ? (
                        <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-none py-0 text-[10px] font-semibold">
                          {item.status}
                        </Badge>
                      ) : item.status === "Failed" ? (
                        <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 rounded-none py-0 text-[10px] font-semibold">
                          Failed
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 rounded-none py-0 text-[10px] font-semibold">
                          In Progress
                        </Badge>
                      )}
                    </td>

                    {/* Allocated At */}
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">
                      {item.allocatedAt}
                    </td>

                    {/* Last Updated */}
                    <td className="p-3 font-mono text-muted-foreground text-[11px]">
                      {item.lastUpdated}
                    </td>

                    {/* Action: Open Work */}
                    <td className="p-3 text-right">
                      <Button
                        size="sm"
                        onClick={() => handleOpenWork(item)}
                        className="h-7 text-xs rounded-none cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        Open Work <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
