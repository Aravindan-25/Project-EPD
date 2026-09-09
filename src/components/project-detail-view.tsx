import React, { useState, useMemo } from "react";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  CheckCircle2,
  Clock,
  Building2,
  FileText,
  Filter,
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
  Lock,
  Mail,
  Save,
  Search,
  ArrowRight,
  TrendingUp,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Project, TeamMember, ProjectTeam } from "@/types/project";
import { ManageTeamDialog } from "@/components/manage-team-dialog";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDisplayDate(d: Date): string {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

function formatUpperDate(d: Date): string {
  return `${d.getDate()} ${MONTH_SHORT[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

function normalizeDate(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isSameDay(d1: Date, d2: Date): boolean {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getDaysBetween(d1: Date, d2: Date): number {
  const t1 = normalizeDate(d1).getTime();
  const t2 = normalizeDate(d2).getTime();
  return Math.round(Math.abs(t2 - t1) / (1000 * 60 * 60 * 24)) + 1;
}

interface DateRangePickerProps {
  initialStart: Date;
  initialEnd: Date;
  onCancel: () => void;
  onApply: (start: Date, end: Date) => void;
}

function DateRangePicker({
  initialStart,
  initialEnd,
  onCancel,
  onApply,
}: DateRangePickerProps) {
  const [pendingStart, setPendingStart] = useState<Date>(
    normalizeDate(initialStart),
  );
  const [pendingEnd, setPendingEnd] = useState<Date | null>(
    normalizeDate(initialEnd),
  );
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const [viewYear, setViewYear] = useState<number>(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialStart.getMonth());

  const month2Year = viewMonth === 11 ? viewYear + 1 : viewYear;
  const month2Month = viewMonth === 11 ? 0 : viewMonth + 1;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateClick = (clickedDate: Date) => {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(clickedDate);
      setPendingEnd(null);
    } else {
      if (clickedDate.getTime() < pendingStart.getTime()) {
        setPendingStart(clickedDate);
        setPendingEnd(null);
      } else {
        setPendingEnd(clickedDate);
      }
    }
  };

  const handleQuickOption = (option: string) => {
    const refEnd = new Date(2026, 8, 2);
    let refStart = new Date(2026, 7, 26);
    if (option === "1 Week") {
      refStart = new Date(2026, 7, 26);
    } else if (option === "3 Weeks") {
      refStart = new Date(2026, 7, 12);
    } else if (option === "1 Month") {
      refStart = new Date(2026, 7, 2);
    } else if (option === "3 Months") {
      refStart = new Date(2026, 5, 2);
    } else if (option === "6 Months") {
      refStart = new Date(2026, 2, 2);
    }
    setPendingStart(refStart);
    setPendingEnd(refEnd);
    setViewYear(refStart.getFullYear());
    setViewMonth(refStart.getMonth());
  };

  const currentSpan =
    pendingStart && pendingEnd
      ? getDaysBetween(pendingStart, pendingEnd)
      : pendingStart && hoveredDate && hoveredDate >= pendingStart
        ? getDaysBetween(pendingStart, hoveredDate)
        : pendingStart
          ? 1
          : 0;

  const isQuickOptionActive = (startDay: number, startMonth: number) => {
    return (
      pendingStart &&
      pendingEnd &&
      pendingStart.getDate() === startDay &&
      pendingStart.getMonth() === startMonth &&
      pendingStart.getFullYear() === 2026 &&
      pendingEnd.getDate() === 2 &&
      pendingEnd.getMonth() === 8 &&
      pendingEnd.getFullYear() === 2026
    );
  };

  const renderMonthCalendar = (
    year: number,
    month: number,
    isFirstMonth: boolean,
  ) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const weekDays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
    const effectiveEnd =
      pendingEnd ||
      (hoveredDate && hoveredDate >= pendingStart ? hoveredDate : null);

    return (
      <div className="min-w-[260px] flex-1 space-y-3">
        {/* Month Header */}
        <div className="flex h-8 items-center justify-between">
          {isFirstMonth ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevMonth}
              className="hover:bg-secondary text-foreground h-7 w-7 cursor-pointer rounded-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          ) : (
            <div className="w-7" />
          )}

          <span className="text-foreground text-xs font-bold">
            {MONTH_NAMES[month]} {year}
          </span>

          {!isFirstMonth ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNextMonth}
              className="hover:bg-secondary text-foreground h-7 w-7 cursor-pointer rounded-md"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="w-7" />
          )}
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 text-center">
          {weekDays.map((wd) => (
            <div
              key={wd}
              className="text-muted-foreground py-1 text-[10px] font-bold tracking-wider uppercase"
            >
              {wd}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-y-1 text-center">
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="h-8" />
          ))}

          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
            const thisDate = new Date(year, month, d);
            const isStart = pendingStart && isSameDay(thisDate, pendingStart);
            const isEnd = effectiveEnd && isSameDay(thisDate, effectiveEnd);
            const isInRange =
              pendingStart &&
              effectiveEnd &&
              thisDate.getTime() > pendingStart.getTime() &&
              thisDate.getTime() < effectiveEnd.getTime();

            return (
              <div
                key={d}
                className={cn(
                  "relative flex h-8 items-center justify-center",
                  isInRange && "bg-primary/10",
                  isStart &&
                    effectiveEnd &&
                    !isSameDay(pendingStart, effectiveEnd) &&
                    "bg-primary/10 rounded-l-full",
                  isEnd &&
                    pendingStart &&
                    !isSameDay(pendingStart, effectiveEnd) &&
                    "bg-primary/10 rounded-r-full",
                )}
              >
                <button
                  type="button"
                  onClick={() => handleDateClick(thisDate)}
                  onMouseEnter={() => !pendingEnd && setHoveredDate(thisDate)}
                  className={cn(
                    "relative z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-xs font-semibold transition-all",
                    isStart || isEnd
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : isInRange
                        ? "text-primary hover:bg-primary/20 font-bold"
                        : "text-foreground hover:bg-secondary/80",
                  )}
                >
                  {d}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-card border-border max-w-2xl space-y-5 rounded-2xl p-5 shadow-xl">
      {/* TWO MONTHS SIDE BY SIDE */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderMonthCalendar(viewYear, viewMonth, true)}
        {renderMonthCalendar(month2Year, month2Month, false)}
      </div>

      {/* QUICK OPTIONS */}
      <div className="border-border/80 space-y-2 border-t pt-4">
        <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
          QUICK OPTIONS
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "1 Week", startDay: 26, startMonth: 7 },
            { label: "3 Weeks", startDay: 12, startMonth: 7 },
            { label: "1 Month", startDay: 2, startMonth: 7 },
            { label: "3 Months", startDay: 2, startMonth: 5 },
            { label: "6 Months", startDay: 2, startMonth: 2 },
          ].map((opt) => {
            const isActive = isQuickOptionActive(opt.startDay, opt.startMonth);
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleQuickOption(opt.label)}
                className={cn(
                  "cursor-pointer rounded-full border px-3 py-1 text-xs font-semibold transition-all",
                  isActive
                    ? "border-primary bg-primary text-primary-foreground font-bold shadow-xs"
                    : "border-border bg-secondary/50 text-foreground hover:bg-secondary",
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* FOOTER */}
      <div className="border-border/80 flex items-center justify-between border-t pt-3">
        <span className="text-foreground text-xs font-bold">
          {currentSpan} days
        </span>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="border-border h-8 cursor-pointer rounded-lg px-4 text-xs font-semibold"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={() => onApply(pendingStart, pendingEnd || pendingStart)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer rounded-lg px-5 text-xs font-bold"
          >
            Done
          </Button>
        </div>
      </div>
    </Card>
  );
}

function getPerformanceForRange(
  start: Date,
  end: Date,
  type: "production" | "qc",
) {
  const cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  let activeWorkDays = 0;
  let totalRecords = 0;

  const knownDaily: Record<string, { prod: number; qc: number }> = {
    "2026-08-26": { prod: 485, qc: 300 },
    "2026-08-27": { prod: 478, qc: 295 },
    "2026-08-28": { prod: 492, qc: 302 },
    "2026-08-29": { prod: 480, qc: 296 },
    "2026-08-30": { prod: 0, qc: 0 },
    "2026-08-31": { prod: 490, qc: 302 },
    "2026-09-01": { prod: 457, qc: 279 },
    "2026-09-02": { prod: 0, qc: 0 },
  };

  while (cur <= last) {
    const key = `${cur.getFullYear()}-${String(cur.getMonth() + 1).padStart(2, "0")}-${String(cur.getDate()).padStart(2, "0")}`;
    const dayOfWeek = cur.getDay();

    let prodVal = 0;
    let qcVal = 0;

    if (knownDaily[key] !== undefined) {
      prodVal = knownDaily[key].prod;
      qcVal = knownDaily[key].qc;
    } else if (dayOfWeek !== 0) {
      const seed =
        (cur.getFullYear() * 372 + (cur.getMonth() + 1) * 31 + cur.getDate()) %
        100;
      prodVal = 440 + (seed % 80);
      qcVal = 270 + (seed % 55);
    }

    const val = type === "production" ? prodVal : qcVal;
    if (val > 0) {
      activeWorkDays += 1;
      totalRecords += val;
    }

    cur.setDate(cur.getDate() + 1);
  }

  const dailyAvg =
    activeWorkDays > 0 ? Math.round(totalRecords / activeWorkDays) : 0;
  return { activeWorkDays, totalRecords, dailyAvg };
}

interface MonthlyPerfItem {
  label: string;
  records: string;
  val: number;
  best?: boolean;
}

const PROD_MONTHLY_PERF_DATA: MonthlyPerfItem[] = [
  { label: "May 2025", records: "5,12,400 records", val: 86 },
  { label: "Jun 2025", records: "5,84,150 records", val: 96 },
  { label: "Jul 2025", records: "8,32,310 records", val: 125, best: true },
  { label: "Aug 2025", records: "6,24,500 records", val: 102 },
  { label: "Sep 2025", records: "5,92,300 records", val: 97 },
  { label: "Oct 2025", records: "6,15,800 records", val: 100 },
  { label: "Nov 2025", records: "6,48,200 records", val: 105 },
  { label: "Dec 2025", records: "5,30,900 records", val: 88 },
  { label: "Jan 2026", records: "6,05,400 records", val: 98 },
  { label: "Feb 2026", records: "5,80,100 records", val: 95 },
  { label: "Mar 2026", records: "6,82,750 records", val: 110 },
  { label: "Apr 2026", records: "6,35,200 records", val: 103 },
  { label: "May 2026", records: "6,52,400 records", val: 106 },
  { label: "Jun 2026", records: "6,95,600 records", val: 112 },
  { label: "Jul 2026", records: "7,18,900 records", val: 116 },
  { label: "Aug 2026", records: "6,65,300 records", val: 108 },
  { label: "Sep 2026", records: "5,68,200 records", val: 93 },
];

const QC_MONTHLY_PERF_DATA: MonthlyPerfItem[] = [
  { label: "May 2025", records: "3,25,600 QC records", val: 85 },
  { label: "Jun 2025", records: "3,88,400 QC records", val: 95 },
  { label: "Jul 2025", records: "5,32,680 QC records", val: 125, best: true },
  { label: "Aug 2025", records: "4,40,000 QC records", val: 102 },
  { label: "Sep 2025", records: "3,95,100 QC records", val: 96 },
  { label: "Oct 2025", records: "4,10,500 QC records", val: 99 },
  { label: "Nov 2025", records: "4,32,000 QC records", val: 104 },
  { label: "Dec 2025", records: "3,48,200 QC records", val: 88 },
  { label: "Jan 2026", records: "4,02,800 QC records", val: 97 },
  { label: "Feb 2026", records: "3,90,400 QC records", val: 94 },
  { label: "Mar 2026", records: "4,52,600 QC records", val: 109 },
  { label: "Apr 2026", records: "4,24,100 QC records", val: 102 },
  { label: "May 2026", records: "4,38,700 QC records", val: 105 },
  { label: "Jun 2026", records: "4,68,900 QC records", val: 111 },
  { label: "Jul 2026", records: "4,82,300 QC records", val: 115 },
  { label: "Aug 2026", records: "4,45,800 QC records", val: 107 },
  { label: "Sep 2026", records: "3,75,400 QC records", val: 92 },
];

function getSmoothTrendPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;

  let d = `M ${points[0].x} ${points[0].y}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const p0 =
      i > 0 ? points[i - 1] : { x: 2 * p1.x - p2.x, y: 2 * p1.y - p2.y };
    const p3 =
      i + 2 < points.length
        ? points[i + 2]
        : { x: 2 * p2.x - p1.x, y: 2 * p2.y - p1.y };

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }

  return d;
}

const PERF_PROJECT_DATA: Record<
  string,
  {
    name: string;
    code: string;
    status: string;
    prod: {
      totalRecords: string;
      monthlyAvg: string;
      bestMonth: string;
      bestRecords: string;
      monthsActive: number;
    };
    qc: {
      totalRecords: string;
      monthlyAvg: string;
      bestMonth: string;
      bestRecords: string;
      monthsActive: number;
    };
    scale: number;
  }
> = {
  all: {
    name: "All Projects (Combined)",
    code: "ALL",
    status: "All Projects",
    prod: {
      totalRecords: "1,27,30,790",
      monthlyAvg: "7,48,870",
      bestMonth: "Jul 2025",
      bestRecords: "8,32,310 records peak",
      monthsActive: 17,
    },
    qc: {
      totalRecords: "81,47,690",
      monthlyAvg: "4,79,276",
      bestMonth: "Jul 2025",
      bestRecords: "5,32,680 QC records peak",
      monthsActive: 17,
    },
    scale: 1.0,
  },
  "prj-01": {
    name: "Alpha Vision Segmentation",
    code: "PRJ-001",
    status: "In Progress",
    prod: {
      totalRecords: "58,42,150",
      monthlyAvg: "7,30,268",
      bestMonth: "Jul 2025",
      bestRecords: "8,32,310 records peak",
      monthsActive: 8,
    },
    qc: {
      totalRecords: "38,20,400",
      monthlyAvg: "4,77,550",
      bestMonth: "Jul 2025",
      bestRecords: "5,32,680 QC records peak",
      monthsActive: 8,
    },
    scale: 0.8,
  },
  "prj-02": {
    name: "BioTech Medical Annotation",
    code: "PRJ-002",
    status: "Completed",
    prod: {
      totalRecords: "42,65,800",
      monthlyAvg: "7,10,966",
      bestMonth: "Apr 2026",
      bestRecords: "7,95,400 records peak",
      monthsActive: 6,
    },
    qc: {
      totalRecords: "26,18,500",
      monthlyAvg: "4,36,416",
      bestMonth: "Apr 2026",
      bestRecords: "4,82,000 QC records peak",
      monthsActive: 6,
    },
    scale: 0.65,
  },
  "prj-03": {
    name: "Global Logistics OCR Conversion",
    code: "PRJ-003",
    status: "Completed",
    prod: {
      totalRecords: "26,22,840",
      monthlyAvg: "6,55,710",
      bestMonth: "Nov 2025",
      bestRecords: "7,12,000 records peak",
      monthsActive: 4,
    },
    qc: {
      totalRecords: "17,08,790",
      monthlyAvg: "4,27,197",
      bestMonth: "Nov 2025",
      bestRecords: "4,45,000 QC records peak",
      monthsActive: 4,
    },
    scale: 0.5,
  },
};

function getDayRecords(
  year: number,
  month: number,
  day: number,
  type: "production" | "qc",
  projectKey: string,
): number {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  ).getTime();
  const targetDate = new Date(year, month, day).getTime();

  // All future dates after today must have ZERO records
  if (targetDate > todayStart) {
    return 0;
  }

  // Sundays off (0 records)
  const dow = new Date(year, month, day).getDay();
  if (dow === 0) return 0;

  if (projectKey === "prj-01") {
    if (year !== 2026 || month > 8) return 0;
  } else if (projectKey === "prj-02") {
    if (year !== 2026 || month > 6) return 0;
  } else if (projectKey === "prj-03") {
    const isOctToDec2025 = year === 2025 && month >= 9;
    const isJanToApr2026 = year === 2026 && month <= 3;
    if (!isOctToDec2025 && !isJanToApr2026) return 0;
  }

  const seed = (year * 372 + (month + 1) * 31 + day) % 100;
  const base = type === "production" ? 440 + (seed % 75) : 265 + (seed % 55);
  const scale =
    projectKey === "all"
      ? 1.0
      : projectKey === "prj-01"
        ? 0.8
        : projectKey === "prj-02"
          ? 0.95
          : 0.9;

  return Math.round(base * scale);
}

