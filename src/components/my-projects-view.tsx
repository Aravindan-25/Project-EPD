"use client";

import React, { useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  Briefcase,
  ArrowLeft,
  ChevronRight,
  HardDrive,
  FileText,
  Check,
  Zap,
  ShieldCheck,
  RotateCcw,
  Eye,
  Download,
  Paperclip,
  Users,
  Clock,
  UserCheck,
  Filter,
  Upload,
  X,
  FileSpreadsheet,
  AlertTriangle,
  Plus,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserRole } from "@/lib/user-role-context";

/* =========================================================================
   TYPES & DATA MODELS (DATA PROCESSING DEPARTMENT)
   ========================================================================= */

export type WorkInvolvementType = "Production" | "QC" | "Production + QC" | "Rework";
export type WorkType = "Production" | "QC" | "Rework";
export type WorkStatus = "Pending" | "In Progress" | "Completed" | "Passed" | "Failed";

export interface ClientAttachment {
  id: string;
  name: string;
  size: string;
  url: string;
}

export interface HourlyEntry {
  slot: string; // e.g. "09:00 AM – 10:00 AM"
  records: number;
}

export interface QCDefectLog {
  id: string; // e.g. "ERR-001"
  category: string; // e.g. "Data Entry Error", "Spelling Error", "Missing Field", "Formatting Error"
  severity: "Critical" | "Major" | "Minor";
  sourceNumber: string; // e.g. "001", "002"
  recordNumber?: string; // Optional record number e.g. "238"
  description: string;
  loggedAt: string;
}

export interface SourceUnitItem {
  id: string; // e.g. "SRC-001"
  sourceNumber: string; // e.g. "001"
  sourceFileName: string; // e.g. "parish_reg_1890_p001.tif"
}

export interface EmployeeBatchWorkItem {
  id: string;
  segmentId: string; // e.g. "SEG-001"
  sourceUnitRange: string; // e.g. "001–050"
  totalSourceUnits: number; // e.g. 10 Source Units
  completedSourceUnits: number; // e.g. 8
  totalRecords?: number; // Total production records entered
  hourlyEntries?: HourlyEntry[];
  hourlyQCEntries?: HourlyEntry[];
  totalQCRecordsChecked?: number;
  qcDefects?: QCDefectLog[];
  errorCount?: number;
  accuracyRate?: number;
  qcOutputFile?: string;
  qcEmployee?: string;
  productionOutputFile?: string;
  outputFileName?: string;
  reworkReason?: string;
  sourceFileName: string;
  sourceUnitsList?: SourceUnitItem[];
  workType: WorkType;
  workStatus: WorkStatus;
  updatedAt: string; // e.g. "6 Sep 2026 4:45pm"
}

export interface EmployeeProjectBatch {
  id: string;
  batchId: string; // e.g. "BAT-101-01"
  batchName: string;
  recordType: string;
  language: string;
  sourceType: "Images" | "PDF"; // Strictly "Images" or "PDF"
  totalSourceUnits: number;
  status: "Created" | "Allocated" | "In Progress" | "Pending Review" | "Completed";
  isAssignedToEmployee: boolean;
  // Replaced Segments Received / Completed with segment counts:
  productionSegmentsCount: number;
  qcSegmentsCount: number;
  reworkSegmentsCount: number;
  workInvolvement: WorkInvolvementType;
  assignedUnitsRange: string;
  assignedDate: string;
  dueDate: string;
  workItems: EmployeeBatchWorkItem[];
}

export interface EmployeeAssignedProject {
  id: string;
  projectId: string; // e.g. "DP-PRJ-101"
  projectName: string;
  description: string;
  clientName: string;
  startedAt: string;
  projectType: string; // Always "Data Processing"
  projectStatus: "Active" | "In Progress" | "Under Review" | "Completed";
  workInvolvement: WorkInvolvementType;
  team: string;
  roleDesignation: string;
  shift: string;
  clientAttachments: ClientAttachment[];
  assignedEmployeeCode: string;
  batches: EmployeeProjectBatch[];
}

/* =========================================================================
   STANDARD WORKING HOURS SCHEDULE
   ========================================================================= */

const STANDARD_WORKING_HOURS: string[] = [
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "01:00 PM – 02:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
  "05:00 PM – 06:00 PM",
];

/* =========================================================================
   ACCURACY RATE CALCULATOR HELPER
   Accuracy Rate = ((Total Records Checked - Error Count) / Total Records Checked) * 100
   ========================================================================= */

function calculateAccuracyRate(totalChecked: number, errorCount: number): number {
  if (!totalChecked || totalChecked <= 0) return 0;
  const rate = ((totalChecked - errorCount) / totalChecked) * 100;
  return Math.max(0, Math.round(rate * 10) / 10);
}

/* =========================================================================
   FULL SOURCE UNITS GENERATOR HELPER
   Generates EVERY source unit in the segment's complete assigned range
   (e.g., "001–010", "IMG-001 – IMG-010", "IMG-021 – IMG-030", "051–100", "251–300")
   ========================================================================= */

function generateFullSourceUnitsList(segment: EmployeeBatchWorkItem | null): SourceUnitItem[] {
  if (!segment) return [];

  const rangeStr = segment.sourceUnitRange || "";
  const parts = rangeStr.split(/[–-]/).map((s) => s.trim());

  let startNum: number | null = null;
  let endNum: number | null = null;
  let prefix = "";
  let padLen = 3;

  if (parts.length === 2) {
    const startMatch = parts[0].match(/^(.*?)(\d+)$/);
    const endMatch = parts[1].match(/^(.*?)(\d+)$/);

    if (startMatch && endMatch) {
      prefix = startMatch[1] || "";
      padLen = Math.max(startMatch[2].length, endMatch[2].length);
      startNum = parseInt(startMatch[2], 10);
      endNum = parseInt(endMatch[2], 10);
    }
  }

  if (startNum === null || endNum === null || isNaN(startNum) || isNaN(endNum) || startNum > endNum) {
    startNum = 1;
    endNum = Math.min(segment.totalSourceUnits || 10, 100);
  }

  const count = Math.min(endNum - startNum + 1, 500);
  const items: SourceUnitItem[] = [];

  const baseFileName = segment.sourceFileName || "source_unit.tif";
  const extMatch = baseFileName.match(/(\.[a-zA-Z0-9]+)$/);
  const ext = extMatch ? extMatch[1] : ".tif";
  const baseNameWithoutExt = baseFileName.replace(/(\.[a-zA-Z0-9]+)$/, "");
  const basePrefix = baseNameWithoutExt.replace(/_\d+_\d+$/, "").replace(/_\d+$/, "");

  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    const numStr = String(num).padStart(padLen, "0");
    const id = prefix ? `${prefix}${numStr}` : `SRC-${numStr}`;
    const sourceNumber = numStr;
    const sourceFileName = `${basePrefix}_p${numStr}${ext}`;

    items.push({
      id,
      sourceNumber,
      sourceFileName,
    });
  }

  return items;
}

/* =========================================================================
   REUSED PROJECT MANAGEMENT DATA (DATA PROCESSING DEPARTMENT)
   ========================================================================= */

