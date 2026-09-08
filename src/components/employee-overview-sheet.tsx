"use client";

import React, { useState, useEffect } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { EmployeeRecord } from "@/components/employees-management-view";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  FolderKanban,
  CheckCircle2,
  CalendarDays,
  Laptop,
  FileCheck,
  Building2,
  ShieldCheck,
  Copy,
  Check,
  Eye,
  Download,
  FileText,
  FileCode,
  Clock,
  ChevronRight,
  ChevronDown,
} from "lucide-react";

interface EmployeeOverviewSheetProps {
  employee: EmployeeRecord | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "overview" | "projects" | "attendance" | "assets" | "documents";
}

export interface CollectedDocumentItem {
  id: string;
  title: string;
  category:
    | "Identity Proof"
    | "Tax & Finance"
    | "Education & Experience"
    | "Employment Agreement"
    | "Personal";
  fileName: string;
  fileSize: string;
  fileType: "PDF" | "PNG" | "JPG" | "DOCX";
  uploadDate: string;
  status: "Verified" | "Collected" | "Pending Verification";
  verifiedBy?: string;
}

export function EmployeeOverviewSheet({
  employee,
  isOpen,
  onClose,
  initialTab = "overview",
}: EmployeeOverviewSheetProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "projects" | "attendance" | "assets" | "documents"
  >(initialTab);

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [expandedDocId, setExpandedDocId] = useState<string | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }

  if (!employee) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(employee.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Comprehensive collected documents data for employee
  const collectedDocuments: CollectedDocumentItem[] = [
    {
      id: "doc-1",
      title: "Government Identity Proof (Aadhaar Card)",
      category: "Identity Proof",
      fileName: `aadhaar_card_${employee.empId.toLowerCase()}.pdf`,
      fileSize: "2.4 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Marcus Okafor (HR Lead)",
    },
    {
      id: "doc-2",
      title: "PAN Card / Income Tax Permanent Account Number",
      category: "Tax & Finance",
      fileName: `pan_card_${employee.empId.toLowerCase()}.pdf`,
      fileSize: "1.8 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Marcus Okafor (HR Lead)",
    },
    {
      id: "doc-3",
      title: "Signed Employment Contract & Offer Letter",
      category: "Employment Agreement",
      fileName: `employment_contract_${employee.name.toLowerCase().replace(" ", "_")}.pdf`,
      fileSize: "4.1 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Elena Vance (Admin)",
    },
    {
      id: "doc-4",
      title: "Degree Certificate & Transcripts",
      category: "Education & Experience",
      fileName: `degree_certificate_${employee.name.toLowerCase().replace(" ", "_")}.pdf`,
      fileSize: "3.5 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Marcus Okafor (HR Lead)",
    },
    {
      id: "doc-5",
      title: "Relieving Letter & Past Experience Certificates",
      category: "Education & Experience",
      fileName: `relieving_letter_previous_co.pdf`,
      fileSize: "2.9 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Marcus Okafor (HR Lead)",
    },
    {
      id: "doc-6",
      title: "Bank Account Details & Cancelled Cheque Copy",
      category: "Tax & Finance",
      fileName: `bank_cancelled_cheque.jpg`,
      fileSize: "1.2 MB",
      fileType: "JPG",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Finance Ops Team",
    },
    {
      id: "doc-7",
      title: "Passport Size Profile Photograph",
      category: "Personal",
      fileName: `profile_photo_${employee.empId.toLowerCase()}.png`,
      fileSize: "850 KB",
      fileType: "PNG",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Marcus Okafor (HR Lead)",
    },
    {
      id: "doc-8",
      title: "Non-Disclosure & Data Confidentiality Undertaking",
      category: "Employment Agreement",
      fileName: `nda_undertaking_signed.pdf`,
      fileSize: "1.6 MB",
      fileType: "PDF",
      uploadDate: employee.joiningDate,
      status: "Verified",
      verifiedBy: "Legal & HR Team",
    },
  ];

  const verifiedCount = collectedDocuments.filter(
    (d) => d.status === "Verified",
  ).length;

  // Mock project allocations
  const mockProjects = [
    {
      id: "p1",
      name: "EPD Enterprise System",
      role:
        employee.role === "Admin" || employee.role === "Manager"
          ? "Tech Lead"
          : "Core Developer",
      hoursPerWeek: "32 hrs/wk",
      progress: 85,
      status: "In Progress",
    },
    {
      id: "p2",
      name: "Client Onboarding Portal",
      role: "Module Owner",
      hoursPerWeek: "10 hrs/wk",
      progress: 92,
      status: "Completed",
    },
  ];

  // Mock asset details
  const mockAssets = [
    {
      id: "ast-101",
      title: 'MacBook Pro 16" (M3 Max, 36GB RAM)',
      category: "Laptop",
      serialNumber: "C02G998812K",
      assignedDate: employee.joiningDate,
      status: "Active / Excellent",
    },
    {
      id: "ast-102",
      title: 'Dell UltraSharp 27" 4K USB-C Monitor',
      category: "Display",
      serialNumber: "CN-0348-771",
      assignedDate: employee.joiningDate,
      status: "Active",
    },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        className="bg-background text-foreground border-border flex w-full flex-col gap-0 overflow-y-auto border-l p-0 shadow-2xl sm:max-w-2xl"
      >
        {/* FIXED TOP HEADER & PROFILE BANNER */}
        <div className="bg-card border-border flex shrink-0 flex-col gap-4 border-b p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/20 text-primary border-primary/40 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 text-lg font-bold shadow-xs">
                {employee.avatar}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-foreground text-lg font-bold">
                    {employee.name}
                  </h2>
                  {employee.status === "Active" && (
                    <Badge className="rounded-none border border-emerald-500/30 bg-emerald-500/15 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Active
                    </Badge>
                  )}
                  {employee.status === "On Leave" && (
                    <Badge className="rounded-none border border-amber-500/30 bg-amber-500/15 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
                      On Leave
                    </Badge>
                  )}
                  {employee.status === "Inactive" && (
                    <Badge className="rounded-none border border-rose-500/30 bg-rose-500/15 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                      Inactive
                    </Badge>
                  )}
                </div>

                <span className="text-muted-foreground mt-0.5 text-xs font-medium">
                  {employee.designation} &bull;{" "}
                  <span className="text-foreground font-semibold">
                    {employee.department}
                  </span>
                </span>

                <div className="text-muted-foreground mt-1.5 flex items-center gap-2 font-mono text-[11px]">
                  <span className="bg-secondary border-border text-foreground border px-2 py-0.5 font-bold">
                    {employee.empId}
                  </span>
                  <span>&bull;</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="text-primary h-3 w-3" />
                    {employee.branch}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 self-start">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyEmail}
                className="border-border h-8 gap-1.5 rounded-none text-xs"
              >
                {copiedEmail ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Email
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* QUICK METRIC STRIP */}
          <div className="border-border/60 mt-2 grid grid-cols-4 gap-2 border-t pt-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Role
              </span>
              <span className="text-foreground text-xs font-bold">
                {employee.role}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Date Joined
              </span>
              <span className="text-foreground font-mono text-xs font-bold">
                {employee.joiningDate}
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Projects
              </span>
              <span className="text-primary font-mono text-xs font-bold">
                {mockProjects.length} Active
              </span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
                Collected Docs
              </span>
              <span className="font-mono text-xs font-bold text-emerald-500">
                {verifiedCount}/{collectedDocuments.length} Verified
              </span>
            </div>
          </div>
        </div>

        {/* FIXED STICKY SUB-TABS NAVIGATION BAR */}
        <div className="border-border bg-card/95 sticky top-0 z-20 flex shrink-0 items-center gap-1 overflow-x-auto border-b px-4 backdrop-blur-md select-none">
          <button
            onClick={() => setActiveTab("overview")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors",
              activeTab === "overview"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            <User className="h-3.5 w-3.5" />
            Overview & Details
          </button>

          <button
            onClick={() => setActiveTab("documents")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors",
              activeTab === "documents"
                ? "border-emerald-500 font-extrabold text-emerald-500"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            <FileCheck className="h-3.5 w-3.5 text-emerald-500" />
            Collected Documents ({collectedDocuments.length})
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors",
              activeTab === "projects"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            <FolderKanban className="h-3.5 w-3.5" />
            Projects ({mockProjects.length})
          </button>

          <button
            onClick={() => setActiveTab("attendance")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors",
              activeTab === "attendance"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            Attendance & Leaves
          </button>

          <button
            onClick={() => setActiveTab("assets")}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 border-b-2 px-3 py-2.5 text-xs font-bold whitespace-nowrap transition-colors",
              activeTab === "assets"
                ? "border-primary text-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            <Laptop className="h-3.5 w-3.5" />
            Assets ({mockAssets.length})
          </button>
        </div>

        {/* BOTTOM UI CONTENT AREA */}
        <div className="bg-background flex min-h-[400px] flex-1 flex-col gap-6 p-6">
          {/* TAB 1: OVERVIEW & DETAILS */}
          {activeTab === "overview" && (
            <div className="animate-in fade-in-50 flex flex-col gap-6 duration-200">
              {/* SHORTCUT CARDS */}
              <div className="grid grid-cols-3 gap-3">
                <Card
                  onClick={() => setActiveTab("projects")}
                  className="bg-card border-border hover:border-primary/50 group flex cursor-pointer flex-col justify-between rounded-none p-3 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">
                      Assigned Projects
                    </span>
                    <FolderKanban className="text-primary h-3.5 w-3.5" />
                  </div>
                  <div className="text-foreground group-hover:text-primary mt-2 text-xl font-extrabold transition-colors">
                    {mockProjects.length} Projects
                  </div>
                  <span className="text-primary flex items-center gap-0.5 text-[10px] font-bold">
                    View Projects <ChevronRight className="h-2.5 w-2.5" />
                  </span>
                </Card>

                <Card
                  onClick={() => setActiveTab("attendance")}
                  className="bg-card border-border group flex cursor-pointer flex-col justify-between rounded-none p-3 transition-colors hover:border-emerald-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">
                      Attendance Rate
                    </span>
                    <CalendarDays className="h-3.5 w-3.5 text-emerald-500" />
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-emerald-500">
                    96.5%
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-500">
                    View Attendance <ChevronRight className="h-2.5 w-2.5" />
                  </span>
                </Card>

                <Card
                  onClick={() => setActiveTab("assets")}
                  className="bg-card border-border group flex cursor-pointer flex-col justify-between rounded-none p-3 transition-colors hover:border-sky-500/50"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[10px] font-bold uppercase">
                      Assigned Assets
                    </span>
                    <Laptop className="h-3.5 w-3.5 text-sky-500" />
                  </div>
                  <div className="mt-2 text-xl font-extrabold text-sky-500">
                    {mockAssets.length} Devices
                  </div>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-sky-500">
                    View Assets <ChevronRight className="h-2.5 w-2.5" />
                  </span>
                </Card>
              </div>

              {/* COLLECTED DOCUMENTS INLINE SUMMARY CARD */}
              <Card className="flex flex-col gap-3 rounded-none border border-emerald-500/30 bg-emerald-500/5 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Collected & Verified HR Documents
                    </h3>
                  </div>
                  <Badge className="rounded-none border-emerald-500/40 bg-emerald-500/20 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                    {verifiedCount} of {collectedDocuments.length} Verified
                  </Badge>
                </div>

                <p className="text-muted-foreground text-xs">
                  All mandatory identity proofs, bank account info, educational
                  certificates, and employment contracts have been uploaded and
                  verified by HR.
                </p>

                <div className="flex items-center justify-between border-t border-emerald-500/20 pt-2">
                  <div className="flex items-center gap-2">
                    {collectedDocuments.slice(0, 4).map((doc) => (
                      <Badge
                        key={doc.id}
                        variant="outline"
                        onClick={() => {
                          setActiveTab("documents");
                          setExpandedDocId(doc.id);
                        }}
                        className="bg-background border-border cursor-pointer text-[10px] font-semibold transition-colors hover:border-emerald-500"
                      >
                        {doc.title.split(" ")[0]} ✓
                      </Badge>
                    ))}
                    <span className="text-muted-foreground text-[10px]">
                      +{collectedDocuments.length - 4} more
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab("documents")}
                    className="h-7 cursor-pointer gap-1 rounded-none border-emerald-500/40 text-xs font-bold text-emerald-600 hover:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    <Eye className="h-3 w-3" />
                    Open Collected Documents
                  </Button>
                </div>
              </Card>

              {/* WORK PROFILE & LOCATION */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="bg-card border-border flex flex-col gap-3 rounded-none p-4 shadow-xs">
                  <div className="border-border/60 flex items-center gap-2 border-b pb-2">
                    <User className="text-primary h-4 w-4" />
                    <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Work Profile & Contact
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Mail className="text-muted-foreground h-3.5 w-3.5" />
                        Email Address
                      </span>
                      <span className="text-foreground font-mono font-semibold">
                        {employee.email}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Phone className="text-muted-foreground h-3.5 w-3.5" />
                        Phone Number
                      </span>
                      <span className="text-foreground font-mono font-semibold">
                        {employee.phone}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="text-muted-foreground h-3.5 w-3.5" />
                        Department
                      </span>
                      <span className="text-foreground font-semibold">
                        {employee.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Briefcase className="text-muted-foreground h-3.5 w-3.5" />
                        Designation
                      </span>
                      <span className="text-foreground font-semibold">
                        {employee.designation}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <ShieldCheck className="text-muted-foreground h-3.5 w-3.5" />
                        Permission Role
                      </span>
                      <Badge
                        variant="outline"
                        className="border-border text-foreground rounded-none text-[10px]"
                      >
                        {employee.role}
                      </Badge>
                    </div>
                  </div>
                </Card>

                <Card className="bg-card border-border flex flex-col gap-3 rounded-none p-4 shadow-xs">
                  <div className="border-border/60 flex items-center gap-2 border-b pb-2">
                    <Calendar className="text-primary h-4 w-4" />
                    <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                      Employment & Location
                    </h3>
                  </div>

                  <div className="flex flex-col gap-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Office Location
                      </span>
                      <span className="text-foreground font-semibold">
                        {employee.branch}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Employment Type
                      </span>
                      <span className="text-foreground font-semibold">
                        Full-Time Permanent
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Joining Date
                      </span>
                      <span className="text-foreground font-mono font-semibold">
                        {employee.joiningDate}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Line Manager
                      </span>
                      <span className="text-foreground font-semibold">
                        Aman Sharma (Engineering VP)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Emergency Contact
                      </span>
                      <span className="text-foreground font-mono font-semibold">
                        +91 99887 11223
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 2: COLLECTED DOCUMENTS LIST (EXACT SINGLE LINE PER DOCUMENT: FILE ICON > NAME > VERIFIED ICON > VIEW ICON > DOWNLOAD ICON) */}
          {activeTab === "documents" && (
            <div className="animate-in fade-in-50 flex flex-col gap-4 duration-200">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-sm font-bold">
                    <FileCheck className="h-4 w-4 text-emerald-500" />
                    Collected HR & Compliance Documents (
                    {collectedDocuments.length})
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Official verified onboarding and compliance documents for{" "}
                    {employee.name}.
                  </p>
                </div>

                <Badge className="rounded-none border border-emerald-500/30 bg-emerald-500/10 font-mono text-xs text-emerald-500">
                  {verifiedCount}/{collectedDocuments.length} Verified
                </Badge>
              </div>

              {/* SINGLE LINE PER DOCUMENT LIST */}
              <div className="flex flex-col gap-2">
                {collectedDocuments.map((doc) => {
                  const isExpanded = expandedDocId === doc.id;
                  return (
                    <div key={doc.id} className="flex flex-col">
                      {/* SINGLE LINE ROW LAYOUT: FILE ICON > NAME > VERIFIED ICON > VIEW ICON > DOWNLOAD ICON */}
                      <div className="bg-card border-border hover:border-primary/40 flex items-center justify-between gap-3 rounded-none border px-3 py-2.5 transition-colors">
                        {/* 1. FILE ICON */}
                        <div className="flex shrink-0 items-center justify-center">
                          {doc.fileType === "PDF" ? (
                            <FileText className="h-4 w-4 shrink-0 text-rose-500" />
                          ) : (
                            <FileCode className="h-4 w-4 shrink-0 text-sky-500" />
                          )}
                        </div>

                        {/* 2. NAME */}
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                          <span className="text-foreground truncate text-xs font-bold">
                            {doc.title}
                          </span>
                          <span className="text-muted-foreground hidden truncate font-mono text-[11px] sm:inline">
                            ({doc.fileName})
                          </span>
                        </div>

                        {/* 3. VERIFIED ICON */}
                        <div className="flex shrink-0 items-center">
                          <Badge className="gap-1 rounded-none border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                            <ShieldCheck className="h-3 w-3 text-emerald-500" />
                            <span>Verified</span>
                          </Badge>
                        </div>

                        {/* 4. VIEW ICON */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            setExpandedDocId(isExpanded ? null : doc.id)
                          }
                          className={cn(
                            "border-border h-7 w-7 shrink-0 cursor-pointer rounded-none transition-colors",
                            isExpanded
                              ? "bg-primary text-primary-foreground border-primary"
                              : "hover:bg-secondary text-foreground",
                          )}
                          title="Inspect Document Details"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>

                        {/* 5. DOWNLOAD ICON */}
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => {
                            alert(`Downloading document: ${doc.fileName}`);
                          }}
                          className="border-border hover:bg-primary hover:text-primary-foreground h-7 w-7 shrink-0 cursor-pointer rounded-none transition-colors"
                          title="Download File"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </Button>
                      </div>

                      {/* OPTIONAL EXPANDED METADATA DRAWER BELOW SINGLE LINE */}
                      {isExpanded && (
                        <div className="bg-background mt-1 flex flex-col gap-2 border border-emerald-500/40 p-3 font-mono text-xs">
                          <div className="text-foreground flex items-center justify-between">
                            <span className="flex items-center gap-1.5 font-bold text-emerald-500">
                              <ShieldCheck className="h-4 w-4" /> Audit Log &
                              Signature
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              Verified by: {doc.verifiedBy}
                            </span>
                          </div>
                          <div className="text-muted-foreground grid grid-cols-2 gap-2 text-[10px]">
                            <div>
                              File:{" "}
                              <span className="text-foreground font-semibold">
                                {doc.fileName}
                              </span>{" "}
                              ({doc.fileSize})
                            </div>
                            <div>
                              Date:{" "}
                              <span className="text-foreground font-semibold">
                                {doc.uploadDate}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="animate-in fade-in-50 flex flex-col gap-4 duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <FolderKanban className="text-primary h-4 w-4" />
                  Assigned Projects & Role Allocations
                </h3>
                <Badge
                  variant="outline"
                  className="border-border rounded-none text-xs"
                >
                  {mockProjects.length} Active Assignments
                </Badge>
              </div>

              <div className="flex flex-col gap-3">
                {mockProjects.map((p) => (
                  <Card
                    key={p.id}
                    className="bg-card border-border flex flex-col gap-3 rounded-none p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-foreground text-sm font-bold">
                          {p.name}
                        </h4>
                        <span className="text-muted-foreground text-xs font-medium">
                          Role:{" "}
                          <span className="text-foreground font-semibold">
                            {p.role}
                          </span>
                        </span>
                      </div>
                      <Badge className="bg-primary/10 text-primary border-primary/30 rounded-none border text-xs">
                        {p.hoursPerWeek}
                      </Badge>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Task Completion
                        </span>
                        <span className="text-foreground font-bold">
                          {p.progress}%
                        </span>
                      </div>
                      <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-300"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: ATTENDANCE & LEAVE SUMMARY */}
          {activeTab === "attendance" && (
            <div className="animate-in fade-in-50 flex flex-col gap-5 duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <CalendarDays className="text-primary h-4 w-4" />
                  Attendance Record & Leave Balances
                </h3>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <Card className="bg-card border-border flex flex-col gap-1 rounded-none p-4">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">
                    Casual Leave
                  </span>
                  <span className="text-foreground text-xl font-extrabold">
                    4 Days
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    Remaining of 12
                  </span>
                </Card>

                <Card className="bg-card border-border flex flex-col gap-1 rounded-none p-4">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">
                    Sick Leave
                  </span>
                  <span className="text-foreground text-xl font-extrabold">
                    6 Days
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    Remaining of 8
                  </span>
                </Card>

                <Card className="bg-card border-border flex flex-col gap-1 rounded-none p-4">
                  <span className="text-muted-foreground text-[10px] font-bold uppercase">
                    Privilege Leave
                  </span>
                  <span className="text-primary text-xl font-extrabold">
                    12 Days
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    Remaining of 15
                  </span>
                </Card>
              </div>
            </div>
          )}

          {/* TAB 5: ASSIGNED ASSETS */}
          {activeTab === "assets" && (
            <div className="animate-in fade-in-50 flex flex-col gap-4 duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-foreground flex items-center gap-2 text-xs font-bold tracking-wider uppercase">
                  <Laptop className="text-primary h-4 w-4" />
                  Hardware & Equipment Assigned
                </h3>
              </div>

              <div className="flex flex-col gap-3">
                {mockAssets.map((ast) => (
                  <Card
                    key={ast.id}
                    className="bg-card border-border flex items-center justify-between rounded-none p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 border-primary/30 text-primary flex h-10 w-10 items-center justify-center border font-bold">
                        <Laptop className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold">
                          {ast.title}
                        </span>
                        <span className="text-muted-foreground font-mono text-[11px]">
                          SN: {ast.serialNumber} &bull; Category: {ast.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <Badge className="rounded-none border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">
                        {ast.status}
                      </Badge>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        Issued: {ast.assignedDate}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