function getProjectMonthlyData(
  projectKey: string,
  type: "production" | "qc",
): MonthlyPerfItem[] {
  if (projectKey === "all") {
    return type === "production"
      ? PROD_MONTHLY_PERF_DATA
      : QC_MONTHLY_PERF_DATA;
  }

  const baseData =
    type === "production" ? PROD_MONTHLY_PERF_DATA : QC_MONTHLY_PERF_DATA;

  if (projectKey === "prj-01") {
    return baseData.map((m, idx) => {
      if (idx < 8) {
        return {
          label: m.label,
          records: type === "production" ? "0 records" : "0 QC records",
          val: 8,
        };
      }
      const isBest = idx === 14;
      const records = isBest
        ? type === "production"
          ? "7,18,900 records"
          : "4,82,300 QC records"
        : type === "production"
          ? `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.85).toLocaleString()} records`
          : `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.85).toLocaleString()} QC records`;
      const val = isBest ? 125 : Math.max(15, Math.round(m.val * 0.9));
      return { label: m.label, records, val, best: isBest };
    });
  }

  if (projectKey === "prj-02") {
    return baseData.map((m, idx) => {
      if (idx < 8 || idx > 14) {
        return {
          label: m.label,
          records: type === "production" ? "0 records" : "0 QC records",
          val: 8,
        };
      }
      const isBest = idx === 11;
      const records = isBest
        ? type === "production"
          ? "7,95,400 records"
          : "4,82,000 QC records"
        : type === "production"
          ? `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.95).toLocaleString()} records`
          : `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.95).toLocaleString()} QC records`;
      const val = isBest ? 125 : Math.max(15, Math.round(m.val * 0.88));
      return { label: m.label, records, val, best: isBest };
    });
  }

  if (projectKey === "prj-03") {
    return baseData.map((m, idx) => {
      if (idx < 5 || idx > 11) {
        return {
          label: m.label,
          records: type === "production" ? "0 records" : "0 QC records",
          val: 8,
        };
      }
      const isBest = idx === 6;
      const records = isBest
        ? type === "production"
          ? "7,12,000 records"
          : "4,45,000 QC records"
        : type === "production"
          ? `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.88).toLocaleString()} records`
          : `${Math.round(parseInt(m.records.replace(/[^0-9]/g, "")) * 0.88).toLocaleString()} QC records`;
      const val = isBest ? 125 : Math.max(15, Math.round(m.val * 0.85));
      return { label: m.label, records, val, best: isBest };
    });
  }

  return baseData;
}

