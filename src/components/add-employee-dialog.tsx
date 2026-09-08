"use client";

import React, { useState } from "react";
import {
  UserPlus,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  Save,
  X,
  User,
  Building2,
  FileText,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { EmployeeRecord } from "@/components/employees-management-view";

interface AddEmployeeDialogProps {
  onAddEmployee: (employee: EmployeeRecord) => void;
}

export function AddEmployeeDialog({ onAddEmployee }: AddEmployeeDialogProps) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // STEP 1 FIELDS: Personal & Address Info
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [dob, setDob] = useState("1995-01-01");
  const [gender, setGender] = useState("Male");
  const [maritalStatus, setMaritalStatus] = useState("Single");
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [nationality, setNationality] = useState("Indian");
  const [panNumber, setPanNumber] = useState("ABCDE1234F");
  const [aadhaarNumber, setAadhaarNumber] = useState("XXXX-XXXX-XXXX");

  const [addressLine1, setAddressLine1] = useState(
    "House/Flat No., Building Name, Street",
  );
  const [addressLine2, setAddressLine2] = useState("Landmark, Area / Locality");
  const [city, setCity] = useState("Bengaluru");
  const [stateName, setStateName] = useState("Karnataka");
  const [country, setCountry] = useState("India");
  const [pinCode, setPinCode] = useState("560103");

  const [emergencyContactName, setEmergencyContactName] = useState("Mary Doe");
  const [emergencyRelationship, setEmergencyRelationship] = useState("Spouse");
  const [emergencyPhone, setEmergencyPhone] = useState("+91 98765 00000");

  // STEP 2 FIELDS: Job & Compensation
  const [department, setDepartment] = useState("Engineering");
  const [subDepartment, setSubDepartment] = useState("Software Development");
  const [designation, setDesignation] = useState("Software Engineer");
  const [team, setTeam] = useState("Core Team");
  const [roleTitle, setRoleTitle] = useState("Individual Contributor");
  const [reportsTo, setReportsTo] = useState("Tech Lead / Manager");

  const [employmentType, setEmploymentType] = useState("Full-time");
  const [jobType, setJobType] = useState("Hybrid");
  const [workLocation, setWorkLocation] = useState("Bengaluru Campus - B4");
  const [dateOfJoining, setDateOfJoining] = useState("2026-08-27");
  const [probationPeriod, setProbationPeriod] = useState("3 Months");
  const [probationEndDate, setProbationEndDate] = useState("2026-11-27");
  const [grade, setGrade] = useState("G3 - Senior");
  const [band, setBand] = useState("B1");
  const [noticePeriod, setNoticePeriod] = useState("30 Days");
  const [shiftTiming, setShiftTiming] = useState(
    "General (09:30 AM - 06:30 PM)",
  );
  const [jobDescription, setJobDescription] = useState("");

  const [payType, setPayType] = useState("Salaried");
  const [currency, setCurrency] = useState("INR (₹)");
  const [payrollFrequency, setPayrollFrequency] = useState("Monthly");
  const [annualCtc, setAnnualCtc] = useState("1800000");
  const [basicSalary, setBasicSalary] = useState("900000");
  const [variablePay, setVariablePay] = useState("200000");

  // STEP 3 FIELDS: Document Statuses
  const [docStatuses, setDocStatuses] = useState<{ [key: string]: boolean }>(
    {},
  );

  const toggleDocUpload = (docName: string) => {
    setDocStatuses((prev) => ({ ...prev, [docName]: !prev[docName] }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3 | 4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleSubmitFinal = () => {
    const fullName =
      `${firstName} ${middleName} ${lastName}`.replace(/\s+/g, " ").trim() ||
      "New Employee";
    const initials = fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

    const newEmp: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      empId: "EMP-2024-009",
      name: fullName,
      avatar: initials || "NE",
      email: email.trim() || `${firstName.toLowerCase() || "user"}@company.com`,
      phone: phone,
      department: department,
      designation: designation,
      role: "Member",
      branch: workLocation,
      joiningDate: dateOfJoining,
      status: "Active",
    };

    onAddEmployee(newEmp);
    setOpen(false);
    setCurrentStep(1);
  };

  // Reusable input styling for perfect theme consistency
  const inputStyle =
    "bg-background border border-border rounded-none text-xs text-foreground placeholder:text-muted-foreground focus-visible:ring-primary";
  const selectStyle =
    "w-full h-9 bg-background border border-border text-foreground text-xs font-semibold px-2 rounded-none outline-none focus:border-primary cursor-pointer";

  return (
    <>
      <Button
        onClick={() => {
          setOpen(true);
          setCurrentStep(1);
        }}
        className="bg-primary text-primary-foreground cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
      >
        <UserPlus className="h-4 w-4" /> Add Employee
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-card border-border max-h-[92vh] w-[95vw] overflow-y-auto rounded-none p-0 shadow-2xl sm:max-w-[1080px]">
          {/* HEADER SECTION MATCHING SCREENSHOTS */}
          <div className="border-border bg-card sticky top-0 z-20 flex items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <h2 className="text-foreground text-base font-bold tracking-tight">
                Employee Creation
              </h2>
              <Badge className="bg-primary/10 text-primary border-primary/30 rounded-none text-[10px] font-semibold">
                HR Module &bull; Step {currentStep} of 4
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border h-8 cursor-pointer gap-1.5 rounded-none text-xs font-semibold"
              >
                <Save className="h-3.5 w-3.5" /> Save as Draft
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer rounded-none"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* DYNAMIC CONNECTED HORIZONTAL LINE STEPPER HEADER MATCHING USER SCREENSHOT */}
          <div className="bg-card border-border border-b px-8 py-5 select-none">
            <div className="relative mx-auto max-w-2xl">
              {/* Background Connecting Line (Behind Icons) */}
              <div className="bg-border/80 absolute top-4 right-[12%] left-[12%] z-0 h-[2px]" />

              {/* Active Completed Line Fill (Behind Icons) */}
              <div
                className="absolute top-4 left-[12%] z-0 h-[2px] bg-emerald-500 transition-all duration-300"
                style={{
                  width:
                    currentStep === 1
                      ? "0%"
                      : currentStep === 2
                        ? "25%"
                        : currentStep === 3
                          ? "50%"
                          : "76%",
                }}
              />

              <div className="relative z-10 flex items-center justify-between">
                {[
                  { step: 1, label: "Basic & Address", icon: User },
                  { step: 2, label: "Job & Compensation", icon: Building2 },
                  { step: 3, label: "Document Uploads", icon: Upload },
                  { step: 4, label: "Review & Submit", icon: Send },
                ].map((item) => {
                  const IconComponent = item.icon;
                  const isCompleted = currentStep > item.step;
                  const isActive = currentStep === item.step;

                  return (
                    <div
                      key={item.step}
                      onClick={() => setCurrentStep(item.step as 1 | 2 | 3 | 4)}
                      className="group flex cursor-pointer flex-col items-center px-2"
                    >
                      {/* Step Icon / Checkmark Node */}
                      <div
                        className={cn(
                          "z-10 flex shrink-0 items-center justify-center transition-all duration-200",
                          isCompleted
                            ? "h-8 w-8 rounded-full bg-emerald-600 text-white shadow-2xs"
                            : isActive
                              ? "border-primary bg-card text-primary ring-card h-9 w-9 rounded-full border-2 font-bold shadow-md ring-4"
                              : "border-border bg-card text-muted-foreground group-hover:border-primary/50 group-hover:text-foreground h-8 w-8 rounded-full border",
                        )}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <IconComponent className="h-4 w-4" />
                        )}
                      </div>

                      {/* Step Title Label */}
                      <span
                        className={cn(
                          "mt-2 text-center text-xs font-medium transition-colors",
                          isCompleted
                            ? "font-bold text-emerald-600 dark:text-emerald-400"
                            : isActive
                              ? "text-primary scale-105 font-bold tracking-tight"
                              : "text-muted-foreground group-hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* FORM BODY BASED ON CURRENT STEP */}
          <div className="bg-card space-y-6 p-6">
            {/* ==================== STEP 1: BASIC & ADDRESS INFO ==================== */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Auto Generated IDs Box */}
                <div className="bg-background border-border/80 flex items-center justify-between rounded-none border p-4">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      SYSTEM USER ID (AUTO)
                    </span>
                    <span className="text-foreground mt-0.5 font-mono text-sm font-extrabold">
                      USR-2024-3132
                    </span>
                  </div>
                  <div className="bg-border h-8 w-[1px]" />
                  <div className="flex flex-col">
                    <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                      EMPLOYEE ID (GENERATED)
                    </span>
                    <span className="text-primary mt-0.5 font-mono text-sm font-extrabold">
                      EMP-2024-009
                    </span>
                  </div>
                </div>

                {/* Avatar Upload */}
                <div className="space-y-1.5">
                  <Label className="text-foreground text-xs font-semibold">
                    Profile Photo (Avatar Upload)
                  </Label>
                  <div className="border-border bg-background flex items-center justify-between gap-4 rounded-none border border-dashed p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-secondary border-border text-muted-foreground flex h-12 w-12 shrink-0 items-center justify-center rounded-full border">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-foreground text-xs font-bold">
                          Drag and drop profile photo or click to upload
                        </span>
                        <span className="text-muted-foreground text-[10px]">
                          Supports PNG, JPG, WEBP up to 5MB (Passport size
                          recommended)
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border cursor-pointer rounded-none text-xs font-semibold"
                    >
                      <Upload className="mr-1.5 h-3.5 w-3.5" /> Choose Image
                    </Button>
                  </div>
                </div>

                {/* 1. PERSONAL & IDENTITY DETAILS */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    1. PERSONAL & IDENTITY DETAILS
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        First Name <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. John"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Middle Name
                      </Label>
                      <Input
                        placeholder="e.g. William"
                        value={middleName}
                        onChange={(e) => setMiddleName(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Last Name <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Doe"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Email Address <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        type="email"
                        placeholder="john.doe@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Phone Number <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Date of Birth <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Gender <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Marital Status <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={maritalStatus}
                        onChange={(e) => setMaritalStatus(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Blood Group
                      </Label>
                      <select
                        value={bloodGroup}
                        onChange={(e) => setBloodGroup(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="O+">O+</option>
                        <option value="A+">A+</option>
                        <option value="B+">B+</option>
                        <option value="AB+">AB+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Nationality
                      </Label>
                      <Input
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        PAN Number <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={panNumber}
                        onChange={(e) => setPanNumber(e.target.value)}
                        className={cn(inputStyle, "font-mono uppercase")}
                      />
                      <span className="text-muted-foreground text-[10px]">
                        Format: 5 letters, 4 digits, 1 letter
                      </span>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Aadhaar Number <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={aadhaarNumber}
                        onChange={(e) => setAadhaarNumber(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                      <span className="text-muted-foreground text-[10px]">
                        12-digit UIDAI standard
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. RESIDENTIAL ADDRESS */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    2. RESIDENTIAL ADDRESS
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Address Line 1 <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Address Line 2
                      </Label>
                      <Input
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        City <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        State <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Country <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className={cn(inputStyle, "font-bold")}
                      />
                    </div>
                  </div>

                  <div className="w-1/3 pr-2">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Pin Code <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. EMERGENCY CONTACT */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    3. EMERGENCY CONTACT
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Contact Person Name{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={emergencyContactName}
                        onChange={(e) =>
                          setEmergencyContactName(e.target.value)
                        }
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Relationship <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={emergencyRelationship}
                        onChange={(e) =>
                          setEmergencyRelationship(e.target.value)
                        }
                        className={selectStyle}
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Parent">Parent</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Friend">Friend</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Emergency Phone <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={emergencyPhone}
                        onChange={(e) => setEmergencyPhone(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 2: JOB & COMPENSATION ==================== */}
            {currentStep === 2 && (
              <div className="space-y-6">
                {/* 1. ORGANIZATIONAL PLACEMENT & HIERARCHY */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    1. ORGANIZATIONAL PLACEMENT & HIERARCHY
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Department <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Human Resources">Human Resources</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Sub Department <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={subDepartment}
                        onChange={(e) => setSubDepartment(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Designation / Job Title{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={designation}
                        onChange={(e) => setDesignation(e.target.value)}
                        className={cn(inputStyle, "font-bold")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Team <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={team}
                        onChange={(e) => setTeam(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Role Description Title{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={roleTitle}
                        onChange={(e) => setRoleTitle(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Reports To (Manager ID / Name){" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={reportsTo}
                        onChange={(e) => setReportsTo(e.target.value)}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. EMPLOYMENT TERMS & SCHEDULING */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    2. EMPLOYMENT TERMS & SCHEDULING
                  </h3>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Employment Type <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={employmentType}
                        onChange={(e) => setEmploymentType(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Intern">Intern</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Job Type <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Work Location <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={workLocation}
                        onChange={(e) => setWorkLocation(e.target.value)}
                        className={inputStyle}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Date of Joining <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        type="date"
                        value={dateOfJoining}
                        onChange={(e) => setDateOfJoining(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Probation Period (Months){" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={probationPeriod}
                        onChange={(e) => setProbationPeriod(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="3 Months">3 Months</option>
                        <option value="6 Months">6 Months</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Probation End Date (Auto)
                      </Label>
                      <Input
                        value={probationEndDate}
                        readOnly
                        className="bg-secondary/60 border-border text-muted-foreground rounded-none font-mono text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Grade <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="G3 - Senior">G3 - Senior</option>
                        <option value="G2 - Mid">G2 - Mid</option>
                        <option value="G1 - Junior">G1 - Junior</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Band <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={band}
                        onChange={(e) => setBand(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="B1">B1</option>
                        <option value="B2">B2</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Notice Period (Days){" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={noticePeriod}
                        onChange={(e) => setNoticePeriod(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="30 Days">30 Days</option>
                        <option value="60 Days">60 Days</option>
                        <option value="90 Days">90 Days</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Shift Timing <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={shiftTiming}
                        onChange={(e) => setShiftTiming(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="General (09:30 AM - 06:30 PM)">
                          General (09:30 AM - 06:30 PM)
                        </option>
                        <option value="Night (09:00 PM - 06:00 AM)">
                          Night (09:00 PM - 06:00 AM)
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-foreground text-xs font-semibold">
                      Job Description & Role Summary
                    </Label>
                    <textarea
                      placeholder="Enter core responsibilities, key deliverables..."
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      className="bg-background border-border text-foreground focus:border-primary placeholder:text-muted-foreground min-h-[70px] w-full rounded-none border p-2 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* 3. COMPENSATION & PAYROLL STRUCTURE */}
                <div className="space-y-3">
                  <h3 className="text-foreground border-border/80 border-b pb-1.5 text-xs font-bold tracking-wider uppercase">
                    3. COMPENSATION & PAYROLL STRUCTURE
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Pay Type <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={payType}
                        onChange={(e) => setPayType(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Salaried">Salaried</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Currency <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="INR (₹)">INR (₹)</option>
                        <option value="USD ($)">USD ($)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Payroll Frequency{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <select
                        value={payrollFrequency}
                        onChange={(e) => setPayrollFrequency(e.target.value)}
                        className={selectStyle}
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Bi-weekly">Bi-weekly</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Annual Total CTC{" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={annualCtc}
                        onChange={(e) => setAnnualCtc(e.target.value)}
                        className={cn(inputStyle, "font-mono font-bold")}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Basic Salary (Annual){" "}
                        <span className="text-rose-500">*</span>
                      </Label>
                      <Input
                        value={basicSalary}
                        onChange={(e) => setBasicSalary(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-foreground text-xs font-semibold">
                        Variable Pay / Performance Bonus
                      </Label>
                      <Input
                        value={variablePay}
                        onChange={(e) => setVariablePay(e.target.value)}
                        className={cn(inputStyle, "font-mono")}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================== STEP 3: DOCUMENT UPLOADS ==================== */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-foreground text-sm font-bold">
                    Document Upload & Compliance Center
                  </h3>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    Attach certified copies for employee identity verification
                    and compliance auditing.
                  </p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { name: "Aadhaar Card", mandatory: true },
                    { name: "PAN Card", mandatory: true },
                    { name: "Educational Certificates", mandatory: true },
                    { name: "Experience Certificate", mandatory: false },
                    { name: "Bank Details/Cancelled Cheque", mandatory: true },
                    { name: "Passport Size Photo", mandatory: true },
                    { name: "Offer Letter", mandatory: true },
                    { name: "Other Documents", mandatory: false },
                  ].map((doc) => {
                    const isUploaded = Boolean(docStatuses[doc.name]);
                    return (
                      <div
                        key={doc.name}
                        className="border-border bg-background flex items-center justify-between gap-4 rounded-none border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-secondary border-border text-muted-foreground flex h-9 w-9 shrink-0 items-center justify-center rounded-full border">
                            <Upload className="h-4 w-4" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground text-xs font-bold">
                                {doc.name}
                              </span>
                              {doc.mandatory ? (
                                <Badge className="rounded-none border-rose-500/30 bg-rose-500/10 text-[9px] text-rose-500">
                                  Mandatory
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  className="text-muted-foreground rounded-none text-[9px]"
                                >
                                  Optional
                                </Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground text-[10px]">
                              {isUploaded
                                ? "Uploaded document attached"
                                : "No document attached yet"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {isUploaded ? (
                            <Badge className="gap-1 rounded-none border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-500">
                              <CheckCircle2 className="h-3 w-3" /> Attached
                            </Badge>
                          ) : (
                            <Badge className="gap-1 rounded-none border-amber-500/30 bg-amber-500/10 text-[10px] text-amber-500">
                              <Clock className="h-3 w-3" /> Pending
                            </Badge>
                          )}

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => toggleDocUpload(doc.name)}
                            className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border h-7 cursor-pointer rounded-none text-xs"
                          >
                            {isUploaded ? "Change File" : "Choose File"}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ==================== STEP 4: REVIEW & SUBMIT ==================== */}
            {currentStep === 4 && (
              <div className="space-y-6">
                {/* Primary Theme Banner Header */}
                <div className="bg-primary/10 border-primary/30 flex items-center justify-between gap-4 rounded-none border p-4">
                  <div className="flex flex-col">
                    <span className="text-primary text-xs font-bold">
                      Verification Summary & Submission to Admin
                    </span>
                    <span className="text-muted-foreground mt-0.5 text-[11px]">
                      Please review all 40+ configured parameters before
                      submitting. Once submitted, this profile will be queued
                      for Admin RBAC role activation.
                    </span>
                  </div>
                  <Button
                    onClick={handleSubmitFinal}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 cursor-pointer gap-1.5 rounded-none text-xs font-bold"
                  >
                    <Send className="h-3.5 w-3.5" /> Submit to Admin
                  </Button>
                </div>

                {/* 4 Summary Grid Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Card 1: Personal Details */}
                  <Card className="bg-background border-border space-y-2 rounded-none p-4">
                    <h4 className="text-foreground border-border border-b pb-1 text-xs font-bold">
                      1. Personal & Emergency Details
                    </h4>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Full Name:
                        </span>
                        <span className="text-foreground font-bold">
                          {firstName} {middleName} {lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Employee ID:
                        </span>
                        <span className="text-primary font-mono font-bold">
                          EMP-2024-009
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Work Email:
                        </span>
                        <span className="text-foreground">
                          {email || "john.doe@company.com"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone:</span>
                        <span className="text-foreground font-mono">
                          {phone}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          DOB & Gender:
                        </span>
                        <span className="text-foreground">
                          {dob} ({gender})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          PAN & Aadhaar:
                        </span>
                        <span className="text-foreground font-mono">
                          {panNumber} / {aadhaarNumber}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Card 2: Job Placement */}
                  <Card className="bg-background border-border space-y-2 rounded-none p-4">
                    <h4 className="text-foreground border-border border-b pb-1 text-xs font-bold">
                      2. Job Placement & Organization
                    </h4>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Department:
                        </span>
                        <span className="text-foreground font-bold">
                          {department} ({subDepartment})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Designation & Role:
                        </span>
                        <span className="text-foreground font-bold">
                          {designation}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Employment Type:
                        </span>
                        <span className="text-foreground">
                          {employmentType} ({jobType})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Joining Date:
                        </span>
                        <span className="text-foreground font-mono">
                          {dateOfJoining}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Probation Period:
                        </span>
                        <span className="text-foreground">
                          {probationPeriod} (Ends: {probationEndDate})
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Card 3: Compensation */}
                  <Card className="bg-background border-border space-y-2 rounded-none p-4">
                    <h4 className="text-foreground border-border border-b pb-1 text-xs font-bold">
                      3. Compensation & Payroll
                    </h4>
                    <div className="space-y-1 text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Pay Type & Frequency:
                        </span>
                        <span className="text-foreground">
                          {payType} ({payrollFrequency})
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Annual Total CTC:
                        </span>
                        <span className="font-mono text-xs font-extrabold text-emerald-500">
                          ₹
                          {Number(annualCtc || 1800000).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Basic Salary:
                        </span>
                        <span className="text-foreground font-mono">
                          ₹
                          {Number(basicSalary || 900000).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Variable Pay:
                        </span>
                        <span className="text-foreground font-mono">
                          ₹
                          {Number(variablePay || 200000).toLocaleString(
                            "en-IN",
                          )}
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* Card 4: Uploaded Files */}
                  <Card className="bg-background border-border space-y-2 rounded-none p-4">
                    <h4 className="text-foreground border-border border-b pb-1 text-xs font-bold">
                      4. Uploaded Compliance Files (
                      {Object.values(docStatuses).filter(Boolean).length}/8)
                    </h4>
                    <div className="grid grid-cols-2 gap-1.5 pt-1 text-[10px]">
                      {[
                        "Aadhaar Card",
                        "PAN Card",
                        "Educational Certificates",
                        "Experience Certificate",
                        "Bank Details",
                        "Passport Size Photo",
                        "Offer Letter",
                        "Other Documents",
                      ].map((d) => (
                        <div
                          key={d}
                          className="bg-card border-border flex items-center justify-between border p-1.5"
                        >
                          <span className="truncate">{d}</span>
                          {docStatuses[d] ? (
                            <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                          ) : (
                            <Clock className="h-3 w-3 shrink-0 text-amber-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER STEP NAVIGATION BUTTONS */}
          <div className="border-border bg-card sticky bottom-0 z-20 flex items-center justify-between border-t p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 1}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/80 border-border cursor-pointer gap-1.5 rounded-none text-xs font-semibold disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" /> Previous Step
            </Button>

            {currentStep < 4 ? (
              <Button
                type="button"
                onClick={handleNextStep}
                className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer gap-1.5 rounded-none text-xs font-semibold"
              >
                <span>Next Step</span> <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="button"
                onClick={handleSubmitFinal}
                className="cursor-pointer gap-1.5 rounded-none bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <Send className="h-4 w-4" /> Submit to Admin
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
