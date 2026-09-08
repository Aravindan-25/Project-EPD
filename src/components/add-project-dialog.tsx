"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Loader2,
  Upload,
  Calendar,
  Check,
  Paperclip,
  Trash2,
  FileText,
  CheckCircle2,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  createProjectFormSchema,
  type CreateProjectFormValues,
  type Project,
} from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddProjectDialogProps {
  onAddProject: (project: Project) => void;
}

interface AttachedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
}

export function AddProjectDialog({ onAddProject }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [department, setDepartment] = useState<
    "development" | "data_processing"
  >("development");
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Data Processing multi-step state
  const [dpStep, setDpStep] = useState<1 | 2 | 3>(1);
  const [dpClient, setDpClient] = useState("ffgdfg");
  const [dpProjectName, setDpProjectName] = useState("sdfsdf");
  const [dpProjectCode, setDpProjectCode] = useState("DP-001");
  const [dpContactPerson, setDpContactPerson] = useState("Primary Contact");
  const [dpDeliveryHead, setDpDeliveryHead] = useState("Vikas Singh");

  const [dpPriority, setDpPriority] = useState("Medium");
  const [dpStartDate, setDpStartDate] = useState("01-09-2026");
  const [dpSlaTarget, setDpSlaTarget] = useState("48 Hours");
  const [dpDeadlineTarget, setDpDeadlineTarget] = useState("08-09-2026");
  const [dpRemarks, setDpRemarks] = useState("");

  const [dpDocs, setDpDocs] = useState<AttachedDoc[]>([
    { id: "doc-1", name: "invoice_template.csv", type: "CSV", size: "24 KB" },
    {
      id: "doc-2",
      name: "processing_guidelines.pdf",
      type: "PDF",
      size: "1.2 MB",
    },
  ]);

  // React Hook Form for Development Project
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectFormValues>({
    resolver: zodResolver(createProjectFormSchema),
    defaultValues: {
      name: "",
      code: "",
      stageGroup: "New",
      stage: "New",
      periodStart: "01 Mar 2025",
      periodEnd: "30 Sep 2025",
      managerName: "Vikas Singh",
      managerCode: "AILOITTE-45",
      progress: 0,
      clientType: "client",
      description: "",
      clientName: "",
      contactPerson: "",
      deliveryHead: "Vikas Singh",
    },
  });

  const watchClientType = watch("clientType");

  const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setIconPreview(url);
    }
  };

  const handleFileUploadDP = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs: AttachedDoc[] = Array.from(files).map((file, index) => {
        const ext = file.name.split(".").pop()?.toUpperCase() || "DOC";
        const sizeKb = Math.round(file.size / 1024);
        const sizeStr =
          sizeKb > 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
        return {
          id: `file-${Date.now()}-${index}`,
          name: file.name,
          type: ext,
          size: sizeStr,
        };
      });
      setDpDocs((prev) => [...prev, ...newDocs]);
    }
  };

  const handleDeleteDoc = (id: string) => {
    setDpDocs((prev) => prev.filter((d) => d.id !== id));
  };

  const resetAllForms = () => {
    reset();
    setIconPreview(null);
    setDepartment("development");
    setDpStep(1);
    setDpClient("ffgdfg");
    setDpProjectName("sdfsdf");
    setDpProjectCode("DP-001");
    setDpPriority("Medium");
    setDpStartDate("01-09-2026");
    setDpSlaTarget("48 Hours");
    setDpDeadlineTarget("08-09-2026");
    setDpRemarks("");
  };

  const onSubmitDevelopment = async (data: CreateProjectFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newProject: Project = {
      ...data,
      id: `PRJ-${data.name.slice(0, 4).toUpperCase()}`,
    };

    onAddProject(newProject);
    resetAllForms();
    setOpen(false);
  };

  const onSubmitDataProcessing = async () => {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newProject: Project = {
      id: `DP-${(dpProjectName || "PROJ").slice(0, 4).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      name: dpProjectName || "Data Processing Project",
      code: dpProjectCode || `DP-${Math.floor(100 + Math.random() * 900)}`,
      stageGroup: "New",
      stage: "New",
      periodStart: dpStartDate,
      periodEnd: dpDeadlineTarget,
      managerName: dpDeliveryHead,
      managerCode: "AILOITTE-45",
      progress: 0,
      clientType: "client",
      description: dpRemarks || "Data Processing Project",
      clientName: dpClient,
      contactPerson: dpContactPerson,
      deliveryHead: dpDeliveryHead,
    };

    onAddProject(newProject);
    resetAllForms();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) resetAllForms();
      }}
    >
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 h-8 rounded-none text-xs font-medium text-white shadow"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-h-[92vh] overflow-y-auto rounded-xl p-6 shadow-2xl sm:max-w-[950px]">
        <DialogHeader className="border-border/80 border-b pb-3">
          <DialogTitle className="text-foreground text-base font-bold">
            Add New Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-[11px]">
            Select department and complete project setup options below.
          </DialogDescription>
        </DialogHeader>

        {/* DEPARTMENT SELECTOR (ALWAYS VISIBLE AT TOP) */}
        <div className="bg-secondary/30 border-border/80 rounded-lg border p-3">
          <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-3 sm:items-center">
            <Label className="text-foreground flex items-center gap-1.5 text-xs font-bold">
              <Building2 className="text-primary h-4 w-4" />
              Select Department <span className="text-red-500">*</span>
            </Label>
            <div className="sm:col-span-2">
              <Select
                value={department}
                onValueChange={(val) =>
                  setDepartment(val as "development" | "data_processing")
                }
              >
                <SelectTrigger className="bg-background border-border h-9 w-full rounded-md text-xs font-semibold">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-md">
                  <SelectItem
                    value="development"
                    className="text-xs font-medium"
                  >
                    Software Development
                  </SelectItem>
                  <SelectItem
                    value="data_processing"
                    className="text-xs font-medium"
                  >
                    Data Processing
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* CONDITIONALLY RENDER BASED ON DEPARTMENT */}
        {department === "development" ? (
          /* ================= DEVELOPMENT FORM ================= */
          <form
            onSubmit={handleSubmit(onSubmitDevelopment)}
            className="space-y-4 pt-1"
          >
            {/* PROJECT ICON SECTION */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-semibold">
                Project Icon
              </Label>
              <div className="flex items-center gap-3">
                <label className="border-border hover:bg-secondary/60 bg-secondary/30 relative flex h-14 w-14 cursor-pointer items-center justify-center border transition-colors">
                  {iconPreview ? (
                    <img
                      src={iconPreview}
                      alt="Icon preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-muted-foreground flex flex-col items-center justify-center">
                      <Upload className="h-4 w-4" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleIconUpload}
                    className="hidden"
                  />
                </label>
                {iconPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setIconPreview(null)}
                    className="text-muted-foreground hover:text-destructive h-7 text-xs"
                  >
                    Remove Icon
                  </Button>
                )}
              </div>
            </div>

            {/* PROJECT NAME & PROJECT ID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="name"
                  className="text-foreground text-xs font-semibold"
                >
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="Enter Project Name"
                  {...register("name")}
                  className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs"
                />
                {errors.name && (
                  <p className="text-[11px] font-medium text-red-500">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="code"
                  className="text-foreground text-xs font-semibold"
                >
                  Project ID
                </Label>
                <Input
                  id="code"
                  placeholder="Enter Project ID"
                  {...register("code")}
                  className="bg-secondary/40 border-border h-9 w-full rounded-none font-mono text-xs"
                />
              </div>
            </div>

            {/* STATUS */}
            <div className="space-y-1">
              <Label className="text-foreground text-xs font-semibold">
                Status
              </Label>
              <Select
                value={watch("stageGroup")}
                onValueChange={(val) =>
                  setValue(
                    "stageGroup",
                    val as CreateProjectFormValues["stageGroup"],
                  )
                }
              >
                <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Discovery">In Discovery</SelectItem>
                  <SelectItem value="Sprint Planning">
                    Sprint Planning
                  </SelectItem>
                  <SelectItem value="In Development">In Development</SelectItem>
                  <SelectItem value="In UAT">In UAT</SelectItem>
                  <SelectItem value="Released & In Support">
                    Released & In Support
                  </SelectItem>
                  <SelectItem value="In Maintenance">In Maintenance</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* IN HOUSE PROJECT RADIO BUTTONS */}
            <div className="space-y-1.5">
              <Label className="text-foreground text-xs font-semibold">
                In House Project
              </Label>
              <div className="flex items-center gap-6 pt-0.5">
                <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                  <input
                    type="radio"
                    name="inHouseRadio"
                    checked={watchClientType === "in_house"}
                    onChange={() => setValue("clientType", "in_house")}
                    className="accent-primary h-4 w-4"
                  />
                  Yes
                </label>
                <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                  <input
                    type="radio"
                    name="inHouseRadio"
                    checked={watchClientType === "client"}
                    onChange={() => setValue("clientType", "client")}
                    className="accent-primary h-4 w-4"
                  />
                  No
                </label>
              </div>
            </div>

            {/* PROJECT DESCRIPTION */}
            <div className="space-y-1">
              <Label
                htmlFor="description"
                className="text-foreground text-xs font-semibold"
              >
                Project Description
              </Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Enter Project description"
                {...register("description")}
                className="bg-secondary/40 border-border text-foreground focus-visible:ring-primary w-full rounded-none border p-2 text-xs focus:outline-none"
              />
            </div>

            {/* CLIENTS & CONTACT PERSON */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Clients
                </Label>
                <Select
                  value={watch("clientName")}
                  onValueChange={(val) => setValue("clientName", val)}
                >
                  <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                    <SelectValue placeholder="Select Client" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="Acton Ewing">Acton Ewing</SelectItem>
                    <SelectItem value="Rakesh Client">Rakesh Client</SelectItem>
                    <SelectItem value="Vipul Client">Vipul Client</SelectItem>
                    <SelectItem value="Apple">Apple</SelectItem>
                    <SelectItem value="Dr. Morpin">Dr. Morpin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Contact Person
                </Label>
                <Select
                  value={watch("contactPerson")}
                  onValueChange={(val) => setValue("contactPerson", val)}
                >
                  <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                    <SelectValue placeholder="Select Contact Person" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="Primary Contact">
                      Primary Contact
                    </SelectItem>
                    <SelectItem value="John Doe">John Doe</SelectItem>
                    <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* HEAD OF DELIVERY & PROJECT MANAGER */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Head Of Delivery
                </Label>
                <Select
                  value={watch("deliveryHead")}
                  onValueChange={(val) => setValue("deliveryHead", val)}
                >
                  <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                    <SelectValue placeholder="Select Delivery Head" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="Vikas Singh">Vikas Singh</SelectItem>
                    <SelectItem value="Test RUR">Test RUR</SelectItem>
                    <SelectItem value="Rahul Yadav">Rahul Yadav</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Project Manager
                </Label>
                <Select
                  value={watch("managerName")}
                  onValueChange={(val) => {
                    setValue("managerName", val);
                    if (val === "Dehradun Kumar")
                      setValue("managerCode", "EMP40");
                    else if (val === "Sahara Acharya")
                      setValue("managerCode", "EMP39");
                    else if (val === "Deepak Rawat")
                      setValue("managerCode", "EMP25");
                    else if (val === "Rahul Yadav")
                      setValue("managerCode", "AILOITTE-89");
                    else if (val === "Vikas Singh")
                      setValue("managerCode", "AILOITTE-45");
                  }}
                >
                  <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                    <SelectValue placeholder="Select Project Manager" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border rounded-none">
                    <SelectItem value="Dehradun Kumar">
                      Dehradun Kumar (EMP40)
                    </SelectItem>
                    <SelectItem value="Sahara Acharya">
                      Sahara Acharya (EMP39)
                    </SelectItem>
                    <SelectItem value="Deepak Rawat">
                      Deepak Rawat (EMP25)
                    </SelectItem>
                    <SelectItem value="Rahul Yadav">
                      Rahul Yadav (AILOITTE-89)
                    </SelectItem>
                    <SelectItem value="Vikas Singh">
                      Vikas Singh (AILOITTE-45)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* START DATE & END DATE */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="periodStart"
                  className="text-foreground text-xs font-semibold"
                >
                  Start Date
                </Label>
                <div className="relative">
                  <Input
                    id="periodStart"
                    placeholder="DD/MM/YYYY"
                    {...register("periodStart")}
                    className="bg-secondary/40 border-border h-9 w-full rounded-none pr-8 font-mono text-xs"
                  />
                  <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="periodEnd"
                  className="text-foreground text-xs font-semibold"
                >
                  End Date
                </Label>
                <div className="relative">
                  <Input
                    id="periodEnd"
                    placeholder="DD/MM/YYYY"
                    {...register("periodEnd")}
                    className="bg-secondary/40 border-border h-9 w-full rounded-none pr-8 font-mono text-xs"
                  />
                  <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                </div>
              </div>
            </div>

            {/* FOOTER ACTIONS */}
            <DialogFooter className="border-border flex flex-row items-center justify-between border-t pt-4 sm:justify-between">
              <div className="flex items-center gap-2"></div>

              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 rounded-none px-6 font-semibold text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create"
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* ================= DATA PROCESSING FORM (3 STEPS) ================= */
          <div className="space-y-5 pt-2">
            {/* STEPPER HEADER MATCHING REFERENCE UI */}
            <div className="border-border/70 flex items-center justify-between rounded-xl border bg-slate-50/50 px-3 py-3 dark:bg-slate-900/40">
              {/* STEP 1 */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    dpStep > 1
                      ? "border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : dpStep === 1
                        ? "bg-indigo-600 text-white"
                        : "border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {dpStep > 1 ? <Check className="h-4 w-4 stroke-[3]" /> : "1"}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    dpStep === 1
                      ? "font-bold text-slate-900 dark:text-slate-100"
                      : dpStep > 1
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400"
                  }`}
                >
                  Client & Project Details
                </span>
              </div>

              {/* CONNECTING LINE 1-2 */}
              <div
                className={`mx-3 h-[2px] flex-1 transition-colors ${
                  dpStep > 1
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />

              {/* STEP 2 */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    dpStep > 2
                      ? "border-2 border-emerald-500 bg-emerald-500/10 text-emerald-500"
                      : dpStep === 2
                        ? "bg-indigo-600 text-white"
                        : "border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  {dpStep > 2 ? <Check className="h-4 w-4 stroke-[3]" /> : "2"}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    dpStep === 2
                      ? "font-bold text-slate-900 dark:text-slate-100"
                      : dpStep > 2
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-slate-400"
                  }`}
                >
                  Timeline & Priority
                </span>
              </div>

              {/* CONNECTING LINE 2-3 */}
              <div
                className={`mx-3 h-[2px] flex-1 transition-colors ${
                  dpStep > 2
                    ? "bg-emerald-500"
                    : "bg-slate-200 dark:bg-slate-800"
                }`}
              />

              {/* STEP 3 */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    dpStep === 3
                      ? "bg-indigo-600 text-white"
                      : "border-2 border-slate-300 text-slate-400"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-xs font-semibold ${
                    dpStep === 3
                      ? "font-bold text-slate-900 dark:text-slate-100"
                      : "text-slate-400"
                  }`}
                >
                  Review & Documents
                </span>
              </div>
            </div>

            {/* STEP 1 CONTENT: Client & Project Details */}
            {dpStep === 1 && (
              <div className="border-border/80 bg-card space-y-4 rounded-xl border p-5 shadow-sm">
                <div className="border-border/60 flex items-center gap-2.5 border-b pb-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <h3 className="text-foreground text-sm font-bold">
                    Step 1: Client & Project Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Client <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={dpClient}
                      onChange={(e) => setDpClient(e.target.value)}
                      placeholder="Enter Client Name"
                      className="border-border bg-secondary/30 h-9 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Project Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={dpProjectName}
                      onChange={(e) => setDpProjectName(e.target.value)}
                      placeholder="Enter Project Name"
                      className="border-border bg-secondary/30 h-9 rounded-md text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Project ID
                    </Label>
                    <Input
                      value={dpProjectCode}
                      onChange={(e) => setDpProjectCode(e.target.value)}
                      placeholder="Enter Project Code"
                      className="border-border bg-secondary/30 h-9 rounded-md font-mono text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Contact Person
                    </Label>
                    <Select
                      value={dpContactPerson}
                      onValueChange={setDpContactPerson}
                    >
                      <SelectTrigger className="border-border bg-secondary/30 h-9 rounded-md text-xs">
                        <SelectValue placeholder="Select Contact Person" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Primary Contact">
                          Primary Contact
                        </SelectItem>
                        <SelectItem value="John Doe">John Doe</SelectItem>
                        <SelectItem value="Jane Smith">Jane Smith</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Delivery Head / Manager
                  </Label>
                  <Select
                    value={dpDeliveryHead}
                    onValueChange={setDpDeliveryHead}
                  >
                    <SelectTrigger className="border-border bg-secondary/30 h-9 rounded-md text-xs">
                      <SelectValue placeholder="Select Manager" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="Vikas Singh">
                        Vikas Singh (AILOITTE-45)
                      </SelectItem>
                      <SelectItem value="Rahul Yadav">
                        Rahul Yadav (AILOITTE-89)
                      </SelectItem>
                      <SelectItem value="Sahara Acharya">
                        Sahara Acharya (EMP39)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* FOOTER ACTIONS STEP 1 */}
                <div className="border-border flex items-center justify-between border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="h-9 rounded-md px-4 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setDpStep(2)}
                    className="h-9 rounded-md bg-indigo-600 px-5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            )}

            {/* STEP 2 CONTENT: Timeline & Priority (EXACT SCREENSHOT MATCH) */}
            {dpStep === 2 && (
              <div className="border-border/80 bg-card space-y-4 rounded-xl border p-5 shadow-sm">
                <div className="border-border/60 flex items-center gap-2.5 border-b pb-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <h3 className="text-foreground text-sm font-bold">
                    Step 2: Timeline & Priority
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Priority */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Priority <span className="text-red-500">*</span>
                    </Label>
                    <Select value={dpPriority} onValueChange={setDpPriority}>
                      <SelectTrigger className="border-border bg-secondary/30 h-9 rounded-md text-xs font-medium">
                        <SelectValue placeholder="Select Priority" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        <SelectItem value="Urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Start Date */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={dpStartDate}
                        onChange={(e) => setDpStartDate(e.target.value)}
                        placeholder="DD-MM-YYYY"
                        className="border-border bg-secondary/30 h-9 rounded-md pr-8 font-mono text-xs"
                      />
                      <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                    </div>
                  </div>

                  {/* SLA Benchmark Target */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      SLA Benchmark Target
                    </Label>
                    <Input
                      value={dpSlaTarget}
                      onChange={(e) => setDpSlaTarget(e.target.value)}
                      placeholder="e.g. 48 Hours"
                      className="border-border bg-secondary/30 h-9 rounded-md text-xs"
                    />
                  </div>

                  {/* Deadline Target */}
                  <div className="space-y-1.5">
                    <Label className="text-foreground text-xs font-semibold">
                      Deadline Target <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        value={dpDeadlineTarget}
                        onChange={(e) => setDpDeadlineTarget(e.target.value)}
                        placeholder="DD-MM-YYYY"
                        className="border-border bg-secondary/30 h-9 rounded-md pr-8 font-mono text-xs"
                      />
                      <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Project Remarks & Execution Notes */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Project Remarks & Execution Notes
                  </Label>
                  <textarea
                    rows={3}
                    value={dpRemarks}
                    onChange={(e) => setDpRemarks(e.target.value)}
                    placeholder="Enter special instructions or processing requirements..."
                    className="border-border bg-secondary/30 text-foreground focus:ring-primary w-full rounded-md border p-2.5 text-xs focus:ring-1 focus:outline-none"
                  />
                </div>

                {/* FOOTER ACTIONS STEP 2 */}
                <div className="border-border flex items-center justify-between border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDpStep(1)}
                    className="h-9 rounded-md px-4 text-xs"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      className="h-9 rounded-md px-3 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setDpStep(3)}
                      className="h-9 rounded-md bg-indigo-600 px-5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700"
                    >
                      Next <ChevronRight className="ml-1 h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3 CONTENT: Review & Documents (EXACT SCREENSHOT MATCH) */}
            {dpStep === 3 && (
              <div className="border-border/80 bg-card space-y-5 rounded-xl border p-5 shadow-sm">
                <div className="border-border/60 flex items-center gap-2.5 border-b pb-3">
                  <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <h3 className="text-foreground text-sm font-bold">
                    Step 3: Review & Documents
                  </h3>
                </div>

                {/* PROJECT SUMMARY CARD */}
                <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                  <div className="mb-3 text-[11px] font-extrabold tracking-wider text-slate-500 uppercase dark:text-slate-400">
                    Project Summary
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <div className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                        Client
                      </div>
                      <div className="text-foreground truncate text-xs font-bold">
                        {dpClient || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                        Project Name
                      </div>
                      <div className="text-foreground truncate text-xs font-bold">
                        {dpProjectName || "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                        Priority
                      </div>
                      <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {dpPriority}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-wide text-slate-400 uppercase">
                        SLA Target
                      </div>
                      <div className="text-foreground text-xs font-bold">
                        {dpSlaTarget || "—"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* CLIENT REFERENCE DOCUMENTS & SPECIFICATIONS */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                        <Paperclip className="h-3.5 w-3.5 text-indigo-600" />
                        Client Reference Documents & Specifications
                      </div>
                      <p className="text-muted-foreground text-[11px]">
                        Upload guidelines, invoices, sample layouts, or specs
                        provided by client
                      </p>
                    </div>

                    {/* DYNAMIC UPLOAD BUTTON */}
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        multiple
                        onChange={handleFileUploadDP}
                        className="hidden"
                      />
                      <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-200 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-950">
                        <Plus className="h-3.5 w-3.5" /> Upload File
                      </span>
                    </label>
                  </div>

                  {/* DOCUMENTS TABLE */}
                  <div className="border-border bg-background overflow-hidden rounded-xl border">
                    <div className="border-border grid grid-cols-12 border-b bg-slate-100/70 px-3 py-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase dark:bg-slate-900">
                      <div className="col-span-6">Document Name</div>
                      <div className="col-span-2">Type</div>
                      <div className="col-span-2">Size</div>
                      <div className="col-span-2 text-right">Action</div>
                    </div>

                    <div className="divide-border divide-y">
                      {dpDocs.length === 0 ? (
                        <div className="text-muted-foreground p-4 text-center text-xs">
                          No documents uploaded yet.
                        </div>
                      ) : (
                        dpDocs.map((doc) => (
                          <div
                            key={doc.id}
                            className="hover:bg-muted/30 grid grid-cols-12 items-center px-3 py-2.5 text-xs transition-colors"
                          >
                            <div className="text-foreground col-span-6 flex items-center gap-2 truncate font-medium">
                              {doc.type === "CSV" ? (
                                <FileText className="h-4 w-4 shrink-0 text-emerald-600" />
                              ) : (
                                <FileText className="h-4 w-4 shrink-0 text-rose-500" />
                              )}
                              <span className="truncate">{doc.name}</span>
                            </div>
                            <div className="text-muted-foreground col-span-2 font-mono text-[11px]">
                              {doc.type}
                            </div>
                            <div className="text-muted-foreground col-span-2 font-mono text-[11px]">
                              {doc.size}
                            </div>
                            <div className="col-span-2 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteDoc(doc.id)}
                                className="text-muted-foreground p-1 transition-colors hover:text-rose-600"
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

                {/* FOOTER ACTIONS STEP 3 */}
                <div className="border-border flex items-center justify-between border-t pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDpStep(2)}
                    className="h-9 rounded-md px-4 text-xs"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setOpen(false)}
                      className="h-9 rounded-md px-3 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={onSubmitDataProcessing}
                      className="flex h-9 items-center gap-1.5 rounded-md bg-[#059669] px-5 text-xs font-bold text-white shadow-md hover:bg-[#047857]"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Complete & Create
                      Project
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