function getProjectBestMonthIdx(projectKey: string): number {
  if (projectKey === "prj-01") return 14;
  if (projectKey === "prj-02") return 11;
  if (projectKey === "prj-03") return 6;
  return 2;
}

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
  project: initialProject,
  onBack,
  onUpdateTeam,
}: ProjectDetailViewProps) {
  const [project, setProject] = useState(initialProject);
  const [activeTab, setActiveTab] = useState("overview");
  const [dpTab, setDpTab] = useState<
    "overview" | "team" | "batches" | "attachments" | "activity"
  >("overview");
  const [activitySubTab, setActivitySubTab] = useState<
    "user_actions" | "data_diffs"
  >("user_actions");

  const [selectedPerfProject, setSelectedPerfProject] = useState<string>("all");
  const activePerfMetrics =
    PERF_PROJECT_DATA[selectedPerfProject] || PERF_PROJECT_DATA.all;

  const [hoveredProdMonthIdx, setHoveredProdMonthIdx] = useState<number>(2);
  const [hoveredQcMonthIdx, setHoveredQcMonthIdx] = useState<number>(2);

  const currentProdMonthlyData = useMemo(
    () => getProjectMonthlyData(selectedPerfProject, "production"),
    [selectedPerfProject],
  );
  const prodTrendPoints = useMemo(
    () =>
      currentProdMonthlyData.map((m, idx) => ({
        x: 35 + idx * 46,
        y: 190 - m.val,
      })),
    [currentProdMonthlyData],
  );
  const prodTrendPath = useMemo(
    () => getSmoothTrendPath(prodTrendPoints),
    [prodTrendPoints],
  );

  const currentQcMonthlyData = useMemo(
    () => getProjectMonthlyData(selectedPerfProject, "qc"),
    [selectedPerfProject],
  );
  const qcTrendPoints = useMemo(
    () =>
      currentQcMonthlyData.map((m, idx) => ({
        x: 35 + idx * 46,
        y: 190 - m.val,
      })),
    [currentQcMonthlyData],
  );
  const qcTrendPath = useMemo(
    () => getSmoothTrendPath(qcTrendPoints),
    [qcTrendPoints],
  );

  const [prodCalDate, setProdCalDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
  });
  const [qcCalDate, setQcCalDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>(() => {
    const now = new Date();
    return {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    };
  });

  const handlePrevProdCalMonth = () => {
    setProdCalDate((prev) => {
      const now = new Date();
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const isCurrentMonth =
        newYear === now.getFullYear() && newMonth === now.getMonth();
      return {
        year: newYear,
        month: newMonth,
        day: isCurrentMonth ? now.getDate() : 1,
      };
    });
  };
  const handleNextProdCalMonth = () => {
    setProdCalDate((prev) => {
      const now = new Date();
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const isCurrentMonth =
        newYear === now.getFullYear() && newMonth === now.getMonth();
      return {
        year: newYear,
        month: newMonth,
        day: isCurrentMonth ? now.getDate() : 1,
      };
    });
  };

  const handlePrevQcCalMonth = () => {
    setQcCalDate((prev) => {
      const now = new Date();
      const newYear = prev.month === 0 ? prev.year - 1 : prev.year;
      const newMonth = prev.month === 0 ? 11 : prev.month - 1;
      const isCurrentMonth =
        newYear === now.getFullYear() && newMonth === now.getMonth();
      return {
        year: newYear,
        month: newMonth,
        day: isCurrentMonth ? now.getDate() : 1,
      };
    });
  };
  const handleNextQcCalMonth = () => {
    setQcCalDate((prev) => {
      const now = new Date();
      const newYear = prev.month === 11 ? prev.year + 1 : prev.year;
      const newMonth = prev.month === 11 ? 0 : prev.month + 1;
      const isCurrentMonth =
        newYear === now.getFullYear() && newMonth === now.getMonth();
      return {
        year: newYear,
        month: newMonth,
        day: isCurrentMonth ? now.getDate() : 1,
      };
    });
  };

  const prodFirstDayOfMonth = useMemo(
    () => new Date(prodCalDate.year, prodCalDate.month, 1).getDay(),
    [prodCalDate.year, prodCalDate.month],
  );
  const prodDaysInMonth = useMemo(
    () => new Date(prodCalDate.year, prodCalDate.month + 1, 0).getDate(),
    [prodCalDate.year, prodCalDate.month],
  );

  const qcFirstDayOfMonth = useMemo(
    () => new Date(qcCalDate.year, qcCalDate.month, 1).getDay(),
    [qcCalDate.year, qcCalDate.month],
  );
  const qcDaysInMonth = useMemo(
    () => new Date(qcCalDate.year, qcCalDate.month + 1, 0).getDate(),
    [qcCalDate.year, qcCalDate.month],
  );

  const prodSelectedDayRecs = useMemo(
    () =>
      getDayRecords(
        prodCalDate.year,
        prodCalDate.month,
        prodCalDate.day,
        "production",
        selectedPerfProject,
      ),
    [prodCalDate, selectedPerfProject],
  );

  const prodHourlySlots = useMemo(() => {
    const slots = [
      { slot: "09:00 AM - 10:00 AM", ratio: 0.109 },
      { slot: "10:00 AM - 11:00 AM", ratio: 0.129 },
      { slot: "11:00 AM - 12:00 PM", ratio: 0.12 },
      { slot: "12:00 PM - 01:00 PM", ratio: 0.081 },
      { slot: "01:00 PM - 02:00 PM", ratio: 0.12 },
      { slot: "02:00 PM - 03:00 PM", ratio: 0.14 },
      { slot: "03:00 PM - 04:00 PM", ratio: 0.109 },
      { slot: "04:00 PM - 05:00 PM", ratio: 0.103 },
      { slot: "05:00 PM - 06:00 PM", ratio: 0.0 },
    ];
    if (prodSelectedDayRecs === 0) {
      return slots.map((s) => ({ slot: s.slot, recs: 0, pct: 0 }));
    }
    return slots.map((s) => {
      const recs = Math.round(prodSelectedDayRecs * s.ratio);
      const pct = Math.min(100, Math.round((recs / 65) * 100));
      return { slot: s.slot, recs, pct };
    });
  }, [prodSelectedDayRecs]);

  const qcSelectedDayRecs = useMemo(
    () =>
      getDayRecords(
        qcCalDate.year,
        qcCalDate.month,
        qcCalDate.day,
        "qc",
        selectedPerfProject,
      ),
    [qcCalDate, selectedPerfProject],
  );

  const qcHourlySlots = useMemo(() => {
    const slots = [
      { slot: "09:00 AM - 10:00 AM", ratio: 0.111 },
      { slot: "10:00 AM - 11:00 AM", ratio: 0.129 },
      { slot: "11:00 AM - 12:00 PM", ratio: 0.118 },
      { slot: "12:00 PM - 01:00 PM", ratio: 0.079 },
      { slot: "01:00 PM - 02:00 PM", ratio: 0.118 },
      { slot: "02:00 PM - 03:00 PM", ratio: 0.14 },
      { slot: "03:00 PM - 04:00 PM", ratio: 0.111 },
      { slot: "04:00 PM - 05:00 PM", ratio: 0.194 },
      { slot: "05:00 PM - 06:00 PM", ratio: 0.0 },
    ];
    if (qcSelectedDayRecs === 0) {
      return slots.map((s) => ({ slot: s.slot, recs: 0, pct: 0 }));
    }
    return slots.map((s) => {
      const recs = Math.round(qcSelectedDayRecs * s.ratio);
      const pct = Math.min(100, Math.round((recs / 55) * 100));
      return { slot: s.slot, recs, pct };
    });
  }, [qcSelectedDayRecs]);

  const formatDashboardDate = (d: Date = new Date()) => {
    const day = d.getDate();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "pm" : "am";
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year} ${hours}:${minutes}${ampm}`;
  };

  // DP Project Team Roster State
  const [dpTeamRoster, setDpTeamRoster] = useState([
    {
      id: "dp-emp-1",
      initials: "SC",
      name: "Sarah Chen",
      employeeCode: "emp-02",
      roleDesignation: "Data Processing Specialist",
      shift: "Morning",
      involvement: ["Production", "QC"],
      lastUpdated: "2 Sep 2026 5:58pm",
    },
    {
      id: "dp-emp-2",
      initials: "AR",
      name: "Alex Rivera",
      employeeCode: "emp-05",
      roleDesignation: "Data Annotation Lead",
      shift: "Morning",
      involvement: ["Production", "Review"],
      lastUpdated: "1 Sep 2026 11:30am",
    },
    {
      id: "dp-emp-3",
      initials: "PS",
      name: "Priyansh Sharma",
      employeeCode: "emp-12",
      roleDesignation: "Quality Assurance Auditor",
      shift: "Evening",
      involvement: ["QC"],
      lastUpdated: "28 Aug 2026 3:15pm",
    },
  ]);
  // Add Employee to Project Team Dialog State
  const EMPLOYEE_DIRECTORY_OPTIONS = [
    {
      id: "EMP-1042",
      name: "Mathan Kumar",
      code: "EMP-1042",
      designation: "Senior Production Specialist",
      label: "Mathan Kumar (EMP-1042) — Senior Production Specialist",
      initials: "MK",
    },
    {
      id: "EMP-02",
      name: "Sarah Chen",
      code: "emp-02",
      designation: "Data Processing Specialist",
      label: "Sarah Chen (emp-02) — Data Processing Specialist",
      initials: "SC",
    },
    {
      id: "EMP-05",
      name: "Alex Rivera",
      code: "emp-05",
      designation: "Data Annotation Lead",
      label: "Alex Rivera (emp-05) — Data Annotation Lead",
      initials: "AR",
    },
    {
      id: "EMP-12",
      name: "Priyansh Sharma",
      code: "emp-12",
      designation: "Quality Assurance Auditor",
      label: "Priyansh Sharma (emp-12) — Quality Assurance Auditor",
      initials: "PS",
    },
    {
      id: "EMP-1088",
      name: "Kavita Reddy",
      code: "EMP-1088",
      designation: "Senior QC Manager",
      label: "Kavita Reddy (EMP-1088) — Senior QC Manager",
      initials: "KR",
    },
  ];

  const [isAddEmployeeOpen, setIsAddEmployeeOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(
    "Mathan Kumar (EMP-1042) — Senior Production Specialist",
  );
  const [teamRoleDesignation, setTeamRoleDesignation] = useState(
    "Data Processing Specialist",
  );
  const [addTimeHour, setAddTimeHour] = useState("09");
  const [addTimeMinute, setAddTimeMinute] = useState("30");
  const [addTimeAmpm, setAddTimeAmpm] = useState("AM");
  const [enableProduction, setEnableProduction] = useState(true);
  const [enableQC, setEnableQC] = useState(false);

  const getOperatingShift = (hourStr: string, ampm: string) => {
    let hour = parseInt(hourStr, 10);
    if (ampm === "PM" && hour !== 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    if (hour >= 6 && hour < 14)
      return { name: "Morning Shift", pill: "Morning" };
    if (hour >= 14 && hour < 22)
      return { name: "Evening Shift", pill: "Evening" };
    return { name: "Night Shift", pill: "Night" };
  };

  const handleAddDPTeamMember = () => {
    const selectedObj =
      EMPLOYEE_DIRECTORY_OPTIONS.find((e) => e.label === selectedEmployee) ||
      EMPLOYEE_DIRECTORY_OPTIONS[0];

    const shiftInfo = getOperatingShift(addTimeHour, addTimeAmpm);
    const involvement: string[] = [];
    if (enableProduction) involvement.push("Production");
    if (enableQC) involvement.push("QC");
    if (involvement.length === 0) involvement.push("Production");

    const timeNow = formatDashboardDate();
    const newMember = {
      id: `dp-emp-${selectedObj.code.toLowerCase()}-${dpTeamRoster.length + 1}`,
      initials: selectedObj.initials,
      name: selectedObj.name,
      employeeCode: selectedObj.code,
      roleDesignation: teamRoleDesignation || "Data Processing Specialist",
      shift: shiftInfo.pill,
      involvement: involvement,
      lastUpdated: timeNow,
    };

    setDpTeamRoster((prev) => [newMember, ...prev]);
    setIsAddEmployeeOpen(false);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Vikram Malhotra",
        role: "Admin",
        type: "MEMBER_ADD",
        entity: "Team Member",
        target: `${selectedObj.name} (${selectedObj.code})`,
        desc: `Assigned ${selectedObj.name} to ${project.name}`,
        status: "SUCCESS",
        time: timeNow,
      },
      ...prev,
    ]);
  };

  // Edit Employee Details and Project Team Modal State
  const [isEditMemberOpen, setIsEditMemberOpen] = useState(false);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [isViewMemberDrawerOpen, setIsViewMemberDrawerOpen] = useState(false);
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const [viewingMember, setViewingMember] = useState<any>(null);

  const openViewMemberDrawer = (member: (typeof dpTeamRoster)[0]) => {
    setViewingMember(member);
    setIsViewMemberDrawerOpen(true);
  };

  const [isFullProfileView, setIsFullProfileView] = useState(false);
  const [profileTab, setProfileTab] = useState<"overview" | "performance">(
    "overview",
  );
  const [perfSubTab, setPerfSubTab] = useState<"production" | "qc">(
    "production",
  );
  const [selectedCalDate, setSelectedCalDate] = useState<number>(1);

  // Date Range Picker States for Production & QC Performance
  const [prodDateRange, setProdDateRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: new Date(2026, 7, 26),
    end: new Date(2026, 8, 2),
  });
  const [isProdDatePickerOpen, setIsProdDatePickerOpen] = useState(false);

  const [qcDateRange, setQcDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(2026, 7, 26),
    end: new Date(2026, 8, 2),
  });
  const [isQcDatePickerOpen, setIsQcDatePickerOpen] = useState(false);

  const prodRangeStats = useMemo(
    () =>
      getPerformanceForRange(
        prodDateRange.start,
        prodDateRange.end,
        "production",
      ),
    [prodDateRange],
  );

  const qcRangeStats = useMemo(
    () => getPerformanceForRange(qcDateRange.start, qcDateRange.end, "qc"),
    [qcDateRange],
  );

  const handleViewFullProfile = () => {
    setIsViewMemberDrawerOpen(false);
    setIsFullProfileView(true);
    setProfileTab("overview");
    setPerfSubTab("production");
    const now = new Date();
    setProdCalDate({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
    setQcCalDate({
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getDate(),
    });
  };
  const [editMemberEmployee, setEditMemberEmployee] = useState("");
  const [editMemberRole, setEditMemberRole] = useState("");
  const [editMemberHour, setEditMemberHour] = useState("09");
  const [editMemberMinute, setEditMemberMinute] = useState("30");
  const [editMemberAmpm, setEditMemberAmpm] = useState("AM");
  const [editEnableProduction, setEditEnableProduction] = useState(true);
  const [editEnableQC, setEditEnableQC] = useState(false);

  const openEditMemberModal = (member: (typeof dpTeamRoster)[0]) => {
    setEditingMemberId(member.id);
    const matchingOpt =
      EMPLOYEE_DIRECTORY_OPTIONS.find(
        (opt) =>
          opt.name.toLowerCase() === member.name.toLowerCase() ||
          opt.code.toLowerCase() === member.employeeCode.toLowerCase(),
      ) || EMPLOYEE_DIRECTORY_OPTIONS[0];

    setEditMemberEmployee(matchingOpt.label);
    setEditMemberRole(member.roleDesignation);

    if (member.lastUpdated && member.lastUpdated.includes(":")) {
      const match = member.lastUpdated.match(/(\d{1,2}):(\d{2})\s*(am|pm)/i);
      if (match) {
        setEditMemberHour(match[1].padStart(2, "0"));
        setEditMemberMinute(match[2]);
        setEditMemberAmpm(match[3].toUpperCase());
      }
    } else {
      setEditMemberHour("09");
      setEditMemberMinute("30");
      setEditMemberAmpm("AM");
    }

    setEditEnableProduction(
      member.involvement.some((inv) =>
        inv.toLowerCase().includes("production"),
      ),
    );
    setEditEnableQC(
      member.involvement.some((inv) => inv.toLowerCase().includes("qc")),
    );
    setIsEditMemberOpen(true);
  };

  const handleUpdateDPTeamMember = () => {
    if (!editingMemberId) return;
    const selectedObj =
      EMPLOYEE_DIRECTORY_OPTIONS.find((e) => e.label === editMemberEmployee) ||
      EMPLOYEE_DIRECTORY_OPTIONS[0];

    const shiftInfo = getOperatingShift(editMemberHour, editMemberAmpm);
    const involvement: string[] = [];
    if (editEnableProduction) involvement.push("Production");
    if (editEnableQC) involvement.push("QC");
    if (involvement.length === 0) involvement.push("Production");

    const timeNow = formatDashboardDate();
    setDpTeamRoster((prev) =>
      prev.map((member) => {
        if (member.id === editingMemberId) {
          return {
            ...member,
            initials: selectedObj.initials,
            name: selectedObj.name,
            employeeCode: selectedObj.code,
            roleDesignation: editMemberRole || "Data Processing Specialist",
            shift: shiftInfo.pill,
            involvement: involvement,
            lastUpdated: timeNow,
          };
        }
        return member;
      }),
    );
    setIsEditMemberOpen(false);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Vikram Malhotra",
        role: "Admin",
        type: "MEMBER_UPDATE",
        entity: "Team Member",
        target: `${selectedObj.name} (${selectedObj.code})`,
        desc: `Updated details and allocation for ${selectedObj.name}`,
        status: "SUCCESS",
        time: timeNow,
      },
      ...prev,
    ]);
  };

  // Edit Project Configuration Modal State
  const [isEditConfigOpen, setIsEditConfigOpen] = useState(false);
  const [editProjectName, setEditProjectName] = useState(project.name);
  const [editStartDate, setEditStartDate] = useState(
    project.periodStart || "01-09-2026",
  );
  const [editStartHour, setEditStartHour] = useState("10");
  const [editStartMinute, setEditStartMinute] = useState("00");
  const [editStartAmpm, setEditStartAmpm] = useState("AM");
  const [editDescription, setEditDescription] = useState(
    project.description || "",
  );
  const [editClientName, setEditClientName] = useState(
    project.clientName || "Latvia Orgn",
  );
  const [editClientEmail, setEditClientEmail] = useState(
    project.clientEmail || "sam@gmail.com",
  );
  const [editSecondaryEmails, setEditSecondaryEmails] = useState<string[]>(
    project.secondaryEmails || ["shenpa@gmail.com"],
  );

  const openEditConfigModal = () => {
    setEditProjectName(project.name);
    setEditStartDate(project.periodStart || "01-09-2026");
    setEditDescription(project.description || "");
    setEditClientName(project.clientName || "Latvia Orgn");
    setEditClientEmail(project.clientEmail || "sam@gmail.com");
    setEditSecondaryEmails(project.secondaryEmails || ["shenpa@gmail.com"]);
    setIsEditConfigOpen(true);
  };

  const handleAddSecondaryEmail = () => {
    setEditSecondaryEmails((prev) => [...prev, ""]);
  };

  const handleUpdateSecondaryEmail = (index: number, val: string) => {
    setEditSecondaryEmails((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  };

  const handleRemoveSecondaryEmail = (index: number) => {
    setEditSecondaryEmails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveConfig = () => {
    const timeNow = formatDashboardDate();
    setProject((prev) => ({
      ...prev,
      name: editProjectName,
      periodStart: editStartDate,
      startTime: `${editStartHour}:${editStartMinute} ${editStartAmpm}`,
      description: editDescription,
      clientName: editClientName,
      clientEmail: editClientEmail,
      secondaryEmails: editSecondaryEmails,
      lastUpdated: timeNow,
    }));

    setIsEditConfigOpen(false);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Vikram Malhotra",
        role: "Admin",
        type: "PROJECT_UPDATE",
        entity: "Project",
        target: project.code || "PRJ-001",
        desc: `Updated project configuration and metadata for ${editProjectName}`,
        status: "SUCCESS",
        time: timeNow,
      },
      ...prev,
    ]);

    setAuditDiffs((prev) => [
      {
        field: "Configuration Update",
        oldVal: "Previous Config",
        newVal: "Updated Metadata & Client Info",
        user: "Vikram Malhotra",
        date: timeNow,
      },
      ...prev,
    ]);
  };

  // DP Project Batches State
  const [dpBatches, setDpBatches] = useState([
    {
      id: "BAT-001",
      name: "Alpha Records - Batch 01",
      type: "Birth",
      lang: "English",
      sourceType: "Images",
      sourceUnits: 100,
      status: "COMPLETED",
      lastUpdated: "6 Sep 2026 12:10pm",
    },
    {
      id: "BAT-002",
      name: "Alpha Records - Batch 02",
      type: "Mixed",
      lang: "French",
      sourceType: "Images",
      sourceUnits: 100,
      status: "PRODUCTION IN PROGRESS",
      lastUpdated: "7 Sep 2026 10:45am",
    },
    {
      id: "BAT-003",
      name: "Alpha Records - Batch 03",
      type: "Community",
      lang: "English",
      sourceType: "PDF",
      sourceUnits: 100,
      status: "CREATED",
      lastUpdated: "8 Sep 2026 02:15pm",
    },
  ]);

  const WORLD_LANGUAGES = [
    "English",
    "French",
    "Spanish",
    "German",
    "Italian",
    "Portuguese",
    "Russian",
    "Chinese (Mandarin)",
    "Japanese",
    "Korean",
    "Arabic",
    "Hindi",
    "Bengali",
    "Tamil",
    "Telugu",
    "Marathi",
    "Gujarati",
    "Punjabi",
    "Urdu",
    "Vietnamese",
    "Thai",
    "Turkish",
    "Polish",
    "Dutch",
    "Swedish",
    "Norwegian",
    "Danish",
    "Finnish",
    "Greek",
    "Hebrew",
    "Czech",
    "Romanian",
    "Hungarian",
    "Indonesian",
    "Malay",
    "Tagalog",
    "Swahili",
    "Ukrainian",
    "Persian",
    "Amharic",
    "Latin",
    "Sanskrit",
    "Other",
  ];

  // Helper to generate 100 test image entries for testing purposes
  const generate100TestImages = () => {
    return Array.from({ length: 100 }, (_, i) => {
      const num = (i + 1).toString().padStart(3, "0");
      return {
        id: `img-test-${num}`,
        name: `image_${num}.jpg`,
        size: "2.4 MB",
      };
    });
  };

  // Create Batch Modal State
  const [isCreateBatchOpen, setIsCreateBatchOpen] = useState(false);
  const [batchId, setBatchId] = useState("BAT-484");
  const [batchName, setBatchName] = useState("Historical Register Alpha 01");
  const [recordType, setRecordType] = useState("Birth");
  const [customRecordType, setCustomRecordType] = useState("");
  const [batchLanguage, setBatchLanguage] = useState("English");
  const [languageSearch, setLanguageSearch] = useState("");
  const [sourceType, setSourceType] = useState<"Images" | "PDF">("Images");

  // Uploaded Files State
  const [uploadedImageFiles, setUploadedImageFiles] = useState<
    { id: string; name: string; size: string }[]
  >(generate100TestImages());

  const [uploadedPdfFiles, setUploadedPdfFiles] = useState<
    { id: string; name: string; size: string; pages: number }[]
  >([{ id: "pdf-1", name: "document_001.pdf", size: "4.2 MB", pages: 100 }]);

  // Batch Date & Time State
  const [batchDate, setBatchDate] = useState("07-09-2026");
  const [batchHour, setBatchHour] = useState("10");
  const [batchMinute, setBatchMinute] = useState("30");
  const [batchAmpm, setBatchAmpm] = useState("AM");

  // File Input Refs
  const imageFileInputRef = React.useRef<HTMLInputElement>(null);
  const imageFolderInputRef = React.useRef<HTMLInputElement>(null);
  const pdfFileInputRef = React.useRef<HTMLInputElement>(null);

  const totalSourceUnits = React.useMemo(() => {
    if (sourceType === "Images") {
      return uploadedImageFiles.length;
    } else {
      return uploadedPdfFiles.reduce((sum, item) => sum + item.pages, 0);
    }
  }, [sourceType, uploadedImageFiles, uploadedPdfFiles]);

  const openCreateBatchModal = () => {
    const nextNum = Math.floor(100 + Math.random() * 900);
    setBatchId(`BAT-${nextNum}`);
    setBatchName("");
    setRecordType("Birth");
    setCustomRecordType("");
    setBatchLanguage("English");
    setLanguageSearch("");
    setSourceType("Images");
    setUploadedImageFiles(generate100TestImages());
    setUploadedPdfFiles([
      { id: "pdf-1", name: "document_001.pdf", size: "4.2 MB", pages: 100 },
    ]);
    setBatchDate("07-09-2026");
    setBatchHour("10");
    setBatchMinute("30");
    setBatchAmpm("AM");
    setIsCreateBatchOpen(true);
  };

  const handleImageFileUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    // Temporary testing logic: Populate 100 uploaded images on user interaction
    setUploadedImageFiles(generate100TestImages());
  };

  const handlePdfFileUpload = (e?: React.ChangeEvent<HTMLInputElement>) => {
    // Temporary testing logic: One uploaded PDF with fixed Total Pages: 100
    setUploadedPdfFiles([
      { id: "pdf-1", name: "document_001.pdf", size: "4.2 MB", pages: 100 },
    ]);
  };

  const renderOverallStatus = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
            COMPLETED
          </span>
        );
      case "PRODUCTION IN PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            PRODUCTION IN PROGRESS
          </span>
        );
      case "QC IN PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-purple-200 bg-purple-50 px-2.5 py-0.5 text-[11px] font-semibold text-purple-600 dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500"></span>
            QC IN PROGRESS
          </span>
        );
      case "READY FOR CONSOLIDATION":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-0.5 text-[11px] font-semibold text-cyan-600 dark:border-cyan-800 dark:bg-cyan-950/40 dark:text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
            READY FOR CONSOLIDATION
          </span>
        );
      case "SEGMENTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-semibold text-indigo-600 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-400">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
            SEGMENTED
          </span>
        );
      default:
        return (
          <span className="bg-primary/10 border-primary/30 text-primary inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
            <span className="bg-primary h-1.5 w-1.5 rounded-full"></span>
            CREATED
          </span>
        );
    }
  };

  // Client Attachments State
  const [clientAttachments, setClientAttachments] = useState([
    {
      id: "att-1",
      name: "BioTech_Alpha_Guidelines_v3.pdf",
      type: "PDF (SOP)",
      size: "4.2 MB",
      attachedAt: "1 Aug 2026 10:30am",
    },
    {
      id: "att-2",
      name: "Cell_Taxonomy_Vocabulary_2026.json",
      type: "JSON (Dictionary)",
      size: "1.8 MB",
      attachedAt: "3 Aug 2026 4:15pm",
    },
  ]);

  const attachmentFileInputRef = React.useRef<HTMLInputElement>(null);

  // Activity & Audit Log State
  const [activityLogs, setActivityLogs] = useState([
    {
      id: "act-1",
      user: "Vikram Malhotra",
      role: "Admin",
      type: "CREATE",
      entity: "Project",
      target: project.code || "PRJ-001",
      desc: `Project "${project.name}" created in Data Processing department`,
      status: "SUCCESS",
      time: "1 Aug 2026 2:30pm",
    },
    {
      id: "act-2",
      user: "Vikram Malhotra",
      role: "Admin",
      type: "BATCH_CREATE",
      entity: "Batch",
      target: "BAT-001",
      desc: "Batch Alpha Records - Batch 01 created",
      status: "SUCCESS",
      time: "5 Aug 2026 10:00am",
    },
    {
      id: "act-3",
      user: "Vikram Malhotra",
      role: "Admin",
      type: "MEMBER_ADD",
      entity: "Team Member",
      target: "Sarah Chen (emp-02)",
      desc: "Assigned Sarah Chen as Data Processing Specialist",
      status: "SUCCESS",
      time: "2 Sep 2026 5:58pm",
    },
    {
      id: "act-4",
      user: "Vikram Malhotra",
      role: "Admin",
      type: "ATTACHMENT_UPLOAD",
      entity: "Attachment",
      target: "BioTech_Alpha_Guidelines_v3.pdf",
      desc: "Uploaded client guideline document",
      status: "SUCCESS",
      time: "1 Aug 2026 10:30am",
    },
  ]);

  const [auditDiffs, setAuditDiffs] = useState([
    {
      field: "Client Email",
      oldVal: "biotech@old.com",
      newVal: project.clientEmail || "biotech.client@biotech-global.com",
      user: "Vikram Malhotra",
      date: "1 Sep 2026 11:20am",
    },
    {
      field: "Project Status",
      oldVal: "CREATED",
      newVal: "IN_PROGRESS",
      user: "Vikram Malhotra",
      date: "25 Aug 2026 7:30pm",
    },
  ]);

  const handleAttachmentFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    const timeNow = formatDashboardDate();
    const newItems = files.map((file, idx) => ({
      id: `att-${Date.now()}-${idx}`,
      name: file.name,
      type: file.type
        ? file.type.split("/")[1]?.toUpperCase() || "FILE"
        : "DOCUMENT",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      attachedAt: timeNow,
    }));
    setClientAttachments((prev) => [...newItems, ...prev]);

    newItems.forEach((item) => {
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}-${Math.random()}`,
          user: "Vikram Malhotra",
          role: "Admin",
          type: "ATTACHMENT_UPLOAD",
          entity: "Attachment",
          target: item.name,
          desc: `Uploaded client attachment ${item.name}`,
          status: "SUCCESS",
          time: timeNow,
        },
        ...prev,
      ]);
    });
  };

  const handleDeleteAttachment = (id: string) => {
    const targetDoc = clientAttachments.find((a) => a.id === id);
    setClientAttachments((prev) => prev.filter((a) => a.id !== id));
    if (targetDoc) {
      const timeNow = formatDashboardDate();
      setActivityLogs((prev) => [
        {
          id: `act-${Date.now()}`,
          user: "Vikram Malhotra",
          role: "Admin",
          type: "ATTACHMENT_DELETE",
          entity: "Attachment",
          target: targetDoc.name,
          desc: `Deleted client attachment ${targetDoc.name}`,
          status: "SUCCESS",
          time: timeNow,
        },
        ...prev,
      ]);
    }
  };

  const handleCreateBatchSubmit = () => {
    if (!batchName.trim()) return;

    const finalRecordType =
      recordType === "Other" ? customRecordType.trim() || "Other" : recordType;

    const timeNow = formatDashboardDate();

    const newBatch = {
      id: batchId,
      name: batchName,
      type: finalRecordType,
      lang: batchLanguage,
      sourceType: sourceType,
      sourceUnits: totalSourceUnits,
      status: "CREATED",
      lastUpdated: timeNow,
    };

    setDpBatches((prev) => [newBatch, ...prev]);
    setIsCreateBatchOpen(false);

    setActivityLogs((prev) => [
      {
        id: `act-${Date.now()}`,
        user: "Vikram Malhotra",
        role: "Admin",
        type: "BATCH_CREATE",
        entity: "Batch",
        target: batchId,
        desc: `Created batch ${batchName} (${finalRecordType})`,
        status: "SUCCESS",
        time: timeNow,
      },
      ...prev,
    ]);
  };

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
    if (isFullProfileView) {
      const activeMemberName = viewingMember?.name || "Mathan Kumar";
      const activeMemberCode = viewingMember?.employeeCode || "EMP-001";
      const activeMemberInitials = viewingMember?.initials || "MK";
      const activeMemberRole =
        viewingMember?.roleDesignation || "Senior Processing Specialist";
      const activeMemberEmail =
        viewingMember?.email ||
        `${activeMemberName.toLowerCase().replace(/\s+/g, ".")}@epd-erp.io`;
      const activeMemberJoining =
        viewingMember?.joiningDate || "January 10, 2024";
      const nameParts = activeMemberName.split(" ");
      const firstName = nameParts[0] || "Mathan";
      const lastName = nameParts.slice(1).join(" ") || "Kumar";

      return (
        <div className="bg-background text-foreground flex min-h-screen flex-col">
          {/* HEADER BAR */}
          <div className="border-border bg-card sticky top-0 z-20 border-b p-4 shadow-xs sm:px-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsFullProfileView(false)}
                className="bg-secondary text-secondary-foreground border-border cursor-pointer gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Project Team
              </Button>
              <Badge className="bg-primary/10 text-primary border-primary/20 border text-xs font-semibold">
                Employee Profile Overview
              </Badge>
            </div>
          </div>

          <div className="w-full flex-1 space-y-6 p-4 sm:p-6">
            {/* HEADER CARD */}
            <Card className="bg-card border-border space-y-5 rounded-xl p-5 shadow-xs">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3.5">
                  <div className="bg-primary/10 text-primary border-primary/20 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-base font-bold">
                    {activeMemberInitials}
                    <span className="border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h2 className="text-foreground text-xl font-bold">
                        {activeMemberName}
                      </h2>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                        Active
                      </span>
                    </div>
                    <span className="text-muted-foreground pt-0.5 text-xs font-medium">
                      {activeMemberCode} &bull; Data Processing &bull;{" "}
                      {activeMemberRole}
                    </span>
                  </div>
                </div>

                <div className="border-primary/20 bg-primary/10 text-primary inline-flex items-center gap-2 self-start rounded-full border px-3 py-1.5 text-xs font-bold sm:self-auto">
                  <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                    RATING
                  </span>
                  <span>EXCELLENT</span>
                </div>
              </div>

              {/* TABS HEADER */}
              <div className="border-border flex items-center gap-6 border-t pt-3 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setProfileTab("overview")}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                    profileTab === "overview"
                      ? "border-primary text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground border-transparent",
                  )}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setProfileTab("performance");
                    const now = new Date();
                    setProdCalDate({
                      year: now.getFullYear(),
                      month: now.getMonth(),
                      day: now.getDate(),
                    });
                    setQcCalDate({
                      year: now.getFullYear(),
                      month: now.getMonth(),
                      day: now.getDate(),
                    });
                  }}
                  className={cn(
                    "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                    profileTab === "performance"
                      ? "border-primary text-primary font-bold"
                      : "text-muted-foreground hover:text-foreground border-transparent",
                  )}
                >
                  Performance
                </button>
              </div>
            </Card>

            {/* TAB CONTENT: OVERVIEW */}
            {profileTab === "overview" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* CARD 1: PERSONAL INFORMATION */}
                  <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                    <div className="border-border flex items-center gap-2 border-b pb-3">
                      <User className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                        Personal Information
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          First Name
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          {firstName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Last Name
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          {lastName}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Email Address
                        </span>
                        <a
                          href={`mailto:${activeMemberEmail}`}
                          className="text-primary text-xs font-semibold hover:underline"
                        >
                          {activeMemberEmail}
                        </a>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Phone Number
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          +91 98450 12345
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Gender
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          Male
                        </span>
                      </div>
                    </div>
                  </Card>

                  {/* CARD 2: EMPLOYMENT INFORMATION */}
                  <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                    <div className="border-border flex items-center gap-2 border-b pb-3">
                      <Building2 className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                        Employment Information
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Employee Code
                        </span>
                        <span className="text-foreground font-mono text-xs font-bold">
                          {activeMemberCode}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Department
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          Data Processing
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Joining Date
                        </span>
                        <span className="text-foreground text-xs font-bold">
                          {activeMemberJoining}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground mb-1 block text-xs font-medium">
                          Employment Status
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                          Active Full-time
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* CARD 3: WORK CAPABILITIES & ELIGIBILITY */}
                <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                  <div className="border-border flex items-center justify-between border-b pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                        Work Capabilities & Eligibility
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs font-normal">
                      Read-only operational profile
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* PRODUCTION STREAM */}
                    <div className="bg-secondary/40 border-border space-y-3 rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-xs font-bold">
                          Production Work Stream
                        </span>
                        <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                          Eligible
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                        <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                        <span>
                          ✓ Eligible for Production Work (Annotation,
                          Conversion, Tagging)
                        </span>
                      </div>
                    </div>

                    {/* QC STREAM */}
                    <div className="bg-secondary/40 border-border space-y-3 rounded-xl border p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-foreground text-xs font-bold">
                          Quality Control (QC) Stream
                        </span>
                        <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                          Eligible
                        </span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
                        <CheckCircle2 className="text-primary h-4 w-4 shrink-0" />
                        <span>
                          ✓ Eligible for Quality Control Work (Audit, Sampling,
                          Verification)
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 2 NEW CARDS: EMPLOYEE COMPLETED PROJECTS & CURRENT WORKING PROJECTS */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {/* CARD 4: EMPLOYEE COMPLETED PROJECTS */}
                  <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                    <div className="border-border flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                          Employee Completed Projects
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="border-emerald-500/30 bg-emerald-500/10 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
                      >
                        2 Completed
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {/* Completed Project 1 */}
                      <div className="bg-secondary/40 border-border space-y-2.5 rounded-xl border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-foreground text-xs font-bold">
                              BioTech Medical Annotation
                            </h5>
                            <span className="text-muted-foreground font-mono text-[10px]">
                              PRJ-002 &bull; Data Processing
                            </span>
                          </div>
                          <Badge className="border border-emerald-500/30 bg-emerald-500/15 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Completed
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Role
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              Senior Processing Specialist
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Duration
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              Jan 2026 – Jul 2026
                            </span>
                          </div>
                        </div>
                        <div className="border-border/60 space-y-1 border-t pt-1">
                          <div className="text-muted-foreground flex justify-between text-[10px]">
                            <span>Completion Rate</span>
                            <span className="text-foreground font-bold">
                              100%
                            </span>
                          </div>
                          <Progress value={100} className="h-1.5" />
                        </div>
                      </div>

                      {/* Completed Project 2 */}
                      <div className="bg-secondary/40 border-border space-y-2.5 rounded-xl border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h5 className="text-foreground text-xs font-bold">
                              Global Logistics OCR Conversion
                            </h5>
                            <span className="text-muted-foreground font-mono text-[10px]">
                              PRJ-003 &bull; Data Processing
                            </span>
                          </div>
                          <Badge className="border border-emerald-500/30 bg-emerald-500/15 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            ✓ Completed
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Role
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              QC & Processing Specialist
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Duration
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              Oct 2025 – Apr 2026
                            </span>
                          </div>
                        </div>
                        <div className="border-border/60 space-y-1 border-t pt-1">
                          <div className="text-muted-foreground flex justify-between text-[10px]">
                            <span>Completion Rate</span>
                            <span className="text-foreground font-bold">
                              100%
                            </span>
                          </div>
                          <Progress value={100} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* CARD 5: CURRENT WORKING PROJECTS */}
                  <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                    <div className="border-border flex items-center justify-between border-b pb-3">
                      <div className="flex items-center gap-2">
                        <Briefcase className="text-primary h-4 w-4" />
                        <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                          Current Working Projects
                        </span>
                      </div>
                      <Badge className="border-primary/20 bg-primary/10 text-primary border text-[11px] font-semibold">
                        1 Active Assignment
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      {/* Active Project 1 */}
                      <div className="bg-secondary/40 border-primary/30 relative space-y-2.5 rounded-xl border p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h5 className="text-foreground text-xs font-bold">
                                {project.name || "Alpha Vision Segmentation"}
                              </h5>
                              <span className="py-0.2 bg-primary/15 text-primary border-primary/25 inline-flex items-center rounded border px-1.5 text-[9px] font-bold">
                                Primary
                              </span>
                            </div>
                            <span className="text-muted-foreground font-mono text-[10px]">
                              {project.code || "PRJ-001"} &bull; Data Processing
                            </span>
                          </div>
                          <Badge className="border border-blue-500/30 bg-blue-500/15 text-[10px] font-semibold text-blue-600 dark:text-blue-400">
                            In Progress
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Role
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              {activeMemberRole}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground block text-[10px]">
                              Duration
                            </span>
                            <span className="text-foreground text-[11px] font-semibold">
                              {project.periodStart || "Aug 1, 2026"} –{" "}
                              {project.periodEnd || "Dec 31, 2026"}
                            </span>
                          </div>
                        </div>
                        <div className="border-border/60 space-y-1 border-t pt-1">
                          <div className="text-muted-foreground flex justify-between text-[10px]">
                            <span>Project Progress</span>
                            <span className="text-foreground font-bold">
                              {project.progress || 45}%
                            </span>
                          </div>
                          <Progress
                            value={project.progress || 45}
                            className="h-1.5"
                          />
                        </div>
                      </div>

                      {/* Project info note */}
                      <div className="border-border bg-card flex items-center justify-between rounded-lg border p-3 text-xs">
                        <span className="text-muted-foreground text-[11px]">
                          Shift & Allocation
                        </span>
                        <span className="text-foreground text-[11px] font-semibold">
                          Morning Shift &bull; Full-time (40 hrs/wk)
                        </span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* TAB CONTENT: PERFORMANCE */}
            {profileTab === "performance" && (
              <div className="space-y-6">
                {/* PROJECT FILTER SECTION */}
                <Card className="bg-card border-border rounded-xl p-4 shadow-xs">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border">
                        <Filter className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                            Project Filter
                          </span>
                          <Badge
                            variant="outline"
                            className="border-border text-[10px] font-semibold"
                          >
                            {activePerfMetrics.code}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-xs">
                          Filter employee performance metrics and records output
                          by assigned project.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Label
                        htmlFor="project-filter-select"
                        className="text-muted-foreground text-xs font-medium whitespace-nowrap"
                      >
                        Select Project:
                      </Label>
                      <Select
                        value={selectedPerfProject}
                        onValueChange={(val) => {
                          setSelectedPerfProject(val);
                          setHoveredProdMonthIdx(getProjectBestMonthIdx(val));
                          setHoveredQcMonthIdx(getProjectBestMonthIdx(val));
                        }}
                      >
                        <SelectTrigger
                          id="project-filter-select"
                          className="bg-background border-border h-9 w-full cursor-pointer rounded-lg text-xs font-semibold sm:w-64"
                        >
                          <SelectValue placeholder="All Projects (Combined)" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          <SelectItem
                            value="all"
                            className="text-xs font-semibold"
                          >
                            All Projects (Combined)
                          </SelectItem>
                          <SelectItem
                            value="prj-01"
                            className="text-xs font-semibold"
                          >
                            Alpha Vision Segmentation (PRJ-001)
                          </SelectItem>
                          <SelectItem
                            value="prj-02"
                            className="text-xs font-semibold"
                          >
                            BioTech Medical Annotation (PRJ-002)
                          </SelectItem>
                          <SelectItem
                            value="prj-03"
                            className="text-xs font-semibold"
                          >
                            Global Logistics OCR Conversion (PRJ-003)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* SUB-TABS */}
                <div className="border-border flex items-center gap-6 border-b pb-2 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setPerfSubTab("production")}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                      perfSubTab === "production"
                        ? "border-primary text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground border-transparent",
                    )}
                  >
                    <Briefcase className="h-4 w-4" /> Production Performance
                  </button>
                  <button
                    type="button"
                    onClick={() => setPerfSubTab("qc")}
                    className={cn(
                      "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                      perfSubTab === "qc"
                        ? "border-primary text-primary font-bold"
                        : "text-muted-foreground hover:text-foreground border-transparent",
                    )}
                  >
                    <ShieldCheck className="h-4 w-4" /> QC Performance
                  </button>
                </div>

                {perfSubTab === "production" ? (
                  /* ==================== PRODUCTION PERFORMANCE ==================== */
                  <div className="space-y-6">
                    {/* 4 SUMMARY CARDS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* CARD 1 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            TOTAL RECORDS
                          </span>
                          <FileText className="text-primary h-4 w-4" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.prod.totalRecords}
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          Production completed records
                        </span>
                      </Card>

                      {/* CARD 2 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            MONTHLY AVG RECORDS
                          </span>
                          <TrendingUp className="text-primary h-4 w-4" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.prod.monthlyAvg}
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          Average per active month
                        </span>
                      </Card>

                      {/* CARD 3 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            BEST MONTH
                          </span>
                          <Award className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.prod.bestMonth}
                        </div>
                        <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {activePerfMetrics.prod.bestRecords}
                        </span>
                      </Card>

                      {/* CARD 4 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            MONTHS ACTIVE
                          </span>
                          <Calendar className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-foreground font-mono text-xl font-extrabold">
                            {activePerfMetrics.prod.monthsActive}
                          </span>
                          <span className="text-muted-foreground text-xs font-semibold">
                            Months
                          </span>
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          Consistent activity logged
                        </span>
                      </Card>
                    </div>

                    {/* SELECT DATE */}
                    <div className="space-y-2">
                      <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        SELECT DATE
                      </h4>
                      <div
                        onClick={() => setIsProdDatePickerOpen((prev) => !prev)}
                        className={cn(
                          "bg-card flex max-w-sm cursor-pointer items-center justify-between rounded-xl border p-3 transition-all",
                          isProdDatePickerOpen
                            ? "border-primary ring-primary/20 ring-2"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <span className="text-foreground font-mono text-xs font-bold">
                          {formatDisplayDate(prodDateRange.start)} —{" "}
                          {formatDisplayDate(prodDateRange.end)}
                        </span>
                        <Calendar className="text-primary h-4 w-4" />
                      </div>

                      {/* DATE RANGE PICKER DROPDOWN */}
                      {isProdDatePickerOpen && (
                        <div className="pt-1">
                          <DateRangePicker
                            initialStart={prodDateRange.start}
                            initialEnd={prodDateRange.end}
                            onCancel={() => setIsProdDatePickerOpen(false)}
                            onApply={(start, end) => {
                              setProdDateRange({ start, end });
                              setIsProdDatePickerOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* RANGE OUTPUT SUMMARY */}
                    <Card className="bg-secondary/40 border-border flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                          RANGE OUTPUT SUMMARY (
                          {formatUpperDate(prodDateRange.start)} —{" "}
                          {formatUpperDate(prodDateRange.end)})
                        </h4>
                        <p className="text-muted-foreground text-xs font-medium">
                          Total Active Work Days:{" "}
                          <strong className="text-foreground font-bold">
                            {prodRangeStats.activeWorkDays} days
                          </strong>{" "}
                          &bull; Daily Average:{" "}
                          <strong className="text-foreground font-bold">
                            {prodRangeStats.dailyAvg} rec/day
                          </strong>
                        </p>
                      </div>
                      <div className="bg-card border-border flex items-center justify-center rounded-xl border px-5 py-3">
                        <span className="text-primary font-mono text-lg font-extrabold">
                          {Math.round(
                            prodRangeStats.totalRecords *
                              activePerfMetrics.scale,
                          ).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground pl-1.5 text-xs font-semibold">
                          Production Records
                        </span>
                      </div>
                    </Card>

                    {/* UPDATED AT */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Performance Updated At:
                      </span>
                      <span className="bg-secondary border-border text-foreground inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold">
                        6 Sep 2026 12:10pm
                      </span>
                    </div>

                    {/* MONTHLY PRODUCTION PERFORMANCE GRAPH */}
                    <Card className="bg-card border-border space-y-4 rounded-xl p-6 shadow-xs">
                      <div className="border-border flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Activity className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-sm font-bold">
                              Monthly Production Performance Graph
                            </h3>
                            <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                              Production
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            Total Production Records Completed per Month across
                            operational history.
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-primary h-3 w-3 rounded-full" />
                            <span className="text-muted-foreground">
                              Production Records (Bars)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-foreground h-0.5 w-4" />
                            <span className="text-muted-foreground">
                              Trend Line
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SVG GRAPH */}
                      <div className="w-full overflow-x-auto pt-2">
                        <div className="relative h-[260px] min-w-[700px]">
                          <svg className="h-full w-full" viewBox="0 0 850 240">
                            {/* Grid Lines */}
                            <line
                              x1="20"
                              y1="40"
                              x2="830"
                              y2="40"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="90"
                              x2="830"
                              y2="90"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="140"
                              x2="830"
                              y2="140"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="190"
                              x2="830"
                              y2="190"
                              stroke="currentColor"
                              className="text-border"
                              opacity="0.6"
                            />

                            {/* Monthly Bars */}
                            {currentProdMonthlyData.map((m, idx) => {
                              const x = 35 + idx * 46;
                              const height = m.val;
                              const y = 190 - height;
                              const isHovered = idx === hoveredProdMonthIdx;
                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer"
                                  onMouseEnter={() =>
                                    setHoveredProdMonthIdx(idx)
                                  }
                                  onClick={() => setHoveredProdMonthIdx(idx)}
                                >
                                  {/* Transparent Hitbox for easy hover/tap */}
                                  <rect
                                    x={x - 22}
                                    y={0}
                                    width={44}
                                    height={240}
                                    fill="transparent"
                                  />
                                  <rect
                                    x={x - 14}
                                    y={y}
                                    width={28}
                                    height={height}
                                    rx={6}
                                    fill={
                                      m.best ? "#f59e0b" : "hsl(var(--primary))"
                                    }
                                    opacity={m.best ? 1 : isHovered ? 1 : 0.85}
                                    className="transition-opacity duration-150"
                                  />
                                  <text
                                    x={x}
                                    y={212}
                                    fill={
                                      m.best
                                        ? "#d97706"
                                        : isHovered
                                          ? "hsl(var(--primary))"
                                          : "currentColor"
                                    }
                                    className={cn(
                                      "text-[9px] transition-all duration-150",
                                      isHovered || m.best
                                        ? "font-extrabold"
                                        : "text-muted-foreground font-bold",
                                    )}
                                    textAnchor="end"
                                    transform={`rotate(-90 ${x} 212)`}
                                  >
                                    {m.label}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Smooth Continuous Trend Line Curve */}
                            <path
                              d={prodTrendPath}
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Trend Points */}
                            {prodTrendPoints.map((pt, i) => {
                              const isHovered = i === hoveredProdMonthIdx;
                              const isBest = currentProdMonthlyData[i]?.best;
                              return (
                                <g
                                  key={i}
                                  className="cursor-pointer transition-all duration-150"
                                  onMouseEnter={() => setHoveredProdMonthIdx(i)}
                                  onClick={() => setHoveredProdMonthIdx(i)}
                                >
                                  {isHovered ? (
                                    <>
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="6.5"
                                        fill={
                                          isBest
                                            ? "#f59e0b"
                                            : "hsl(var(--primary))"
                                        }
                                      />
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="3"
                                        fill="#ffffff"
                                      />
                                    </>
                                  ) : (
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r="3.5"
                                      fill="#ffffff"
                                      stroke="hsl(var(--primary))"
                                      strokeWidth="2"
                                    />
                                  )}
                                </g>
                              );
                            })}

                            {/* Interactive Tooltip */}
                            {hoveredProdMonthIdx >= 0 &&
                              hoveredProdMonthIdx <
                                currentProdMonthlyData.length &&
                              (() => {
                                const activeData =
                                  currentProdMonthlyData[hoveredProdMonthIdx];
                                const activePt =
                                  prodTrendPoints[hoveredProdMonthIdx];
                                if (!activeData || !activePt) return null;
                                const tooltipWidth = 138;
                                const tooltipHeight = 40;
                                const tooltipX = Math.max(
                                  tooltipWidth / 2 + 10,
                                  Math.min(
                                    850 - tooltipWidth / 2 - 10,
                                    activePt.x,
                                  ),
                                );
                                const tooltipY = Math.max(
                                  10,
                                  activePt.y - tooltipHeight - 12,
                                );
                                const caretTipY = tooltipY + tooltipHeight + 6;

                                return (
                                  <g className="pointer-events-none drop-shadow-md filter transition-all duration-150">
                                    <rect
                                      x={tooltipX - tooltipWidth / 2}
                                      y={tooltipY}
                                      width={tooltipWidth}
                                      height={tooltipHeight}
                                      rx={8}
                                      fill="#0f172a"
                                    />
                                    <polygon
                                      points={`${activePt.x - 5},${tooltipY + tooltipHeight} ${activePt.x + 5},${tooltipY + tooltipHeight} ${activePt.x},${caretTipY}`}
                                      fill="#0f172a"
                                    />
                                    <text
                                      x={tooltipX}
                                      y={tooltipY + 15}
                                      textAnchor="middle"
                                      fill="#94a3b8"
                                      fontSize="10"
                                      fontWeight="600"
                                    >
                                      {activeData.label}
                                    </text>
                                    <text
                                      x={tooltipX}
                                      y={tooltipY + 31}
                                      textAnchor="middle"
                                      fill={
                                        activeData.best ? "#fbbf24" : "#ffffff"
                                      }
                                      fontSize="11"
                                      fontWeight="700"
                                    >
                                      {activeData.records}
                                    </text>
                                  </g>
                                );
                              })()}
                          </svg>
                        </div>
                      </div>
                    </Card>

                    {/* DAILY CALENDAR & HOURLY BREAKDOWN */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* DAILY PRODUCTION CALENDAR */}
                      <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                        <div className="border-border flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                              Daily Production Calendar
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer rounded-md"
                              onClick={handlePrevProdCalMonth}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-foreground text-xs font-bold">
                              {new Date(
                                prodCalDate.year,
                                prodCalDate.month,
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer rounded-md"
                              onClick={handleNextProdCalMonth}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* CALENDAR GRID */}
                        <div className="space-y-2">
                          <div className="text-muted-foreground grid grid-cols-7 text-center text-[10px] font-bold tracking-wider uppercase">
                            <div>SUN</div>
                            <div>MON</div>
                            <div>TUE</div>
                            <div>WED</div>
                            <div>THU</div>
                            <div>FRI</div>
                            <div>SAT</div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            {Array.from({ length: prodFirstDayOfMonth }).map(
                              (_, i) => (
                                <div key={`empty-${i}`} className="h-16" />
                              ),
                            )}

                            {Array.from(
                              { length: prodDaysInMonth },
                              (_, i) => i + 1,
                            ).map((d) => {
                              const dayRecs = getDayRecords(
                                prodCalDate.year,
                                prodCalDate.month,
                                d,
                                "production",
                                selectedPerfProject,
                              );
                              const isSelected = prodCalDate.day === d;
                              const now = new Date();
                              const isToday =
                                prodCalDate.year === now.getFullYear() &&
                                prodCalDate.month === now.getMonth() &&
                                d === now.getDate();

                              if (isToday) {
                                return (
                                  <button
                                    type="button"
                                    key={d}
                                    onClick={() =>
                                      setProdCalDate((prev) => ({
                                        ...prev,
                                        day: d,
                                      }))
                                    }
                                    className={cn(
                                      "flex h-16 cursor-pointer flex-col justify-between rounded-xl border border-amber-300 bg-amber-50/60 p-1.5 text-left transition-all dark:border-amber-700 dark:bg-amber-950/20",
                                      isSelected
                                        ? "ring-2 ring-amber-500/40"
                                        : "",
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                                        {d}
                                      </span>
                                      <span className="rounded bg-amber-200 px-1 text-[8px] font-extrabold text-amber-800 uppercase dark:bg-amber-900 dark:text-amber-200">
                                        TODAY
                                      </span>
                                    </div>
                                    <div className="text-right font-mono text-[11px] font-bold text-amber-900 dark:text-amber-300">
                                      {dayRecs}{" "}
                                      <span className="text-muted-foreground text-[9px] font-normal">
                                        rec
                                      </span>
                                    </div>
                                  </button>
                                );
                              }

                              if (dayRecs > 0) {
                                return (
                                  <button
                                    type="button"
                                    key={d}
                                    onClick={() =>
                                      setProdCalDate((prev) => ({
                                        ...prev,
                                        day: d,
                                      }))
                                    }
                                    className={cn(
                                      "flex h-16 cursor-pointer flex-col justify-between rounded-xl border p-1.5 text-left transition-all",
                                      isSelected
                                        ? "border-primary bg-primary/10 ring-primary/30 font-bold ring-2"
                                        : "border-border hover:bg-secondary/40",
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-foreground text-xs font-bold">
                                        {d}
                                      </span>
                                      <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                                    </div>
                                    <div className="text-primary text-right font-mono text-[11px] font-extrabold">
                                      {dayRecs}{" "}
                                      <span className="text-muted-foreground text-[9px] font-normal">
                                        rec
                                      </span>
                                    </div>
                                  </button>
                                );
                              }

                              return (
                                <button
                                  type="button"
                                  key={d}
                                  onClick={() =>
                                    setProdCalDate((prev) => ({
                                      ...prev,
                                      day: d,
                                    }))
                                  }
                                  className={cn(
                                    "flex h-16 cursor-pointer flex-col justify-between rounded-xl border p-1.5 text-left transition-all",
                                    isSelected
                                      ? "border-primary bg-primary/10 ring-primary/30 font-bold opacity-100 ring-2"
                                      : "border-border/60 bg-card hover:bg-secondary/30 opacity-70",
                                  )}
                                >
                                  <span className="text-muted-foreground text-xs font-medium">
                                    {d}
                                  </span>
                                  <div className="text-muted-foreground text-right font-mono text-[10px]">
                                    0 <span className="text-[9px]">rec</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </Card>

                      {/* PRODUCTION HOURLY BREAKDOWN */}
                      <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                        <div className="border-border flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                              Production Hourly Breakdown
                            </h3>
                          </div>
                          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {prodCalDate.day}{" "}
                            {new Date(
                              prodCalDate.year,
                              prodCalDate.month,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                            })}{" "}
                            {prodCalDate.year}
                          </span>
                        </div>

                        {/* SUMMARY BOX */}
                        <div className="bg-secondary/40 border-border flex items-center justify-between rounded-xl border p-4">
                          <div className="space-y-1">
                            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                              DAY TOTAL PRODUCTION (9:00 AM - 6:00 PM)
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-foreground font-mono text-2xl font-extrabold">
                                {prodSelectedDayRecs}
                              </span>
                              <span className="text-muted-foreground text-xs font-semibold">
                                Records
                              </span>
                            </div>
                          </div>
                          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                            <Zap className="h-5 w-5" />
                          </div>
                        </div>

                        {/* SLOTS TABLE */}
                        <div className="space-y-3 pt-1">
                          <div className="text-muted-foreground border-border/60 flex items-center justify-between border-b pb-1.5 text-[11px] font-bold tracking-wider uppercase">
                            <span>WORKING HOUR SLOT</span>
                            <span>PRODUCTION RECORDS</span>
                          </div>

                          <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
                            {prodHourlySlots.map((row, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-foreground font-medium">
                                    {row.slot}
                                  </span>
                                  <span className="text-foreground font-mono font-bold">
                                    {row.recs} records
                                  </span>
                                </div>
                                <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                                  <div
                                    className="bg-primary h-full rounded-full transition-all duration-300"
                                    style={{ width: `${row.pct}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-muted-foreground pt-1 text-center text-[11px] italic">
                            Showing hourly distribution within standard 9:00 AM
                            to 6:00 PM shift.
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                ) : (
                  /* ==================== QC PERFORMANCE ==================== */
                  <div className="space-y-6">
                    {/* 4 SUMMARY CARDS */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {/* CARD 1 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            TOTAL QC CHECKED
                          </span>
                          <ShieldCheck className="text-primary h-4 w-4" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.qc.totalRecords}
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          QC verified volume
                        </span>
                      </Card>

                      {/* CARD 2 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            MONTHLY AVG QC CHECKED
                          </span>
                          <TrendingUp className="text-primary h-4 w-4" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.qc.monthlyAvg}
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          Average QC per active month
                        </span>
                      </Card>

                      {/* CARD 3 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            BEST MONTH
                          </span>
                          <Award className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-foreground font-mono text-xl font-extrabold">
                          {activePerfMetrics.qc.bestMonth}
                        </div>
                        <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          {activePerfMetrics.qc.bestRecords}
                        </span>
                      </Card>

                      {/* CARD 4 */}
                      <Card className="bg-card border-border space-y-2 rounded-xl p-4 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                            MONTHS ACTIVE
                          </span>
                          <Calendar className="text-primary h-4 w-4" />
                        </div>
                        <div className="flex items-baseline gap-1">
                          <span className="text-foreground font-mono text-xl font-extrabold">
                            {activePerfMetrics.qc.monthsActive}
                          </span>
                          <span className="text-muted-foreground text-xs font-semibold">
                            Months
                          </span>
                        </div>
                        <span className="text-muted-foreground block text-[11px]">
                          Consistent activity logged
                        </span>
                      </Card>
                    </div>

                    {/* SELECT DATE */}
                    <div className="space-y-2">
                      <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        SELECT DATE
                      </h4>
                      <div
                        onClick={() => setIsQcDatePickerOpen((prev) => !prev)}
                        className={cn(
                          "bg-card flex max-w-sm cursor-pointer items-center justify-between rounded-xl border p-3 transition-all",
                          isQcDatePickerOpen
                            ? "border-primary ring-primary/20 ring-2"
                            : "border-border hover:border-primary/50",
                        )}
                      >
                        <span className="text-foreground font-mono text-xs font-bold">
                          {formatDisplayDate(qcDateRange.start)} —{" "}
                          {formatDisplayDate(qcDateRange.end)}
                        </span>
                        <Calendar className="text-primary h-4 w-4" />
                      </div>

                      {/* DATE RANGE PICKER DROPDOWN */}
                      {isQcDatePickerOpen && (
                        <div className="pt-1">
                          <DateRangePicker
                            initialStart={qcDateRange.start}
                            initialEnd={qcDateRange.end}
                            onCancel={() => setIsQcDatePickerOpen(false)}
                            onApply={(start, end) => {
                              setQcDateRange({ start, end });
                              setIsQcDatePickerOpen(false);
                            }}
                          />
                        </div>
                      )}
                    </div>

                    {/* RANGE OUTPUT SUMMARY */}
                    <Card className="bg-secondary/40 border-border flex flex-col justify-between gap-4 rounded-xl border p-5 shadow-xs sm:flex-row sm:items-center">
                      <div className="space-y-1">
                        <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                          RANGE OUTPUT SUMMARY (
                          {formatUpperDate(qcDateRange.start)} —{" "}
                          {formatUpperDate(qcDateRange.end)})
                        </h4>
                        <p className="text-muted-foreground text-xs font-medium">
                          Total Active Work Days:{" "}
                          <strong className="text-foreground font-bold">
                            {qcRangeStats.activeWorkDays} days
                          </strong>{" "}
                          &bull; Daily Average:{" "}
                          <strong className="text-foreground font-bold">
                            {qcRangeStats.dailyAvg} rec/day
                          </strong>
                        </p>
                      </div>
                      <div className="bg-card border-border flex items-center justify-center rounded-xl border px-5 py-3">
                        <span className="text-primary font-mono text-lg font-extrabold">
                          {Math.round(
                            qcRangeStats.totalRecords * activePerfMetrics.scale,
                          ).toLocaleString()}
                        </span>
                        <span className="text-muted-foreground pl-1.5 text-xs font-semibold">
                          QC Records
                        </span>
                      </div>
                    </Card>

                    {/* UPDATED AT */}
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        Performance Updated At:
                      </span>
                      <span className="bg-secondary border-border text-foreground inline-flex items-center rounded-full border px-3 py-1 font-mono text-xs font-semibold">
                        6 Sep 2026 12:10pm
                      </span>
                    </div>

                    {/* MONTHLY QC PERFORMANCE GRAPH */}
                    <Card className="bg-card border-border space-y-4 rounded-xl p-6 shadow-xs">
                      <div className="border-border flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Activity className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-sm font-bold">
                              Monthly QC Performance Graph
                            </h3>
                            <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                              QC Verified
                            </span>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            Total QC Checked Records Completed per Month across
                            operational history.
                          </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium">
                          <div className="flex items-center gap-1.5">
                            <span className="bg-primary h-3 w-3 rounded-full" />
                            <span className="text-muted-foreground">
                              QC Checked (Bars)
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="bg-primary h-0.5 w-4" />
                            <span className="text-muted-foreground">
                              QC Trend Line
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* SVG GRAPH */}
                      <div className="w-full overflow-x-auto pt-2">
                        <div className="relative h-[260px] min-w-[700px]">
                          <svg className="h-full w-full" viewBox="0 0 850 240">
                            {/* Grid Lines */}
                            <line
                              x1="20"
                              y1="40"
                              x2="830"
                              y2="40"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="90"
                              x2="830"
                              y2="90"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="140"
                              x2="830"
                              y2="140"
                              stroke="currentColor"
                              className="text-border"
                              strokeDasharray="3 3"
                              opacity="0.4"
                            />
                            <line
                              x1="20"
                              y1="190"
                              x2="830"
                              y2="190"
                              stroke="currentColor"
                              className="text-border"
                              opacity="0.6"
                            />

                            {/* Monthly Bars */}
                            {currentQcMonthlyData.map((m, idx) => {
                              const x = 35 + idx * 46;
                              const height = m.val;
                              const y = 190 - height;
                              const isHovered = idx === hoveredQcMonthIdx;
                              return (
                                <g
                                  key={idx}
                                  className="cursor-pointer"
                                  onMouseEnter={() => setHoveredQcMonthIdx(idx)}
                                  onClick={() => setHoveredQcMonthIdx(idx)}
                                >
                                  {/* Transparent Hitbox for easy hover/tap */}
                                  <rect
                                    x={x - 22}
                                    y={0}
                                    width={44}
                                    height={240}
                                    fill="transparent"
                                  />
                                  <rect
                                    x={x - 14}
                                    y={y}
                                    width={28}
                                    height={height}
                                    rx={6}
                                    fill={
                                      m.best ? "#f59e0b" : "hsl(var(--primary))"
                                    }
                                    opacity={m.best ? 1 : isHovered ? 1 : 0.85}
                                    className="transition-opacity duration-150"
                                  />
                                  <text
                                    x={x}
                                    y={212}
                                    fill={
                                      m.best
                                        ? "#d97706"
                                        : isHovered
                                          ? "hsl(var(--primary))"
                                          : "currentColor"
                                    }
                                    className={cn(
                                      "text-[9px] transition-all duration-150",
                                      isHovered || m.best
                                        ? "font-extrabold"
                                        : "text-muted-foreground font-bold",
                                    )}
                                    textAnchor="end"
                                    transform={`rotate(-90 ${x} 212)`}
                                  >
                                    {m.label}
                                  </text>
                                </g>
                              );
                            })}

                            {/* Smooth Continuous Trend Line Curve */}
                            <path
                              d={qcTrendPath}
                              fill="none"
                              stroke="hsl(var(--primary))"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />

                            {/* Trend Points */}
                            {qcTrendPoints.map((pt, i) => {
                              const isHovered = i === hoveredQcMonthIdx;
                              const isBest = currentQcMonthlyData[i]?.best;
                              return (
                                <g
                                  key={i}
                                  className="cursor-pointer transition-all duration-150"
                                  onMouseEnter={() => setHoveredQcMonthIdx(i)}
                                  onClick={() => setHoveredQcMonthIdx(i)}
                                >
                                  {isHovered ? (
                                    <>
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="6.5"
                                        fill={
                                          isBest
                                            ? "#f59e0b"
                                            : "hsl(var(--primary))"
                                        }
                                      />
                                      <circle
                                        cx={pt.x}
                                        cy={pt.y}
                                        r="3"
                                        fill="#ffffff"
                                      />
                                    </>
                                  ) : (
                                    <circle
                                      cx={pt.x}
                                      cy={pt.y}
                                      r="3.5"
                                      fill="#ffffff"
                                      stroke="hsl(var(--primary))"
                                      strokeWidth="2"
                                    />
                                  )}
                                </g>
                              );
                            })}

                            {/* Interactive Tooltip */}
                            {hoveredQcMonthIdx >= 0 &&
                              hoveredQcMonthIdx < currentQcMonthlyData.length &&
                              (() => {
                                const activeData =
                                  currentQcMonthlyData[hoveredQcMonthIdx];
                                const activePt =
                                  qcTrendPoints[hoveredQcMonthIdx];
                                if (!activeData || !activePt) return null;
                                const tooltipWidth = 142;
                                const tooltipHeight = 40;
                                const tooltipX = Math.max(
                                  tooltipWidth / 2 + 10,
                                  Math.min(
                                    850 - tooltipWidth / 2 - 10,
                                    activePt.x,
                                  ),
                                );
                                const tooltipY = Math.max(
                                  10,
                                  activePt.y - tooltipHeight - 12,
                                );
                                const caretTipY = tooltipY + tooltipHeight + 6;

                                return (
                                  <g className="pointer-events-none drop-shadow-md filter transition-all duration-150">
                                    <rect
                                      x={tooltipX - tooltipWidth / 2}
                                      y={tooltipY}
                                      width={tooltipWidth}
                                      height={tooltipHeight}
                                      rx={8}
                                      fill="#0f172a"
                                    />
                                    <polygon
                                      points={`${activePt.x - 5},${tooltipY + tooltipHeight} ${activePt.x + 5},${tooltipY + tooltipHeight} ${activePt.x},${caretTipY}`}
                                      fill="#0f172a"
                                    />
                                    <text
                                      x={tooltipX}
                                      y={tooltipY + 15}
                                      textAnchor="middle"
                                      fill="#94a3b8"
                                      fontSize="10"
                                      fontWeight="600"
                                    >
                                      {activeData.label}
                                    </text>
                                    <text
                                      x={tooltipX}
                                      y={tooltipY + 31}
                                      textAnchor="middle"
                                      fill={
                                        activeData.best ? "#fbbf24" : "#ffffff"
                                      }
                                      fontSize="11"
                                      fontWeight="700"
                                    >
                                      {activeData.records}
                                    </text>
                                  </g>
                                );
                              })()}
                          </svg>
                        </div>
                      </div>
                    </Card>

                    {/* DAILY CALENDAR & HOURLY BREAKDOWN */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                      {/* DAILY QC CALENDAR */}
                      <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                        <div className="border-border flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                              Daily QC Performance Calendar
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer rounded-md"
                              onClick={handlePrevQcCalMonth}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-foreground text-xs font-bold">
                              {new Date(
                                qcCalDate.year,
                                qcCalDate.month,
                              ).toLocaleDateString("en-US", {
                                month: "long",
                                year: "numeric",
                              })}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 cursor-pointer rounded-md"
                              onClick={handleNextQcCalMonth}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* CALENDAR GRID */}
                        <div className="space-y-2">
                          <div className="text-muted-foreground grid grid-cols-7 text-center text-[10px] font-bold tracking-wider uppercase">
                            <div>SUN</div>
                            <div>MON</div>
                            <div>TUE</div>
                            <div>WED</div>
                            <div>THU</div>
                            <div>FRI</div>
                            <div>SAT</div>
                          </div>
                          <div className="grid grid-cols-7 gap-1 text-xs">
                            {Array.from({ length: qcFirstDayOfMonth }).map(
                              (_, i) => (
                                <div key={`empty-${i}`} className="h-16" />
                              ),
                            )}

                            {Array.from(
                              { length: qcDaysInMonth },
                              (_, i) => i + 1,
                            ).map((d) => {
                              const dayRecs = getDayRecords(
                                qcCalDate.year,
                                qcCalDate.month,
                                d,
                                "qc",
                                selectedPerfProject,
                              );
                              const isSelected = qcCalDate.day === d;
                              const now = new Date();
                              const isToday =
                                qcCalDate.year === now.getFullYear() &&
                                qcCalDate.month === now.getMonth() &&
                                d === now.getDate();

                              if (isToday) {
                                return (
                                  <button
                                    type="button"
                                    key={d}
                                    onClick={() =>
                                      setQcCalDate((prev) => ({
                                        ...prev,
                                        day: d,
                                      }))
                                    }
                                    className={cn(
                                      "flex h-16 cursor-pointer flex-col justify-between rounded-xl border border-amber-300 bg-amber-50/60 p-1.5 text-left transition-all dark:border-amber-700 dark:bg-amber-950/20",
                                      isSelected
                                        ? "ring-2 ring-amber-500/40"
                                        : "",
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                                        {d}
                                      </span>
                                      <span className="rounded bg-amber-200 px-1 text-[8px] font-extrabold text-amber-800 uppercase dark:bg-amber-900 dark:text-amber-200">
                                        TODAY
                                      </span>
                                    </div>
                                    <div className="text-right font-mono text-[11px] font-bold text-amber-900 dark:text-amber-300">
                                      {dayRecs}{" "}
                                      <span className="text-muted-foreground text-[9px] font-normal">
                                        rec
                                      </span>
                                    </div>
                                  </button>
                                );
                              }

                              if (dayRecs > 0) {
                                return (
                                  <button
                                    type="button"
                                    key={d}
                                    onClick={() =>
                                      setQcCalDate((prev) => ({
                                        ...prev,
                                        day: d,
                                      }))
                                    }
                                    className={cn(
                                      "flex h-16 cursor-pointer flex-col justify-between rounded-xl border p-1.5 text-left transition-all",
                                      isSelected
                                        ? "border-primary bg-primary/10 ring-primary/30 font-bold ring-2"
                                        : "border-border hover:bg-secondary/40",
                                    )}
                                  >
                                    <div className="flex items-center justify-between">
                                      <span className="text-foreground text-xs font-bold">
                                        {d}
                                      </span>
                                      <span className="bg-primary h-1.5 w-1.5 rounded-full" />
                                    </div>
                                    <div className="text-primary text-right font-mono text-[11px] font-extrabold">
                                      {dayRecs}{" "}
                                      <span className="text-muted-foreground text-[9px] font-normal">
                                        rec
                                      </span>
                                    </div>
                                  </button>
                                );
                              }

                              return (
                                <button
                                  type="button"
                                  key={d}
                                  onClick={() =>
                                    setQcCalDate((prev) => ({
                                      ...prev,
                                      day: d,
                                    }))
                                  }
                                  className={cn(
                                    "flex h-16 cursor-pointer flex-col justify-between rounded-xl border p-1.5 text-left transition-all",
                                    isSelected
                                      ? "border-primary bg-primary/10 ring-primary/30 font-bold opacity-100 ring-2"
                                      : "border-border/60 bg-card hover:bg-secondary/30 opacity-70",
                                  )}
                                >
                                  <span className="text-muted-foreground text-xs font-medium">
                                    {d}
                                  </span>
                                  <div className="text-muted-foreground text-right font-mono text-[10px]">
                                    0 <span className="text-[9px]">rec</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </Card>

                      {/* DAILY QC PRODUCTIVITY BREAKDOWN */}
                      <Card className="bg-card border-border space-y-4 rounded-xl p-5 shadow-xs">
                        <div className="border-border flex items-center justify-between border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary h-4 w-4" />
                            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                              Daily QC Productivity Breakdown
                            </h3>
                          </div>
                          <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {qcCalDate.day}{" "}
                            {new Date(
                              qcCalDate.year,
                              qcCalDate.month,
                            ).toLocaleDateString("en-US", {
                              month: "long",
                            })}{" "}
                            {qcCalDate.year}
                          </span>
                        </div>

                        {/* SUMMARY BOX */}
                        <div className="bg-secondary/40 border-border flex items-center justify-between rounded-xl border p-4">
                          <div className="space-y-1">
                            <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                              DAY TOTAL QC OUTPUT (9:00 AM - 6:00 PM)
                            </span>
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-foreground font-mono text-2xl font-extrabold">
                                {qcSelectedDayRecs}
                              </span>
                              <span className="text-muted-foreground text-xs font-semibold">
                                QC Records
                              </span>
                            </div>
                          </div>
                          <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-full">
                            <Zap className="h-5 w-5" />
                          </div>
                        </div>

                        {/* SLOTS TABLE */}
                        <div className="space-y-3 pt-1">
                          <div className="text-muted-foreground border-border/60 flex items-center justify-between border-b pb-1.5 text-[11px] font-bold tracking-wider uppercase">
                            <span>WORKING HOUR SLOT</span>
                            <span>QC RECORDS</span>
                          </div>

                          <div className="max-h-[260px] space-y-2.5 overflow-y-auto pr-1">
                            {qcHourlySlots.map((row, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-foreground font-medium">
                                    {row.slot}
                                  </span>
                                  <span className="text-foreground font-mono font-bold">
                                    {row.recs} records
                                  </span>
                                </div>
                                <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                                  <div
                                    className="bg-primary h-full rounded-full transition-all duration-300"
                                    style={{ width: `${row.pct}%` }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-muted-foreground pt-1 text-center text-[11px] italic">
                            Showing hourly distribution within standard 9:00 AM
                            to 6:00 PM shift.
                          </p>
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }
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
                onClick={() => setDpTab("team")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 border-b-2 pb-2 whitespace-nowrap transition-all",
                  dpTab === "team"
                    ? "border-primary text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground border-transparent",
                )}
              >
                <Users className="h-4 w-4" />
                Project Team
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
                  onClick={openEditConfigModal}
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
                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Started at
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      6 Sep 2026 12:10pm
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created by
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {project.createdBy ||
                        project.managerName ||
                        "Vikram Malhotra"}
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Created at
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      6 Sep 2026 12:10pm
                    </span>
                  </div>

                  <div>
                    <span className="text-muted-foreground mb-1 block text-xs font-medium">
                      Last updated at
                    </span>
                    <span className="text-foreground text-xs font-bold">
                      {project.lastUpdated || "6 Sep 2026 12:10pm"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* TAB CONTENT 2: PROJECT TEAM */}
          {dpTab === "team" && (
            <div className="space-y-4">
              {/* TOP CONTEXT TEXT & ADD EMPLOYEE BUTTON */}
              <div className="flex flex-col justify-between gap-3 px-1 sm:flex-row sm:items-center">
                <p className="text-muted-foreground text-xs font-medium">
                  Active team roster and operational allocations for{" "}
                  <span className="text-foreground font-bold">
                    {project.name}
                  </span>
                  .
                </p>
                <Button
                  onClick={() => setIsAddEmployeeOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold shadow-xs transition-colors"
                >
                  <Plus className="h-4 w-4" /> Add Employee
                </Button>
              </div>

              {/* ROSTER TABLE CARD */}
              <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="border-border text-muted-foreground border-b bg-slate-50/80 text-[11px] font-bold tracking-wider uppercase dark:bg-slate-900/40">
                      <tr>
                        <th className="p-3.5 pl-6">EMPLOYEE</th>
                        <th className="p-3.5">TEAM ROLE DESIGNATION</th>
                        <th className="p-3.5">SHIFT</th>
                        <th className="p-3.5">WORK INVOLVEMENT</th>
                        <th className="p-3.5">LAST UPDATED</th>
                        <th className="p-3.5 pr-6 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {dpTeamRoster.map((member) => (
                        <tr
                          key={member.id}
                          className="hover:bg-secondary/40 transition-colors"
                        >
                          {/* Employee */}
                          <td className="p-3.5 pl-6">
                            <div className="flex items-center gap-3">
                              <div className="bg-primary/10 text-primary border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                                {member.initials}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-foreground text-xs font-bold">
                                  {member.name}
                                </span>
                                <span className="text-muted-foreground text-[11px]">
                                  {member.employeeCode}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Team Role Designation */}
                          <td className="text-foreground p-3.5 text-xs font-semibold">
                            {member.roleDesignation}
                          </td>

                          {/* Shift */}
                          <td className="p-3.5">
                            <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold">
                              {member.shift}
                            </span>
                          </td>

                          {/* Work Involvement */}
                          <td className="p-3.5">
                            <div className="flex flex-wrap items-center gap-2">
                              {member.involvement.map((inv, idx) => (
                                <span
                                  key={idx}
                                  className={cn(
                                    "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium",
                                    inv.toLowerCase().includes("qc")
                                      ? "border-primary/20 bg-primary/10 text-primary"
                                      : "border-emerald-200 bg-emerald-100/80 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
                                  )}
                                >
                                  <span
                                    className={cn(
                                      "h-1.5 w-1.5 rounded-full",
                                      inv.toLowerCase().includes("qc")
                                        ? "bg-primary"
                                        : "bg-emerald-500",
                                    )}
                                  />
                                  {inv}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Last Updated */}
                          <td className="text-muted-foreground p-3.5 font-mono text-xs">
                            {member.lastUpdated}
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 pr-6 text-right">
                            <div className="inline-flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openViewMemberDrawer(member)}
                                className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer rounded-md"
                                title="View Member"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openEditMemberModal(member)}
                                className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer rounded-md"
                                title="Edit Member"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  setDpTeamRoster((prev) =>
                                    prev.filter((m) => m.id !== member.id),
                                  )
                                }
                                className="text-muted-foreground hover:text-destructive h-7 w-7 cursor-pointer rounded-md"
                                title="Delete Member"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* ADD EMPLOYEE TO PROJECT TEAM MODAL */}
              <Dialog
                open={isAddEmployeeOpen}
                onOpenChange={setIsAddEmployeeOpen}
              >
                <DialogContent className="bg-card border-border flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-xl">
                  {/* MODAL HEADER */}
                  <div className="border-border bg-card relative border-b p-6 pb-4">
                    <DialogTitle className="text-foreground text-xl font-bold">
                      Add Employee to Project Team
                    </DialogTitle>
                    <p className="text-muted-foreground pt-1 text-xs">
                      Select an existing employee from the Employee Directory to
                      assign to{" "}
                      <span className="text-foreground font-semibold">
                        {project.name}
                      </span>
                      .
                    </p>
                  </div>

                  {/* MODAL BODY */}
                  <div className="flex-1 space-y-5 overflow-y-auto p-6">
                    {/* 1. Select Employee */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                        Select Employee <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={selectedEmployee}
                        onValueChange={setSelectedEmployee}
                      >
                        <SelectTrigger className="bg-background border-border h-10 w-full rounded-lg px-3 text-xs font-medium">
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {EMPLOYEE_DIRECTORY_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt.id}
                              value={opt.label}
                              className="text-xs"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 2: Team Role Designation & Operating Shift */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* 2. Team Role Designation */}
                      <div className="space-y-1.5">
                        <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                          Team Role Designation{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={teamRoleDesignation}
                          onChange={(e) =>
                            setTeamRoleDesignation(e.target.value)
                          }
                          className="bg-background border-border h-10 rounded-lg text-xs font-medium"
                          placeholder="e.g. Data Processing Specialist"
                        />
                      </div>

                      {/* 3. Operating Shift (Auto-determined) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground text-xs font-bold">
                            Operating Shift
                          </Label>
                          <span className="text-muted-foreground text-[10px] font-normal">
                            Auto-determined
                          </span>
                        </div>
                        <div className="bg-secondary/30 border-border flex h-10 w-full items-center justify-between rounded-lg border px-3">
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary h-4 w-4" />
                            <span className="text-foreground text-xs font-bold">
                              {getOperatingShift(addTimeHour, addTimeAmpm).name}
                            </span>
                          </div>
                          <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {getOperatingShift(addTimeHour, addTimeAmpm).pill}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Time (12-Hour) Card */}
                    <div className="border-border/80 bg-secondary/20 space-y-3 rounded-xl border p-4">
                      <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                        Time (12-Hour) <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={addTimeHour}
                          onValueChange={setAddTimeHour}
                        >
                          <SelectTrigger className="bg-background border-border h-9 w-24 rounded-lg px-3 text-xs font-medium">
                            <SelectValue placeholder="09" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {Array.from({ length: 12 }, (_, i) => {
                              const val = String(i + 1).padStart(2, "0");
                              return (
                                <SelectItem
                                  key={val}
                                  value={val}
                                  className="text-xs"
                                >
                                  {val}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <span className="text-foreground text-xs font-bold">
                          :
                        </span>

                        <Select
                          value={addTimeMinute}
                          onValueChange={setAddTimeMinute}
                        >
                          <SelectTrigger className="bg-background border-border h-9 w-24 rounded-lg px-3 text-xs font-medium">
                            <SelectValue placeholder="30" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {["00", "15", "30", "45"].map((m) => (
                              <SelectItem key={m} value={m} className="text-xs">
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="border-border bg-background flex items-center rounded-lg border p-0.5">
                          <button
                            type="button"
                            onClick={() => setAddTimeAmpm("AM")}
                            className={cn(
                              "cursor-pointer rounded-md px-3 py-1 text-xs font-bold transition-all",
                              addTimeAmpm === "AM"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddTimeAmpm("PM")}
                            className={cn(
                              "cursor-pointer rounded-md px-3 py-1 text-xs font-bold transition-all",
                              addTimeAmpm === "PM"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                      <p className="text-muted-foreground pt-0.5 text-[11px]">
                        Operating shift will update automatically to reflect
                        this selected time.
                      </p>
                    </div>

                    {/* 5. INITIAL WORK ALLOCATION INVOLVEMENT Card */}
                    <div className="border-border/80 bg-secondary/20 space-y-3 rounded-xl border p-4">
                      <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        INITIAL WORK ALLOCATION INVOLVEMENT
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        An employee can participate in both Production and QC
                        operations simultaneously.
                      </p>
                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={enableProduction}
                            onChange={(e) =>
                              setEnableProduction(e.target.checked)
                            }
                            className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 rounded"
                          />
                          Enable Production Allocation
                        </label>

                        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={enableQC}
                            onChange={(e) => setEnableQC(e.target.checked)}
                            className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 rounded"
                          />
                          Enable QC Allocation
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="border-border bg-card flex shrink-0 items-center justify-end gap-3 border-t p-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsAddEmployeeOpen(false)}
                      className="border-border h-9 rounded-xl px-5 text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleAddDPTeamMember}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-bold shadow-xs transition-colors"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Add to Team
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* EDIT EMPLOYEE DETAILS AND PROJECT TEAM MODAL */}
              <Dialog
                open={isEditMemberOpen}
                onOpenChange={setIsEditMemberOpen}
              >
                <DialogContent className="bg-card border-border flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-xl">
                  {/* MODAL HEADER */}
                  <div className="border-border bg-card relative border-b p-6 pb-4">
                    <DialogTitle className="text-foreground text-xl font-bold">
                      Edit Employee Details and Project Team
                    </DialogTitle>
                    <p className="text-muted-foreground pt-1 text-xs">
                      Update the selected employee&apos;s project team details
                      and work allocation involvement for{" "}
                      <span className="text-foreground font-semibold">
                        {project.name}
                      </span>
                      .
                    </p>
                  </div>

                  {/* MODAL BODY */}
                  <div className="flex-1 space-y-5 overflow-y-auto p-6">
                    {/* 1. Select Employee */}
                    <div className="space-y-1.5">
                      <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                        Select Employee <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={editMemberEmployee}
                        onValueChange={setEditMemberEmployee}
                      >
                        <SelectTrigger className="bg-background border-border h-10 w-full rounded-lg px-3 text-xs font-medium">
                          <SelectValue placeholder="Select Employee" />
                        </SelectTrigger>
                        <SelectContent className="bg-card border-border">
                          {EMPLOYEE_DIRECTORY_OPTIONS.map((opt) => (
                            <SelectItem
                              key={opt.id}
                              value={opt.label}
                              className="text-xs"
                            >
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 2: Team Role Designation & Operating Shift */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* 2. Team Role Designation */}
                      <div className="space-y-1.5">
                        <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                          Team Role Designation{" "}
                          <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          value={editMemberRole}
                          onChange={(e) => setEditMemberRole(e.target.value)}
                          className="bg-background border-border h-10 rounded-lg text-xs font-medium"
                          placeholder="e.g. Data Processing Specialist"
                        />
                      </div>

                      {/* 3. Operating Shift (Auto-determined) */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground text-xs font-bold">
                            Operating Shift
                          </Label>
                          <span className="text-muted-foreground text-[10px] font-normal">
                            Auto-determined
                          </span>
                        </div>
                        <div className="bg-secondary/30 border-border flex h-10 w-full items-center justify-between rounded-lg border px-3">
                          <div className="flex items-center gap-2">
                            <Clock className="text-primary h-4 w-4" />
                            <span className="text-foreground text-xs font-bold">
                              {
                                getOperatingShift(
                                  editMemberHour,
                                  editMemberAmpm,
                                ).name
                              }
                            </span>
                          </div>
                          <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            {
                              getOperatingShift(editMemberHour, editMemberAmpm)
                                .pill
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 4. Time (12-Hour) Card */}
                    <div className="border-border/80 bg-secondary/20 space-y-3 rounded-xl border p-4">
                      <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                        Time (12-Hour) <span className="text-red-500">*</span>
                      </Label>
                      <div className="flex items-center gap-2">
                        <Select
                          value={editMemberHour}
                          onValueChange={setEditMemberHour}
                        >
                          <SelectTrigger className="bg-background border-border h-9 w-24 rounded-lg px-3 text-xs font-medium">
                            <SelectValue placeholder="09" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {Array.from({ length: 12 }, (_, i) => {
                              const val = String(i + 1).padStart(2, "0");
                              return (
                                <SelectItem
                                  key={val}
                                  value={val}
                                  className="text-xs"
                                >
                                  {val}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <span className="text-foreground text-xs font-bold">
                          :
                        </span>

                        <Select
                          value={editMemberMinute}
                          onValueChange={setEditMemberMinute}
                        >
                          <SelectTrigger className="bg-background border-border h-9 w-24 rounded-lg px-3 text-xs font-medium">
                            <SelectValue placeholder="30" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border">
                            {["00", "15", "30", "45"].map((m) => (
                              <SelectItem key={m} value={m} className="text-xs">
                                {m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="border-border bg-background flex items-center rounded-lg border p-0.5">
                          <button
                            type="button"
                            onClick={() => setEditMemberAmpm("AM")}
                            className={cn(
                              "cursor-pointer rounded-md px-3 py-1 text-xs font-bold transition-all",
                              editMemberAmpm === "AM"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            AM
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditMemberAmpm("PM")}
                            className={cn(
                              "cursor-pointer rounded-md px-3 py-1 text-xs font-bold transition-all",
                              editMemberAmpm === "PM"
                                ? "bg-primary text-primary-foreground shadow-xs"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            PM
                          </button>
                        </div>
                      </div>
                      <p className="text-muted-foreground pt-0.5 text-[11px]">
                        Operating shift will update automatically to reflect
                        this selected time.
                      </p>
                    </div>

                    {/* 5. INITIAL WORK ALLOCATION INVOLVEMENT Card */}
                    <div className="border-border/80 bg-secondary/20 space-y-3 rounded-xl border p-4">
                      <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                        INITIAL WORK ALLOCATION INVOLVEMENT
                      </h4>
                      <p className="text-muted-foreground text-xs">
                        An employee can participate in both Production and QC
                        operations simultaneously.
                      </p>
                      <div className="flex flex-wrap items-center gap-6 pt-1">
                        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={editEnableProduction}
                            onChange={(e) =>
                              setEditEnableProduction(e.target.checked)
                            }
                            className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 rounded"
                          />
                          Enable Production Allocation
                        </label>

                        <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-semibold">
                          <input
                            type="checkbox"
                            checked={editEnableQC}
                            onChange={(e) => setEditEnableQC(e.target.checked)}
                            className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 rounded"
                          />
                          Enable QC Allocation
                        </label>
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="border-border bg-card flex items-center justify-end gap-3 border-t p-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditMemberOpen(false)}
                      className="border-border h-9 cursor-pointer rounded-lg px-4 text-xs font-semibold"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleUpdateDPTeamMember}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 rounded-lg px-4 text-xs font-semibold shadow-xs"
                    >
                      <Save className="h-3.5 w-3.5" /> Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* EDIT PROJECT CONFIGURATION MODAL */}
              <Dialog
                open={isEditConfigOpen}
                onOpenChange={setIsEditConfigOpen}
              >
                <DialogContent className="bg-card border-border flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl">
                  {/* MODAL HEADER */}
                  <div className="border-border bg-card relative border-b p-6 pb-4">
                    <DialogTitle className="text-foreground flex items-center gap-2 text-lg font-bold">
                      Edit Project Configuration:{" "}
                      {project.code || project.id || "PRJ-983"}
                    </DialogTitle>
                    <p className="text-muted-foreground pt-1 text-xs">
                      Update project metadata and client contact list. Changes
                      will be recorded in the project Audit Log.
                    </p>
                  </div>

                  {/* MODAL BODY (SCROLLABLE) */}
                  <div className="flex-1 space-y-6 overflow-y-auto p-6">
                    {/* SECTION 1 — PROJECT INFORMATION */}
                    <div className="space-y-4">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        PROJECT INFORMATION
                      </h4>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* 1. Project Name */}
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                            Project Name <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={editProjectName}
                            onChange={(e) => setEditProjectName(e.target.value)}
                            className="bg-background border-border h-9 rounded-lg text-xs font-medium"
                            placeholder="Enter project name"
                          />
                        </div>

                        {/* 2. Project Status (Read-only) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground text-xs font-bold">
                              Project Status
                            </Label>
                            <span className="text-muted-foreground text-[10px] font-normal">
                              Read-only
                            </span>
                          </div>
                          <div className="bg-secondary/40 border-border flex h-9 w-full items-center justify-between rounded-lg border px-3">
                            <span className="text-foreground font-mono text-xs font-bold uppercase">
                              {project.projectStatus || "CREATED"}
                            </span>
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-300/60 bg-slate-200/50 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
                              {project.projectStatus || "CREATED"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Project Type, Start Date, Start Time */}
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {/* 3. Project Type (Auto-filled, Read-only) */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <Label className="text-foreground text-xs font-bold">
                              Project Type
                            </Label>
                            <span className="text-muted-foreground text-[10px] font-normal">
                              Auto-filled
                            </span>
                          </div>
                          <div className="bg-secondary/40 border-border flex h-9 w-full items-center justify-between rounded-lg border px-3">
                            <span className="text-primary text-xs font-bold">
                              Data Processing
                            </span>
                            <Lock className="text-muted-foreground h-3.5 w-3.5" />
                          </div>
                        </div>

                        {/* 4. Start Date */}
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                            Start Date <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Input
                              type="text"
                              value={editStartDate}
                              onChange={(e) => setEditStartDate(e.target.value)}
                              className="bg-background border-border h-9 rounded-lg pr-8 text-xs font-medium"
                              placeholder="01-09-2026"
                            />
                            <Calendar className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-4 w-4" />
                          </div>
                        </div>

                        {/* 5. Start Time */}
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                            Start Time <span className="text-red-500">*</span>
                          </Label>
                          <div className="flex items-center gap-1">
                            <Select
                              value={editStartHour}
                              onValueChange={setEditStartHour}
                            >
                              <SelectTrigger className="bg-background border-border h-9 rounded-lg px-2 text-xs font-medium">
                                <SelectValue placeholder="10" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {Array.from({ length: 12 }, (_, i) => {
                                  const val = String(i + 1).padStart(2, "0");
                                  return (
                                    <SelectItem
                                      key={val}
                                      value={val}
                                      className="text-xs"
                                    >
                                      {val}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <span className="text-foreground text-xs font-bold">
                              :
                            </span>
                            <Select
                              value={editStartMinute}
                              onValueChange={setEditStartMinute}
                            >
                              <SelectTrigger className="bg-background border-border h-9 rounded-lg px-2 text-xs font-medium">
                                <SelectValue placeholder="00" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                {["00", "15", "30", "45"].map((m) => (
                                  <SelectItem
                                    key={m}
                                    value={m}
                                    className="text-xs"
                                  >
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Select
                              value={editStartAmpm}
                              onValueChange={setEditStartAmpm}
                            >
                              <SelectTrigger className="bg-background border-border h-9 rounded-lg px-2 text-xs font-medium">
                                <SelectValue placeholder="AM" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="AM" className="text-xs">
                                  AM
                                </SelectItem>
                                <SelectItem value="PM" className="text-xs">
                                  PM
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* 6. Description */}
                      <div className="space-y-1.5">
                        <Label className="text-foreground text-xs font-bold">
                          Description
                        </Label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                          className="bg-background border-border focus-visible:ring-primary text-foreground placeholder:text-muted-foreground w-full resize-none rounded-lg border p-3 text-xs font-medium focus:outline-none"
                          placeholder="Enter operational project description..."
                        />
                      </div>
                    </div>

                    {/* SECTION 2 — CLIENT INFORMATION */}
                    <div className="border-border/60 space-y-4 border-t pt-2">
                      <h4 className="text-muted-foreground pt-2 text-xs font-bold tracking-wider uppercase">
                        CLIENT INFORMATION
                      </h4>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* 1. Client Organization Name */}
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                            Client Organization Name{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            value={editClientName}
                            onChange={(e) => setEditClientName(e.target.value)}
                            className="bg-background border-border h-9 rounded-lg text-xs font-medium"
                            placeholder="Latvia Orgn"
                          />
                        </div>

                        {/* 2. Primary Email Address */}
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-bold">
                            Primary Email Address{" "}
                            <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            type="email"
                            value={editClientEmail}
                            onChange={(e) => setEditClientEmail(e.target.value)}
                            className="bg-background border-border h-9 rounded-lg text-xs font-medium"
                            placeholder="sam@gmail.com"
                          />
                        </div>
                      </div>

                      {/* 3. Secondary Client Contacts (Optional) */}
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-foreground text-xs font-bold">
                            Secondary Client Contacts (Optional)
                          </Label>
                          <button
                            type="button"
                            onClick={handleAddSecondaryEmail}
                            className="text-primary hover:text-primary/80 flex cursor-pointer items-center gap-1 text-xs font-bold transition-colors"
                          >
                            <Plus className="h-3.5 w-3.5" /> Add Email
                          </button>
                        </div>

                        {editSecondaryEmails.map((email, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="relative flex-1">
                              <Mail className="text-muted-foreground pointer-events-none absolute top-2.5 left-3 h-4 w-4" />
                              <Input
                                type="email"
                                value={email}
                                onChange={(e) =>
                                  handleUpdateSecondaryEmail(
                                    idx,
                                    e.target.value,
                                  )
                                }
                                className="bg-background border-border h-9 rounded-lg pl-9 text-xs font-medium"
                                placeholder="shenpa@gmail.com"
                              />
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              type="button"
                              onClick={() => handleRemoveSecondaryEmail(idx)}
                              className="text-muted-foreground hover:text-destructive hover:border-border h-9 w-9 rounded-lg border border-transparent"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* FOOTER ACTIONS */}
                  <div className="border-border bg-card flex shrink-0 items-center justify-end gap-3 border-t p-4">
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => setIsEditConfigOpen(false)}
                      className="border-border h-9 rounded-xl px-5 text-xs font-bold"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSaveConfig}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex h-9 items-center gap-2 rounded-xl px-5 text-xs font-bold shadow-xs transition-colors"
                    >
                      <Save className="h-4 w-4" /> Save Configuration
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* TAB CONTENT 3: BATCHES */}
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
                      {dpBatches.length} Batches
                    </Badge>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    Batches, record types, languages, total records, and image
                    allocations.
                  </p>
                </div>

                <Button
                  onClick={openCreateBatchModal}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground flex cursor-pointer items-center gap-1.5 self-start rounded-lg px-4 py-2 text-xs font-semibold shadow-xs sm:self-auto"
                >
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
                        <th className="p-3.5">SOURCE TYPE</th>
                        <th className="p-3.5">TOTAL SOURCE UNITS</th>
                        <th className="p-3.5">OVERALL STATUS</th>
                        <th className="p-3.5">LAST UPDATED</th>
                        <th className="p-3.5 text-right">ACTIONS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-border/60 divide-y">
                      {[...dpBatches]
                        .sort((a, b) =>
                          a.id.localeCompare(b.id, undefined, {
                            numeric: true,
                            sensitivity: "base",
                          }),
                        )
                        .map((b, i) => (
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
                              <span className="bg-primary/10 text-primary border-primary/20 rounded-md border px-2.5 py-0.5 font-mono text-xs font-medium">
                                {b.type}
                              </span>
                            </td>
                            <td className="text-muted-foreground p-3.5 font-medium">
                              {b.lang}
                            </td>
                            <td className="p-3.5">
                              <span className="bg-secondary text-secondary-foreground border-border rounded-md border px-2.5 py-0.5 font-mono text-xs font-semibold">
                                {b.sourceType}
                              </span>
                            </td>
                            <td className="text-foreground p-3.5 font-mono font-bold">
                              {b.sourceUnits}
                            </td>
                            <td className="p-3.5">
                              {renderOverallStatus(b.status)}
                            </td>
                            <td className="text-muted-foreground p-3.5 font-mono text-xs">
                              {b.lastUpdated}
                            </td>
                            <td className="p-3.5 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-border h-7 cursor-pointer gap-1 rounded-md text-xs font-semibold"
                              >
                                <Eye className="h-3.5 w-3.5" /> View
                              </Button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* CREATE BATCH MODAL */}
              <Dialog
                open={isCreateBatchOpen}
                onOpenChange={setIsCreateBatchOpen}
              >
                <DialogContent className="bg-card border-border flex max-h-[90vh] flex-col overflow-hidden rounded-2xl p-0 shadow-2xl sm:max-w-2xl">
                  {/* Modal Header */}
                  <div className="border-border/80 flex items-start justify-between border-b p-6 pb-4">
                    <div>
                      <DialogTitle className="text-foreground text-xl font-bold">
                        Create Batch
                      </DialogTitle>
                      <p className="text-muted-foreground mt-1 text-xs">
                        Configure batch metadata, type of record, language,
                        total images, and upload images.
                      </p>
                    </div>
                  </div>

                  {/* Scrollable Body */}
                  <div className="max-h-[calc(90vh-130px)] space-y-6 overflow-y-auto p-6">
                    {/* 1. BATCH DETAILS */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        1. BATCH DETAILS
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Batch ID (Auto Generated)
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={batchId}
                            disabled
                            readOnly
                            className="bg-muted/40 border-border text-muted-foreground h-9 cursor-not-allowed rounded-lg font-mono text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Batch Name
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            value={batchName}
                            onChange={(e) => setBatchName(e.target.value)}
                            placeholder="e.g. Historical Register Alpha 01"
                            className="bg-background border-border focus-visible:ring-primary h-9 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    {/* 2. RECORD TAXONOMY & LANGUAGE */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        2. RECORD TAXONOMY & LANGUAGE
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Type of Record
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={recordType}
                            onValueChange={setRecordType}
                          >
                            <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                              <SelectValue placeholder="Select Record Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="Birth">Birth</SelectItem>
                              <SelectItem value="Death">Death</SelectItem>
                              <SelectItem value="Mixed">Mixed</SelectItem>
                              <SelectItem value="Community">
                                Community
                              </SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          {recordType === "Other" && (
                            <div className="space-y-1.5 pt-2">
                              <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                                Custom Record Type{" "}
                                <span className="text-destructive">*</span>
                              </Label>
                              <Input
                                value={customRecordType}
                                onChange={(e) =>
                                  setCustomRecordType(e.target.value)
                                }
                                placeholder="Enter custom record type..."
                                className="bg-background border-border focus-visible:ring-primary h-9 rounded-lg text-xs"
                              />
                            </div>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Language
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={batchLanguage}
                            onValueChange={setBatchLanguage}
                          >
                            <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                              <SelectValue placeholder="Select Language" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border max-h-64 overflow-y-auto">
                              <div className="bg-card border-border sticky top-0 z-10 border-b p-2">
                                <div className="relative">
                                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                                  <Input
                                    type="text"
                                    placeholder="Search language..."
                                    value={languageSearch}
                                    onChange={(e) =>
                                      setLanguageSearch(e.target.value)
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => e.stopPropagation()}
                                    className="bg-background border-border focus-visible:ring-primary h-8 pl-8 text-xs"
                                  />
                                </div>
                              </div>
                              {WORLD_LANGUAGES.filter((lang) =>
                                lang
                                  .toLowerCase()
                                  .includes(languageSearch.toLowerCase()),
                              ).map((lang) => (
                                <SelectItem
                                  key={lang}
                                  value={lang}
                                  className="cursor-pointer text-xs"
                                >
                                  {lang}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 3. INPUT CONFIGURATION */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        3. INPUT CONFIGURATION
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Source Type
                            <span className="text-destructive">*</span>
                          </Label>
                          <Select
                            value={sourceType}
                            onValueChange={(val: "Images" | "PDF") =>
                              setSourceType(val)
                            }
                          >
                            <SelectTrigger className="bg-background border-border h-9 rounded-lg text-xs">
                              <SelectValue placeholder="Select Source Type" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border">
                              <SelectItem value="Images">Images</SelectItem>
                              <SelectItem value="PDF">PDF</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    {/* 4. BATCH DATE AND TIME */}
                    <div className="space-y-3">
                      <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        4. BATCH DATE AND TIME
                      </h4>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Batch Date
                            <span className="text-destructive">*</span>
                          </Label>
                          <Input
                            type="text"
                            value={batchDate}
                            onChange={(e) => setBatchDate(e.target.value)}
                            className="bg-background border-border h-9 rounded-lg text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label className="text-foreground flex items-center gap-1 text-xs font-semibold">
                            Batch Time
                            <span className="text-destructive">*</span>
                          </Label>
                          <div className="flex items-center gap-2">
                            <Select
                              value={batchHour}
                              onValueChange={setBatchHour}
                            >
                              <SelectTrigger className="bg-background border-border h-9 w-20 rounded-lg text-xs">
                                <SelectValue placeholder="10" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border max-h-48">
                                {Array.from({ length: 12 }, (_, i) => {
                                  const h = (i + 1).toString().padStart(2, "0");
                                  return (
                                    <SelectItem key={h} value={h}>
                                      {h}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <span className="text-muted-foreground font-bold">
                              :
                            </span>
                            <Select
                              value={batchMinute}
                              onValueChange={setBatchMinute}
                            >
                              <SelectTrigger className="bg-background border-border h-9 w-20 rounded-lg text-xs">
                                <SelectValue placeholder="30" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border max-h-48">
                                {["00", "15", "30", "45"].map((m) => (
                                  <SelectItem key={m} value={m}>
                                    {m}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <div className="border-border bg-secondary/30 flex items-center rounded-lg border p-0.5">
                              <button
                                type="button"
                                onClick={() => setBatchAmpm("AM")}
                                className={cn(
                                  "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                                  batchAmpm === "AM"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                AM
                              </button>
                              <button
                                type="button"
                                onClick={() => setBatchAmpm("PM")}
                                className={cn(
                                  "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                                  batchAmpm === "PM"
                                    ? "bg-primary text-primary-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground",
                                )}
                              >
                                PM
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DYNAMIC UPLOAD SECTION */}
                    {sourceType === "Images" ? (
                      /* Source Type: Images */
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                              UPLOAD IMAGES
                            </h4>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              Total Source Units (Auto Calculated):{" "}
                              <span className="text-primary font-bold">
                                {uploadedImageFiles.length}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              ref={imageFileInputRef}
                              multiple
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageFileUpload}
                            />
                            <input
                              type="file"
                              ref={imageFolderInputRef}
                              {...{ webkitdirectory: "", directory: "" }}
                              multiple
                              className="hidden"
                              onChange={handleImageFileUpload}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleImageFileUpload();
                                imageFileInputRef.current?.click();
                              }}
                              className="border-border h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-medium"
                            >
                              <Upload className="h-3.5 w-3.5" /> Select Files
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handleImageFileUpload();
                                imageFolderInputRef.current?.click();
                              }}
                              className="border-border h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-medium"
                            >
                              <Upload className="h-3.5 w-3.5" /> Select Folder
                            </Button>
                          </div>
                        </div>

                        {/* Drag & Drop Area */}
                        <div
                          onClick={() => {
                            handleImageFileUpload();
                            imageFileInputRef.current?.click();
                          }}
                          className="border-border/80 bg-secondary/10 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors"
                        >
                          <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                            <Upload className="h-5 w-5" />
                          </div>
                          <p className="text-foreground text-xs font-semibold">
                            Drag and drop image files here, or use the buttons
                            above
                          </p>
                          <p className="text-muted-foreground mt-1 text-[11px]">
                            Supports JPEG, PNG, TIFF scans. Sequential image
                            numbering (1, 2, 3...) will be generated
                            automatically.
                          </p>
                        </div>

                        {/* Uploaded Image Files List (Scrollable container for 100 images) */}
                        {uploadedImageFiles.length > 0 && (
                          <div className="max-h-60 space-y-2 overflow-y-auto pr-1">
                            {uploadedImageFiles.map((file, idx) => (
                              <div
                                key={file.id}
                                className="border-border bg-card flex items-center justify-between rounded-xl border p-3 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="bg-primary/10 text-primary flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold">
                                    {idx + 1}
                                  </span>
                                  <span className="text-foreground font-semibold">
                                    {file.name}
                                  </span>
                                  <span className="text-muted-foreground text-[11px]">
                                    ({file.size})
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    Uploaded
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Source Type: PDF */
                      <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                              UPLOAD PDF FILES
                            </h4>
                            <p className="text-muted-foreground mt-0.5 text-xs">
                              Total Source Units (Auto Calculated):{" "}
                              <span className="text-primary font-bold">
                                {uploadedPdfFiles.reduce(
                                  (acc, f) => acc + f.pages,
                                  0,
                                )}
                              </span>
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              ref={pdfFileInputRef}
                              multiple
                              accept="application/pdf"
                              className="hidden"
                              onChange={handlePdfFileUpload}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                handlePdfFileUpload();
                                pdfFileInputRef.current?.click();
                              }}
                              className="border-border h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-medium"
                            >
                              <Upload className="h-3.5 w-3.5" /> Select Files
                            </Button>
                          </div>
                        </div>

                        {/* Drag & Drop Area */}
                        <div
                          onClick={() => {
                            handlePdfFileUpload();
                            pdfFileInputRef.current?.click();
                          }}
                          className="border-border/80 bg-secondary/10 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-colors"
                        >
                          <div className="bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-full">
                            <Upload className="h-5 w-5" />
                          </div>
                          <p className="text-foreground text-xs font-semibold">
                            Drag and drop PDF files here, or use the button
                            above
                          </p>
                          <p className="text-muted-foreground mt-1 text-[11px]">
                            Supports PDF documents. Page counts will be
                            calculated automatically.
                          </p>
                        </div>

                        {/* Uploaded PDF Files List (Non-editable Total Pages) */}
                        {uploadedPdfFiles.length > 0 && (
                          <div className="space-y-2">
                            {uploadedPdfFiles.map((file) => (
                              <div
                                key={file.id}
                                className="border-border bg-card flex items-center justify-between rounded-xl border p-3 text-xs"
                              >
                                <div className="flex items-center gap-3">
                                  <FileText className="text-primary h-4 w-4" />
                                  <div>
                                    <span className="text-foreground block font-semibold">
                                      {file.name}
                                    </span>
                                    <span className="text-muted-foreground text-[11px]">
                                      Total Pages:{" "}
                                      <strong className="text-foreground">
                                        {file.pages}
                                      </strong>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                    Uploaded
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="bg-secondary/20 border-border flex items-center justify-end gap-2 border-t p-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsCreateBatchOpen(false)}
                      className="border-border rounded-lg px-4 text-xs"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCreateBatchSubmit}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground flex cursor-pointer items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Create Batch
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {/* TAB CONTENT 3: ATTACHMENTS */}
          {dpTab === "attachments" && (
            <div className="space-y-6">
              <input
                type="file"
                ref={attachmentFileInputRef}
                className="hidden"
                onChange={handleAttachmentFileUpload}
                multiple
              />
              {/* DROPZONE CARD */}
              <div
                onClick={() => attachmentFileInputRef.current?.click()}
                className="border-primary/30 bg-primary/5 hover:border-primary/50 flex cursor-pointer flex-col items-center justify-center space-y-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors"
              >
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
                  type="button"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    attachmentFileInputRef.current?.click();
                  }}
                  className="border-border bg-background h-8 cursor-pointer gap-1.5 rounded-lg text-xs font-semibold shadow-xs"
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
                    {clientAttachments.length} reference document
                    {clientAttachments.length === 1 ? "" : "s"} uploaded
                  </p>
                </div>

                <Card className="bg-card border-border overflow-hidden rounded-xl shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-border bg-secondary/40 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="p-3.5">FILE NAME</th>
                          <th className="p-3.5">FILE TYPE</th>
                          <th className="p-3.5">FILE SIZE</th>
                          <th className="p-3.5">ATTACHED AT</th>
                          <th className="p-3.5 text-right">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/60 divide-y">
                        {clientAttachments.map((doc) => (
                          <tr
                            key={doc.id}
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
                              {doc.attachedAt}
                            </td>
                            <td className="p-3.5 text-right">
                              <div className="inline-flex items-center justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer rounded-md"
                                  title="View"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteAttachment(doc.id)}
                                  className="text-muted-foreground hover:text-destructive h-7 w-7 cursor-pointer rounded-md"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
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
                    ? `${activityLogs.length} Recorded Actions`
                    : `${auditDiffs.length} Data Audit Diffs`}
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
                        {activityLogs.map((log) => (
                          <tr
                            key={log.id}
                            className="hover:bg-secondary/20 transition-colors"
                          >
                            <td className="p-3.5">
                              <span className="text-foreground block font-bold">
                                {log.user}
                              </span>
                              <span className="text-muted-foreground block text-[11px]">
                                {log.role}
                              </span>
                            </td>
                            <td className="p-3.5">
                              <span className="bg-secondary border-border text-muted-foreground rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase">
                                {log.type}
                              </span>
                            </td>
                            <td className="text-foreground p-3.5 font-medium">
                              {log.entity}
                            </td>
                            <td className="text-primary p-3.5 font-mono font-bold">
                              {log.target}
                            </td>
                            <td className="text-muted-foreground p-3.5">
                              {log.desc}
                            </td>
                            <td className="p-3.5">
                              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                {log.status}
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
                        {auditDiffs.map((diff, i) => (
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

          {/* EMPLOYEE QUICK PROFILE SIDE DRAWER */}
          <Sheet
            open={isViewMemberDrawerOpen}
            onOpenChange={setIsViewMemberDrawerOpen}
          >
            <SheetContent className="bg-card border-border flex w-full flex-col justify-between gap-0 overflow-y-auto border-l p-0 sm:max-w-xl md:max-w-2xl">
              {/* DRAWER BODY */}
              <div className="flex-1 space-y-6 overflow-y-auto p-6">
                {/* HEADER ROW */}
                <div className="border-border flex items-center gap-3.5 border-b pb-5">
                  <div className="bg-primary/10 text-primary border-primary/20 relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full border text-base font-bold">
                    {viewingMember?.initials || "MK"}
                    <span className="border-card absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-emerald-500" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-foreground text-lg leading-tight font-bold">
                      {viewingMember?.name || "Mathan Kumar"}
                    </h3>
                    <div className="flex items-center gap-2 pt-0.5">
                      <span className="text-muted-foreground font-mono text-xs font-semibold">
                        {viewingMember?.employeeCode || "EMP-001"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{" "}
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* 1. DEPARTMENT & ROLE */}
                <div className="space-y-2">
                  <h4 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    DEPARTMENT & ROLE
                  </h4>
                  <div className="bg-secondary/30 border-border/70 flex items-center justify-between rounded-xl border p-3.5">
                    <div className="flex items-center gap-2.5">
                      <Building2 className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold">
                        Data Processing
                      </span>
                    </div>
                    <span className="text-muted-foreground text-xs font-medium">
                      {viewingMember?.roleDesignation ||
                        "Senior Processing Specialist"}
                    </span>
                  </div>
                </div>

                {/* 2. WORK CAPABILITIES */}
                <div className="space-y-2.5">
                  <h4 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    WORK CAPABILITIES
                  </h4>
                  <div className="bg-secondary/40 border-border flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-2.5">
                      <Clock className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold">
                        Production Capable
                      </span>
                    </div>
                    <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                      Eligible
                    </span>
                  </div>

                  <div className="bg-secondary/40 border-border flex items-center justify-between rounded-xl border p-3">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="text-primary h-4 w-4" />
                      <span className="text-foreground text-xs font-bold">
                        Quality Control (QC) Capable
                      </span>
                    </div>
                    <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold">
                      Eligible
                    </span>
                  </div>
                </div>

                {/* 3. EMAIL & JOINING DATE */}
                <div className="border-border/60 space-y-2 border-t pt-1">
                  <div className="flex items-center justify-between py-1.5">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Mail className="h-3.5 w-3.5" />
                      <span>Email</span>
                    </div>
                    <span className="text-primary text-xs font-semibold">
                      {viewingMember?.email ||
                        `${(viewingMember?.name || "mathan.kumar").toLowerCase().replace(/\s+/g, ".")}@epd-erp.io`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Joining Date</span>
                    </div>
                    <span className="text-foreground text-xs font-semibold">
                      {viewingMember?.joiningDate || "January 10, 2024"}
                    </span>
                  </div>
                </div>

                {/* 4. PERFORMANCE SNAPSHOT */}
                <div className="border-border/80 bg-card space-y-3 rounded-xl border p-4 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-foreground text-[11px] font-bold tracking-wider uppercase">
                      PERFORMANCE SNAPSHOT
                    </h4>
                    <span className="border-primary/20 bg-primary/10 text-primary inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold">
                      EXCELLENT
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-foreground font-mono text-2xl font-extrabold">
                        96.5
                      </span>
                      <span className="text-muted-foreground text-xs font-semibold">
                        / 100
                      </span>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      Rating: EXCELLENT
                    </span>
                  </div>
                </div>
              </div>

              {/* DRAWER FOOTER */}
              <div className="border-border bg-card shrink-0 border-t p-4">
                <Button
                  onClick={handleViewFullProfile}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-11 w-full cursor-pointer gap-2 rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  View Full Profile <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </SheetContent>
          </Sheet>
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
              <ShieldCheck className="text-primary h-4 w-4" />
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
