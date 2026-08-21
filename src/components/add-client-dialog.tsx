"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2 } from "lucide-react";
import {
  createClientFormSchema,
  type CreateClientFormValues,
  type Client,
} from "@/types/client";
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

interface AddClientDialogProps {
  onAddClient: (client: Client) => void;
}

export function AddClientDialog({ onAddClient }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      name: "",
      code: "CLI-8754",
      email: "",
      phone: "",
      gstNumber: "",
      industry: "Software",
      projectCount: 0,
      managerName: "Rahul Yadav",
      managerCode: "AILOITTE-89",
    },
  });

  const onSubmit = async (data: CreateClientFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newClient: Client = {
      ...data,
      id: data.code ? `CLI-${data.code}` : "CLI-NEW",
    };

    onAddClient(newClient);
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-border h-8 rounded-none text-xs font-medium"
        >
          <Plus className="mr-1 h-3 w-3" /> Add Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border shadow-2xl sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Enter client details. Validated via React Hook Form & Zod.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Client Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Acme Corporation"
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
              <Label htmlFor="code" className="text-xs font-semibold">
                Client Code
              </Label>
              <Input
                id="code"
                placeholder="CLI-8754"
                {...register("code")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="industry" className="text-xs font-semibold">
                Industry
              </Label>
              <Input
                id="industry"
                placeholder="Software, Healthcare"
                {...register("industry")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold">
                Contact Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="client@mail.com"
                {...register("email")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-xs font-semibold">
                Contact Phone
              </Label>
              <Input
                id="phone"
                placeholder="91 9876543210"
                {...register("phone")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="gstNumber" className="text-xs font-semibold">
                GST Number
              </Label>
              <Input
                id="gstNumber"
                placeholder="27ABCDE1234F1Z5"
                {...register("gstNumber")}
                className="bg-secondary/40 border-border text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="managerName" className="text-xs font-semibold">
                Account Manager
              </Label>
              <Input
                id="managerName"
                placeholder="Rahul Yadav"
                {...register("managerName")}
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
                "Save Client"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
