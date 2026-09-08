"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { QuickProfileEmployeeData } from "@/components/employee-quick-profile-drawer";
import {
  ArrowLeft,
  User,
  Building2,
  ShieldCheck,
  CheckCircle2,
  FileText,
  TrendingUp,
  Award,
  Calendar,
  Briefcase,
  Zap,
  ChevronLeft,
  ChevronRight,
  Clock,
  Filter,
} from "lucide-react";

interface EmployeeFullProfileViewProps {
  employee: QuickProfileEmployeeData;
  onBack: () => void;
}

const MONTHS_LIST = [
  { label: "May 2025", prodVal: 480000, qcVal: 310000, isBest: false },
  { label: "Jun 2025", prodVal: 560000, qcVal: 360000, isBest: false },
  { label: "Jul 2025", prodVal: 832310, qcVal: 532680, isBest: true },
  { label: "Aug 2025", prodVal: 680000, qcVal: 440000, isBest: false },
  { label: "Sep 2025", prodVal: 610000, qcVal: 390000, isBest: false },
  { label: "Oct 2025", prodVal: 650000, qcVal: 410000, isBest: false },
  { label: "Nov 2025", prodVal: 720000, qcVal: 460000, isBest: false },
  { label: "Dec 2025", prodVal: 540000, qcVal: 350000, isBest: false },
  { label: "Jan 2026", prodVal: 670000, qcVal: 430000, isBest: false },
  { label: "Feb 2026", prodVal: 630000, qcVal: 400000, isBest: false },
  { label: "Mar 2026", prodVal: 740000, qcVal: 470000, isBest: false },
  { label: "Apr 2026", prodVal: 700000, qcVal: 450000, isBest: false },
  { label: "May 2026", prodVal: 730000, qcVal: 460000, isBest: false },
  { label: "Jun 2026", prodVal: 760000, qcVal: 480000, isBest: false },
  { label: "Jul 2026", prodVal: 790000, qcVal: 500000, isBest: false },
  { label: "Aug 2026", prodVal: 730000, qcVal: 470000, isBest: false },
  { label: "Sep 2026", prodVal: 640000, qcVal: 410000, isBest: false },
];