const REUSED_PROJECT_DATA: EmployeeAssignedProject[] = [
  {
    id: "dp-prj-101",
    projectId: "DP-PRJ-101",
    projectName: "Historical Vital Records Digitization",
    description:
      "High-density indexing and transcription of historical parish registers, civil registries, and probate wills for national archival preservation.",
    clientName: "National Archives Foundation",
    startedAt: "12 Aug 2026",
    projectType: "Data Processing",
    projectStatus: "In Progress",
    workInvolvement: "Production + QC",
    team: "Archival Digitization Team A (Lead: Vikram Malhotra)",
    roleDesignation: "Senior Data Processing Specialist",
    shift: "General Day Shift (09:00 AM - 06:00 PM)",
    clientAttachments: [
      {
        id: "att-101-1",
        name: "Project_SOP_Indexing_Guidelines_v2.pdf",
        size: "2.4 MB",
        url: "#",
      },
      {
        id: "att-101-2",
        name: "Archival_Field_Mapping_Standard_2026.pdf",
        size: "1.8 MB",
        url: "#",
      },
    ],
    assignedEmployeeCode: "EMPLOYEE",
    batches: [
      {
        id: "bat-101-01",
        batchId: "BAT-101-01",
        batchName: "Vital Records - Parish Register 1890 Batch 01",
        recordType: "Birth Records",
        language: "English",
        sourceType: "Images",
        totalSourceUnits: 250,
        status: "In Progress",
        isAssignedToEmployee: true,
        productionSegmentsCount: 3,
        qcSegmentsCount: 2,
        reworkSegmentsCount: 1,
        workInvolvement: "Production + QC",
        assignedUnitsRange: "Units 001 - 250",
        assignedDate: "14 Aug 2026",
        dueDate: "28 Aug 2026",
        workItems: [
          {
            id: "seg-101",
            segmentId: "SEG-001",
            sourceUnitRange: "001–010",
            totalSourceUnits: 10,
            completedSourceUnits: 8,
            totalRecords: 285,
            hourlyEntries: [
              { slot: "09:00 AM – 10:00 AM", records: 35 },
              { slot: "10:00 AM – 11:00 AM", records: 40 },
              { slot: "11:00 AM – 12:00 PM", records: 45 },
              { slot: "12:00 PM – 01:00 PM", records: 30 },
              { slot: "01:00 PM – 02:00 PM", records: 35 },
              { slot: "02:00 PM – 03:00 PM", records: 40 },
              { slot: "03:00 PM – 04:00 PM", records: 35 },
              { slot: "04:00 PM – 05:00 PM", records: 25 },
              { slot: "05:00 PM – 06:00 PM", records: 0 },
            ],
            outputFileName: "prod_output_SEG001_v1.csv",
            sourceFileName: "parish_reg_1890_p001_10.tif",
            sourceUnitsList: [
              { id: "s-1", sourceNumber: "001", sourceFileName: "parish_reg_1890_p001.tif" },
              { id: "s-2", sourceNumber: "002", sourceFileName: "parish_reg_1890_p002.tif" },
              { id: "s-3", sourceNumber: "003", sourceFileName: "parish_reg_1890_p003.tif" },
              { id: "s-4", sourceNumber: "004", sourceFileName: "parish_reg_1890_p004.tif" },
              { id: "s-5", sourceNumber: "005", sourceFileName: "parish_reg_1890_p005.tif" },
            ],
            workType: "Production",
            workStatus: "In Progress",
            updatedAt: "6 Sep 2026 4:45pm",
          },
          {
            id: "seg-102",
            segmentId: "SEG-002",
            sourceUnitRange: "051–100",
            totalSourceUnits: 50,
            completedSourceUnits: 25,
            totalRecords: 450,
            hourlyEntries: [
              { slot: "09:00 AM – 10:00 AM", records: 50 },
              { slot: "10:00 AM – 11:00 AM", records: 55 },
              { slot: "11:00 AM – 12:00 PM", records: 60 },
              { slot: "12:00 PM – 01:00 PM", records: 40 },
              { slot: "01:00 PM – 02:00 PM", records: 50 },
              { slot: "02:00 PM – 03:00 PM", records: 55 },
              { slot: "03:00 PM – 04:00 PM", records: 60 },
              { slot: "04:00 PM – 05:00 PM", records: 45 },
              { slot: "05:00 PM – 06:00 PM", records: 35 },
            ],
            outputFileName: "prod_output_SEG002_draft.xlsx",
            sourceFileName: "parish_reg_1890_p051_100.tif",
            sourceUnitsList: [
              { id: "s-51", sourceNumber: "051", sourceFileName: "parish_reg_1890_p051.tif" },
              { id: "s-52", sourceNumber: "052", sourceFileName: "parish_reg_1890_p052.tif" },
            ],
            workType: "Production",
            workStatus: "In Progress",
            updatedAt: "8 Sep 2026 11:30am",
          },
          {
            id: "seg-103",
            segmentId: "SEG-003",
            sourceUnitRange: "101–120",
            totalSourceUnits: 20,
            completedSourceUnits: 20,
            totalRecords: 520,
            hourlyEntries: [
              { slot: "09:00 AM – 10:00 AM", records: 60 },
              { slot: "10:00 AM – 11:00 AM", records: 65 },
              { slot: "11:00 AM – 12:00 PM", records: 70 },
              { slot: "12:00 PM – 01:00 PM", records: 50 },
              { slot: "01:00 PM – 02:00 PM", records: 60 },
              { slot: "02:00 PM – 03:00 PM", records: 65 },
              { slot: "03:00 PM – 04:00 PM", records: 70 },
              { slot: "04:00 PM – 05:00 PM", records: 50 },
              { slot: "05:00 PM – 06:00 PM", records: 30 },
            ],
            outputFileName: "final_production_SEG003.csv",
            sourceFileName: "parish_reg_1890_p101_120.tif",
            sourceUnitsList: [
              { id: "s-101", sourceNumber: "101", sourceFileName: "parish_reg_1890_p101.tif" },
            ],
            workType: "Production",
            workStatus: "Completed",
            updatedAt: "9 Sep 2026 5:15pm",
          },
          {
            id: "seg-105",
            segmentId: "SEG-005",
            sourceUnitRange: "201–250",
            totalSourceUnits: 50,
            completedSourceUnits: 40,
            totalRecords: 520,
            totalQCRecordsChecked: 450,
            errorCount: 9,
            accuracyRate: 98,
            qcEmployee: "Peer Mohamed Nafees J",
            qcOutputFile: "qc_report_SEG005.xlsx font",
            productionOutputFile: "prod_output_SEG005.csv",
            qcDefects: [
              { id: "err-1", category: "Data Entry Error", severity: "Major", sourceNumber: "208", recordNumber: "238", description: "Father's middle name misspelled as 'Jhon' instead of 'John'.", loggedAt: "10 Sep 2026 10:15am" },
              { id: "err-2", category: "Spelling Error", severity: "Minor", sourceNumber: "212", recordNumber: "115", description: "Parish village name abbreviation missing.", loggedAt: "10 Sep 2026 10:25am" },
            ],
            sourceFileName: "parish_reg_1890_p201_250.tif",
            sourceUnitsList: [
              { id: "s-201", sourceNumber: "201", sourceFileName: "parish_reg_1890_p201.tif" },
            ],
            workType: "QC",
            workStatus: "In Progress",
            updatedAt: "10 Sep 2026 10:30am",
          },
          {
            id: "seg-106",
            segmentId: "SEG-006",
            sourceUnitRange: "251–300",
            totalSourceUnits: 50,
            completedSourceUnits: 50,
            totalRecords: 500,
            errorCount: 6,
            accuracyRate: 98.8,
            qcEmployee: "Peer Mohamed Nafees J",
            qcOutputFile: "qc_report_SEG006.xlsx",
            productionOutputFile: "prod_output_SEG006.csv",
            reworkReason: "QC Failed - Date field illegible in original keying",
            qcDefects: [
              { id: "err-10", category: "Data Entry Error", severity: "Critical", sourceNumber: "255", recordNumber: "042", description: "Date of baptism transcribed incorrectly.", loggedAt: "10 Sep 2026 08:15am" },
            ],
            sourceFileName: "parish_reg_1890_p251_300.tif",
            sourceUnitsList: [
              { id: "s-251", sourceNumber: "251", sourceFileName: "parish_reg_1890_p251.tif" },
            ],
            workType: "Rework",
            workStatus: "In Progress",
            updatedAt: "10 Sep 2026 08:30am",
          },
        ],
      },
      {
        id: "bat-101-02",
        batchId: "BAT-101-02",
        batchName: "Vital Records - Civil Registry 1902 Batch 02",
        recordType: "Marriage Records",
        language: "French",
        sourceType: "PDF",
        totalSourceUnits: 180,
        status: "Pending Review",
        isAssignedToEmployee: true,
        productionSegmentsCount: 0,
        qcSegmentsCount: 2,
        reworkSegmentsCount: 0,
        workInvolvement: "QC",
        assignedUnitsRange: "Units 001 - 090",
        assignedDate: "18 Aug 2026",
        dueDate: "02 Sep 2026",
        workItems: [
          {
            id: "seg-201",
            segmentId: "SEG-011",
            sourceUnitRange: "001–045",
            totalSourceUnits: 45,
            completedSourceUnits: 45,
            totalRecords: 450,
            totalQCRecordsChecked: 450,
            errorCount: 2,
            accuracyRate: 99.5,
            qcEmployee: "Peer Mohamed Nafees J",
            qcOutputFile: "qc_passed_SEG011.xlsx",
            productionOutputFile: "prod_output_SEG011.pdf",
            sourceFileName: "civil_reg_1902_f001.pdf",
            sourceUnitsList: [
              { id: "s-pdf1", sourceNumber: "001", sourceFileName: "civil_reg_1902_f001.pdf" },
            ],
            workType: "QC",
            workStatus: "Passed",
            updatedAt: "26 Aug 2026 4:10pm",
          },
          {
            id: "seg-202",
            segmentId: "SEG-012",
            sourceUnitRange: "046–090",
            totalSourceUnits: 45,
            completedSourceUnits: 45,
            totalRecords: 450,
            totalQCRecordsChecked: 450,
            errorCount: 1,
            accuracyRate: 99.7,
            qcEmployee: "Peer Mohamed Nafees J",
            qcOutputFile: "qc_passed_SEG012.xlsx",
            productionOutputFile: "prod_output_SEG012.pdf",
            sourceFileName: "civil_reg_1902_f002.pdf",
            sourceUnitsList: [
              { id: "s-pdf2", sourceNumber: "046", sourceFileName: "civil_reg_1902_f002.pdf" },
            ],
            workType: "QC",
            workStatus: "Passed",
            updatedAt: "26 Aug 2026 5:30pm",
          },
        ],
      },
    ],
  },
];

/* =========================================================================
   STATUS BADGE HELPER
   ========================================================================= */

