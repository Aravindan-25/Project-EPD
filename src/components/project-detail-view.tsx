import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  ExternalLink,
  Layers,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Briefcase,
  Activity,
  Plus,
  Pencil,
  Tag,
  Paperclip,
  Table,
  LayoutGrid,
  History,
  Download,
  Upload,
  Eye,
  Trash2,
  Image as ImageIcon,
  FolderUp,
  File,
  Search,
  ChevronDown,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Project, TeamMember, ProjectTeam } from "@/types/project";
import { ManageTeamDialog } from "@/components/manage-team-dialog";
import {
  EmployeeQuickProfileDrawer,
  type QuickProfileEmployeeData,
} from "@/components/employee-quick-profile-drawer";
import { EmployeeFullProfileView } from "@/components/employee-full-profile-view";

interface AuditDiffItem {
  field: string;
  oldVal: string;
  newVal: string;
  user: string;
  date: string;
}

interface ActivityLogRecord {
  time: string;
  user: string;
  role: string;
  type: string;
  entity: string;
  target: string;
  description: string;
  status: string;
}

interface DpRosterMember {
  id: string;
  name: string;
  empCode: string;
  initials: string;
  role: string;
  shift: string;
  involvements: string[];
  lastUpdated: string;
  dateTime?: string;
}

const INITIAL_DP_ROSTER: DpRosterMember[] = [
  {
    id: "dp-emp-1",
    name: "Mathan Kumar",
    empCode: "EMP-001",
    initials: "MK",
    role: "Senior Processing Specialist",
    shift: "Morning",
    involvements: ["Production", "QC"],
    lastUpdated: "6 Sep 2026 12:10pm",
  },
  {
    id: "dp-emp-2",
    name: "Sarah Chen",
    empCode: "EMP-002",
    initials: "SC",
    role: "Data Processing Specialist",
    shift: "Morning",
    involvements: ["Production", "QC"],
    lastUpdated: "6 Sep 2026 12:10pm",
  },
];

interface ClientAttachmentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  attachedAt: string;
}

const INITIAL_CLIENT_ATTACHMENTS: ClientAttachmentItem[] = [
  {
    id: "att-1",
    name: "BioTech_Alpha_Guidelines_v3.pdf",
    type: "PDF Document",
    size: "4.2 MB",
    attachedAt: "6 Sep 2026 12:10pm",
  },
  {
    id: "att-2",
    name: "Cell_Taxonomy_Vocabulary_2026.json",
    type: "JSON Document",
    size: "1.8 MB",
    attachedAt: "7 Sep 2026 10:45am",
  },
];

interface DpBatchItem {
  id: string;
  name: string;
  type: string;
  lang: string;
  sourceType: "Images" | "PDF";
  totalUnits: number;
  records?: string;
  datetime?: string;
  lastUpdated: string;
  images?: string;
  status:
    | "CREATED"
    | "SEGMENTED"
    | "PRODUCTION IN PROGRESS"
    | "QC IN PROGRESS"
    | "READY FOR CONSOLIDATION"
    | "COMPLETED"
    | string;
  statusType?: string;
  files?: Array<{ name: string; size: string; pages?: number }>;
}

const INITIAL_DP_BATCHES: DpBatchItem[] = [
  {
    id: "BAT-001",
    name: "Alpha Records - Batch 01",
    type: "Birth",
    lang: "English",
    sourceType: "Images",
    totalUnits: 100,
    lastUpdated: "6 Sep 2026 12:10pm",
    status: "COMPLETED",
  },
  {
    id: "BAT-002",
    name: "Alpha Records - Batch 02",
    type: "Mixed",
    lang: "French",
    sourceType: "Images",
    totalUnits: 100,
    lastUpdated: "7 Sep 2026 10:45am",
    status: "PRODUCTION IN PROGRESS",
  },
  {
    id: "BAT-003",
    name: "Alpha Records - Batch 03",
    type: "Community",
    lang: "Spanish",
    sourceType: "PDF",
    totalUnits: 100,
    lastUpdated: "7 Sep 2026 02:15pm",
    status: "CREATED",
  },
];

const formatLastUpdated = (d = new Date()) => {
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
  const day = d.getDate();
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
};

const renderBatchStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          COMPLETED
        </span>
      );
    case "READY FOR CONSOLIDATION":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-cyan-600 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
          READY FOR CONSOLIDATION
        </span>
      );
    case "QC IN PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-purple-600 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400">
          <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
          QC IN PROGRESS
        </span>
      );
    case "PRODUCTION IN PROGRESS":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
          PRODUCTION IN PROGRESS
        </span>
      );
    case "SEGMENTED":
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
          SEGMENTED
        </span>
      );
    case "CREATED":
    default:
      return (
        <span className="bg-primary/10 border-primary/30 text-primary inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold whitespace-nowrap">
          <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
          {status || "CREATED"}
        </span>
      );
  }
};

const EMPLOYEE_DIRECTORY = [
  {
    id: "dir-1",
    name: "Mathan Kumar",
    empId: "EMP-1042",
    designation: "Senior Production Specialist",
  },
  {
    id: "dir-2",
    name: "Sarah Chen",
    empId: "EMP-1002",
    designation: "Data Processing Specialist",
  },
  {
    id: "dir-3",
    name: "Rajesh Kumar",
    empId: "EMP-1015",
    designation: "Quality Assurance Lead",
  },
  {
    id: "dir-4",
    name: "Priya Sharma",
    empId: "EMP-1028",
    designation: "Data Annotation Specialist",
  },
  {
    id: "dir-5",
    name: "Vikram Malhotra",
    empId: "EMP-1001",
    designation: "Senior Project Manager",
  },
  {
    id: "dir-6",
    name: "Anita Desai",
    empId: "EMP-1033",
    designation: "QC & Verification Specialist",
  },
  {
    id: "dir-7",
    name: "Alex Rivera",
    empId: "EMP-1055",
    designation: "Senior Workflow Specialist",
  },
  {
    id: "dir-8",
    name: "Elena Rostova",
    empId: "EMP-1064",
    designation: "Data Processing Specialist",
  },
];

const WORLD_LANGUAGES = [
  "Afrikaans",
  "Albanian",
  "Amharic",
  "Arabic",
  "Armenian",
  "Assamese",
  "Azerbaijani",
  "Basque",
  "Belarusian",
  "Bengali",
  "Bhojpuri",
  "Bosnian",
  "Bulgarian",
  "Burmese",
  "Catalan",
  "Cebuano",
  "Chinese (Cantonese)",
  "Chinese (Mandarin)",
  "Chinese (Wu)",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "English",
  "Esperanto",
  "Estonian",
  "Filipino (Tagalog)",
  "Finnish",
  "French",
  "Galician",
  "Georgian",
  "German",
  "Greek",
  "Gujarati",
  "Haitian Creole",
  "Hausa",
  "Hebrew",
  "Hindi",
  "Hmong",
  "Hungarian",
  "Icelandic",
  "Igbo",
  "Indonesian",
  "Irish",
  "Italian",
  "Japanese",
  "Javanese",
  "Kannada",
  "Kazakh",
  "Khmer",
  "Kinyarwanda",
  "Korean",
  "Kurdish",
  "Lao",
  "Latin",
  "Latvian",
  "Lithuanian",
  "Luxembourgish",
  "Macedonian",
  "Malagasy",
  "Malay",
  "Malayalam",
  "Maltese",
  "Maori",
  "Marathi",
  "Mongolian",
  "Nepali",
  "Norwegian",
  "Odia (Oriya)",
  "Pashto",
  "Persian (Farsi)",
  "Polish",
  "Portuguese",
  "Punjabi",
  "Romanian",
  "Russian",
  "Samoan",
  "Scots Gaelic",
  "Serbian",
  "Sesotho",
  "Shona",
  "Sindhi",
  "Sinhala",
  "Slovak",
  "Slovenian",
  "Somali",
  "Spanish",
  "Sundanese",
  "Swahili",
  "Swedish",
  "Tajik",
  "Tamil",
  "Tatar",
  "Telugu",
  "Thai",
  "Turkish",
  "Turkmen",
  "Ukrainian",
  "Urdu",
  "Uyghur",
  "Uzbek",
  "Vietnamese",
  "Welsh",
  "Xhosa",
  "Yiddish",
  "Yoruba",
  "Zulu",
];

const GENERATE_100_TEST_IMAGES = () =>
  Array.from({ length: 100 }, (_, i) => ({
    name: `image_${String(i + 1).padStart(3, "0")}.jpg`,
    size: `${(1.2 + ((i * 7) % 25) * 0.1).toFixed(1)} MB`,
  }));

const calculateShift = (
  hourStr: string,
  ampm: string,
): { shift: string; label: string } => {
  let h = parseInt(hourStr, 10);
  if (isNaN(h)) h = 9;
  if (ampm === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }

  if (h >= 6 && h < 14) {
    return { shift: "Morning", label: "Morning Shift" };
  } else if (h >= 14 && h < 22) {
    return { shift: "Evening", label: "Evening Shift" };
  } else {
    return { shift: "Night", label: "Night Shift" };
  }
};

interface ProjectDetailViewProps {
  project: Project;
  onBack: () => void;
  onUpdateTeam: (
    projectId: string,
    teamMembers: TeamMember[],
    teams?: ProjectTeam[],
  ) => void;
}

