"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Upload, Calendar } from "lucide-react";
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

export function AddProjectDialog({ onAddProject }: AddProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [iconPreview, setIconPreview] = useState<string | null>(null);

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

  const onSubmit = async (data: CreateProjectFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProject: Project = {
      ...data,
      id: `PRJ-${data.name.slice(0, 4).toUpperCase()}`,
    };

    onAddProject(newProject);
    reset();
    setIconPreview(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 h-8 rounded-none text-xs font-medium text-white shadow"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto rounded-none p-6 shadow-2xl sm:max-w-[540px]">
        {/* BREADCRUMB HEADER MATCHING SCREENSHOT */}
        <DialogHeader className="border-border/80 border-b pb-3">
          <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
            <DialogTitle className="text-base font-bold">
              Add New Client
            </DialogTitle>
          </div>
          <DialogDescription className="text-muted-foreground mt-1 text-[11px]">
            Fill in the project specs, timeline, and personnel below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
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

          {/* STATUS (FULL WIDTH) */}
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
                <SelectItem value="Sprint Planning">Sprint Planning</SelectItem>
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
      </DialogContent>
    </Dialog>
  );
}