function StatusBadge({ status }: { status: string }) {
  const norm = status.toLowerCase();
  if (norm.includes("completed") || norm.includes("passed")) {
    return (
      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 rounded-none py-0 text-[10px] font-semibold">
        {status}
      </Badge>
    );
  }
  if (norm.includes("progress")) {
    return (
      <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 rounded-none py-0 text-[10px] font-semibold">
        {status}
      </Badge>
    );
  }
  if (norm.includes("failed") || norm.includes("rework")) {
    return (
      <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 rounded-none py-0 text-[10px] font-semibold">
        {status}
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="border-border text-muted-foreground rounded-none py-0 text-[10px] font-semibold"
    >
      {status}
    </Badge>
  );
}

/* =========================================================================
   WORK INVOLVEMENT BADGE HELPER
   ========================================================================= */

function WorkInvolvementBadge({ involvement }: { involvement: WorkInvolvementType }) {
  if (involvement === "Production") {
    return (
      <Badge className="bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 rounded-none py-0 text-[10px] font-semibold">
        Production
      </Badge>
    );
  }
  if (involvement === "QC") {
    return (
      <Badge className="bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30 rounded-none py-0 text-[10px] font-semibold">
        QC
      </Badge>
    );
  }
  if (involvement === "Production + QC") {
    return (
      <Badge className="bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30 rounded-none py-0 text-[10px] font-semibold">
        Production + QC
      </Badge>
    );
  }
  if (involvement === "Rework") {
    return (
      <Badge className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 rounded-none py-0 text-[10px] font-semibold">
        Rework
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="border-border rounded-none text-[10px]">
      {involvement}
    </Badge>
  );
}

/* =========================================================================
   MAIN COMPONENT: MY PROJECTS VIEW
   ========================================================================= */

export function MyProjectsView() {
  const { currentProfile } = useUserRole();

  // URL state management using nuqs
  const [selectedProjectId, setSelectedProjectId] = useQueryState(
    "projectId",
    parseAsString.withDefault(""),
  );
  const [selectedBatchId, setSelectedBatchId] = useQueryState(
    "batchId",
    parseAsString.withDefault(""),
  );
  const [workTabParam] = useQueryState(
    "tab",
    parseAsString.withDefault(""),
  );

  // Level 1 Tab: "all" | "in_progress"
  const [projectListTab, setProjectListTab] = useState<string>("all");

  // Level 2 Tab: "overview" | "batches"
  const [projectDetailTab, setProjectDetailTab] = useState<string>("overview");

  // SECTION 1: WORK TYPE TABS: strictly "production" | "qc" | "rework" (NO "ALL WORK")
  const [workTypeTab, setWorkTypeTab] = useState<string>("production");

  React.useEffect(() => {
    if (workTabParam && ["production", "qc", "rework"].includes(workTabParam.toLowerCase())) {
      setWorkTypeTab(workTabParam.toLowerCase());
    }
  }, [workTabParam]);

  // Level 3 Status Filter: "all" | "pending" | "in_progress" | "completed"
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Production Work Update Modal State
  const [isUpdatePanelOpen, setIsUpdatePanelOpen] = useState(false);
  const [editingSegment, setEditingSegment] = useState<EmployeeBatchWorkItem | null>(null);

  // Production Form State
  const [formCompletedUnits, setFormCompletedUnits] = useState<number>(0);
  const [formHourlyRecords, setFormHourlyRecords] = useState<Record<string, number>>({});
  const [formTotalRecords, setFormTotalRecords] = useState<number>(0);
  const [formFileName, setFormFileName] = useState<string>("");

  // QC Work Update Modal State
  const [isQCUpdatePanelOpen, setIsQCUpdatePanelOpen] = useState(false);
  const [editingQCSegment, setEditingQCSegment] = useState<EmployeeBatchWorkItem | null>(null);
  const [qcFormCompletedUnits, setQcFormCompletedUnits] = useState<number>(0);
  const [qcFormHourlyVerified, setQcFormHourlyVerified] = useState<Record<string, number>>({});
  const [qcFormOutputFile, setQcFormOutputFile] = useState<string>("");
  const [qcFormStatus, setQcFormStatus] = useState<"In Progress" | "Passed" | "Failed">("In Progress");

  // QC Defect Logger Form State inside QC Modal
  const [defectCategory, setDefectCategory] = useState<string>("Data Entry Error");
  const [defectSeverity, setDefectSeverity] = useState<"Critical" | "Major" | "Minor">("Major");
  const [defectSourceNumber, setDefectSourceNumber] = useState<string>("001");
  const [defectRecordNumber, setDefectRecordNumber] = useState<string>("");
  const [defectDescription, setDefectDescription] = useState<string>("");
  const [activeDefectLogs, setActiveDefectLogs] = useState<QCDefectLog[]>([]);

  // Source Unit Table Viewer Modal State
  const [isSourceTableModalOpen, setIsSourceTableModalOpen] = useState(false);
  const [sourceTableSegment, setSourceTableSegment] = useState<EmployeeBatchWorkItem | null>(null);

  // Inspect Sheet Modal State
  const [isInspectSheetOpen, setIsInspectSheetOpen] = useState(false);
  const [inspectingSegment, setInspectingSegment] = useState<EmployeeBatchWorkItem | null>(null);

  // Production Output File Viewer Modal State
  const [isProdOutputFileOpen, setIsProdOutputFileOpen] = useState(false);
  const [viewingProdOutputFile, setViewingProdOutputFile] = useState<string>("");

  // Projects data state
  const [projectsList, setProjectsList] = useState<EmployeeAssignedProject[]>(
    REUSED_PROJECT_DATA,
  );

  // SECTION 1: Project List Filtering & Ascending Sorting by Project ID
  const displayedProjects = useMemo(() => {
    let list = [...projectsList];

    if (projectListTab === "in_progress") {
      list = list.filter((p) => p.projectStatus === "In Progress");
    } else if (projectListTab === "completed") {
      list = list.filter((p) => p.projectStatus === "Completed");
    }

    list.sort((a, b) =>
      a.projectId.localeCompare(b.projectId, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );

    return list;
  }, [projectsList, projectListTab]);

  // Selected project object
  const activeProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return (
      projectsList.find(
        (p) => p.id === selectedProjectId || p.projectId === selectedProjectId,
      ) || null
    );
  }, [projectsList, selectedProjectId]);

  // Selected batch object
  const activeBatch = useMemo(() => {
    if (!activeProject || !selectedBatchId) return null;
    return (
      activeProject.batches.find(
        (b) => b.id === selectedBatchId || b.batchId === selectedBatchId,
      ) || null
    );
  }, [activeProject, selectedBatchId]);

  // Eligible batches assigned to current employee
  const assignedBatchesOnly = useMemo(() => {
    if (!activeProject) return [];
    return activeProject.batches.filter((b) => b.isAssignedToEmployee);
  }, [activeProject]);

  // LEVEL 3: WORKLIST FILTERING (STRICT PRODUCTION / QC / REWORK TABS)
  const filteredWorklist = useMemo(() => {
    if (!activeBatch) return [];
    return activeBatch.workItems.filter((item) => {
      // 1. Work Type Filter
      if (item.workType.toLowerCase() !== workTypeTab.toLowerCase()) {
        return false;
      }

      // 2. Status Filter
      if (statusFilter !== "all") {
        const normStatus = item.workStatus.toLowerCase().replace(/\s+/g, "_");
        if (normStatus !== statusFilter) {
          return false;
        }
      }

      return true;
    });
  }, [activeBatch, workTypeTab, statusFilter]);

  // Handle switching work type tab
  const handleWorkTypeTabChange = (val: string) => {
    setWorkTypeTab(val);
    if (val === "rework" && statusFilter === "pending") {
      setStatusFilter("all");
    }
  };

  // Handlers
  const handleViewProject = (projectId: string) => {
    setSelectedProjectId(projectId);
    setSelectedBatchId(null);
    setProjectDetailTab("overview");
  };

  const handleOpenBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setWorkTypeTab("production");
    setStatusFilter("all");
  };

  const handleBackToProjects = () => {
    setSelectedProjectId(null);
    setSelectedBatchId(null);
  };

  const handleBackToProjectDetail = () => {
    setSelectedBatchId(null);
    setProjectDetailTab("batches");
  };

  // Open Source Table Modal (Section 5 & 8)
  const handleOpenSourceTableModal = (item: EmployeeBatchWorkItem) => {
    setSourceTableSegment(item);
    setIsSourceTableModalOpen(true);
  };

  // Open Inspect Sheet Modal (Section 17 & 19)
  const handleOpenInspectSheet = (item: EmployeeBatchWorkItem) => {
    setInspectingSegment(item);
    setIsInspectSheetOpen(true);
  };

  // Open Production Output File Viewer (Section 9)
  const handleOpenProdOutputFile = (fileName: string) => {
    setViewingProdOutputFile(fileName);
    setIsProdOutputFileOpen(true);
  };

  // Open Production Work Update Panel (Section 6)
  const handleOpenUpdatePanel = (item: EmployeeBatchWorkItem) => {
    if (item.workType === "QC") {
      handleOpenQCUpdatePanel(item);
      return;
    }

    setEditingSegment(item);
    setFormCompletedUnits(item.completedSourceUnits || 0);

    const initialHourly: Record<string, number> = {};
    STANDARD_WORKING_HOURS.forEach((slot) => {
      const existing = item.hourlyEntries?.find((e) => e.slot === slot);
      initialHourly[slot] = existing ? existing.records : 0;
    });
    setFormHourlyRecords(initialHourly);

    const initialSum = Object.values(initialHourly).reduce((acc, v) => acc + (v || 0), 0);
    setFormTotalRecords(item.totalRecords || initialSum);
    setFormFileName(item.outputFileName || "");

    setIsUpdatePanelOpen(true);
  };

  // Open QC Work Update Panel (Section 14 & 15)
  const handleOpenQCUpdatePanel = (item: EmployeeBatchWorkItem) => {
    setEditingQCSegment(item);
    setQcFormCompletedUnits(item.completedSourceUnits || 0);

    const initialQCHourly: Record<string, number> = {};
    STANDARD_WORKING_HOURS.forEach((slot) => {
      const existing = item.hourlyQCEntries?.find((e) => e.slot === slot);
      initialQCHourly[slot] = existing ? existing.records : 0;
    });
    setQcFormHourlyVerified(initialQCHourly);
    setQcFormOutputFile(item.qcOutputFile || "");
    setQcFormStatus(
      item.workStatus === "Passed" || item.workStatus === "Failed"
        ? (item.workStatus as "Passed" | "Failed")
        : "In Progress",
    );
    setActiveDefectLogs(item.qcDefects || []);

    setIsQCUpdatePanelOpen(true);
  };

  // Handle hourly record input change in Production panel
  const handleHourlyRecordChange = (slot: string, val: number) => {
    const nextMap = { ...formHourlyRecords, [slot]: Math.max(0, val) };
    setFormHourlyRecords(nextMap);
    const newSum = Object.values(nextMap).reduce((acc, v) => acc + (v || 0), 0);
    setFormTotalRecords(newSum);
  };

  // Handle hourly QC verification input change in QC panel
  const handleQCHourlyRecordChange = (slot: string, val: number) => {
    const nextMap = { ...qcFormHourlyVerified, [slot]: Math.max(0, val) };
    setQcFormHourlyVerified(nextMap);
  };

  // Calculated Total QC Records Checked
  const calculatedTotalQCChecked = useMemo(() => {
    return Object.values(qcFormHourlyVerified).reduce((acc, v) => acc + (v || 0), 0);
  }, [qcFormHourlyVerified]);

  // Calculated QC Accuracy Rate inside QC panel
  const calculatedQCAccuracy = useMemo(() => {
    return calculateAccuracyRate(calculatedTotalQCChecked, activeDefectLogs.length);
  }, [calculatedTotalQCChecked, activeDefectLogs.length]);

  // Log Defect Action inside QC panel (Section 15)
  const handleAddQCDefect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!defectSourceNumber.trim() || !defectDescription.trim()) {
      toast.error("Source Number and Description are required to log a defect.");
      return;
    }

    const newDefect: QCDefectLog = {
      id: `ERR-${String(activeDefectLogs.length + 1).padStart(3, "0")}`,
      category: defectCategory,
      severity: defectSeverity,
      sourceNumber: defectSourceNumber.trim(),
      recordNumber: defectRecordNumber.trim() || undefined,
      description: defectDescription.trim(),
      loggedAt: getFormattedNow(),
    };

    setActiveDefectLogs((prev) => [...prev, newDefect]);
    setDefectDescription("");
    setDefectRecordNumber("");
    toast.success(`QC Defect ${newDefect.id} logged successfully.`);
  };

  // Remove Defect
  const handleRemoveQCDefect = (defectId: string) => {
    setActiveDefectLogs((prev) => prev.filter((d) => d.id !== defectId));
    toast.info("Defect log entry removed.");
  };

  // Format current date/time in standard app format (e.g. "10 Sep 2026 4:05pm")
  const getFormattedNow = () => {
    const d = new Date();
    const day = d.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12 || 12;
    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
  };

  // SECTION 10: SAVE / UPDATE BEHAVIOR IN PRODUCTION UPDATE WORK PANEL
  const handleSaveProgress = (isCompleting: boolean = false) => {
    if (!activeProject || !activeBatch || !editingSegment) return;

    if (isCompleting && formCompletedUnits < editingSegment.totalSourceUnits) {
      toast.error(`All ${editingSegment.totalSourceUnits} source units must be completed before final completion.`);
      return;
    }

    if (isCompleting && !formFileName.trim()) {
      toast.error("Please attach a Production Output File before marking work completed.");
      return;
    }

    const updatedNow = getFormattedNow();
    const finalStatus: WorkStatus = isCompleting ? "Completed" : "In Progress";

    const hourlyEntriesList: HourlyEntry[] = STANDARD_WORKING_HOURS.map((slot) => ({
      slot,
      records: formHourlyRecords[slot] || 0,
    }));

    setProjectsList((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          batches: proj.batches.map((batch) => {
            if (batch.id !== activeBatch.id) return batch;
            const updatedWorkItems = batch.workItems.map((item) => {
              if (item.id !== editingSegment.id) return item;
              return {
                ...item,
                completedSourceUnits: formCompletedUnits,
                totalRecords: formTotalRecords,
                hourlyEntries: hourlyEntriesList,
                outputFileName: formFileName || item.outputFileName,
                workStatus: finalStatus,
                updatedAt: updatedNow,
              };
            });

            return {
              ...batch,
              workItems: updatedWorkItems,
            };
          }),
        };
      }),
    );

    setIsUpdatePanelOpen(false);

    if (isCompleting) {
      toast.success(`Segment ${editingSegment.segmentId} production work marked as Completed!`);
    } else {
      toast.success(`Segment ${editingSegment.segmentId} progress saved. Updated At: ${updatedNow}`);
    }
  };

  // SECTION 14, 16 & 18: SAVE / UPDATE BEHAVIOR IN QC WORK UPDATE PANEL
  const handleSaveQCProgress = (isCompleting: boolean = false) => {
    if (!activeProject || !activeBatch || !editingQCSegment) return;

    const updatedNow = getFormattedNow();
    let finalStatus: WorkStatus = qcFormStatus;

    if (isCompleting) {
      if (qcFormStatus === "In Progress") {
        toast.error("Please select whether the QC result is Passed or Failed before complete submission.");
        return;
      }
      if (!qcFormOutputFile.trim() && qcFormStatus === "Passed") {
        toast.error("Please attach a QC Output File (XLSX/XLS) for Passed QC completion.");
        return;
      }
    }

    const hourlyQCEntriesList: HourlyEntry[] = STANDARD_WORKING_HOURS.map((slot) => ({
      slot,
      records: qcFormHourlyVerified[slot] || 0,
    }));

    const finalAccuracy = calculateAccuracyRate(calculatedTotalQCChecked, activeDefectLogs.length);

    setProjectsList((prevProjects) =>
      prevProjects.map((proj) => {
        if (proj.id !== activeProject.id) return proj;
        return {
          ...proj,
          batches: proj.batches.map((batch) => {
            if (batch.id !== activeBatch.id) return batch;
            const updatedWorkItems = batch.workItems.map((item) => {
              if (item.id !== editingQCSegment.id) return item;
              return {
                ...item,
                completedSourceUnits: qcFormCompletedUnits,
                totalQCRecordsChecked: calculatedTotalQCChecked,
                hourlyQCEntries: hourlyQCEntriesList,
                qcDefects: activeDefectLogs,
                errorCount: activeDefectLogs.length,
                accuracyRate: finalAccuracy,
                qcOutputFile: qcFormOutputFile || item.qcOutputFile,
                workStatus: finalStatus,
                updatedAt: updatedNow,
              };
            });

            // If QC Failed, add/update segment into Rework flow under the SAME Segment ID
            if (isCompleting && qcFormStatus === "Failed") {
              const existingRework = updatedWorkItems.find(
                (i) => i.segmentId === editingQCSegment.segmentId && i.workType === "Rework",
              );
              if (!existingRework) {
                updatedWorkItems.push({
                  id: `rw-${editingQCSegment.id}`,
                  segmentId: editingQCSegment.segmentId,
                  sourceUnitRange: editingQCSegment.sourceUnitRange,
                  totalSourceUnits: editingQCSegment.totalSourceUnits,
                  completedSourceUnits: 0,
                  totalRecords: editingQCSegment.totalRecords,
                  qcDefects: activeDefectLogs,
                  errorCount: activeDefectLogs.length,
                  reworkReason: `QC Failed (${activeDefectLogs.length} errors logged)`,
                  sourceFileName: editingQCSegment.sourceFileName,
                  sourceUnitsList: editingQCSegment.sourceUnitsList,
                  workType: "Rework",
                  workStatus: "In Progress",
                  updatedAt: updatedNow,
                });
              }
            }

            return {
              ...batch,
              workItems: updatedWorkItems,
            };
          }),
        };
      }),
    );

    setIsQCUpdatePanelOpen(false);

    if (isCompleting) {
      if (qcFormStatus === "Failed") {
        toast.warning(`Segment ${editingQCSegment.segmentId} marked QC Failed. Segment sent to Production Rework.`);
      } else {
        toast.success(`Segment ${editingQCSegment.segmentId} QC Passed successfully! Accuracy: ${finalAccuracy}%`);
      }
    } else {
      toast.success(`QC progress saved for ${editingQCSegment.segmentId}. Errors Logged: ${activeDefectLogs.length}`);
    }
  };

  /* -------------------------------------------------------------------------
     LEVEL 3: OPEN BATCH (ASSIGNED WORK SEGMENT WORKLIST)
     ------------------------------------------------------------------------- */
  if (activeProject && activeBatch) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="border-border bg-card flex flex-col justify-between gap-4 border p-4 shadow-xs md:flex-row md:items-center">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={handleBackToProjects}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              My Projects
            </button>
            <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
            <button
              onClick={handleBackToProjectDetail}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {activeProject.projectName}
            </button>
            <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-foreground font-semibold">
              {activeBatch.batchName} ({activeBatch.batchId})
            </span>
            <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-[10px]"
            >
              My Batch Work
            </Badge>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToProjectDetail}
            className="border-border h-8 gap-1 rounded-none text-xs font-medium cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Project Batches
          </Button>
        </div>

        {/* SECTION 2: TOP BATCH INFORMATION CARD (Segments Received/Completed replaced with Production/QC/Rework counts) */}
        <div className="border-border bg-card flex flex-col justify-between gap-4 border p-5 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HardDrive className="text-primary h-5 w-5" />
                <h1 className="text-foreground text-xl font-bold tracking-tight">
                  {activeBatch.batchName}
                </h1>
                <StatusBadge status={activeBatch.status} />
              </div>
              <p className="text-muted-foreground mt-1 text-xs">
                Batch ID: <span className="font-mono text-foreground font-semibold">{activeBatch.batchId}</span> &bull; {activeProject.projectName} ({activeProject.projectId}).
              </p>
            </div>
          </div>

          {/* Batch Meta Indicators (Production, QC, Rework segment counts) */}
          <div className="border-border/60 bg-background/50 grid grid-cols-2 gap-4 border p-4 sm:grid-cols-3 lg:grid-cols-6 text-xs">
            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                Record Type
              </span>
              <span className="text-foreground font-medium mt-0.5 block">
                {activeBatch.recordType}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                Language
              </span>
              <span className="text-foreground font-medium mt-0.5 block">
                {activeBatch.language}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                Source Type
              </span>
              <span className="text-foreground font-semibold mt-0.5 block">
                {activeBatch.sourceType}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                Production Segments
              </span>
              <span className="text-blue-500 font-semibold font-mono mt-0.5 block">
                {activeBatch.workItems.filter((i) => i.workType === "Production").length}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                QC Segments
              </span>
              <span className="text-purple-500 font-semibold font-mono mt-0.5 block">
                {activeBatch.workItems.filter((i) => i.workType === "QC").length}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                Rework Segments
              </span>
              <span className="text-rose-500 font-semibold font-mono mt-0.5 block">
                {activeBatch.workItems.filter((i) => i.workType === "Rework").length}
              </span>
            </div>
          </div>
        </div>

        {/* ASSIGNED WORK SEGMENT WORKLIST CONTAINER */}
        <Card className="bg-card border-border rounded-none border p-5 shadow-none flex flex-col gap-5">
          <div className="flex flex-col gap-4 border-b border-border/60 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-bold tracking-wider uppercase flex items-center gap-2">
                <FileText className="text-primary h-4 w-4" />
                Assigned Work Segment Worklist
              </h2>
              <Badge
                variant="outline"
                className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
              >
                Showing {filteredWorklist.length} Segments
              </Badge>
            </div>

            {/* SECTION 1: WORK TYPE TABS (Production, QC, Rework - NO ALL WORK TAB) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <Tabs
                value={workTypeTab}
                onValueChange={handleWorkTypeTabChange}
                className="w-auto"
              >
                <TabsList className="h-9 bg-secondary/50 p-0.5 rounded-none space-x-1">
                  <TabsTrigger
                    value="production"
                    className="text-xs rounded-none px-3 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
                  >
                    Production ({activeBatch.workItems.filter((i) => i.workType === "Production").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="qc"
                    className="text-xs rounded-none px-3 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
                  >
                    QC ({activeBatch.workItems.filter((i) => i.workType === "QC").length})
                  </TabsTrigger>
                  <TabsTrigger
                    value="rework"
                    className="text-xs rounded-none px-3 py-1.5 data-[state=active]:bg-card font-semibold cursor-pointer"
                  >
                    Rework ({activeBatch.workItems.filter((i) => i.workType === "Rework").length})
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* STATUS FILTER ON THE RIGHT SIDE OF THE SAME HORIZONTAL ROW */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-muted-foreground text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Filter className="h-3 w-3" /> Status:
                </span>

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-2.5 py-1 text-xs rounded-none transition-colors cursor-pointer border ${
                      statusFilter === "all"
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    All
                  </button>

                  {workTypeTab !== "rework" && (
                    <button
                      onClick={() => setStatusFilter("pending")}
                      className={`px-2.5 py-1 text-xs rounded-none transition-colors cursor-pointer border ${
                        statusFilter === "pending"
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      Pending
                    </button>
                  )}

                  <button
                    onClick={() => setStatusFilter("in_progress")}
                    className={`px-2.5 py-1 text-xs rounded-none transition-colors cursor-pointer border ${
                      statusFilter === "in_progress"
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    In Progress
                  </button>

                  <button
                    onClick={() => setStatusFilter("completed")}
                    className={`px-2.5 py-1 text-xs rounded-none transition-colors cursor-pointer border ${
                      statusFilter === "completed"
                        ? "bg-primary text-primary-foreground border-primary font-semibold"
                        : "bg-background text-muted-foreground border-border hover:text-foreground"
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* DYNAMIC TAB TABLE RENDER */}
          <div className="overflow-x-auto">
            {workTypeTab === "production" && (
              /* SECTION 2: PRODUCTION TAB TABLE FIELDS */
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3">Segment ID</th>
                    <th className="p-3">Total Source Units</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Completed Units</th>
                    <th className="p-3">Records Entered</th>
                    <th className="p-3">Production Output File</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Updated At</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {filteredWorklist.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-muted-foreground">
                        No Production segments found for the selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredWorklist.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-foreground">{item.segmentId}</td>
                        <td className="p-3 font-medium text-foreground">{item.totalSourceUnits} Source Units</td>
                        {/* Source: View button ONLY */}
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenSourceTableModal(item)}
                            className="h-6 px-2 text-[11px] rounded-none cursor-pointer border border-border"
                          >
                            <Eye className="h-3 w-3 mr-1 text-primary" /> View
                          </Button>
                        </td>
                        {/* Completed Units: Display ONLY the completed source-unit number */}
                        <td className="p-3 font-mono font-bold text-foreground">
                          {item.completedSourceUnits || 0}
                        </td>
                        {/* Records Entered */}
                        <td className="p-3 font-mono font-bold text-primary">
                          {item.totalRecords || 0}
                        </td>
                        {/* Production Output File: Display ONLY Uploaded or Pending state */}
                        <td className="p-3">
                          {item.outputFileName || item.productionOutputFile || item.workStatus === "Completed" ? (
                            <Badge variant="outline" className="text-[10px] rounded-none border-emerald-500/40 bg-emerald-500/10 text-emerald-500 font-semibold">
                              Uploaded
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] rounded-none border-amber-500/40 bg-amber-500/10 text-amber-500 font-semibold">
                              Pending
                            </Badge>
                          )}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={item.workStatus} />
                        </td>
                        <td className="p-3 text-muted-foreground font-mono text-[11px]">
                          {item.updatedAt}
                        </td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenUpdatePanel(item)}
                            className="h-7 text-xs rounded-none cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                          >
                            Update Work
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {workTypeTab === "qc" && (
              /* SECTION 7: QC TAB TABLE FIELDS (12 Exact Columns without numeric prefixes) */
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3">Segment ID</th>
                    <th className="p-3">Total Source Units</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Total Records</th>
                    <th className="p-3">Production Output File</th>
                    <th className="p-3">QC Employee</th>
                    <th className="p-3">Error Logged</th>
                    <th className="p-3">Accuracy Rate</th>
                    <th className="p-3">QC Output File</th>
                    <th className="p-3">QC Status</th>
                    <th className="p-3">Updated At</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {filteredWorklist.length === 0 ? (
                    <tr>
                      <td colSpan={12} className="p-6 text-center text-muted-foreground">
                        No QC segments found for the selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredWorklist.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-foreground">{item.segmentId}</td>
                        <td className="p-3 font-medium text-foreground">{item.totalSourceUnits} Units</td>
                        {/* Source: View button ONLY */}
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenSourceTableModal(item)}
                            className="h-6 px-2 text-[11px] rounded-none cursor-pointer border border-border"
                          >
                            <Eye className="h-3 w-3 mr-1 text-primary" /> View
                          </Button>
                        </td>
                        <td className="p-3 font-mono font-bold text-foreground">{item.totalRecords || 500}</td>
                        {/* Production Output File with View button */}
                        <td className="p-3">
                          {item.productionOutputFile ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenProdOutputFile(item.productionOutputFile!)}
                              className="h-6 px-2 text-[11px] rounded-none cursor-pointer border-border font-mono"
                            >
                              <Eye className="h-3 w-3 mr-1" /> View
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-[11px]">N/A</span>
                          )}
                        </td>
                        <td className="p-3 font-medium text-foreground">{item.qcEmployee || currentProfile.name}</td>
                        {/* Error Logged */}
                        <td className="p-3 font-mono font-bold text-rose-500">{item.errorCount || (item.qcDefects ? item.qcDefects.length : 0)}</td>
                        {/* Accuracy Rate */}
                        <td className="p-3 font-mono font-bold text-emerald-500">
                          {item.accuracyRate !== undefined ? `${item.accuracyRate}%` : "100%"}
                        </td>
                        <td className="p-3 font-mono text-[11px] text-muted-foreground">
                          {item.qcOutputFile || "Not uploaded"}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={item.workStatus} />
                        </td>
                        <td className="p-3 text-muted-foreground font-mono text-[11px]">{item.updatedAt}</td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenQCUpdatePanel(item)}
                            className="h-7 text-xs rounded-none cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                          >
                            Update Work
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {workTypeTab === "rework" && (
              /* SECTION 19: REWORK TAB TABLE FIELDS (9 Exact Columns without numeric prefixes) */
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                    <th className="p-3">Segment ID</th>
                    <th className="p-3">Total Source Units</th>
                    <th className="p-3">Source</th>
                    <th className="p-3">Records Entered</th>
                    <th className="p-3">Error Logged</th>
                    <th className="p-3">Inspect Sheet</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Updated At</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-border/60 divide-y">
                  {filteredWorklist.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-6 text-center text-muted-foreground">
                        No Rework segments found for the selected status.
                      </td>
                    </tr>
                  ) : (
                    filteredWorklist.map((item) => (
                      <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="p-3 font-mono font-bold text-foreground">{item.segmentId}</td>
                        <td className="p-3 font-medium text-foreground">{item.totalSourceUnits} Units</td>
                        {/* Source: View button ONLY */}
                        <td className="p-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenSourceTableModal(item)}
                            className="h-6 px-2 text-[11px] rounded-none cursor-pointer border border-border"
                          >
                            <Eye className="h-3 w-3 mr-1 text-primary" /> View
                          </Button>
                        </td>
                        <td className="p-3 font-mono font-bold text-primary">{item.totalRecords || 0}</td>
                        <td className="p-3 font-mono font-bold text-rose-500">{item.errorCount || (item.qcDefects ? item.qcDefects.length : 0)}</td>
                        {/* Inspect Sheet button */}
                        <td className="p-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenInspectSheet(item)}
                            className="h-6 px-2 text-[11px] rounded-none cursor-pointer border-rose-500/40 text-rose-500 hover:bg-rose-500/10"
                          >
                            <AlertTriangle className="h-3 w-3 mr-1" /> Inspect Sheet
                          </Button>
                        </td>
                        <td className="p-3">
                          <StatusBadge status={item.workStatus} />
                        </td>
                        <td className="p-3 text-muted-foreground font-mono text-[11px]">{item.updatedAt}</td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            onClick={() => handleOpenUpdatePanel(item)}
                            className="h-7 text-xs rounded-none cursor-pointer bg-rose-600 hover:bg-rose-700 text-white font-semibold"
                          >
                            Update Work
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {/* SECTION 6: PRODUCTION WORK UPDATE PANEL DIALOG */}
        <Dialog open={isUpdatePanelOpen} onOpenChange={setIsUpdatePanelOpen}>
          <DialogContent className="max-w-2xl bg-card border-border rounded-none shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Update Production Work — {editingSegment?.segmentId}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Batch: {activeBatch.batchName} &bull; Source Type: {activeBatch.sourceType}
              </DialogDescription>
            </DialogHeader>

            {editingSegment && (
              <div className="flex flex-col gap-6 py-2">
                {/* 1. SOURCE UNIT PROGRESS */}
                <div className="border-border bg-secondary/30 border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>1. Source Unit Progress</span>
                    <span className="text-primary font-mono">{Math.round(((formCompletedUnits || 0) / editingSegment.totalSourceUnits) * 100)}% Progress</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Source Units</span>
                      <span className="text-foreground font-mono font-bold text-sm block mt-0.5">{editingSegment.totalSourceUnits}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Completed Units</span>
                      <Input
                        type="number"
                        min={0}
                        max={editingSegment.totalSourceUnits}
                        value={formCompletedUnits}
                        onChange={(e) => setFormCompletedUnits(Math.min(editingSegment.totalSourceUnits, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="h-8 text-xs font-mono rounded-none mt-0.5 bg-background"
                      />
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Remaining Units</span>
                      <span className="text-amber-500 font-mono font-bold text-sm block mt-2">
                        {Math.max(0, editingSegment.totalSourceUnits - formCompletedUnits)}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Progress Bar</span>
                      <Progress
                        value={Math.round(((formCompletedUnits || 0) / editingSegment.totalSourceUnits) * 100)}
                        className="h-2 mt-3 rounded-none bg-secondary"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. HOURLY PRODUCTIVITY */}
                <div className="border-border bg-card border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> 2. Hourly Productivity
                  </span>
                  <p className="text-muted-foreground text-[11px]">
                    Enter records entered during each standard working hour slot.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STANDARD_WORKING_HOURS.map((slot) => (
                      <div key={slot} className="border-border bg-background/60 border p-2 flex flex-col gap-1">
                        <Label className="text-[10px] text-muted-foreground font-medium">{slot}</Label>
                        <Input
                          type="number"
                          min={0}
                          value={formHourlyRecords[slot] || 0}
                          onChange={(e) => handleHourlyRecordChange(slot, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs font-mono rounded-none bg-background"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. TOTAL RECORDS ENTERED */}
                <div className="border-border bg-secondary/30 border p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-xs font-bold uppercase tracking-wider block">
                      3. Total Records Entered
                    </span>
                    <span className="text-muted-foreground text-[11px] block mt-0.5">
                      Automatically calculated from hourly entries or updated.
                    </span>
                  </div>
                  <div className="w-40">
                    <Input
                      type="number"
                      min={0}
                      value={formTotalRecords}
                      onChange={(e) => setFormTotalRecords(Math.max(0, parseInt(e.target.value) || 0))}
                      className="h-8 font-mono text-sm font-bold text-primary rounded-none bg-background text-right"
                    />
                  </div>
                </div>

                {/* 4. PRODUCTION OUTPUT FILE */}
                <div className="border-border bg-card border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4 text-primary" /> 4. Production Output File
                  </span>

                  {formFileName ? (
                    <div className="border-border bg-background flex items-center justify-between border p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono font-medium text-foreground">{formFileName}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormFileName("")}
                        className="h-6 text-[10px] text-rose-500 hover:text-rose-600 rounded-none cursor-pointer"
                      >
                        <X className="h-3 w-3 mr-1" /> Replace File
                      </Button>
                    </div>
                  ) : (
                    <div className="border-dashed border-2 border-border/80 bg-background/40 p-6 flex flex-col items-center justify-center gap-2 text-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">
                        Drag and drop production output file or click to select
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setFormFileName(`prod_output_${editingSegment.segmentId.replace("-", "")}_final.csv`)}
                        className="h-7 text-xs rounded-none cursor-pointer mt-1"
                      >
                        Select Output File
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/60 pt-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdatePanelOpen(false)}
                className="h-8 text-xs rounded-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveProgress(false)}
                className="h-8 text-xs rounded-none cursor-pointer border-primary/50 text-primary hover:bg-primary/10"
              >
                Save Progress (In Progress)
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveProgress(true)}
                className="h-8 text-xs rounded-none cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Complete Work
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SECTION 14 & 15: QC WORK UPDATE PANEL DIALOG */}
        <Dialog open={isQCUpdatePanelOpen} onOpenChange={setIsQCUpdatePanelOpen}>
          <DialogContent className="max-w-3xl bg-card border-border rounded-none shadow-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-purple-500" />
                Update QC Verification — {editingQCSegment?.segmentId}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Batch: {activeBatch.batchName} &bull; Source Type: {activeBatch.sourceType}
              </DialogDescription>
            </DialogHeader>

            {editingQCSegment && (
              <div className="flex flex-col gap-6 py-2">
                {/* 14.1 SOURCE UNIT PROGRESS */}
                <div className="border-border bg-secondary/30 border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>1. Source Unit Progress</span>
                    <span className="text-purple-500 font-mono">{Math.round(((qcFormCompletedUnits || 0) / editingQCSegment.totalSourceUnits) * 100)}% Progress</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Total Source Units</span>
                      <span className="text-foreground font-mono font-bold text-sm block mt-0.5">{editingQCSegment.totalSourceUnits}</span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Completed Units</span>
                      <Input
                        type="number"
                        min={0}
                        max={editingQCSegment.totalSourceUnits}
                        value={qcFormCompletedUnits}
                        onChange={(e) => setQcFormCompletedUnits(Math.min(editingQCSegment.totalSourceUnits, Math.max(0, parseInt(e.target.value) || 0)))}
                        className="h-8 text-xs font-mono rounded-none mt-0.5 bg-background"
                      />
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Remaining Units</span>
                      <span className="text-amber-500 font-mono font-bold text-sm block mt-2">
                        {Math.max(0, editingQCSegment.totalSourceUnits - qcFormCompletedUnits)}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Accuracy Rate</span>
                      <span className="text-emerald-500 font-mono font-bold text-sm block mt-2">
                        {calculatedQCAccuracy}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* 14.2 HOURLY QC VERIFICATION LOG */}
                <div className="border-border bg-card border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-purple-500" /> 2. Hourly QC Verification Log
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {STANDARD_WORKING_HOURS.map((slot) => (
                      <div key={slot} className="border-border bg-background/60 border p-2 flex flex-col gap-1">
                        <Label className="text-[10px] text-muted-foreground font-medium">{slot}</Label>
                        <Input
                          type="number"
                          min={0}
                          value={qcFormHourlyVerified[slot] || 0}
                          onChange={(e) => handleQCHourlyRecordChange(slot, parseInt(e.target.value) || 0)}
                          className="h-7 text-xs font-mono rounded-none bg-background"
                          placeholder="Records Checked"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 14.3 TOTAL RECORDS CHECKED (Auto Calculated) */}
                <div className="border-border bg-secondary/30 border p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-xs font-bold uppercase tracking-wider block">
                      3. Total Records Checked (Auto Calculated)
                    </span>
                    <span className="text-muted-foreground text-[11px] block mt-0.5">
                      Automatically calculated from hourly QC verification log entries.
                    </span>
                  </div>
                  <span className="font-mono text-base font-bold text-purple-500">
                    {calculatedTotalQCChecked} Records
                  </span>
                </div>

                {/* SECTION 15: QC DEFECT & ERROR LOGGER */}
                <div className="border-border bg-card border p-4 flex flex-col gap-4">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-500" /> 4. QC Defect & Error Logger
                  </span>

                  <form onSubmit={handleAddQCDefect} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-secondary/30 p-3 border border-border/80">
                    <div>
                      <Label className="text-[10px] text-muted-foreground">Category</Label>
                      <Select value={defectCategory} onValueChange={setDefectCategory}>
                        <SelectTrigger className="h-8 text-xs rounded-none bg-background mt-0.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none text-xs">
                          <SelectItem value="Data Entry Error">Data Entry Error</SelectItem>
                          <SelectItem value="Spelling Error">Spelling Error</SelectItem>
                          <SelectItem value="Missing Field">Missing Field</SelectItem>
                          <SelectItem value="Formatting Error">Formatting Error</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">Severity</Label>
                      <Select value={defectSeverity} onValueChange={(val) => setDefectSeverity(val as any)}>
                        <SelectTrigger className="h-8 text-xs rounded-none bg-background mt-0.5">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-none text-xs">
                          <SelectItem value="Critical">Critical</SelectItem>
                          <SelectItem value="Major">Major</SelectItem>
                          <SelectItem value="Minor">Minor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">Source Number</Label>
                      <Input
                        value={defectSourceNumber}
                        onChange={(e) => setDefectSourceNumber(e.target.value)}
                        placeholder="e.g. 001, 002"
                        className="h-8 text-xs rounded-none bg-background mt-0.5 font-mono"
                      />
                    </div>

                    <div>
                      <Label className="text-[10px] text-muted-foreground">Record Number (Optional)</Label>
                      <Input
                        value={defectRecordNumber}
                        onChange={(e) => setDefectRecordNumber(e.target.value)}
                        placeholder="e.g. 238"
                        className="h-8 text-xs rounded-none bg-background mt-0.5 font-mono"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Label className="text-[10px] text-muted-foreground">Description</Label>
                      <Input
                        value={defectDescription}
                        onChange={(e) => setDefectDescription(e.target.value)}
                        placeholder="Describe the specific error found..."
                        className="h-8 text-xs rounded-none bg-background mt-0.5"
                      />
                    </div>

                    <div className="sm:col-span-2 flex justify-end">
                      <Button type="submit" size="sm" className="h-7 text-xs rounded-none bg-rose-600 hover:bg-rose-700 text-white cursor-pointer">
                        <Plus className="h-3.5 w-3.5 mr-1" /> Log Defect
                      </Button>
                    </div>
                  </form>

                  {/* Logged Defect Table */}
                  <div className="border border-border">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-secondary/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground">
                          <th className="p-2">Error ID</th>
                          <th className="p-2">Category</th>
                          <th className="p-2">Severity</th>
                          <th className="p-2">Source #</th>
                          <th className="p-2">Record #</th>
                          <th className="p-2">Description</th>
                          <th className="p-2 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {activeDefectLogs.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="p-4 text-center text-muted-foreground text-[11px]">
                              No defects logged yet for this QC segment.
                            </td>
                          </tr>
                        ) : (
                          activeDefectLogs.map((d) => (
                            <tr key={d.id}>
                              <td className="p-2 font-mono font-bold text-rose-500">{d.id}</td>
                              <td className="p-2 font-medium">{d.category}</td>
                              <td className="p-2">
                                <Badge variant="outline" className="text-[9px] rounded-none py-0">
                                  {d.severity}
                                </Badge>
                              </td>
                              <td className="p-2 font-mono">{d.sourceNumber}</td>
                              <td className="p-2 font-mono">{d.recordNumber || "—"}</td>
                              <td className="p-2 text-muted-foreground">{d.description}</td>
                              <td className="p-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveQCDefect(d.id)}
                                  className="text-rose-500 hover:text-rose-600 p-1 cursor-pointer"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 13. QC OUTPUT FILE (XLSX, XLS, Excel) */}
                <div className="border-border bg-card border p-4 flex flex-col gap-3">
                  <span className="text-foreground text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <FileSpreadsheet className="h-4 w-4 text-purple-500" /> 5. QC Output File (Excel / XLSX)
                  </span>

                  {qcFormOutputFile ? (
                    <div className="border-border bg-background flex items-center justify-between border p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-500" />
                        <span className="font-mono font-medium text-foreground">{qcFormOutputFile}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setQcFormOutputFile("")}
                        className="h-6 text-[10px] text-rose-500 hover:text-rose-600 rounded-none cursor-pointer"
                      >
                        <X className="h-3 w-3 mr-1" /> Replace File
                      </Button>
                    </div>
                  ) : (
                    <div className="border-dashed border-2 border-border/80 bg-background/40 p-5 flex flex-col items-center justify-center gap-2 text-center">
                      <Upload className="h-6 w-6 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground font-medium">
                        Attach QC verification output file (XLSX, XLS)
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setQcFormOutputFile(`qc_report_${editingQCSegment.segmentId.replace("-", "")}.xlsx`)}
                        className="h-7 text-xs rounded-none cursor-pointer mt-1"
                      >
                        Select QC File (.xlsx)
                      </Button>
                    </div>
                  )}
                </div>

                {/* 12. QC STATUS SELECTION (In Progress, Passed, Failed) */}
                <div className="border-border bg-secondary/30 border p-4 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-foreground text-xs font-bold uppercase tracking-wider block">
                      6. QC Status Selection
                    </span>
                    <span className="text-muted-foreground text-[11px] block mt-0.5">
                      Select Passed if QC is successful, or Failed to send segment to Production Rework.
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setQcFormStatus("In Progress")}
                      className={`px-3 py-1.5 text-xs rounded-none border cursor-pointer ${
                        qcFormStatus === "In Progress"
                          ? "bg-amber-500 text-white font-bold border-amber-600"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      type="button"
                      onClick={() => setQcFormStatus("Passed")}
                      className={`px-3 py-1.5 text-xs rounded-none border cursor-pointer ${
                        qcFormStatus === "Passed"
                          ? "bg-emerald-600 text-white font-bold border-emerald-700"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      Passed
                    </button>
                    <button
                      type="button"
                      onClick={() => setQcFormStatus("Failed")}
                      className={`px-3 py-1.5 text-xs rounded-none border cursor-pointer ${
                        qcFormStatus === "Failed"
                          ? "bg-rose-600 text-white font-bold border-rose-700"
                          : "bg-background text-muted-foreground border-border"
                      }`}
                    >
                      Failed
                    </button>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/60 pt-3 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsQCUpdatePanelOpen(false)}
                className="h-8 text-xs rounded-none cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSaveQCProgress(false)}
                className="h-8 text-xs rounded-none cursor-pointer border-purple-500/50 text-purple-500 hover:bg-purple-500/10"
              >
                Save Progress
              </Button>
              <Button
                size="sm"
                onClick={() => handleSaveQCProgress(true)}
                className="h-8 text-xs rounded-none cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                <Check className="h-3.5 w-3.5 mr-1" /> Submit QC Work
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SECTION 3, 4, 5: SOURCE TABLE POPUP MODAL */}
        <Dialog open={isSourceTableModalOpen} onOpenChange={setIsSourceTableModalOpen}>
          <DialogContent className="max-w-3xl sm:max-w-3xl w-full bg-card border-border rounded-none shadow-xl">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Segment Source Units
              </DialogTitle>
              <div className="text-xs text-muted-foreground space-y-1 mt-2 bg-secondary/30 p-3 border border-border/80">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Segment ID:</span>
                  <span className="font-mono font-semibold text-primary">{sourceTableSegment?.segmentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-foreground">Assigned Segment Source Unit Range:</span>
                  <span className="font-mono text-foreground font-semibold">{sourceTableSegment?.sourceUnitRange}</span>
                </div>
              </div>
            </DialogHeader>

            {sourceTableSegment && (
              <div className="flex flex-col gap-4 py-2">
                <div className="border border-border overflow-x-auto overflow-y-auto max-h-[55vh] w-full">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground sticky top-0 bg-secondary">
                        <th className="p-3">Source ID</th>
                        <th className="p-3">Source Number</th>
                        <th className="p-3">Source File</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {generateFullSourceUnitsList(sourceTableSegment).map((unit) => (
                        <tr key={unit.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="p-3 font-mono font-bold text-foreground">{unit.id}</td>
                          <td className="p-3 font-mono">{unit.sourceNumber}</td>
                          <td className="p-3 font-mono text-muted-foreground">{unit.sourceFileName}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => toast.info(`Opening ${unit.sourceFileName}`)}
                                title="Open Source File"
                                className="h-7 w-7 rounded-none cursor-pointer hover:bg-secondary text-foreground"
                              >
                                <ExternalLink className="h-3.5 w-3.5 text-primary" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => toast.success(`Downloading ${unit.sourceFileName}`)}
                                title="Download Source File"
                                className="h-7 w-7 rounded-none cursor-pointer border-border"
                              >
                                <Download className="h-3.5 w-3.5 text-foreground" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/60 pt-3 flex items-center justify-between">
              {/* Common Button: Download All */}
              <Button
                variant="default"
                size="sm"
                onClick={() => toast.success(`Downloading all source units for ${sourceTableSegment?.segmentId} as ZIP archive...`)}
                className="h-8 text-xs rounded-none cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" /> Download All
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSourceTableModalOpen(false)}
                className="h-8 text-xs rounded-none cursor-pointer"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SECTION 17 & 19: INSPECT SHEET POPUP MODAL */}
        <Dialog open={isInspectSheetOpen} onOpenChange={setIsInspectSheetOpen}>
          <DialogContent className="max-w-2xl bg-card border-border rounded-none shadow-xl">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-rose-500" />
                QC Error Inspect Sheet — {inspectingSegment?.segmentId}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Log of QC defects that caused rework or required correction.
              </DialogDescription>
            </DialogHeader>

            {inspectingSegment && (
              <div className="flex flex-col gap-4 py-2">
                <div className="border border-border overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-secondary/40 border-b border-border text-[10px] uppercase font-bold text-muted-foreground">
                        <th className="p-2.5">Error ID</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Severity</th>
                        <th className="p-2.5">Source #</th>
                        <th className="p-2.5">Record #</th>
                        <th className="p-2.5">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {(inspectingSegment.qcDefects && inspectingSegment.qcDefects.length > 0
                        ? inspectingSegment.qcDefects
                        : [
                            {
                              id: "ERR-001",
                              category: "Data Entry Error",
                              severity: "Critical",
                              sourceNumber: "255",
                              recordNumber: "042",
                              description: inspectingSegment?.reworkReason || "QC Failed - Date field illegible in original keying",
                              loggedAt: "Today",
                            },
                          ]
                      ).map((err) => (
                        <tr key={err.id}>
                          <td className="p-2.5 font-mono font-bold text-rose-500">{err.id}</td>
                          <td className="p-2.5 font-medium">{err.category}</td>
                          <td className="p-2.5">
                            <Badge variant="outline" className="text-[9px] rounded-none py-0">
                              {err.severity}
                            </Badge>
                          </td>
                          <td className="p-2.5 font-mono">{err.sourceNumber}</td>
                          <td className="p-2.5 font-mono">{err.recordNumber || "—"}</td>
                          <td className="p-2.5 text-muted-foreground">{err.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/60 pt-3 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInspectSheetOpen(false)}
                className="h-8 text-xs rounded-none cursor-pointer"
              >
                Close Inspect Sheet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* SECTION 9: PRODUCTION OUTPUT FILE VIEWER MODAL */}
        <Dialog open={isProdOutputFileOpen} onOpenChange={setIsProdOutputFileOpen}>
          <DialogContent className="max-w-lg bg-card border-border rounded-none shadow-xl">
            <DialogHeader className="border-b border-border/60 pb-3">
              <DialogTitle className="text-foreground text-lg font-bold flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-primary" />
                Production Output File Viewer
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                File: {viewingProdOutputFile}
              </DialogDescription>
            </DialogHeader>

            <div className="border border-border bg-background p-6 flex flex-col items-center justify-center gap-2 text-center my-2">
              <FileText className="h-12 w-12 text-primary/60 mb-1" />
              <span className="font-mono font-bold text-sm text-foreground">{viewingProdOutputFile}</span>
              <span className="text-xs text-muted-foreground">Production output submission ready for QC verification.</span>
            </div>

            <DialogFooter className="border-t border-border/60 pt-3 flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => toast.info(`Opening ${viewingProdOutputFile} in file viewer`)}
                className="h-8 text-xs rounded-none cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5 mr-1" /> Open
              </Button>
              <Button
                size="sm"
                onClick={() => toast.success(`Downloading ${viewingProdOutputFile}`)}
                className="h-8 text-xs rounded-none cursor-pointer bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                <Download className="h-3.5 w-3.5 mr-1" /> Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
     LEVEL 2: VIEW PROJECT (CONTAINING EXACTLY TWO SECTIONS: OVERVIEW & BATCHES)
     ------------------------------------------------------------------------- */
  if (activeProject) {
    return (
      <div className="flex flex-1 flex-col gap-6 p-6">
        {/* Navigation Breadcrumb Bar */}
        <div className="border-border bg-card flex flex-col justify-between gap-4 border p-4 shadow-xs md:flex-row md:items-center">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={handleBackToProjects}
              className="text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              My Projects
            </button>
            <ChevronRight className="text-muted-foreground h-3.5 w-3.5" />
            <span className="text-foreground font-semibold">
              {activeProject.projectName}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleBackToProjects}
            className="border-border h-8 gap-1 rounded-none text-xs font-medium cursor-pointer self-start md:self-auto"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to My Projects
          </Button>
        </div>

        {/* SECTION 3 & 4: PROJECT DETAILS (EXACTLY TWO SECTIONS: OVERVIEW & BATCHES) */}
        <Tabs
          value={projectDetailTab}
          onValueChange={setProjectDetailTab}
          className="w-full flex flex-col gap-6"
        >
          <div className="border-b border-border bg-card px-6 pt-3">
            <TabsList className="h-10 space-x-6 border-b-0 bg-transparent p-0">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-bold transition-all data-[state=active]:bg-transparent cursor-pointer"
              >
                Project Overview
              </TabsTrigger>
              <TabsTrigger
                value="batches"
                className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-bold transition-all data-[state=active]:bg-transparent cursor-pointer flex items-center gap-2"
              >
                Project Batches
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary rounded-none text-[10px]"
                >
                  {assignedBatchesOnly.length}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: PROJECT OVERVIEW */}
          <TabsContent value="overview" className="mt-0 flex flex-col gap-6">
            <Card className="bg-card border-border rounded-none border p-6 shadow-none flex flex-col gap-6">
              {/* Header with Status placed at TOP-RIGHT */}
              <div className="border-b border-border/60 pb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground font-mono text-xs font-bold">
                      {activeProject.projectId}
                    </span>
                    <h1 className="text-foreground text-xl font-bold tracking-tight">
                      {activeProject.projectName}
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1 max-w-3xl leading-relaxed">
                    {activeProject.description}
                  </p>
                </div>

                {/* Project Status placed at TOP-RIGHT */}
                <div className="flex shrink-0 items-center gap-2">
                  <span className="text-muted-foreground text-xs font-medium">Status:</span>
                  <StatusBadge status={activeProject.projectStatus} />
                </div>
              </div>

              {/* Exact Fields required in Project Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Project ID
                  </span>
                  <span className="text-foreground font-mono font-bold text-sm mt-1 block">
                    {activeProject.projectId}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Project Name
                  </span>
                  <span className="text-foreground font-bold text-sm mt-1 block">
                    {activeProject.projectName}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Client Name
                  </span>
                  <span className="text-foreground font-medium text-sm mt-1 block">
                    {activeProject.clientName}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Started At
                  </span>
                  <span className="text-foreground font-medium mt-1 block">
                    {activeProject.startedAt}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Project Type
                  </span>
                  <span className="text-foreground font-medium mt-1 block">
                    Data Processing
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Work Involvement
                  </span>
                  <div className="mt-1">
                    <WorkInvolvementBadge involvement={activeProject.workInvolvement} />
                  </div>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Team
                  </span>
                  <span className="text-foreground font-medium mt-1 flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-primary" /> {activeProject.team}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Role Designation
                  </span>
                  <span className="text-primary font-bold mt-1 flex items-center gap-1.5">
                    <UserCheck className="h-3.5 w-3.5" /> {activeProject.roleDesignation}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px] uppercase tracking-wider font-semibold">
                    Shift
                  </span>
                  <span className="text-foreground font-medium mt-1 flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {activeProject.shift}
                  </span>
                </div>
              </div>

              {/* Client Attachments Section */}
              <div className="border-t border-border/60 pt-5 mt-2 flex flex-col gap-3">
                <span className="text-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-primary" /> Client Attachments
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeProject.clientAttachments.map((att) => (
                    <div
                      key={att.id}
                      className="border-border bg-background flex items-center justify-between border p-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <FileText className="h-4 w-4 shrink-0 text-primary" />
                        <div className="flex flex-col truncate">
                          <span className="text-foreground font-medium truncate">
                            {att.name}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {att.size}
                          </span>
                        </div>
                      </div>

                      {/* ONLY View & Download actions provided */}
                      <div className="flex items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toast.info(`Viewing ${att.name}`)}
                          className="h-7 px-2 text-xs rounded-none cursor-pointer"
                          title="View attachment"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toast.success(`Downloading ${att.name}`)}
                          className="h-7 px-2 text-xs rounded-none cursor-pointer"
                          title="Download attachment"
                        >
                          <Download className="h-3.5 w-3.5 mr-1" /> Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* TAB 2: PROJECT BATCHES */}
          <TabsContent value="batches" className="mt-0 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="text-primary h-5 w-5" />
                <h2 className="text-foreground text-lg font-bold tracking-tight">
                  Project Batches
                </h2>
                <Badge
                  variant="outline"
                  className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
                >
                  {assignedBatchesOnly.length} Assigned Batches
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Displaying only batches with your assigned segments.
              </p>
            </div>

            {/* BATCH CARDS (SECTION 1: Replaced Segments Received/Completed with Production, QC, Rework counts) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {assignedBatchesOnly.map((batch) => (
                <Card
                  key={batch.id}
                  className="bg-card border-border rounded-none border p-5 shadow-none flex flex-col justify-between hover:border-primary/50 transition-colors"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header: Batch ID & Batch Name */}
                    <div className="flex items-start justify-between gap-2 border-b border-border/60 pb-3">
                      <div>
                        <span className="text-muted-foreground font-mono text-[10px] uppercase font-bold block">
                          {batch.batchId}
                        </span>
                        <h3 className="text-foreground font-bold text-sm leading-tight mt-0.5">
                          {batch.batchName}
                        </h3>
                      </div>
                      <StatusBadge status={batch.status} />
                    </div>

                    {/* Exact Fields required in Batch Cards */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Type of Record
                        </span>
                        <span className="text-foreground font-medium mt-0.5 block">
                          {batch.recordType}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Language
                        </span>
                        <span className="text-foreground font-medium mt-0.5 block">
                          {batch.language}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Source Type
                        </span>
                        <span className="text-foreground font-semibold mt-0.5 block">
                          {batch.sourceType}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Production Segments
                        </span>
                        <span className="text-blue-500 font-mono font-semibold mt-0.5 block">
                          {batch.workItems.filter((i) => i.workType === "Production").length}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          QC Segments
                        </span>
                        <span className="text-purple-500 font-mono font-semibold mt-0.5 block">
                          {batch.workItems.filter((i) => i.workType === "QC").length}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Rework Segments
                        </span>
                        <span className="text-rose-500 font-mono font-semibold mt-0.5 block">
                          {batch.workItems.filter((i) => i.workType === "Rework").length}
                        </span>
                      </div>

                      <div className="col-span-2 border-t border-border/40 pt-2 mt-1">
                        <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                          Work Involvement
                        </span>
                        <div className="mt-0.5">
                          <WorkInvolvementBadge involvement={batch.workInvolvement} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* OPEN BATCH BUTTON */}
                  <div className="pt-4 mt-4 border-t border-border/60">
                    <Button
                      onClick={() => handleOpenBatch(batch.id)}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground w-full h-8 text-xs font-semibold rounded-none cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      Open Batch <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  /* -------------------------------------------------------------------------
     LEVEL 1: MAIN "MY PROJECTS" PAGE (TABS + SORTED PROJECT CARDS)
     ------------------------------------------------------------------------- */
  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Banner - Standard application header */}
      <div className="border-border bg-card flex flex-col justify-between gap-4 border p-5 shadow-xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              My Projects
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
            >
              {displayedProjects.length} Projects
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Assigned projects and production batches for employee operations.
          </p>
        </div>
      </div>

      {/* SECTION 1: TABS (ALL / IN PROGRESS) */}
      <div className="bg-card border-border border p-2">
        <Tabs
          value={projectListTab}
          onValueChange={setProjectListTab}
          className="w-full"
        >
          <TabsList className="h-9 space-x-2 bg-transparent p-0">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-none text-xs font-semibold px-4 py-1.5 transition-all cursor-pointer"
            >
              All ({projectsList.length})
            </TabsTrigger>
            <TabsTrigger
              value="in_progress"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-none text-xs font-semibold px-4 py-1.5 transition-all cursor-pointer"
            >
              In Progress ({projectsList.filter((p) => p.projectStatus === "In Progress").length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground rounded-none text-xs font-semibold px-4 py-1.5 transition-all cursor-pointer"
            >
              Completed ({projectsList.filter((p) => p.projectStatus === "Completed").length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* SECTION 2: PROJECT CARDS (Sorted by Project ID in ascending order) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {displayedProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-card border-border rounded-none border p-5 shadow-none flex flex-col justify-between hover:border-primary/50 transition-colors"
          >
            <div className="flex flex-col gap-3">
              {/* Card Header: Project ID & Status */}
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-[11px] font-semibold uppercase">
                    ID:
                  </span>
                  <span className="text-foreground font-mono font-bold text-xs">
                    {project.projectId}
                  </span>
                </div>
                <StatusBadge status={project.projectStatus} />
              </div>

              {/* Project Name */}
              <div>
                <h2 className="text-foreground font-bold text-base tracking-tight leading-snug">
                  {project.projectName}
                </h2>
              </div>

              {/* EXACT required Project Card Fields */}
              <div className="grid grid-cols-2 gap-3 text-xs pt-1">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                    Client Name
                  </span>
                  <span className="text-foreground font-medium mt-0.5 block">
                    {project.clientName}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                    Started At
                  </span>
                  <span className="text-foreground font-medium mt-0.5 block">
                    {project.startedAt}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                    Project Type
                  </span>
                  <span className="text-foreground font-medium mt-0.5 block">
                    Data Processing
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                    Project Status
                  </span>
                  <span className="mt-0.5 block">
                    <StatusBadge status={project.projectStatus} />
                  </span>
                </div>

                <div className="col-span-2 border-t border-border/40 pt-2 mt-1">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider font-semibold">
                    Work Involvement
                  </span>
                  <div className="mt-1">
                    <WorkInvolvementBadge involvement={project.workInvolvement} />
                  </div>
                </div>
              </div>
            </div>

            {/* View Project Button */}
            <div className="pt-4 mt-4 border-t border-border/60">
              <Button
                onClick={() => handleViewProject(project.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground w-full h-8 text-xs font-semibold rounded-none cursor-pointer flex items-center justify-center gap-1.5"
              >
                View Project <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