export function ProjectDetailView({
  project,
  onBack,
  onUpdateTeam,
}: ProjectDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [dpTab, setDpTab] = useState<
    "overview" | "team" | "batches" | "attachments" | "activity"
  >("overview");
  const [activitySubTab, setActivitySubTab] = useState<
    "user_actions" | "data_diffs"
  >("user_actions");

  // Data Processing Live Project State
  const [dpProject, setDpProject] = useState<Project>(project);

  // Audit Log & Activity Log State
  const [auditDiffs, setAuditDiffs] = useState<AuditDiffItem[]>([
    {
      field: "Client Email",
      oldVal: "biotech@old.com",
      newVal: "biotech.client@biotech-global.com",
      user: "Vikram Malhotra",
      date: "1 Sep 2026 11:20am",
    },
    {
      field: "Project Status",
      oldVal: "CREATED",
      newVal: "IN_PROGRESS",
      user: "Vikram Malhotra",
      date: "25 Aug 2026 7:30pm",
    },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLogRecord[]>([
    {
      time: "7 Sep 2026 10:45am",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "ATTACHMENT_UPLOAD",
      entity: "Attachment",
      target: "Cell_Taxonomy_Vocabulary_2026.json",
      description:
        'Uploaded client attachment "Cell_Taxonomy_Vocabulary_2026.json" (1.8 MB).',
      status: "SUCCESS",
    },
    {
      time: "7 Sep 2026 10:45am",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "BATCH_CREATION",
      entity: "Batch",
      target: "BAT-002",
      description:
        'Created new Images batch "Alpha Records - Batch 02" with 100 total source units.',
      status: "SUCCESS",
    },
    {
      time: "6 Sep 2026 12:10pm",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "TEAM_ASSIGNMENT",
      entity: "Employee",
      target: "EMP-1002",
      description:
        "Assigned Sarah Chen (Data Processing Specialist) to project team with Morning Shift.",
      status: "SUCCESS",
    },
    {
      time: "6 Sep 2026 12:10pm",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "ATTACHMENT_UPLOAD",
      entity: "Attachment",
      target: "BioTech_Alpha_Guidelines_v3.pdf",
      description:
        'Uploaded client attachment "BioTech_Alpha_Guidelines_v3.pdf" (4.2 MB).',
      status: "SUCCESS",
    },
    {
      time: "6 Sep 2026 12:10pm",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "BATCH_CREATION",
      entity: "Batch",
      target: "BAT-001",
      description:
        'Created new Images batch "Alpha Records - Batch 01" with 100 total source units.',
      status: "SUCCESS",
    },
    {
      time: "1 Aug 2026 2:30pm",
      user: "Vikram Malhotra",
      role: "Project Manager",
      type: "PROJECT_CREATION",
      entity: "Project",
      target: project.code || "PRJ-001",
      description: `Project "${project.name}" initialized and created in Data Processing department.`,
      status: "SUCCESS",
    },
  ]);

  // Edit Project Configuration Modal State & Form Fields
  const [showEditConfigModal, setShowEditConfigModal] = useState(false);
  const [editName, setEditName] = useState(dpProject.name || "");
  const [editStartDate, setEditStartDate] = useState(
    dpProject.periodStart || "2026-08-01",
  );
  const [editStartTime, setEditStartTime] = useState("09:00");
  const [editTimeAmPm, setEditTimeAmPm] = useState("AM");
  const [editDescription, setEditDescription] = useState(
    dpProject.description || "",
  );
  const [editClientName, setEditClientName] = useState(
    dpProject.clientName || "BioTech Global Corp",
  );
  const [editPrimaryEmail, setEditPrimaryEmail] = useState(
    dpProject.clientEmail || "biotech.client@biotech-global.com",
  );
  const [editSecondaryEmails, setEditSecondaryEmails] = useState<string[]>(
    dpProject.secondaryEmails && dpProject.secondaryEmails.length > 0
      ? dpProject.secondaryEmails
      : ["ops@biotech-global.com", "delivery@biotech-global.com"],
  );

  const openEditProjectModal = () => {
    setEditName(dpProject.name || "");
    setEditStartDate(dpProject.periodStart || "2026-08-01");

    const rawTime = dpProject.startTime || "09:00 AM";
    if (rawTime.includes("PM")) {
      setEditStartTime(rawTime.replace(" PM", "").replace("PM", "").trim());
      setEditTimeAmPm("PM");
    } else if (rawTime.includes("AM")) {
      setEditStartTime(rawTime.replace(" AM", "").replace("AM", "").trim());
      setEditTimeAmPm("AM");
    } else {
      setEditStartTime(rawTime);
      setEditTimeAmPm("AM");
    }

    setEditDescription(dpProject.description || "");
    setEditClientName(dpProject.clientName || "BioTech Global Corp");
    setEditPrimaryEmail(
      dpProject.clientEmail || "biotech.client@biotech-global.com",
    );
    setEditSecondaryEmails(
      dpProject.secondaryEmails && dpProject.secondaryEmails.length > 0
        ? [...dpProject.secondaryEmails]
        : ["ops@biotech-global.com", "delivery@biotech-global.com"],
    );
    setShowEditConfigModal(true);
  };

  const handleCancelProjectConfig = () => {
    setShowEditConfigModal(false);
  };

  const handleSaveProjectConfig = () => {
    if (
      !editName.trim() ||
      !editClientName.trim() ||
      !editPrimaryEmail.trim()
    ) {
      return;
    }

    const now = new Date();
    const formattedDate = formatLastUpdated(now);

    const fullStartTime = `${editStartTime} ${editTimeAmPm}`;
    const cleanedSecondaryEmails = editSecondaryEmails.filter(
      (e) => e.trim().length > 0,
    );

    // Compute Diffs for Project Audit Log
    const newDiffs: AuditDiffItem[] = [];

    if (editName.trim() !== (dpProject.name || "").trim()) {
      newDiffs.push({
        field: "Project Name",
        oldVal: dpProject.name || "N/A",
        newVal: editName.trim(),
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (editStartDate.trim() !== (dpProject.periodStart || "").trim()) {
      newDiffs.push({
        field: "Start Date",
        oldVal: dpProject.periodStart || "N/A",
        newVal: editStartDate.trim(),
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (fullStartTime.trim() !== (dpProject.startTime || "").trim()) {
      newDiffs.push({
        field: "Start Time",
        oldVal: dpProject.startTime || "N/A",
        newVal: fullStartTime.trim(),
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (editDescription.trim() !== (dpProject.description || "").trim()) {
      newDiffs.push({
        field: "Description",
        oldVal: (dpProject.description || "").slice(0, 30) + "...",
        newVal: editDescription.trim().slice(0, 30) + "...",
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (editClientName.trim() !== (dpProject.clientName || "").trim()) {
      newDiffs.push({
        field: "Client Organization",
        oldVal: dpProject.clientName || "N/A",
        newVal: editClientName.trim(),
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (editPrimaryEmail.trim() !== (dpProject.clientEmail || "").trim()) {
      newDiffs.push({
        field: "Primary Email Address",
        oldVal: dpProject.clientEmail || "N/A",
        newVal: editPrimaryEmail.trim(),
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (
      JSON.stringify(cleanedSecondaryEmails) !==
      JSON.stringify(dpProject.secondaryEmails || [])
    ) {
      newDiffs.push({
        field: "Secondary Emails",
        oldVal: (dpProject.secondaryEmails || []).join(", ") || "None",
        newVal: cleanedSecondaryEmails.join(", ") || "None",
        user: dpProject.managerName || "Vikram Malhotra",
        date: formattedDate,
      });
    }

    if (newDiffs.length > 0) {
      setAuditDiffs((prev) => [...newDiffs, ...prev]);
      setActivityLogs((prev) => [
        {
          time: formattedDate,
          user: dpProject.managerName || "Vikram Malhotra",
          role: "Project Manager",
          type: "CONFIG_UPDATE",
          entity: "Project",
          target: dpProject.code || "PRJ-001",
          description: `Updated project configuration (${newDiffs.map((d) => d.field).join(", ")}).`,
          status: "SUCCESS",
        },
        ...prev,
      ]);
    }

    // Update dpProject
    const updated: Project = {
      ...dpProject,
      name: editName.trim(),
      periodStart: editStartDate.trim(),
      startTime: fullStartTime,
      description: editDescription.trim(),
      clientName: editClientName.trim(),
      clientEmail: editPrimaryEmail.trim(),
      secondaryEmails: cleanedSecondaryEmails,
      lastUpdated: formattedDate,
    };

    setDpProject(updated);
    setShowEditConfigModal(false);
  };

  // Data Processing Project Team Roster State
  const [dpRoster, setDpRoster] = useState<DpRosterMember[]>(INITIAL_DP_ROSTER);
  const [showAddEmpModal, setShowAddEmpModal] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState<string | null>(null);

  // Quick Profile & Full Profile States
  const [selectedQuickProfileEmp, setSelectedQuickProfileEmp] =
    useState<QuickProfileEmployeeData | null>(null);
  const [isQuickDrawerOpen, setIsQuickDrawerOpen] = useState(false);
  const [fullProfileEmp, setFullProfileEmp] =
    useState<QuickProfileEmployeeData | null>(null);

  const openQuickProfile = (emp: DpRosterMember) => {
    const isMathan =
      emp.name.toLowerCase().includes("mathan") || emp.empCode === "EMP-001";
    const profileData: QuickProfileEmployeeData = {
      id: emp.id,
      name: isMathan ? "Mathan Kumar" : emp.name,
      empCode: isMathan ? "EMP-001" : emp.empCode,
      status: "Active",
      department: "Data Processing",
      role: isMathan
        ? "Senior Processing Specialist"
        : emp.role || "Data Processing Specialist",
      email: isMathan
        ? "mathan.kumar@epd-erp.io"
        : `${emp.name.toLowerCase().replace(/\s+/g, ".")}@epd-erp.io`,
      joiningDate: "January 10, 2024",
      initials: isMathan ? "MK" : emp.initials,
      rating: "EXCELLENT",
      score: "96.5",
    };
    setSelectedQuickProfileEmp(profileData);
    setIsQuickDrawerOpen(true);
  };

  // Form states for Add/Edit Employee Modal
  const [selectedDirectoryEmpId, setSelectedDirectoryEmpId] = useState("dir-1");
  const [empName, setEmpName] = useState("Mathan Kumar");
  const [empCode, setEmpCode] = useState("EMP-1042");
  const [empRole, setEmpRole] = useState("Data Processing Specialist");
  const [empHour, setEmpHour] = useState("09");
  const [empMinute, setEmpMinute] = useState("30");
  const [empTimeAmPm, setEmpTimeAmPm] = useState("AM");
  const [enableProd, setEnableProd] = useState(true);
  const [enableQC, setEnableQC] = useState(false);

  const openAddEmployee = () => {
    setEditingEmpId(null);
    setSelectedDirectoryEmpId("dir-1");
    setEmpName("Mathan Kumar");
    setEmpCode("EMP-1042");
    setEmpRole("Data Processing Specialist");
    setEmpHour("09");
    setEmpMinute("30");
    setEmpTimeAmPm("AM");
    setEnableProd(true);
    setEnableQC(false);
    setShowAddEmpModal(true);
  };

  const openEditEmployee = (emp: DpRosterMember) => {
    setEditingEmpId(emp.id);
    const found = EMPLOYEE_DIRECTORY.find(
      (e) =>
        e.name.toLowerCase() === emp.name.toLowerCase() ||
        e.empId.toLowerCase() === emp.empCode.toLowerCase(),
    );
    setSelectedDirectoryEmpId(found ? found.id : "dir-1");
    setEmpName(emp.name);
    setEmpCode(emp.empCode);
    setEmpRole(emp.role);

    // Parse time from emp.lastUpdated if available (e.g. "6 Sep 2026 12:10pm" or "09:30 AM")
    const dateSource = emp.lastUpdated || emp.dateTime || "";
    if (dateSource) {
      const match = dateSource.match(/(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)/i);
      if (match) {
        setEmpHour(match[1].padStart(2, "0"));
        setEmpMinute(match[2]);
        setEmpTimeAmPm(match[3].toUpperCase());
      } else {
        setEmpHour("09");
        setEmpMinute("30");
        setEmpTimeAmPm(
          emp.shift === "Evening" || emp.shift === "Night" ? "PM" : "AM",
        );
      }
    } else {
      setEmpHour("09");
      setEmpMinute("30");
      setEmpTimeAmPm(
        emp.shift === "Evening" || emp.shift === "Night" ? "PM" : "AM",
      );
    }

    setEnableProd(emp.involvements.includes("Production"));
    setEnableQC(emp.involvements.includes("QC"));
    setShowAddEmpModal(true);
  };

  const handleSaveEmployee = () => {
    const chosenEmp = EMPLOYEE_DIRECTORY.find(
      (e) => e.id === selectedDirectoryEmpId,
    );
    const finalName = empName.trim() || chosenEmp?.name || "Mathan Kumar";
    const finalCode = empCode.trim() || chosenEmp?.empId || "EMP-1042";
    const initials = finalName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const { shift } = calculateShift(empHour, empTimeAmPm);
    const selectedInvolvements: string[] = [];
    if (enableProd) selectedInvolvements.push("Production");
    if (enableQC) selectedInvolvements.push("QC");
    const finalInvolvements =
      selectedInvolvements.length > 0 ? selectedInvolvements : ["Production"];

    const now = new Date();
    const formattedDate = formatLastUpdated(now);

    if (editingEmpId) {
      setDpRoster((prev) =>
        prev.map((e) =>
          e.id === editingEmpId
            ? {
                ...e,
                name: finalName,
                empCode: finalCode,
                initials: initials || e.initials,
                role: empRole.trim() || "Data Processing Specialist",
                shift: shift,
                involvements: finalInvolvements,
                lastUpdated: formattedDate,
                dateTime: formattedDate,
              }
            : e,
        ),
      );

      setActivityLogs((prev) => [
        {
          time: formattedDate,
          user: dpProject.managerName || "Vikram Malhotra",
          role: "Project Manager",
          type: "TEAM_UPDATE",
          entity: "Employee",
          target: finalCode,
          description: `Updated project team member details for ${finalName} (${empRole.trim() || "Data Processing Specialist"}).`,
          status: "SUCCESS",
        },
        ...prev,
      ]);
    } else {
      const newEmp: DpRosterMember = {
        id: `dp-emp-${Date.now()}`,
        name: finalName,
        empCode: finalCode,
        initials: initials || "EM",
        role: empRole.trim() || "Data Processing Specialist",
        shift: shift,
        involvements: finalInvolvements,
        lastUpdated: formattedDate,
        dateTime: formattedDate,
      };
      setDpRoster((prev) => [newEmp, ...prev]);

      setActivityLogs((prev) => [
        {
          time: formattedDate,
          user: dpProject.managerName || "Vikram Malhotra",
          role: "Project Manager",
          type: "TEAM_ASSIGNMENT",
          entity: "Employee",
          target: finalCode,
          description: `Assigned ${finalName} (${empRole.trim() || "Data Processing Specialist"}) to project team with ${shift} Shift.`,
          status: "SUCCESS",
        },
        ...prev,
      ]);
    }
    setShowAddEmpModal(false);
  };

  const handleDeleteEmployee = (id: string) => {
    setDpRoster((prev) => prev.filter((e) => e.id !== id));
  };

  // Batches State & Create Batch Form State
  const [dpBatches, setDpBatches] = useState<DpBatchItem[]>(INITIAL_DP_BATCHES);
  const [showCreateBatchModal, setShowCreateBatchModal] = useState(false);

  // Create Batch Form fields
  const [batchId, setBatchId] = useState("BAT-004");
  const [batchName, setBatchName] = useState("");
  const [recordType, setRecordType] = useState("Birth");
  const [customRecordType, setCustomRecordType] = useState("");
  const [batchLang, setBatchLang] = useState("English");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [langSearch, setLangSearch] = useState("");
  const langDropdownRef = useRef<HTMLDivElement>(null);
  const [sourceType, setSourceType] = useState<"Images" | "PDF">("Images");
  const [batchDate, setBatchDate] = useState("2026-08-25");
  const [batchTime, setBatchTime] = useState("02:15 PM");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // File Upload State (Defaults to 100 testing images / 100 testing PDF pages)
  const [uploadedImages, setUploadedImages] = useState<
    Array<{ name: string; size: string }>
  >(GENERATE_100_TEST_IMAGES());

  const [uploadedPdfs, setUploadedPdfs] = useState<
    Array<{ name: string; size: string; pages: number }>
  >([{ name: "document_001.pdf", size: "14.2 MB", pages: 100 }]);

  const imageFileInputRef = useRef<HTMLInputElement>(null);
  const imageFolderInputRef = useRef<HTMLInputElement>(null);
  const pdfFileInputRef = useRef<HTMLInputElement>(null);

  const openCreateBatch = () => {
    const nextNum = dpBatches.length + 1;
    setBatchId(`BAT-${String(nextNum).padStart(3, "0")}`);
    setBatchName(`Alpha Records - Batch ${String(nextNum).padStart(2, "0")}`);
    setRecordType("Birth");
    setCustomRecordType("");
    setBatchLang("English");
    setIsLangOpen(false);
    setLangSearch("");
    setSourceType("Images");
    setBatchDate(new Date().toISOString().split("T")[0]);
    setBatchTime("02:15 PM");
    setUploadedImages(GENERATE_100_TEST_IMAGES());
    setUploadedPdfs([
      { name: "document_001.pdf", size: "14.2 MB", pages: 100 },
    ]);
    setShowCreateBatchModal(true);
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Populate 100 testing images upon interaction
    setUploadedImages(GENERATE_100_TEST_IMAGES());
  };

  const handleImageFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Populate 100 testing images upon interaction
    setUploadedImages(GENERATE_100_TEST_IMAGES());
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePdfFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const f = e.target.files[0];
      setUploadedPdfs([
        {
          name: f.name,
          size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
          pages: 100,
        },
      ]);
    } else {
      setUploadedPdfs([
        { name: "document_001.pdf", size: "14.2 MB", pages: 100 },
      ]);
    }
  };

  const handleRemovePdf = (index: number) => {
    setUploadedPdfs((prev) => prev.filter((_, i) => i !== index));
  };

  const totalPdfPages = uploadedPdfs.reduce(
    (acc, p) => acc + (p.pages || 0),
    0,
  );
  const totalSourceUnits =
    sourceType === "Images" ? uploadedImages.length : totalPdfPages;

  const handleCreateBatch = () => {
    if (!batchName.trim()) return;

    const units = totalSourceUnits;
    const effectiveType =
      recordType === "Other" ? customRecordType.trim() || "Other" : recordType;
    const newBatch: DpBatchItem = {
      id: batchId,
      name: batchName.trim(),
      type: effectiveType,
      lang: batchLang,
      sourceType: sourceType,
      totalUnits: units,
      records: `${units} records`,
      datetime: `${batchDate} ${batchTime}`,
      lastUpdated: formatLastUpdated(),
      images: `${sourceType === "Images" ? uploadedImages.length : units} ${sourceType === "Images" ? "images" : "pages"}`,
      status: "CREATED",
      statusType: "primary",
      files: sourceType === "Images" ? uploadedImages : uploadedPdfs,
    };

    setDpBatches((prev) => [newBatch, ...prev]);

    setActivityLogs((prev) => [
      {
        time: formatLastUpdated(),
        user: dpProject.managerName || "Vikram Malhotra",
        role: "Project Manager",
        type: "BATCH_CREATION",
        entity: "Batch",
        target: batchId,
        description: `Created new ${sourceType} batch "${batchName.trim()}" with ${units} total source units.`,
        status: "SUCCESS",
      },
      ...prev,
    ]);

    setShowCreateBatchModal(false);
  };

  // Client Attachments State & Handlers
  const [clientAttachments, setClientAttachments] = useState<
    ClientAttachmentItem[]
  >(INITIAL_CLIENT_ATTACHMENTS);
  const attachmentFileInputRef = useRef<HTMLInputElement>(null);

  const handleDirectFileUpload = (file: File) => {
    const extension = file.name.split(".").pop()?.toUpperCase() || "FILE";
    const typeLabel =
      extension === "PDF"
        ? "PDF Document"
        : extension === "JSON"
          ? "JSON Document"
          : `${extension} File`;
    const formattedDate = formatLastUpdated();
    const newAtt: ClientAttachmentItem = {
      id: `att-${Date.now()}`,
      name: file.name,
      type: typeLabel,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      attachedAt: formattedDate,
    };
    setClientAttachments((prev) => [newAtt, ...prev]);

    setActivityLogs((prev) => [
      {
        time: formattedDate,
        user: dpProject.managerName || "Vikram Malhotra",
        role: "Project Manager",
        type: "ATTACHMENT_UPLOAD",
        entity: "Attachment",
        target: file.name,
        description: `Uploaded client attachment "${file.name}" (${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
        status: "SUCCESS",
      },
      ...prev,
    ]);
  };

  const handleUploadClientAttachment = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      handleDirectFileUpload(e.target.files[0]);
    }
  };

  const handleDeleteClientAttachment = (id: string, name: string) => {
    setClientAttachments((prev) => prev.filter((a) => a.id !== id));
    const formattedDate = formatLastUpdated();
    setActivityLogs((prev) => [
      {
        time: formattedDate,
        user: dpProject.managerName || "Vikram Malhotra",
        role: "Project Manager",
        type: "ATTACHMENT_DELETE",
        entity: "Attachment",
        target: name,
        description: `Deleted client attachment "${name}".`,
        status: "SUCCESS",
      },
      ...prev,
    ]);
  };

  // Batches Sorted in Ascending Order of Batch ID
  const sortedBatches = useMemo(() => {
    return [...dpBatches].sort((a, b) =>
      a.id.localeCompare(b.id, undefined, { numeric: true }),
    );
  }, [dpBatches]);

  const isDataProcessing =
    project.department === "Data Processing" ||
    project.department === "data_processing" ||
    project.projectType?.toLowerCase().includes("data") ||
    project.projectType?.toLowerCase().includes("annotation") ||
    project.id?.startsWith("DP-") ||
    project.id === "prj-01" ||
    project.code === "PRJ-001";

  const totalMembers = project.teams
    ? project.teams.reduce((acc, t) => acc + t.members.length, 0)
    : project.teamMembers?.length || 0;

  if (fullProfileEmp) {
    return (
      <EmployeeFullProfileView
        employee={fullProfileEmp}
        onBack={() => setFullProfileEmp(null)}
      />
    );
  }

  // DATA PROCESSING SPECIAL OVERVIEW VIEW
  if (isDataProcessing) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-col">
        {/* TOP HEADER BAR WITH BACK BUTTON */}
        <div className="border-border bg-card sticky top-0 z-20 border-b p-4 shadow-xs sm:px-6">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="bg-secondary text-secondary-foreground border-border cursor-pointer gap-1.5 text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Button>
            <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs font-semibold">
              Data Processing Overview
            </Badge>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="w-full flex-1 space-y-6 p-4 sm:p-6">
          {/* TOP CARD: PROJECT NAME, TYPE & NAV TABS */}
          <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-bold">
                    {dpProject.code || "PRJ-001"}
                  </span>
                  <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {dpProject.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></span>
                    {dpProject.projectStatus || "IN PROGRESS"}
                  </span>
                </div>

                <p className="text-muted-foreground pt-1 text-xs">
                  Client:{" "}
                  <span className="text-foreground font-semibold">
                    {dpProject.clientName || "BioTech Global Corp"}
                  </span>
                  {" · "}
                  Type:{" "}
                  <span className="text-foreground font-semibold">
                    {dpProject.projectType || "Data Annotation"}
                  </span>
                  {" · "}
                  Start:{" "}
                  <span className="text-foreground font-semibold">
                    {dpProject.periodStart || "2026-08-01"}
                  </span>
                </p>
              </div>
            </div>

            {/* NAV TABS */}
            <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-t pt-3 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setDpTab("overview")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "overview"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <LayoutGrid className="h-4 w-4" />
                Project Overview
              </button>

              <button
                type="button"
                onClick={() => setDpTab("team")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "team"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Users className="h-4 w-4" />
                Project Team
              </button>

              <button
                type="button"
                onClick={() => setDpTab("batches")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "batches"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Table className="h-4 w-4" />
                Batches
              </button>

              <button
                type="button"
                onClick={() => setDpTab("attachments")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "attachments"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Paperclip className="h-4 w-4" />
                Client Attachments
              </button>

              <button
                type="button"
                onClick={() => setDpTab("activity")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "activity"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Clock className="h-4 w-4" />
                Activity & Audit Log
              </button>
            </div>
          </Card>

          {/* TAB CONTENT 1: PROJECT OVERVIEW */}
          {dpTab === "overview" && (
            <div className="space-y-6">
              {/* SECTION HEADER & EDIT BUTTON */}
              <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-foreground text-base font-bold">
                    Project Profile & Specifications
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Comprehensive metadata, client SLAs, scheduling, and system
                    entity IDs.
                  </p>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={openEditProjectModal}
                  className="border-border hover:bg-secondary cursor-pointer gap-1.5 self-start text-xs font-semibold sm:self-auto"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit Project
                </Button>
              </div>

              {/* CARDS GRID ROW 1 */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* CARD 1: PROJECT INFORMATION */}
                <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                  <div className="border-border flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                        PROJECT INFORMATION
                      </span>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      {dpProject.projectStatus || "IN PROGRESS"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Project ID
                      </span>
                      <span className="text-foreground font-mono text-xs font-bold">
                        {dpProject.id === "prj-01"
                          ? "prj-01"
                          : dpProject.id.toLowerCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Project Name
                      </span>
                      <span className="text-foreground text-sm font-bold">
                        {dpProject.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Project Type
                        </span>
                        <span className="bg-primary/10 text-primary border-primary/20 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium">
                          {dpProject.projectType || "Data Annotation"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Project Status
                        </span>
                        <span className="text-foreground font-mono text-xs font-bold">
                          {dpProject.projectStatus || "IN_PROGRESS"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Description
                      </span>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {dpProject.description ||
                          "High-density medical image segmentation and cellular boundaries tagging."}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* CARD 2: CLIENT INFORMATION */}
                <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                  <div className="border-border flex items-center gap-2 border-b pb-3">
                    <Building2 className="text-primary h-4 w-4" />
                    <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                      CLIENT INFORMATION
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Client Name
                      </span>
                      <span className="text-foreground text-sm font-bold">
                        {dpProject.clientName || "BioTech Global Corp"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Primary Email Address
                      </span>
                      <a
                        href={`mailto:${dpProject.clientEmail || "biotech.client@biotech-global.com"}`}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        {dpProject.clientEmail ||
                          "biotech.client@biotech-global.com"}
                      </a>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-2 block text-xs font-medium">
                        Secondary Email Addresses
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(dpProject.secondaryEmails &&
                        dpProject.secondaryEmails.length > 0
                          ? dpProject.secondaryEmails
                          : [
                              "ops@biotech-global.com",
                              "delivery@biotech-global.com",
                            ]
                        ).map((email, idx) => (
                          <span
                            key={idx}
                            className="bg-secondary/80 border-border text-foreground rounded-md border px-2.5 py-1 font-mono text-xs"
                          >
                            {email}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* CARD 3: SCHEDULE & SYSTEM METADATA */}
              <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                <div className="border-border flex items-center gap-2 border-b pb-3">
                  <Clock className="text-primary h-4 w-4" />
                  <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                    SCHEDULE & SYSTEM METADATA
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Started at
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      6 Sep 2026 12:10pm
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created by
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {dpProject.createdBy ||
                        dpProject.managerName ||
                        "Vikram Malhotra"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created at
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      1 Aug 2026 2:30pm
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Last updated at
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {dpProject.lastUpdated || "6 Sep 2026 12:10pm"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB CONTENT 2: PROJECT TEAM */}
          {dpTab === "team" && (
            <div className="space-y-4">
              {/* TOP CONTEXT TEXT & ADD EMPLOYEE BUTTON */}
              <div className="flex flex-col justify-between gap-3 pt-1 sm:flex-row sm:items-center">
                <p className="text-muted-foreground text-xs">
                  Active team roster and operational allocations for{" "}
                  <span className="text-foreground font-bold">
                    {project.name}.
                  </span>
                </p>

                <Button
                  onClick={openAddEmployee}
                  className="flex cursor-pointer items-center gap-1.5 self-start rounded-lg bg-[#7C66DC] px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-[#6C56CE] sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> Add Employee
                </Button>
              </div>

              {/* EMPLOYEE TEAM ROSTER TABLE CARD */}
              <Card className="bg-card border-border overflow-hidden rounded-2xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border text-muted-foreground border-b bg-slate-50/80 text-[11px] font-semibold tracking-wider uppercase dark:bg-slate-900/60">
                        <th className="p-4 pl-6">EMPLOYEE</th>
                        <th className="p-4">TEAM ROLE DESIGNATION</th>
                        <th className="p-4">SHIFT</th>
                        <th className="p-4">WORK INVOLVEMENT</th>
                        <th className="p-4">LAST UPDATED</th>
                        <th className="p-4 pr-6 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {dpRoster.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="text-muted-foreground p-8 text-center text-xs"
                          >
                            No employees assigned to this project team yet.
                          </td>
                        </tr>
                      ) : (
                        dpRoster.map((emp) => (
                          <tr
                            key={emp.id}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            {/* EMPLOYEE */}
                            <td className="p-4 pl-6">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#EEEBFC] text-xs font-bold text-[#7C66DC] dark:bg-purple-950/60 dark:text-purple-300">
                                  {emp.initials}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-foreground text-xs leading-tight font-bold">
                                    {emp.name}
                                  </span>
                                  <span className="text-muted-foreground font-mono text-[11px]">
                                    {emp.empCode}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* TEAM ROLE DESIGNATION */}
                            <td className="text-foreground p-4 text-xs font-semibold">
                              {emp.role}
                            </td>

                            {/* SHIFT */}
                            <td className="p-4">
                              <span className="inline-flex items-center rounded-full border border-purple-200/60 bg-[#F3F0FF] px-3 py-0.5 text-xs font-medium text-[#7C66DC] dark:border-purple-800/40 dark:bg-purple-950/40 dark:text-purple-300">
                                {emp.shift}
                              </span>
                            </td>

                            {/* WORK INVOLVEMENT */}
                            <td className="p-4">
                              <div className="flex flex-wrap items-center gap-2">
                                {emp.involvements.map((inv, idx) => {
                                  if (inv === "Production") {
                                    return (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 rounded-full border border-emerald-200/80 bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-400"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                        Production
                                      </span>
                                    );
                                  }
                                  if (inv === "QC") {
                                    return (
                                      <span
                                        key={idx}
                                        className="inline-flex items-center gap-1 rounded-full border border-purple-200/80 bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 dark:border-purple-800/50 dark:bg-purple-950/40 dark:text-purple-300"
                                      >
                                        <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
                                        QC
                                      </span>
                                    );
                                  }
                                  return (
                                    <span
                                      key={idx}
                                      className="bg-secondary text-foreground border-border inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium"
                                    >
                                      <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
                                      {inv}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>

                            {/* LAST UPDATED */}
                            <td className="text-muted-foreground p-4 font-mono text-xs whitespace-nowrap">
                              {emp.lastUpdated}
                            </td>

                            {/* ACTIONS */}
                            <td className="p-4 pr-6 text-right">
                              <div className="inline-flex items-center justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => openQuickProfile(emp)}
                                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                                  title="View"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditEmployee(emp)}
                                  className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                                  title="Edit"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteEmployee(emp.id)}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer p-1 transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}

          {/* TAB CONTENT 3: BATCHES */}
          {dpTab === "batches" && (
            <div className="space-y-6">
              {/* TOP CONTAINER CARD */}
              <Card className="bg-card border-border flex flex-col justify-between gap-3 rounded-xl p-5 shadow-xs sm:flex-row sm:items-center">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground text-base font-bold">
                      Project Batches
                    </h3>
                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      {dpBatches.length} Batches
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Batches, record types, languages, total records, and image
                    allocations.
                  </p>
                </div>

                <Button
                  onClick={openCreateBatch}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex cursor-pointer items-center gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold shadow-xs sm:self-auto"
                >
                  <Plus className="h-4 w-4" /> Create Batch
                </Button>
              </Card>

              {/* BATCHES TABLE CARD */}
              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                        <th className="p-3.5">BATCH ID</th>
                        <th className="p-3.5">BATCH NAME</th>
                        <th className="p-3.5">TYPE OF RECORD</th>
                        <th className="p-3.5">LANGUAGE</th>
                        <th className="p-3.5">SOURCE TYPE</th>
                        <th className="p-3.5">TOTAL SOURCE UNITS</th>
                        <th className="p-3.5">OVERALL STATUS</th>
                        <th className="p-3.5">LAST UPDATED</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {sortedBatches.map((b, i) => (
                        <tr
                          key={i}
                          className="hover:bg-secondary/20 transition-colors"
                        >
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {b.id}
                          </td>
                          <td className="text-foreground p-3.5 font-bold">
                            {b.name}
                          </td>
                          <td className="p-3.5">
                            <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 text-xs font-medium">
                              {b.type}
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-medium">
                            {b.lang}
                          </td>
                          <td className="p-3.5">
                            <span className="text-foreground inline-flex items-center gap-1.5 text-xs font-medium">
                              {b.sourceType === "PDF" ? (
                                <File className="text-primary h-3.5 w-3.5" />
                              ) : (
                                <ImageIcon className="text-primary h-3.5 w-3.5" />
                              )}
                              {b.sourceType}
                            </span>
                          </td>
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {b.totalUnits}
                          </td>
                          <td className="p-3.5">
                            {renderBatchStatusBadge(b.status)}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono text-xs whitespace-nowrap">
                            {b.lastUpdated}
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border h-7 cursor-pointer gap-1 rounded-md text-xs font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5" /> View
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

          {/* TAB CONTENT 3: ATTACHMENTS */}
          {dpTab === "attachments" && (
            <div className="space-y-6">
              {/* HIDDEN FILE INPUT FOR NATIVE FILE PICKER */}
              <input
                type="file"
                ref={attachmentFileInputRef}
                onChange={handleUploadClientAttachment}
                className="hidden"
              />

              {/* DROPZONE CARD */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                    handleDirectFileUpload(e.dataTransfer.files[0]);
                  }
                }}
                onClick={() => attachmentFileInputRef.current?.click()}
                className="border-primary/30 bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors"
              >
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Upload className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-foreground text-sm font-bold">
                    Upload Client Attachments
                  </h3>
                  <p className="text-muted-foreground max-w-md text-xs">
                    Drag and drop SOP guidelines, XML schemas, ICD-10
                    ontologies, or reference files here.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    attachmentFileInputRef.current?.click();
                  }}
                  className="border-border bg-background h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Paperclip className="h-3.5 w-3.5" /> Browse & Upload File
                </Button>
              </div>

              {/* ATTACHED DOCUMENTS SECTION */}
              <div className="space-y-3">
                <div>
                  <h3 className="text-foreground text-sm font-bold">
                    Attached Project Documents
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {clientAttachments.length} reference documents uploaded
                  </p>
                </div>

                <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="p-3.5">FILE NAME</th>
                          <th className="p-3.5">FILE TYPE</th>
                          <th className="p-3.5">FILE SIZE</th>
                          <th className="p-3.5">ATTACHED AT</th>
                          <th className="p-3.5 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/60 divide-y">
                        {clientAttachments.length === 0 ? (
                          <tr>
                            <td
                              colSpan={5}
                              className="text-muted-foreground p-8 text-center text-xs"
                            >
                              No client attachments uploaded yet. Click
                              &quot;Browse &amp; Upload File&quot; to add
                              documents.
                            </td>
                          </tr>
                        ) : (
                          clientAttachments.map((doc) => (
                            <tr
                              key={doc.id}
                              className="hover:bg-secondary/20 transition-colors"
                            >
                              <td className="p-3.5">
                                <span className="text-foreground flex items-center gap-2.5 font-bold">
                                  <FileText className="text-primary h-4 w-4 shrink-0" />
                                  {doc.name}
                                </span>
                              </td>
                              <td className="p-3.5">
                                <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-xs font-medium">
                                  {doc.type}
                                </span>
                              </td>
                              <td className="text-muted-foreground p-3.5 font-mono">
                                {doc.size}
                              </td>
                              <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                                {doc.attachedAt}
                              </td>
                              <td className="p-3.5 text-right">
                                <div className="inline-flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                                    title="View"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteClientAttachment(
                                        doc.id,
                                        doc.name,
                                      )
                                    }
                                    className="text-muted-foreground hover:text-destructive cursor-pointer p-1 transition-colors"
                                    title="Delete"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: ACTIVITY & AUDIT LOG */}
          {dpTab === "activity" && (
            <div className="space-y-4">
              {/* SUB TABS & WHAT DID USER DO BUTTON */}
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div className="bg-secondary/60 border-border inline-flex items-center gap-1 self-start rounded-xl border p-1">
                  <button
                    type="button"
                    onClick={() => setActivitySubTab("user_actions")}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-1.5 text-xs transition-all",
                      activitySubTab === "user_actions"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground font-medium",
                    )}
                  >
                    Activity Log (User Actions)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivitySubTab("data_diffs")}
                    className={cn(
                      "cursor-pointer rounded-lg px-3 py-1.5 text-xs transition-all",
                      activitySubTab === "data_diffs"
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground font-medium",
                    )}
                  >
                    Audit Log (Data Diffs)
                  </button>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary/30 text-primary hover:bg-primary/10 cursor-pointer self-start rounded-full px-4 text-xs font-semibold sm:self-auto"
                >
                  What Did User Do?
                </Button>
              </div>

              {/* DESCRIPTION & COUNTER BAR */}
              <div className="text-muted-foreground flex items-center justify-between pt-1 text-xs">
                <span>
                  Showing user interactions and operational triggers in this
                  project workspace.
                </span>
                <span className="font-semibold">
                  {activitySubTab === "user_actions"
                    ? `${activityLogs.length} Recorded Actions`
                    : `${auditDiffs.length} Data Audit Diffs`}
                </span>
              </div>

              {/* LOG TABLE CARD */}
              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  {activitySubTab === "user_actions" ? (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="p-3.5">USER & ROLE</th>
                          <th className="p-3.5">ACTIVITY TYPE</th>
                          <th className="p-3.5">RELATED ENTITY</th>
                          <th className="p-3.5">ENTITY ID / TARGET</th>
                          <th className="p-3.5">ACTION DESCRIPTION</th>
                          <th className="p-3.5">STATUS</th>
                          <th className="p-3.5">PERFORMED AT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/60 divide-y">
                        {activityLogs.map((log, i) => (
                          <tr
                            key={i}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="p-3.5">
                              <span className="text-foreground block font-bold">
                                {log.user}
                              </span>
                              <span className="text-muted-foreground block text-[11px]">
                                {log.role}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-secondary border-border text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                                {log.type}
                              </span>
                            </td>
                            <td className="text-foreground p-3.5 font-medium">
                              {log.entity}
                            </td>
                            <td className="text-primary p-3.5 font-mono font-bold">
                              {log.target}
                            </td>
                            <td className="text-muted-foreground p-3.5">
                              {log.description}
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                {log.status}
                              </span>
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono whitespace-nowrap">
                              {log.time}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="p-3.5">FIELD NAME</th>
                          <th className="p-3.5">OLD VALUE</th>
                          <th className="p-3.5">NEW VALUE</th>
                          <th className="p-3.5">MODIFIED BY</th>
                          <th className="p-3.5">DATE & TIME</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/60 divide-y">
                        {auditDiffs.map((diff, i) => (
                          <tr
                            key={i}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="text-foreground p-3.5 font-bold">
                              {diff.field}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono line-through">
                              {diff.oldVal}
                            </td>
                            <td className="text-primary p-3.5 font-mono font-bold">
                              {diff.newVal}
                            </td>
                            <td className="text-foreground p-3.5">
                              {diff.user}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {diff.date}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* ADD / EDIT EMPLOYEE TO PROJECT TEAM MODAL */}
        <Dialog open={showAddEmpModal} onOpenChange={setShowAddEmpModal}>
          <DialogContent className="bg-card border-border overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-[560px]">
            {/* MODAL HEADER */}
            <div className="p-6 pb-2 text-left">
              <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
                {editingEmpId
                  ? "Edit Employee Details and Project Team"
                  : "Add Employee to Project Team"}
              </DialogTitle>
              <p className="text-muted-foreground pt-1.5 text-xs leading-relaxed">
                {editingEmpId
                  ? `Update the selected employee's project team details and work allocation involvement for ${dpProject.name || "Latvia"}.`
                  : `Select an existing employee from the Employee Directory to assign to ${dpProject.name || "Latvia"}.`}
              </p>
            </div>

            {/* FORM BODY */}
            <div className="space-y-5 px-6 pb-6 text-xs">
              {/* 1. SELECT EMPLOYEE */}
              <div className="space-y-1.5">
                <Label className="text-foreground text-xs font-semibold">
                  Select Employee <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={selectedDirectoryEmpId}
                  onValueChange={(val) => {
                    setSelectedDirectoryEmpId(val);
                    const found = EMPLOYEE_DIRECTORY.find((e) => e.id === val);
                    if (found) {
                      setEmpName(found.name);
                      setEmpCode(found.empId);
                    }
                  }}
                >
                  <SelectTrigger className="bg-background border-border h-11 w-full rounded-lg px-3.5 text-xs shadow-2xs">
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border shadow-xl">
                    {EMPLOYEE_DIRECTORY.map((emp) => (
                      <SelectItem
                        key={emp.id}
                        value={emp.id}
                        className="py-2 text-xs"
                      >
                        {emp.name} ({emp.empId}) — {emp.designation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 2 & 3. TEAM ROLE DESIGNATION & OPERATING SHIFT */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* 2. Team Role Designation */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Team Role Designation{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. Data Processing Specialist"
                    value={empRole}
                    onChange={(e) => setEmpRole(e.target.value)}
                    className="bg-background border-border h-10 rounded-lg px-3.5 text-xs"
                  />
                </div>

                {/* 3. Operating Shift */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Operating Shift
                    </Label>
                    <span className="text-muted-foreground text-[11px]">
                      Auto-determined
                    </span>
                  </div>
                  <div className="bg-secondary/30 dark:bg-secondary/40 border-border/80 flex h-10 items-center justify-between rounded-lg border px-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#7C66DC]" />
                      <span className="text-foreground text-xs font-bold">
                        {calculateShift(empHour, empTimeAmPm).label}
                      </span>
                    </div>
                    <span className="rounded-md bg-[#7C66DC]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#7C66DC] dark:bg-[#7C66DC]/20">
                      {calculateShift(empHour, empTimeAmPm).shift}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. TIME (12-HOUR) CARD */}
              <div className="border-border/80 bg-secondary/20 dark:bg-secondary/30 space-y-2.5 rounded-xl border p-4">
                <Label className="text-foreground text-xs font-semibold">
                  Time (12-Hour) <span className="text-red-500">*</span>
                </Label>

                <div className="flex items-center gap-3">
                  {/* Hour Select */}
                  <div className="flex-1">
                    <Select value={empHour} onValueChange={setEmpHour}>
                      <SelectTrigger className="bg-background border-border h-10 w-full rounded-lg px-3 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-48">
                        {[
                          "01",
                          "02",
                          "03",
                          "04",
                          "05",
                          "06",
                          "07",
                          "08",
                          "09",
                          "10",
                          "11",
                          "12",
                        ].map((h) => (
                          <SelectItem key={h} value={h} className="text-xs">
                            {h}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <span className="text-muted-foreground text-base font-bold">
                    :
                  </span>

                  {/* Minute Select */}
                  <div className="flex-1">
                    <Select value={empMinute} onValueChange={setEmpMinute}>
                      <SelectTrigger className="bg-background border-border h-10 w-full rounded-lg px-3 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-48">
                        {[
                          "00",
                          "05",
                          "10",
                          "15",
                          "20",
                          "25",
                          "30",
                          "35",
                          "40",
                          "45",
                          "50",
                          "55",
                        ].map((m) => (
                          <SelectItem key={m} value={m} className="text-xs">
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* AM / PM Toggle */}
                  <div className="bg-secondary border-border flex items-center rounded-lg border p-0.5">
                    <button
                      type="button"
                      onClick={() => setEmpTimeAmPm("AM")}
                      className={cn(
                        "cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-bold transition-all",
                        empTimeAmPm === "AM"
                          ? "bg-[#7C66DC] text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => setEmpTimeAmPm("PM")}
                      className={cn(
                        "cursor-pointer rounded-md px-3.5 py-1.5 text-xs font-bold transition-all",
                        empTimeAmPm === "PM"
                          ? "bg-[#7C66DC] text-white shadow-xs"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground pt-0.5 text-[11px]">
                  Operating shift will update automatically to reflect this
                  selected time.
                </p>
              </div>

              {/* INITIAL WORK ALLOCATION INVOLVEMENT CARD */}
              <div className="border-border/80 bg-secondary/20 dark:bg-secondary/30 space-y-3 rounded-xl border p-4">
                <div className="space-y-1">
                  <h4 className="text-foreground text-xs font-bold tracking-wide uppercase">
                    INITIAL WORK ALLOCATION INVOLVEMENT
                  </h4>
                  <p className="text-muted-foreground text-[11px]">
                    An employee can participate in both Production and QC
                    operations simultaneously.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-1">
                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
                    <input
                      type="checkbox"
                      checked={enableProd}
                      onChange={(e) => setEnableProd(e.target.checked)}
                      className="border-border h-4 w-4 cursor-pointer rounded text-[#7C66DC] accent-[#7C66DC] focus:ring-[#7C66DC]"
                    />
                    <span>Enable Production Allocation</span>
                  </label>

                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium select-none">
                    <input
                      type="checkbox"
                      checked={enableQC}
                      onChange={(e) => setEnableQC(e.target.checked)}
                      className="border-border h-4 w-4 cursor-pointer rounded text-[#7C66DC] accent-[#7C66DC] focus:ring-[#7C66DC]"
                    />
                    <span>Enable QC Allocation</span>
                  </label>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="border-border bg-card flex items-center justify-end gap-3 border-t px-6 py-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddEmpModal(false)}
                className="border-border hover:bg-secondary h-9 cursor-pointer rounded-lg px-4 text-xs font-medium"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSaveEmployee}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#7C66DC] px-4 text-xs font-semibold text-white shadow-xs hover:bg-[#6C56CE]"
              >
                {editingEmpId ? (
                  "Confirm"
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" /> Add to Team
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* EDIT PROJECT CONFIGURATION MODAL */}
        <Dialog
          open={showEditConfigModal}
          onOpenChange={setShowEditConfigModal}
        >
          <DialogContent className="bg-card border-border flex max-h-[85vh] flex-col overflow-hidden rounded-xl p-0 shadow-2xl sm:max-w-[620px]">
            {/* MODAL HEADER */}
            <DialogHeader className="border-border border-b p-6 pb-4 text-left">
              <DialogTitle className="text-foreground text-lg font-bold">
                Edit Project Configuration
              </DialogTitle>
              <p className="text-muted-foreground pt-1 text-xs leading-relaxed">
                Update project metadata and client contact list. Changes will be
                recorded in the project Audit Log.
              </p>
            </DialogHeader>

            {/* SCROLLABLE FORM BODY */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs">
              {/* Section 1 — PROJECT INFORMATION */}
              <div className="space-y-4">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Tag className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    PROJECT INFORMATION
                  </h4>
                </div>

                {/* 1. Project Name */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="Enter project name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-background border-border h-9 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* 2. Project Status */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Project Status
                    </Label>
                    <div className="flex h-9 items-center">
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        {(dpProject as { status?: string }).status ||
                          dpProject.projectStatus ||
                          "CREATED"}
                      </span>
                    </div>
                  </div>

                  {/* 3. Project Type */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Project Type
                    </Label>
                    <Input
                      value="Data Processing"
                      readOnly
                      disabled
                      className="bg-secondary/60 border-border text-muted-foreground h-9 cursor-not-allowed text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* 4. Start Date */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      type="date"
                      value={editStartDate}
                      onChange={(e) => setEditStartDate(e.target.value)}
                      className="bg-background border-border h-9 text-xs"
                    />
                  </div>

                  {/* 5. Start Time */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Start Time <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="text"
                        placeholder="09:00"
                        value={editStartTime}
                        onChange={(e) => setEditStartTime(e.target.value)}
                        className="bg-background border-border h-9 flex-1 font-mono text-xs"
                      />
                      <Select
                        value={editTimeAmPm}
                        onValueChange={setEditTimeAmPm}
                      >
                        <SelectTrigger className="bg-background border-border h-9 w-24 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem value="AM" className="text-xs">
                            AM
                          </SelectItem>
                          <SelectItem value="PM" className="text-xs">
                            PM
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 6. Description */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Description
                  </Label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Enter project description..."
                    className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-primary w-full resize-none rounded-md border px-3 py-2 text-xs focus:ring-1 focus:outline-none"
                  />
                </div>
              </div>

              {/* Section 2 — CLIENT INFORMATION */}
              <div className="space-y-4 pt-2">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Building2 className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    CLIENT INFORMATION
                  </h4>
                </div>

                {/* 1. Client Organization Name */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Client Organization Name{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    placeholder="e.g. BioTech Global Corp"
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="bg-background border-border h-9 text-xs"
                  />
                </div>

                {/* 2. Primary Email Address */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Primary Email Address{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    type="email"
                    placeholder="e.g. biotech.client@biotech-global.com"
                    value={editPrimaryEmail}
                    onChange={(e) => setEditPrimaryEmail(e.target.value)}
                    className="bg-background border-border h-9 text-xs"
                  />
                </div>

                {/* 3. Secondary Client Contacts (Optional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground text-xs font-semibold">
                      Secondary Client Contacts (Optional)
                    </Label>
                    <button
                      type="button"
                      onClick={() =>
                        setEditSecondaryEmails((prev) => [...prev, ""])
                      }
                      className="text-primary flex cursor-pointer items-center gap-1 text-xs font-semibold hover:underline"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Email
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editSecondaryEmails.map((email, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Input
                          type="email"
                          placeholder="e.g. secondary.contact@company.com"
                          value={email}
                          onChange={(e) => {
                            const updated = [...editSecondaryEmails];
                            updated[idx] = e.target.value;
                            setEditSecondaryEmails(updated);
                          }}
                          className="bg-background border-border h-9 flex-1 text-xs"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setEditSecondaryEmails((prev) =>
                              prev.filter((_, i) => i !== idx),
                            );
                          }}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-9 w-9 shrink-0 cursor-pointer"
                          title="Remove email"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    {editSecondaryEmails.length === 0 && (
                      <p className="text-muted-foreground text-[11px] italic">
                        No secondary contacts added. Click &quot;+ Add
                        Email&quot; to add one.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="border-border bg-card sticky bottom-0 flex items-center justify-end gap-3 border-t p-4 px-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancelProjectConfig}
                className="border-border cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleSaveProjectConfig}
                className="cursor-pointer bg-[#7C66DC] px-4 text-xs font-semibold text-white hover:bg-[#6C56CE]"
              >
                Save Configuration
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CREATE BATCH MODAL */}
        <Dialog
          open={showCreateBatchModal}
          onOpenChange={setShowCreateBatchModal}
        >
          <DialogContent className="bg-card border-border flex max-h-[85vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-[650px]">
            {/* MODAL HEADER */}
            <DialogHeader className="border-border border-b p-6 pb-4 text-left">
              <DialogTitle className="text-foreground text-xl font-bold">
                Create Batch
              </DialogTitle>
              <p className="text-muted-foreground pt-1 text-xs leading-relaxed">
                Configure batch parameters, record taxonomy, input files, and
                scheduling.
              </p>
            </DialogHeader>

            {/* SCROLLABLE FORM BODY */}
            <div className="flex-1 space-y-6 overflow-y-auto p-6 text-xs">
              {/* 1. BATCH DETAILS */}
              <div className="space-y-4">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Tag className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    1. BATCH DETAILS
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Batch ID (Auto Generated) */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Batch ID (Auto Generated)
                    </Label>
                    <Input
                      value={batchId}
                      readOnly
                      disabled
                      className="bg-secondary/60 border-border h-9 cursor-not-allowed font-mono text-xs opacity-80"
                    />
                  </div>

                  {/* Batch Name */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Batch Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="e.g. Alpha Records - Batch 04"
                      value={batchName}
                      onChange={(e) => setBatchName(e.target.value)}
                      className="bg-background border-border h-9 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* 2. RECORD TAXONOMY & LANGUAGE */}
              <div className="space-y-4 pt-1">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Layers className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    2. RECORD TAXONOMY & LANGUAGE
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Type of Record */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Type of Record
                    </Label>
                    <Select
                      value={recordType}
                      onValueChange={(val) => {
                        setRecordType(val);
                        if (val !== "Other") {
                          setCustomRecordType("");
                        }
                      }}
                    >
                      <SelectTrigger className="bg-background border-border h-9 text-xs">
                        <SelectValue placeholder="Select Record Type" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Birth" className="text-xs">
                          Birth
                        </SelectItem>
                        <SelectItem value="Death" className="text-xs">
                          Death
                        </SelectItem>
                        <SelectItem value="Mixed" className="text-xs">
                          Mixed
                        </SelectItem>
                        <SelectItem value="Community" className="text-xs">
                          Community
                        </SelectItem>
                        <SelectItem value="Other" className="text-xs">
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Language Searchable Dropdown */}
                  <div className="space-y-1.5" ref={langDropdownRef}>
                    <Label className="text-foreground text-xs font-semibold">
                      Language
                    </Label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => {
                          setIsLangOpen((prev) => !prev);
                          setLangSearch("");
                        }}
                        className="bg-background border-border text-foreground hover:bg-secondary/40 focus:ring-ring flex h-9 w-full cursor-pointer items-center justify-between rounded-md border px-3 py-2 text-left text-xs transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
                      >
                        <span className="truncate">
                          {batchLang || "Select Language"}
                        </span>
                        <ChevronDown className="text-muted-foreground h-4 w-4 shrink-0 opacity-60" />
                      </button>

                      {isLangOpen && (
                        <div className="bg-popover text-popover-foreground border-border absolute top-full right-0 left-0 z-50 mt-1 overflow-hidden rounded-md border shadow-xl">
                          <div className="border-border bg-popover sticky top-0 border-b p-2">
                            <div className="bg-secondary/60 border-border flex items-center gap-2 rounded-md border px-2.5 py-1.5">
                              <Search className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                              <input
                                type="text"
                                placeholder="Search language..."
                                value={langSearch}
                                onChange={(e) => setLangSearch(e.target.value)}
                                className="text-foreground placeholder:text-muted-foreground w-full border-none bg-transparent text-xs focus:outline-none"
                                autoFocus
                              />
                            </div>
                          </div>
                          <div className="max-h-48 space-y-0.5 overflow-y-auto p-1">
                            {WORLD_LANGUAGES.filter((lang) =>
                              lang
                                .toLowerCase()
                                .includes(langSearch.toLowerCase()),
                            ).length === 0 ? (
                              <div className="text-muted-foreground py-4 text-center text-xs">
                                No language found
                              </div>
                            ) : (
                              WORLD_LANGUAGES.filter((lang) =>
                                lang
                                  .toLowerCase()
                                  .includes(langSearch.toLowerCase()),
                              ).map((lang) => (
                                <button
                                  key={lang}
                                  type="button"
                                  onClick={() => {
                                    setBatchLang(lang);
                                    setIsLangOpen(false);
                                    setLangSearch("");
                                  }}
                                  className={cn(
                                    "flex w-full cursor-pointer items-center justify-between rounded px-2.5 py-1.5 text-left text-xs transition-colors",
                                    batchLang === lang
                                      ? "bg-primary text-primary-foreground font-medium"
                                      : "hover:bg-secondary/80 text-foreground",
                                  )}
                                >
                                  <span>{lang}</span>
                                  {batchLang === lang && (
                                    <Check className="h-3.5 w-3.5 shrink-0" />
                                  )}
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional Text Input for Custom Record Type when Other is selected */}
                {recordType === "Other" && (
                  <div className="space-y-1.5 pt-1">
                    <Label className="text-foreground text-xs font-semibold">
                      Custom Record Type <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      placeholder="Enter custom record type"
                      value={customRecordType}
                      onChange={(e) => setCustomRecordType(e.target.value)}
                      className="bg-background border-border h-9 text-xs"
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* 3. INPUT CONFIGURATION */}
              <div className="space-y-4 pt-1">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Upload className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    3. INPUT CONFIGURATION
                  </h4>
                </div>

                {/* Source Type */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Source Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={sourceType}
                    onValueChange={(val: "Images" | "PDF") => {
                      setSourceType(val);
                      if (val === "Images") {
                        setUploadedImages(GENERATE_100_TEST_IMAGES());
                      } else {
                        setUploadedPdfs([
                          {
                            name: "document_001.pdf",
                            size: "14.2 MB",
                            pages: 100,
                          },
                        ]);
                      }
                    }}
                  >
                    <SelectTrigger className="bg-background border-border h-9 w-full text-xs">
                      <SelectValue placeholder="Select Source Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem
                        value="Images"
                        className="text-xs font-medium"
                      >
                        Images
                      </SelectItem>
                      <SelectItem value="PDF" className="text-xs font-medium">
                        PDF
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* DYNAMIC UPLOAD SECTION */}
                {sourceType === "Images" ? (
                  <div className="bg-secondary/20 dark:bg-secondary/30 border-border/80 space-y-3.5 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        UPLOAD IMAGES
                      </h5>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={imageFileInputRef}
                          onChange={handleImageFileSelect}
                          multiple
                          accept="image/*"
                          className="hidden"
                        />
                        <input
                          type="file"
                          ref={imageFolderInputRef}
                          onChange={handleImageFolderSelect}
                          multiple
                          accept="image/*"
                          {...({
                            webkitdirectory: "",
                            directory: "",
                          } as React.HTMLAttributes<HTMLInputElement>)}
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedImages(GENERATE_100_TEST_IMAGES());
                            imageFileInputRef.current?.click();
                          }}
                          className="border-border bg-background h-8 cursor-pointer gap-1.5 text-xs font-semibold"
                        >
                          <Upload className="h-3.5 w-3.5" /> Select Files
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setUploadedImages(GENERATE_100_TEST_IMAGES());
                            imageFolderInputRef.current?.click();
                          }}
                          className="border-border bg-background h-8 cursor-pointer gap-1.5 text-xs font-semibold"
                        >
                          <FolderUp className="h-3.5 w-3.5" /> Select Folder
                        </Button>
                      </div>
                    </div>

                    {/* Drag and Drop Zone */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        setUploadedImages(GENERATE_100_TEST_IMAGES());
                      }}
                      className="border-primary/30 bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center space-y-1.5 rounded-lg border-2 border-dashed p-5 text-center transition-colors"
                      onClick={() => {
                        setUploadedImages(GENERATE_100_TEST_IMAGES());
                        imageFileInputRef.current?.click();
                      }}
                    >
                      <ImageIcon className="text-primary/80 h-7 w-7" />
                      <p className="text-foreground text-xs font-medium">
                        Drag and drop image files or folders here, or use the
                        buttons above
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Supports PNG, JPG, JPEG, WEBP, TIFF files
                      </p>
                    </div>

                    {/* Total Source Units Banner */}
                    <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <span className="text-foreground block text-xs font-bold">
                          Total Source Units (Auto Calculated):
                        </span>
                        <span className="text-muted-foreground block text-[11px]">
                          Each uploaded image = 1 source unit (
                          {uploadedImages.length} images ={" "}
                          {uploadedImages.length} source units)
                        </span>
                      </div>
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 font-mono text-sm font-bold">
                        {uploadedImages.length}
                      </Badge>
                    </div>

                    {/* Uploaded Files List */}
                    <div className="space-y-2 pt-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Uploaded Files ({uploadedImages.length})
                      </Label>
                      <div className="border-border/60 bg-background max-h-36 space-y-1.5 overflow-y-auto rounded-lg border p-2">
                        {uploadedImages.length === 0 ? (
                          <p className="text-muted-foreground py-2 text-center text-[11px] italic">
                            No image files uploaded. Click &quot;Select
                            Files&quot; or &quot;Select Folder&quot; to add.
                          </p>
                        ) : (
                          uploadedImages.map((img, idx) => (
                            <div
                              key={idx}
                              className="bg-secondary/30 hover:bg-secondary/50 border-border/40 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="text-muted-foreground font-mono text-[11px]">
                                  {idx + 1}.
                                </span>
                                <FileText className="text-primary h-3.5 w-3.5 shrink-0" />
                                <span className="text-foreground truncate font-medium">
                                  {img.name}
                                </span>
                                <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
                                  ({img.size})
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50">
                                  READY
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5 transition-colors"
                                  title="Remove file"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-secondary/20 dark:bg-secondary/30 border-border/80 space-y-3.5 rounded-xl border p-4">
                    <div className="flex items-center justify-between">
                      <h5 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        UPLOAD PDF FILES
                      </h5>
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          ref={pdfFileInputRef}
                          onChange={handlePdfFileSelect}
                          multiple
                          accept="application/pdf"
                          className="hidden"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => pdfFileInputRef.current?.click()}
                          className="border-border bg-background h-8 cursor-pointer gap-1.5 text-xs font-semibold"
                        >
                          <Upload className="h-3.5 w-3.5" /> Select Files
                        </Button>
                      </div>
                    </div>

                    {/* Drag and Drop Zone for PDF */}
                    <div
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (
                          e.dataTransfer.files &&
                          e.dataTransfer.files.length > 0
                        ) {
                          const f = e.dataTransfer.files[0];
                          setUploadedPdfs([
                            {
                              name: f.name,
                              size: `${(f.size / (1024 * 1024)).toFixed(1)} MB`,
                              pages: 100,
                            },
                          ]);
                        } else {
                          setUploadedPdfs([
                            {
                              name: "document_001.pdf",
                              size: "14.2 MB",
                              pages: 100,
                            },
                          ]);
                        }
                      }}
                      className="border-primary/30 bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center space-y-1.5 rounded-lg border-2 border-dashed p-5 text-center transition-colors"
                      onClick={() => pdfFileInputRef.current?.click()}
                    >
                      <File className="text-primary/80 h-7 w-7" />
                      <p className="text-foreground text-xs font-medium">
                        Drag and drop PDF files here or click Select Files to
                        browse
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        Supports single or multi-page PDF documents
                      </p>
                    </div>

                    {/* Total Source Units for PDF Banner */}
                    <div className="bg-primary/10 border-primary/20 flex items-center justify-between rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <span className="text-foreground block text-xs font-bold">
                          Total Source Units (Auto Calculated):
                        </span>
                        <span className="text-muted-foreground block text-[11px]">
                          Each PDF page = 1 source unit ({totalPdfPages} total
                          pages = {totalPdfPages} source units)
                        </span>
                      </div>
                      <Badge className="bg-primary text-primary-foreground px-3 py-1 font-mono text-sm font-bold">
                        {totalPdfPages}
                      </Badge>
                    </div>

                    {/* Uploaded PDF Files List */}
                    <div className="space-y-2 pt-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Uploaded PDF Files ({uploadedPdfs.length})
                      </Label>
                      <div className="border-border/60 bg-background max-h-36 space-y-1.5 overflow-y-auto rounded-lg border p-2">
                        {uploadedPdfs.length === 0 ? (
                          <p className="text-muted-foreground py-2 text-center text-[11px] italic">
                            No PDF files uploaded. Click &quot;Select
                            Files&quot; to add.
                          </p>
                        ) : (
                          uploadedPdfs.map((pdf, idx) => (
                            <div
                              key={idx}
                              className="bg-secondary/30 hover:bg-secondary/50 border-border/40 flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs"
                            >
                              <div className="flex min-w-0 items-center gap-2">
                                <span className="text-muted-foreground font-mono text-[11px]">
                                  {idx + 1}.
                                </span>
                                <File className="text-primary h-3.5 w-3.5 shrink-0" />
                                <span className="text-foreground truncate font-medium">
                                  {pdf.name}
                                </span>
                                <span className="text-muted-foreground shrink-0 font-mono text-[10px]">
                                  ({pdf.size})
                                </span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-muted-foreground text-[11px] font-semibold">
                                    Total Pages:
                                  </span>
                                  <span className="text-foreground bg-secondary/80 border-border rounded border px-2 py-0.5 font-mono text-xs font-bold">
                                    {pdf.pages}
                                  </span>
                                </div>
                                <span className="rounded border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/50">
                                  READY
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePdf(idx)}
                                  className="text-muted-foreground hover:text-destructive cursor-pointer p-0.5 transition-colors"
                                  title="Remove file"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 4. BATCH DATE AND TIME */}
              <div className="space-y-4 pt-1">
                <div className="border-border/80 flex items-center gap-2 border-b pb-2">
                  <Clock className="text-primary h-4 w-4" />
                  <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    4. BATCH DATE AND TIME
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* Batch Date */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Batch Date
                    </Label>
                    <Input
                      type="date"
                      value={batchDate}
                      onChange={(e) => setBatchDate(e.target.value)}
                      className="bg-background border-border h-9 text-xs"
                    />
                  </div>

                  {/* Batch Time */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Batch Time
                    </Label>
                    <Input
                      placeholder="02:15 PM"
                      value={batchTime}
                      onChange={(e) => setBatchTime(e.target.value)}
                      className="bg-background border-border h-9 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <div className="border-border bg-card sticky bottom-0 flex items-center justify-end gap-3 border-t p-4 px-6">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCreateBatchModal(false)}
                className="border-border cursor-pointer text-xs"
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCreateBatch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer px-4 text-xs font-semibold"
              >
                Create Batch
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* EMPLOYEE QUICK PROFILE SIDE DRAWER */}
        <EmployeeQuickProfileDrawer
          employee={selectedQuickProfileEmp}
          isOpen={isQuickDrawerOpen}
          onClose={() => setIsQuickDrawerOpen(false)}
          onViewFullProfile={(empData) => {
            setIsQuickDrawerOpen(false);
            setFullProfileEmp(empData);
          }}
        />
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col">
      {/* TOP HEADER BAR */}
      <div className="border-border bg-card sticky top-0 z-20 border-b p-4 shadow-xs sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="bg-secondary text-secondary-foreground border-border cursor-pointer gap-1.5 rounded-none text-xs font-semibold"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Projects
            </Button>

            <div className="bg-border hidden h-5 w-[1px] sm:block" />

            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-foreground text-lg font-bold tracking-tight">
                {project.name}
              </h1>

              <Badge
                variant="outline"
                className="rounded-none border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[11px] font-semibold text-orange-500"
              >
                {project.stage}
              </Badge>

              <Badge className="bg-primary/10 text-primary border-primary/30 rounded-none text-[10px] font-semibold">
                {project.clientType === "client"
                  ? "Client Project"
                  : "In-House Product"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ManageTeamDialog project={project} onUpdateTeam={onUpdateTeam} />

            <Button
              variant="outline"
              size="sm"
              className="border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer gap-1.5 rounded-none text-xs font-semibold"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit Project
            </Button>
          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="w-full flex-1 space-y-6 p-4 sm:p-6">
        {/* EXECUTIVE METRICS CARDS GRID */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1: Overall Completion */}
          <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Overall Completion
              </span>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-foreground font-mono text-2xl font-extrabold">
                {project.progress}%
              </span>
              <span className="text-muted-foreground text-xs">
                Active Progress
              </span>
            </div>
            <Progress
              value={project.progress}
              className="bg-secondary h-2 rounded-none"
            />
          </Card>

          {/* Card 2: Timeline */}
          <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Project Duration
              </span>
              <Calendar className="text-primary h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-foreground font-mono text-xs font-bold">
                {project.periodStart} &rarr; {project.periodEnd}
              </span>
              <span className="text-muted-foreground mt-1 text-[11px]">
                Target Release Schedule
              </span>
            </div>
          </Card>

          {/* Card 3: Team Roster */}
          <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Team Allocation
              </span>
              <Users className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-foreground font-mono text-2xl font-extrabold">
                {totalMembers} Members
              </span>
              <Badge variant="outline" className="rounded-none text-[10px]">
                {project.teams?.length || 1} Teams
              </Badge>
            </div>
          </Card>

          {/* Card 4: Manager Profile */}
          <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                Project Manager
              </span>
              <ShieldCheck className="h-4 w-4 text-purple-500" />
            </div>
            <div className="flex items-center gap-2.5 pt-0.5">
              <div className="bg-primary/20 text-primary border-primary/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                {project.managerName.charAt(0)}
              </div>
              <div className="flex flex-col truncate">
                <span className="text-foreground truncate text-xs font-bold">
                  {project.managerName}
                </span>
                <span className="text-muted-foreground font-mono text-[10px]">
                  Code: {project.managerCode}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* TABBED INFORMATION NAVIGATION */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          <TabsList className="bg-card border-border w-full justify-start overflow-x-auto rounded-none border p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none text-xs font-semibold"
            >
              Overview & Roadmap
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none text-xs font-semibold"
            >
              Teams & Allocation ({totalMembers})
            </TabsTrigger>
            <TabsTrigger
              value="sprints"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none text-xs font-semibold"
            >
              Sprints & Deliverables
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-none text-xs font-semibold"
            >
              Documents & Assets
            </TabsTrigger>
          </TabsList>

          {/* ==================== TAB 1: OVERVIEW ==================== */}
          <TabsContent value="overview" className="m-0 space-y-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column: Project Summary & Objectives */}
              <div className="space-y-6 lg:col-span-2">
                <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
                  <h3 className="text-foreground border-border flex items-center gap-2 border-b pb-2 text-sm font-bold">
                    <FileText className="text-primary h-4 w-4" /> Project
                    Description & Objectives
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    This project encompasses the full-lifecycle engineering,
                    architectural design, and quality assurance for{" "}
                    <strong>{project.name}</strong>. Designed to streamline
                    operational workflows and enterprise efficiency,
                    deliverables include scalable microservices backend,
                    responsive web frontends, and automated CI/CD pipelines.
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="bg-background border-border/80 space-y-1 rounded-none border p-3">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                        Client Partner
                      </span>
                      <p className="text-foreground text-xs font-bold">
                        {project.clientType === "client"
                          ? "Enterprise Client Ltd"
                          : "Internal Engineering"}
                      </p>
                    </div>

                    <div className="bg-background border-border/80 space-y-1 rounded-none border p-3">
                      <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                        Stage Category
                      </span>
                      <p className="text-xs font-bold text-orange-500">
                        {project.stageGroup} &bull; {project.stage}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Milestones Roadmap */}
                <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
                  <h3 className="text-foreground border-border flex items-center gap-2 border-b pb-2 text-sm font-bold">
                    <Layers className="h-4 w-4 text-emerald-500" /> Key
                    Milestones Roadmap
                  </h3>

                  <div className="space-y-3">
                    {[
                      {
                        title: "Architecture & Requirement Freeze",
                        date: "2026-01-15",
                        status: "Completed",
                      },
                      {
                        title: "Core MVP Alpha Deployment",
                        date: "2026-04-10",
                        status: "Completed",
                      },
                      {
                        title: "UAT & Security Auditing",
                        date: "2026-07-20",
                        status: "In Progress",
                      },
                      {
                        title: "Production Staging Release",
                        date: "2026-09-15",
                        status: "Upcoming",
                      },
                    ].map((m, idx) => (
                      <div
                        key={idx}
                        className="bg-background border-border flex items-center justify-between rounded-none border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                              m.status === "Completed"
                                ? "bg-emerald-600 text-white"
                                : m.status === "In Progress"
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-secondary text-muted-foreground",
                            )}
                          >
                            {m.status === "Completed" ? (
                              <CheckCircle2 className="h-4 w-4" />
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-foreground text-xs font-bold">
                              {m.title}
                            </span>
                            <span className="text-muted-foreground font-mono text-[10px]">
                              Target: {m.date}
                            </span>
                          </div>
                        </div>

                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-none text-[10px]",
                            m.status === "Completed"
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                              : m.status === "In Progress"
                                ? "border-primary/30 bg-primary/10 text-primary"
                                : "border-border text-muted-foreground",
                          )}
                        >
                          {m.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Right Column: Project Meta Details */}
              <div className="space-y-6">
                <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
                  <h3 className="text-muted-foreground border-border border-b pb-2 text-xs font-bold tracking-wider uppercase">
                    Project Specifications
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Project Code:
                      </span>
                      <span className="text-foreground font-mono font-bold">
                        PRJ-2024-884
                      </span>
                    </div>

                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">Start Date:</span>
                      <span className="text-foreground font-mono">
                        {project.periodStart}
                      </span>
                    </div>

                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Target Completion:
                      </span>
                      <span className="text-foreground font-mono">
                        {project.periodEnd}
                      </span>
                    </div>

                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Assigned Manager:
                      </span>
                      <span className="text-foreground font-semibold">
                        {project.managerName}
                      </span>
                    </div>

                    <div className="border-border/50 flex justify-between border-b pb-2">
                      <span className="text-muted-foreground">
                        Current Phase:
                      </span>
                      <span className="text-primary font-bold">
                        {project.stage}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* ==================== TAB 2: TEAMS & ALLOCATION ==================== */}
          <TabsContent value="teams" className="m-0 space-y-6">
            {project.teams && project.teams.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {project.teams.map((t) => (
                  <Card
                    key={t.id}
                    className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs"
                  >
                    <div className="border-border flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Users className="text-primary h-4 w-4" />
                        <h4 className="text-foreground text-sm font-bold">
                          {t.name}
                        </h4>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-none text-[10px]"
                      >
                        {t.members.length} Members
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {t.members.map((m) => (
                        <div
                          key={m.id}
                          className="bg-background border-border flex items-center justify-between rounded-none border p-2.5"
                        >
                          <div className="flex items-center gap-3">
                            <div className="bg-secondary border-border text-foreground flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold">
                              {m.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <span className="text-foreground text-xs font-bold">
                                  {m.name}
                                </span>
                                {m.isTechLead && (
                                  <Badge className="rounded-none border-amber-500/30 bg-amber-500/10 text-[9px] text-amber-500">
                                    Tech Lead
                                  </Badge>
                                )}
                              </div>
                              <span className="text-muted-foreground text-[10px]">
                                {m.role}
                              </span>
                            </div>
                          </div>

                          <span className="text-muted-foreground font-mono text-[10px]">
                            {m.email || m.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
                <h4 className="text-foreground border-border border-b pb-2 text-sm font-bold">
                  Assigned Team Roster
                </h4>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                  {project.teamMembers?.map((m) => (
                    <div
                      key={m.id}
                      className="bg-background border-border flex items-center gap-3 rounded-none border p-3"
                    >
                      <div className="bg-secondary border-border text-foreground flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
                        {m.name.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold">
                          {m.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {m.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </TabsContent>

          {/* ==================== TAB 3: SPRINTS & DELIVERABLES ==================== */}
          <TabsContent value="sprints" className="m-0 space-y-6">
            <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
              <h3 className="text-foreground border-border flex items-center gap-2 border-b pb-2 text-sm font-bold">
                <GitBranch className="text-primary h-4 w-4" /> Active Sprints &
                Execution Matrix
              </h3>

              <div className="space-y-3">
                {[
                  {
                    name: "Sprint 24.1 - Core Engine Refactor",
                    progress: 100,
                    status: "Completed",
                    tasks: "14/14 Done",
                  },
                  {
                    name: "Sprint 24.2 - Auth & RBAC Pipeline",
                    progress: 85,
                    status: "Active",
                    tasks: "12/15 Done",
                  },
                  {
                    name: "Sprint 24.3 - UI Theme Engine & Modals",
                    progress: 30,
                    status: "Active",
                    tasks: "4/14 Done",
                  },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="bg-background border-border space-y-2 rounded-none border p-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-xs font-bold">
                        {s.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "rounded-none text-[10px]",
                          s.status === "Completed"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                            : "border-primary/30 bg-primary/10 text-primary",
                        )}
                      >
                        {s.status}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground flex items-center justify-between font-mono text-[11px]">
                      <span>Progress: {s.progress}%</span>
                      <span>{s.tasks}</span>
                    </div>
                    <Progress
                      value={s.progress}
                      className="bg-secondary h-1.5 rounded-none"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* ==================== TAB 4: DOCUMENTS & ASSETS ==================== */}
          <TabsContent value="documents" className="m-0 space-y-6">
            <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-xs">
              <h3 className="text-foreground border-border flex items-center gap-2 border-b pb-2 text-sm font-bold">
                <FileText className="text-primary h-4 w-4" /> Linked
                Documentation & Repositories
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  {
                    name: "System Requirement Specification (SRS)",
                    type: "PDF Specs",
                    link: "#",
                  },
                  {
                    name: "Figma Component Design System",
                    type: "UI Layouts",
                    link: "#",
                  },
                  {
                    name: "GitHub Core Microservices Repo",
                    type: "Codebase",
                    link: "#",
                  },
                  {
                    name: "API Documentation & Swagger Specs",
                    type: "API Specs",
                    link: "#",
                  },
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="bg-background border-border flex items-center justify-between rounded-none border p-3.5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary border-border text-primary flex h-8 w-8 items-center justify-center rounded-full border">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold">
                          {doc.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {doc.type}
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground h-7 w-7 rounded-none"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
