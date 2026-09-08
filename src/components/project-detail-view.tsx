import React, { useState } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { Project, TeamMember, ProjectTeam } from "@/types/project";
import { ManageTeamDialog } from "@/components/manage-team-dialog";

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
    "overview" | "batches" | "attachments" | "activity"
  >("overview");
  const [activitySubTab, setActivitySubTab] = useState<
    "user_actions" | "data_diffs"
  >("user_actions");

  const isDataProcessing =
    project.department === "data_processing" ||
    project.projectType?.toLowerCase().includes("data") ||
    project.projectType?.toLowerCase().includes("annotation") ||
    project.id?.startsWith("DP-") ||
    project.id === "prj-01" ||
    project.code === "PRJ-001";

  const totalMembers = project.teams
    ? project.teams.reduce((acc, t) => acc + t.members.length, 0)
    : project.teamMembers?.length || 0;

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
                    {project.code || "PRJ-001"}
                  </span>
                  <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                    {project.name}
                  </h1>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500"></span>
                    {project.projectStatus || "IN PROGRESS"}
                  </span>
                </div>

                <p className="text-muted-foreground pt-1 text-xs">
                  Client:{" "}
                  <span className="text-foreground font-semibold">
                    {project.clientName || "BioTech Global Corp"}
                  </span>
                  {" · "}
                  Type:{" "}
                  <span className="text-foreground font-semibold">
                    {project.projectType || "Data Annotation"}
                  </span>
                  {" · "}
                  Start:{" "}
                  <span className="text-foreground font-semibold">
                    {project.periodStart || "2026-08-01"}
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
                  className="border-border cursor-pointer gap-1.5 self-start text-xs font-semibold sm:self-auto"
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
                    <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600 dark:border-blue-800 dark:bg-blue-950/40 dark:text-blue-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                      {project.projectStatus || "IN PROGRESS"}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Project ID
                      </span>
                      <span className="text-foreground font-mono text-xs font-bold">
                        {project.id === "prj-01"
                          ? "prj-01"
                          : project.id.toLowerCase()}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Project Name
                      </span>
                      <span className="text-foreground text-sm font-bold">
                        {project.name}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Project Type
                        </span>
                        <span className="bg-primary/10 text-primary border-primary/20 inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium">
                          {project.projectType || "Data Annotation"}
                        </span>
                      </div>

                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Project Status
                        </span>
                        <span className="text-foreground font-mono text-xs font-bold">
                          {project.projectStatus || "IN_PROGRESS"}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Description
                      </span>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {project.description ||
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
                        {project.clientName || "BioTech Global Corp"}
                      </span>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Primary Email Address
                      </span>
                      <a
                        href={`mailto:${project.clientEmail || "biotech.client@biotech-global.com"}`}
                        className="text-primary text-xs font-semibold hover:underline"
                      >
                        {project.clientEmail ||
                          "biotech.client@biotech-global.com"}
                      </a>
                    </div>

                    <div>
                      <span className="text-muted-foreground mb-2 block text-xs font-medium">
                        Secondary Email Addresses
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(project.secondaryEmails &&
                        project.secondaryEmails.length > 0
                          ? project.secondaryEmails
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
                  <div className="space-y-3">
                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Start Date
                      </span>
                      <span className="text-foreground text-xs font-bold">
                        {project.periodStart &&
                        project.periodStart.includes("2026")
                          ? "August 1, 2026"
                          : project.periodStart || "August 1, 2026"}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground mb-1 block text-xs font-medium">
                        Last Updated
                      </span>
                      <span className="text-muted-foreground font-mono text-xs">
                        {project.lastUpdated || "Aug 25, 2026, 07:30 PM"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Start Time
                    </span>
                    <span className="text-foreground font-mono text-xs font-bold">
                      {project.startTime || "09:00"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created By
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {project.createdBy ||
                        project.managerName ||
                        "Vikram Malhotra"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created At
                    </span>
                    <span className="text-muted-foreground font-mono text-xs">
                      {project.createdAt || "Aug 1, 2026, 02:30 PM"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB CONTENT 2: BATCHES */}
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
                      3 Batches
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Batches, record types, languages, total records, and image
                    allocations.
                  </p>
                </div>

                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex cursor-pointer items-center gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold shadow-xs sm:self-auto">
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
                        <th className="p-3.5">TOTAL RECORDS</th>
                        <th className="p-3.5">DATE AND TIME</th>
                        <th className="p-3.5">NUMBER OF IMAGES</th>
                        <th className="p-3.5">STATUS</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {[
                        {
                          id: "BAT-001",
                          name: "Alpha Records - Batch 01",
                          type: "BIRTH_RECORDS",
                          lang: "ENGLISH",
                          records: "500 records",
                          datetime: "2026-08-05 10:00 AM",
                          images: "3 images",
                          status: "COMPLETED",
                          statusType: "emerald",
                        },
                        {
                          id: "BAT-002",
                          name: "Alpha Records - Batch 02",
                          type: "MARRIAGE_RECORDS",
                          lang: "FRENCH",
                          records: "450 records",
                          datetime: "2026-08-12 11:30 AM",
                          images: "2 images",
                          status: "COMPLETED",
                          statusType: "emerald",
                        },
                        {
                          id: "BAT-003",
                          name: "Alpha Records - Batch 03",
                          type: "COMMUNICATION_RECORDS",
                          lang: "ENGLISH",
                          records: "450 records",
                          datetime: "2026-08-20 02:15 PM",
                          images: "3 images",
                          status: "CREATED",
                          statusType: "primary",
                        },
                      ].map((b, i) => (
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
                            <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-medium uppercase">
                              {b.type}
                            </span>
                          </td>
                          <td className="text-muted-foreground p-3.5 font-medium uppercase">
                            {b.lang}
                          </td>
                          <td className="text-foreground p-3.5 font-mono font-bold">
                            {b.records}
                          </td>
                          <td className="text-muted-foreground p-3.5 font-mono">
                            {b.datetime}
                          </td>
                          <td className="p-3.5">
                            <span className="text-foreground flex items-center gap-1.5 font-bold">
                              <FileText className="text-primary h-3.5 w-3.5" />
                              {b.images}
                            </span>
                          </td>
                          <td className="p-3.5">
                            {b.statusType === "emerald" ? (
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                COMPLETED
                              </span>
                            ) : (
                              <span className="bg-primary/10 border-primary/30 text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                                <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
                                CREATED
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-border h-7 gap-1 rounded-md text-xs font-semibold"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Images
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
              {/* DROPZONE CARD */}
              <div className="border-primary/30 bg-primary/5 flex flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed p-8 text-center">
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
                  variant="outline"
                  className="border-border bg-background h-8 gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
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
                    2 reference documents uploaded
                  </p>
                </div>

                <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="p-3.5">FILE NAME</th>
                          <th className="p-3.5">FILE TYPE</th>
                          <th className="p-3.5">SIZE</th>
                          <th className="p-3.5">ATTACHED DATE AND TIME</th>
                          <th className="p-3.5 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/60 divide-y">
                        {[
                          {
                            name: "BioTech_Alpha_Guidelines_v3.pdf",
                            type: "PDF (SOP)",
                            size: "4.2 MB",
                            datetime: "2026-08-01 10:30 AM",
                          },
                          {
                            name: "Cell_Taxonomy_Vocabulary_2026.json",
                            type: "JSON (Dictionary)",
                            size: "1.8 MB",
                            datetime: "2026-08-03 04:15 PM",
                          },
                        ].map((doc, i) => (
                          <tr
                            key={i}
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
                            <td className="text-muted-foreground p-3.5 font-mono">
                              {doc.datetime}
                            </td>
                            <td className="space-x-2 p-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border h-7 gap-1 rounded-md text-xs font-semibold"
                              >
                                <Eye className="h-3.5 w-3.5" /> View
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))}
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
                    ? "13 Recorded Actions"
                    : "4 Data Audit Diffs"}
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
                        {[
                          { time: "Sep 3, 2026, 05:00 PM" },
                          { time: "Sep 3, 2026, 05:00 PM" },
                          { time: "Sep 3, 2026, 04:39 PM" },
                          { time: "Sep 3, 2026, 04:39 PM" },
                          { time: "Sep 3, 2026, 04:39 PM" },
                        ].map((log, i) => (
                          <tr
                            key={i}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="p-3.5">
                              <span className="text-foreground block font-bold">
                                Vikram Malhotra
                              </span>
                              <span className="text-muted-foreground block text-[11px]">
                                Project Manager
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-secondary border-border text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                                VIEW
                              </span>
                            </td>
                            <td className="text-foreground p-3.5 font-medium">
                              Project
                            </td>
                            <td className="text-primary p-3.5 font-mono font-bold">
                              PRJ-001
                            </td>
                            <td className="text-muted-foreground p-3.5">
                              Project workspace opened in browser session.
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                SUCCESS
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
                        {[
                          {
                            field: "Client Email",
                            oldVal: "biotech@old.com",
                            newVal: "biotech.client@biotech-global.com",
                            user: "Vikram Malhotra",
                            date: "Sep 01, 2026, 11:20 AM",
                          },
                          {
                            field: "Project Status",
                            oldVal: "CREATED",
                            newVal: "IN_PROGRESS",
                            user: "Vikram Malhotra",
                            date: "Aug 25, 2026, 07:30 PM",
                          },
                        ].map((diff, i) => (
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
