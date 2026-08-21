"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
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
      stageGroup: "New",
      stage: "New",
      periodStart: "01 Mar 25",
      periodEnd: "30 Sep 25",
      managerName: "Vikas Singh",
      managerCode: "AILOITTE-45",
      progress: 0,
      clientType: "client",
    },
  });

  const onSubmit = async (data: CreateProjectFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newProject: Project = {
      ...data,
      id: `PRJ-${Math.floor(10 + Math.random() * 90)}`,
    };

    onAddProject(newProject);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="sm"
          className="bg-primary hover:bg-primary/90 rounded-none font-medium text-white shadow"
        >
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Project
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border shadow-2xl sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Add New Project
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Enter project details. Validated via React Hook Form & Zod.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Project Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. NextGen Web App"
              {...register("name")}
              className="bg-secondary/40 border-border text-sm"
            />
            {errors.name && (
              <p className="text-xs font-medium text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Stage Group</Label>
              <Select
                value={watch("stageGroup")}
                onValueChange={(val) =>
                  setValue(
                    "stageGroup",
                    val as CreateProjectFormValues["stageGroup"],
                  )
                }
              >
                <SelectTrigger className="bg-secondary/40 border-border text-xs">
                  <SelectValue placeholder="Stage" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="New">New</SelectItem>
                  <SelectItem value="In Discovery">In Discovery</SelectItem>
                  <SelectItem value="Sprint Planning">
                    Sprint Planning
                  </SelectItem>
                  <SelectItem value="In Development">In Development</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="progress" className="text-xs font-semibold">
                Progress (%)
              </Label>
              <Input
                id="progress"
                type="number"
                placeholder="0"
                {...register("progress", { valueAsNumber: true })}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="periodStart" className="text-xs font-semibold">
                Start Period
              </Label>
              <Input
                id="periodStart"
                placeholder="01 Feb 25"
                {...register("periodStart")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="periodEnd" className="text-xs font-semibold">
                End Period
              </Label>
              <Input
                id="periodEnd"
                placeholder="30 May 25"
                {...register("periodEnd")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="managerName" className="text-xs font-semibold">
                Manager Name
              </Label>
              <Input
                id="managerName"
                placeholder="Vikas Singh"
                {...register("managerName")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="managerCode" className="text-xs font-semibold">
                Manager Tag
              </Label>
              <Input
                id="managerCode"
                placeholder="AILOITTE-45"
                {...register("managerCode")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="bg-primary text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Project"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