export function EmployeeFullProfileView({
  employee,
  onBack,
}: EmployeeFullProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "performance">(
    "overview",
  );
  const [activePerfSubTab, setActivePerfSubTab] = useState<"prod" | "qc">(
    "prod",
  );
  const todayDateNum = new Date().getDate();
  const [selectedCalDate, setSelectedCalDate] = useState<number>(todayDateNum);

  // Date Range Picker State for Production Performance
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date>(new Date(2026, 7, 26)); // 26 Aug 2026
  const [endDate, setEndDate] = useState<Date>(new Date(2026, 8, 2)); // 2 Sep 2026

  const [tempStart, setTempStart] = useState<Date>(new Date(2026, 7, 26));
  const [tempEnd, setTempEnd] = useState<Date>(new Date(2026, 8, 2));
  const [activeQuickOption, setActiveQuickOption] = useState<string>("1 Week");

  // Date Range Picker State for QC Performance
  const [isQcDatePickerOpen, setIsQcDatePickerOpen] = useState<boolean>(false);
  const [qcStartDate, setQcStartDate] = useState<Date>(new Date(2026, 7, 26)); // 26 Aug 2026
  const [qcEndDate, setQcEndDate] = useState<Date>(new Date(2026, 8, 2)); // 2 Sep 2026

  const [qcTempStart, setQcTempStart] = useState<Date>(new Date(2026, 7, 26));
  const [qcTempEnd, setQcTempEnd] = useState<Date>(new Date(2026, 8, 2));
  const [activeQcQuickOption, setActiveQcQuickOption] =
    useState<string>("1 Week");

  // Project Filter State for Performance Tab
  const [selectedProjectFilter, setSelectedProjectFilter] =
    useState<string>("all");

  // Daily Calendar Active States
  const CAL_MONTHS = ["September 2026", "August 2026", "July 2026"];
  const [prodCalMonthIdx, setProdCalMonthIdx] = useState<number>(0);
  const [qcCalMonthIdx, setQcCalMonthIdx] = useState<number>(0);
  const [selectedQcCalDate, setSelectedQcCalDate] =
    useState<number>(todayDateNum);

  // Project Filter Data Multiplier
  const getProjectMultiplier = () => {
    if (selectedProjectFilter === "prj-dp") return 0.65;
    if (selectedProjectFilter === "prj-mi") return 0.25;
    if (selectedProjectFilter === "prj-ocr") return 0.1;
    return 1.0;
  };

  const projMult = getProjectMultiplier();

  // Interactive Monthly Performance Graph Tooltip States
  const [hoveredProdMonthIdx, setHoveredProdMonthIdx] = useState<number | null>(
    2,
  );
  const [hoveredQcMonthIdx, setHoveredQcMonthIdx] = useState<number | null>(2);

  const formatRecordNumber = (num: number) => {
    return num.toLocaleString("en-IN");
  };

  // Graph plotting calculations for 17 months
  const graphPoints = MONTHS_LIST.map((m, i) => {
    const x = 3 + (i / 16) * 94; // percentage from 3% to 97%
    const prodRatio = m.prodVal / 832310;
    const prodY = (1 - prodRatio) * 45 + 15;

    const qcRatio = m.qcVal / 532680;
    const qcY = (1 - qcRatio) * 45 + 15;

    return { x, prodY, qcY };
  });

  const prodBezierPath = graphPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.prodY}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.prodY} ${cx},${pt.prodY} ${pt.x},${pt.prodY}`;
  }, "");

  const qcBezierPath = graphPoints.reduce((acc, pt, i, arr) => {
    if (i === 0) return `M ${pt.x},${pt.qcY}`;
    const prev = arr[i - 1];
    const cx = (prev.x + pt.x) / 2;
    return `${acc} C ${cx},${prev.qcY} ${cx},${pt.qcY} ${pt.x},${pt.qcY}`;
  }, "");

  const formatDateDisplay = (d: Date) => {
    const day = d.getDate();
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const formatDateUpperDisplay = (d: Date) => {
    const day = d.getDate();
    const month = d
      .toLocaleDateString("en-US", { month: "short" })
      .toUpperCase();
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const calculateProductionStats = (sDate: Date, eDate: Date) => {
    const s = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const e = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    const diffMs = Math.abs(e.getTime() - s.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    // Exact reference check for 26 Aug 2026 -> 2 Sep 2026
    if (
      s.getDate() === 26 &&
      s.getMonth() === 7 &&
      e.getDate() === 2 &&
      e.getMonth() === 8
    ) {
      return {
        totalDays: 8,
        activeDays: 6,
        dailyAvg: 480,
        totalRecords: 2882,
      };
    }

    let activeDays = 0;
    const cur = new Date(s);
    while (cur <= e) {
      if (cur.getDay() !== 0) {
        activeDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (activeDays === 0) activeDays = 1;

    const dailyAvg = 480;
    const totalRecords = Math.round(activeDays * dailyAvg);
    return {
      totalDays,
      activeDays,
      dailyAvg,
      totalRecords,
    };
  };

  const calculateQcStats = (sDate: Date, eDate: Date) => {
    const s = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate());
    const e = new Date(eDate.getFullYear(), eDate.getMonth(), eDate.getDate());
    const diffMs = Math.abs(e.getTime() - s.getTime());
    const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;

    // Exact reference check for 26 Aug 2026 -> 2 Sep 2026
    if (
      s.getDate() === 26 &&
      s.getMonth() === 7 &&
      e.getDate() === 2 &&
      e.getMonth() === 8
    ) {
      return {
        totalDays: 8,
        activeDays: 6,
        dailyAvg: 296,
        totalRecords: 1774,
      };
    }

    let activeDays = 0;
    const cur = new Date(s);
    while (cur <= e) {
      if (cur.getDay() !== 0) {
        activeDays++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    if (activeDays === 0) activeDays = 1;

    const dailyAvg = 296;
    const totalRecords = Math.round(activeDays * dailyAvg);
    return {
      totalDays,
      activeDays,
      dailyAvg,
      totalRecords,
    };
  };

  const prodStats = calculateProductionStats(startDate, endDate);
  const tempStats = calculateProductionStats(tempStart, tempEnd);

  const qcStats = calculateQcStats(qcStartDate, qcEndDate);
  const qcTempStats = calculateQcStats(qcTempStart, qcTempEnd);

  const augDays = Array.from(
    { length: 31 },
    (_, i) => new Date(2026, 7, i + 1),
  );
  const sepDays = Array.from(
    { length: 30 },
    (_, i) => new Date(2026, 8, i + 1),
  );

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const isBetween = (d: Date, sDate: Date, eDate: Date) => {
    const t = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
    const s = new Date(
      sDate.getFullYear(),
      sDate.getMonth(),
      sDate.getDate(),
    ).getTime();
    const e = new Date(
      eDate.getFullYear(),
      eDate.getMonth(),
      eDate.getDate(),
    ).getTime();
    return t > s && t < e;
  };

  const handleQuickOptionSelect = (option: string) => {
    setActiveQuickOption(option);
    const end = new Date(2026, 8, 2); // 2 Sep 2026 reference anchor
    let start = new Date(2026, 7, 26); // 26 Aug 2026

    if (option === "1 Week") {
      start = new Date(2026, 7, 26);
    } else if (option === "3 Weeks") {
      start = new Date(2026, 7, 12);
    } else if (option === "1 Month") {
      start = new Date(2026, 7, 2);
    } else if (option === "3 Months") {
      start = new Date(2026, 5, 2);
    } else if (option === "6 Months") {
      start = new Date(2026, 2, 2);
    }

    setTempStart(start);
    setTempEnd(end);
  };

  const handleDayClick = (dayDate: Date) => {
    if (tempStart && tempEnd && tempStart.getTime() !== tempEnd.getTime()) {
      setTempStart(dayDate);
      setTempEnd(dayDate);
    } else if (tempStart && dayDate < tempStart) {
      setTempStart(dayDate);
      setTempEnd(dayDate);
    } else if (tempStart) {
      setTempEnd(dayDate);
    } else {
      setTempStart(dayDate);
      setTempEnd(dayDate);
    }
    setActiveQuickOption("");
  };

  const handleDone = () => {
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setIsDatePickerOpen(false);
  };

  const handleCancel = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setIsDatePickerOpen(false);
  };

  const handleQcQuickOptionSelect = (option: string) => {
    setActiveQcQuickOption(option);
    const end = new Date(2026, 8, 2); // 2 Sep 2026 reference anchor
    let start = new Date(2026, 7, 26); // 26 Aug 2026

    if (option === "1 Week") {
      start = new Date(2026, 7, 26);
    } else if (option === "3 Weeks") {
      start = new Date(2026, 7, 12);
    } else if (option === "1 Month") {
      start = new Date(2026, 7, 2);
    } else if (option === "3 Months") {
      start = new Date(2026, 5, 2);
    } else if (option === "6 Months") {
      start = new Date(2026, 2, 2);
    }

    setQcTempStart(start);
    setQcTempEnd(end);
  };

  const handleQcDayClick = (dayDate: Date) => {
    if (
      qcTempStart &&
      qcTempEnd &&
      qcTempStart.getTime() !== qcTempEnd.getTime()
    ) {
      setQcTempStart(dayDate);
      setQcTempEnd(dayDate);
    } else if (qcTempStart && dayDate < qcTempStart) {
      setQcTempStart(dayDate);
      setQcTempEnd(dayDate);
    } else if (qcTempStart) {
      setQcTempEnd(dayDate);
    } else {
      setQcTempStart(dayDate);
      setQcTempEnd(dayDate);
    }
    setActiveQcQuickOption("");
  };

  const handleQcDone = () => {
    setQcStartDate(qcTempStart);
    setQcEndDate(qcTempEnd);
    setIsQcDatePickerOpen(false);
  };

  const handleQcCancel = () => {
    setQcTempStart(qcStartDate);
    setQcTempEnd(qcEndDate);
    setIsQcDatePickerOpen(false);
  };

  const initials =
    employee.initials ||
    employee.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const firstName = employee.name.split(" ")[0] || "Mathan";
  const lastName = employee.name.split(" ").slice(1).join(" ") || "Kumar";
  const email =
    employee.email ||
    `${employee.name.toLowerCase().replace(/\s+/g, ".")}@epd-erp.io`;
  const phone = employee.phone || "+91 98450 12345";
  const gender = employee.gender || "Male";
  const joiningDate = employee.joiningDate || "January 10, 2024";

  // Production Hourly breakdown data for Sep 1
  const prodHourlySlots = [
    { slot: "09:00 AM - 10:00 AM", records: 50 },
    { slot: "10:00 AM - 11:00 AM", records: 59 },
    { slot: "11:00 AM - 12:00 PM", records: 55 },
    { slot: "12:00 PM - 01:00 PM", records: 37 },
    { slot: "01:00 PM - 02:00 PM", records: 55 },
    { slot: "02:00 PM - 03:00 PM", records: 64 },
    { slot: "03:00 PM - 04:00 PM", records: 50 },
    { slot: "04:00 PM - 05:00 PM", records: 27 },
    { slot: "05:00 PM - 06:00 PM", records: 20 },
  ];

  // QC Hourly breakdown data for Sep 1
  const qcHourlySlots = [
    { slot: "09:00 AM - 10:00 AM", records: 31 },
    { slot: "10:00 AM - 11:00 AM", records: 36 },
    { slot: "11:00 AM - 12:00 PM", records: 33 },
    { slot: "12:00 PM - 01:00 PM", records: 22 },
    { slot: "01:00 PM - 02:00 PM", records: 33 },
    { slot: "02:00 PM - 03:00 PM", records: 39 },
    { slot: "03:00 PM - 04:00 PM", records: 31 },
    { slot: "04:00 PM - 05:00 PM", records: 32 },
    { slot: "05:00 PM - 06:00 PM", records: 22 },
  ];

  // Dynamic Month details generator for Real Calendars (September 2026, August 2026, July 2026)
  const getCalendarMonthDetails = (monthIdx: number) => {
    const monthMap = [
      { year: 2026, month: 8 }, // September 2026 (30 days, starts Tuesday - offset 2)
      { year: 2026, month: 7 }, // August 2026 (31 days, starts Saturday - offset 6)
      { year: 2026, month: 6 }, // July 2026 (31 days, starts Wednesday - offset 3)
    ];
    const { year, month } = monthMap[monthIdx] || { year: 2026, month: 8 };
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    return { year, month, startOffset, daysInMonth, daysArray };
  };

  const prodMonthInfo = getCalendarMonthDetails(prodCalMonthIdx);
  const qcMonthInfo = getCalendarMonthDetails(qcCalMonthIdx);

  return (
    <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
      {/* TOP BACK BUTTON */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-primary inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Project Team</span>
        </button>
      </div>

      {/* HEADER CARD */}
      <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="bg-primary/10 text-primary border-primary/20 flex h-16 w-16 shrink-0 items-center justify-center rounded-full border text-xl font-bold shadow-xs">
                {initials}
              </div>
              <span className="border-card absolute right-0.5 bottom-0.5 h-3.5 w-3.5 rounded-full border-2 bg-emerald-500" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
                  {employee.name}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Active
                </span>
              </div>

              <p className="text-muted-foreground font-mono text-xs">
                {employee.empCode} &bull;{" "}
                {employee.department || "Data Processing"} &bull;{" "}
                {employee.role || "Senior Processing Specialist"}
              </p>
            </div>
          </div>

          <div className="self-start sm:self-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
              <span className="text-muted-foreground text-[10px] font-medium uppercase">
                RATING
              </span>
              <span>EXCELLENT</span>
            </span>
          </div>
        </div>

        {/* TOP LEVEL NAVIGATION TABS */}
        <div className="border-border flex items-center gap-6 border-b pt-2 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={cn(
              "cursor-pointer border-b-2 pb-3 transition-all",
              activeTab === "overview"
                ? "border-primary text-primary font-bold"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            Overview
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("performance")}
            className={cn(
              "cursor-pointer border-b-2 pb-3 transition-all",
              activeTab === "performance"
                ? "border-primary text-primary font-bold"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            Performance
          </button>
        </div>
      </Card>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* TOP 2 CARDS GRID */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CARD 1: PERSONAL INFORMATION */}
            <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
              <div className="border-border/60 flex items-center gap-2 border-b pb-3">
                <User className="text-primary h-4 w-4" />
                <h3 className="text-foreground text-sm font-bold">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    First Name
                  </span>
                  <span className="text-foreground mt-0.5 block font-bold">
                    {firstName}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Last Name
                  </span>
                  <span className="text-foreground mt-0.5 block font-bold">
                    {lastName}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Email Address
                  </span>
                  <span className="text-primary mt-0.5 block truncate font-medium">
                    {email}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Phone Number
                  </span>
                  <span className="text-foreground mt-0.5 block font-mono font-medium">
                    {phone}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Gender
                  </span>
                  <span className="text-foreground mt-0.5 block font-medium">
                    {gender}
                  </span>
                </div>
              </div>
            </Card>

            {/* CARD 2: EMPLOYMENT INFORMATION */}
            <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
              <div className="border-border/60 flex items-center gap-2 border-b pb-3">
                <Building2 className="text-primary h-4 w-4" />
                <h3 className="text-foreground text-sm font-bold">
                  Employment Information
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Employee Code
                  </span>
                  <span className="text-foreground mt-0.5 block font-mono font-bold">
                    {employee.empCode}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Department
                  </span>
                  <span className="text-foreground mt-0.5 block font-bold">
                    {employee.department || "Data Processing"}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Joining Date
                  </span>
                  <span className="text-foreground mt-0.5 block font-mono font-medium">
                    {joiningDate}
                  </span>
                </div>

                <div>
                  <span className="text-muted-foreground block text-[11px]">
                    Employment Status
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                    Active Full-time
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* BOTTOM FULL-WIDTH CARD: WORK CAPABILITIES & ELIGIBILITY */}
          <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
            <div className="border-border/60 flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-primary h-4 w-4" />
                <h3 className="text-foreground text-sm font-bold">
                  Work Capabilities & Eligibility
                </h3>
              </div>
              <span className="text-muted-foreground text-[11px]">
                Read-only operational profile
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card className="bg-secondary/30 border-border space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-bold">
                    Production Work Stream
                  </span>
                  <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    Eligible
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                  <span>
                    ✓ Eligible for Production Work (Annotation, Conversion,
                    Tagging)
                  </span>
                </div>
              </Card>

              <Card className="bg-secondary/30 border-border space-y-3 rounded-xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-foreground text-xs font-bold">
                    Quality Control (QC) Stream
                  </span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                    Eligible
                  </span>
                </div>
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                  <span>
                    ✓ Eligible for Quality Control Work (Audit, Sampling,
                    Verification)
                  </span>
                </div>
              </Card>
            </div>
          </Card>

          {/* TWO CARDS: EMPLOYEE COMPLETED PROJECTS & CURRENT WORKING PROJECTS */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* CARD 1: EMPLOYEE COMPLETED PROJECTS */}
            <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <h3 className="text-foreground text-sm font-bold">
                    Employee Completed Projects
                  </h3>
                </div>
                <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                  3 Completed
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Healthcare Records OCR Pipeline",
                    code: "PRJ-2024-08",
                    role: "Senior Processing Specialist",
                    period: "Jan 2025 - Jun 2025",
                    records: "34,20,000 rec",
                    status: "Completed",
                  },
                  {
                    name: "Legal Document Digitization",
                    code: "PRJ-2024-03",
                    role: "QC Specialist",
                    period: "Sep 2024 - Dec 2024",
                    records: "18,50,000 rec",
                    status: "Completed",
                  },
                  {
                    name: "Financial Invoice Extraction",
                    code: "PRJ-2023-11",
                    role: "Data Processing Specialist",
                    period: "Jan 2024 - Aug 2024",
                    records: "42,10,000 rec",
                    status: "Completed",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary/30 border-border/60 flex items-center justify-between gap-3 rounded-xl border p-3 text-xs"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground block truncate font-bold">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-muted-foreground block text-[11px]">
                        {item.role} &bull; {item.period}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-foreground block font-mono font-bold">
                        {item.records}
                      </span>
                      <span className="inline-block text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* CARD 2: CURRENT WORKING PROJECTS */}
            <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-primary h-4 w-4" />
                  <h3 className="text-foreground text-sm font-bold">
                    Current Working Projects
                  </h3>
                </div>
                <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border text-[10px] font-bold">
                  2 Active
                </Badge>
              </div>

              <div className="space-y-3">
                {[
                  {
                    name: "Data Processing Project",
                    code: "PRJ-DP-2026",
                    role: "Senior Processing Specialist",
                    allocated: "Allocated: Jan 10, 2026",
                    progress: "84% Complete",
                    status: "Active",
                  },
                  {
                    name: "Medical Imaging Dataset Processing",
                    code: "PRJ-MI-2026",
                    role: "QC Specialist & Reviewer",
                    allocated: "Allocated: Mar 15, 2026",
                    progress: "62% Complete",
                    status: "Active",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary/30 border-border/60 flex items-center justify-between gap-3 rounded-xl border p-3 text-xs"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground block truncate font-bold">
                          {item.name}
                        </span>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {item.code}
                        </span>
                      </div>
                      <span className="text-muted-foreground block text-[11px]">
                        {item.role} &bull; {item.allocated}
                      </span>
                    </div>
                    <div className="shrink-0 text-right">
                      <span className="text-primary block font-mono font-bold">
                        {item.progress}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: PERFORMANCE */}
      {activeTab === "performance" && (
        <div className="space-y-6">
          {/* PROJECT FILTER SECTION */}
          <Card className="bg-card border-border flex flex-col justify-between gap-4 rounded-2xl border p-4 shadow-xs sm:flex-row sm:items-center">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Filter className="text-primary h-4 w-4" />
                <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Project Filter
                </h3>
              </div>
              <p className="text-muted-foreground text-xs">
                Filter employee productivity and performance analytics by
                assigned project.
              </p>
            </div>

            <div className="flex w-full items-center gap-2 sm:w-auto">
              <div className="relative w-full sm:w-80">
                <select
                  value={selectedProjectFilter}
                  onChange={(e) => setSelectedProjectFilter(e.target.value)}
                  className="bg-background border-border text-foreground focus:ring-primary/40 h-10 w-full cursor-pointer appearance-none rounded-xl border px-3.5 pr-8 text-xs font-semibold shadow-xs focus:ring-2 focus:outline-none"
                >
                  <option value="all">All Assigned Projects (Combined)</option>
                  <option value="prj-dp">
                    Data Processing Project (PRJ-DP-2026)
                  </option>
                  <option value="prj-mi">
                    Medical Imaging Dataset Processing (PRJ-MI-2026)
                  </option>
                  <option value="prj-ocr">
                    Healthcare Records OCR Pipeline (PRJ-2024-08)
                  </option>
                </select>
                <ChevronRight className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 rotate-90" />
              </div>
            </div>
          </Card>

          {/* SUB-TABS NAVIGATION BAR */}
          <div className="border-border/60 flex items-center gap-6 border-b pb-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActivePerfSubTab("prod")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 transition-all",
                activePerfSubTab === "prod"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Briefcase className="h-4 w-4" />
              <span>Production Performance</span>
            </button>

            <button
              type="button"
              onClick={() => setActivePerfSubTab("qc")}
              className={cn(
                "flex cursor-pointer items-center gap-2 border-b-2 pb-2 transition-all",
                activePerfSubTab === "qc"
                  ? "border-primary text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>QC Performance</span>
            </button>
          </div>

          {/* PERFORMANCE SUB-TAB 1: PRODUCTION PERFORMANCE */}
          {activePerfSubTab === "prod" && (
            <div className="space-y-6">
              {/* 4 SUMMARY CARDS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      TOTAL RECORDS
                    </span>
                    <FileText className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-foreground font-mono text-2xl font-extrabold tracking-tight">
                    {formatRecordNumber(Math.round(12730790 * projMult))}
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Production completed records
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      MONTHLY AVG RECORDS
                    </span>
                    <TrendingUp className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-foreground font-mono text-2xl font-extrabold tracking-tight">
                    {formatRecordNumber(Math.round(748870 * projMult))}
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Average per active month
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      BEST MONTH
                    </span>
                    <Award className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-foreground text-2xl font-extrabold tracking-tight">
                    Jul 2025
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatRecordNumber(Math.round(832310 * projMult))} records
                    peak
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      MONTHS ACTIVE
                    </span>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                  </div>
                  <div className="text-foreground text-2xl font-extrabold tracking-tight">
                    17{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      Months
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Consistent activity logged
                  </p>
                </Card>
              </div>

              {/* SELECT DATE & RANGE SUMMARY */}
              <div className="space-y-4">
                <div className="relative max-w-xs space-y-1.5">
                  <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                    SELECT DATE
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setTempStart(startDate);
                        setTempEnd(endDate);
                        setIsDatePickerOpen(!isDatePickerOpen);
                      }}
                      className="bg-background border-primary text-foreground hover:bg-secondary/40 flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>
                        {formatDateDisplay(startDate)} &mdash;{" "}
                        {formatDateDisplay(endDate)}
                      </span>
                      <Calendar className="text-primary h-4 w-4" />
                    </button>

                    {/* DATE RANGE PICKER POPOVER */}
                    {isDatePickerOpen && (
                      <Card className="bg-card border-border absolute top-full left-0 z-50 mt-2 w-[340px] max-w-[90vw] space-y-4 rounded-2xl border p-5 shadow-xl sm:w-[600px]">
                        {/* TWO MONTHS CALENDAR GRID */}
                        <div className="border-border/60 grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2">
                          {/* MONTH 1: AUGUST 2026 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <ChevronLeft className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                              <span>August 2026</span>
                              <span className="w-4" />
                            </div>

                            <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase">
                              <span>Mo</span>
                              <span>Tu</span>
                              <span>We</span>
                              <span>Th</span>
                              <span>Fr</span>
                              <span>Sa</span>
                              <span>Su</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={`aug-empty-${i}`}
                                  className="h-8 w-8"
                                />
                              ))}

                              {augDays.map((d) => {
                                const isStart = isSameDay(d, tempStart);
                                const isEnd = isSameDay(d, tempEnd);
                                const inRange = isBetween(
                                  d,
                                  tempStart,
                                  tempEnd,
                                );

                                return (
                                  <button
                                    key={d.toISOString()}
                                    type="button"
                                    onClick={() => handleDayClick(d)}
                                    className={cn(
                                      "mx-auto flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-medium transition-all",
                                      isStart || isEnd
                                        ? "bg-primary text-primary-foreground rounded-full font-bold shadow-xs"
                                        : inRange
                                          ? "bg-primary/20 text-foreground w-full rounded-none font-semibold"
                                          : "hover:bg-secondary text-foreground rounded-full",
                                    )}
                                  >
                                    {d.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* MONTH 2: SEPTEMBER 2026 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="w-4" />
                              <span>September 2026</span>
                              <ChevronRight className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                            </div>

                            <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase">
                              <span>Mo</span>
                              <span>Tu</span>
                              <span>We</span>
                              <span>Th</span>
                              <span>Fr</span>
                              <span>Sa</span>
                              <span>Su</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                              {Array.from({ length: 1 }).map((_, i) => (
                                <div
                                  key={`sep-empty-${i}`}
                                  className="h-8 w-8"
                                />
                              ))}

                              {sepDays.map((d) => {
                                const isStart = isSameDay(d, tempStart);
                                const isEnd = isSameDay(d, tempEnd);
                                const inRange = isBetween(
                                  d,
                                  tempStart,
                                  tempEnd,
                                );

                                return (
                                  <button
                                    key={d.toISOString()}
                                    type="button"
                                    onClick={() => handleDayClick(d)}
                                    className={cn(
                                      "mx-auto flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-medium transition-all",
                                      isStart || isEnd
                                        ? "bg-primary text-primary-foreground rounded-full font-bold shadow-xs"
                                        : inRange
                                          ? "bg-primary/20 text-foreground w-full rounded-none font-semibold"
                                          : "hover:bg-secondary text-foreground rounded-full",
                                    )}
                                  >
                                    {d.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* QUICK OPTIONS ROW */}
                        <div className="space-y-2">
                          <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                            QUICK OPTIONS
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {[
                              "1 Week",
                              "3 Weeks",
                              "1 Month",
                              "3 Months",
                              "6 Months",
                            ].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleQuickOptionSelect(opt)}
                                className={cn(
                                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                                  activeQuickOption === opt
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary/60 hover:bg-secondary text-foreground border-border",
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* FOOTER ACTION ROW */}
                        <div className="border-border/60 flex items-center justify-between border-t pt-2">
                          <span className="text-foreground text-xs font-bold">
                            {tempStats.totalDays} days
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleCancel}
                              className="h-8 cursor-pointer rounded-xl px-4 text-xs font-semibold"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleDone}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-xl px-5 text-xs font-semibold shadow-xs"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>

                {/* RANGE OUTPUT SUMMARY */}
                <Card className="bg-secondary/30 border-border flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <span className="text-primary block text-[11px] font-bold tracking-wider uppercase">
                      RANGE OUTPUT SUMMARY ({formatDateUpperDisplay(startDate)}{" "}
                      &mdash; {formatDateUpperDisplay(endDate)})
                    </span>
                    <p className="text-muted-foreground text-xs">
                      Total Active Work Days:{" "}
                      <strong className="text-foreground">
                        {prodStats.activeDays} days
                      </strong>{" "}
                      &bull; Daily Average:{" "}
                      <strong className="text-foreground">
                        {formatRecordNumber(
                          Math.round(prodStats.dailyAvg * projMult),
                        )}{" "}
                        rec/day
                      </strong>
                    </p>
                  </div>

                  <Card className="bg-card border-border flex items-center gap-2 self-start rounded-xl border p-3 px-5 sm:self-auto">
                    <span className="text-foreground font-mono text-lg font-extrabold">
                      {formatRecordNumber(
                        Math.round(prodStats.totalRecords * projMult),
                      )}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      Production Records
                    </span>
                  </Card>
                </Card>
              </div>

              {/* TIMESTAMP BADGE */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  Performance Updated At:
                </span>
                <span className="bg-secondary/60 text-foreground rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium">
                  6 Sep 2026 12:10pm
                </span>
              </div>

              {/* MONTHLY PRODUCTION PERFORMANCE GRAPH CARD */}
              <Card className="bg-card border-border space-y-6 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground text-sm font-bold">
                        Monthly Production Performance Graph
                      </h3>
                      <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border text-[10px] font-bold">
                        Production
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Total Production Records Completed per Month across
                      operational history.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary h-3 w-3 rounded-full"></span>
                      <span className="text-muted-foreground">
                        Production Records (Bars)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary h-0.5 w-4"></span>
                      <span className="text-muted-foreground">Trend Line</span>
                    </div>
                  </div>
                </div>

                {/* SVG BAR CHART & TREND LINE */}
                <div className="no-scrollbar w-full overflow-x-auto pt-8 pb-2">
                  <div className="relative flex h-64 min-w-[750px] flex-col justify-between">
                    {/* INTERACTIVE FLOATING TOOLTIP FOR PRODUCTION GRAPH */}
                    {hoveredProdMonthIdx !== null && (
                      <div
                        className="pointer-events-none absolute z-30 transition-all duration-200"
                        style={{
                          left: `${graphPoints[hoveredProdMonthIdx].x}%`,
                          top: `${graphPoints[hoveredProdMonthIdx].prodY}%`,
                          transform: "translate(-50%, -125%)",
                        }}
                      >
                        <div className="relative flex min-w-[115px] flex-col items-center rounded-xl border border-slate-700/60 bg-[#0f172a] px-3.5 py-1.5 text-white shadow-xl">
                          <span className="text-[10px] font-medium text-slate-300">
                            {MONTHS_LIST[hoveredProdMonthIdx].label}
                          </span>
                          <span className="mt-0.5 font-mono text-xs font-bold tracking-tight text-white">
                            {formatRecordNumber(
                              Math.round(
                                MONTHS_LIST[hoveredProdMonthIdx].prodVal *
                                  projMult,
                              ),
                            )}{" "}
                            records
                          </span>
                          {/* Downward Pointer Arrow */}
                          <div className="absolute top-full left-1/2 -mt-px h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#0f172a]" />
                        </div>
                      </div>
                    )}

                    {/* SVG BARS & BEZIER LINE */}
                    <div className="relative flex flex-1 items-end justify-between px-4">
                      {/* TREND LINE OVERLAY SVG */}
                      <svg
                        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={prodBezierPath}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      {/* DATA POINT CIRCLES (UNDISTORTED HTML DIVS) */}
                      <div className="pointer-events-none absolute inset-0 z-15 h-full w-full">
                        {graphPoints.map((pt, idx) => {
                          const isHovered = hoveredProdMonthIdx === idx;
                          const isBest = MONTHS_LIST[idx].isBest;

                          return (
                            <div
                              key={idx}
                              style={{
                                left: `${pt.x}%`,
                                top: `${pt.prodY}%`,
                              }}
                              className={cn(
                                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-150",
                                isBest
                                  ? "border-amber-600 bg-amber-500 shadow-xs"
                                  : "bg-background border-primary",
                                isHovered
                                  ? "ring-primary/20 z-20 h-3.5 w-3.5 ring-4"
                                  : "h-2.5 w-2.5",
                              )}
                            />
                          );
                        })}
                      </div>

                      {/* BARS */}
                      {MONTHS_LIST.map((m, idx) => {
                        const heightPct = Math.round(
                          (m.prodVal / 832310) * 100,
                        );
                        const isHovered = hoveredProdMonthIdx === idx;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredProdMonthIdx(idx)}
                            onClick={() => setHoveredProdMonthIdx(idx)}
                            className="group z-20 flex cursor-pointer flex-col items-center gap-2"
                            style={{ width: "4.5%" }}
                          >
                            <div className="flex h-44 w-full items-end justify-center">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={cn(
                                  "w-full rounded-t-md transition-all duration-150",
                                  m.isBest
                                    ? "bg-amber-500 shadow-sm"
                                    : "bg-primary",
                                  isHovered
                                    ? "ring-primary/40 scale-x-105 ring-2 brightness-110"
                                    : "opacity-90 hover:opacity-100",
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "mt-2 rotate-90 font-mono text-[10px] font-medium whitespace-nowrap transition-colors sm:rotate-0",
                                m.isBest
                                  ? "font-bold text-amber-600 dark:text-amber-400"
                                  : isHovered
                                    ? "text-primary font-bold"
                                    : "text-muted-foreground",
                              )}
                            >
                              {m.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* BOTTOM 2 COLUMNS: DAILY CALENDAR & HOURLY BREAKDOWN */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* COLUMN 1: DAILY PRODUCTION CALENDAR */}
                <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
                  <div className="border-border/60 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-primary h-4 w-4" />
                      <h3 className="text-foreground text-sm font-bold">
                        Daily Production Calendar
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setProdCalMonthIdx((prev) =>
                            prev > 0 ? prev - 1 : CAL_MONTHS.length - 1,
                          )
                        }
                        className="border-border text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-foreground min-w-[110px] text-center font-mono text-xs font-bold">
                        {CAL_MONTHS[prodCalMonthIdx]}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setProdCalMonthIdx((prev) =>
                            prev < CAL_MONTHS.length - 1 ? prev + 1 : 0,
                          )
                        }
                        className="border-border text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CALENDAR GRID */}
                  <div className="space-y-2">
                    <div className="text-muted-foreground grid grid-cols-7 py-1 text-center text-[10px] font-bold tracking-wider uppercase">
                      <span>SUN</span>
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-xs">
                      {/* Empty offsets */}
                      {Array.from({ length: prodMonthInfo.startOffset }).map(
                        (_, i) => (
                          <div
                            key={`prod-offset-${i}`}
                            className="bg-secondary/10 h-14 rounded-lg"
                          />
                        ),
                      )}

                      {prodMonthInfo.daysArray.map((day) => {
                        const isSelected = selectedCalDate === day;
                        const isToday =
                          prodCalMonthIdx === 0 && day === todayDateNum;
                        const isFuture =
                          prodCalMonthIdx === 0 && day > todayDateNum;
                        const dayRecCount = isFuture
                          ? 0
                          : Math.round(
                              (day % 7 === 0 ? 0 : 380 + ((day * 13) % 150)) *
                                projMult,
                            );
                        const hasData = dayRecCount > 0;

                        return (
                          <div
                            key={day}
                            onClick={() => setSelectedCalDate(day)}
                            className={cn(
                              "relative flex h-14 cursor-pointer flex-col justify-between rounded-xl border p-1.5 transition-all",
                              isSelected
                                ? "border-2 border-amber-500 bg-amber-500/15 text-amber-950 shadow-xs ring-2 ring-amber-400/40 dark:bg-amber-950/60 dark:text-amber-100"
                                : isToday
                                  ? "border-2 border-amber-400/90 bg-amber-50/90 text-amber-950 shadow-xs dark:bg-amber-950/40 dark:text-amber-200"
                                  : "bg-card border-border/60 hover:border-border",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{day}</span>
                              {isToday && (
                                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-extrabold text-amber-950 shadow-xs">
                                  TODAY
                                </span>
                              )}
                              {hasData && !isToday && (
                                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                              )}
                              {hasData && isToday && (
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              )}
                            </div>

                            <div className="text-right">
                              <span className="text-foreground block font-mono text-[10px] font-bold">
                                {formatRecordNumber(dayRecCount)}
                              </span>
                              <span className="text-muted-foreground block text-[8px]">
                                rec
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* COLUMN 2: PRODUCTION HOURLY BREAKDOWN */}
                <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
                  <div className="border-border/60 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary h-4 w-4" />
                      <h3 className="text-foreground text-sm font-bold">
                        Production Hourly Breakdown
                      </h3>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border font-mono text-[10px] font-bold">
                      {selectedCalDate} {CAL_MONTHS[prodCalMonthIdx]}
                    </Badge>
                  </div>

                  {/* SUMMARY BOX */}
                  <Card className="bg-secondary/30 border-border flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                        <Zap className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground truncate text-xs font-bold tracking-wider uppercase">
                        DAY TOTAL PRODUCTION (9:00 AM - 6:00 PM)
                      </span>
                    </div>
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-foreground font-mono text-xl font-extrabold">
                        {formatRecordNumber(
                          prodCalMonthIdx === 0 &&
                            selectedCalDate > todayDateNum
                            ? 0
                            : Math.round(
                                (selectedCalDate % 7 === 0
                                  ? 0
                                  : 380 + ((selectedCalDate * 13) % 150)) *
                                  projMult,
                              ),
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs font-semibold">
                        Records
                      </span>
                    </div>
                  </Card>

                  {/* HOURLY SLOTS LIST */}
                  <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                    <div className="text-muted-foreground flex justify-between pb-1 text-[10px] font-bold tracking-wider uppercase">
                      <span>WORKING HOUR SLOT</span>
                      <span>PRODUCTION RECORDS</span>
                    </div>

                    {prodHourlySlots.map((slot, idx) => {
                      const isFutureSelected =
                        prodCalMonthIdx === 0 && selectedCalDate > todayDateNum;
                      const dayFactor =
                        selectedCalDate % 7 === 0 || isFutureSelected
                          ? 0
                          : (380 + ((selectedCalDate * 13) % 150)) / 457;
                      const count = isFutureSelected
                        ? 0
                        : Math.round(slot.records * dayFactor * projMult);
                      const pct = isFutureSelected
                        ? 0
                        : Math.min(
                            100,
                            Math.round((count / (64 * projMult || 1)) * 100),
                          );
                      return (
                        <div key={idx} className="space-y-1 py-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-mono">
                              {slot.slot}
                            </span>
                            <span className="text-foreground font-mono font-bold">
                              {formatRecordNumber(count)} records
                            </span>
                          </div>
                          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-muted-foreground border-border/40 border-t pt-1 text-center text-[10px]">
                    Showing hourly distribution within standard 9:00 AM to 6:00
                    PM shift.
                  </p>
                </Card>
              </div>
            </div>
          )}

          {/* PERFORMANCE SUB-TAB 2: QC PERFORMANCE */}
          {activePerfSubTab === "qc" && (
            <div className="space-y-6">
              {/* 4 SUMMARY CARDS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      TOTAL QC CHECKED
                    </span>
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-foreground font-mono text-2xl font-extrabold tracking-tight">
                    {formatRecordNumber(Math.round(8147690 * projMult))}
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    QC verified volume
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      MONTHLY AVG QC CHECKED
                    </span>
                    <TrendingUp className="text-primary h-4 w-4" />
                  </div>
                  <div className="text-foreground font-mono text-2xl font-extrabold tracking-tight">
                    {formatRecordNumber(Math.round(479276 * projMult))}
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Average QC per active month
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      BEST MONTH
                    </span>
                    <Award className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-foreground text-2xl font-extrabold tracking-tight">
                    Jul 2025
                  </div>
                  <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatRecordNumber(Math.round(532680 * projMult))} QC
                    records peak
                  </p>
                </Card>

                <Card className="bg-card border-border space-y-2 rounded-2xl p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                      MONTHS ACTIVE
                    </span>
                    <Calendar className="text-muted-foreground h-4 w-4" />
                  </div>
                  <div className="text-foreground text-2xl font-extrabold tracking-tight">
                    17{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      Months
                    </span>
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    Consistent activity logged
                  </p>
                </Card>
              </div>

              {/* SELECT DATE & RANGE SUMMARY */}
              <div className="space-y-4">
                <div className="relative max-w-xs space-y-1.5">
                  <span className="text-muted-foreground block text-[11px] font-bold tracking-wider uppercase">
                    SELECT DATE
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setQcTempStart(qcStartDate);
                        setQcTempEnd(qcEndDate);
                        setIsQcDatePickerOpen(!isQcDatePickerOpen);
                      }}
                      className="bg-background border-primary text-foreground hover:bg-secondary/40 flex h-10 w-full cursor-pointer items-center justify-between rounded-xl border px-3.5 text-xs font-semibold shadow-xs transition-colors"
                    >
                      <span>
                        {formatDateDisplay(qcStartDate)} &mdash;{" "}
                        {formatDateDisplay(qcEndDate)}
                      </span>
                      <Calendar className="text-primary h-4 w-4" />
                    </button>

                    {/* QC DATE RANGE PICKER POPOVER */}
                    {isQcDatePickerOpen && (
                      <Card className="bg-card border-border absolute top-full left-0 z-50 mt-2 w-[340px] max-w-[90vw] space-y-4 rounded-2xl border p-5 shadow-xl sm:w-[600px]">
                        {/* TWO MONTHS CALENDAR GRID */}
                        <div className="border-border/60 grid grid-cols-1 gap-6 border-b pb-4 sm:grid-cols-2">
                          {/* MONTH 1: AUGUST 2026 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <ChevronLeft className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                              <span>August 2026</span>
                              <span className="w-4" />
                            </div>

                            <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase">
                              <span>Mo</span>
                              <span>Tu</span>
                              <span>We</span>
                              <span>Th</span>
                              <span>Fr</span>
                              <span>Sa</span>
                              <span>Su</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                              {/* Offset for Saturday start (5 empty cells) */}
                              {Array.from({ length: 5 }).map((_, i) => (
                                <div
                                  key={`qc-aug-empty-${i}`}
                                  className="h-8 w-8"
                                />
                              ))}

                              {augDays.map((d) => {
                                const isStart = isSameDay(d, qcTempStart);
                                const isEnd = isSameDay(d, qcTempEnd);
                                const inRange = isBetween(
                                  d,
                                  qcTempStart,
                                  qcTempEnd,
                                );

                                return (
                                  <button
                                    key={d.toISOString()}
                                    type="button"
                                    onClick={() => handleQcDayClick(d)}
                                    className={cn(
                                      "mx-auto flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-medium transition-all",
                                      isStart || isEnd
                                        ? "bg-primary text-primary-foreground rounded-full font-bold shadow-xs"
                                        : inRange
                                          ? "bg-primary/20 text-foreground w-full rounded-none font-semibold"
                                          : "hover:bg-secondary text-foreground rounded-full",
                                    )}
                                  >
                                    {d.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* MONTH 2: SEPTEMBER 2026 */}
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="w-4" />
                              <span>September 2026</span>
                              <ChevronRight className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
                            </div>

                            <div className="text-muted-foreground grid grid-cols-7 gap-1 text-center text-[10px] font-bold uppercase">
                              <span>Mo</span>
                              <span>Tu</span>
                              <span>We</span>
                              <span>Th</span>
                              <span>Fr</span>
                              <span>Sa</span>
                              <span>Su</span>
                            </div>

                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                              {/* Offset for Tuesday start (1 empty cell) */}
                              {Array.from({ length: 1 }).map((_, i) => (
                                <div
                                  key={`qc-sep-empty-${i}`}
                                  className="h-8 w-8"
                                />
                              ))}

                              {sepDays.map((d) => {
                                const isStart = isSameDay(d, qcTempStart);
                                const isEnd = isSameDay(d, qcTempEnd);
                                const inRange = isBetween(
                                  d,
                                  qcTempStart,
                                  qcTempEnd,
                                );

                                return (
                                  <button
                                    key={d.toISOString()}
                                    type="button"
                                    onClick={() => handleQcDayClick(d)}
                                    className={cn(
                                      "mx-auto flex h-8 w-8 cursor-pointer items-center justify-center text-xs font-medium transition-all",
                                      isStart || isEnd
                                        ? "bg-primary text-primary-foreground rounded-full font-bold shadow-xs"
                                        : inRange
                                          ? "bg-primary/20 text-foreground w-full rounded-none font-semibold"
                                          : "hover:bg-secondary text-foreground rounded-full",
                                    )}
                                  >
                                    {d.getDate()}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* QUICK OPTIONS ROW */}
                        <div className="space-y-2">
                          <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                            QUICK OPTIONS
                          </span>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            {[
                              "1 Week",
                              "3 Weeks",
                              "1 Month",
                              "3 Months",
                              "6 Months",
                            ].map((opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => handleQcQuickOptionSelect(opt)}
                                className={cn(
                                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                                  activeQcQuickOption === opt
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-secondary/60 hover:bg-secondary text-foreground border-border",
                                )}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* FOOTER ACTION ROW */}
                        <div className="border-border/60 flex items-center justify-between border-t pt-2">
                          <span className="text-foreground text-xs font-bold">
                            {qcTempStats.totalDays} days
                          </span>

                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleQcCancel}
                              className="h-8 cursor-pointer rounded-xl px-4 text-xs font-semibold"
                            >
                              Cancel
                            </Button>
                            <Button
                              type="button"
                              onClick={handleQcDone}
                              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-xl px-5 text-xs font-semibold shadow-xs"
                            >
                              Done
                            </Button>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>
                </div>

                {/* RANGE OUTPUT SUMMARY */}
                <Card className="bg-secondary/30 border-border flex flex-col justify-between gap-4 rounded-2xl border p-4 sm:flex-row sm:items-center">
                  <div className="space-y-1">
                    <span className="text-primary block text-[11px] font-bold tracking-wider uppercase">
                      RANGE OUTPUT SUMMARY (
                      {formatDateUpperDisplay(qcStartDate)} &mdash;{" "}
                      {formatDateUpperDisplay(qcEndDate)})
                    </span>
                    <p className="text-muted-foreground text-xs">
                      Total Active Work Days:{" "}
                      <strong className="text-foreground">
                        {qcStats.activeDays} days
                      </strong>{" "}
                      &bull; Daily Average:{" "}
                      <strong className="text-foreground">
                        {formatRecordNumber(
                          Math.round(qcStats.dailyAvg * projMult),
                        )}{" "}
                        rec/day
                      </strong>
                    </p>
                  </div>

                  <Card className="bg-card border-border flex items-center gap-2 self-start rounded-xl border p-3 px-5 sm:self-auto">
                    <span className="text-foreground font-mono text-lg font-extrabold">
                      {formatRecordNumber(
                        Math.round(qcStats.totalRecords * projMult),
                      )}
                    </span>
                    <span className="text-muted-foreground text-xs font-medium">
                      QC Records
                    </span>
                  </Card>
                </Card>
              </div>

              {/* TIMESTAMP BADGE */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  Performance Updated At:
                </span>
                <span className="bg-secondary/60 text-foreground rounded-full px-2.5 py-0.5 font-mono text-[11px] font-medium">
                  6 Sep 2026 12:10pm
                </span>
              </div>

              {/* MONTHLY QC PERFORMANCE GRAPH CARD */}
              <Card className="bg-card border-border space-y-6 rounded-2xl p-6 shadow-xs">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-foreground text-sm font-bold">
                        Monthly QC Performance Graph
                      </h3>
                      <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        QC Verified
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      Total QC Checked Records Completed per Month across
                      operational history.
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold">
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary h-3 w-3 rounded-full"></span>
                      <span className="text-muted-foreground">
                        QC Checked (Bars)
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="bg-primary h-0.5 w-4"></span>
                      <span className="text-muted-foreground">
                        QC Trend Line
                      </span>
                    </div>
                  </div>
                </div>

                {/* SVG BAR CHART & TREND LINE */}
                <div className="no-scrollbar w-full overflow-x-auto pt-8 pb-2">
                  <div className="relative flex h-64 min-w-[750px] flex-col justify-between">
                    {/* INTERACTIVE FLOATING TOOLTIP FOR QC GRAPH */}
                    {hoveredQcMonthIdx !== null && (
                      <div
                        className="pointer-events-none absolute z-30 transition-all duration-200"
                        style={{
                          left: `${graphPoints[hoveredQcMonthIdx].x}%`,
                          top: `${graphPoints[hoveredQcMonthIdx].qcY}%`,
                          transform: "translate(-50%, -125%)",
                        }}
                      >
                        <div className="relative flex min-w-[125px] flex-col items-center rounded-xl border border-slate-700/60 bg-[#0f172a] px-3.5 py-1.5 text-white shadow-xl">
                          <span className="text-[10px] font-medium text-slate-300">
                            {MONTHS_LIST[hoveredQcMonthIdx].label}
                          </span>
                          <span className="mt-0.5 font-mono text-xs font-bold tracking-tight text-white">
                            {formatRecordNumber(
                              Math.round(
                                MONTHS_LIST[hoveredQcMonthIdx].qcVal * projMult,
                              ),
                            )}{" "}
                            QC records
                          </span>
                          {/* Downward Pointer Arrow */}
                          <div className="absolute top-full left-1/2 -mt-px h-0 w-0 -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-[#0f172a]" />
                        </div>
                      </div>
                    )}

                    {/* SVG BARS & BEZIER LINE */}
                    <div className="relative flex flex-1 items-end justify-between px-4">
                      {/* TREND LINE OVERLAY SVG */}
                      <svg
                        className="pointer-events-none absolute inset-0 z-10 h-full w-full"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                      >
                        <path
                          d={qcBezierPath}
                          fill="none"
                          stroke="hsl(var(--primary))"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          vectorEffect="non-scaling-stroke"
                        />
                      </svg>

                      {/* DATA POINT CIRCLES (UNDISTORTED HTML DIVS) */}
                      <div className="pointer-events-none absolute inset-0 z-15 h-full w-full">
                        {graphPoints.map((pt, idx) => {
                          const isHovered = hoveredQcMonthIdx === idx;
                          const isBest = MONTHS_LIST[idx].isBest;

                          return (
                            <div
                              key={idx}
                              style={{
                                left: `${pt.x}%`,
                                top: `${pt.qcY}%`,
                              }}
                              className={cn(
                                "absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-all duration-150",
                                isBest
                                  ? "border-amber-600 bg-amber-500 shadow-xs"
                                  : "bg-background border-primary",
                                isHovered
                                  ? "ring-primary/20 z-20 h-3.5 w-3.5 ring-4"
                                  : "h-2.5 w-2.5",
                              )}
                            />
                          );
                        })}
                      </div>

                      {/* BARS */}
                      {MONTHS_LIST.map((m, idx) => {
                        const heightPct = Math.round((m.qcVal / 532680) * 100);
                        const isHovered = hoveredQcMonthIdx === idx;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredQcMonthIdx(idx)}
                            onClick={() => setHoveredQcMonthIdx(idx)}
                            className="group z-20 flex cursor-pointer flex-col items-center gap-2"
                            style={{ width: "4.5%" }}
                          >
                            <div className="flex h-44 w-full items-end justify-center">
                              <div
                                style={{ height: `${heightPct}%` }}
                                className={cn(
                                  "w-full rounded-t-md transition-all duration-150",
                                  m.isBest
                                    ? "bg-amber-500 shadow-sm"
                                    : "bg-primary",
                                  isHovered
                                    ? "ring-primary/40 scale-x-105 ring-2 brightness-110"
                                    : "opacity-90 hover:opacity-100",
                                )}
                              />
                            </div>
                            <span
                              className={cn(
                                "mt-2 rotate-90 font-mono text-[10px] font-medium whitespace-nowrap transition-colors sm:rotate-0",
                                m.isBest
                                  ? "font-bold text-amber-600 dark:text-amber-400"
                                  : isHovered
                                    ? "text-primary font-bold"
                                    : "text-muted-foreground",
                              )}
                            >
                              {m.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>

              {/* BOTTOM 2 COLUMNS: DAILY CALENDAR & HOURLY BREAKDOWN */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* COLUMN 1: DAILY QC PERFORMANCE CALENDAR */}
                <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
                  <div className="border-border/60 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="text-primary h-4 w-4" />
                      <h3 className="text-foreground text-sm font-bold">
                        Daily QC Performance Calendar
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setQcCalMonthIdx((prev) =>
                            prev > 0 ? prev - 1 : CAL_MONTHS.length - 1,
                          )
                        }
                        className="border-border text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border"
                      >
                        <ChevronLeft className="h-3.5 w-3.5" />
                      </button>
                      <span className="text-foreground min-w-[110px] text-center font-mono text-xs font-bold">
                        {CAL_MONTHS[qcCalMonthIdx]}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setQcCalMonthIdx((prev) =>
                            prev < CAL_MONTHS.length - 1 ? prev + 1 : 0,
                          )
                        }
                        className="border-border text-muted-foreground hover:text-foreground flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border"
                      >
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* CALENDAR GRID */}
                  <div className="space-y-2">
                    <div className="text-muted-foreground grid grid-cols-7 py-1 text-center text-[10px] font-bold tracking-wider uppercase">
                      <span>SUN</span>
                      <span>MON</span>
                      <span>TUE</span>
                      <span>WED</span>
                      <span>THU</span>
                      <span>FRI</span>
                      <span>SAT</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1.5 text-xs">
                      {/* Empty offsets */}
                      {Array.from({ length: qcMonthInfo.startOffset }).map(
                        (_, i) => (
                          <div
                            key={`qc-offset-${i}`}
                            className="bg-secondary/10 h-14 rounded-lg"
                          />
                        ),
                      )}

                      {qcMonthInfo.daysArray.map((day) => {
                        const isSelected = selectedQcCalDate === day;
                        const isToday =
                          qcCalMonthIdx === 0 && day === todayDateNum;
                        const isFuture =
                          qcCalMonthIdx === 0 && day > todayDateNum;
                        const dayQcCount = isFuture
                          ? 0
                          : Math.round(
                              (day % 7 === 0 ? 0 : 230 + ((day * 9) % 110)) *
                                projMult,
                            );
                        const hasData = dayQcCount > 0;

                        return (
                          <div
                            key={day}
                            onClick={() => setSelectedQcCalDate(day)}
                            className={cn(
                              "relative flex h-14 cursor-pointer flex-col justify-between rounded-xl border p-1.5 transition-all",
                              isSelected
                                ? "border-2 border-amber-500 bg-amber-500/15 text-amber-950 shadow-xs ring-2 ring-amber-400/40 dark:bg-amber-950/60 dark:text-amber-100"
                                : isToday
                                  ? "border-2 border-amber-400/90 bg-amber-50/90 text-amber-950 shadow-xs dark:bg-amber-950/40 dark:text-amber-200"
                                  : "bg-card border-border/60 hover:border-border",
                            )}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold">{day}</span>
                              {isToday && (
                                <span className="rounded bg-amber-400 px-1.5 py-0.5 text-[8px] font-extrabold text-amber-950 shadow-xs">
                                  TODAY
                                </span>
                              )}
                              {hasData && !isToday && (
                                <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                              )}
                              {hasData && isToday && (
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                              )}
                            </div>

                            <div className="text-right">
                              <span className="text-foreground block font-mono text-[10px] font-bold">
                                {formatRecordNumber(dayQcCount)}
                              </span>
                              <span className="text-muted-foreground block text-[8px]">
                                rec
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </Card>

                {/* COLUMN 2: DAILY QC PRODUCTIVITY BREAKDOWN */}
                <Card className="bg-card border-border space-y-4 rounded-2xl p-6 shadow-xs">
                  <div className="border-border/60 flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="text-primary h-4 w-4" />
                      <h3 className="text-foreground text-sm font-bold">
                        Daily QC Productivity Breakdown
                      </h3>
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full border font-mono text-[10px] font-bold">
                      {selectedQcCalDate} {CAL_MONTHS[qcCalMonthIdx]}
                    </Badge>
                  </div>

                  {/* SUMMARY BOX */}
                  <Card className="bg-secondary/30 border-border flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="bg-primary/10 text-primary flex h-7 w-7 shrink-0 items-center justify-center rounded-full">
                        <Zap className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-muted-foreground truncate text-xs font-bold tracking-wider uppercase">
                        DAY TOTAL QC OUTPUT (9:00 AM - 6:00 PM)
                      </span>
                    </div>
                    <div className="flex shrink-0 items-baseline gap-1.5">
                      <span className="text-foreground font-mono text-xl font-extrabold">
                        {formatRecordNumber(
                          qcCalMonthIdx === 0 &&
                            selectedQcCalDate > todayDateNum
                            ? 0
                            : Math.round(
                                (selectedQcCalDate % 7 === 0
                                  ? 0
                                  : 230 + ((selectedQcCalDate * 9) % 110)) *
                                  projMult,
                              ),
                        )}
                      </span>
                      <span className="text-muted-foreground text-xs font-semibold">
                        QC Records
                      </span>
                    </div>
                  </Card>

                  {/* HOURLY SLOTS LIST */}
                  <div className="max-h-[300px] space-y-2 overflow-y-auto pr-1">
                    <div className="text-muted-foreground flex justify-between pb-1 text-[10px] font-bold tracking-wider uppercase">
                      <span>WORKING HOUR SLOT</span>
                      <span>PRODUCTION RECORDS</span>
                    </div>

                    {qcHourlySlots.map((slot, idx) => {
                      const isFutureSelected =
                        qcCalMonthIdx === 0 && selectedQcCalDate > todayDateNum;
                      const dayFactor =
                        selectedQcCalDate % 7 === 0 || isFutureSelected
                          ? 0
                          : (230 + ((selectedQcCalDate * 9) % 110)) / 279;
                      const count = isFutureSelected
                        ? 0
                        : Math.round(slot.records * dayFactor * projMult);
                      const pct = isFutureSelected
                        ? 0
                        : Math.min(
                            100,
                            Math.round((count / (39 * projMult || 1)) * 100),
                          );
                      return (
                        <div key={idx} className="space-y-1 py-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground font-mono">
                              {slot.slot}
                            </span>
                            <span className="text-foreground font-mono font-bold">
                              {formatRecordNumber(count)} records
                            </span>
                          </div>
                          <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                            <div
                              className="bg-primary h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-muted-foreground border-border/40 border-t pt-1 text-center text-[10px]">
                    Showing hourly distribution within standard 9:00 AM to 6:00
                    PM shift.
                  </p>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
