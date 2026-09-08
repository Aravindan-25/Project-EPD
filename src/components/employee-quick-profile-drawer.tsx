"use client";

import React from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Building2,
  Clock,
  ShieldCheck,
  Mail,
  Calendar,
  ArrowRight,
  X,
} from "lucide-react";

export interface QuickProfileEmployeeData {
  id?: string;
  name: string;
  empCode: string;
  status: string;
  department: string;
  role: string;
  email?: string;
  phone?: string;
  joiningDate?: string;
  initials?: string;
  rating?: string;
  score?: string;
  gender?: string;
  prodEligible?: boolean;
  qcEligible?: boolean;
}

interface EmployeeQuickProfileDrawerProps {
  employee: QuickProfileEmployeeData | null;
  isOpen: boolean;
  onClose: () => void;
  onViewFullProfile: (emp: QuickProfileEmployeeData) => void;
}

export function EmployeeQuickProfileDrawer({
  employee,
  isOpen,
  onClose,
  onViewFullProfile,
}: EmployeeQuickProfileDrawerProps) {
  if (!employee) return null;

  const initials =
    employee.initials ||
    employee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const email =
    employee.email ||
    `${employee.name.toLowerCase().replace(/\s+/g, ".")}@epd-erp.io`;
  const joiningDate = employee.joiningDate || "January 10, 2024";
  const rating = employee.rating || "EXCELLENT";
  const score = employee.score || "96.5";

  const isDataProcessing =
    !employee.department || employee.department === "Data Processing";

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="bg-background text-foreground border-border flex w-full flex-col justify-between overflow-hidden border-l p-0 shadow-2xl sm:max-w-xl"
      >
        {/* HEADER SECTION: 1. EMPLOYEE NAME + EMPLOYEE ID + ACTIVE BADGE */}
        <div className="border-border/60 bg-card relative border-b p-6 pb-4">
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground absolute top-5 right-5 cursor-pointer rounded-md p-1 transition-colors"
            title="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-4">
            <div className="relative">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border text-lg font-bold">
                {initials}
              </div>
              <span className="border-card absolute right-0 bottom-0 h-3.5 w-3.5 rounded-full border-2 bg-emerald-500" />
            </div>

            <div className="space-y-1">
              <h2 className="text-foreground text-lg leading-snug font-bold">
                {employee.name}
              </h2>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-mono">
                  {employee.empCode}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BODY SCROLL CONTENT */}
        <div className="bg-background flex-1 space-y-6 overflow-y-auto p-6">
          {/* 2. EMAIL + JOINING DATE (Removed for Data Processing) */}
          {!isDataProcessing && (
            <div className="space-y-2">
              <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                CONTACT & JOINING
              </span>
              <Card className="bg-card border-border/80 grid grid-cols-2 gap-4 rounded-xl border p-3.5">
                <div>
                  <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                    <Mail className="h-3.5 w-3.5" />
                    <span>Email</span>
                  </div>
                  <span
                    className="text-primary block truncate text-xs font-semibold"
                    title={email}
                  >
                    {email}
                  </span>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1 flex items-center gap-1.5 text-xs">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Joining Date</span>
                  </div>
                  <span className="text-foreground block font-mono text-xs font-bold">
                    {joiningDate}
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* 3. DEPARTMENT + ROLE */}
          <div className="space-y-2">
            <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
              DEPARTMENT & ROLE
            </span>
            <Card className="bg-secondary/40 border-border/80 flex w-full flex-row items-center justify-between gap-4 rounded-xl border p-3.5">
              <div className="flex shrink-0 items-center gap-2.5">
                <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-lg">
                  <Building2 className="h-4 w-4" />
                </div>
                <span className="text-foreground text-xs font-bold">
                  {employee.department || "Data Processing"}
                </span>
              </div>
              <span className="text-muted-foreground truncate text-right text-xs font-medium">
                {employee.role || "Senior Processing Specialist"}
              </span>
            </Card>
          </div>

          {/* 4. WORK CAPABILITIES */}
          <div className="space-y-2">
            <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
              WORK CAPABILITIES
            </span>
            <div className="space-y-2">
              <Card className="bg-card border-border flex w-full flex-row items-center justify-between gap-4 rounded-xl border p-3.5">
                <div className="flex shrink-0 items-center gap-2.5">
                  <Clock className="text-primary h-4 w-4 shrink-0" />
                  <span className="text-foreground text-xs font-bold">
                    Production Capable
                  </span>
                </div>
                <span className="bg-primary/10 text-primary border-primary/20 shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                  Eligible
                </span>
              </Card>

              <Card className="bg-card border-border flex w-full flex-row items-center justify-between gap-4 rounded-xl border p-3.5">
                <div className="flex shrink-0 items-center gap-2.5">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span className="text-foreground text-xs font-bold">
                    Quality Control (QC) Capable
                  </span>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  Eligible
                </span>
              </Card>
            </div>
          </div>

          {/* EMAIL & JOINING DATE */}
          <div className="border-border/60 space-y-3 border-t pt-3">
            <div className="hover:bg-secondary/30 flex items-center justify-between rounded-lg px-1.5 py-1 text-xs transition-all">
              <div className="text-muted-foreground flex items-center gap-2">
                <Mail className="text-muted-foreground/80 h-4 w-4" />
                <span className="font-medium">Email</span>
              </div>
              <span className="cursor-pointer font-semibold text-sky-600 hover:underline dark:text-sky-400">
                {email}
              </span>
            </div>

            <div className="hover:bg-secondary/30 flex items-center justify-between rounded-lg px-1.5 py-1 text-xs transition-all">
              <div className="text-muted-foreground flex items-center gap-2">
                <Calendar className="text-muted-foreground/80 h-4 w-4" />
                <span className="font-medium">Joining Date</span>
              </div>
              <span className="text-foreground font-mono font-bold">
                {joiningDate}
              </span>
            </div>
          </div>

          {/* PERFORMANCE SNAPSHOT */}
          <Card className="from-card via-card to-secondary/20 border-border space-y-3 rounded-2xl border bg-gradient-to-br p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground/80 text-[10px] font-extrabold tracking-wider uppercase">
                PERFORMANCE SNAPSHOT
              </span>
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600 shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                {rating}
              </span>
            </div>

            <div className="flex items-baseline justify-between pt-1">
              <div>
                <span className="text-foreground text-3xl font-black tracking-tight">
                  {score}
                </span>
                <span className="text-muted-foreground ml-1 font-mono text-xs font-semibold">
                  / 100
                </span>
              </div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Rating: {rating}
              </span>
            </div>
          </Card>
        </div>

        {/* VIEW FULL PROFILE BUTTON - NATIVE SKY BLUE */}
        <div className="border-border bg-card border-t p-4">
          <Button
            onClick={() => onViewFullProfile(employee)}
            className="group flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-sky-500 text-xs font-bold text-white shadow-md transition-all hover:bg-sky-600 hover:shadow-lg"
          >
            <span>View Full Profile</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
