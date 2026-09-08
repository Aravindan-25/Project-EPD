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

export interface WorkspaceBatch {
  id: string;
  batchCode: string;
  projectId: string;
  projectName: string;
  recordType: string;
  language: string;
  totalImages: number;
  totalSegments: number;
  completedSegments: number;
  assignedDate: string;
  dueDate: string;
  status: "COMPLETED" | "CREATED" | "IN_PROGRESS" | "IN_PRODUCTION";
}

const INITIAL_BATCHES: WorkspaceBatch[] = [
  {
    id: "BAT-001",
    batchCode: "BATCH-001",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Birth Records",
    language: "ENGLISH",
    totalImages: 500,
    totalSegments: 10,
    completedSegments: 10,
    assignedDate: "2026-08-05 10:00 AM",
    dueDate: "2026-08-25",
    status: "COMPLETED",
  },
  {
    id: "BAT-002",
    batchCode: "BATCH-002",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Death Records",
    language: "FRENCH",
    totalImages: 500,
    totalSegments: 10,
    completedSegments: 10,
    assignedDate: "2026-08-12 11:30 AM",
    dueDate: "2026-08-30",
    status: "COMPLETED",
  },
  {
    id: "BAT-003",
    batchCode: "BATCH-003",
    projectId: "prj-01",
    projectName: "Alpha Vision Segmentation",
    recordType: "Marriage Records",
    language: "ENGLISH",
    totalImages: 500,
    totalSegments: 10,
    completedSegments: 7,
    assignedDate: "2026-08-20 02:15 PM",
    dueDate: "2026-09-10",
    status: "IN_PRODUCTION",
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
    "eligible" | "allocations" | "history"
  >("eligible");
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
  const [isAllocateQCOpen, setIsAllocateQCOpen] = useState(false);
  const [isReallocateQCOpen, setIsReallocateQCOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSegmentForAlloc, setSelectedSegmentForAlloc] =
    useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSegmentForRealloc, setSelectedSegmentForRealloc] =
    useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSegmentForQCAlloc, setSelectedSegmentForQCAlloc] =
    useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedSegmentForQCRealloc, setSelectedSegmentForQCRealloc] =
    useState<any>(null);
  const [selectedProdEmployee, setSelectedProdEmployee] = useState("EMP-001");
  const [selectedQCEmployee, setSelectedQCEmployee] = useState("EMP-005");
  const [selectedQCSegmentIds, setSelectedQCSegmentIds] = useState<string[]>(
    [],
  );
  const [qcDemoHasData, setQcDemoHasData] = useState(true);
  const [imagesPerSegment, setImagesPerSegment] = useState(20);
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

  const handleCreateBatch = () => {
    if (!selectedProject) return;
    const newBatch: WorkspaceBatch = {
      id: `BAT-${Math.floor(100 + Math.random() * 900)}`,
      batchCode: `BAT-00${projectBatches.length + 1}`,
      projectId: selectedProject.id,
      projectName: selectedProject.name,
      recordType: newRecordType,
      language: newLanguage,
      totalImages: newTotalImages,
      totalSegments: Math.ceil(newTotalImages / 50),
      completedSegments: 0,
      assignedDate: new Date().toLocaleString(),
      dueDate: "2026-09-30",
      status: "CREATED",
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
      title: "Images",
      desc: "Image repository and coordinate layers",
      icon: ImageIcon,
      badge: `${selectedBatch?.totalImages || 500} Images`,
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

    /* Dedicated New Screen for Module 2: Images */
    if (activeModuleId === 2) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockImagesList = Array.from({ length: 11 }, (_, idx) => {
        const num = idx + 1;
        const padNum = num < 10 ? `00${num}` : `0${num}`;
        const sizes = ["2.1 MB", "2.3 MB", "2.5 MB", "2.7 MB", "2.9 MB"];
        return {
          id: `img-${batchCodeLower}-${padNum}`,
          number: `Image ${num}`,
          filename: `scan_document_${padNum}.jpg`,
          type: "image/jpeg",
          size: sizes[idx % sizes.length],
          uploadedAt: "2026-08-20 10:30 AM",
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
                Images
              </h1>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                30 Images in View
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              Batch-specific image repository and verification manifests.
            </p>
          </div>

          {/* Images Table Card */}
          <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3.5">IMAGE ID</th>
                    <th className="p-3.5">IMAGE NUMBER</th>
                    <th className="p-3.5">FILE NAME</th>
                    <th className="p-3.5">FILE TYPE</th>
                    <th className="p-3.5">FILE SIZE</th>
                    <th className="p-3.5">UPLOADED AT</th>
                    <th className="p-3.5 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y font-mono">
                  {mockImagesList.map((img) => (
                    <tr
                      key={img.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="text-foreground p-3.5 font-mono font-bold">
                        {img.id}
                      </td>
                      <td className="p-3.5">
                        <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 font-sans text-[11px] font-semibold">
                          {img.number}
                        </span>
                      </td>
                      <td className="text-foreground p-3.5 font-sans font-bold">
                        <span className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded">
                            <ImageIcon className="h-3.5 w-3.5" />
                          </div>
                          {img.filename}
                        </span>
                      </td>
                      <td className="text-muted-foreground p-3.5">
                        {img.type}
                      </td>
                      <td className="text-muted-foreground p-3.5">
                        {img.size}
                      </td>
                      <td className="text-muted-foreground p-3.5 whitespace-nowrap">
                        {img.uploadedAt}
                      </td>
                      <td className="space-x-2 p-3.5 text-right font-sans whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border h-7 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
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

    /* Dedicated New Screen for Module 3: Segments */
    if (activeModuleId === 3) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockSegmentsList = Array.from({ length: 12 }, (_, idx) => {
        const num = idx + 1;
        const padNum = num < 10 ? `0${num}` : `${num}`;
        const startImg = idx * 20 + 1;
        const endImg = (idx + 1) * 20;
        const padStart =
          startImg < 10
            ? `00${startImg}`
            : startImg < 100
              ? `0${startImg}`
              : `${startImg}`;
        const padEnd =
          endImg < 10
            ? `00${endImg}`
            : endImg < 100
              ? `0${endImg}`
              : `${endImg}`;

        return {
          id: `seg-${batchCodeLower}-${padNum}`,
          number: `Segment ${num}`,
          startImg: `img-${batchCodeLower}-${padStart}`,
          endImg: `img-${batchCodeLower}-${padEnd}`,
          count: "20 images",
          prodStatus: "PENDING",
          qcStatus: "PENDING",
          createdAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
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

          {/* Header Row: Title, Subtitle & Recreate Segment Button */}
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Segments
                </h1>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                  25 Segments
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Granular slice records, image boundaries, and operational
                segment tracking.
              </p>
            </div>

            <Button
              onClick={() => setIsRecreateSegmentOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold sm:self-auto"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Recreate Segment
            </Button>
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border flex items-center gap-6 border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              className="border-primary text-primary flex cursor-pointer items-center gap-2 border-b-2 pb-2 font-bold transition-all"
            >
              <span>Segment Details</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                25
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
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3.5">SEGMENT ID</th>
                    <th className="p-3.5">SEGMENT NUMBER</th>
                    <th className="p-3.5">START IMAGE ID</th>
                    <th className="p-3.5">END IMAGE ID</th>
                    <th className="p-3.5">IMAGE COUNT</th>
                    <th className="p-3.5">PRODUCTION STATUS</th>
                    <th className="p-3.5">QC STATUS</th>
                    <th className="p-3.5">CREATED AT</th>
                    <th className="p-3.5">UPDATED AT</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y font-mono">
                  {mockSegmentsList.map((seg) => (
                    <tr
                      key={seg.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      <td className="text-foreground p-3.5 font-mono font-bold">
                        {seg.id}
                      </td>
                      <td className="text-foreground p-3.5 font-sans font-medium">
                        {seg.number}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        {seg.startImg}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        {seg.endImg}
                      </td>
                      <td className="text-foreground p-3.5 font-sans font-bold">
                        {seg.count}
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="bg-secondary border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px] font-bold">
                          {seg.prodStatus}
                        </span>
                      </td>
                      <td className="p-3.5 font-sans">
                        <span className="bg-secondary border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px] font-bold">
                          {seg.qcStatus}
                        </span>
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                        {seg.createdAt}
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                        {seg.updatedAt}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* RECREATE SEGMENTS DIALOG MODAL */}
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
                    Recreate Segments
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Divide batch images into discrete operational segments using
                  image count division logic.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5 py-3 text-xs">
                {/* Field 1: Total Images in Batch */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Total Images in Batch
                    </Label>
                    <span className="text-muted-foreground text-[11px] font-medium">
                      Auto-populated
                    </span>
                  </div>
                  <div className="relative">
                    <ImageIcon className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                    <Input
                      readOnly
                      value={selectedBatch?.totalImages || 500}
                      className="bg-secondary/30 border-border text-foreground h-9 rounded-lg pl-9 font-mono text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Field 2: Image Count per Segment */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Image Count per Segment
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
                      {Math.ceil(
                        (selectedBatch?.totalImages || 500) /
                          (imagesPerSegment || 20),
                      )}{" "}
                      Total Segments
                    </Badge>
                  </div>

                  <div className="border-primary/10 grid grid-cols-2 gap-4 border-t pt-1 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">
                        Standard Segments:
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-xs font-bold">
                        {Math.ceil(
                          (selectedBatch?.totalImages || 500) /
                            (imagesPerSegment || 20),
                        )}{" "}
                        segs &times; {imagesPerSegment || 20} imgs
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[11px] font-medium">
                        Final Segment:
                      </span>
                      <span className="text-foreground mt-0.5 block font-mono text-xs font-bold">
                        {(selectedBatch?.totalImages || 500) %
                          (imagesPerSegment || 20) ===
                        0
                          ? `${imagesPerSegment || 20} images (exact)`
                          : `${(selectedBatch?.totalImages || 500) % (imagesPerSegment || 20)} images (partial)`}
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
                  onClick={() => setIsRecreateSegmentOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Confirm & Recreate
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      );
    }

    /* Dedicated New Screen for Module 4: Production Allocation */
    if (activeModuleId === 4) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockUnassignedList = Array.from({ length: 10 }, (_, idx) => {
        const num = idx + 2;
        const padNum = num < 10 ? `0${num}` : `${num}`;
        const startImg = (idx + 1) * 20 + 1;
        const endImg = (idx + 2) * 20;
        const padStart =
          startImg < 10
            ? `00${startImg}`
            : startImg < 100
              ? `0${startImg}`
              : `${startImg}`;
        const padEnd =
          endImg < 10
            ? `00${endImg}`
            : endImg < 100
              ? `0${endImg}`
              : `${endImg}`;

        return {
          id: `seg-${batchCodeLower}-${padNum}`,
          number: `Segment ${num}`,
          startImg: `img-${batchCodeLower}-${padStart}`,
          endImg: `img-${batchCodeLower}-${padEnd}`,
          count: "20 images",
          createdAt: "6 Sep 2026 12:10pm",
          prodStatus: "PENDING",
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

          {/* Header Row: Title & Subtitle */}
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
              Manage and assign batch segments to eligible production employees.
            </p>
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
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                24
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
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                1
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
            </button>
          </div>

          {/* SUB-TAB 1: UNASSIGNED SEGMENTS */}
          {prodAllocTab === "unassigned" && (
            <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5">SEGMENT NUMBER</th>
                      <th className="p-3.5">IMAGE START ID</th>
                      <th className="p-3.5">IMAGE END ID</th>
                      <th className="p-3.5">IMAGE COUNT</th>
                      <th className="p-3.5">SEGMENT CREATED AT</th>
                      <th className="p-3.5">PRODUCTION STATUS</th>
                      <th className="p-3.5 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y font-mono">
                    {mockUnassignedList.map((seg) => (
                      <tr
                        key={seg.id}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="text-foreground p-3.5 font-mono font-bold">
                          {seg.id}
                        </td>
                        <td className="text-foreground p-3.5 font-sans font-medium">
                          {seg.number}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono">
                          {seg.startImg}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono">
                          {seg.endImg}
                        </td>
                        <td className="text-foreground p-3.5 font-sans font-bold">
                          {seg.count}
                        </td>
                        <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                          {seg.createdAt}
                        </td>
                        <td className="p-3.5 font-sans">
                          <span className="bg-secondary border-border text-muted-foreground rounded-full border px-2.5 py-0.5 text-[10px] font-bold">
                            {seg.prodStatus}
                          </span>
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
                    ))}
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
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5">SEGMENT NUMBER</th>
                      <th className="p-3.5">IMAGE START ID</th>
                      <th className="p-3.5">IMAGE END ID</th>
                      <th className="p-3.5">IMAGE COUNT</th>
                      <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                      <th className="p-3.5">STATUS</th>
                      <th className="p-3.5">PRODUCTION ALLOCATED AT</th>
                      <th className="p-3.5 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    <tr className="hover:bg-secondary/20 transition-colors">
                      <td className="text-foreground p-3.5 font-mono font-bold">
                        seg-{selectedBatch.batchCode.toLowerCase()}-01
                      </td>
                      <td className="text-foreground p-3.5 font-medium">
                        Segment 1
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        img-{selectedBatch.batchCode.toLowerCase()}-001
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono">
                        img-{selectedBatch.batchCode.toLowerCase()}-020
                      </td>
                      <td className="text-foreground p-3.5 font-bold">
                        20 images
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 text-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold">
                            M
                          </div>
                          <div>
                            <span className="text-foreground block leading-tight font-bold">
                              Mathan Kumar
                            </span>
                            <span className="text-muted-foreground block font-mono text-[10px]">
                              EMP-001
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="bg-primary/10 border-primary/20 text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-bold">
                          <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
                          Allocated
                        </span>
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                        Sep 01, 2026 09:30 AM
                      </td>
                      <td className="space-x-2 p-3.5 text-right whitespace-nowrap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-border h-7 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold"
                        >
                          <Eye className="h-3.5 w-3.5" /> View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedSegmentForRealloc({
                              id: `seg-${selectedBatch.batchCode.toLowerCase()}-01`,
                              number: "Segment 1",
                              startImg: `img-${selectedBatch.batchCode.toLowerCase()}-001`,
                              endImg: `img-${selectedBatch.batchCode.toLowerCase()}-020`,
                              count: "20 images",
                            });
                            setIsReallocateOpen(true);
                          }}
                          className="text-primary hover:bg-primary/10 h-7 cursor-pointer gap-1 text-xs font-semibold"
                        >
                          <RefreshCw className="h-3.5 w-3.5" /> Reallocate
                        </Button>
                      </td>
                    </tr>
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
                    <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                      <th className="p-3.5">ACTIVITY</th>
                      <th className="p-3.5">SEGMENT ID</th>
                      <th className="p-3.5">DETAILS</th>
                      <th className="p-3.5">ALLOCATED BY</th>
                      <th className="p-3.5 whitespace-nowrap">DATE & TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-border/60 divide-y">
                    <tr className="hover:bg-secondary/20 transition-colors">
                      <td className="text-primary p-3.5 font-mono font-bold">
                        INITIAL_ALLOCATION
                      </td>
                      <td className="text-foreground p-3.5 font-mono font-bold">
                        seg-{selectedBatch.batchCode.toLowerCase()}-01
                      </td>
                      <td className="text-foreground p-3.5 font-medium">
                        Allocated segment #1 to Mathan Kumar (EMP-001).
                      </td>
                      <td className="text-foreground p-3.5 font-semibold">
                        Vikram Malhotra
                      </td>
                      <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                        Sep 01, 2026 09:30 AM
                      </td>
                    </tr>
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
                    {selectedSegmentForAlloc?.id || "seg-batch-001-02"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Allocate Production
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Assign the selected segment to an active and
                  production-eligible operator.
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
                        <span className="text-primary mt-0.5 block font-mono text-xs font-bold">
                          {selectedSegmentForAlloc?.id || "seg-batch-001-02"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Segment No
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          #
                          {selectedSegmentForAlloc?.number?.replace(
                            "Segment ",
                            "",
                          ) || "2"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Start Image ID
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForAlloc?.startImg ||
                            "img-batch-001-021"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          End Image ID
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForAlloc?.endImg ||
                            "img-batch-001-040"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Image Count
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          {selectedSegmentForAlloc?.count || "20 images"}
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
                          Mathan Kumar (EMP-001) &mdash; Data Processing
                        </SelectItem>
                        <SelectItem value="EMP-002">
                          Anitha Roy (EMP-002) &mdash; Data Processing
                        </SelectItem>
                        <SelectItem value="EMP-003">
                          Priya Sharma (EMP-003) &mdash; Annotation Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* EMPLOYEE PREVIEW CARD */}
                  <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-mono text-xs font-bold">
                          EMP-001
                        </span>
                        <span className="text-foreground text-sm font-bold">
                          Mathan Kumar
                        </span>
                      </div>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        Department:{" "}
                        <strong className="text-foreground font-semibold">
                          Data Processing
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> Production Eligible
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <Check className="h-3 w-3" /> QC Eligible
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
                  onClick={() => setIsAllocateProductionOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" /> Assign Production
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* REALLOCATE PRODUCTION DIALOG MODAL */}
          <Dialog open={isReallocateOpen} onOpenChange={setIsReallocateOpen}>
            <DialogContent className="bg-card border-border text-foreground max-w-2xl rounded-2xl p-6 sm:max-w-3xl">
              <DialogHeader className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {selectedSegmentForRealloc?.id || "seg-batch-001-01"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Reallocate Production
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Reassign this active segment to a new production-eligible
                  operator.
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
                        <span className="text-primary mt-0.5 block font-mono text-xs font-bold">
                          {selectedSegmentForRealloc?.id || "seg-batch-001-01"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Segment No
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          #
                          {selectedSegmentForRealloc?.number?.replace(
                            "Segment ",
                            "",
                          ) || "1"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Start Image ID
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForRealloc?.startImg ||
                            "img-batch-001-001"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          End Image ID
                        </span>
                        <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                          {selectedSegmentForRealloc?.endImg ||
                            "img-batch-001-020"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[11px]">
                          Image Count
                        </span>
                        <span className="text-foreground mt-0.5 block text-xs font-bold">
                          {selectedSegmentForRealloc?.count || "20 images"}
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* SECTION 2: EMPLOYEE REALLOCATION */}
                <div className="space-y-3">
                  <h3 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                    EMPLOYEE REALLOCATION
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
                        <SelectItem value="EMP-001">
                          Mathan Kumar (EMP-001) &mdash; Data Processing
                        </SelectItem>
                        <SelectItem value="EMP-002">
                          Anitha Roy (EMP-002) &mdash; Data Processing
                        </SelectItem>
                        <SelectItem value="EMP-003">
                          Priya Sharma (EMP-003) &mdash; Annotation Team
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* EMPLOYEE PREVIEW CARD */}
                  <Card className="bg-primary/5 border-primary/20 flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-mono text-xs font-bold">
                          EMP-002
                        </span>
                        <span className="text-foreground text-sm font-bold">
                          Anitha Roy
                        </span>
                      </div>
                      <span className="text-muted-foreground mt-0.5 block text-xs">
                        Department:{" "}
                        <strong className="text-foreground font-semibold">
                          Data Processing
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <Check className="h-3 w-3" /> Production Eligible
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                        <Check className="h-3 w-3" /> QC Eligible
                      </span>
                    </div>
                  </Card>
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
        </div>
      );
    }

    /* Dedicated New Screen for Module 5: Production Tracking & Output */
    if (activeModuleId === 5) {
      const batchCodeLower = selectedBatch.batchCode.toLowerCase();
      const mockTrackingList = [
        {
          id: `seg-${batchCodeLower}-01`,
          number: "Segment 1",
          startImg: `img-${batchCodeLower}-001`,
          endImg: `img-${batchCodeLower}-020`,
          count: "20 Images",
          empName: "Mathan Kumar",
          empId: "EMP-001",
          avatar: "M",
          progress: "20/20",
          totalRecords: "500",
          status: "Completed",
          allocatedAt: "6 Sep 2026 10:30am",
          startAt: "6 Sep 2026 10:35am",
          fileName: `SEG-${selectedBatch.batchCode}-01_product...`,
          completedAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
        },
        {
          id: `seg-${batchCodeLower}-02`,
          number: "Segment 2",
          startImg: `img-${batchCodeLower}-021`,
          endImg: `img-${batchCodeLower}-040`,
          count: "20 Images",
          empName: "Ananya Sharma",
          empId: "EMP-1002",
          avatar: "A",
          progress: "20/20",
          totalRecords: "500",
          status: "Completed",
          allocatedAt: "6 Sep 2026 10:30am",
          startAt: "6 Sep 2026 10:35am",
          fileName: `SEG-${selectedBatch.batchCode}-02_product...`,
          completedAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
        },
        {
          id: `seg-${batchCodeLower}-03`,
          number: "Segment 3",
          startImg: `img-${batchCodeLower}-041`,
          endImg: `img-${batchCodeLower}-060`,
          count: "20 Images",
          empName: "John Doe",
          empId: "EMP-1003",
          avatar: "J",
          progress: "10/20",
          totalRecords: "500",
          status: "In Progress",
          allocatedAt: "6 Sep 2026 10:30am",
          startAt: "6 Sep 2026 10:35am",
          fileName: `SEG-${selectedBatch.batchCode}-03_product...`,
          completedAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
        },
        {
          id: `seg-${batchCodeLower}-04`,
          number: "Segment 4",
          startImg: `img-${batchCodeLower}-061`,
          endImg: `img-${batchCodeLower}-080`,
          count: "20 Images",
          empName: "Ananya Sharma",
          empId: "EMP-1004",
          avatar: "A",
          progress: "10/20",
          totalRecords: "500",
          status: "In Progress",
          allocatedAt: "6 Sep 2026 10:30am",
          startAt: "6 Sep 2026 10:35am",
          fileName: `SEG-${selectedBatch.batchCode}-04_product...`,
          completedAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
        },
        {
          id: `seg-${batchCodeLower}-05`,
          number: "Segment 5",
          startImg: `img-${batchCodeLower}-081`,
          endImg: `img-${batchCodeLower}-100`,
          count: "20 Images",
          empName: "John Doe",
          empId: "EMP-1005",
          avatar: "J",
          progress: "10/20",
          totalRecords: "500",
          status: "In Progress",
          allocatedAt: "6 Sep 2026 10:30am",
          startAt: "6 Sep 2026 10:35am",
          fileName: `SEG-${selectedBatch.batchCode}-05_product...`,
          completedAt: "6 Sep 2026 10:30am",
          updatedAt: "6 Sep 2026 10:30am",
        },
      ];

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
              Real-time operator throughput speeds, elapsed production hours,
              and verified production output packages.
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
                  25
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Employees active on this batch
                </span>
              </div>
            </Card>

            {/* Card 2: PROCESSED IMAGES */}
            <Card className="bg-card border-border flex flex-col justify-between space-y-4 rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                  PROCESSED IMAGES
                </span>
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-lg">
                  <Activity className="h-4 w-4" />
                </div>
              </div>
              <div>
                <span className="text-foreground block text-3xl font-extrabold tracking-tight">
                  270 / 500
                </span>
                <span className="mt-1 flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  <span>↗ 54%</span> completed
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
                  2
                </span>
                <span className="text-muted-foreground mt-1 block text-xs font-medium">
                  Out of 25 segments
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
              <span>Production Tracking List</span>
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                25
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
              <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-[11px]">
                25
              </span>
            </button>
          </div>

          {/* SUB-TAB 1: PRODUCTION TRACKING LIST */}
          {prodTrackingTab === "tracking" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    PRODUCTION TRACKING LIST
                  </h2>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Total Images progress displayed as Processed Images / Total
                    Images (e.g. 10/20).
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                  25 Segments
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5">SEGMENT NUMBER</th>
                        <th className="p-3.5">IMAGE START ID</th>
                        <th className="p-3.5">IMAGE END ID</th>
                        <th className="p-3.5">IMAGE COUNT</th>
                        <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                        <th className="p-3.5">IMAGE PROGRESS</th>
                        <th className="p-3.5">TOTAL RECORDS</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 whitespace-nowrap">
                          PRODUCTION ALLOCATED AT
                        </th>
                        <th className="p-3.5 whitespace-nowrap">
                          PRODUCTION START AT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y font-mono">
                      {mockTrackingList.map((item) => {
                        const isDone = item.status === "Completed";
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="text-foreground p-3.5 font-mono font-bold">
                              {item.id}
                            </td>
                            <td className="text-foreground p-3.5 font-sans font-medium">
                              {item.number}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.startImg}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {item.endImg}
                            </td>
                            <td className="text-foreground p-3.5 font-sans font-bold">
                              {item.count}
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
                            <td className="p-3.5 font-sans">
                              <span
                                className={cn(
                                  "rounded-full border px-2.5 py-0.5 text-xs font-bold",
                                  isDone
                                    ? "bg-primary/10 text-primary border-primary/20"
                                    : "border-purple-200 bg-purple-50 text-purple-600 dark:bg-purple-950/40",
                                )}
                              >
                                {item.progress}
                              </span>
                            </td>
                            <td className="text-foreground p-3.5 font-mono font-bold">
                              {item.totalRecords}
                            </td>
                            <td className="p-3.5 font-sans">
                              {isDone ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                  Completed
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                                  In Progress
                                </span>
                              )}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {item.allocatedAt}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {item.startAt}
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
                    Verified digital production packages with upload timestamps
                    in 12-hour format.
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
                  25 Files
                </Badge>
              </div>

              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                        <th className="p-3.5">SEGMENT ID</th>
                        <th className="p-3.5">SEGMENT NUMBER</th>
                        <th className="p-3.5">IMAGE START ID</th>
                        <th className="p-3.5">IMAGE END ID</th>
                        <th className="p-3.5">IMAGE COUNT</th>
                        <th className="p-3.5">PRODUCTION EMPLOYEE</th>
                        <th className="p-3.5">TOTAL RECORDS</th>
                        <th className="p-3.5">PRODUCTION FILE</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 whitespace-nowrap">
                          PRODUCTION COMPLETED AT
                        </th>
                        <th className="p-3.5 whitespace-nowrap">
                          PRODUCTION UPDATED AT
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y font-mono">
                      {mockTrackingList.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-secondary/20 transition-colors"
                        >
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {item.id}
                          </td>
                          <td className="text-foreground p-3.5 font-sans font-medium">
                            {item.number}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.startImg}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {item.endImg}
                          </td>
                          <td className="text-foreground p-3.5 font-sans font-bold">
                            {item.count}
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
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {item.totalRecords}
                          </td>
                          <td className="text-foreground p-3.5 font-mono font-bold uppercase">
                            {item.fileName}
                          </td>
                          <td className="p-3.5 font-sans">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              Completed
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.completedAt}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.updatedAt}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
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
          startImg: `img-${batchCodeLower}-001`,
          endImg: `img-${batchCodeLower}-020`,
          count: "20 images",
          operator: "Mathan Kumar",
          operatorId: "EMP-001",
          completedAt: "6 Sep 2026 10:30am",
          accuracy: "99.4%",
          status: "Awaiting QC",
        },
        {
          id: `seg-${batchCodeLower}-02`,
          number: "Segment 2",
          startImg: `img-${batchCodeLower}-021`,
          endImg: `img-${batchCodeLower}-040`,
          count: "20 images",
          operator: "Ananya Sharma",
          operatorId: "EMP-002",
          completedAt: "6 Sep 2026 10:45am",
          accuracy: "98.8%",
          status: "Awaiting QC",
        },
        {
          id: `seg-${batchCodeLower}-03`,
          number: "Segment 3",
          startImg: `img-${batchCodeLower}-041`,
          endImg: `img-${batchCodeLower}-060`,
          count: "20 images",
          operator: "Rajesh V",
          operatorId: "EMP-003",
          completedAt: "6 Sep 2026 11:15am",
          accuracy: "100%",
          status: "Awaiting QC",
        },
        {
          id: `seg-${batchCodeLower}-04`,
          number: "Segment 4",
          startImg: `img-${batchCodeLower}-061`,
          endImg: `img-${batchCodeLower}-080`,
          count: "20 images",
          operator: "Suresh Prabhu",
          operatorId: "EMP-004",
          completedAt: "6 Sep 2026 11:40am",
          accuracy: "99.1%",
          status: "Awaiting QC",
        },
        {
          id: `seg-${batchCodeLower}-05`,
          number: "Segment 5",
          startImg: `img-${batchCodeLower}-081`,
          endImg: `img-${batchCodeLower}-100`,
          count: "20 images",
          operator: "Deepa Nair",
          operatorId: "EMP-008",
          completedAt: "6 Sep 2026 12:05pm",
          accuracy: "99.7%",
          status: "Awaiting QC",
        },
      ];

      const mockQCAllocations = [
        {
          id: `seg-${batchCodeLower}-06`,
          number: "Segment 6",
          startImg: `img-${batchCodeLower}-101`,
          endImg: `img-${batchCodeLower}-120`,
          count: "20 images",
          qcSpecialist: "Anitha Roy",
          qcEmpId: "EMP-005",
          allocatedAt: "6 Sep 2026 11:30am",
          dueDate: "6 Sep 2026 04:00pm",
          status: "In QC Review",
        },
        {
          id: `seg-${batchCodeLower}-07`,
          number: "Segment 7",
          startImg: `img-${batchCodeLower}-121`,
          endImg: `img-${batchCodeLower}-140`,
          count: "20 images",
          qcSpecialist: "Priya Sharma",
          qcEmpId: "EMP-006",
          allocatedAt: "6 Sep 2026 11:45am",
          dueDate: "6 Sep 2026 04:30pm",
          status: "In QC Review",
        },
        {
          id: `seg-${batchCodeLower}-08`,
          number: "Segment 8",
          startImg: `img-${batchCodeLower}-141`,
          endImg: `img-${batchCodeLower}-160`,
          count: "20 images",
          qcSpecialist: "Vikram Seth",
          qcEmpId: "EMP-007",
          allocatedAt: "6 Sep 2026 12:00pm",
          dueDate: "6 Sep 2026 05:00pm",
          status: "Pending Start",
        },
      ];

      const mockQCHistory = [
        {
          id: `log-qc-01`,
          segmentId: `seg-${batchCodeLower}-01`,
          qcSpecialist: "Anitha Roy",
          qcEmpId: "EMP-005",
          allocatedBy: "Lead QC Supervisor",
          eventType: "INITIAL_ALLOCATION",
          allocatedAt: "6 Sep 2026 11:00am",
          status: "Assigned",
        },
        {
          id: `log-qc-02`,
          segmentId: `seg-${batchCodeLower}-02`,
          qcSpecialist: "Priya Sharma",
          qcEmpId: "EMP-006",
          allocatedBy: "System Auto-Assign",
          eventType: "REALLOCATION",
          allocatedAt: "6 Sep 2026 10:15am",
          status: "Reallocated",
        },
        {
          id: `log-qc-03`,
          segmentId: `seg-${batchCodeLower}-03`,
          qcSpecialist: "Vikram Seth",
          qcEmpId: "EMP-007",
          allocatedBy: "Lead QC Supervisor",
          eventType: "INITIAL_ALLOCATION",
          allocatedAt: "6 Sep 2026 09:45am",
          status: "Completed",
        },
        {
          id: `log-qc-04`,
          segmentId: `seg-${batchCodeLower}-04`,
          qcSpecialist: "Anitha Roy",
          qcEmpId: "EMP-005",
          allocatedBy: "System Auto-Assign",
          eventType: "INITIAL_ALLOCATION",
          allocatedAt: "6 Sep 2026 09:30am",
          status: "Completed",
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
                Assign production-completed batch segments to certified QC
                specialists.
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
                ? "View Empty State (Screenshot View)"
                : "Simulate Completed Segments"}
            </Button>
          </div>

          {/* Sub-Tabs Row */}
          <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setQcAllocTab("eligible")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
                qcAllocTab === "eligible"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>QC Eligible Segments</span>
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

          {/* Sub-Header: Allocation Mode Row */}
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
                ? "Allocate individual segments row-by-row"
                : "Allocate multiple segments in batches"}
            </div>
          </div>

          {/* TAB 1: QC ELIGIBLE SEGMENTS */}
          {qcAllocTab === "eligible" && (
            <div className="space-y-4">
              {eligibleList.length === 0 ? (
                /* Empty state matching the exact UI in user screenshot */
                <Card className="bg-card/40 border-border/80 flex min-h-[300px] flex-col items-center justify-center space-y-2 rounded-xl border p-12 text-center shadow-xs">
                  <p className="text-foreground text-sm font-semibold">
                    No production-completed segments currently awaiting QC
                    allocation.
                  </p>
                  <p className="text-muted-foreground max-w-md text-xs">
                    Segments appear here immediately as operators complete
                    Production.
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
                        className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold"
                      >
                        <UserPlus className="h-3.5 w-3.5" /> Allocate Selected
                        Segments
                      </Button>
                    </div>
                  )}

                  {/* Table View */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
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
                          <th className="p-3.5">Segment No & ID</th>
                          <th className="p-3.5">Image Range</th>
                          <th className="p-3.5">Count</th>
                          <th className="p-3.5">Production Operator</th>
                          <th className="p-3.5">Completed At</th>
                          <th className="p-3.5">Prod Score</th>
                          <th className="p-3.5 text-right">Action</th>
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
                              <td className="p-3.5 font-medium">
                                <div className="flex flex-col">
                                  <span className="text-foreground text-sm font-bold">
                                    {seg.number}
                                  </span>
                                  <span className="text-primary font-mono text-[11px]">
                                    {seg.id}
                                  </span>
                                </div>
                              </td>
                              <td className="text-muted-foreground p-3.5 font-mono">
                                {seg.startImg} &rarr; {seg.endImg}
                              </td>
                              <td className="text-foreground p-3.5 font-semibold">
                                {seg.count}
                              </td>
                              <td className="p-3.5">
                                <div className="flex items-center gap-2">
                                  <div className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold">
                                    {seg.operator[0]}
                                  </div>
                                  <div>
                                    <span className="text-foreground block font-semibold">
                                      {seg.operator}
                                    </span>
                                    <span className="text-muted-foreground font-mono text-[10px]">
                                      {seg.operatorId}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="text-muted-foreground p-3.5 whitespace-nowrap">
                                {seg.completedAt}
                              </td>
                              <td className="p-3.5">
                                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[11px] font-bold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                                  {seg.accuracy}
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
                                  QC
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
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
                      <tr>
                        <th className="p-3.5">Segment</th>
                        <th className="p-3.5">QC Specialist</th>
                        <th className="p-3.5">Allocated At</th>
                        <th className="p-3.5">Target Completion</th>
                        <th className="p-3.5">QC Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {allocationsList.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="p-3.5 font-medium">
                            <div className="flex flex-col">
                              <span className="text-foreground font-bold">
                                {item.number}
                              </span>
                              <span className="text-primary font-mono text-[11px]">
                                {item.id}
                              </span>
                            </div>
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
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.allocatedAt}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {item.dueDate}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                              <Clock className="h-3 w-3" /> {item.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedSegmentForQCRealloc(item);
                                setIsReallocateQCOpen(true);
                              }}
                              className="border-border hover:bg-secondary h-8 cursor-pointer gap-1.5 rounded-lg px-3 text-xs font-semibold"
                            >
                              <RefreshCw className="h-3.5 w-3.5" /> Reallocate
                              QC
                            </Button>
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
                    Log entries will automatically record when QC specialists
                    are assigned or reallocated.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
                      <tr>
                        <th className="p-3.5">Segment ID</th>
                        <th className="p-3.5">Event Type</th>
                        <th className="p-3.5">QC Specialist</th>
                        <th className="p-3.5">Allocated By</th>
                        <th className="p-3.5">Timestamp</th>
                        <th className="p-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border divide-y">
                      {historyList.map((log) => (
                        <tr
                          key={log.id}
                          className="hover:bg-secondary/30 transition-colors"
                        >
                          <td className="text-primary p-3.5 font-mono font-semibold">
                            {log.segmentId}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-secondary border-border rounded-md border px-2 py-0.5 font-mono text-[11px] font-bold">
                              {log.eventType}
                            </span>
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {log.qcSpecialist} ({log.qcEmpId})
                          </td>
                          <td className="text-muted-foreground p-3.5">
                            {log.allocatedBy}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {log.allocatedAt}
                          </td>
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> {log.status}
                            </span>
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
                    {selectedSegmentForQCAlloc?.id || "seg-batch-010-01"}
                  </span>
                  <DialogTitle className="text-foreground text-lg font-bold">
                    Allocate QC Specialist
                  </DialogTitle>
                </div>
                <DialogDescription className="text-muted-foreground text-xs">
                  Assign production-completed segment to a certified QC
                  specialist for quality verification.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <Card className="bg-secondary/30 border-border space-y-2 rounded-xl border p-3.5">
                  <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    Target Segment
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Segment
                      </span>
                      <span className="text-foreground font-bold">
                        {selectedSegmentForQCAlloc?.number || "Segment 1"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Images
                      </span>
                      <span className="text-foreground font-mono">
                        {selectedSegmentForQCAlloc?.count || "20 images"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">
                        Prod Operator
                      </span>
                      <span className="text-foreground font-semibold">
                        {selectedSegmentForQCAlloc?.operator || "Mathan Kumar"}
                      </span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Select Certified QC Specialist{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedQCEmployee}
                    onValueChange={setSelectedQCEmployee}
                  >
                    <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                      <SelectValue placeholder="Select QC Specialist" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="EMP-005">
                        Anitha Roy (EMP-005) &mdash; QC Lead Certified
                      </SelectItem>
                      <SelectItem value="EMP-006">
                        Priya Sharma (EMP-006) &mdash; Senior QC Auditor
                      </SelectItem>
                      <SelectItem value="EMP-007">
                        Vikram Seth (EMP-007) &mdash; QC Specialist
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Card className="bg-primary/5 border-primary/20 flex items-center justify-between rounded-xl border p-3.5">
                  <div>
                    <span className="text-primary font-mono text-xs font-bold">
                      EMP-005
                    </span>
                    <span className="text-foreground block text-xs font-bold">
                      Anitha Roy
                    </span>
                    <span className="text-muted-foreground text-[11px]">
                      Lead Quality Assurance
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <ShieldCheck className="h-3 w-3" /> QC Certified
                  </span>
                </Card>
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

          {/* REALLOCATE QC SPECIALIST DIALOG */}
          <Dialog
            open={isReallocateQCOpen}
            onOpenChange={setIsReallocateQCOpen}
          >
            <DialogContent className="bg-card border-border sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-foreground text-lg font-bold">
                  Reallocate QC Specialist
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Reassign segment to a different certified QC specialist.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-2 text-xs">
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Select Replacement QC Specialist
                  </Label>
                  <Select
                    value={selectedQCEmployee}
                    onValueChange={setSelectedQCEmployee}
                  >
                    <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                      <SelectValue placeholder="Select Replacement QC" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border text-xs">
                      <SelectItem value="EMP-006">
                        Priya Sharma (EMP-006) &mdash; Senior QC Auditor
                      </SelectItem>
                      <SelectItem value="EMP-007">
                        Vikram Seth (EMP-007) &mdash; QC Specialist
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
                  onClick={() => setIsReallocateQCOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Confirm Reallocation
                </Button>
              </DialogFooter>
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
          startImg: `img-${batchCodeLower}-001`,
          endImg: `img-${batchCodeLower}-020`,
          count: "20 images",
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
          startImg: `img-${batchCodeLower}-021`,
          endImg: `img-${batchCodeLower}-040`,
          count: "20 images",
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
          startImg: `img-${batchCodeLower}-041`,
          endImg: `img-${batchCodeLower}-060`,
          count: "20 images",
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
          startImg: `img-${batchCodeLower}-061`,
          endImg: `img-${batchCodeLower}-080`,
          count: "20 images",
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
          startImg: `img-${batchCodeLower}-081`,
          endImg: `img-${batchCodeLower}-100`,
          count: "20 images",
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
          packageName: `QC-RELEASE-${selectedBatch.batchCode}-PKG01`,
          segmentCount: "3 Segments",
          imageCount: "60 Images",
          passRate: "99.2%",
          approvedBy: "Lead QC Supervisor",
          releasedAt: "6 Sep 2026 01:30pm",
          status: "READY_FOR_CONSOLIDATION",
        },
        {
          id: `pkg-${batchCodeLower}-02`,
          packageName: `QC-RELEASE-${selectedBatch.batchCode}-PKG02`,
          segmentCount: "2 Segments",
          imageCount: "40 Images",
          passRate: "99.8%",
          approvedBy: "Lead QC Supervisor",
          releasedAt: "6 Sep 2026 02:30pm",
          status: "READY_FOR_CONSOLIDATION",
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
                ? "View Empty State (Screenshot View)"
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
                /* Empty state container matching exact screenshot UI */
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
                      <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
                        <tr>
                          <th className="p-3.5">Segment</th>
                          <th className="p-3.5">QC Specialist</th>
                          <th className="p-3.5">Image Range</th>
                          <th className="p-3.5">Accuracy Rate</th>
                          <th className="p-3.5">Defects</th>
                          <th className="p-3.5">Verification Status</th>
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
                            <td className="p-3.5 font-medium">
                              <div className="flex flex-col">
                                <span className="text-foreground font-bold">
                                  {item.number}
                                </span>
                                <span className="text-primary font-mono text-[11px]">
                                  {item.id}
                                </span>
                              </div>
                            </td>
                            <td className="text-foreground p-3.5 font-semibold">
                              {item.qcSpecialist} ({item.qcEmpId})
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {item.startImg} &rarr; {item.endImg}
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
                                  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
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
                    <thead className="bg-secondary/50 text-muted-foreground border-border border-b text-[11px] font-bold uppercase">
                      <tr>
                        <th className="p-3.5">Package ID</th>
                        <th className="p-3.5">Segments</th>
                        <th className="p-3.5">Images</th>
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
                            {pkg.packageName}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {pkg.segmentCount}
                          </td>
                          <td className="text-foreground p-3.5 font-semibold">
                            {pkg.imageCount}
                          </td>
                          <td className="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                            {pkg.passRate}
                          </td>
                          <td className="text-muted-foreground p-3.5">
                            {pkg.approvedBy}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                            {pkg.releasedAt}
                          </td>
                          <td className="p-3.5 text-right">
                            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                              <CheckCircle2 className="h-3 w-3" /> Ready for
                              Consolidation
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          )}
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

        {/* Header Title Card */}
        <Card className="bg-card border-border space-y-3 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                  {selectedBatch.batchCode}
                </span>
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  Batch Workspace
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
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
        </Card>

        {/* Selected Batch Summary Card */}
        <Card className="bg-card border-border rounded-xl p-5 shadow-xs">
          <div className="grid grid-cols-2 gap-4 text-xs sm:grid-cols-5">
            <div>
              <span className="text-muted-foreground block font-medium">
                Batch ID
              </span>
              <span className="text-foreground mt-0.5 block font-mono text-sm font-bold">
                {selectedBatch.batchCode}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Record Type
              </span>
              <span className="text-primary mt-0.5 block text-sm font-semibold">
                {selectedBatch.recordType}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Total Images
              </span>
              <span className="text-foreground mt-0.5 block text-sm font-bold">
                {selectedBatch.totalImages} images
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Total Segments
              </span>
              <span className="text-foreground mt-0.5 block text-sm font-bold">
                {selectedBatch.totalSegments} Segments
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block font-medium">
                Date & Time
              </span>
              <span className="text-muted-foreground mt-0.5 block font-mono text-xs">
                {selectedBatch.assignedDate}
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
