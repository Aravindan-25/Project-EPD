"use client";

import React, { useState, useMemo } from "react";
import { useUserRole } from "@/lib/user-role-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Download,
  Search,
  ShieldAlert,
  ShieldCheck,
  User,
  Users,
  Eye,
  Check,
  Building2,
  FileSpreadsheet,
  Zap,
  Briefcase,
  AlertCircle,
  Filter,
  RefreshCw,
  Plus,
} from "lucide-react";

export interface EmployeeWeeklyWorklog {
  id: string;
  empId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  projectRole: string;
  dailyHours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
  status: "Approved" | "Pending Review" | "Changes Requested";
  submittedDate: string;
  taskLogs: {
    id: string;
    day: string;
    taskTitle: string;
    taskId: string;
    hours: number;
    category:
      "Development" | "Code Review" | "Architecture" | "Testing" | "Meeting";
    notes: string;
  }[];
}

const INITIAL_PROJECTS = [
  {
    id: "p1",
    name: "EPD Enterprise System",
    code: "EPD-2026",
    lead: "Alex Morgan",
  },
  {
    id: "p2",
    name: "Client Onboarding Portal",
    code: "ONB-101",
    lead: "David Miller",
  },
  {
    id: "p3",
    name: "Cloud Native Infrastructure",
    code: "INF-990",
    lead: "Elena Vance",
  },
  {
    id: "p4",
    name: "Design System Redesign",
    code: "DS-404",
    lead: "Julian Thorne",
  },
];

const INITIAL_EMPLOYEE_WORKLOGS: Record<string, EmployeeWeeklyWorklog[]> = {
  p1: [
    {
      id: "wl-1",
      empId: "AAA-001",
      name: "Elena Vance",
      avatar: "EV",
      department: "Engineering",
      designation: "Lead Systems Architect",
      projectRole: "Tech Lead",
      dailyHours: {
        mon: 8.5,
        tue: 8.0,
        wed: 9.0,
        thu: 8.5,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-1",
          day: "Mon (24 Aug)",
          taskTitle: "Microservices Auth Layer Refactoring",
          taskId: "EPD-401",
          hours: 5.0,
          category: "Architecture",
          notes: "Designed OAuth2 token rotation & session store.",
        },
        {
          id: "tl-2",
          day: "Mon (24 Aug)",
          taskTitle: "PR Code Reviews & Tech Sync",
          taskId: "EPD-392",
          hours: 3.5,
          category: "Code Review",
          notes: "Reviewed backend pull requests for sprint 14.",
        },
        {
          id: "tl-3",
          day: "Tue (25 Aug)",
          taskTitle: "Database Indexing & Query Tuning",
          taskId: "EPD-410",
          hours: 8.0,
          category: "Development",
          notes: "Optimized Postgres query plan for user directory lookup.",
        },
      ],
    },
    {
      id: "wl-2",
      empId: "AAA-005",
      name: "Sarah Chen",
      avatar: "SC",
      department: "Engineering",
      designation: "Senior Backend Developer",
      projectRole: "Backend Developer",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.0,
        thu: 7.5,
        fri: 8.5,
        sat: 0,
        sun: 0,
      },
      status: "Pending Review",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-4",
          day: "Mon (24 Aug)",
          taskTitle: "REST API Endpoint Implementation",
          taskId: "EPD-422",
          hours: 8.0,
          category: "Development",
          notes: "Implemented worklog submission endpoint with validation.",
        },
        {
          id: "tl-5",
          day: "Tue (25 Aug)",
          taskTitle: "Integration Unit Test Suite",
          taskId: "EPD-425",
          hours: 8.0,
          category: "Testing",
          notes: "Wrote unit tests for role-based authorization rules.",
        },
      ],
    },
    {
      id: "wl-3",
      empId: "AAA-002",
      name: "Sahara Acharya",
      avatar: "SA",
      department: "Engineering",
      designation: "Intern Frontend Developer",
      projectRole: "Frontend Contributor",
      dailyHours: {
        mon: 7.5,
        tue: 8.0,
        wed: 7.5,
        thu: 8.0,
        fri: 7.0,
        sat: 0,
        sun: 0,
      },
      status: "Pending Review",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-6",
          day: "Mon (24 Aug)",
          taskTitle: "UI Component Library & Table Fixes",
          taskId: "EPD-430",
          hours: 7.5,
          category: "Development",
          notes: "Built dark-mode table views for employee directory.",
        },
      ],
    },
  ],
  p2: [
    {
      id: "wl-4",
      empId: "AAA-003",
      name: "Aman Sharma",
      avatar: "AS",
      department: "Marketing",
      designation: "Growth Marketing Manager",
      projectRole: "Marketing Lead",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.0,
        thu: 8.0,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-7",
          day: "Mon (24 Aug)",
          taskTitle: "Client Onboarding Campaign",
          taskId: "ONB-88",
          hours: 8.0,
          category: "Meeting",
          notes: "Prepared marketing collateral & user guides.",
        },
      ],
    },
    {
      id: "wl-5",
      empId: "AAA-004",
      name: "Julian Thorne",
      avatar: "JT",
      department: "Product Design",
      designation: "Principal UI/UX Designer",
      projectRole: "Design Lead",
      dailyHours: {
        mon: 8.5,
        tue: 8.0,
        wed: 8.5,
        thu: 8.0,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-8",
          day: "Mon (24 Aug)",
          taskTitle: "Onboarding Flow Wireframes",
          taskId: "ONB-95",
          hours: 8.5,
          category: "Architecture",
          notes: "Designed candidate document upload UX.",
        },
      ],
    },
  ],
};

