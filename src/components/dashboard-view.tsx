"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  Megaphone,
  Briefcase,
  UserCheck,
  ArrowRight,
  Trash2,
  Play,
  Pause,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock3,
  Sparkles,
} from "lucide-react";
import {
  USER_PROFILES,
  SAMPLE_PROJECTS,
  type Project,
  type UserRoleProfile,
} from "@/types/project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Announcement {
  id: string;
  title: string;
  category: "General" | "Urgent" | "Notice" | "Event";
  date: string;
  content: string;
}

type AttendanceStatus = "present" | "absent" | "holiday" | "leave" | "halfday";

interface AttendanceDetail {
  status: AttendanceStatus;
  note?: string;
  checkIn?: string;
  checkOut?: string;
}

interface DashboardViewProps {
  onNavigateToProjects?: () => void;
}

export function DashboardView({ onNavigateToProjects }: DashboardViewProps) {
  const [userCode] = useQueryState("user", parseAsString.withDefault("ADMIN"));

  const currentUser: UserRoleProfile =
    USER_PROFILES.find((u) => u.code === userCode) || USER_PROFILES[0];

  // User extended profile info
  const userMetadata = useMemo(() => {
    if (currentUser.code === "EMP39" || currentUser.name.includes("Sahara")) {
      return {
        designation: "Intern Frontend Developer",
        employeeId: "EMP39",
        workplace: "Office - Dehradun",
        joiningDate: "2024-09-10",
        reportingManager: "Dehradun Kumar",
        presentAddress: "moths mothass dehradun, fehradun - 248121",
      };
    } else if (currentUser.role === "admin") {
      return {
        designation: "Lead Systems Architect",
        employeeId: "ADMIN-01",
        workplace: "HQ - Dehradun",
        joiningDate: "2023-01-15",
        reportingManager: "Executive Director",
        presentAddress: "Suite 402, Technology Park, Dehradun - 248001",
      };
    } else {
      return {
        designation: "Senior Project Manager",
        employeeId: currentUser.code,
        workplace: "Office - Dehradun",
        joiningDate: "2024-02-01",
        reportingManager: "Dehradun Kumar",
        presentAddress: "Rajpur Road, Dehradun - 248001",
      };
    }
  }, [currentUser]);

  // Check-in & Timer state
  const [isCheckedIn, setIsCheckedIn] = useState(true);
  const [checkInTime, setCheckInTime] = useState("12:35:13 PM");
  const [timerSeconds, setTimerSeconds] = useState(6158); // 01:42:38 initial

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCheckedIn) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCheckedIn]);

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hrs).padStart(2, "0")}:${String(mins).padStart(
      2,
      "0",
    )}:${String(secs).padStart(2, "0")}`;
  };

  const handleToggleCheckIn = () => {
    if (isCheckedIn) {
      setIsCheckedIn(false);
    } else {
      const now = new Date();
      setCheckInTime(
        now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
      setIsCheckedIn(true);
    }
  };

  // FULLY FUNCTIONAL DYNAMIC CALENDAR STATE
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(7); // 0-indexed: 7 = August 2026
  const [selectedDateKey, setSelectedDateKey] = useState("2026-08-24");

  // Attendance Records Map (keyed by "YYYY-MM-DD")
  const [attendanceMap, setAttendanceMap] = useState<
    Record<string, AttendanceDetail>
  >({
    "2026-08-03": { status: "absent", note: "Unexcused Absence" },
    "2026-08-04": { status: "absent", note: "Unexcused Absence" },
    "2026-08-05": { status: "absent", note: "Unexcused Absence" },
    "2026-08-06": { status: "absent", note: "Unexcused Absence" },
    "2026-08-07": { status: "absent", note: "Unexcused Absence" },
    "2026-08-10": { status: "absent", note: "Unexcused Absence" },
    "2026-08-11": { status: "absent", note: "Unexcused Absence" },
    "2026-08-12": { status: "absent", note: "Unexcused Absence" },
    "2026-08-13": { status: "absent", note: "Unexcused Absence" },
    "2026-08-14": { status: "absent", note: "Unexcused Absence" },
    "2026-08-17": { status: "absent", note: "Unexcused Absence" },
    "2026-08-18": { status: "absent", note: "Unexcused Absence" },
    "2026-08-19": { status: "absent", note: "Unexcused Absence" },
    "2026-08-20": { status: "absent", note: "Unexcused Absence" },
    "2026-08-21": { status: "absent", note: "Unexcused Absence" },
    "2026-08-24": {
      status: "present",
      checkIn: "12:35:13 PM",
      note: "Shift active",
    },
    "2026-08-25": { status: "leave", note: "Approved Casual Leave" },
    "2026-08-26": { status: "halfday", note: "Half-day Afternoon Leave" },
    "2026-08-27": { status: "holiday", note: "Janmashtami Holiday" },
  });

  // Calendar calculations
  const monthDate = useMemo(
    () => new Date(calendarYear, calendarMonth, 1),
    [calendarYear, calendarMonth],
  );

  const monthTitle = useMemo(
    () =>
      monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [monthDate],
  );

  const daysInMonth = useMemo(
    () => new Date(calendarYear, calendarMonth + 1, 0).getDate(),
    [calendarYear, calendarMonth],
  );

  // Offset for Monday week start (0 = Mon, 6 = Sun)
  const startOffset = useMemo(() => {
    const day = new Date(calendarYear, calendarMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [calendarYear, calendarMonth]);

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  };

  const handleTodayClick = () => {
    setCalendarYear(2026);
    setCalendarMonth(7); // August 2026
    setSelectedDateKey("2026-08-24");
  };

  // Selected date details
  const selectedDetail = attendanceMap[selectedDateKey];
  const selectedDateFormatted = useMemo(() => {
    if (!selectedDateKey) return "";
    const [y, m, d] = selectedDateKey.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [selectedDateKey]);

  // Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isAddAnnouncementOpen, setIsAddAnnouncementOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] =
    useState<Announcement["category"]>("General");
  const [newContent, setNewContent] = useState("");

  const handleAddAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: Announcement = {
      id: `ann-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      content: newContent || "Important update regarding workspace guidelines.",
    };

    setAnnouncements((prev) => [item, ...prev]);
    setNewTitle("");
    setNewContent("");
    setIsAddAnnouncementOpen(false);
  };

  const handleDeleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Filter projects relevant to currentUser
  const userProjects: Project[] = useMemo(() => {
    if (currentUser.role === "admin") {
      return SAMPLE_PROJECTS.slice(0, 3);
    }
    const assigned = SAMPLE_PROJECTS.filter(
      (p) =>
        p.managerCode === currentUser.code ||
        p.managerName.toLowerCase().includes(currentUser.name.toLowerCase()),
    );
    if (assigned.length > 0) return assigned;
    return SAMPLE_PROJECTS.slice(0, 2);
  }, [currentUser]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Top Header Banner */}
      <div className="border-border bg-card flex flex-col justify-between gap-4 border p-5 shadow-xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              Dashboard Workspace
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs font-semibold"
            >
              Live Sync
            </Badge>
          </div>
          <p className="text-muted-foreground text-xs">
            Welcome back,{" "}
            <span className="text-foreground font-semibold">
              {currentUser.name}
            </span>
            . Here is your daily attendance and project overview.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="border-border bg-background text-muted-foreground flex items-center gap-2 border px-3 py-1.5 text-xs">
            <Clock className="text-primary h-3.5 w-3.5" />
            <span>
              {new Date().toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* TOP ROW GRID: Profile Card (Left), Attendance Widget (Center), Calendar Widget (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 1. EMPLOYEE PROFILE CARD (4 Cols) */}
        <Card className="bg-card border-border flex flex-col justify-between rounded-none border p-5 shadow-none lg:col-span-4">
          <div className="flex flex-col gap-5">
            {/* Header: User Avatar & Basic Info */}
            <div className="flex items-start gap-4">
              <div className="border-primary/40 bg-primary/10 text-primary flex h-16 w-16 shrink-0 items-center justify-center border text-lg font-bold shadow-sm">
                {currentUser.avatar}
              </div>
              <div className="flex min-w-0 flex-col">
                <h2 className="text-foreground truncate text-base font-bold">
                  {currentUser.name}
                </h2>
                <p className="text-primary truncate text-xs font-medium">
                  {userMetadata.designation}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <Badge
                    variant="outline"
                    className="border-border bg-secondary/50 text-muted-foreground rounded-none text-[10px]"
                  >
                    {userMetadata.employeeId}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="bg-border/60 h-px w-full" />

            {/* Profile Detail Grid */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Employee ID
                </span>
                <span className="text-foreground font-semibold">
                  {userMetadata.employeeId}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Workplace
                </span>
                <span className="text-foreground block truncate font-semibold">
                  {userMetadata.workplace}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Joining Date
                </span>
                <span className="text-foreground font-semibold">
                  {userMetadata.joiningDate}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">
                  Reporting Manager
                </span>
                <span className="text-foreground block truncate font-semibold">
                  {userMetadata.reportingManager}
                </span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block text-[11px]">
                Present Address
              </span>
              <span className="text-foreground mt-0.5 block text-xs leading-relaxed font-medium">
                {userMetadata.presentAddress}
              </span>
            </div>
          </div>
        </Card>

        {/* 2. ATTENDANCE CLOCK-IN CARD (4 Cols) */}
        <Card className="bg-card border-border flex flex-col justify-between rounded-none border p-5 shadow-none lg:col-span-4">
          <div className="flex flex-col gap-4">
            {/* Status Header */}
            <div className="border-border bg-secondary/40 flex items-center justify-between border p-3">
              <div className="text-foreground flex items-center gap-2 text-xs font-medium">
                <Clock className="text-primary h-4 w-4" />
                <span>Attendance : 24 Aug, 2026</span>
              </div>
              <Badge
                className={cn(
                  "rounded-none border px-2 py-0.5 text-[10px] font-bold uppercase",
                  isCheckedIn
                    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-500"
                    : "border-muted bg-secondary text-muted-foreground",
                )}
              >
                {isCheckedIn ? "Active Shift" : "Shift Ended"}
              </Badge>
            </div>

            {/* Timer Counter Display */}
            <div className="border-border bg-background flex flex-col items-center justify-center border py-6">
              <div className="text-destructive font-mono text-3xl font-bold tracking-widest">
                {formatTimer(timerSeconds)}
              </div>
              <div className="text-muted-foreground mt-2 text-xs">
                Check in :{" "}
                <span className="text-foreground font-semibold">
                  {checkInTime}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toggle Button */}
          <div className="mt-4">
            <Button
              onClick={handleToggleCheckIn}
              variant={isCheckedIn ? "destructive" : "default"}
              className="w-full rounded-none py-5 text-xs font-semibold shadow-none transition-all"
            >
              {isCheckedIn ? (
                <>
                  <Pause className="mr-2 h-4 w-4" /> Check Out
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" /> Check In
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* 3. ATTENDANCE CALENDAR WIDGET (4 Cols) */}
        <Card className="bg-card border-border flex flex-col rounded-none border p-5 shadow-none lg:col-span-4">
          {/* Calendar Header with Dynamic Month Navigation */}
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="text-muted-foreground hover:text-foreground border-border/40 h-7 w-7 rounded-none border"
                title="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="text-muted-foreground hover:text-foreground border-border/40 h-7 w-7 rounded-none border"
                title="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <span className="text-foreground text-xs font-bold tracking-wide">
              {monthTitle}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleTodayClick}
              className="border-border h-7 rounded-none px-2 text-[10px] font-medium"
            >
              Today
            </Button>
          </div>

          {/* Legend Items */}
          <div className="border-border/60 mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b pb-2.5 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Present</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-destructive h-2 w-2 rounded-full" />
              <span className="text-muted-foreground">Absent</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Holiday</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-muted-foreground">Leave</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Half Day</span>
            </div>
          </div>

          {/* Day Headers */}
          <div className="text-muted-foreground mb-1.5 grid grid-cols-7 gap-1 text-center text-[10px] font-semibold">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>

          {/* Dynamic Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs">
            {/* Blank leading slots */}
            {Array.from({ length: startOffset }, (_, idx) => (
              <div key={`offset-${idx}`} className="min-h-[30px] p-1" />
            ))}

            {/* Month Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `${calendarYear}-${String(
                calendarMonth + 1,
              ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;

              const record = attendanceMap[dateStr];
              const isSelected = selectedDateKey === dateStr;
              const isToday = dateStr === "2026-08-24";

              return (
                <button
                  key={dateStr}
                  onClick={() => setSelectedDateKey(dateStr)}
                  className={cn(
                    "relative flex min-h-[30px] cursor-pointer flex-col items-center justify-center rounded-none border p-1 text-[11px] transition-all",
                    isSelected
                      ? "border-primary bg-primary/20 text-primary ring-primary font-bold ring-1"
                      : isToday
                        ? "border-primary/50 bg-primary/10 text-primary font-semibold"
                        : "border-border/40 hover:bg-secondary/60 text-foreground",
                  )}
                >
                  <span>{dayNum}</span>

                  {/* Dynamic Status Indicator Dot */}
                  {record?.status === "present" && (
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                  {record?.status === "absent" && (
                    <span className="bg-destructive mt-0.5 h-1.5 w-1.5 rounded-full" />
                  )}
                  {record?.status === "holiday" && (
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-purple-500" />
                  )}
                  {record?.status === "leave" && (
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                  {record?.status === "halfday" && (
                    <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                  )}
                </button>
              );
            })}
          </div>

          {/* SELECTED DATE DETAILS & MARK ATTENDANCE BAR */}
          <div className="border-border bg-background mt-4 flex flex-col gap-2 border p-3">
            <div className="flex items-center justify-between">
              <div className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
                <CalendarIcon className="text-primary h-3.5 w-3.5" />
                <span>{selectedDateFormatted}</span>
              </div>
              {selectedDetail ? (
                <Badge
                  className={cn(
                    "rounded-none border px-1.5 py-0 text-[10px] font-bold uppercase",
                    selectedDetail.status === "present" &&
                      "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                    selectedDetail.status === "absent" &&
                      "border-destructive/30 bg-destructive/10 text-destructive",
                    selectedDetail.status === "holiday" &&
                      "border-purple-500/30 bg-purple-500/10 text-purple-500",
                    selectedDetail.status === "leave" &&
                      "border-blue-500/30 bg-blue-500/10 text-blue-500",
                    selectedDetail.status === "halfday" &&
                      "border-amber-500/30 bg-amber-500/10 text-amber-500",
                  )}
                >
                  {selectedDetail.status}
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-muted-foreground rounded-none text-[10px]"
                >
                  No Record
                </Badge>
              )}
            </div>

            {selectedDetail?.note && (
              <p className="text-muted-foreground text-[10px] italic">
                {selectedDetail.note}
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* BOTTOM ROW GRID: My Projects (Left), Announcements (Right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* 4. MY PROJECTS SECTION (7 Cols) */}
        <Card className="bg-card border-border flex flex-col rounded-none border p-5 shadow-none lg:col-span-7">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Briefcase className="text-primary h-4 w-4" />
              <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
                My Projects
              </h2>
              <Badge
                variant="outline"
                className="border-border rounded-none text-[10px]"
              >
                {userProjects.length}
              </Badge>
            </div>
            {onNavigateToProjects && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToProjects}
                className="text-primary hover:text-primary/80 flex h-7 cursor-pointer items-center gap-1 rounded-none p-0 text-xs font-medium"
              >
                View Workspace <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {userProjects.map((project) => (
              <div
                key={project.id}
                className="border-border bg-background hover:border-primary/40 flex flex-col justify-between gap-4 border p-4 transition-all sm:flex-row sm:items-center"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-foreground text-sm font-bold">
                      {project.name}
                    </span>
                    <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none py-0 text-[10px] font-semibold">
                      {project.stageGroup}
                    </Badge>
                  </div>
                  <div className="text-muted-foreground mt-0.5 flex items-center gap-3 text-xs">
                    <span>
                      Stage:{" "}
                      <strong className="text-foreground">
                        {project.stage}
                      </strong>
                    </span>
                    <span>
                      Started on:{" "}
                      <strong className="text-foreground">
                        {project.periodStart}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Badge
                    variant="outline"
                    className="border-primary/40 bg-primary/10 text-primary rounded-none text-[10px]"
                  >
                    Current sprint
                  </Badge>

                  {/* Manager Avatar */}
                  <div className="border-border bg-secondary/30 flex items-center gap-1.5 border px-2 py-1">
                    <div className="bg-primary/20 text-primary flex h-5 w-5 items-center justify-center rounded-none text-[9px] font-bold">
                      {project.managerName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="text-foreground text-[11px] font-medium">
                      {project.managerName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 5. ANNOUNCEMENTS SECTION (5 Cols) */}
        <Card className="bg-card border-border flex flex-col rounded-none border p-5 shadow-none lg:col-span-5">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Megaphone className="text-primary h-4 w-4" />
              <h2 className="text-foreground text-sm font-bold tracking-wider uppercase">
                Announcements
              </h2>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsAddAnnouncementOpen(true)}
              className="border-border hover:border-primary text-foreground h-7 w-7 cursor-pointer rounded-none shadow-none"
              title="Add Announcement"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Announcement List or Empty State */}
          <div className="flex min-h-[160px] flex-1 flex-col justify-center">
            {announcements.length === 0 ? (
              <div className="border-border/70 bg-background flex flex-col items-center justify-center border border-dashed p-6 text-center">
                <div className="border-primary/30 bg-primary/10 text-primary mb-2 flex h-10 w-10 items-center justify-center rounded-none border">
                  <Megaphone className="h-5 w-5" />
                </div>
                <h3 className="text-foreground text-xs font-bold">
                  No announcements yet
                </h3>
                <p className="text-muted-foreground mt-1 max-w-xs text-[11px]">
                  Important updates and notices will appear here. Click the +
                  button to broadcast a new notice.
                </p>
              </div>
            ) : (
              <div className="flex max-h-[220px] flex-col gap-3 overflow-y-auto pr-1">
                {announcements.map((item) => (
                  <div
                    key={item.id}
                    className="border-border bg-background flex items-start justify-between gap-3 border p-3"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          className={cn(
                            "rounded-none border px-1 py-0 text-[9px]",
                            item.category === "Urgent"
                              ? "border-destructive/40 bg-destructive/10 text-destructive"
                              : "border-primary/40 bg-primary/10 text-primary",
                          )}
                        >
                          {item.category}
                        </Badge>
                        <span className="text-foreground truncate text-xs font-bold">
                          {item.title}
                        </span>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 text-[11px]">
                        {item.content}
                      </p>
                      <span className="text-muted-foreground/70 mt-1 text-[10px]">
                        Posted on {item.date}
                      </span>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteAnnouncement(item.id)}
                      className="text-muted-foreground hover:text-destructive h-6 w-6 shrink-0 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* CREATE ANNOUNCEMENT DIALOG */}
      <Dialog
        open={isAddAnnouncementOpen}
        onOpenChange={setIsAddAnnouncementOpen}
      >
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Create New Announcement
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddAnnouncement} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Title</Label>
              <Input
                required
                placeholder="e.g., Q3 Team All-Hands Meeting"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Category</Label>
              <select
                value={newCategory}
                onChange={(e) =>
                  setNewCategory(e.target.value as Announcement["category"])
                }
                className="bg-background border-border text-foreground focus:border-primary w-full border p-2 text-xs outline-none"
              >
                <option value="General">General</option>
                <option value="Urgent">Urgent</option>
                <option value="Notice">Notice</option>
                <option value="Event">Event</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Content</Label>
              <textarea
                rows={3}
                placeholder="Write the announcement description..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full resize-none border p-2 text-xs outline-none"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddAnnouncementOpen(false)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs"
              >
                Broadcast Announcement
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
