"use client";

import React, { useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  Users,
  Search,
  ChevronDown,
  UserPlus,
  Sparkles,
  UserCheck,
  CheckCircle2,
  BarChart3,
  Eye,
  Building2,
  Calendar,
  Award,
  TrendingUp,
  MapPin,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  FileText,
  Clock,
  FileCheck,
  Upload,
  Download,
  AlertCircle,
  Mail,
  Send,
  X,
  FolderKanban,
  CalendarDays,
  Laptop,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { AddEmployeeDialog } from "@/components/add-employee-dialog";
import { EmployeeOverviewSheet } from "@/components/employee-overview-sheet";

export interface EmployeeRecord {
  id: string;
  empId: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  role: "Admin" | "Manager" | "Member";
  branch: string;
  joiningDate: string;
  status: "Active" | "On Leave" | "Inactive";
}

export interface OnboardingRecord {
  id: string;
  empCode: string;
  candidateName: string;
  email: string;
  department: string;
  designation: string;
  joinDate: string;
  progressPercentage: number;
  docsCompleted: number;
  totalDocs: number;
  stage: "Draft" | "Pending Doc";
}

const INITIAL_EMPLOYEE_DIRECTORY: EmployeeRecord[] = [
  {
    id: "emp-1",
    empId: "AAA-001",
    name: "Elena Vance",
    avatar: "EV",
    email: "elena@pockethr.io",
    phone: "+91 98765 11001",
    department: "Engineering",
    designation: "Lead Systems Architect",
    role: "Admin",
    branch: "Bengaluru HQ",
    joiningDate: "15 Jan 2023",
    status: "Active",
  },
  {
    id: "emp-2",
    empId: "AAA-002",
    name: "Sahara Acharya",
    avatar: "SA",
    email: "sahara@pockethr.io",
    phone: "+91 98765 22002",
    department: "Engineering",
    designation: "Intern Frontend Developer",
    role: "Member",
    branch: "Dehradun Office",
    joiningDate: "10 Sep 2024",
    status: "Active",
  },
  {
    id: "emp-3",
    empId: "AAA-003",
    name: "Aman Sharma",
    avatar: "AS",
    email: "aman@pockethr.io",
    phone: "+91 98765 33003",
    department: "Marketing",
    designation: "Growth Marketing Manager",
    role: "Manager",
    branch: "Bengaluru HQ",
    joiningDate: "01 Mar 2024",
    status: "Active",
  },
  {
    id: "emp-4",
    empId: "AAA-004",
    name: "Julian Thorne",
    avatar: "JT",
    email: "julian@pockethr.io",
    phone: "+91 98765 44004",
    department: "Product Design",
    designation: "Principal UI/UX Designer",
    role: "Manager",
    branch: "Bengaluru HQ",
    joiningDate: "12 Dec 2023",
    status: "Active",
  },
  {
    id: "emp-5",
    empId: "AAA-005",
    name: "Sarah Chen",
    avatar: "SC",
    email: "sarah@pockethr.io",
    phone: "+91 98765 55005",
    department: "Engineering",
    designation: "Senior Backend Developer",
    role: "Member",
    branch: "Hyderabad Tech Hub",
    joiningDate: "18 Jun 2024",
    status: "Active",
  },
  {
    id: "emp-6",
    empId: "AAA-006",
    name: "Wei Lin",
    avatar: "WL",
    email: "wei@pockethr.io",
    phone: "+91 98765 66006",
    department: "Data & Analytics",
    designation: "Lead Data Scientist",
    role: "Member",
    branch: "Hyderabad Tech Hub",
    joiningDate: "05 Feb 2024",
    status: "Active",
  },
  {
    id: "emp-7",
    empId: "AAA-007",
    name: "Marcus Okafor",
    avatar: "MO",
    email: "marcus@pockethr.io",
    phone: "+91 98765 77007",
    department: "Human Resources",
    designation: "Talent Acquisition Lead",
    role: "Manager",
    branch: "Dehradun Office",
    joiningDate: "10 Aug 2024",
    status: "On Leave",
  },
];

const INITIAL_ACTIVE_ONBOARDING_CASES: OnboardingRecord[] = [
  {
    id: "onb-10",
    empCode: "EMP-2024-010",
    candidateName: "Peer Mohamed Nafees J",
    email: "nafees@aaatechnopark.com",
    department: "Engineering",
    designation: "Software Engineer",
    joinDate: "2026-08-27",
    progressPercentage: 0,
    docsCompleted: 0,
    totalDocs: 8,
    stage: "Pending Doc",
  },
  {
    id: "onb-9",
    empCode: "EMP-2024-009",
    candidateName: "Peer Mohamed Nafees J",
    email: "nafees@aaatechnopark.com",
    department: "Engineering",
    designation: "Software Engineer",
    joinDate: "2026-08-27",
    progressPercentage: 13,
    docsCompleted: 1,
    totalDocs: 8,
    stage: "Pending Doc",
  },
  {
    id: "onb-1",
    empCode: "EMP-2024-001",
    candidateName: "Alice Johnson",
    email: "alice.johnson@company.com",
    department: "Engineering",
    designation: "Senior Frontend Engineer",
    joinDate: "2023-01-15",
    progressPercentage: 88,
    docsCompleted: 7,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-2",
    empCode: "EMP-2024-002",
    candidateName: "Bob Smith",
    email: "bob.smith@company.com",
    department: "Marketing",
    designation: "Growth Marketing Specialist",
    joinDate: "2023-02-20",
    progressPercentage: 75,
    docsCompleted: 6,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-3",
    empCode: "EMP-2024-003",
    candidateName: "Carol Williams",
    email: "carol.williams@company.com",
    department: "Sales",
    designation: "Enterprise Sales Executive",
    joinDate: "2024-08-17",
    progressPercentage: 63,
    docsCompleted: 5,
    totalDocs: 8,
    stage: "Pending Doc",
  },
  {
    id: "onb-4",
    empCode: "EMP-2024-004",
    candidateName: "David Brown",
    email: "david.brown@company.com",
    department: "Finance",
    designation: "Senior Financial Analyst",
    joinDate: "2023-04-05",
    progressPercentage: 88,
    docsCompleted: 7,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-5",
    empCode: "EMP-2024-005",
    candidateName: "Eva Martinez",
    email: "eva.martinez@company.com",
    department: "HR",
    designation: "HR Coordinator & Recruiter",
    joinDate: "2023-05-12",
    progressPercentage: 63,
    docsCompleted: 5,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-6",
    empCode: "EMP-2024-006",
    candidateName: "Frank Wilson",
    email: "frank.wilson@company.com",
    department: "Engineering",
    designation: "Staff Backend Architect",
    joinDate: "2023-06-18",
    progressPercentage: 88,
    docsCompleted: 7,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-7",
    empCode: "EMP-2024-007",
    candidateName: "Grace Taylor",
    email: "grace.taylor@company.com",
    department: "Operations",
    designation: "Operations Director",
    joinDate: "2023-07-22",
    progressPercentage: 75,
    docsCompleted: 6,
    totalDocs: 8,
    stage: "Draft",
  },
  {
    id: "onb-8",
    empCode: "EMP-2024-008",
    candidateName: "Henry Anderson",
    email: "henry.anderson@company.com",
    department: "Engineering",
    designation: "Lead QC Engineer",
    joinDate: "2024-08-19",
    progressPercentage: 63,
    docsCompleted: 5,
    totalDocs: 8,
    stage: "Pending Doc",
  },
];

export function EmployeesManagementView() {
  const [tabQueryParam, setTabQueryParam] = useQueryState(
    "viewTab",
    parseAsString.withDefault("overview"),
  );

  const activeTab =
    tabQueryParam === "directory"
      ? "directory"
      : tabQueryParam === "onboarding"
        ? "onboarding"
        : "overview";

  const [employees, setEmployees] = useState<EmployeeRecord[]>(
    INITIAL_EMPLOYEE_DIRECTORY,
  );

  const [onboardings, setOnboardings] = useState<OnboardingRecord[]>(
    INITIAL_ACTIVE_ONBOARDING_CASES,
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] =
    useState("All Departments");
  const [selectedRole, setSelectedRole] = useState("All Roles");

  // Single Unified State for Employee Overview Sheet Screen
  const [selectedEmployee, setSelectedEmployee] =
    useState<EmployeeRecord | null>(null);
  const [isOverviewSheetOpen, setIsOverviewSheetOpen] = useState(false);
  const [overviewInitialTab, setOverviewInitialTab] = useState<
    "overview" | "projects" | "attendance" | "assets" | "documents"
  >("overview");

  // Modal State for Adding Employee
  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmpId, setNewEmpId] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDepartment, setNewDepartment] = useState("Engineering");
  const [newDesignation, setNewDesignation] = useState("Software Engineer");
  const [newRole, setNewRole] = useState<EmployeeRecord["role"]>("Member");
  const [newBranch, setNewBranch] = useState("Bengaluru HQ");

  const handleOpenEmployeeOverview = (
    emp: EmployeeRecord,
    tab:
      | "overview"
      | "projects"
      | "attendance"
      | "assets"
      | "documents" = "overview",
  ) => {
    setSelectedEmployee(emp);
    setOverviewInitialTab(tab);
    setIsOverviewSheetOpen(true);
  };

  // Convert Onboarding Candidate directly to EmployeeRecord for the SINGLE UNIFIED Overview Screen
  const handleOpenOnboardingOverview = (
    candidate: OnboardingRecord,
    tab:
      | "overview"
      | "projects"
      | "attendance"
      | "assets"
      | "documents" = "documents",
  ) => {
    const initials = candidate.candidateName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const empFromOnboarding: EmployeeRecord = {
      id: candidate.id,
      empId: candidate.empCode,
      name: candidate.candidateName,
      avatar: initials || "OB",
      email: candidate.email,
      phone: "+91 98765 00000",
      department: candidate.department,
      designation: candidate.designation,
      role: "Member",
      branch: "Bengaluru HQ",
      joiningDate: candidate.joinDate,
      status: "Active",
    };

    setSelectedEmployee(empFromOnboarding);
    setOverviewInitialTab(tab);
    setIsOverviewSheetOpen(true);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const initials = newName
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const empIdToUse = newEmpId.trim() || `AAA-00${employees.length + 1}`;

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      empId: empIdToUse,
      name: newName.trim(),
      avatar: initials || "EMP",
      email:
        newEmail.trim() ||
        `${newName.toLowerCase().replace(" ", ".")}@pockethr.io`,
      phone: newPhone.trim() || "+91 98765 00000",
      department: newDepartment,
      designation: newDesignation,
      role: newRole,
      branch: newBranch,
      joiningDate: "Today",
      status: "Active",
    };

    setEmployees([newEmp, ...employees]);
    setIsAddEmployeeOpen(false);
    setNewName("");
    setNewEmpId("");
    setNewEmail("");
    setNewPhone("");
  };

  // Filtered employees list
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "All Departments" ||
        emp.department === selectedDepartment;

      const matchesRole =
        selectedRole === "All Roles" || emp.role === selectedRole;

      return matchesSearch && matchesDepartment && matchesRole;
    });
  }, [employees, searchQuery, selectedDepartment, selectedRole]);

  // Filtered onboarding candidates
  const filteredOnboardings = useMemo(() => {
    return onboardings.filter((o) => {
      return (
        o.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.empCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [onboardings, searchQuery]);

  // Summary Metrics
  const totalCount = employees.length;
  const activeCount = useMemo(
    () => employees.filter((e) => e.status === "Active").length,
    [employees],
  );
  const onboardingCount = onboardings.length;
  const departmentsCount = useMemo(
    () => new Set(employees.map((e) => e.department)).size,
    [employees],
  );

  // Department Stats Breakdown
  const departmentBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      counts[emp.department] = (counts[emp.department] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / employees.length) * 100),
    }));
  }, [employees]);

  // Branch Location Stats
  const branchBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    employees.forEach((emp) => {
      counts[emp.branch] = (counts[emp.branch] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / employees.length) * 100),
    }));
  }, [employees]);

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col gap-6 p-6">
      {/* HEADER TITLE & ACTION BUTTONS */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              Employees Management
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none font-mono text-xs"
            >
              {totalCount} Total Employees
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Workforce overview, team directory, role governance, collected
            documents, and onboarding pipeline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AddEmployeeDialog
            onAddEmployee={(newEmp) => setEmployees([newEmp, ...employees])}
          />
        </div>
      </div>

      {/* SUMMARY METRIC CARDS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Total Team Size
            </span>
            <span className="bg-foreground h-2 w-2 shrink-0 rounded-full" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            {totalCount}
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Active Employees
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-500">
            {activeCount}
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Active Onboarding Cases
            </span>
            <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
          </div>
          <div className="text-primary mt-3 text-2xl font-extrabold">
            {onboardingCount} Cases
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Active Departments
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-sky-500">
            {departmentsCount}
          </div>
        </Card>
      </div>

      {/* SUB-HEADER TABS BAR: OVERVIEW vs DIRECTORY vs ONBOARDING */}
      <div className="border-border bg-card flex items-center justify-between gap-3 border p-1 shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setTabQueryParam("overview")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs transition-colors",
              activeTab === "overview"
                ? "bg-background text-foreground border-border font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground border-transparent font-semibold",
            )}
          >
            <BarChart3 className="text-primary h-3.5 w-3.5" />
            <span>Employee Overview</span>
          </button>

          <button
            onClick={() => setTabQueryParam("directory")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs transition-colors",
              activeTab === "directory"
                ? "bg-background text-foreground border-border font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground border-transparent font-semibold",
            )}
          >
            <Users className="h-3.5 w-3.5" />
            <span>Employee Directory ({employees.length})</span>
          </button>

          <button
            onClick={() => setTabQueryParam("onboarding")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs transition-colors",
              activeTab === "onboarding"
                ? "bg-background text-foreground border-border font-bold shadow-2xs"
                : "text-muted-foreground hover:text-foreground border-transparent font-semibold",
            )}
          >
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Active Onboarding Cases ({onboardings.length})</span>
            {onboardings.length > 0 && (
              <span className="bg-primary ml-0.5 h-1.5 w-1.5 animate-pulse rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* TAB CONTENT 1: EXECUTIVE EMPLOYEE OVERVIEW DASHBOARD */}
      {activeTab === "overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="bg-card border-border flex flex-col gap-4 rounded-none p-5 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="text-primary h-4 w-4" />
                  <h3 className="text-foreground text-sm font-bold">
                    Department Distribution
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="border-border rounded-none font-mono text-[10px]"
                >
                  {departmentsCount} Active
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                {departmentBreakdown.map((dept) => (
                  <div key={dept.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-foreground font-semibold">
                        {dept.name}
                      </span>
                      <span className="text-muted-foreground font-mono">
                        {dept.count} members ({dept.percentage}%)
                      </span>
                    </div>
                    <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-300"
                        style={{ width: `${dept.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card border-border flex flex-col gap-4 rounded-none p-5 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-500" />
                  <h3 className="text-foreground text-sm font-bold">
                    Branch Locations
                  </h3>
                </div>
                <Badge
                  variant="outline"
                  className="border-border rounded-none font-mono text-[10px]"
                >
                  3 Hubs
                </Badge>
              </div>

              <div className="flex flex-col gap-3.5">
                {branchBreakdown.map((b) => (
                  <div
                    key={b.name}
                    className="border-border bg-background flex items-center justify-between border p-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-500/20 bg-sky-500/10 text-xs font-bold text-sky-500">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold">
                          {b.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          Primary Branch
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-foreground font-mono text-xs font-extrabold">
                        {b.count} Employees
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {b.percentage}% of Team
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="bg-card border-border flex flex-col gap-4 rounded-none p-5 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-amber-500" />
                  <h3 className="text-foreground text-sm font-bold">
                    Recent Joins & Highlights
                  </h3>
                </div>
                <Badge className="rounded-none border border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500">
                  Team Activity
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                {employees.slice(0, 4).map((emp) => (
                  <div
                    key={emp.id}
                    onClick={() => handleOpenEmployeeOverview(emp)}
                    className="hover:bg-secondary/40 hover:border-border group flex cursor-pointer items-center justify-between border border-transparent p-2.5 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="bg-primary/20 text-primary border-primary/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                        {emp.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground group-hover:text-primary text-xs font-bold transition-colors">
                          {emp.name}
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          {emp.designation}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {emp.joiningDate}
                      </span>
                      <Eye className="text-muted-foreground h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: EMPLOYEE DIRECTORY */}
      {activeTab === "directory" && (
        <Card className="bg-card border-border flex flex-col gap-5 rounded-none p-5 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                <Input
                  placeholder="Search name, ID, email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-background border-border focus-visible:ring-primary h-8 rounded-none pl-8 text-xs shadow-2xs"
                />
              </div>

              <div className="relative">
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="bg-background border-border text-foreground focus:border-primary h-8 cursor-pointer appearance-none rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
                >
                  <option value="All Departments">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Product Design">Product Design</option>
                  <option value="Human Resources">Human Resources</option>
                  <option value="Data & Analytics">Data & Analytics</option>
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5" />
              </div>

              <div className="relative">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="bg-background border-border text-foreground focus:border-primary h-8 cursor-pointer appearance-none rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
                >
                  <option value="All Roles">All Roles</option>
                  <option value="Admin">Admin</option>
                  <option value="Manager">Manager</option>
                  <option value="Member">Member</option>
                </select>
                <ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5" />
              </div>
            </div>

            <div className="text-muted-foreground text-xs font-medium">
              Click any row to open{" "}
              <span className="text-foreground font-bold">
                Employee Overview, Projects & Collected Documents
              </span>
              .
            </div>
          </div>

          {/* EMPLOYEES DIRECTORY TABLE */}
          <div className="border-border/80 bg-background overflow-x-auto border select-none">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="border-border/80 bg-card/60 border-b">
                  <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                    Employee
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                    Designation & Dept
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                    Access Role
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                    Location / Branch
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                    Contact
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-center text-[10px] font-bold tracking-wider uppercase">
                    Status
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-right text-[10px] font-bold tracking-wider uppercase">
                    Overview Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y">
                {filteredEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    onClick={() => handleOpenEmployeeOverview(emp, "overview")}
                    className="hover:bg-secondary/40 group cursor-pointer transition-colors"
                  >
                    <td className="text-foreground px-4 py-3.5 text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary border-primary/30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                          {emp.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-foreground group-hover:text-primary text-xs font-bold transition-colors">
                            {emp.name}
                          </span>
                          <span className="text-muted-foreground font-mono text-[10px]">
                            {emp.empId}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="text-foreground px-4 py-3.5 text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">{emp.designation}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {emp.department}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      {emp.role === "Admin" && (
                        <Badge className="rounded-none border-amber-500/40 bg-amber-500/10 text-[10px] font-bold text-amber-500">
                          Admin / Full Access
                        </Badge>
                      )}
                      {emp.role === "Manager" && (
                        <Badge className="rounded-none border-sky-500/40 bg-sky-500/10 text-[10px] font-bold text-sky-500">
                          Manager / Lead
                        </Badge>
                      )}
                      {emp.role === "Member" && (
                        <Badge
                          variant="outline"
                          className="border-border text-muted-foreground rounded-none text-[10px]"
                        >
                          Member
                        </Badge>
                      )}
                    </td>

                    <td className="text-muted-foreground px-4 py-3.5 text-xs font-medium">
                      {emp.branch}
                    </td>

                    <td className="text-foreground px-4 py-3.5 text-xs">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-medium">
                          {emp.email}
                        </span>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {emp.phone}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-center">
                      <Badge className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500">
                        Active
                      </Badge>
                    </td>

                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEmployeeOverview(emp, "documents");
                          }}
                          className="h-7 gap-1 rounded-none border-emerald-500/40 px-2 text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                        >
                          <FileCheck className="h-3 w-3" />
                          Docs
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEmployeeOverview(emp, "projects");
                          }}
                          className="border-border hover:bg-primary hover:text-primary-foreground h-7 gap-1 rounded-none px-2 text-[11px]"
                        >
                          <FolderKanban className="h-3 w-3" />
                          Projects
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEmployeeOverview(emp, "overview");
                          }}
                          className="border-border hover:bg-primary hover:text-primary-foreground h-7 gap-1 rounded-none px-2 text-[11px]"
                        >
                          <Eye className="h-3 w-3" />
                          Overview
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB CONTENT 3: ACTIVE ONBOARDING CASES */}
      {activeTab === "onboarding" && (
        <Card className="bg-card border-border flex flex-col gap-4 rounded-none p-5 shadow-xs">
          <div className="border-border/60 flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Users className="text-primary h-4 w-4" />
              <h2 className="text-foreground text-sm font-bold">
                Active Onboarding Cases ({filteredOnboardings.length})
              </h2>
            </div>

            <Badge
              variant="outline"
              className="border-border rounded-none text-xs"
            >
              Click any candidate to open Employee Overview Screen
            </Badge>
          </div>

          <div className="border-border/80 bg-background overflow-x-auto border select-none">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="border-border/80 bg-card/60 border-b">
                  <th className="text-muted-foreground px-4 py-3 text-xs font-semibold">
                    Candidate
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-xs font-semibold">
                    Department & Role
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-xs font-semibold">
                    Join Date
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-xs font-semibold">
                    Collected Documents Progress
                  </th>
                  <th className="text-muted-foreground px-4 py-3 text-xs font-semibold">
                    Stage & Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y">
                {filteredOnboardings.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => handleOpenOnboardingOverview(c, "documents")}
                    className="hover:bg-secondary/40 group cursor-pointer transition-colors"
                  >
                    <td className="text-foreground px-4 py-3.5 text-xs font-semibold">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground group-hover:text-primary text-xs font-bold transition-colors">
                          {c.candidateName}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          {c.empCode} <span className="mx-1">&bull;</span>{" "}
                          {c.email}
                        </span>
                      </div>
                    </td>

                    <td className="text-foreground px-4 py-3.5 text-xs">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-foreground text-xs font-bold">
                          {c.department}
                        </span>
                        <span className="text-muted-foreground text-[11px]">
                          {c.designation}
                        </span>
                      </div>
                    </td>

                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-xs">
                      {c.joinDate}
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      <div className="flex w-48 flex-col gap-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-foreground font-bold">
                            {c.progressPercentage}% Done
                          </span>
                          <span className="text-primary font-mono text-[11px] font-bold">
                            {c.docsCompleted}/{c.totalDocs} Docs
                          </span>
                        </div>
                        <div className="bg-secondary h-1.5 w-full overflow-hidden rounded-full">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-300",
                              c.progressPercentage === 0
                                ? "bg-transparent"
                                : c.progressPercentage < 30
                                  ? "bg-amber-500"
                                  : "bg-primary",
                            )}
                            style={{ width: `${c.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        {c.stage === "Pending Doc" && (
                          <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-semibold text-amber-800 dark:border dark:border-amber-500/30 dark:bg-amber-950/60 dark:text-amber-300">
                            Pending Doc
                          </span>
                        )}
                        {c.stage === "Draft" && (
                          <span className="border-border/80 inline-flex items-center rounded-full border bg-[#0D1527] px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-2xs">
                            Draft
                          </span>
                        )}

                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenOnboardingOverview(c, "documents");
                            }}
                            className="h-7 gap-1 rounded-none border-emerald-500/40 px-2 text-[11px] text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                          >
                            <FileCheck className="h-3 w-3" />
                            Collected Docs
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenOnboardingOverview(c, "overview");
                            }}
                            className="border-border hover:bg-primary hover:text-primary-foreground h-7 gap-1 rounded-none px-2 text-[11px]"
                          >
                            <Eye className="h-3 w-3" />
                            Overview
                          </Button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* SINGLE UNIFIED EMPLOYEE OVERVIEW SCREEN SHEET */}
      <EmployeeOverviewSheet
        employee={selectedEmployee}
        isOpen={isOverviewSheetOpen}
        initialTab={overviewInitialTab}
        onClose={() => setIsOverviewSheetOpen(false)}
      />
    </div>
  );
}