export function WeeklyWorklogView() {
  const { role, setRole } = useUserRole();

  // Role Access Guard: Allowed for ADMIN and PM
  const isAuthorized = role === "ADMIN" || role === "PM";

  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Approved" | "Pending Review"
  >("All");

  const [worklogData, setWorklogData] = useState(INITIAL_EMPLOYEE_WORKLOGS);
  const [selectedInspectionLog, setSelectedInspectionLog] =
    useState<EmployeeWeeklyWorklog | null>(null);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // Selected Project
  const currentProject = useMemo(() => {
    return (
      INITIAL_PROJECTS.find((p) => p.id === selectedProjectId) ||
      INITIAL_PROJECTS[0]
    );
  }, [selectedProjectId]);

  // Current project's employee worklogs
  const projectWorklogs = useMemo(() => {
    let logs: EmployeeWeeklyWorklog[] = [];
    if (selectedProjectId === "all") {
      logs = Object.values(worklogData).flat();
    } else {
      logs = worklogData[selectedProjectId] || [];
    }

    return logs.filter((log) => {
      const matchesSearch =
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [worklogData, selectedProjectId, searchQuery, statusFilter]);

  // Executive Metrics Calculations
  const totalWeeklyHours = useMemo(() => {
    return projectWorklogs.reduce((acc, log) => {
      const sum =
        log.dailyHours.mon +
        log.dailyHours.tue +
        log.dailyHours.wed +
        log.dailyHours.thu +
        log.dailyHours.fri +
        log.dailyHours.sat +
        log.dailyHours.sun;
      return acc + sum;
    }, 0);
  }, [projectWorklogs]);

  const approvedCount = useMemo(() => {
    return projectWorklogs.filter((log) => log.status === "Approved").length;
  }, [projectWorklogs]);

  const approvalPercentage = useMemo(() => {
    if (projectWorklogs.length === 0) return 100;
    return Math.round((approvedCount / projectWorklogs.length) * 100);
  }, [approvedCount, projectWorklogs.length]);

  const handleApproveWorklog = (logId: string) => {
    setWorklogData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((pId) => {
        updated[pId] = updated[pId].map((l) =>
          l.id === logId ? { ...l, status: "Approved" as const } : l,
        );
      });
      return updated;
    });
  };

  const handleApproveAll = () => {
    setWorklogData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((pId) => {
        updated[pId] = updated[pId].map((l) => ({
          ...l,
          status: "Approved" as const,
        }));
      });
      return updated;
    });
  };

  const handleInspectLog = (log: EmployeeWeeklyWorklog) => {
    setSelectedInspectionLog(log);
    setIsInspectModalOpen(true);
  };

  // RESTRICTED ACCESS SCREEN FOR NON-ADMIN / NON-PM ROLES
  if (!isAuthorized) {
    return (
      <div className="bg-background flex min-h-screen flex-1 flex-col items-center justify-center p-8 text-center">
        <Card className="bg-card border-border flex max-w-md flex-col items-center gap-4 rounded-none p-8 shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-foreground text-lg font-bold">
            Access Restricted &bull; Manager Only
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The{" "}
            <span className="text-foreground font-bold">Weekly Worklog</span>{" "}
            module is restricted to{" "}
            <span className="text-primary font-semibold">Admin</span> and{" "}
            <span className="text-primary font-semibold">Project Manager</span>{" "}
            roles for reviewing and approving team timesheets.
          </p>

          <div className="flex w-full flex-col gap-2 pt-2">
            <Button
              onClick={() => setRole("PM")}
              className="bg-primary text-primary-foreground w-full gap-2 rounded-none text-xs font-semibold"
            >
              <Briefcase className="h-4 w-4" /> Switch Role to Project Manager
              (PM)
            </Button>
            <Button
              variant="outline"
              onClick={() => setRole("ADMIN")}
              className="border-border w-full gap-2 rounded-none text-xs font-semibold"
            >
              <ShieldCheck className="h-4 w-4 text-amber-500" /> Switch Role to
              Admin
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
      {/* HEADER TITLE BAR */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Weekly Worklog Review
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-0.5 text-xs font-semibold">
              {role === "ADMIN" ? "Admin Access" : "PM Access"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Review and approve project team weekly timesheets, daily hour
            allocations, and task breakdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Button
            size="sm"
            onClick={handleApproveAll}
            className="h-9 cursor-pointer gap-1.5 rounded-xl bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve All Pending
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Exporting Weekly Worklog Report (CSV)...")}
            className="border-border hover:bg-secondary h-9 cursor-pointer gap-1.5 rounded-xl px-4 text-xs font-semibold"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* EXECUTIVE METRICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: TOTAL LOGGED HOURS */}
        <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              TOTAL TEAM HOURS
            </span>
            <div className="bg-primary/10 border-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-lg border">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground font-mono text-2xl font-bold tracking-tight">
              {totalWeeklyHours.toFixed(1)} hrs
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Selected Project Weekly Total
            </p>
          </div>
        </Card>

        {/* Card 2: ACTIVE TEAM MEMBERS */}
        <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              ACTIVE TEAM MEMBERS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-blue-200/50 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold tracking-tight">
              {projectWorklogs.length} Employees
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Logging Hours This Week
            </p>
          </div>
        </Card>

        {/* Card 3: AVERAGE DAILY LOG */}
        <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              AVERAGE DAILY LOG
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200/50 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground font-mono text-2xl font-bold tracking-tight">
              {projectWorklogs.length > 0
                ? (totalWeeklyHours / (projectWorklogs.length * 5)).toFixed(1)
                : "0.0"}{" "}
              hrs/day
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Target Capacity: 8.0 hrs/day
            </p>
          </div>
        </Card>

        {/* Card 4: APPROVAL STATUS */}
        <Card className="bg-card border-border space-y-3 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              APPROVAL STATUS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-200/50 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {approvalPercentage}%
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              {approvedCount} of {projectWorklogs.length} Approved
            </p>
          </div>
        </Card>
      </div>

      {/* FILTER & CONTROLS STRIP */}
      <Card className="bg-card border-border flex flex-col justify-between gap-4 rounded-xl p-4 shadow-xs md:flex-row md:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* PROJECT SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2">
            <Label className="text-foreground flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
              <FolderKanban className="text-primary h-3.5 w-3.5" /> Select
              Project:
            </Label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-background border-border text-foreground focus:border-primary h-9 cursor-pointer rounded-lg border px-3 pr-8 text-xs font-bold shadow-2xs outline-none"
            >
              <option value="all">All Projects</option>
              {INITIAL_PROJECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH EMPLOYEE */}
          <div className="relative w-full sm:w-56">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-3.5 w-3.5" />
            <Input
              placeholder="Search employee name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border focus-visible:ring-primary h-9 rounded-lg pl-9 text-xs shadow-2xs"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as "All" | "Approved" | "Pending Review",
                )
              }
              className="bg-background border-border text-foreground focus:border-primary h-9 cursor-pointer rounded-lg border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Review">Pending Review</option>
            </select>
          </div>
        </div>

        {/* WEEK NAVIGATION PICKER */}
        <div className="border-border bg-background flex items-center gap-2 self-start rounded-lg border px-3 py-1.5 shadow-2xs md:self-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer rounded-md"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-foreground min-w-[190px] text-center font-mono text-xs font-bold">
            24 Aug &ndash; 30 Aug 2026 (W35)
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer rounded-md"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {weekOffset !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekOffset(0)}
              className="text-primary h-6 cursor-pointer px-2 text-[10px] font-bold hover:underline"
            >
              Current Week
            </Button>
          )}
        </div>
      </Card>

      {/* WEEKLY WORKLOG GRID TABLE */}
      <Card className="bg-card border-border space-y-4 overflow-hidden rounded-xl p-4 shadow-xs">
        <div className="border-border/60 flex items-center justify-between border-b pb-3">
          <h2 className="text-foreground flex items-center gap-2 text-sm font-bold">
            <Building2 className="text-primary h-4 w-4" />
            {currentProject.name} &bull; Employee Weekly Log Grid
          </h2>

          <Badge
            variant="outline"
            className="border-border rounded-full px-3 font-mono text-xs font-semibold"
          >
            {projectWorklogs.length} Team Members
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-border bg-secondary/50 text-muted-foreground border-b text-[11px] font-bold uppercase">
                <th className="min-w-[200px] px-4 py-3">Employee & Role</th>
                <th className="px-3 py-3 text-center">Mon (24)</th>
                <th className="px-3 py-3 text-center">Tue (25)</th>
                <th className="px-3 py-3 text-center">Wed (26)</th>
                <th className="px-3 py-3 text-center">Thu (27)</th>
                <th className="px-3 py-3 text-center">Fri (28)</th>
                <th className="text-muted-foreground/60 px-3 py-3 text-center">
                  Sat (29)
                </th>
                <th className="text-muted-foreground/60 px-3 py-3 text-center">
                  Sun (30)
                </th>
                <th className="px-4 py-3 text-center">Total Logged</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {projectWorklogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-muted-foreground py-12 text-center text-xs"
                  >
                    No worklogs found for this project filter.
                  </td>
                </tr>
              ) : (
                projectWorklogs.map((log) => {
                  const totalHrs =
                    log.dailyHours.mon +
                    log.dailyHours.tue +
                    log.dailyHours.wed +
                    log.dailyHours.thu +
                    log.dailyHours.fri +
                    log.dailyHours.sat +
                    log.dailyHours.sun;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => handleInspectLog(log)}
                      className="hover:bg-secondary/30 group cursor-pointer transition-colors"
                    >
                      {/* Employee Avatar & Role */}
                      <td className="text-foreground px-4 py-3.5 text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                            {log.avatar}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-foreground group-hover:text-primary truncate text-xs font-bold transition-colors">
                              {log.name}
                            </span>
                            <span className="text-muted-foreground truncate text-[10px]">
                              {log.designation} &bull;{" "}
                              <span className="text-foreground font-semibold">
                                {log.projectRole}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Daily Hours Mon - Sun */}
                      <td className="px-3 py-3.5 text-center font-mono font-semibold">
                        <span
                          className={cn(
                            log.dailyHours.mon >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.mon.toFixed(1)}h
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center font-mono font-semibold">
                        <span
                          className={cn(
                            log.dailyHours.tue >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.tue.toFixed(1)}h
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center font-mono font-semibold">
                        <span
                          className={cn(
                            log.dailyHours.wed >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.wed.toFixed(1)}h
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center font-mono font-semibold">
                        <span
                          className={cn(
                            log.dailyHours.thu >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.thu.toFixed(1)}h
                        </span>
                      </td>

                      <td className="px-3 py-3.5 text-center font-mono font-semibold">
                        <span
                          className={cn(
                            log.dailyHours.fri >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.fri.toFixed(1)}h
                        </span>
                      </td>

                      <td className="text-muted-foreground/60 px-3 py-3.5 text-center font-mono">
                        {log.dailyHours.sat.toFixed(1)}h
                      </td>

                      <td className="text-muted-foreground/60 px-3 py-3.5 text-center font-mono">
                        {log.dailyHours.sun.toFixed(1)}h
                      </td>

                      {/* Total Logged */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 font-mono text-xs font-bold",
                            totalHrs >= 40
                              ? "border-emerald-200 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400"
                              : "border-amber-200 bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
                          )}
                        >
                          {totalHrs.toFixed(1)} / 40.0 hrs
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {log.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
                            <Clock className="h-3 w-3" /> Pending Review
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {log.status === "Pending Review" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveWorklog(log.id)}
                              className="h-8 cursor-pointer gap-1 rounded-lg bg-emerald-600 px-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInspectLog(log)}
                            className="border-border hover:bg-secondary h-8 cursor-pointer gap-1 rounded-lg px-2.5 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" /> Inspect
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ITEMIZED WORKLOG INSPECTION MODAL */}
      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent className="bg-card border-border rounded-xl p-6 shadow-2xl sm:max-w-[700px]">
          <DialogHeader className="border-border flex flex-row items-center justify-between border-b pb-4">
            <div>
              <DialogTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                <Clock className="text-primary h-4 w-4" />
                Worklog Details: {selectedInspectionLog?.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-0.5 font-mono text-xs">
                {selectedInspectionLog?.designation} &bull;{" "}
                {currentProject.name} &bull; 24 Aug – 30 Aug 2026
              </DialogDescription>
            </div>
            {selectedInspectionLog?.status === "Approved" ? (
              <Badge className="rounded-none border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500">
                Approved
              </Badge>
            ) : (
              <Badge className="rounded-none border border-amber-500/30 bg-amber-500/10 text-xs text-amber-500">
                Pending Review
              </Badge>
            )}
          </DialogHeader>

          {/* ITEMIZED TASK LOG LIST */}
          <div className="max-h-[55vh] space-y-3 overflow-y-auto py-3 pr-1">
            <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
              Itemized Daily Task Logs
            </h4>

            {selectedInspectionLog?.taskLogs.map((task) => (
              <Card
                key={task.id}
                className="bg-background border-border flex flex-col gap-2 rounded-none p-3.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-xs font-bold">
                      {task.taskTitle}
                    </span>
                    <Badge
                      variant="outline"
                      className="border-border text-primary rounded-none font-mono text-[9px]"
                    >
                      {task.taskId}
                    </Badge>
                    <Badge className="bg-secondary text-secondary-foreground rounded-none text-[9px]">
                      {task.category}
                    </Badge>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-500">
                    {task.hours.toFixed(1)} hrs
                  </span>
                </div>

                <p className="text-muted-foreground text-xs leading-relaxed">
                  {task.notes}
                </p>

                <div className="text-muted-foreground border-border/40 mt-1 flex justify-between border-t pt-1.5 font-mono text-[10px]">
                  <span>Logged Date: {task.day}</span>
                  <span>Project: {currentProject.name}</span>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter className="border-border flex w-full items-center justify-between border-t pt-3">
            <span className="text-muted-foreground font-mono text-xs">
              Total Weekly Log:{" "}
              <span className="text-foreground font-mono font-bold">
                40.0 hrs
              </span>
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInspectModalOpen(false)}
                className="rounded-none text-xs"
              >
                Close
              </Button>
              {selectedInspectionLog?.status !== "Approved" && (
                <Button
                  size="sm"
                  onClick={() => {
                    if (selectedInspectionLog) {
                      handleApproveWorklog(selectedInspectionLog.id);
                      setIsInspectModalOpen(false);
                    }
                  }}
                  className="gap-1.5 rounded-none bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Approve Weekly Worklog
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
