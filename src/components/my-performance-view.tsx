"use client";

import React, { useState, useMemo } from "react";
import {
  TrendingUp,
  FileText,
  Award,
  Calendar,
  Activity,
  Zap,
  Clock,
  Filter,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Briefcase,
  User,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserRole } from "@/lib/user-role-context";
import { cn } from "@/lib/utils";

/* =========================================================================
   DATE HELPER UTILITIES
   ========================================================================= */

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

function isSameDay(d1: Date, d2: Date) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

function getDaysBetween(start: Date, end: Date) {
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
}

function formatDisplayDate(d: Date) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3)} ${d.getFullYear()}`;
}

function formatUpperDate(d: Date) {
  return `${d.getDate()} ${MONTH_NAMES[d.getMonth()].slice(0, 3).toUpperCase()} ${d.getFullYear()}`;
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

/* =========================================================================
   DATE RANGE PICKER COMPONENT
   ========================================================================= */

interface DateRangePickerProps {
  initialStart: Date;
  initialEnd: Date;
  onApply: (start: Date, end: Date) => void;
  onCancel: () => void;
}

function DateRangePicker({
  initialStart,
  initialEnd,
  onApply,
  onCancel,
}: DateRangePickerProps) {
  const [pendingStart, setPendingStart] = useState<Date | null>(initialStart);
  const [pendingEnd, setPendingEnd] = useState<Date | null>(initialEnd);
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const [viewYear, setViewYear] = useState<number>(initialStart.getFullYear());
  const [viewMonth, setViewMonth] = useState<number>(initialStart.getMonth());

  const month2Year = viewMonth === 11 ? viewYear + 1 : viewYear;
  const month2Month = viewMonth === 11 ? 0 : viewMonth + 1;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDateClick = (d: Date) => {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(d);
      setPendingEnd(null);
    } else {
      if (d < pendingStart) {
        setPendingStart(d);
        setPendingEnd(null);
      } else {
        setPendingEnd(d);
      }
    }
  };

  const handleQuickOption = (optionLabel: string) => {
    const refStart = new Date(2026, 7, 26);
    const refEnd = new Date(2026, 8, 2);

    if (optionLabel === "3 Weeks") {
      refStart.setDate(26 - 14);
    } else if (optionLabel === "1 Month") {
      refStart.setMonth(6);
      refStart.setDate(2);
    } else if (optionLabel === "3 Months") {
      refStart.setMonth(4);
      refStart.setDate(2);
    } else if (optionLabel === "6 Months") {
      refStart.setMonth(1);
      refStart.setDate(2);
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
      (hoveredDate && pendingStart && hoveredDate >= pendingStart ? hoveredDate : null);

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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {renderMonthCalendar(viewYear, viewMonth, true)}
        {renderMonthCalendar(month2Year, month2Month, false)}
      </div>

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
            disabled={!pendingStart || !pendingEnd}
            onClick={() => {
              if (pendingStart && pendingEnd) {
                onApply(pendingStart, pendingEnd);
              }
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer rounded-lg px-4 text-xs font-semibold"
          >
            Apply
          </Button>
        </div>
      </div>
    </Card>
  );
}

/* =========================================================================
   MONTHLY PERFORMANCE MOCK DATA
   ========================================================================= */

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
  { label: "Sep 2025", records: "7,10,200 records", val: 112 },
  { label: "Oct 2025", records: "6,80,000 records", val: 106 },
  { label: "Nov 2025", records: "7,45,000 records", val: 118 },
  { label: "Dec 2025", records: "6,90,100 records", val: 108 },
  { label: "Jan 2026", records: "7,80,400 records", val: 121 },
  { label: "Feb 2026", records: "7,15,000 records", val: 112 },
  { label: "Mar 2026", records: "7,60,000 records", val: 116 },
  { label: "Apr 2026", records: "7,95,000 records", val: 122 },
  { label: "May 2026", records: "7,30,000 records", val: 114 },
  { label: "Jun 2026", records: "7,85,000 records", val: 120 },
  { label: "Jul 2026", records: "8,10,000 records", val: 123 },
  { label: "Aug 2026", records: "8,28,000 records", val: 125, best: true },
];

const QC_MONTHLY_PERF_DATA: MonthlyPerfItem[] = [
  { label: "May 2025", records: "3,10,200 verified", val: 75 },
  { label: "Jun 2025", records: "3,45,100 verified", val: 82 },
  { label: "Jul 2025", records: "4,90,400 verified", val: 115, best: true },
  { label: "Aug 2025", records: "3,80,000 verified", val: 90 },
  { label: "Sep 2025", records: "4,15,300 verified", val: 98 },
  { label: "Oct 2025", records: "3,95,000 verified", val: 94 },
  { label: "Nov 2025", records: "4,30,000 verified", val: 102 },
  { label: "Dec 2025", records: "4,05,000 verified", val: 96 },
  { label: "Jan 2026", records: "4,50,000 verified", val: 108 },
  { label: "Feb 2026", records: "4,20,000 verified", val: 100 },
  { label: "Mar 2026", records: "4,40,000 verified", val: 105 },
  { label: "Apr 2026", records: "4,65,000 verified", val: 110 },
  { label: "May 2026", records: "4,25,000 verified", val: 102 },
  { label: "Jun 2026", records: "4,60,000 verified", val: 109 },
  { label: "Jul 2026", records: "4,75,000 verified", val: 112 },
  { label: "Aug 2026", records: "4,88,000 verified", val: 115, best: true },
];

function buildSVGPath(points: { x: number; y: number }[]) {
  if (!points || points.length === 0) return "";
  let path = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = i > 0 ? points[i - 1] : points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = i < points.length - 2 ? points[i + 2] : p2;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
  }
  return path;
}

function getDayRecords(
  year: number,
  month: number,
  day: number,
  type: "production" | "qc",
  projectFilter: string = "all",
) {
  const d = new Date(year, month, day);
  if (d.getDay() === 0) return 0; // Sunday off

  const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const known: Record<string, { prod: number; qc: number }> = {
    "2026-08-26": { prod: 485, qc: 300 },
    "2026-08-27": { prod: 478, qc: 295 },
    "2026-08-28": { prod: 492, qc: 302 },
    "2026-08-29": { prod: 480, qc: 296 },
    "2026-08-30": { prod: 0, qc: 0 },
    "2026-08-31": { prod: 490, qc: 302 },
    "2026-09-01": { prod: 457, qc: 279 },
    "2026-09-02": { prod: 0, qc: 0 },
  };

  let baseVal = 0;
  if (known[key] !== undefined) {
    baseVal = type === "production" ? known[key].prod : known[key].qc;
  } else {
    const seed = (year * 372 + (month + 1) * 31 + day) % 100;
    baseVal =
      type === "production" ? 440 + (seed % 80) : 270 + (seed % 55);
  }

  let multiplier = 1;
  if (projectFilter === "prj-01") multiplier = 0.55;
  else if (projectFilter === "prj-02") multiplier = 0.3;
  else if (projectFilter === "prj-03") multiplier = 0.15;

  return Math.round(baseVal * multiplier);
}

/* =========================================================================
   MAIN COMPONENT: MY PERFORMANCE VIEW
   ========================================================================= */

export function MyPerformanceView() {
  const { currentProfile } = useUserRole();

  const [perfSubTab, setPerfSubTab] = useState<"production" | "qc">(
    "production",
  );
  const [selectedPerfProject, setSelectedPerfProject] = useState<string>("all");

  const [hoveredProdMonthIdx, setHoveredProdMonthIdx] = useState<number>(2);
  const [hoveredQcMonthIdx, setHoveredQcMonthIdx] = useState<number>(2);

  const [prodDateRange, setProdDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(2026, 7, 26),
    end: new Date(2026, 8, 2),
  });
  const [isProdDatePickerOpen, setIsProdDatePickerOpen] = useState(false);

  const [qcDateRange, setQcDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(2026, 7, 26),
    end: new Date(2026, 8, 2),
  });
  const [isQcDatePickerOpen, setIsQcDatePickerOpen] = useState(false);

  const now = new Date();
  const [prodCalDate, setProdCalDate] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
    day: 1,
  });
  const [qcCalDate, setQcCalDate] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
    day: 1,
  });

  const getProjectBestMonthIdx = (prj: string) => {
    if (prj === "prj-01") return 15; // Aug 2026
    if (prj === "prj-02") return 11; // Apr 2026
    if (prj === "prj-03") return 8; // Jan 2026
    return 2; // Jul 2025 default
  };

  const activePerfMetrics = useMemo(() => {
    let scale = 1;
    let code = "ALL";
    if (selectedPerfProject === "prj-01") {
      scale = 0.55;
      code = "PRJ-001";
    } else if (selectedPerfProject === "prj-02") {
      scale = 0.3;
      code = "PRJ-002";
    } else if (selectedPerfProject === "prj-03") {
      scale = 0.15;
      code = "PRJ-003";
    }

    const fmt = (n: number) => Math.round(n * scale).toLocaleString();

    return {
      code,
      scale,
      prod: {
        totalRecords: fmt(9420500),
        monthlyAvg: fmt(724650),
        bestMonth:
          selectedPerfProject === "prj-01"
            ? "Aug 2026"
            : selectedPerfProject === "prj-02"
              ? "Apr 2026"
              : selectedPerfProject === "prj-03"
                ? "Jan 2026"
                : "Jul 2025",
        bestRecords: `${fmt(832310)} rec`,
        monthsActive: 16,
      },
      qc: {
        totalVerified: fmt(5840200),
        monthlyAvg: fmt(449240),
        accuracyRate: "99.8%",
        defectsLogged: fmt(340),
        bestMonth:
          selectedPerfProject === "prj-01"
            ? "Aug 2026"
            : selectedPerfProject === "prj-02"
              ? "Apr 2026"
              : selectedPerfProject === "prj-03"
                ? "Jan 2026"
                : "Jul 2025",
        bestVerified: `${fmt(490400)} verified`,
        monthsActive: 16,
      },
    };
  }, [selectedPerfProject]);

  const currentProdMonthlyData = useMemo(() => {
    const bestIdx = getProjectBestMonthIdx(selectedPerfProject);
    return PROD_MONTHLY_PERF_DATA.map((item, idx) => {
      const val = Math.round(item.val * activePerfMetrics.scale);
      const rec = Math.round(
        parseInt(item.records.replace(/,/g, "")) * activePerfMetrics.scale,
      ).toLocaleString();
      return {
        ...item,
        val,
        records: `${rec} records`,
        best: idx === bestIdx,
      };
    });
  }, [selectedPerfProject, activePerfMetrics.scale]);

  const currentQcMonthlyData = useMemo(() => {
    const bestIdx = getProjectBestMonthIdx(selectedPerfProject);
    return QC_MONTHLY_PERF_DATA.map((item, idx) => {
      const val = Math.round(item.val * activePerfMetrics.scale);
      const rec = Math.round(
        parseInt(item.records.replace(/,/g, "")) * activePerfMetrics.scale,
      ).toLocaleString();
      return {
        ...item,
        val,
        records: `${rec} verified`,
        best: idx === bestIdx,
      };
    });
  }, [selectedPerfProject, activePerfMetrics.scale]);

  const prodTrendPoints = useMemo(() => {
    return currentProdMonthlyData.map((m, idx) => ({
      x: 35 + idx * 46,
      y: 190 - m.val,
    }));
  }, [currentProdMonthlyData]);

  const prodTrendPath = useMemo(
    () => buildSVGPath(prodTrendPoints),
    [prodTrendPoints],
  );

  const qcTrendPoints = useMemo(() => {
    return currentQcMonthlyData.map((m, idx) => ({
      x: 35 + idx * 46,
      y: 190 - m.val,
    }));
  }, [currentQcMonthlyData]);

  const qcTrendPath = useMemo(
    () => buildSVGPath(qcTrendPoints),
    [qcTrendPoints],
  );

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

  // Calendar Controls
  const handlePrevProdCalMonth = () => {
    setProdCalDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11, day: 1 };
      return { ...prev, month: prev.month - 1, day: 1 };
    });
  };

  const handleNextProdCalMonth = () => {
    setProdCalDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0, day: 1 };
      return { ...prev, month: prev.month + 1, day: 1 };
    });
  };

  const handlePrevQcCalMonth = () => {
    setQcCalDate((prev) => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11, day: 1 };
      return { ...prev, month: prev.month - 1, day: 1 };
    });
  };

  const handleNextQcCalMonth = () => {
    setQcCalDate((prev) => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0, day: 1 };
      return { ...prev, month: prev.month + 1, day: 1 };
    });
  };

  const prodDaysInMonth = new Date(
    prodCalDate.year,
    prodCalDate.month + 1,
    0,
  ).getDate();
  const prodFirstDayOfMonth =
    new Date(prodCalDate.year, prodCalDate.month, 1).getDay();

  const qcDaysInMonth = new Date(
    qcCalDate.year,
    qcCalDate.month + 1,
    0,
  ).getDate();
  const qcFirstDayOfMonth =
    new Date(qcCalDate.year, qcCalDate.month, 1).getDay();

  const prodSelectedDayRecs = getDayRecords(
    prodCalDate.year,
    prodCalDate.month,
    prodCalDate.day,
    "production",
    selectedPerfProject,
  );

  const qcSelectedDayRecs = getDayRecords(
    qcCalDate.year,
    qcCalDate.month,
    qcCalDate.day,
    "qc",
    selectedPerfProject,
  );

  const hourlySlots = [
    { label: "09:00 AM – 10:00 AM", ratio: 0.12 },
    { label: "10:00 AM – 11:00 AM", ratio: 0.14 },
    { label: "11:00 AM – 12:00 PM", ratio: 0.15 },
    { label: "12:00 PM – 01:00 PM", ratio: 0.08 },
    { label: "01:00 PM – 02:00 PM", ratio: 0.11 },
    { label: "02:00 PM – 03:00 PM", ratio: 0.13 },
    { label: "03:00 PM – 04:00 PM", ratio: 0.14 },
    { label: "04:00 PM – 05:00 PM", ratio: 0.09 },
    { label: "05:00 PM – 06:00 PM", ratio: 0.04 },
  ];

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              My Performance
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none text-xs">
              {currentProfile.name} ({currentProfile.code})
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs mt-1">
            Overview of individual production output, QC verifications, accuracy rates, and daily performance metrics.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-secondary/40 p-2 border border-border">
          <div className="flex h-8 w-8 items-center justify-center bg-primary/20 text-primary font-bold text-xs border border-primary/40">
            {currentProfile.avatar}
          </div>
          <div className="flex flex-col text-xs">
            <span className="font-bold text-foreground">{currentProfile.name}</span>
            <span className="text-[10px] text-muted-foreground">{currentProfile.designation} &bull; General Day Shift</span>
          </div>
        </div>
      </div>

      {/* PROJECT FILTER SECTION */}
      <Card className="bg-card border-border rounded-none p-4 shadow-none">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary border-primary/20 flex h-9 w-9 shrink-0 items-center justify-center rounded-none border">
              <Filter className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-foreground text-xs font-bold tracking-wider uppercase">
                  Project Filter
                </span>
                <Badge
                  variant="outline"
                  className="border-border text-[10px] font-semibold rounded-none"
                >
                  {activePerfMetrics.code}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                Filter employee performance metrics and records output by assigned project.
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
                className="bg-background border-border h-9 w-full cursor-pointer rounded-none text-xs font-semibold sm:w-64"
              >
                <SelectValue placeholder="All Projects (Combined)" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border rounded-none">
                <SelectItem value="all" className="text-xs font-semibold">
                  All Projects (Combined)
                </SelectItem>
                <SelectItem value="prj-01" className="text-xs font-semibold">
                  Alpha Vision Segmentation (PRJ-001)
                </SelectItem>
                <SelectItem value="prj-02" className="text-xs font-semibold">
                  BioTech Medical Annotation (PRJ-002)
                </SelectItem>
                <SelectItem value="prj-03" className="text-xs font-semibold">
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
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
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
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
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
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
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
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
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
                "bg-card flex max-w-sm cursor-pointer items-center justify-between rounded-none border p-3 transition-all",
                isProdDatePickerOpen
                  ? "border-primary ring-primary/20 ring-1"
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
          <Card className="bg-secondary/40 border-border flex flex-col justify-between gap-4 rounded-none border p-5 shadow-none sm:flex-row sm:items-center">
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
            <div className="bg-card border-border flex items-center justify-center rounded-none border px-5 py-3">
              <span className="text-primary font-mono text-lg font-extrabold">
                {Math.round(
                  prodRangeStats.totalRecords * activePerfMetrics.scale,
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
            <span className="bg-secondary border-border text-foreground inline-flex items-center rounded-none border px-3 py-1 font-mono text-xs font-semibold">
              6 Sep 2026 12:10pm
            </span>
          </div>

          {/* MONTHLY PRODUCTION PERFORMANCE GRAPH */}
          <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-none border">
            <div className="border-border flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="text-primary h-4 w-4" />
                  <h3 className="text-foreground text-sm font-bold">
                    Monthly Production Performance Graph
                  </h3>
                  <span className="bg-primary/10 text-primary border-primary/20 rounded-none border px-2.5 py-0.5 text-[11px] font-semibold">
                    Production
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Total Production Records Completed per Month across operational history.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="bg-primary h-3 w-3 rounded-none" />
                  <span className="text-muted-foreground">
                    Production Records (Bars)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-foreground h-0.5 w-4" />
                  <span className="text-muted-foreground">Trend Line</span>
                </div>
              </div>
            </div>

            {/* SVG GRAPH */}
            <div className="w-full overflow-x-auto pt-2">
              <div className="relative h-[260px] min-w-[700px]">
                <svg className="h-full w-full" viewBox="0 0 850 240">
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

                  {currentProdMonthlyData.map((m, idx) => {
                    const x = 35 + idx * 46;
                    const height = m.val;
                    const y = 190 - height;
                    const isHovered = idx === hoveredProdMonthIdx;
                    return (
                      <g
                        key={idx}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredProdMonthIdx(idx)}
                        onClick={() => setHoveredProdMonthIdx(idx)}
                      >
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
                          fill={m.best ? "#f59e0b" : "hsl(var(--primary))"}
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

                  <path
                    d={prodTrendPath}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

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
                              fill={isBest ? "#f59e0b" : "hsl(var(--primary))"}
                            />
                            <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" />
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

                  {hoveredProdMonthIdx >= 0 &&
                    hoveredProdMonthIdx < currentProdMonthlyData.length &&
                    (() => {
                      const activeData = currentProdMonthlyData[hoveredProdMonthIdx];
                      const activePt = prodTrendPoints[hoveredProdMonthIdx];
                      if (!activeData || !activePt) return null;
                      const tooltipWidth = 138;
                      const tooltipHeight = 40;
                      const tooltipX = Math.max(
                        tooltipWidth / 2 + 10,
                        Math.min(850 - tooltipWidth / 2 - 10, activePt.x),
                      );
                      const tooltipY = Math.max(10, activePt.y - tooltipHeight - 12);
                      const caretTipY = tooltipY + tooltipHeight + 6;

                      return (
                        <g className="pointer-events-none drop-shadow-md filter transition-all duration-150">
                          <rect
                            x={tooltipX - tooltipWidth / 2}
                            y={tooltipY}
                            width={tooltipWidth}
                            height={tooltipHeight}
                            rx={4}
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
                            fill={activeData.best ? "#fbbf24" : "#ffffff"}
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
            <Card className="bg-card border-border space-y-4 rounded-none p-5 shadow-none border">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="text-primary h-4 w-4" />
                  <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Daily Production Performance Calendar
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer rounded-none"
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
                    className="h-7 w-7 cursor-pointer rounded-none"
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
                  {Array.from({ length: prodFirstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16" />
                  ))}

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
                            setProdCalDate((prev) => ({ ...prev, day: d }))
                          }
                          className={cn(
                            "flex h-16 cursor-pointer flex-col justify-between rounded-none border border-amber-300 bg-amber-50/60 p-1.5 text-left transition-all dark:border-amber-700 dark:bg-amber-950/20",
                            isSelected ? "ring-2 ring-amber-500/40" : "",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                              {d}
                            </span>
                            <span className="rounded-none bg-amber-200 px-1 text-[8px] font-extrabold text-amber-800 uppercase dark:bg-amber-900 dark:text-amber-200">
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
                            setProdCalDate((prev) => ({ ...prev, day: d }))
                          }
                          className={cn(
                            "flex h-16 cursor-pointer flex-col justify-between rounded-none border p-1.5 text-left transition-all",
                            isSelected
                              ? "border-primary bg-primary/10 ring-primary/30 font-bold ring-2"
                              : "border-border hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-foreground text-xs font-bold">
                              {d}
                            </span>
                            <span className="bg-primary h-1.5 w-1.5 rounded-none" />
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
                          setProdCalDate((prev) => ({ ...prev, day: d }))
                        }
                        className={cn(
                          "flex h-16 cursor-pointer flex-col justify-between rounded-none border p-1.5 text-left transition-all",
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

            {/* DAILY PRODUCTION HOURLY BREAKDOWN */}
            <Card className="bg-card border-border space-y-4 rounded-none p-5 shadow-none border">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="text-primary h-4 w-4" />
                  <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Daily Production Hourly Breakdown
                  </h3>
                </div>
                <span className="bg-primary/10 text-primary border-primary/20 inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold">
                  {prodCalDate.day}{" "}
                  {new Date(
                    prodCalDate.year,
                    prodCalDate.month,
                  ).toLocaleDateString("en-US", { month: "long" })}{" "}
                  {prodCalDate.year}
                </span>
              </div>

              {/* SUMMARY BOX */}
              <div className="bg-secondary/40 border-border flex items-center justify-between rounded-none border p-4">
                <div className="space-y-1">
                  <span className="text-muted-foreground block text-[10px] font-bold tracking-wider uppercase">
                    DAY TOTAL OUTPUT (9:00 AM - 6:00 PM)
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
                <div className="bg-primary/10 text-primary flex h-9 w-9 items-center justify-center rounded-none">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              {/* SLOTS TABLE */}
              <div className="space-y-3 pt-1">
                <div className="text-muted-foreground border-border/60 flex items-center justify-between border-b pb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  <span>WORKING HOUR SLOT</span>
                  <span>RECORDS COMPLETED</span>
                </div>

                <div className="space-y-2">
                  {hourlySlots.map((slot) => {
                    const slotRecs = Math.round(
                      prodSelectedDayRecs * slot.ratio,
                    );
                    const slotPct =
                      prodSelectedDayRecs > 0
                        ? Math.round(
                            (slotRecs / (prodSelectedDayRecs * 0.16)) * 100,
                          )
                        : 0;

                    return (
                      <div
                        key={slot.label}
                        className="bg-secondary/20 hover:bg-secondary/40 border-border/60 flex items-center justify-between rounded-none border p-2.5 transition-colors"
                      >
                        <span className="text-foreground text-xs font-semibold">
                          {slot.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress
                              value={Math.min(100, slotPct)}
                              className="h-1.5 rounded-none"
                            />
                          </div>
                          <span className="text-foreground font-mono text-xs font-extrabold w-12 text-right">
                            {slotRecs}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
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
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  TOTAL QC VERIFIED
                </span>
                <CheckCircle2 className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-foreground font-mono text-xl font-extrabold">
                {activePerfMetrics.qc.totalVerified}
              </div>
              <span className="text-muted-foreground block text-[11px]">
                Total verified QC records
              </span>
            </Card>

            {/* CARD 2 */}
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  MONTHLY AVG QC
                </span>
                <TrendingUp className="h-4 w-4 text-purple-500" />
              </div>
              <div className="text-foreground font-mono text-xl font-extrabold">
                {activePerfMetrics.qc.monthlyAvg}
              </div>
              <span className="text-muted-foreground block text-[11px]">
                Average verified per month
              </span>
            </Card>

            {/* CARD 3 */}
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  ACCURACY RATE
                </span>
                <Award className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-emerald-500 font-mono text-xl font-extrabold">
                {activePerfMetrics.qc.accuracyRate}
              </div>
              <span className="block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                High precision audit score
              </span>
            </Card>

            {/* CARD 4 */}
            <Card className="bg-card border-border space-y-2 rounded-none p-4 shadow-none border">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                  DEFECTS LOGGED
                </span>
                <AlertTriangle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-foreground font-mono text-xl font-extrabold">
                {activePerfMetrics.qc.defectsLogged}
              </div>
              <span className="text-muted-foreground block text-[11px]">
                Reported audit defects
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
                "bg-card flex max-w-sm cursor-pointer items-center justify-between rounded-none border p-3 transition-all",
                isQcDatePickerOpen
                  ? "border-purple-500 ring-purple-500/20 ring-1"
                  : "border-border hover:border-purple-500/50",
              )}
            >
              <span className="text-foreground font-mono text-xs font-bold">
                {formatDisplayDate(qcDateRange.start)} —{" "}
                {formatDisplayDate(qcDateRange.end)}
              </span>
              <Calendar className="h-4 w-4 text-purple-500" />
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
          <Card className="bg-secondary/40 border-border flex flex-col justify-between gap-4 rounded-none border p-5 shadow-none sm:flex-row sm:items-center">
            <div className="space-y-1">
              <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                QC RANGE SUMMARY (
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
            <div className="bg-card border-border flex items-center justify-center rounded-none border px-5 py-3">
              <span className="text-purple-500 font-mono text-lg font-extrabold">
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
            <span className="bg-secondary border-border text-foreground inline-flex items-center rounded-none border px-3 py-1 font-mono text-xs font-semibold">
              6 Sep 2026 12:10pm
            </span>
          </div>

          {/* MONTHLY QC PERFORMANCE GRAPH */}
          <Card className="bg-card border-border space-y-4 rounded-none p-6 shadow-none border">
            <div className="border-border flex flex-col justify-between gap-2 border-b pb-4 sm:flex-row sm:items-center">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-purple-500" />
                  <h3 className="text-foreground text-sm font-bold">
                    Monthly QC Performance Graph
                  </h3>
                  <span className="bg-purple-500/10 text-purple-500 border-purple-500/20 rounded-none border px-2.5 py-0.5 text-[11px] font-semibold">
                    Quality Control
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">
                  Total Quality Control Verifications Completed per Month across operational history.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="bg-purple-500 h-3 w-3 rounded-none" />
                  <span className="text-muted-foreground">
                    QC Records (Bars)
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-foreground h-0.5 w-4" />
                  <span className="text-muted-foreground">Trend Line</span>
                </div>
              </div>
            </div>

            {/* SVG GRAPH */}
            <div className="w-full overflow-x-auto pt-2">
              <div className="relative h-[260px] min-w-[700px]">
                <svg className="h-full w-full" viewBox="0 0 850 240">
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
                          fill={m.best ? "#f59e0b" : "#a855f7"}
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
                                ? "#a855f7"
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

                  <path
                    d={qcTrendPath}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

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
                              fill={isBest ? "#f59e0b" : "#a855f7"}
                            />
                            <circle cx={pt.x} cy={pt.y} r="3" fill="#ffffff" />
                          </>
                        ) : (
                          <circle
                            cx={pt.x}
                            cy={pt.y}
                            r="3.5"
                            fill="#ffffff"
                            stroke="#a855f7"
                            strokeWidth="2"
                          />
                        )}
                      </g>
                    );
                  })}

                  {hoveredQcMonthIdx >= 0 &&
                    hoveredQcMonthIdx < currentQcMonthlyData.length &&
                    (() => {
                      const activeData = currentQcMonthlyData[hoveredQcMonthIdx];
                      const activePt = qcTrendPoints[hoveredQcMonthIdx];
                      if (!activeData || !activePt) return null;
                      const tooltipWidth = 138;
                      const tooltipHeight = 40;
                      const tooltipX = Math.max(
                        tooltipWidth / 2 + 10,
                        Math.min(850 - tooltipWidth / 2 - 10, activePt.x),
                      );
                      const tooltipY = Math.max(10, activePt.y - tooltipHeight - 12);
                      const caretTipY = tooltipY + tooltipHeight + 6;

                      return (
                        <g className="pointer-events-none drop-shadow-md filter transition-all duration-150">
                          <rect
                            x={tooltipX - tooltipWidth / 2}
                            y={tooltipY}
                            width={tooltipWidth}
                            height={tooltipHeight}
                            rx={4}
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
                            fill={activeData.best ? "#fbbf24" : "#ffffff"}
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
            <Card className="bg-card border-border space-y-4 rounded-none p-5 shadow-none border">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Daily QC Performance Calendar
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 cursor-pointer rounded-none"
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
                    className="h-7 w-7 cursor-pointer rounded-none"
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
                  {Array.from({ length: qcFirstDayOfMonth }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-16" />
                  ))}

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
                            setQcCalDate((prev) => ({ ...prev, day: d }))
                          }
                          className={cn(
                            "flex h-16 cursor-pointer flex-col justify-between rounded-none border border-amber-300 bg-amber-50/60 p-1.5 text-left transition-all dark:border-amber-700 dark:bg-amber-950/20",
                            isSelected ? "ring-2 ring-amber-500/40" : "",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                              {d}
                            </span>
                            <span className="rounded-none bg-amber-200 px-1 text-[8px] font-extrabold text-amber-800 uppercase dark:bg-amber-900 dark:text-amber-200">
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
                            setQcCalDate((prev) => ({ ...prev, day: d }))
                          }
                          className={cn(
                            "flex h-16 cursor-pointer flex-col justify-between rounded-none border p-1.5 text-left transition-all",
                            isSelected
                              ? "border-purple-500 bg-purple-500/10 ring-purple-500/30 font-bold ring-2"
                              : "border-border hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-foreground text-xs font-bold">
                              {d}
                            </span>
                            <span className="bg-purple-500 h-1.5 w-1.5 rounded-none" />
                          </div>
                          <div className="text-purple-500 text-right font-mono text-[11px] font-extrabold">
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
                          setQcCalDate((prev) => ({ ...prev, day: d }))
                        }
                        className={cn(
                          "flex h-16 cursor-pointer flex-col justify-between rounded-none border p-1.5 text-left transition-all",
                          isSelected
                            ? "border-purple-500 bg-purple-500/10 ring-purple-500/30 font-bold opacity-100 ring-2"
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
            <Card className="bg-card border-border space-y-4 rounded-none p-5 shadow-none border">
              <div className="border-border flex items-center justify-between border-b pb-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                    Daily QC Productivity Breakdown
                  </h3>
                </div>
                <span className="bg-purple-500/10 text-purple-500 border-purple-500/20 inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold">
                  {qcCalDate.day}{" "}
                  {new Date(
                    qcCalDate.year,
                    qcCalDate.month,
                  ).toLocaleDateString("en-US", { month: "long" })}{" "}
                  {qcCalDate.year}
                </span>
              </div>

              {/* SUMMARY BOX */}
              <div className="bg-secondary/40 border-border flex items-center justify-between rounded-none border p-4">
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
                <div className="bg-purple-500/10 text-purple-500 flex h-9 w-9 items-center justify-center rounded-none">
                  <Zap className="h-5 w-5" />
                </div>
              </div>

              {/* SLOTS TABLE */}
              <div className="space-y-3 pt-1">
                <div className="text-muted-foreground border-border/60 flex items-center justify-between border-b pb-1.5 text-[11px] font-bold tracking-wider uppercase">
                  <span>WORKING HOUR SLOT</span>
                  <span>QC RECORDS</span>
                </div>

                <div className="space-y-2">
                  {hourlySlots.map((slot) => {
                    const slotRecs = Math.round(
                      qcSelectedDayRecs * slot.ratio,
                    );
                    const slotPct =
                      qcSelectedDayRecs > 0
                        ? Math.round(
                            (slotRecs / (qcSelectedDayRecs * 0.16)) * 100,
                          )
                        : 0;

                    return (
                      <div
                        key={slot.label}
                        className="bg-secondary/20 hover:bg-secondary/40 border-border/60 flex items-center justify-between rounded-none border p-2.5 transition-colors"
                      >
                        <span className="text-foreground text-xs font-semibold">
                          {slot.label}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24">
                            <Progress
                              value={Math.min(100, slotPct)}
                              className="h-1.5 rounded-none"
                            />
                          </div>
                          <span className="text-foreground font-mono text-xs font-extrabold w-12 text-right">
                            {slotRecs}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
