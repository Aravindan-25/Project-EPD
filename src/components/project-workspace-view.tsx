"use client";

import React, { useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  FolderKanban,
  LayoutGrid,
  ArrowLeft,
  ArrowRight,
  Search,
  Plus,
  Pencil,
  Eye,
  Trash2,
  Paperclip,
  Upload,
  Clock,
  Building2,
  Tag,
  FileText,
  Table,
  CheckCircle2,
  ShieldCheck,
  UserCheck,
  Activity,
  DownloadCloud,
  SplitSquareVertical,
  Image as ImageIcon,
  Users,
  Check,
  ExternalLink,
  Download,
  RotateCcw,
  Calculator,
  UserPlus,
  Inbox,
  History,
  RefreshCw,
  ChevronRight,
  Sparkles,
  Package,
  Layers,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
import { cn } from "@/lib/utils";
import { SAMPLE_PROJECTS, type Project } from "@/types/project";

export type BatchWorkflowStatus =
  | "CREATED"
  | "SEGMENTED"
  | "PRODUCTION IN PROGRESS"
  | "QC IN PROGRESS"
  | "READY FOR CONSOLIDATION"
  | "COMPLETED";

export interface WorkspaceBatch {
  id: string;
  batchCode: string;
  batchName: string;
  projectId: string;
  projectName: string;
  recordType: string;
  language: string;
  sourceType: "Images" | "PDF";
  totalSourceUnits: number;
  totalImages?: number;
  totalSegments: number;
  completedSegments: number;
  assignedDate: string;
  dueDate: string;
  lastUpdated: string;
  status: BatchWorkflowStatus | string;
}

export interface WorkspaceModalItem {
  id?: string;
  segmentId?: string;
  segmentCode?: string;
  segmentName?: string;
  segmentNumber?: string | number;
  number?: string | number;
  batchCode?: string;
  batchName?: string;
  employeeId?: string;
  employeeName?: string;
  employeeCode?: string;
  allocatedAt?: string;
  allocatedBy?: string;
  allocatedDate?: string;
  status?: string;
  prodStatus?: string;
  totalImages?: number;
  totalRecords?: number | string;
  startSourceUnit?: string;
  endSourceUnit?: string;
  totalSourceUnits?: number | string;
  fileName?: string;
  prodOutputFile?: string;
  prodEmployeeName?: string;
  prodEmployeeCode?: string;
  recordsEntered?: number | string;
  completedAt?: string;
  qcEmployeeName?: string;
  qcEmployeeCode?: string;
  qcAllocatedAt?: string;
  qcAllocatedBy?: string;
  qcStatus?: string;
  qcAccuracy?: string;
  lastUpdated?: string;
  outputFiles?: Array<{ name: string; size: string; type: string }>;
  [key: string]: unknown;
}

export function formatBatchLastUpdated(date: Date = new Date()): string {
  const day = date.getDate();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
}

export function getBatchStatusBadgeClass(status: string) {
  switch (status) {
    case "CREATED":
      return "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700";
    case "SEGMENTED":
      return "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "PRODUCTION IN PROGRESS":
    case "IN_PRODUCTION":
    case "IN_PROGRESS":
      return "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "QC IN PROGRESS":
      return "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
    case "READY FOR CONSOLIDATION":
      return "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
    case "COMPLETED":
      return "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    default:
      return "bg-primary/10 text-primary border-primary/20";
  }
}

export function getBatchStatusDotClass(status: string) {
  switch (status) {
    case "CREATED":
      return "bg-slate-500";
    case "SEGMENTED":
      return "bg-blue-500";
    case "PRODUCTION IN PROGRESS":
    case "IN_PRODUCTION":
    case "IN_PROGRESS":
      return "bg-amber-500";
    case "QC IN PROGRESS":
      return "bg-purple-500";
    case "READY FOR CONSOLIDATION":
      return "bg-cyan-500";
    case "COMPLETED":
      return "bg-emerald-500";
    default:
      return "bg-primary";
  }
}

const INITIAL_BATCHES: WorkspaceBatch[] = [
  {
    id: "BAT-001",
    batchCode: "BAT-001",
    batchName: "Alpha Records - Batch 01",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Birth Records",
    language: "ENGLISH",
    sourceType: "Images",
    totalSourceUnits: 500,
    totalImages: 500,
    totalSegments: 10,
    completedSegments: 10,
    assignedDate: "6 Sep 2026 12:10pm",
    dueDate: "2026-08-25",
    status: "COMPLETED",
    lastUpdated: "6 Sep 2026 12:10pm",
  },
  {
    id: "BAT-002",
    batchCode: "BAT-002",
    batchName: "Alpha Records - Batch 02",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Death Records",
    language: "FRENCH",
    sourceType: "PDF",
    totalSourceUnits: 240,
    totalImages: 240,
    totalSegments: 8,
    completedSegments: 8,
    assignedDate: "7 Sep 2026 10:45am",
    dueDate: "2026-08-30",
    status: "READY FOR CONSOLIDATION",
    lastUpdated: "7 Sep 2026 10:45am",
  },
  {
    id: "BAT-003",
    batchCode: "BAT-003",
    batchName: "Alpha Records - Batch 03",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Marriage Records",
    language: "ENGLISH",
    sourceType: "Images",
    totalSourceUnits: 500,
    totalImages: 500,
    totalSegments: 10,
    completedSegments: 7,
    assignedDate: "7 Sep 2026 02:15pm",
    dueDate: "2026-09-10",
    status: "PRODUCTION IN PROGRESS",
    lastUpdated: "7 Sep 2026 02:15pm",
  },
  {
    id: "BAT-004",
    batchCode: "BAT-004",
    batchName: "Alpha Records - Batch 04",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Community",
    language: "GERMAN",
    sourceType: "PDF",
    totalSourceUnits: 150,
    totalImages: 150,
    totalSegments: 5,
    completedSegments: 0,
    assignedDate: "8 Sep 2026 09:30am",
    dueDate: "2026-09-15",
    status: "SEGMENTED",
    lastUpdated: "8 Sep 2026 09:30am",
  },
  {
    id: "BAT-005",
    batchCode: "BAT-005",
    batchName: "Alpha Records - Batch 05",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Birth",
    language: "ENGLISH",
    sourceType: "Images",
    totalSourceUnits: 100,
    totalImages: 100,
    totalSegments: 2,
    completedSegments: 0,
    assignedDate: "8 Sep 2026 10:15am",
    dueDate: "2026-09-20",
    status: "CREATED",
    lastUpdated: "8 Sep 2026 10:15am",
  },
];

export function ProjectWorkspaceView() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [batches, setBatches] = useState<WorkspaceBatch[]>(INITIAL_BATCHES);

  const [urlProjectId, setUrlProjectId] = useQueryState(
    "projectId",
    parseAsString.withDefault(""),
  );
  const [urlBatchId, setUrlBatchId] = useQueryState(
    "batchId",
    parseAsString.withDefault(""),
  );
  const [urlModuleId, setUrlModuleId] = useQueryState(
    "module",
    parseAsString.withDefault(""),
  );

  const [selectedProjectIdState, setSelectedProjectIdState] = useState<
    string | null
  >(null);
  const [selectedBatchIdState, setSelectedBatchIdState] = useState<
    string | null
  >(null);
  const [activeModuleIdState, setActiveModuleIdState] = useState<number | null>(
    null,
  );

  const selectedProjectId = urlProjectId || selectedProjectIdState;
  const selectedBatchId = urlBatchId || selectedBatchIdState;
  const activeModuleId = urlModuleId
    ? parseInt(urlModuleId, 10) || (urlModuleId === "attachments" ? 1 : null)
    : activeModuleIdState;

  const handleSelectProject = (id: string | null) => {
    setSelectedProjectIdState(id);
    setUrlProjectId(id || "");
    if (!id) {
      setSelectedBatchIdState(null);
      setUrlBatchId("");
      setActiveModuleIdState(null);
      setUrlModuleId("");
    }
  };

  const handleSelectBatch = (id: string | null) => {
    setSelectedBatchIdState(id);
    setUrlBatchId(id || "");
    if (!id) {
      setActiveModuleIdState(null);
      setUrlModuleId("");
    }
  };

  const handleSelectModule = (step: number | null) => {
    setActiveModuleIdState(step);
    setUrlModuleId(step ? step.toString() : "");
  };
  const [showSpecsModal, setShowSpecsModal] = useState(false);

  const [dpTab, setDpTab] = useState<
    "overview" | "batches" | "attachments" | "activity"
  >("overview");
  const [activitySubTab, setActivitySubTab] = useState<
    "user_actions" | "data_diffs"
  >("user_actions");
  const [prodAllocTab, setProdAllocTab] = useState<
    "unassigned" | "allocations" | "history"
  >("unassigned");
  const [prodTrackingTab, setProdTrackingTab] = useState<"tracking" | "output">(
    "tracking",
  );
  const [qcAllocTab, setQcAllocTab] = useState<
    "unassigned" | "allocations" | "history"
  >("unassigned");
  const [qcAllocMode, setQcAllocMode] = useState<"single" | "multiple">(
    "single",
  );
  const [qcTrackingTab, setQcTrackingTab] = useState<"tracking" | "output">(
    "tracking",
  );
  const [qcTrackingDemoHasData, setQcTrackingDemoHasData] = useState(true);
  const [consolidatedDemoHasData, setConsolidatedDemoHasData] = useState(true);
  const [isViewConsolidatedPackageOpen, setIsViewConsolidatedPackageOpen] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isViewImagesOpen, setIsViewImagesOpen] = useState(false);
  const [isRecreateSegmentOpen, setIsRecreateSegmentOpen] = useState(false);
  const [isAllocateProductionOpen, setIsAllocateProductionOpen] =
    useState(false);
  const [isReallocateOpen, setIsReallocateOpen] = useState(false);
  const [isViewProdAllocOpen, setIsViewProdAllocOpen] = useState(false);
  const [selectedAllocForView, setSelectedAllocForView] =
    useState<WorkspaceModalItem | null>(null);
  const [isViewProdOutputOpen, setIsViewProdOutputOpen] = useState(false);
  const [selectedProdOutputForView, setSelectedProdOutputForView] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedProdSegmentIds, setSelectedProdSegmentIds] = useState<
    string[]
  >([]);
  const [isAllocateQCOpen, setIsAllocateQCOpen] = useState(false);
  const [isReallocateQCOpen, setIsReallocateQCOpen] = useState(false);
  const [isViewQCAllocOpen, setIsViewQCAllocOpen] = useState(false);
  const [selectedQCAllocForView, setSelectedQCAllocForView] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedSegmentForAlloc, setSelectedSegmentForAlloc] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedSegmentForRealloc, setSelectedSegmentForRealloc] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedSegmentForQCAlloc, setSelectedSegmentForQCAlloc] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedSegmentForQCRealloc, setSelectedSegmentForQCRealloc] =
    useState<WorkspaceModalItem | null>(null);
  const [selectedProdEmployee, setSelectedProdEmployee] = useState("EMP-001");
  const [selectedQCEmployee, setSelectedQCEmployee] = useState("EMP-005");
  const [selectedQCSegmentIds, setSelectedQCSegmentIds] = useState<string[]>(
    [],
  );
  const [qcDemoHasData, setQcDemoHasData] = useState(true);
  const [imagesPerSegment, setImagesPerSegment] = useState(20);
  const [batchSegmentsMap, setBatchSegmentsMap] = useState<
    Record<string, boolean>
  >({
    "BAT-001": true,
    "BAT-002": true,
    "BAT-003": true,
    "BAT-004": true,
    "BAT-005": false,
  });
  const [selectedBatchForImages, setSelectedBatchForImages] =
    useState<WorkspaceBatch | null>(null);

  // Form states for Create Batch Modal
  const [newBatchName, setNewBatchName] = useState("");
  const [newRecordType, setNewRecordType] = useState("BIRTH_RECORDS");
  const [newLanguage, setNewLanguage] = useState("ENGLISH");
  const [newTotalImages, setNewTotalImages] = useState<number>(100);

  // Form states for Edit Project Modal
  const [editProjectName, setEditProjectName] = useState("");
  const [editClientName, setEditClientName] = useState("");

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return (
      projects.find(
        (p) => p.id === selectedProjectId || p.code === selectedProjectId,
      ) || projects[0]
    );
  }, [projects, selectedProjectId]);

  const projectBatches = useMemo(() => {
    if (!selectedProject) return [];
    return batches.filter(
      (b) =>
        b.projectId === selectedProject.id ||
        b.projectName === selectedProject.name,
    );
  }, [batches, selectedProject]);

  const selectedBatch = useMemo(() => {
    if (!selectedBatchId) return null;
    return (
      batches.find(
        (b) => b.id === selectedBatchId || b.batchCode === selectedBatchId,
      ) || null
    );
  }, [batches, selectedBatchId]);

  const filteredProjects = useMemo(() => {
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.code && p.code.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.clientName &&
          p.clientName.toLowerCase().includes(searchQuery.toLowerCase())),
    );
  }, [projects, searchQuery]);

  const updateBatchStatus = (
    batchId: string,
    newStatus: BatchWorkflowStatus,
  ) => {
    const updatedTime = formatBatchLastUpdated(new Date());
    setBatches((prev) =>
      prev.map((b) =>
        b.id === batchId || b.batchCode === batchId
          ? { ...b, status: newStatus, lastUpdated: updatedTime }
          : b,
      ),
    );
  };

  const handleCreateBatch = () => {
    if (!selectedProject) return;
    const nowFormatted = formatBatchLastUpdated(new Date());
    const newBatch: WorkspaceBatch = {
      id: `BAT-00${projectBatches.length + 1}`,
      batchCode: `BAT-00${projectBatches.length + 1}`,
      batchName:
        newBatchName ||
        `${selectedProject.name} - Batch 0${projectBatches.length + 1}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      recordType: newRecordType,
      language: newLanguage,
      sourceType: "Images",
      totalSourceUnits: newTotalImages,
      totalImages: newTotalImages,
      totalSegments: Math.ceil(newTotalImages / 50),
      completedSegments: 0,
      assignedDate: nowFormatted,
      dueDate: "2026-09-30",
      status: "CREATED",
      lastUpdated: nowFormatted,
    };
    setBatches((prev) => [newBatch, ...prev]);
    setIsCreateBatchOpen(false);
  };

  const handleEditProjectSave = () => {
    if (!selectedProject) return;
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              name: editProjectName || p.name,
              clientName: editClientName || p.clientName,
            }
          : p,
      ),
    );
    setIsEditProjectOpen(false);
  };

  const workflowModules = [
    {
      step: 1,
      title: "Client Attachments",
      desc: "SOPs, guideline manuals, master taxonomies",
      icon: Paperclip,
      badge: "4 Files",
    },
    {
      step: 2,
      title: "Sources",
      desc:
        selectedBatch?.sourceType === "PDF"
          ? "PDF document repository and page manifests"
          : "Source images and input manifests",
      icon: selectedBatch?.sourceType === "PDF" ? FileText : ImageIcon,
      badge: `${selectedBatch?.totalSourceUnits ?? selectedBatch?.totalImages ?? 500} ${selectedBatch?.sourceType === "PDF" ? "Pages" : "Units"}`,
    },
    {
      step: 3,
      title: "Segments",
      desc: "Granular slice records and ranges",
      icon: SplitSquareVertical,
      badge: `${selectedBatch?.totalSegments || 10} Segments`,
    },
    {
      step: 4,
      title: "Production Allocation",
      desc: "Operator assignments and shift quotas",
      icon: UserCheck,
      badge: "Active",
    },
    {
      step: 5,
      title: "Production Tracking & Output",
      desc: "Live throughput, hourly productivity, and production outputs",
      icon: Activity,
      badge: "82% Done",
    },
    {
      step: 6,
      title: "QC Allocation",
      desc: "Lead QC verification queues",
      icon: ShieldCheck,
      badge: "8 Pending",
    },
    {
      step: 7,
      title: "QC Tracking & Output",
      desc: "Defect analysis and verification logs",
      icon: CheckCircle2,
      badge: "97.8% Pass",
    },
    {
      step: 8,
      title: "Consolidated Output",
      desc: "Client release packages and exports",
      icon: DownloadCloud,
      badge: "4 Releases",
    },
  ];

  /* ========================================================================= */
  /* LEVEL 3: BATCH WORKSPACE (Selected Batch & 8 Operational Modules)        */
  /* ========================================================================= */
  if (selectedProject && selectedBatch) {
    /* Dedicated New Screen for Module 1: Client Attachments & Reference Files */
    if (activeModuleId === 1) {
      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Top Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Screen Title & Subtitle */}
          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Client Attachments & Reference Files
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              SOPs, annotation guideline manuals, master taxonomies, and raw
              input files.
            </p>
          </div>

          {/* Full Screen Attachments Table */}
          <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3.5">FILE NAME</th>
                    <th className="p-3.5">FILE TYPE</th>
                    <th className="p-3.5">SIZE</th>
                    <th className="p-3.5">ATTACHMENT DATE AND TIME</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {[
                    {
                      name: "BioTech_Alpha_Guidelines_v3.pdf",
                      type: "PDF Document",
                      size: "4.2 MB",
                      datetime: "2026-08-01 10:30 AM",
                    },
                    {
                      name: "Medical_ICD10_Ontology_2026.json",
                      type: "JSON Ontology",
                      size: "12.8 MB",
                      datetime: "2026-08-10 11:00 AM",
                    },
                    {
                      name: "GeoSpatial_Cadastral_Borders.geojson",
                      type: "GeoJSON Spatial",
                      size: "38.5 MB",
                      datetime: "2026-08-15 02:45 PM",
                    },
                    {
                      name: "Retail_SKU_Master_Catalog.xlsx",
                      type: "Excel Spreadsheet",
                      size: "8.4 MB",
                      datetime: "2026-08-18 09:15 AM",
                    },
                  ].map((doc, i) => (
                    <tr
                      key={i}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="text-foreground p-3.5 font-bold">
                        <span className="flex items-center gap-2.5">
                          <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-md">
                            <FileText className="h-4 w-4" />
                          </div>
                          {doc.name}
                        </span>
                      </td>
                      <td className="text-foreground p-3.5 font-medium">
                        {doc.type}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        {doc.size}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        {doc.datetime}
                      </td>
                      <td className="space-x-2 p-3.5 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border h-7 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5" /> Open
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Download className="h-3.5 w-3.5" /> Download
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      );
    }

    /* Dedicated New Screen for Module 2: Sources */
    if (activeModuleId === 2) {
      const isPdfSource = selectedBatch.sourceType === "PDF";
      const totalUnitsCount =
        selectedBatch.totalSourceUnits ??
        selectedBatch.totalImages ??
        (isPdfSource ? 240 : 500);

      const mockSourcesList = isPdfSource
        ? Array.from({ length: 12 }, (_, idx) => {
            const num = idx + 1;
            const padNum =
              num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
            const isSegmented = num <= 8;
            const segId = isSegmented
              ? num <= 4
                ? "SEG-001"
                : "SEG-002"
              : "—";
            return {
              sourceUnitId: `SU-${padNum}`,
              sourceFileName:
                num <= 6 ? "document_001.pdf" : "document_002.pdf",
              sourceType: "PDF",
              unitReference: `Page ${padNum}`,
              sourceUnitNumber: num,
              segmentStatus: isSegmented ? "Segmented" : "Not Segmented",
              segmentId: segId,
              lastUpdated: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
            };
          })
        : Array.from({ length: 12 }, (_, idx) => {
            const num = idx + 1;
            const padNum =
              num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
            const isSegmented = num <= 10;
            const segId = isSegmented
              ? num <= 5
                ? "SEG-001"
                : "SEG-002"
              : "—";
            return {
              sourceUnitId: `SU-${padNum}`,
              sourceFileName: `image_${padNum}.jpg`,
              sourceType: "Image",
              unitReference: `Image ${padNum}`,
              sourceUnitNumber: num,
              segmentStatus: isSegmented ? "Segmented" : "Not Segmented",
              segmentId: segId,
              lastUpdated: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
            };
          });

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Top Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Screen Title & Badge & Subtitle */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Sources
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                {totalUnitsCount} {isPdfSource ? "Pages" : "Units"} in Batch
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              {isPdfSource
                ? "Batch-specific PDF document repository, page manifests, and raw inputs."
                : "Batch-specific source image repository and coordinate layers."}
            </p>
          </div>

          {/* Sources Table Card */}
          <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3.5">SOURCE UNIT ID</th>
                    <th className="p-3.5">SOURCE FILE NAME</th>
                    <th className="p-3.5">SOURCE TYPE</th>
                    <th className="p-3.5">UNIT REFERENCE</th>
                    <th className="p-3.5 text-center">SOURCE UNIT NUMBER</th>
                    <th className="p-3.5">SEGMENT STATUS</th>
                    <th className="p-3.5">SEGMENT ID</th>
                    <th className="p-3.5">LAST UPDATED</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {mockSourcesList.map((src) => (
                    <tr
                      key={src.sourceUnitId}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="text-foreground p-3.5 font-mono font-bold">
                        {src.sourceUnitId}
                      </td>
                      <td className="text-foreground p-3.5 font-sans font-medium">
                        <span className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded">
                            {src.sourceType === "PDF" ? (
                              <FileText className="h-3.5 w-3.5" />
                            ) : (
                              <ImageIcon className="h-3.5 w-3.5" />
                            )}
                          </div>
                          {src.sourceFileName}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <Badge
                          variant="outline"
                          className="bg-secondary/40 text-foreground border-border text-[11px] font-semibold"
                        >
                          {src.sourceType}
                        </Badge>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-semibold">
                          {src.unitReference}
                        </span>
                      </td>
                      <td className="text-foreground p-3.5 text-center font-mono font-bold">
                        {src.sourceUnitNumber}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
                            src.segmentStatus === "Segmented"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "border-slate-300 bg-slate-100 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400",
                          )}
                        >
                          <span
                            className={cn(
                              "h-1.5 w-1.5 rounded-full",
                              src.segmentStatus === "Segmented"
                                ? "bg-emerald-500"
                                : "bg-slate-400",
                            )}
                          />
                          {src.segmentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold">
                        {src.segmentId === "—" ? (
                          <span className="text-muted-foreground font-sans font-normal">
                            —
                          </span>
                        ) : (
                          <span className="text-primary">{src.segmentId}</span>
                        )}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                        {src.lastUpdated}
                      </td>
                      <td className="space-x-1.5 p-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border hover:bg-secondary inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-0"
                          title="View Source Unit"
                        >
                          <Eye className="text-foreground h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-0"
                          title="Download Source Unit"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      );
    }

    /* Dedicated New Screen for Module 3: Segments */
    if (activeModuleId === 3) {
      const isPdfSource = selectedBatch.sourceType === "PDF";
      const totalSourceUnits =
        selectedBatch.totalSourceUnits ??
        selectedBatch.totalImages ??
        (isPdfSource ? 240 : 500);
      const calculatedSegmentsCount = Math.ceil(
        totalSourceUnits / (imagesPerSegment || 20),
      );
      const hasSegments = Boolean(
        batchSegmentsMap[selectedBatch.id] ??
        (selectedBatch.status !== "CREATED" && selectedBatch.totalSegments > 0),
      );

      const mockSegmentsList = Array.from(
        { length: Math.min(calculatedSegmentsCount, 12) },
        (_, idx) => {
          const num = idx + 1;
          const padNum =
            num < 10 ? `00${num}` : num < 100 ? `0${num}` : `${num}`;
          const startUnit = idx * (imagesPerSegment || 20) + 1;
          const endUnit = Math.min(
            (idx + 1) * (imagesPerSegment || 20),
            totalSourceUnits,
          );
          const padStart =
            startUnit < 10
              ? `00${startUnit}`
              : startUnit < 100
                ? `0${startUnit}`
                : `${startUnit}`;
          const padEnd =
            endUnit < 10
              ? `00${endUnit}`
              : endUnit < 100
                ? `0${endUnit}`
                : `${endUnit}`;
          const count = endUnit - startUnit + 1;

          return {
            segmentId: `SEG-${padNum}`,
            segmentNumber: num,
            startSourceUnit: `SU-${padStart}`,
            endSourceUnit: `SU-${padEnd}`,
            totalSourceUnits: count,
            prodStatus:
              idx === 0 ? "COMPLETED" : idx < 3 ? "IN_PROGRESS" : "PENDING",
            qcStatus: idx === 0 ? "PASSED" : idx < 3 ? "IN_QC" : "PENDING",
            createdAt: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
            lastUpdated: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
          };
        },
      );

      const handleConfirmSegments = () => {
        setBatchSegmentsMap((prev) => ({ ...prev, [selectedBatch.id]: true }));
        if (selectedBatch.status === "CREATED") {
          updateBatchStatus(selectedBatch.id, "SEGMENTED");
        }
        setIsRecreateSegmentOpen(false);
      };

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Top Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Header Row: Title, Subtitle & Create / Recreate Segment Button */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Segments
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                  {hasSegments
                    ? `${mockSegmentsList.length} Segments`
                    : "0 Segments"}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Granular slice records, unit boundaries, and operational segment
                tracking.
              </p>
            </div>

            <Button
              onClick={() => setIsRecreateSegmentOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold sm:self-auto"
            >
              {hasSegments ? (
                <>
                  <RotateCcw className="h-3.5 w-3.5" /> Recreate Segment
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" /> Create Segment
                </>
              )}
            </Button>
          </div>

          {/* If no segments have been created: show empty state and do not show table */}
          {!hasSegments ? (
            <Card className="bg-card border-border space-y-4 rounded-xl p-12 text-center shadow-xs">
              <div className="bg-primary/10 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
                <SplitSquareVertical className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-foreground text-base font-bold">
                  No Segments Created Yet
                </h3>
                <p className="text-muted-foreground mx-auto max-w-md text-xs">
                  This batch currently has no operational segments. Click
                  &ldquo;Create Segment&rdquo; to divide source units into
                  production and QC workloads.
                </p>
              </div>
              <Button
                onClick={() => setIsRecreateSegmentOpen(true)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 rounded-lg px-5 py-2.5 text-xs font-semibold"
              >
                <Plus className="h-4 w-4" /> Create Segment
              </Button>
            </Card>
          ) : (
            <>
              {/* Sub-Tabs Row */}
              <div className="border-border flex items-center gap-6 border-b pb-2 text-xs font-semibold">
                <button
                  type="button"
                  className="border-primary text-primary flex cursor-pointer items-center gap-2 border-b-2 pb-2 font-bold transition-all"
                >
                  <span>Segment Details</span>
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                    {mockSegmentsList.length}
                  </span>
                </button>
                <button
                  type="button"
                  className="text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-2 border-b-2 border-transparent pb-2 transition-all"
                >
                  <span>Segment History</span>
                  <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 text-[11px]">
                    2
                  </span>
                </button>
              </div>

              {/* Segments Table Card */}
              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5 text-center">SEGMENT NUMBER</th>
                        <th className="p-3.5">START SOURCE UNIT</th>
                        <th className="p-3.5">END SOURCE UNIT</th>
                        <th className="p-3.5 text-center">
                          TOTAL SOURCE UNITS
                        </th>
                        <th className="p-3.5">PRODUCTION STATUS</th>
                        <th className="p-3.5">QC STATUS</th>
                        <th className="p-3.5">CREATED AT</th>
                        <th className="p-3.5">LAST UPDATED</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {mockSegmentsList.map((seg) => (
                        <tr
                          key={seg.segmentId}
                          className="hover:bg-secondary/20 transition-colors"
                        >
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {seg.segmentId}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-medium">
                            {seg.segmentNumber}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {seg.startSourceUnit}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {seg.endSourceUnit}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-bold">
                            {seg.totalSourceUnits}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                seg.prodStatus === "COMPLETED"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : seg.prodStatus === "IN_PROGRESS"
                                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                                    : "bg-secondary border-border text-muted-foreground",
                              )}
                            >
                              {seg.prodStatus}
                            </span>
                          </td>
                          <td className="p-3.5 font-sans">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                seg.qcStatus === "PASSED"
                                  ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : seg.qcStatus === "IN_QC"
                                    ? "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-300"
                                    : "bg-secondary border-border text-muted-foreground",
                              )}
                            >
                              {seg.qcStatus}
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {seg.createdAt}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {seg.lastUpdated}
                          </td>
                          <td className="space-x-1.5 p-3.5 text-right font-sans whitespace-nowrap">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border hover:bg-secondary inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-0"
                              title="View Segment Details"
                            >
                              <Eye className="text-foreground h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg p-0"
                              title="Download Segment"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          )}

          {/* CREATE / RECREATE SEGMENTS DIALOG MODAL */}
          <Dialog
            open={isRecreateSegmentOpen}
            onOpenChange={setIsRecreateSegmentOpen}
          >
            <DialogContent className="bg-card border-border text-foreground max-w-lg rounded-2xl p-6 sm:max-w-xl">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedBatch?.batchCode || "BATCH-001"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    {hasSegments ? "Recreate Segments" : "Create Segments"}
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Divide batch source units into discrete operational segments
                  using count division logic.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-3 text-xs">
                {/* Field 1: Total Source Units in Batch */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Total Source Units in Batch
                    </Label>
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Auto-populated
                    </span>
                  </div>
                  <div className="relative">
                    {isPdfSource ? (
                      <FileText className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    ) : (
                      <ImageIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    )}
                    <Input
                      readOnly
                      value={totalSourceUnits}
                      className="bg-secondary/30 border-border text-foreground h-9 rounded-lg pl-9 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Field 2: Unit Count per Segment */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Source Units per Segment
                    </Label>
                    <span className="text-primary text-[11px] font-semibold">
                      Editable division size
                    </span>
                  </div>
                  <div className="relative">
                    <Calculator className="text-primary absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      type="number"
                      value={imagesPerSegment}
                      onChange={(e) =>
                        setImagesPerSegment(Number(e.target.value))
                      }
                      className="bg-background border-border text-foreground focus-visible:ring-primary h-9 rounded-lg pl-9 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* CALCULATED PARTITION PREVIEW CARD */}
                <Card className="bg-primary/5 border-primary/20 space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-[11px] font-bold tracking-wider uppercase">
                      CALCULATED PARTITION PREVIEW
                    </span>
                    <Badge className="bg-primary/15 text-primary border-primary/30 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                      {calculatedSegmentsCount} Total Segments
                    </Badge>
                  </div>

                  <div className="border-primary/10 grid grid-cols-2 gap-4 border-t pt-1 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">
                        Standard Segments:
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-xs font-bold">
                        {calculatedSegmentsCount} segs &times;{" "}
                        {imagesPerSegment || 20} units
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">
                        Final Segment:
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-xs font-bold">
                        {totalSourceUnits % (imagesPerSegment || 20) === 0
                          ? `${imagesPerSegment || 20} units (exact)`
                          : `${totalSourceUnits % (imagesPerSegment || 20)} units (partial)`}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsRecreateSegmentOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleConfirmSegments}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />{" "}
                  {hasSegments ? "Confirm & Recreate" : "Confirm & Create"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 4: Production Allocation */
    if (activeModuleId === 4) {
      const isPdfSource = selectedBatch.sourceType === "PDF";
      const totalSourceUnits =
        selectedBatch.totalSourceUnits ??
        selectedBatch.totalImages ??
        (isPdfSource ? 240 : 500);

      const unassignedSegmentsData = [
        {
          segmentId: "SEG-003",
          segmentNumber: 3,
          startSourceUnit: "SU-041",
          endSourceUnit: "SU-060",
          totalSourceUnits: 20,
          prodStatus: "REWORK_REQUIRED",
          reworkReason: "Failed QC v1: 2 Validation Errors (SU-045, SU-048)",
          failedQcDetails:
            "Failed QC Output v1: 2 Validation Errors in Source Units SU-045 and SU-048",
          createdAt: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
        },
        {
          segmentId: "SEG-004",
          segmentNumber: 4,
          startSourceUnit: "SU-061",
          endSourceUnit: "SU-080",
          totalSourceUnits: 20,
          prodStatus: "PENDING",
          createdAt: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
        },
        {
          segmentId: "SEG-005",
          segmentNumber: 5,
          startSourceUnit: "SU-081",
          endSourceUnit: "SU-100",
          totalSourceUnits: 20,
          prodStatus: "PENDING",
          createdAt: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
        },
        {
          segmentId: "SEG-006",
          segmentNumber: 6,
          startSourceUnit: "SU-101",
          endSourceUnit: "SU-120",
          totalSourceUnits: 20,
          prodStatus: "PENDING",
          createdAt: selectedBatch.lastUpdated || "6 Sep 2026 12:10pm",
        },
      ];

      const allocatedSegmentsData = [
        {
          segmentId: "SEG-001",
          segmentNumber: 1,
          startSourceUnit: "SU-001",
          endSourceUnit: "SU-020",
          totalSourceUnits: 20,
          employeeName: "Mathan Kumar",
          employeeCode: "EMP-001",
          prodStatus: "IN_PROGRESS",
          allocatedAt: "6 Sep 2026 09:30am",
          lastUpdated: "6 Sep 2026 11:15am",
        },
        {
          segmentId: "SEG-002",
          segmentNumber: 2,
          startSourceUnit: "SU-021",
          endSourceUnit: "SU-040",
          totalSourceUnits: 20,
          employeeName: "Mathan Kumar",
          employeeCode: "EMP-001",
          prodStatus: "ALLOCATED",
          allocatedAt: "6 Sep 2026 09:30am",
          lastUpdated: "6 Sep 2026 09:30am",
        },
        {
          segmentId: "SEG-007",
          segmentNumber: 7,
          startSourceUnit: "SU-121",
          endSourceUnit: "SU-140",
          totalSourceUnits: 20,
          employeeName: "Anitha Roy",
          employeeCode: "EMP-002",
          prodStatus: "IN_PROGRESS",
          allocatedAt: "6 Sep 2026 10:00am",
          lastUpdated: "6 Sep 2026 11:45am",
        },
      ];

      const historyAllocationsData = [
        {
          activity: "SEGMENT_REALLOCATED",
          segmentId: "SEG-007",
          details:
            "Segment SEG-007 reallocated from Priya Sharma (EMP-003) to Anitha Roy (EMP-002).",
          allocatedBy: "Vikram Malhotra",
          dateTime: "6 Sep 2026 11:45am",
        },
        {
          activity: "MULTI_SEGMENT_ALLOCATED",
          segmentId: "SEG-001, SEG-002",
          details:
            "Multiple segments (SEG-001, SEG-002) allocated to Mathan Kumar (EMP-001).",
          allocatedBy: "Vikram Malhotra",
          dateTime: "6 Sep 2026 09:30am",
        },
        {
          activity: "SEGMENT_ALLOCATED",
          segmentId: "SEG-001",
          details: "Segment SEG-001 allocated to Mathan Kumar (EMP-001).",
          allocatedBy: "Vikram Malhotra",
          dateTime: "6 Sep 2026 09:30am",
        },
      ];

      const toggleSelectSegment = (id: string) => {
        setSelectedProdSegmentIds((prev) =>
          prev.includes(id)
            ? prev.filter((item) => item !== id)
            : [...prev, id],
        );
      };

      const selectAllUnassigned = () => {
        if (selectedProdSegmentIds.length === unassignedSegmentsData.length) {
          setSelectedProdSegmentIds([]);
        } else {
          setSelectedProdSegmentIds(
            unassignedSegmentsData.map((s) => s.segmentId),
          );
        }
      };

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Top Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Header Row: Title & Subtitle */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Production Allocation
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {selectedBatch.batchCode}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Manage and assign batch segments to eligible production
                employees using generic source units.
              </p>
            </div>

            {selectedProdSegmentIds.length > 0 &&
              prodAllocTab === "unassigned" && (
                <Button
                  onClick={() => {
                    setSelectedSegmentForAlloc({
                      id: selectedProdSegmentIds.join(", "),
                      number: `${selectedProdSegmentIds.length} Selected Segments`,
                      startSourceUnit: "Multiple",
                      endSourceUnit: "Multiple",
                      totalSourceUnits: selectedProdSegmentIds.length * 20,
                      isMultiple: true,
                      countList: selectedProdSegmentIds,
                    });
                    setIsAllocateProductionOpen(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold shadow-xs sm:self-auto"
                >
                  <UserCheck className="h-3.5 w-3.5" /> Allocate Selected (
                  {selectedProdSegmentIds.length})
                </Button>
              )}
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setProdAllocTab("unassigned")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                prodAllocTab === "unassigned"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Inbox className="h-4 w-4" />
              <span>Unassigned Segments</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono text-[11px]">
                {unassignedSegmentsData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setProdAllocTab("allocations")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                prodAllocTab === "allocations"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <UserCheck className="h-4 w-4" />
              <span>Production Allocations</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono text-[11px]">
                {allocatedSegmentsData.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setProdAllocTab("history")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                prodAllocTab === "history"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <History className="h-4 w-4" />
              <span>Production Allocation History</span>
              <span className="bg-secondary text-muted-foreground rounded-full px-2 py-0.5 font-mono text-[11px]">
                {historyAllocationsData.length}
              </span>
            </button>
          </div>

          {/* SUB-TAB 1: UNASSIGNED SEGMENTS */}
          {prodAllocTab === "unassigned" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                      <th className="w-10 p-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={
                            selectedProdSegmentIds.length ===
                              unassignedSegmentsData.length &&
                            unassignedSegmentsData.length > 0
                          }
                          onChange={selectAllUnassigned}
                          className="border-border text-primary h-3.5 w-3.5 cursor-pointer rounded"
                          title="Select All"
                        />
                      </th>
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5 text-center">SEGMENT NUMBER</th>
                      <th className="p-3.5">START SOURCE UNIT</th>
                      <th className="p-3.5">END SOURCE UNIT</th>
                      <th className="p-3.5 text-center">TOTAL SOURCE UNITS</th>
                      <th className="p-3.5">PRODUCTION STATUS</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    {unassignedSegmentsData.map((seg) => {
                      const isSelected = selectedProdSegmentIds.includes(
                        seg.segmentId,
                      );
                      return (
                        <tr
                          key={seg.segmentId}
                          className={cn(
                            "hover:bg-secondary/20 transition-colors",
                            isSelected && "bg-primary/5",
                          )}
                        >
                          <td className="p-3.5 text-center">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() =>
                                toggleSelectSegment(seg.segmentId)
                              }
                              className="border-border text-primary h-3.5 w-3.5 cursor-pointer rounded"
                            />
                          </td>
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {seg.segmentId}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-medium">
                            {seg.segmentNumber}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {seg.startSourceUnit}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {seg.endSourceUnit}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-bold">
                            {seg.totalSourceUnits}
                          </td>
                          <td className="p-3.5 font-sans">
                            <div className="flex flex-col gap-1">
                              <span
                                className={cn(
                                  "inline-flex w-fit items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                  seg.prodStatus === "REWORK_REQUIRED"
                                    ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                                    : "bg-secondary border-border text-muted-foreground",
                                )}
                              >
                                {seg.prodStatus === "REWORK_REQUIRED" ? (
                                  <>
                                    <RefreshCw className="h-3 w-3 text-amber-500" />{" "}
                                    REWORK_REQUIRED
                                  </>
                                ) : (
                                  seg.prodStatus
                                )}
                              </span>
                              {seg.reworkReason && (
                                <span className="font-mono text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                  {seg.reworkReason}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="p-3.5 text-right font-sans">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedSegmentForAlloc(seg);
                                setIsAllocateProductionOpen(true);
                              }}
                              className="bg-primary hover:bg-primary/90 text-primary-foreground h-7 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
                            >
                              <UserPlus className="h-3.5 w-3.5" /> Allocate
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* SUB-TAB 2: PRODUCTION ALLOCATIONS */}
          {prodAllocTab === "allocations" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5 text-center">SEGMENT NUMBER</th>
                      <th className="p-3.5">START SOURCE UNIT</th>
                      <th className="p-3.5">END SOURCE UNIT</th>
                      <th className="p-3.5 text-center">TOTAL SOURCE UNITS</th>
                      <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                      <th className="p-3.5">PRODUCTION STATUS</th>
                      <th className="p-3.5">ALLOCATED AT</th>
                      <th className="p-3.5">LAST UPDATED</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    {allocatedSegmentsData.map((seg) => (
                      <tr
                        key={seg.segmentId}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="text-foreground p-3.5 font-mono font-bold">
                          {seg.segmentId}
                        </td>
                        <td className="text-foreground p-3.5 text-center font-sans font-medium">
                          {seg.segmentNumber}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono">
                          {seg.startSourceUnit}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono">
                          {seg.endSourceUnit}
                        </td>
                        <td className="text-foreground p-3.5 text-center font-sans font-bold">
                          {seg.totalSourceUnits}
                        </td>
                        <td className="p-3.5 font-sans">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                              {seg.employeeName.charAt(0)}
                            </div>
                            <div>
                              <span className="text-foreground block leading-tight font-bold">
                                {seg.employeeName}
                              </span>
                              <span className="text-muted-foreground block font-mono text-[10px]">
                                {seg.employeeCode}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5 font-sans">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                              seg.prodStatus === "COMPLETED"
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : seg.prodStatus === "IN_PROGRESS"
                                  ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                                  : "bg-primary/10 text-primary border-primary/20",
                            )}
                          >
                            <span
                              className={cn(
                                "h-1.5 w-1.5 rounded-full",
                                seg.prodStatus === "COMPLETED"
                                  ? "bg-emerald-500"
                                  : seg.prodStatus === "IN_PROGRESS"
                                    ? "bg-amber-500"
                                    : "bg-primary",
                              )}
                            />
                            {seg.prodStatus}
                          </span>
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                          {seg.allocatedAt}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                          {seg.lastUpdated}
                        </td>
                        <td className="space-x-1.5 p-3.5 text-right font-sans whitespace-nowrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedAllocForView(seg);
                              setIsViewProdAllocOpen(true);
                            }}
                            className="border-border h-7 cursor-pointer gap-1 rounded-lg text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" /> View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedSegmentForRealloc(seg);
                              setIsReallocateOpen(true);
                            }}
                            className="text-primary hover:bg-primary/10 h-7 cursor-pointer gap-1 text-xs font-semibold"
                          >
                            <RefreshCw className="h-3.5 w-3.5" /> Reallocate
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* SUB-TAB 3: PRODUCTION ALLOCATION HISTORY */}
          {prodAllocTab === "history" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                      <th className="p-3.5">ACTIVITY</th>
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5">DETAILS</th>
                      <th className="p-3.5">ALLOCATED BY</th>
                      <th className="p-3.5 whitespace-nowrap">DATE & TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    {historyAllocationsData.map((item, idx) => (
                      <tr
                        key={idx}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="text-primary p-3.5 font-mono text-[11px] font-bold">
                          {item.activity}
                        </td>
                        <td className="text-foreground p-3.5 font-mono font-bold">
                          {item.segmentId}
                        </td>
                        <td className="text-foreground p-3.5 font-medium">
                          {item.details}
                        </td>
                        <td className="text-foreground p-3.5 font-semibold">
                          {item.allocatedBy}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                          {item.dateTime}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* ALLOCATE PRODUCTION DIALOG MODAL */}
          <Dialog
            open={isAllocateProductionOpen}
            onOpenChange={setIsAllocateProductionOpen}
          >
            <DialogContent className="bg-card border-border text-foreground max-w-2xl rounded-2xl p-6 sm:max-w-3xl">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedSegmentForAlloc?.id ||
                      selectedSegmentForAlloc?.segmentId ||
                      "SEG-003"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Allocate Production
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Assign segment source units to an eligible Production
                  employee. A single employee can receive multiple segments.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2 text-xs">
                {/* SECTION 1: SEGMENT INFORMATION */}
                <div className="space-y-2">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    SEGMENT INFORMATION
                  </h3>

                  <Card className="bg-secondary/30 border-border rounded-xl border p-4">
                    <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-5">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Segment ID
                        </span>
                        <span className="text-primary mt-0.5 block truncate font-mono text-xs font-bold">
                          {selectedSegmentForAlloc?.id ||
                            selectedSegmentForAlloc?.segmentId ||
                            "SEG-003"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Segment No
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          #
                          {selectedSegmentForAlloc?.number ||
                            selectedSegmentForAlloc?.segmentNumber ||
                            "3"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Start Source Unit
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForAlloc?.startSourceUnit || "SU-041"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          End Source Unit
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForAlloc?.endSourceUnit || "SU-060"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Total Source Units
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          {selectedSegmentForAlloc?.totalSourceUnits || 20}{" "}
                          Units
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECTION 2: EMPLOYEE ALLOCATION */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    EMPLOYEE ALLOCATION
                  </h3>

                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Select Production Employee{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProdEmployee}
                      onValueChange={setSelectedProdEmployee}
                    >
                      <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                        <SelectValue placeholder="Select Production Employee" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="EMP-001">
                          Mathan Kumar (EMP-001) &mdash; Data Processing (2
                          Segments Assigned)
                        </SelectItem>
                        <SelectItem value="EMP-002">
                          Anitha Roy (EMP-002) &mdash; Data Processing (1
                          Segment Assigned)
                        </SelectItem>
                        <SelectItem value="EMP-003">
                          Priya Sharma (EMP-003) &mdash; Annotation Team (0
                          Segments Assigned)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* EMPLOYEE PREVIEW CARD */}
                  <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-mono text-xs font-bold">
                          {selectedProdEmployee}
                        </span>
                        <span className="text-foreground text-sm font-bold">
                          {selectedProdEmployee === "EMP-001"
                            ? "Mathan Kumar"
                            : selectedProdEmployee === "EMP-002"
                              ? "Anitha Roy"
                              : "Priya Sharma"}
                        </span>
                      </div>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        Department:{" "}
                        <strong className="text-foreground font-semibold">
                          Data Processing
                        </strong>{" "}
                        &bull; Multiple segment allocations supported.
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> Production Eligible
                      </span>
                    </div>
                  </Card>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsAllocateProductionOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsAllocateProductionOpen(false);
                    setSelectedProdSegmentIds([]);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Assign Production
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* REALLOCATE PRODUCTION DIALOG MODAL */}
          <Dialog open={isReallocateOpen} onOpenChange={setIsReallocateOpen}>
            <DialogContent className="bg-card border-border text-foreground max-w-2xl rounded-2xl p-6">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedSegmentForRealloc?.segmentId || "SEG-001"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Reallocate Production Segment
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Reallocate this segment to another eligible Production
                  employee. Only one employee will remain actively assigned to
                  this segment.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-2 text-xs">
                {/* SECTION 1: CURRENT SEGMENT INFORMATION */}
                <div className="space-y-2">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    CURRENT SEGMENT INFORMATION
                  </h3>

                  <Card className="bg-secondary/30 border-border rounded-xl border p-4">
                    <div className="grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Segment ID
                        </span>
                        <span className="text-primary mt-0.5 block font-mono text-xs font-bold">
                          {selectedSegmentForRealloc?.segmentId || "SEG-001"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Currently Assigned To
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          {selectedSegmentForRealloc?.employeeName ||
                            "Mathan Kumar"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Start Source Unit
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForRealloc?.startSourceUnit ||
                            "SU-001"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          End Source Unit
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForRealloc?.endSourceUnit || "SU-020"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECTION 2: NEW EMPLOYEE SELECTION */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    REASSIGN TO PRODUCTION EMPLOYEE
                  </h3>

                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Select New Production Employee{" "}
                      <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={selectedProdEmployee}
                      onValueChange={setSelectedProdEmployee}
                    >
                      <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                        <SelectValue placeholder="Select Production Employee" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border text-xs">
                        <SelectItem value="EMP-002">
                          Anitha Roy (EMP-002) &mdash; Data Processing
                        </SelectItem>
                        <SelectItem value="EMP-003">
                          Priya Sharma (EMP-003) &mdash; Annotation Team
                        </SelectItem>
                        <SelectItem value="EMP-001">
                          Mathan Kumar (EMP-001) &mdash; Data Processing
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsReallocateOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => setIsReallocateOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Confirm Reallocation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* VIEW ALLOCATION DETAILS MODAL */}
          <Dialog
            open={isViewProdAllocOpen}
            onOpenChange={setIsViewProdAllocOpen}
          >
            <DialogContent className="bg-card border-border text-foreground max-w-xl rounded-2xl p-6">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedAllocForView?.segmentId || "SEG-001"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Production Allocation Details
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Production Allocation details and assigned employee
                  information.
                </DialogDescription>
              </DialogHeader>

              {selectedAllocForView && (
                <div className="space-y-4 py-2 text-xs">
                  <div className="bg-secondary/30 border-border grid grid-cols-2 gap-3 rounded-xl border p-4 sm:grid-cols-3">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Segment ID
                      </span>
                      <span className="text-primary mt-0.5 block font-mono text-sm font-bold">
                        {selectedAllocForView.segmentId}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Segment Number
                      </span>
                      <span className="text-foreground mt-0.5 block text-sm font-bold">
                        {selectedAllocForView.segmentNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Total Source Units
                      </span>
                      <span className="text-foreground mt-0.5 block text-sm font-bold">
                        {selectedAllocForView.totalSourceUnits} Units
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Start Source Unit
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-sm font-bold">
                        {selectedAllocForView.startSourceUnit}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        End Source Unit
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-sm font-bold">
                        {selectedAllocForView.endSourceUnit}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px]">
                        Production Status
                      </span>
                      <span className="text-foreground mt-0.5 block text-sm font-bold">
                        {selectedAllocForView.prodStatus}
                      </span>
                    </div>
                  </div>

                  <Card className="bg-card border-border space-y-2 rounded-xl p-4">
                    <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                      ASSIGNED PRODUCTION EMPLOYEE
                    </span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                          {selectedAllocForView.employeeName?.charAt(0) || ""}
                        </div>
                        <div>
                          <span className="text-foreground block text-sm font-bold">
                            {selectedAllocForView.employeeName}
                          </span>
                          <span className="text-muted-foreground font-mono text-xs">
                            {selectedAllocForView.employeeCode}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-[10px]">
                          Allocated At
                        </span>
                        <span className="text-foreground font-mono text-xs font-medium">
                          {selectedAllocForView.allocatedAt}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              <DialogFooter className="pt-2">
                <Button
                  onClick={() => setIsViewProdAllocOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 w-full cursor-pointer rounded-lg px-5 text-xs font-semibold shadow-xs sm:w-auto"
                >
                  Close
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 5: Production Tracking & Output */
    if (activeModuleId === 5) {
      const isPdfSource = selectedBatch.sourceType === "PDF";
      const totalSourceUnits =
        selectedBatch.totalSourceUnits ??
        selectedBatch.totalImages ??
        (isPdfSource ? 240 : 500);

      const mockTrackingList = [
        {
          id: "SEG-001",
          number: 1,
          startSourceUnit: "SU-001",
          endSourceUnit: "SU-020",
          totalSourceUnits: 20,
          empName: "Mathan Kumar",
          empId: "EMP-001",
          avatar: "M",
          sourceProcessed: 20,
          recordsEntered: 350,
          workStatus: "Completed",
          lastUpdated: "6 Sep 2026 12:10pm",
          fileName: `SEG-${selectedBatch.batchCode}-01_output.csv`,
          completedAt: "6 Sep 2026 11:30am",
        },
        {
          id: "SEG-002",
          number: 2,
          startSourceUnit: "SU-021",
          endSourceUnit: "SU-040",
          totalSourceUnits: 20,
          empName: "Mathan Kumar",
          empId: "EMP-001",
          avatar: "M",
          sourceProcessed: 16,
          recordsEntered: 280,
          workStatus: "In Progress",
          lastUpdated: "6 Sep 2026 12:10pm",
          fileName: `SEG-${selectedBatch.batchCode}-02_output.csv`,
          completedAt: "—",
        },
        {
          id: "SEG-003",
          number: 3,
          startSourceUnit: "SU-041",
          endSourceUnit: "SU-060",
          totalSourceUnits: 20,
          empName: "Anitha Roy",
          empId: "EMP-002",
          avatar: "A",
          sourceProcessed: 20,
          recordsEntered: 420,
          workStatus: "Completed",
          lastUpdated: "6 Sep 2026 11:45am",
          fileName: `SEG-${selectedBatch.batchCode}-03_output.csv`,
          completedAt: "6 Sep 2026 11:45am",
        },
        {
          id: "SEG-004",
          number: 4,
          startSourceUnit: "SU-061",
          endSourceUnit: "SU-080",
          totalSourceUnits: 20,
          empName: "Priya Sharma",
          empId: "EMP-003",
          avatar: "P",
          sourceProcessed: 12,
          recordsEntered: 195,
          workStatus: "In Progress",
          lastUpdated: "6 Sep 2026 11:30am",
          fileName: `SEG-${selectedBatch.batchCode}-04_output.csv`,
          completedAt: "—",
        },
        {
          id: "SEG-005",
          number: 5,
          startSourceUnit: "SU-081",
          endSourceUnit: "SU-100",
          totalSourceUnits: 20,
          empName: "Vikram Malhotra",
          empId: "EMP-004",
          avatar: "V",
          sourceProcessed: 8,
          recordsEntered: 110,
          workStatus: "In Progress",
          lastUpdated: "6 Sep 2026 10:30am",
          fileName: `SEG-${selectedBatch.batchCode}-05_output.csv`,
          completedAt: "—",
        },
      ];

      const completedOutputsList = mockTrackingList.filter(
        (item) => item.workStatus === "Completed",
      );

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Top Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Header Row: Title & Subtitle */}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                Production Tracking & Output
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                {selectedBatch.batchCode}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Real-time operator throughput, records entered, and verified
              production output packages using generic source units.
            </p>
          </div>

          {/* 3 TOP SUMMARY CARDS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Card 1: PRODUCTION TEAM */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  PRODUCTION TEAM
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  {mockTrackingList.length}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Employees active on this batch
                </span>
              </div>
            </Card>

            {/* Card 2: PROCESSED SOURCE UNITS */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  PROCESSED SOURCE UNITS
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  76 / {totalSourceUnits}
                </span>
                <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>↗ 76%</span> source units processed
                </span>
              </div>
            </Card>

            {/* Card 3: COMPLETED SEGMENTS */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  COMPLETED SEGMENTS
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  {completedOutputsList.length}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Out of {mockTrackingList.length} segments
                </span>
              </div>
            </Card>
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setProdTrackingTab("tracking")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                prodTrackingTab === "tracking"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Activity className="h-4 w-4" />
              <span>Production Tracking</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono text-[11px]">
                {mockTrackingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setProdTrackingTab("output")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                prodTrackingTab === "output"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <FileText className="h-4 w-4" />
              <span>Production Output</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 font-mono text-[11px]">
                {completedOutputsList.length}
              </span>
            </button>
          </div>

          {/* SUB-TAB 1: PRODUCTION TRACKING */}
          {prodTrackingTab === "tracking" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    PRODUCTION TRACKING
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Real-time operational progress, source unit allocations, and
                    records entered per segment.
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {mockTrackingList.length} Segments
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5 text-center">SEGMENT NUMBER</th>
                        <th className="p-3.5">START SOURCE UNIT</th>
                        <th className="p-3.5">END SOURCE UNIT</th>
                        <th className="p-3.5 text-center">
                          TOTAL SOURCE UNITS
                        </th>
                        <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                        <th className="p-3.5 text-center">SOURCE PROCESSED</th>
                        <th className="p-3.5 text-center">RECORDS ENTERED</th>
                        <th className="p-3.5">WORK STATUS</th>
                        <th className="p-3.5">LAST UPDATED</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {mockTrackingList.map((item) => {
                        const isCompleted = item.workStatus === "Completed";
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="text-foreground p-3.5 font-mono font-bold">
                              {item.id}
                            </td>
                            <td className="text-foreground p-3.5 text-center font-sans font-medium">
                              {item.number}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.startSourceUnit}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.endSourceUnit}
                            </td>
                            <td className="text-foreground p-3.5 text-center font-sans font-bold">
                              {item.totalSourceUnits}
                            </td>
                            <td className="p-3.5 font-sans">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                                  {item.avatar}
                                </div>
                                <div>
                                  <span className="text-foreground block leading-tight font-bold">
                                    {item.empName}
                                  </span>
                                  <span className="text-muted-foreground block font-mono text-[10px]">
                                    {item.empId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="text-foreground p-3.5 text-center font-mono font-semibold">
                              {item.sourceProcessed}
                            </td>
                            <td className="text-foreground p-3.5 text-center font-mono font-bold">
                              {item.recordsEntered}
                            </td>
                            <td className="p-3.5 font-sans">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold",
                                  isCompleted
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
                                )}
                              >
                                <span
                                  className={cn(
                                    "h-1.5 w-1.5 rounded-full",
                                    isCompleted
                                      ? "bg-emerald-500"
                                      : "bg-amber-500",
                                  )}
                                />
                                {item.workStatus}
                              </span>
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {item.lastUpdated}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* SUB-TAB 2: PRODUCTION OUTPUT */}
          {prodTrackingTab === "output" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    PRODUCTION OUTPUT
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Verified digital production packages with timestamps in
                    12-hour format.
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {completedOutputsList.length} Files
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[10px] font-bold tracking-wider whitespace-nowrap uppercase">
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5 text-center">SEGMENT NUMBER</th>
                        <th className="p-3.5">START SOURCE UNIT</th>
                        <th className="p-3.5">END SOURCE UNIT</th>
                        <th className="p-3.5 text-center">
                          TOTAL SOURCE UNITS
                        </th>
                        <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                        <th className="p-3.5 text-center">RECORDS ENTERED</th>
                        <th className="p-3.5">PRODUCTION FILE</th>
                        <th className="p-3.5">WORK STATUS</th>
                        <th className="p-3.5 whitespace-nowrap">
                          COMPLETED AT
                        </th>
                        <th className="p-3.5 whitespace-nowrap">
                          LAST UPDATED
                        </th>
                        <th className="p-3.5 text-right">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {completedOutputsList.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-secondary/20 transition-colors"
                        >
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {item.id}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-medium">
                            {item.number}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.startSourceUnit}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.endSourceUnit}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-sans font-bold">
                            {item.totalSourceUnits}
                          </td>
                          <td className="p-3.5 font-sans">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">
                                {item.avatar}
                              </div>
                              <div>
                                <span className="text-foreground block leading-tight font-bold">
                                  {item.empName}
                                </span>
                                <span className="text-muted-foreground block font-mono text-[10px]">
                                  {item.empId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="text-foreground p-3.5 text-center font-mono font-bold">
                            {item.recordsEntered}
                          </td>
                          <td className="text-foreground p-3.5 font-mono font-bold uppercase">
                            {item.fileName}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Completed
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.completedAt}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.lastUpdated}
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProdOutputForView(item);
                                setIsViewProdOutputOpen(true);
                              }}
                              className="border-border hover:bg-secondary h-8 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                            >
                              <Eye className="text-muted-foreground h-3.5 w-3.5" />{" "}
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* VIEW PRODUCTION OUTPUT MODAL */}
          <Dialog
            open={isViewProdOutputOpen}
            onOpenChange={setIsViewProdOutputOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground text-base font-bold">
                  Production Output File
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="bg-secondary/30 border-border flex items-center gap-3 rounded-xl border p-3.5">
                  <FileText className="text-primary h-5 w-5 shrink-0" />
                  <span className="text-foreground truncate font-mono text-xs font-bold">
                    {selectedProdOutputForView?.fileName ||
                      `SEG-${selectedBatch.batchCode}-01_output.csv`}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="border-border h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> Open
                  </Button>
                  <Button
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 6: QC Allocation */
    if (activeModuleId === 6) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockQCEligibleSegments = [
        {
          id: `seg-${batchCodeLower}-01`,
          number: "Segment 1",
          startSourceUnit: `su-${batchCodeLower}-001`,
          endSourceUnit: `su-${batchCodeLower}-020`,
          totalSourceUnits: "20 Units",
          totalRecords: 350,
          prodEmployeeName: "Mathan Kumar",
          prodEmployeeCode: "EMP-001",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-01_output.csv`,
          qcStatus: "Pending",
          completedAt: "6 Sep 2026 10:30am",
        },
        {
          id: `seg-${batchCodeLower}-02`,
          number: "Segment 2",
          startSourceUnit: `su-${batchCodeLower}-021`,
          endSourceUnit: `su-${batchCodeLower}-040`,
          totalSourceUnits: "20 Units",
          totalRecords: 280,
          prodEmployeeName: "Ananya Sharma",
          prodEmployeeCode: "EMP-002",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-02_output.csv`,
          qcStatus: "Pending",
          completedAt: "6 Sep 2026 10:45am",
        },
        {
          id: `seg-${batchCodeLower}-03`,
          number: "Segment 3",
          startSourceUnit: `su-${batchCodeLower}-041`,
          endSourceUnit: `su-${batchCodeLower}-060`,
          totalSourceUnits: "20 Units",
          totalRecords: 420,
          prodEmployeeName: "Rajesh V",
          prodEmployeeCode: "EMP-003",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-03_output.csv`,
          qcStatus: "Pending",
          completedAt: "6 Sep 2026 11:15am",
        },
        {
          id: `seg-${batchCodeLower}-04`,
          number: "Segment 4",
          startSourceUnit: `su-${batchCodeLower}-061`,
          endSourceUnit: `su-${batchCodeLower}-080`,
          totalSourceUnits: "20 Units",
          totalRecords: 195,
          prodEmployeeName: "Suresh Prabhu",
          prodEmployeeCode: "EMP-004",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-04_output.csv`,
          qcStatus: "Pending",
          completedAt: "6 Sep 2026 11:40am",
        },
        {
          id: `seg-${batchCodeLower}-05`,
          number: "Segment 5",
          startSourceUnit: `su-${batchCodeLower}-081`,
          endSourceUnit: `su-${batchCodeLower}-100`,
          totalSourceUnits: "20 Units",
          totalRecords: 110,
          prodEmployeeName: "Deepa Nair",
          prodEmployeeCode: "EMP-008",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-05_output.csv`,
          qcStatus: "Pending",
          completedAt: "6 Sep 2026 12:05pm",
        },
      ];

      const mockQCAllocations = [
        {
          id: `seg-${batchCodeLower}-06`,
          number: "Segment 6",
          startSourceUnit: `su-${batchCodeLower}-101`,
          endSourceUnit: `su-${batchCodeLower}-120`,
          totalSourceUnits: "20 Units",
          totalRecords: 350,
          prodEmployeeName: "Mathan Kumar",
          prodEmployeeCode: "EMP-001",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-06_output.csv`,
          qcEmployeeName: "Anitha Roy",
          qcEmployeeCode: "EMP-005",
          qcStatus: "Allocated",
          allocatedAt: "6 Sep 2026 11:30am",
          lastUpdated: "6 Sep 2026 11:30am",
        },
        {
          id: `seg-${batchCodeLower}-07`,
          number: "Segment 7",
          startSourceUnit: `su-${batchCodeLower}-121`,
          endSourceUnit: `su-${batchCodeLower}-140`,
          totalSourceUnits: "20 Units",
          totalRecords: 280,
          prodEmployeeName: "Ananya Sharma",
          prodEmployeeCode: "EMP-002",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-07_output.csv`,
          qcEmployeeName: "Priya Sharma",
          qcEmployeeCode: "EMP-006",
          qcStatus: "Allocated",
          allocatedAt: "6 Sep 2026 11:45am",
          lastUpdated: "6 Sep 2026 11:45am",
        },
        {
          id: `seg-${batchCodeLower}-08`,
          number: "Segment 8",
          startSourceUnit: `su-${batchCodeLower}-141`,
          endSourceUnit: `su-${batchCodeLower}-160`,
          totalSourceUnits: "20 Units",
          totalRecords: 420,
          prodEmployeeName: "Rajesh V",
          prodEmployeeCode: "EMP-003",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-08_output.csv`,
          qcEmployeeName: "Vikram Seth",
          qcEmployeeCode: "EMP-007",
          qcStatus: "Allocated",
          allocatedAt: "6 Sep 2026 12:00pm",
          lastUpdated: "6 Sep 2026 12:00pm",
        },
      ];

      const mockQCHistory = [
        {
          id: `log-qc-01`,
          activity: "Segment Allocated",
          segmentId: `seg-${batchCodeLower}-06`,
          details: "Allocated to QC Employee Anitha Roy (EMP-005)",
          allocatedBy: "Lead QC Supervisor",
          dateTime: "6 Sep 2026 11:30am",
        },
        {
          id: `log-qc-02`,
          activity: "Multiple Segments Allocated",
          segmentId: `seg-${batchCodeLower}-07, seg-${batchCodeLower}-08`,
          details:
            "Allocated to QC Employee Priya Sharma (EMP-006) (2 Segments)",
          allocatedBy: "System Admin",
          dateTime: "6 Sep 2026 11:45am",
        },
        {
          id: `log-qc-03`,
          activity: "Segment Reallocated",
          segmentId: `seg-${batchCodeLower}-08`,
          details:
            "Reallocated from Priya Sharma (EMP-006) to Vikram Seth (EMP-007)",
          allocatedBy: "QC Manager",
          dateTime: "6 Sep 2026 12:10pm",
        },
      ];

      const eligibleList = qcDemoHasData ? mockQCEligibleSegments : [];
      const allocationsList = qcDemoHasData ? mockQCAllocations : [];
      const historyList = qcDemoHasData ? mockQCHistory : [];

      const toggleSelectAllQCSegments = () => {
        if (selectedQCSegmentIds.length === eligibleList.length) {
          setSelectedQCSegmentIds([]);
        } else {
          setSelectedQCSegmentIds(eligibleList.map((s) => s.id));
        }
      };

      const toggleSelectQCSegment = (id: string) => {
        if (selectedQCSegmentIds.includes(id)) {
          setSelectedQCSegmentIds(
            selectedQCSegmentIds.filter((item) => item !== id),
          );
        } else {
          setSelectedQCSegmentIds([...selectedQCSegmentIds, id]);
        }
      };

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Header Row: Title & Subtitle */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  QC Allocation
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {selectedBatch.batchCode}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Allocate completed production segments with submitted output to
                certified QC employees.
              </p>
            </div>

            {/* Interactive Demo Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQcDemoHasData(!qcDemoHasData)}
              className="border-primary/40 text-primary hover:bg-primary/5 cursor-pointer self-start border-dashed text-xs sm:self-auto"
            >
              {qcDemoHasData
                ? "View Empty State"
                : "Simulate Completed Segments"}
            </Button>
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setQcAllocTab("unassigned")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcAllocTab === "unassigned"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Unassigned QC Segments</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                {eligibleList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setQcAllocTab("allocations")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcAllocTab === "allocations"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <UserCheck className="h-4 w-4" />
              <span>QC Allocations</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                {allocationsList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setQcAllocTab("history")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcAllocTab === "history"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <History className="h-4 w-4" />
              <span>QC Allocation History</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                {historyList.length}
              </span>
            </button>
          </div>

          {/* TAB 1: UNASSIGNED QC SEGMENTS */}
          {qcAllocTab === "unassigned" && (
            <div className="space-y-4">
              {/* Allocation Mode & Multi-Select Bar */}
              <div className="border-border/40 flex flex-col justify-between gap-3 border-b pb-3 text-xs sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <span className="text-muted-foreground font-semibold">
                    Allocation Mode:
                  </span>
                  <div className="bg-secondary/50 border-border/60 flex items-center rounded-xl border p-1">
                    <button
                      type="button"
                      onClick={() => setQcAllocMode("single")}
                      className={cn(
                        "cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        qcAllocMode === "single"
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Single Segment
                    </button>
                    <button
                      type="button"
                      onClick={() => setQcAllocMode("multiple")}
                      className={cn(
                        "cursor-pointer rounded-lg px-3 py-1 text-xs font-semibold transition-all",
                        qcAllocMode === "multiple"
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      Multiple Segments
                    </button>
                  </div>
                </div>

                <div className="text-muted-foreground text-xs">
                  {qcAllocMode === "single"
                    ? "Allocate individual segments to eligible QC employees"
                    : "Allocate multiple segments to a single eligible QC employee"}
                </div>
              </div>

              {eligibleList.length === 0 ? (
                <Card className="bg-card/40 border-border/80 flex min-h-[300px] flex-col items-center justify-center space-y-2 rounded-xl border p-12 text-center shadow-xs">
                  <p className="text-foreground text-sm font-semibold">
                    No production-completed segments currently awaiting QC
                    allocation.
                  </p>
                  <p className="text-muted-foreground max-w-md text-xs">
                    Segments appear here only after Production work is completed
                    and Production Output is submitted.
                  </p>
                </Card>
              ) : (
                <Card className="bg-card border-border space-y-4 overflow-hidden rounded-xl p-4 shadow-xs">
                  {/* Bulk Action Bar for Multiple Mode */}
                  {qcAllocMode === "multiple" && (
                    <div className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-lg border p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            selectedQCSegmentIds.length > 0 &&
                            selectedQCSegmentIds.length === eligibleList.length
                          }
                          onChange={toggleSelectAllQCSegments}
                          className="border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
                        />
                        <span className="text-foreground font-semibold">
                          {selectedQCSegmentIds.length} of {eligibleList.length}{" "}
                          segment(s) selected
                        </span>
                      </div>
                      <Button
                        disabled={selectedQCSegmentIds.length === 0}
                        onClick={() => {
                          setSelectedSegmentForQCAlloc(eligibleList[0]);
                          setIsAllocateQCOpen(true);
                        }}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold disabled:opacity-50"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Allocate Selected (
                        {selectedQCSegmentIds.length}) Segments
                      </Button>
                    </div>
                  )}

                  {/* Table View with exact required 10 columns */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[10px] font-bold whitespace-nowrap uppercase">
                        <tr>
                          {qcAllocMode === "multiple" && (
                            <th className="w-10 p-3.5">
                              <input
                                type="checkbox"
                                checked={
                                  selectedQCSegmentIds.length > 0 &&
                                  selectedQCSegmentIds.length ===
                                    eligibleList.length
                                }
                                onChange={toggleSelectAllQCSegments}
                                className="border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
                              />
                            </th>
                          )}
                          <th className="p-3.5">Segment ID</th>
                          <th className="p-3.5">Segment Number</th>
                          <th className="p-3.5">Start Source Unit</th>
                          <th className="p-3.5">End Source Unit</th>
                          <th className="p-3.5">Total Source Units</th>
                          <th className="p-3.5 text-center">Total Records</th>
                          <th className="p-3.5">Production Employee</th>
                          <th className="p-3.5 text-center">
                            Production Output File
                          </th>
                          <th className="p-3.5">QC Status</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border divide-y">
                        {eligibleList.map((seg) => {
                          const isSelected = selectedQCSegmentIds.includes(
                            seg.id,
                          );
                          return (
                            <tr
                              key={seg.id}
                              className="hover:bg-secondary/30 transition-colors"
                            >
                              {qcAllocMode === "multiple" && (
                                <td className="p-3.5">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      toggleSelectQCSegment(seg.id)
                                    }
                                    className="border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer rounded"
                                  />
                                </td>
                              )}
                              <td className="text-primary p-3.5 font-mono font-bold">
                                {seg.id}
                              </td>
                              <td className="text-foreground p-3.5 font-semibold">
                                {seg.number}
                              </td>
                              <td className="text-muted-foreground p-3.5 font-mono">
                                {seg.startSourceUnit}
                              </td>
                              <td className="text-muted-foreground p-3.5 font-mono">
                                {seg.endSourceUnit}
                              </td>
                              <td className="text-foreground p-3.5 font-semibold">
                                {seg.totalSourceUnits}
                              </td>
                              <td className="text-foreground p-3.5 text-center font-mono font-bold">
                                {seg.totalRecords}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                                    {seg.prodEmployeeName[0]}
                                  </div>
                                  <div>
                                    <span className="text-foreground block font-semibold">
                                      {seg.prodEmployeeName}
                                    </span>
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                      {seg.prodEmployeeCode}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="p-3.5 text-center">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedProdOutputForView({
                                      fileName: seg.prodOutputFile,
                                      number: seg.number,
                                      recordsEntered: seg.totalRecords,
                                    });
                                    setIsViewProdOutputOpen(true);
                                  }}
                                  className="border-border hover:bg-secondary h-7 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                                  title={`View ${seg.prodOutputFile}`}
                                >
                                  <Eye className="text-muted-foreground h-3.5 w-3.5" />{" "}
                                  View
                                </Button>
                              </td>
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                  <Clock className="h-3 w-3" /> Pending
                                </span>
                              </td>
                              <td className="p-3.5 text-right">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    setSelectedSegmentForQCAlloc(seg);
                                    setIsAllocateQCOpen(true);
                                  }}
                                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold shadow-xs"
                                >
                                  <UserPlus className="h-3.5 w-3.5" /> Allocate
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: QC ALLOCATIONS */}
          {qcAllocTab === "allocations" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              {allocationsList.length === 0 ? (
                <div className="text-muted-foreground space-y-1 p-12 text-center text-xs">
                  <p className="text-foreground font-semibold">
                    No active QC allocations found.
                  </p>
                  <p>
                    Allocated QC segments will appear here with live
                    verification status.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[10px] font-bold whitespace-nowrap uppercase">
                      <tr>
                        <th className="p-3.5">Segment ID</th>
                        <th className="p-3.5">Segment Number</th>
                        <th className="p-3.5">Start Source Unit</th>
                        <th className="p-3.5">End Source Unit</th>
                        <th className="p-3.5">Total Source Units</th>
                        <th className="p-3.5 text-center">Total Records</th>
                        <th className="p-3.5">Production Employee</th>
                        <th className="p-3.5 text-center">
                          Production Output File
                        </th>
                        <th className="p-3.5">QC Employee</th>
                        <th className="p-3.5">QC Status</th>
                        <th className="p-3.5">Allocated At</th>
                        <th className="p-3.5">Last Updated</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {allocationsList.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="text-primary p-3.5 font-mono font-bold">
                            {item.id}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {item.number}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.startSourceUnit}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.endSourceUnit}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {item.totalSourceUnits}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-mono font-bold">
                            {item.totalRecords}
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                                {item.prodEmployeeName[0]}
                              </div>
                              <div>
                                <span className="text-foreground block font-semibold">
                                  {item.prodEmployeeName}
                                </span>
                                <span className="text-muted-foreground font-mono text-[10px]">
                                  {item.prodEmployeeCode}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5 text-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedProdOutputForView({
                                  fileName: item.prodOutputFile,
                                  number: item.number,
                                  recordsEntered: item.totalRecords,
                                });
                                setIsViewProdOutputOpen(true);
                              }}
                              className="border-border hover:bg-secondary h-7 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                              title={`View ${item.prodOutputFile}`}
                            >
                              <Eye className="text-muted-foreground h-3.5 w-3.5" />{" "}
                              View
                            </Button>
                          </td>
                          <td className="p-3.5">
                            <div className="flex items-center gap-2">
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-600">
                                {item.qcEmployeeName[0]}
                              </div>
                              <div>
                                <span className="text-foreground block font-semibold">
                                  {item.qcEmployeeName}
                                </span>
                                <span className="text-muted-foreground font-mono text-[10px]">
                                  {item.qcEmployeeCode}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                              <Clock className="h-3 w-3" /> Allocated
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.allocatedAt}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.lastUpdated}
                          </td>
                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedQCAllocForView(item);
                                  setIsViewQCAllocOpen(true);
                                }}
                                className="border-border hover:bg-secondary h-8 cursor-pointer gap-1 rounded-lg px-2.5 text-xs font-semibold"
                              >
                                <Eye className="text-muted-foreground h-3.5 w-3.5" />{" "}
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedSegmentForQCRealloc(item);
                                  setIsReallocateQCOpen(true);
                                }}
                                className="border-border hover:bg-secondary h-8 cursor-pointer gap-1 rounded-lg px-2.5 text-xs font-semibold"
                              >
                                <RefreshCw className="text-muted-foreground h-3.5 w-3.5" />{" "}
                                Reallocate
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* TAB 3: QC ALLOCATION HISTORY */}
          {qcAllocTab === "history" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              {historyList.length === 0 ? (
                <div className="text-muted-foreground space-y-1 p-12 text-center text-xs">
                  <p className="text-foreground font-semibold">
                    No QC allocation history recorded.
                  </p>
                  <p>
                    Log entries will automatically record when QC employees are
                    assigned or reallocated.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[10px] font-bold whitespace-nowrap uppercase">
                      <tr>
                        <th className="p-3.5">ACTIVITY</th>
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5">DETAILS</th>
                        <th className="p-3.5">ALLOCATED BY</th>
                        <th className="p-3.5">DATE & TIME</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {historyList.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-3.5">
                            <span className="text-foreground font-semibold">
                              {log.activity}
                            </span>
                          </td>
                          <td className="text-primary p-3.5 font-mono font-semibold">
                            {log.segmentId}
                          </td>
                          <td className="text-foreground p-3.5">
                            {log.details}
                          </td>
                          <td className="text-muted-foreground p-3.5">
                            {log.allocatedBy}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {log.dateTime}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* ALLOCATE QC SPECIALIST DIALOG */}
          <Dialog open={isAllocateQCOpen} onOpenChange={setIsAllocateQCOpen}>
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {qcAllocMode === "multiple" &&
                    selectedQCSegmentIds.length > 1
                      ? `${selectedQCSegmentIds.length} Segments`
                      : selectedSegmentForQCAlloc?.id ||
                        `seg-${batchCodeLower}-01`}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Allocate QC Employee
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Assign completed production segment(s) to a certified
                  QC-eligible employee. One QC employee can receive multiple
                  segments.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <Card className="bg-secondary/30 border-border space-y-2 rounded-xl border p-3.5">
                  <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    Target Segment Info
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Segment
                      </span>
                      <span className="text-foreground font-bold">
                        {qcAllocMode === "multiple" &&
                        selectedQCSegmentIds.length > 1
                          ? `${selectedQCSegmentIds.length} Segments Selected`
                          : selectedSegmentForQCAlloc?.number || "Segment 1"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Source Units
                      </span>
                      <span className="text-foreground font-mono">
                        {selectedSegmentForQCAlloc?.totalSourceUnits ||
                          "20 Units"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Prod Employee
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedSegmentForQCAlloc?.prodEmployeeName ||
                          "Mathan Kumar"}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Select QC-Eligible Employee{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedQCEmployee}
                    onValueChange={setSelectedQCEmployee}
                  >
                    <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                      <SelectValue placeholder="Select QC Employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="EMP-005">
                        Anitha Roy (EMP-005) &mdash; Lead QC Certified
                      </SelectItem>
                      <SelectItem value="EMP-006">
                        Priya Sharma (EMP-006) &mdash; Senior QC Auditor
                      </SelectItem>
                      <SelectItem value="EMP-007">
                        Vikram Seth (EMP-007) &mdash; QC Specialist
                      </SelectItem>
                      <SelectItem value="EMP-001">
                        Mathan Kumar (EMP-001) &mdash; Dual Qualified (Prod &
                        QC)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-muted-foreground text-[10px]">
                    Only employees with QC certification or dual qualification
                    are listed.
                  </p>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsAllocateQCOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsAllocateQCOpen(false);
                    setQcDemoHasData(true);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Confirm QC Allocation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* REALLOCATE QC EMPLOYEE DIALOG */}
          <Dialog
            open={isReallocateQCOpen}
            onOpenChange={setIsReallocateQCOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedSegmentForQCRealloc?.id ||
                      `seg-${batchCodeLower}-06`}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Reallocate QC Employee
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Reassign this QC segment from the currently assigned QC
                  employee to another eligible QC employee. Only one QC employee
                  remains active.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <Card className="bg-secondary/30 border-border space-y-2 rounded-xl border p-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Segment Number
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedSegmentForQCRealloc?.number || "Segment 6"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Source Units
                      </span>
                      <span className="text-foreground font-mono">
                        {selectedSegmentForQCRealloc?.startSourceUnit} &rarr;{" "}
                        {selectedSegmentForQCRealloc?.endSourceUnit} (
                        {selectedSegmentForQCRealloc?.totalSourceUnits})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Current QC Employee
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedSegmentForQCRealloc?.qcEmployeeName ||
                          "Anitha Roy"}{" "}
                        (
                        {selectedSegmentForQCRealloc?.qcEmployeeCode ||
                          "EMP-005"}
                        )
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Production Employee
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedSegmentForQCRealloc?.prodEmployeeName ||
                          "Mathan Kumar"}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Select Replacement QC Employee{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedQCEmployee}
                    onValueChange={setSelectedQCEmployee}
                  >
                    <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                      <SelectValue placeholder="Select Replacement QC Employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="EMP-006">
                        Priya Sharma (EMP-006) &mdash; Senior QC Auditor
                      </SelectItem>
                      <SelectItem value="EMP-007">
                        Vikram Seth (EMP-007) &mdash; QC Specialist
                      </SelectItem>
                      <SelectItem value="EMP-005">
                        Anitha Roy (EMP-005) &mdash; Lead QC Certified
                      </SelectItem>
                      <SelectItem value="EMP-001">
                        Mathan Kumar (EMP-001) &mdash; Dual Qualified (Prod &
                        QC)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsReallocateQCOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsReallocateQCOpen(false);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Confirm Reallocation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* VIEW QC ALLOCATION DETAILS DIALOG */}
          <Dialog open={isViewQCAllocOpen} onOpenChange={setIsViewQCAllocOpen}>
            <DialogContent className="bg-card border-border sm:max-w-lg">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedQCAllocForView?.id || `seg-${batchCodeLower}-06`}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    QC Allocation Details
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Complete metadata and verification parameters for this QC
                  segment.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Segment Number
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {selectedQCAllocForView?.number || "Segment 6"}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Total Source Units
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {selectedQCAllocForView?.totalSourceUnits || "20 Units"}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Start Source Unit
                    </span>
                    <span className="text-primary font-mono text-xs font-semibold">
                      {selectedQCAllocForView?.startSourceUnit ||
                        `su-${batchCodeLower}-101`}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      End Source Unit
                    </span>
                    <span className="text-primary font-mono text-xs font-semibold">
                      {selectedQCAllocForView?.endSourceUnit ||
                        `su-${batchCodeLower}-120`}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Total Records
                    </span>
                    <span className="text-foreground font-mono text-xs font-bold">
                      {selectedQCAllocForView?.totalRecords || 350}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Production Output File
                    </span>
                    <span className="text-foreground block truncate font-mono text-xs font-semibold">
                      {selectedQCAllocForView?.prodOutputFile ||
                        `SEG-${selectedBatch.batchCode}-06_output.csv`}
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/30 border-border space-y-2 rounded-xl border p-3.5">
                  <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    Personnel & Output Status
                  </span>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Production Employee
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedQCAllocForView?.prodEmployeeName ||
                          "Mathan Kumar"}{" "}
                        ({selectedQCAllocForView?.prodEmployeeCode || "EMP-001"}
                        )
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Assigned QC Employee
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedQCAllocForView?.qcEmployeeName || "Anitha Roy"}{" "}
                        ({selectedQCAllocForView?.qcEmployeeCode || "EMP-005"})
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        QC Status
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        {selectedQCAllocForView?.qcStatus || "Allocated"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Allocated At
                    </span>
                    <span className="text-foreground font-mono text-xs">
                      {selectedQCAllocForView?.allocatedAt ||
                        "6 Sep 2026 11:30am"}
                    </span>
                  </div>
                  <div className="bg-secondary/30 border-border space-y-1 rounded-xl border p-3">
                    <span className="text-muted-foreground block text-[10px] font-bold uppercase">
                      Last Updated
                    </span>
                    <span className="text-foreground font-mono text-xs">
                      {selectedQCAllocForView?.lastUpdated ||
                        "6 Sep 2026 11:30am"}
                    </span>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  onClick={() => setIsViewQCAllocOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Close Details
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* VIEW PRODUCTION OUTPUT FILE MODAL */}
          <Dialog
            open={isViewProdOutputOpen}
            onOpenChange={setIsViewProdOutputOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground text-base font-bold">
                  Production Output File
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="bg-secondary/30 border-border flex items-center gap-3 rounded-xl border p-3.5">
                  <FileText className="text-primary h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <span className="text-foreground block truncate font-mono text-xs font-bold">
                      {selectedProdOutputForView?.fileName ||
                        `SEG-${selectedBatch.batchCode}-01_output.csv`}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {selectedProdOutputForView?.number
                        ? `${selectedProdOutputForView.number} • `
                        : ""}
                      {selectedProdOutputForView?.recordsEntered ||
                        selectedProdOutputForView?.totalRecords ||
                        350}{" "}
                      records
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="border-border h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 7: QC Tracking & Output */
    if (activeModuleId === 7) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockQCTrackingList = [
        {
          id: `seg-${batchCodeLower}-01`,
          number: "Segment 1",
          startSourceUnit: `su-${batchCodeLower}-001`,
          endSourceUnit: `su-${batchCodeLower}-020`,
          totalSourceUnits: "20 Units",
          totalRecords: 350,
          prodEmployeeName: "Mathan Kumar",
          prodEmployeeCode: "EMP-001",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-01_output.csv`,
          qcSpecialist: "Anitha Roy",
          qcEmpId: "EMP-005",
          accuracy: "100%",
          defects: "0 defects",
          status: "Passed QC",
          verifiedAt: "6 Sep 2026 11:45am",
        },
        {
          id: `seg-${batchCodeLower}-02`,
          number: "Segment 2",
          startSourceUnit: `su-${batchCodeLower}-021`,
          endSourceUnit: `su-${batchCodeLower}-040`,
          totalSourceUnits: "20 Units",
          totalRecords: 280,
          prodEmployeeName: "Ananya Sharma",
          prodEmployeeCode: "EMP-002",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-02_output.csv`,
          qcSpecialist: "Priya Sharma",
          qcEmpId: "EMP-006",
          accuracy: "98.5%",
          defects: "1 minor typo",
          status: "In QC Review",
          verifiedAt: "6 Sep 2026 12:10pm",
        },
        {
          id: `seg-${batchCodeLower}-03`,
          number: "Segment 3",
          startSourceUnit: `su-${batchCodeLower}-041`,
          endSourceUnit: `su-${batchCodeLower}-060`,
          totalSourceUnits: "20 Units",
          totalRecords: 420,
          prodEmployeeName: "Rajesh V",
          prodEmployeeCode: "EMP-003",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-03_output.csv`,
          qcSpecialist: "Vikram Seth",
          qcEmpId: "EMP-007",
          accuracy: "99.0%",
          defects: "0 defects",
          status: "Passed QC",
          verifiedAt: "6 Sep 2026 01:20pm",
        },
        {
          id: `seg-${batchCodeLower}-04`,
          number: "Segment 4",
          startSourceUnit: `su-${batchCodeLower}-061`,
          endSourceUnit: `su-${batchCodeLower}-080`,
          totalSourceUnits: "20 Units",
          totalRecords: 195,
          prodEmployeeName: "Suresh Prabhu",
          prodEmployeeCode: "EMP-004",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-04_output.csv`,
          qcSpecialist: "Anitha Roy",
          qcEmpId: "EMP-005",
          accuracy: "100%",
          defects: "0 defects",
          status: "Passed QC",
          verifiedAt: "6 Sep 2026 01:45pm",
        },
        {
          id: `seg-${batchCodeLower}-05`,
          number: "Segment 5",
          startSourceUnit: `su-${batchCodeLower}-081`,
          endSourceUnit: `su-${batchCodeLower}-100`,
          totalSourceUnits: "20 Units",
          totalRecords: 110,
          prodEmployeeName: "Deepa Nair",
          prodEmployeeCode: "EMP-008",
          prodOutputFile: `SEG-${selectedBatch.batchCode}-05_output.csv`,
          qcSpecialist: "Priya Sharma",
          qcEmpId: "EMP-006",
          accuracy: "99.5%",
          defects: "0 defects",
          status: "Passed QC",
          verifiedAt: "6 Sep 2026 02:15pm",
        },
      ];

      const mockQCOutputList = [
        {
          id: `pkg-${batchCodeLower}-01`,
          packageName: `SEG-${selectedBatch.batchCode}-01`,
          segmentCount: "Segment 1",
          sourceUnitCount: "20 Source Units",
          totalRecords: 350,
          passRate: "100%",
          qcStatus: "Completed",
          qcResult: "Approved",
          errorCount: 0,
          errorDetails: "None (100% Accuracy)",
          approvedBy: "Lead QC Supervisor",
          releasedAt: "6 Sep 2026 01:30pm",
          status: "READY_FOR_CONSOLIDATION",
        },
        {
          id: `pkg-${batchCodeLower}-02-v1`,
          packageName: `SEG-${selectedBatch.batchCode}-02 (Failed QC v1)`,
          segmentCount: "Segment 2",
          sourceUnitCount: "20 Source Units",
          totalRecords: 280,
          passRate: "Failed (3 Errors)",
          qcStatus: "Completed",
          qcResult: "Failed",
          errorCount: 3,
          errorDetails: "3 Field Misalignments in Record #14",
          approvedBy: "Anitha Roy (QC Specialist)",
          releasedAt: "6 Sep 2026 12:15pm",
          status: "SENT_TO_PRODUCTION_REWORK",
        },
        {
          id: `pkg-${batchCodeLower}-02-v2`,
          packageName: `SEG-${selectedBatch.batchCode}-02 (Rework v2)`,
          segmentCount: "Segment 2",
          sourceUnitCount: "20 Source Units",
          totalRecords: 280,
          passRate: "100%",
          qcStatus: "Completed",
          qcResult: "Approved",
          errorCount: 0,
          errorDetails: "Resolved in Production Rework",
          approvedBy: "Priya Sharma (QC Specialist)",
          releasedAt: "6 Sep 2026 02:45pm",
          status: "READY_FOR_CONSOLIDATION",
        },
        {
          id: `pkg-${batchCodeLower}-03-v1`,
          packageName: `SEG-${selectedBatch.batchCode}-03 (Failed QC v1)`,
          segmentCount: "Segment 3",
          sourceUnitCount: "20 Source Units",
          totalRecords: 420,
          passRate: "Failed (2 Errors)",
          qcStatus: "Completed",
          qcResult: "Failed",
          errorCount: 2,
          errorDetails: "2 Validation Errors in SU-045, SU-048",
          approvedBy: "Vikram Seth (QC Specialist)",
          releasedAt: "6 Sep 2026 01:10pm",
          status: "SENT_TO_PRODUCTION_REWORK",
        },
      ];

      const trackingList = qcTrackingDemoHasData ? mockQCTrackingList : [];
      const outputList = qcTrackingDemoHasData ? mockQCOutputList : [];

      const inspectedCount = trackingList.filter(
        (item) => item.status === "Passed QC",
      ).length;
      const totalSegments = qcTrackingDemoHasData ? trackingList.length : 0;
      const errorCount = qcTrackingDemoHasData ? 1 : 0;
      const approvedPackages = outputList.length;

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Page Header */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  QC Tracking & Output
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {selectedBatch.batchCode}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Quality verification logs, defect avoidance diagnostics, and
                verified QC release outputs.
              </p>
            </div>

            {/* Interactive Demo Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setQcTrackingDemoHasData(!qcTrackingDemoHasData)}
              className="border-primary/40 text-primary hover:bg-primary/5 cursor-pointer self-start border-dashed text-xs sm:self-auto"
            >
              {qcTrackingDemoHasData
                ? "View Empty State"
                : "Simulate QC Tracking Data"}
            </Button>
          </div>

          {/* 4 Metric KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {/* Card 1: OVERALL PASS RATE */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  OVERALL PASS RATE
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200/50 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {qcTrackingDemoHasData ? "99.2%" : "100%"}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                  <span className="flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    &nearr; +0.0%
                  </span>
                  <span className="text-muted-foreground">target: 95%</span>
                </div>
              </div>
            </Card>

            {/* Card 2: INSPECTED SEGMENTS */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  INSPECTED SEGMENTS
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200/50 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {inspectedCount}
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Out of {totalSegments} total segments
                </p>
              </div>
            </Card>

            {/* Card 3: TOTAL IDENTIFIED ERRORS */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  TOTAL IDENTIFIED ERRORS
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200/50 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                  <Tag className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {errorCount}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-[11px]">
                  <span className="flex items-center gap-0.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    &nearr; -3
                  </span>
                  <span className="text-muted-foreground">defects reduced</span>
                </div>
              </div>
            </Card>

            {/* Card 4: APPROVED QC PACKAGES */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  APPROVED QC PACKAGES
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-200/50 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {approvedPackages}
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Ready for consolidation
                </p>
              </div>
            </Card>
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setQcTrackingTab("tracking")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcTrackingTab === "tracking"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Activity className="h-4 w-4" />
              <span>QC Tracking List</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                {trackingList.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setQcTrackingTab("output")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcTrackingTab === "output"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>QC Output</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                {outputList.length}
              </span>
            </button>
          </div>

          {/* TAB 1: QC TRACKING LIST */}
          {qcTrackingTab === "tracking" && (
            <div className="space-y-4">
              {/* Section Header */}
              <div className="border-border/40 flex items-center justify-between border-b pb-2">
                <div>
                  <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    QC TRACKING LIST
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Live verification queues with defect categorization and
                    process timestamps.
                  </p>
                </div>
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 font-mono text-xs font-semibold">
                  {trackingList.length} Segments
                </span>
              </div>

              {trackingList.length === 0 ? (
                <Card className="bg-card/30 border-border/80 flex min-h-[260px] flex-col items-center justify-center space-y-3 rounded-xl border border-dashed p-16 text-center shadow-xs">
                  <div className="bg-secondary/80 border-border/60 text-muted-foreground/70 flex h-10 w-10 items-center justify-center rounded-full border">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-foreground text-sm font-semibold">
                      No QC tracking records found
                    </p>
                    <p className="text-muted-foreground max-w-sm text-xs">
                      Records will appear here once segments are allocated for
                      QC verification.
                    </p>
                  </div>
                </Card>
              ) : (
                <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[10px] font-bold whitespace-nowrap uppercase">
                        <tr>
                          <th className="p-3.5">Segment ID</th>
                          <th className="p-3.5">Segment Number</th>
                          <th className="p-3.5">Start Source Unit</th>
                          <th className="p-3.5">End Source Unit</th>
                          <th className="p-3.5">Total Source Units</th>
                          <th className="p-3.5 text-center">Total Records</th>
                          <th className="p-3.5">Production Employee</th>
                          <th className="p-3.5 text-center">
                            Production Output File
                          </th>
                          <th className="p-3.5">QC Employee</th>
                          <th className="p-3.5">Accuracy Rate</th>
                          <th className="p-3.5">Defects</th>
                          <th className="p-3.5">QC Status</th>
                          <th className="p-3.5">Timestamp</th>
                          <th className="p-3.5 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border divide-y">
                        {trackingList.map((item) => (
                          <tr
                            key={item.id}
                            className="hover:bg-secondary/30 transition-colors"
                          >
                            <td className="text-primary p-3.5 font-mono font-bold">
                              {item.id}
                            </td>
                            <td className="text-foreground p-3.5 font-semibold">
                              {item.number}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.startSourceUnit}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.endSourceUnit}
                            </td>
                            <td className="text-foreground p-3.5 font-semibold">
                              {item.totalSourceUnits}
                            </td>
                            <td className="text-foreground p-3.5 text-center font-mono font-bold">
                              {item.totalRecords}
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                                  {item.prodEmployeeName[0]}
                                </div>
                                <div>
                                  <span className="text-foreground block font-semibold">
                                    {item.prodEmployeeName}
                                  </span>
                                  <span className="text-muted-foreground font-mono text-[10px]">
                                    {item.prodEmployeeCode}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5 text-center">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProdOutputForView({
                                    fileName: item.prodOutputFile,
                                    number: item.number,
                                    recordsEntered: item.totalRecords,
                                  });
                                  setIsViewProdOutputOpen(true);
                                }}
                                className="border-border hover:bg-secondary h-7 cursor-pointer gap-1.5 rounded-lg px-2.5 text-xs font-semibold"
                                title={`View ${item.prodOutputFile}`}
                              >
                                <Eye className="text-muted-foreground h-3.5 w-3.5" />{" "}
                                View
                              </Button>
                            </td>
                            <td className="p-3.5">
                              <div className="flex items-center gap-2">
                                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-600">
                                  {item.qcSpecialist[0]}
                                </div>
                                <div>
                                  <span className="text-foreground block font-semibold">
                                    {item.qcSpecialist}
                                  </span>
                                  <span className="text-muted-foreground font-mono text-[10px]">
                                    {item.qcEmpId}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3.5">
                              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                {item.accuracy}
                              </span>
                            </td>
                            <td className="text-muted-foreground p-3.5">
                              {item.defects}
                            </td>
                            <td className="p-3.5">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
                                  item.status === "Passed QC"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
                                )}
                              >
                                {item.status === "Passed QC" ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <Clock className="h-3 w-3" />
                                )}
                                {item.status}
                              </span>
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {item.verifiedAt}
                            </td>
                            <td className="p-3.5 text-right">
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-border hover:bg-secondary h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold"
                              >
                                <Eye className="h-3.5 w-3.5" /> Inspect Sheet
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          )}

          {/* TAB 2: QC OUTPUT */}
          {qcTrackingTab === "output" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              {outputList.length === 0 ? (
                <div className="text-muted-foreground space-y-1 p-12 text-center text-xs">
                  <p className="text-foreground font-semibold">
                    No verified QC release packages available.
                  </p>
                  <p>
                    QC release packages will compile here once segments complete
                    verification.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[10px] font-bold whitespace-nowrap uppercase">
                      <tr>
                        <th className="p-3.5">Package ID</th>
                        <th className="p-3.5">Segments</th>
                        <th className="p-3.5">Total Source Units</th>
                        <th className="p-3.5 text-center">Total Records</th>
                        <th className="p-3.5">Pass Rate</th>
                        <th className="p-3.5">Approved By</th>
                        <th className="p-3.5">Release Timestamp</th>
                        <th className="p-3.5 text-right">
                          Consolidation Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {outputList.map((pkg) => (
                        <tr
                          key={pkg.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="text-primary p-3.5 font-mono font-bold">
                            <div>
                              <span>{pkg.packageName}</span>
                              {pkg.qcResult === "Failed" && (
                                <span className="block font-sans text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                                  Historical Failed Output (Preserved)
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {pkg.segmentCount}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {pkg.sourceUnitCount}
                          </td>
                          <td className="text-foreground p-3.5 text-center font-mono font-bold">
                            {pkg.totalRecords}
                          </td>
                          <td className="p-3.5 font-sans">
                            <div className="flex flex-col gap-1">
                              <span className="bg-secondary text-muted-foreground border-border inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                                <CheckCircle2 className="h-3 w-3 text-emerald-500" />{" "}
                                QC Status: {pkg.qcStatus || "Completed"}
                              </span>
                              <span
                                className={cn(
                                  "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold",
                                  pkg.qcResult === "Approved"
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                                    : "border-red-200 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
                                )}
                              >
                                {pkg.qcResult === "Approved" ? (
                                  <CheckCircle2 className="h-3 w-3" />
                                ) : (
                                  <AlertCircle className="h-3 w-3" />
                                )}
                                QC Result:{" "}
                                {pkg.qcResult ||
                                  (pkg.passRate.includes("Failed")
                                    ? "Failed"
                                    : "Approved")}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted-foreground p-3.5">
                            <div>
                              <span className="text-foreground block font-semibold">
                                {pkg.approvedBy}
                              </span>
                              {pkg.errorCount > 0 ? (
                                <span className="block font-mono text-[10px] font-bold text-red-600 dark:text-red-400">
                                  {pkg.errorCount} Errors &bull;{" "}
                                  {pkg.errorDetails}
                                </span>
                              ) : (
                                <span className="text-muted-foreground block text-[10px]">
                                  {pkg.errorDetails || "No defects identified"}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {pkg.releasedAt}
                          </td>
                          <td className="p-3.5 text-right">
                            {pkg.status === "SENT_TO_PRODUCTION_REWORK" ||
                            pkg.qcResult === "Failed" ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                                <RefreshCw className="h-3 w-3 text-amber-500" />{" "}
                                Sent to Production Allocation (Rework)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <CheckCircle2 className="h-3 w-3" /> Ready for
                                Consolidation
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}

          {/* VIEW PRODUCTION OUTPUT FILE MODAL IN MODULE 7 */}
          <Dialog
            open={isViewProdOutputOpen}
            onOpenChange={setIsViewProdOutputOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground text-base font-bold">
                  Production Output File
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 py-2">
                <div className="bg-secondary/30 border-border flex items-center gap-3 rounded-xl border p-3.5">
                  <FileText className="text-primary h-5 w-5 shrink-0" />
                  <div className="min-w-0 flex-1 text-left">
                    <span className="text-foreground block truncate font-mono text-xs font-bold">
                      {selectedProdOutputForView?.fileName ||
                        `SEG-${selectedBatch.batchCode}-01_output.csv`}
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      {selectedProdOutputForView?.number
                        ? `${selectedProdOutputForView.number} • `
                        : ""}
                      {selectedProdOutputForView?.recordsEntered ||
                        selectedProdOutputForView?.totalRecords ||
                        350}{" "}
                      records
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    variant="outline"
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="border-border h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold"
                  >
                    <ExternalLink className="h-3.5 w-3.5" /> View
                  </Button>
                  <Button
                    onClick={() => setIsViewProdOutputOpen(false)}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 8: Consolidated Output */
    if (activeModuleId === 8) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockConsolidatedSegments = [
        {
          id: `seg-${batchCodeLower}-01`,
          number: "Segment 1",
          prodOutput: `PROD_${selectedBatch.batchCode}_SEG01.json`,
          qcOutput: `QC_VERIFIED_${selectedBatch.batchCode}_SEG01.zip`,
          prodDate: "6 Sep 2026 10:30am",
          qcDate: "6 Sep 2026 11:45am",
          records: "500",
          status: "Consolidated",
        },
        {
          id: `seg-${batchCodeLower}-02`,
          number: "Segment 2",
          prodOutput: `PROD_${selectedBatch.batchCode}_SEG02.json`,
          qcOutput: `QC_VERIFIED_${selectedBatch.batchCode}_SEG02.zip`,
          prodDate: "6 Sep 2026 10:45am",
          qcDate: "6 Sep 2026 12:10pm",
          records: "500",
          status: "Consolidated",
        },
        {
          id: `seg-${batchCodeLower}-03`,
          number: "Segment 3",
          prodOutput: `PROD_${selectedBatch.batchCode}_SEG03.json`,
          qcOutput: `QC_VERIFIED_${selectedBatch.batchCode}_SEG03.zip`,
          prodDate: "6 Sep 2026 11:15am",
          qcDate: "6 Sep 2026 01:20pm",
          records: "500",
          status: "Consolidated",
        },
        {
          id: `seg-${batchCodeLower}-04`,
          number: "Segment 4",
          prodOutput: `PROD_${selectedBatch.batchCode}_SEG04.json`,
          qcOutput: `QC_VERIFIED_${selectedBatch.batchCode}_SEG04.zip`,
          prodDate: "6 Sep 2026 11:40am",
          qcDate: "6 Sep 2026 01:45pm",
          records: "500",
          status: "Consolidated",
        },
        {
          id: `seg-${batchCodeLower}-05`,
          number: "Segment 5",
          prodOutput: `PROD_${selectedBatch.batchCode}_SEG05.json`,
          qcOutput: `QC_VERIFIED_${selectedBatch.batchCode}_SEG05.zip`,
          prodDate: "6 Sep 2026 12:05pm",
          qcDate: "6 Sep 2026 02:15pm",
          records: "500",
          status: "Consolidated",
        },
      ];

      const segmentList = consolidatedDemoHasData
        ? mockConsolidatedSegments
        : [];
      const completedSegmentsCount = segmentList.length;
      const totalSegmentsCount = consolidatedDemoHasData ? 5 : 0;
      const totalImagesProcessed = consolidatedDemoHasData
        ? "500/500"
        : "300/300";
      const totalRecordsCount = consolidatedDemoHasData ? "2,500/2,500" : "0/0";

      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          {/* Navigation Link */}
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          {/* Page Header Row */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Consolidated Output
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 font-mono text-xs font-semibold">
                  {selectedBatch.batchCode}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Batch-level consolidated release package merging Production
                Output and QC Output across all batch segments.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setConsolidatedDemoHasData(!consolidatedDemoHasData)
                }
                className="border-primary/40 text-primary hover:bg-primary/5 cursor-pointer border-dashed text-xs"
              >
                {consolidatedDemoHasData
                  ? "View Empty State (Screenshot View)"
                  : "Simulate Consolidated Data"}
              </Button>
              <Button
                onClick={() => {
                  setConsolidatedDemoHasData(true);
                  setIsViewConsolidatedPackageOpen(true);
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-2 rounded-lg px-4 text-xs font-semibold shadow-xs"
              >
                <Sparkles className="h-4 w-4" /> Generate Batch Package
              </Button>
            </div>
          </div>

          {/* 3 Metric KPI Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Card 1: TOTAL SEGMENTS COMPLETED */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  TOTAL SEGMENTS COMPLETED
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200/50 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <Layers className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {completedSegmentsCount}/{totalSegmentsCount}
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  All {completedSegmentsCount} segments verified
                </p>
              </div>
            </Card>

            {/* Card 2: TOTAL IMAGES COMPLETED */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  TOTAL IMAGES COMPLETED
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-purple-200/50 bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {totalImagesProcessed}
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Processed and verified images
                </p>
              </div>
            </Card>

            {/* Card 3: TOTAL RECORDS COMPLETED */}
            <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  TOTAL RECORDS COMPLETED
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200/50 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <Table className="h-4 w-4" />
                </div>
              </div>
              <div>
                <div className="text-foreground text-2xl font-bold tracking-tight">
                  {totalRecordsCount}
                </div>
                <p className="text-muted-foreground mt-1 text-[11px]">
                  Sum of records across batch segments
                </p>
              </div>
            </Card>
          </div>

          {/* Consolidated Release Zip Package Banner Card */}
          <Card className="bg-card border-primary/20 flex flex-col justify-between gap-4 rounded-xl border p-4 shadow-xs sm:flex-row sm:items-center sm:p-5">
            <div className="flex items-start gap-3.5 sm:items-center">
              <div className="bg-primary text-primary-foreground mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-bold shadow-xs sm:mt-0">
                <Package className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-foreground font-mono text-sm font-bold">
                    {selectedBatch.batchCode}_Consolidated_Package.zip
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Ready for Release
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  <strong className="text-foreground font-semibold">
                    Consolidated Output Date: 6 Sep 2026 12:10pm
                  </strong>
                </p>
                <p className="text-muted-foreground text-xs">
                  Contains consolidated Production Output JSON files and QC
                  Output verification packages for {segmentList.length}{" "}
                  segments.
                </p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsViewConsolidatedPackageOpen(true)}
              className="border-border hover:bg-secondary h-9 shrink-0 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold"
            >
              <Eye className="h-4 w-4" /> View
            </Button>
          </Card>

          {/* SEGMENT-WISE CONSOLIDATION TABLE */}
          <div className="space-y-4">
            {/* Section Header */}
            <div className="border-border/40 flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                  SEGMENT-WISE CONSOLIDATION TABLE
                </h3>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Consolidated outputs of all segments in{" "}
                  {selectedBatch.batchCode}.
                </p>
              </div>
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 font-mono text-xs font-semibold">
                {segmentList.length} Segments
              </span>
            </div>

            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
                    <tr>
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5">SEGMENT NUMBER</th>
                      <th className="p-3.5">PRODUCTION OUTPUT</th>
                      <th className="p-3.5">QC OUTPUT</th>
                      <th className="p-3.5">PRODUCTION OUTPUT DATE/TIME</th>
                      <th className="p-3.5">QC OUTPUT DATE/TIME</th>
                      <th className="p-3.5">TOTAL RECORDS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border divide-y">
                    {segmentList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={8}
                          className="text-muted-foreground p-12 text-center text-xs"
                        >
                          No consolidated segments found in{" "}
                          {selectedBatch.batchCode}. Click &quot;Simulate
                          Consolidated Data&quot; or &quot;Generate Batch
                          Package&quot; to compile outputs.
                        </td>
                      </tr>
                    ) : (
                      segmentList.map((seg) => (
                        <tr
                          key={seg.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="text-primary p-3.5 font-mono font-bold">
                            {seg.id}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {seg.number}
                          </td>
                          <td className="text-foreground p-3.5 font-mono text-xs">
                            {seg.prodOutput}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono text-xs">
                            {seg.qcOutput}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {seg.prodDate}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {seg.qcDate}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {seg.records}
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-secondary h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold"
                            >
                              <Download className="h-3.5 w-3.5" /> Download
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

          {/* PACKAGE INSPECTION DIALOG */}
          <Dialog
            open={isViewConsolidatedPackageOpen}
            onOpenChange={setIsViewConsolidatedPackageOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-xl">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Package className="text-primary h-5 w-5" />
                  <DialogTitle className="text-foreground font-mono text-lg font-bold">
                    {selectedBatch.batchCode}_Consolidated_Package.zip
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Consolidated release package manifest and verification summary
                  for Batch {selectedBatch.batchCode}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <Card className="bg-secondary/30 border-border space-y-3 rounded-xl border p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      RELEASE PACKAGE METADATA
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" /> Verified Package
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Batch Code
                      </span>
                      <span className="text-primary font-mono font-bold">
                        {selectedBatch.batchCode}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Total Segments
                      </span>
                      <span className="text-foreground font-bold">
                        3 Segments
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Total Records
                      </span>
                      <span className="text-foreground font-semibold">
                        1,500 Records
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        File Size
                      </span>
                      <span className="text-foreground font-mono">42.8 MB</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    PACKAGE MANIFEST CONTENTS
                  </h4>
                  <div className="border-border bg-background text-muted-foreground space-y-1.5 overflow-hidden rounded-xl border p-3 font-mono text-[11px]">
                    <div className="text-foreground flex items-center justify-between font-semibold">
                      <span>📁 /consolidated_release/</span>
                      <span className="text-muted-foreground text-[10px]">
                        Directory
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span>📄 manifest_sha256.txt</span>
                      <span className="text-[10px] text-emerald-600">
                        Verified Hash
                      </span>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span>📄 BATCH-010_merged_output.json</span>
                      <span className="text-[10px]">1,500 Records</span>
                    </div>
                    <div className="flex items-center justify-between pl-4">
                      <span>📁 /qc_audit_logs/</span>
                      <span className="text-[10px]">3 Verification Logs</span>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="gap-2 pt-2 sm:gap-0">
                <Button
                  variant="outline"
                  onClick={() => setIsViewConsolidatedPackageOpen(false)}
                  className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                >
                  Close
                </Button>
                <Button
                  onClick={() => setIsViewConsolidatedPackageOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" /> Download Full Package
                  (.zip)
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for other Operational Modules */
    if (
      activeModuleId &&
      activeModuleId !== 1 &&
      activeModuleId !== 2 &&
      activeModuleId !== 3 &&
      activeModuleId !== 4 &&
      activeModuleId !== 5 &&
      activeModuleId !== 6 &&
      activeModuleId !== 7 &&
      activeModuleId !== 8
    ) {
      const activeMod = workflowModules[activeModuleId - 1];
      return (
        <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
          <div>
            <button
              type="button"
              onClick={() => handleSelectModule(null)}
              className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Batch Workspace ({selectedBatch.batchCode})</span>
            </button>
          </div>

          <div>
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              {activeMod?.title || `Module ${activeModuleId}`}
            </h1>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {activeMod?.desc ||
                `Workflow process management for Batch ${selectedBatch.batchCode}`}
            </p>
          </div>

          <Card className="bg-card border-border space-y-4 rounded-xl p-6 shadow-xs">
            <div className="flex items-center gap-3">
              {activeMod && <activeMod.icon className="text-primary h-6 w-6" />}
              <div>
                <h3 className="text-foreground text-base font-bold">
                  Module {activeModuleId}: {activeMod?.title}
                </h3>
                <p className="text-muted-foreground text-xs">
                  Active allocation and operational queues for{" "}
                  {selectedBatch.batchCode}
                </p>
              </div>
            </div>
          </Card>
        </div>
      );
    }

    /* Standard Level 3: Batch Workspace Overview Grid */
    return (
      <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
        {/* Navigation Bar */}
        <div className="border-border flex items-center justify-between border-b pb-4">
          <button
            type="button"
            onClick={() => handleSelectBatch(null)}
            className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              Back to Project Control Center (
              {selectedProject.code || "PRJ-001"})
            </span>
          </button>

          <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs font-semibold">
            Batch Control Level
          </Badge>
        </div>

        {/* Top Batch Information Section */}
        <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
          <div className="border-border/60 flex flex-col justify-between gap-3 border-b pb-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                  {selectedBatch.id || selectedBatch.batchCode}
                </span>
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Batch Workspace
                </h1>
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    getBatchStatusBadgeClass(selectedBatch.status),
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      getBatchStatusDotClass(selectedBatch.status),
                    )}
                  ></span>
                  {selectedBatch.status}
                </span>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Project:{" "}
                <strong className="text-foreground">
                  {selectedProject.name}
                </strong>{" "}
                ({selectedProject.code || "PRJ-001"}) &bull; Client:{" "}
                <strong className="text-foreground">
                  {selectedProject.clientName || "BioTech Global Corp"}
                </strong>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-3 lg:grid-cols-7">
            <div>
              <span className="text-muted-foreground block font-medium">
                Batch Name
              </span>
              <span
                className="text-foreground mt-0.5 block truncate text-sm font-semibold"
                title={
                  selectedBatch.batchName ||
                  `${selectedBatch.projectName} - ${selectedBatch.batchCode}`
                }
              >
                {selectedBatch.batchName ||
                  `${selectedBatch.projectName} - ${selectedBatch.batchCode}`}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Type of Record
              </span>
              <span className="text-primary mt-0.5 block text-sm font-semibold">
                {selectedBatch.recordType}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Language
              </span>
              <span className="text-foreground mt-0.5 block text-sm font-semibold">
                {selectedBatch.language}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Source Type
              </span>
              <span className="text-foreground mt-0.5 block text-sm font-semibold">
                {selectedBatch.sourceType || "Images"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Total Source Units
              </span>
              <span className="text-foreground mt-0.5 block text-sm font-bold">
                {selectedBatch.totalSourceUnits ??
                  selectedBatch.totalImages ??
                  500}{" "}
                {selectedBatch.sourceType === "PDF" ? "Pages" : "Units"}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Overall Status
              </span>
              <div className="mt-1">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    getBatchStatusBadgeClass(selectedBatch.status),
                  )}
                >
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      getBatchStatusDotClass(selectedBatch.status),
                    )}
                  ></span>
                  {selectedBatch.status}
                </span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Last Updated
              </span>
              <span className="text-muted-foreground mt-1 block font-mono text-xs">
                {selectedBatch.lastUpdated || "6 Sep 2026 12:10pm"}
              </span>
            </div>
          </div>
        </Card>

        {/* 8 Operational Workflow Modules Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-base font-bold">
              Operational Workflow Modules
            </h2>
            <span className="text-muted-foreground text-xs font-medium">
              8 Configured Modules
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {workflowModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <Card
                  key={mod.step}
                  onClick={() => handleSelectModule(mod.step)}
                  className="bg-card border-border hover:border-primary flex cursor-pointer flex-col justify-between space-y-4 rounded-xl border p-4 transition-all"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full font-mono text-xs font-bold">
                        {mod.step}
                      </span>
                      <Badge className="bg-secondary text-foreground border-border text-[10px] font-semibold">
                        {mod.badge}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Icon className="text-primary h-4 w-4 shrink-0" />
                      <h3 className="text-foreground text-xs leading-tight font-bold">
                        {mod.title}
                      </h3>
                    </div>

                    <p className="text-muted-foreground text-[11px] leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <div className="border-border/60 text-primary flex items-center justify-between border-t pt-2 text-[11px] font-semibold">
                    <span>Open Module</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  /* ========================================================================= */
  /* LEVEL 2: PROJECT CONTROL CENTER (Selected Project View - User Screenshot) */
  /* ========================================================================= */
  if (selectedProject) {
    const totalProjectImages = projectBatches.reduce(
      (acc, b) => acc + (b.totalImages || 0),
      0,
    );
    const totalImagesDisplay =
      totalProjectImages > 0 ? totalProjectImages.toLocaleString() : "1,500";

    return (
      <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
        {/* Navigation Bar: Back to Project Workspace Link */}
        <div>
          <button
            type="button"
            onClick={() => handleSelectProject(null)}
            className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Project Workspace</span>
          </button>
        </div>

        {/* TOP HEADER CARD */}
        <Card className="bg-card border-border flex flex-col justify-between gap-4 rounded-xl p-5 shadow-xs sm:flex-row sm:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                {selectedProject.code || "PRJ-001"}
              </span>
              <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                {selectedProject.name}
              </h1>
            </div>
            <p className="text-muted-foreground pt-0.5 text-xs">
              Client:{" "}
              <span className="text-foreground font-semibold">
                {selectedProject.clientName || "BioTech Global Corp"}
              </span>
              {" · "}
              Project Status:{" "}
              <span className="text-foreground font-bold">
                {selectedProject.projectStatus || "IN_PROGRESS"}
              </span>
            </p>
          </div>

          <Badge className="bg-primary/10 text-primary border-primary/20 self-start rounded-full border px-3 py-1 text-xs font-semibold sm:self-auto">
            Project Control Center
          </Badge>
        </Card>

        {/* SECTION 1: PROJECT VOLUME & CONTROL METRICS */}
        <div className="space-y-3">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <h2 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
              PROJECT VOLUME & CONTROL METRICS
            </h2>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSpecsModal(true)}
              className="border-border hover:bg-secondary cursor-pointer gap-1.5 self-start rounded-lg text-xs font-semibold sm:self-auto"
            >
              Project Profile & Specifications{" "}
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>

          {/* METRICS CARDS GRID (2 Cards) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Card 1: TOTAL BATCHES */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  TOTAL BATCHES
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <FileText className="h-4 w-4" />
                </div>
              </div>

              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  {projectBatches.length > 0 ? projectBatches.length : 3}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Active packages in this project scope
                </span>
              </div>
            </Card>

            {/* Card 2: TOTAL IMAGES */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  TOTAL IMAGES
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <ImageIcon className="h-4 w-4" />
                </div>
              </div>

              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  {totalImagesDisplay}
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Discrete image tiles allocated
                </span>
              </div>
            </Card>
          </div>
        </div>

        {/* SECTION 2: BATCHES */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground text-base font-bold">Batches</h2>
              <p className="text-muted-foreground text-xs">
                Select a batch to enter its dedicated Batch Workspace.
              </p>
            </div>

            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-xs font-semibold">
              {projectBatches.length > 0 ? projectBatches.length : 3} Batches
            </Badge>
          </div>

          {/* BATCH CARDS GRID (3 Cards in a Row) */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {projectBatches.map((b) => {
              const isCompleted = b.status === "COMPLETED";
              const progressVal = isCompleted ? 100 : 70;

              return (
                <Card
                  key={b.id}
                  className="bg-card border-border hover:border-primary/40 flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs transition-all"
                >
                  <div className="space-y-3">
                    {/* Header Row: Batch Code & Status */}
                    <div className="border-border/60 flex items-center justify-between border-b pb-2.5">
                      <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                        {b.batchCode}
                      </span>

                      {isCompleted ? (
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                          COMPLETED
                        </span>
                      ) : (
                        <span className="bg-primary/10 border-primary/30 text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
                          <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
                          IN_PRODUCTION
                        </span>
                      )}
                    </div>

                    {/* Record Type Pill */}
                    <div>
                      <span className="bg-primary/10 text-primary border-primary/20 inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                        {b.recordType}
                      </span>
                    </div>

                    {/* Project Name */}
                    <h3 className="text-foreground text-sm font-bold">
                      {b.projectName}
                    </h3>

                    {/* Metrics Box */}
                    <div className="bg-secondary/50 border-border/60 grid grid-cols-2 gap-3 rounded-lg border p-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[11px] font-medium">
                          Total Images
                        </span>
                        <span className="text-foreground mt-0.5 block text-sm font-bold">
                          {b.totalImages}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px] font-medium">
                          Total Segments
                        </span>
                        <span className="text-foreground mt-0.5 block text-sm font-bold">
                          {b.totalSegments} segs
                        </span>
                      </div>
                    </div>

                    {/* Batch Progress */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground font-medium">
                          Batch Progress
                        </span>
                        <span className="text-foreground font-bold">
                          {progressVal}%
                        </span>
                      </div>
                      <Progress
                        value={progressVal}
                        className={cn(
                          "h-1.5",
                          isCompleted
                            ? "[&>div]:bg-emerald-500"
                            : "[&>div]:bg-primary",
                        )}
                      />
                    </div>
                  </div>

                  {/* Action Button: Open Batch Workspace */}
                  <div className="pt-2">
                    <Button
                      onClick={() => handleSelectBatch(b.id)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full cursor-pointer justify-center gap-1.5 rounded-lg py-2.5 text-xs font-semibold shadow-xs"
                    >
                      Open Batch Workspace{" "}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* PROJECT PROFILE & SPECIFICATIONS DIALOG */}
        <Dialog open={showSpecsModal} onOpenChange={setShowSpecsModal}>
          <DialogContent className="bg-card border-border text-foreground max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between text-base font-bold">
                <span>Project Profile & Specifications</span>
                <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs">
                  {selectedProject.code}
                </Badge>
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Detailed metadata, client contact details, scheduling, and
                system settings.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] space-y-6 overflow-y-auto py-2 text-xs">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="bg-secondary/30 border-border space-y-3 p-4">
                  <div className="border-border flex items-center gap-2 border-b pb-2">
                    <Tag className="text-primary h-4 w-4" />
                    <span className="text-foreground font-bold uppercase">
                      PROJECT INFORMATION
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground block">
                        Project ID
                      </span>
                      <span className="font-mono font-bold">
                        {selectedProject.id}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">
                        Project Name
                      </span>
                      <span className="font-bold">{selectedProject.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">Type</span>
                      <span className="text-primary font-semibold">
                        {selectedProject.projectType || "Data Annotation"}
                      </span>
                    </div>
                  </div>
                </Card>

                <Card className="bg-secondary/30 border-border space-y-3 p-4">
                  <div className="border-border flex items-center gap-2 border-b pb-2">
                    <Building2 className="text-primary h-4 w-4" />
                    <span className="text-foreground font-bold uppercase">
                      CLIENT INFORMATION
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-muted-foreground block">
                        Client Name
                      </span>
                      <span className="font-bold">
                        {selectedProject.clientName || "BioTech Global Corp"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">
                        Primary Email
                      </span>
                      <a
                        href={`mailto:${selectedProject.clientEmail || "biotech.client@biotech-global.com"}`}
                        className="text-primary font-semibold hover:underline"
                      >
                        {selectedProject.clientEmail ||
                          "biotech.client@biotech-global.com"}
                      </a>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowSpecsModal(false)}
                className="text-xs"
              >
                Close Specifications
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={isCreateBatchOpen} onOpenChange={setIsCreateBatchOpen}>
          <DialogContent className="bg-card border-border text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Create New Batch
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Configure dataset batch for {selectedProject.name}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Record Type</Label>
                <Select value={newRecordType} onValueChange={setNewRecordType}>
                  <SelectTrigger className="bg-background border-border text-xs">
                    <SelectValue placeholder="Select Record Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="BIRTH_RECORDS">BIRTH_RECORDS</SelectItem>
                    <SelectItem value="MARRIAGE_RECORDS">
                      MARRIAGE_RECORDS
                    </SelectItem>
                    <SelectItem value="DEATH_RECORDS">DEATH_RECORDS</SelectItem>
                    <SelectItem value="COMMUNICATION_RECORDS">
                      COMMUNICATION_RECORDS
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Language</Label>
                <Select value={newLanguage} onValueChange={setNewLanguage}>
                  <SelectTrigger className="bg-background border-border text-xs">
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="ENGLISH">ENGLISH</SelectItem>
                    <SelectItem value="FRENCH">FRENCH</SelectItem>
                    <SelectItem value="SPANISH">SPANISH</SelectItem>
                    <SelectItem value="GERMAN">GERMAN</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Total Images</Label>
                <Input
                  type="number"
                  value={newTotalImages}
                  onChange={(e) => setNewTotalImages(Number(e.target.value))}
                  className="bg-background border-border text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCreateBatchOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateBatch}
                className="bg-primary text-primary-foreground text-xs"
              >
                Create Batch
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* EDIT PROJECT MODAL */}
        <Dialog open={isEditProjectOpen} onOpenChange={setIsEditProjectOpen}>
          <DialogContent className="bg-card border-border text-foreground max-w-md">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Edit Project Specs
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Update project metadata for {selectedProject.code}.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Project Name</Label>
                <Input
                  value={editProjectName}
                  onChange={(e) => setEditProjectName(e.target.value)}
                  className="bg-background border-border text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs font-semibold">Client Name</Label>
                <Input
                  value={editClientName}
                  onChange={(e) => setEditClientName(e.target.value)}
                  className="bg-background border-border text-xs"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditProjectOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditProjectSave}
                className="bg-primary text-primary-foreground text-xs"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* VIEW IMAGES MODAL */}
        <Dialog open={isViewImagesOpen} onOpenChange={setIsViewImagesOpen}>
          <DialogContent className="bg-card border-border text-foreground max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">
                Batch Images Manifest - {selectedBatchForImages?.batchCode}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Sequential image repository for{" "}
                {selectedBatchForImages?.recordType}.
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[60vh] space-y-4 overflow-y-auto py-2 text-xs">
              <div className="bg-secondary/40 border-border grid grid-cols-3 gap-3 rounded-lg border p-3">
                <div>
                  <span className="text-muted-foreground block">Batch ID</span>
                  <span className="text-foreground font-mono font-bold">
                    {selectedBatchForImages?.batchCode}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">
                    Total Images
                  </span>
                  <span className="text-foreground font-bold">
                    {selectedBatchForImages?.totalImages} images
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedBatchForImages?.status}
                  </span>
                </div>
              </div>

              <table className="border-border w-full overflow-hidden rounded-lg border text-left text-xs">
                <thead className="bg-secondary/40 border-border border-b">
                  <tr>
                    <th className="p-2.5">IMAGE ID</th>
                    <th className="p-2.5">FILE NAME</th>
                    <th className="p-2.5">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y font-mono">
                  {Array.from({ length: 5 }, (_, i) => (
                    <tr key={i}>
                      <td className="text-primary p-2.5 font-bold">
                        IMG-{selectedBatchForImages?.batchCode}-00{i + 1}
                      </td>
                      <td className="p-2.5">scan_document_00{i + 1}.jpg</td>
                      <td className="p-2.5 font-semibold text-emerald-600">
                        VERIFIED
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewImagesOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  /* ========================================================================= */
  /* LEVEL 1: PROJECT WORKSPACE - PROJECTS CARDS OVERVIEW                      */
  /* ========================================================================= */
  return (
    <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
      {/* Top Banner & Header */}
      <div className="border-border flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Project Workspace
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs font-semibold">
              {filteredProjects.length} Projects
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Select an active project to access its dedicated Project Control
            Center and operational modules.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
          <Input
            placeholder="Search Project Workspace..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-border bg-secondary/30 h-8 rounded-lg pl-8 text-xs"
          />
        </div>
      </div>

      {/* Projects Cards Grid */}
      <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((prj) => {
          const prjBatches = batches.filter(
            (b) => b.projectId === prj.id || b.projectName === prj.name,
          );
          const totalMembers = prj.teams
            ? prj.teams.reduce((acc, t) => acc + t.members.length, 0)
            : prj.teamMembers?.length || 4;

          return (
            <Card
              key={prj.id}
              onClick={() => handleSelectProject(prj.id)}
              className="bg-card border-border hover:border-primary group flex h-full cursor-pointer flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs transition-all"
            >
              <div className="flex-1 space-y-4">
                {/* Header Badge & Status */}
                <div className="border-border flex items-center justify-between border-b pb-3">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {prj.code || "PRJ-001"}
                  </span>
                  <Badge className="border border-blue-200 bg-blue-50 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                    {prj.stage || "IN_PROGRESS"}
                  </Badge>
                </div>

                {/* Title & Client */}
                <div>
                  <h3 className="text-foreground group-hover:text-primary text-base leading-tight font-bold transition-colors">
                    {prj.name}
                  </h3>
                  <p className="text-muted-foreground mt-1 text-xs">
                    Client:{" "}
                    <strong className="text-foreground font-semibold">
                      {prj.clientName || "BioTech Global Corp"}
                    </strong>
                  </p>
                </div>

                {/* Metrics Box */}
                <div className="bg-secondary/50 border-border grid grid-cols-2 gap-3 rounded-lg border p-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Total Batches
                    </span>
                    <span className="text-foreground mt-0.5 block text-sm font-bold">
                      {prjBatches.length > 0 ? prjBatches.length : 3} batches
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Team Members
                    </span>
                    <span className="text-foreground mt-0.5 block text-sm font-bold">
                      {totalMembers} members
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-muted-foreground font-medium">
                      Project Progress
                    </span>
                    <span className="text-foreground font-bold">
                      {prj.progress || 45}%
                    </span>
                  </div>
                  <Progress value={prj.progress || 45} className="h-1.5" />
                </div>
              </div>

              {/* Bottom Action Button */}
              <div className="border-border border-t pt-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProject(prj.id);
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground w-full cursor-pointer justify-center gap-1.5 text-xs font-semibold shadow-xs"
                >
                  View Project Control Center{" "}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
