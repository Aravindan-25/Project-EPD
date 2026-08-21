"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Loader2, Upload, X } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddClientDialogProps {
  onAddClient: (client: Client) => void;
}

export function AddClientDialog({ onAddClient }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientFormValues>({
    resolver: zodResolver(createClientFormSchema),
    defaultValues: {
      name: "",
      code: "",
      email: "",
      phone: "",
      gstNumber: "",
      industry: "Software",
      projectCount: 0,
      managerName: "Rahul Yadav",
      managerCode: "AILOITTE-89",
      address: "",
      loginEmail: "",
      contactPersons: [
        {
          name: "",
          designation: "",
          email: "",
          phone: "",
          isPrimary: true,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "contactPersons",
  });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const onSubmit = async (data: CreateClientFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const primaryContact = data.contactPersons?.[0];
    const newClient: Client = {
      ...data,
      id: data.code ? `CLI-${data.code}` : `CLI-NEW`,
      email: primaryContact?.email || data.email || "",
      phone: primaryContact?.phone || data.phone || "",
    };

    onAddClient(newClient);
    reset();
    setLogoPreview(null);
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
      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto rounded-none p-6 shadow-2xl sm:max-w-[560px]">
        <DialogHeader className="border-border border-b pb-3">
          <DialogTitle className="text-base font-bold">
            Add New Client
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Fill in the client credentials and contact details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* CLIENT LOGO SECTION */}
          <div className="space-y-1.5">
            <Label className="text-foreground text-xs font-semibold">
              Client Logo
            </Label>
            <div className="flex items-center gap-3">
              <label className="border-border hover:bg-secondary/60 bg-secondary/30 relative flex h-14 w-14 cursor-pointer items-center justify-center border transition-colors">
                {logoPreview ? (
                  <img
                    src={logoPreview}
                    alt="Logo preview"
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
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
              {logoPreview && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setLogoPreview(null)}
                  className="text-muted-foreground hover:text-destructive h-7 text-xs"
                >
                  Remove Logo
                </Button>
              )}
            </div>
          </div>

          {/* TOP FIELDS GRID */}
          <div className="grid grid-cols-2 gap-3">
            {/* Clients Name */}
            <div className="space-y-1">
              <Label
                htmlFor="name"
                className="text-foreground text-xs font-semibold"
              >
                Clients Name
              </Label>
              <Input
                id="name"
                placeholder="Enter Clients Name"
                {...register("name")}
                className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs"
              />
              {errors.name && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Clients ID */}
            <div className="space-y-1">
              <Label
                htmlFor="code"
                className="text-foreground text-xs font-semibold"
              >
                Clients ID
              </Label>
              <Input
                id="code"
                placeholder="Enter Clients ID"
                {...register("code")}
                className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs"
              />
              {errors.code && (
                <p className="text-[11px] font-medium text-red-500">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Industry (FULL WIDTH) */}
            <div className="col-span-2 space-y-1">
              <Label className="text-foreground text-xs font-semibold">
                Industry
              </Label>
              <Select
                value={watch("industry")}
                onValueChange={(val) => setValue("industry", val)}
              >
                <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                  <SelectValue placeholder="Select Industry" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  <SelectItem value="Software">Software</SelectItem>
                  <SelectItem value="Artificial-Intelligence">
                    Artificial-Intelligence
                  </SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Telecommunications">
                    Telecommunications
                  </SelectItem>
                  <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Account Manager (FULL WIDTH) */}
            <div className="col-span-2 space-y-1">
              <Label className="text-foreground text-xs font-semibold">
                Account Manager
              </Label>
              <Select
                value={watch("managerName")}
                onValueChange={(val) => {
                  setValue("managerName", val);
                  if (val === "Test RUR")
                    setValue("managerCode", "AILOITTE-73");
                  else if (val === "Rahul Yadav")
                    setValue("managerCode", "AILOITTE-89");
                  else if (val === "HR Jay Mishra")
                    setValue("managerCode", "AILOITTE-47");
                  else if (val === "Dehradun Kumar")
                    setValue("managerCode", "EMP40");
                  else if (val === "Vikas Singh")
                    setValue("managerCode", "AILOITTE-45");
                }}
              >
                <SelectTrigger className="bg-secondary/40 border-border h-9 w-full rounded-none text-xs">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  <SelectItem value="Test RUR">
                    Test RUR (AILOITTE-73)
                  </SelectItem>
                  <SelectItem value="Rahul Yadav">
                    Rahul Yadav (AILOITTE-89)
                  </SelectItem>
                  <SelectItem value="HR Jay Mishra">
                    HR Jay Mishra (AILOITTE-47)
                  </SelectItem>
                  <SelectItem value="Dehradun Kumar">
                    Dehradun Kumar (EMP40)
                  </SelectItem>
                  <SelectItem value="Vikas Singh">
                    Vikas Singh (AILOITTE-45)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GSTIN */}
          <div className="space-y-1">
            <Label
              htmlFor="gstNumber"
              className="text-foreground text-xs font-semibold"
            >
              GSTIN
            </Label>
            <Input
              id="gstNumber"
              placeholder="Enter GSTIN"
              {...register("gstNumber")}
              className="bg-secondary/40 border-border h-9 w-full rounded-none font-mono text-xs"
            />
          </div>

          {/* ADDRESS */}
          <div className="space-y-1">
            <Label
              htmlFor="address"
              className="text-foreground text-xs font-semibold"
            >
              Address
            </Label>
            <textarea
              id="address"
              rows={3}
              placeholder="Enter full address"
              {...register("address")}
              className="bg-secondary/40 border-border text-foreground focus-visible:ring-primary w-full rounded-none border p-2 text-xs focus:outline-none"
            />
          </div>

          {/* CONTACT PERSON SECTION */}
          <div className="space-y-3 pt-2">
            <h4 className="text-foreground text-xs font-bold">
              Contact Person
            </h4>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border-border/60 space-y-3 border-b pb-3"
              >
                {fields.length > 1 && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-semibold">
                      Contact #{index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-muted-foreground hover:text-destructive h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  {/* Contact Person Name */}
                  <div className="space-y-1">
                    <Label className="text-foreground text-[11px] font-medium">
                      Contact Person Name
                    </Label>
                    <Input
                      placeholder="Enter Contact Person Name"
                      {...register(`contactPersons.${index}.name` as const)}
                      className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
                    />
                  </div>

                  {/* Designation */}
                  <div className="space-y-1">
                    <Label className="text-foreground text-[11px] font-medium">
                      Designation
                    </Label>
                    <Input
                      placeholder="Enter Designation"
                      {...register(
                        `contactPersons.${index}.designation` as const,
                      )}
                      className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
                    />
                  </div>

                  {/* Contact Person Email */}
                  <div className="space-y-1">
                    <Label className="text-foreground text-[11px] font-medium">
                      Contact Person Email
                    </Label>
                    <Input
                      type="email"
                      placeholder="Enter Contact Person Email"
                      {...register(`contactPersons.${index}.email` as const)}
                      className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
                    />
                  </div>

                  {/* Contact Person Number */}
                  <div className="space-y-1">
                    <Label className="text-foreground text-[11px] font-medium">
                      Contact Person Number
                    </Label>
                    <div className="flex">
                      <span className="bg-secondary text-muted-foreground border-border flex items-center border border-r-0 px-2.5 text-xs font-medium">
                        +91
                      </span>
                      <Input
                        placeholder="Enter Number"
                        {...register(`contactPersons.${index}.phone` as const)}
                        className="bg-secondary/40 border-border h-8 flex-1 rounded-none text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Make Primary Contact Checkbox */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id={`primary-${index}`}
                    {...register(`contactPersons.${index}.isPrimary` as const)}
                    className="border-border accent-primary h-3.5 w-3.5 rounded-none"
                  />
                  <label
                    htmlFor={`primary-${index}`}
                    className="text-muted-foreground cursor-pointer text-xs font-medium"
                  >
                    Make Primary Contact
                  </label>
                </div>
              </div>
            ))}

            {/* Add More Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() =>
                append({
                  name: "",
                  designation: "",
                  email: "",
                  phone: "",
                  isPrimary: false,
                })
              }
              className="text-foreground hover:bg-secondary h-8 gap-1.5 px-0 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Add More
            </Button>
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
