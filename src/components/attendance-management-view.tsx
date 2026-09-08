"use client";

import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AttendanceStatusType = "P" | "A" | "L" | "H" | "GH" | "none";

interface EmployeeAttendanceRecord {
  id: string;
  name: string;
  avatar: string;
  branch: string;
  days: { [day: number]: AttendanceStatusType };
}

const INITIAL_EMPLOYEES: EmployeeAttendanceRecord[] = [
  {
    id: "emp-1",
    name: "Elena Vance",
    avatar: "EV",
    branch: "Bengaluru HQ",
    days: {
      3: "P",
      4: "P",
      5: "P",
      6: "P",
      7: "P",
      10: "P",
      11: "P",
      12: "P",
      13: "P",
      14: "P",
      15: "GH",
      17: "P",
      18: "P",
      19: "P",
      20: "P",
      21: "P",
      24: "P",
      25: "P",
      26: "P",
      27: "P",
      28: "P",
      31: "P",
    },
  },
  {
    id: "emp-2",
    name: "Julian Thorne",
    avatar: "JT",
    branch: "Bengaluru HQ",
    days: {
      3: "P",
      4: "P",
      5: "P",
      6: "P",
      7: "P",
      10: "P",
      11: "P",
      12: "P",
      13: "P",
      14: "P",
      15: "GH",
      17: "P",
      18: "L",
      19: "P",
      20: "P",
      21: "P",
      24: "P",
      25: "P",
      26: "P",
      27: "P",
      28: "P",
      31: "P",
    },
  },
  {
    id: "emp-3",
    name: "Sarah Chen",
    avatar: "SC",
    branch: "Hyderabad Tech Hub",
    days: {
      3: "P",
      4: "P",
      5: "A",
      6: "P",
      7: "P",
      10: "P",
      11: "P",
      12: "H",
      13: "P",
      14: "P",
      15: "GH",
      17: "P",
      18: "P",
      19: "P",
      20: "P",
      21: "P",
      24: "P",
      25: "P",
      26: "P",
      27: "P",
      28: "P",
      31: "P",
    },
  },
  {
    id: "emp-4",
    name: "Wei Lin",
    avatar: "WL",
    branch: "Hyderabad Tech Hub",
    days: {
      3: "P",
      4: "P",
      5: "P",
      6: "P",
      7: "P",
      10: "P",
      11: "P",
      12: "P",
      13: "P",
      14: "P",
      15: "GH",
      17: "P",
      18: "P",
      19: "P",
      20: "P",
      21: "P",
      24: "P",
      25: "P",
      26: "P",
      27: "P",
      28: "P",
      31: "P",
    },
  },
  {
    id: "emp-5",
    name: "Marcus Okafor",
    avatar: "MO",
    branch: "Dehradun Office",
    days: {
      3: "P",
      4: "P",
      5: "P",
      6: "P",
      7: "P",
      10: "P",
      11: "P",
      12: "P",
      13: "P",
      14: "P",
      15: "GH",
      17: "P",
      18: "P",
      19: "P",
      20: "P",
      21: "P",
      24: "P",
      25: "P",
      26: "P",
      27: "P",
      28: "P",
      31: "P",
    },
  },
];

// August 2026 Day-of-week mapping for 1 to 31
const MONTH_DAYS_2026_AUG = [
  { day: 1, dow: "S" },
  { day: 2, dow: "S" },
  { day: 3, dow: "M" },
  { day: 4, dow: "T" },
  { day: 5, dow: "W" },
  { day: 6, dow: "T" },
  { day: 7, dow: "F" },
  { day: 8, dow: "S" },
  { day: 9, dow: "S" },
  { day: 10, dow: "M" },
  { day: 11, dow: "T" },
  { day: 12, dow: "W" },
  { day: 13, dow: "T" },
  { day: 14, dow: "F" },
  { day: 15, dow: "S" },
  { day: 16, dow: "S" },
  { day: 17, dow: "M" },
  { day: 18, dow: "T" },
  { day: 19, dow: "W" },
  { day: 20, dow: "T" },
  { day: 21, dow: "F" },
  { day: 22, dow: "S" },
  { day: 23, dow: "S" },
  { day: 24, dow: "M" },
  { day: 25, dow: "T" },
  { day: 26, dow: "W" },
  { day: 27, dow: "T" },
  { day: 28, dow: "F" },
  { day: 29, dow: "S" },
  { day: 30, dow: "S" },
  { day: 31, dow: "M" },
];

export function AttendanceManagementView() {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(7); // August (0-indexed 7)
  const [currentYear, setCurrentYear] = useState(2026);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");

  const [employees, setEmployees] =
    useState<EmployeeAttendanceRecord[]>(INITIAL_EMPLOYEES);

  const monthsList = [
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

  const handlePrevMonth = () => {
    if (currentMonthIndex === 0) {
      setCurrentMonthIndex(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonthIndex((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonthIndex === 11) {
      setCurrentMonthIndex(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonthIndex((m) => m + 1);
    }
  };

  // Cycle status for cell click: none -> P -> A -> L -> H -> GH -> none
  const handleCellClick = (employeeId: string, day: number) => {
    setEmployees((prev) =>
      prev.map((emp) => {
        if (emp.id !== employeeId) return emp;
        const currentStatus = emp.days[day] || "none";
        let nextStatus: AttendanceStatusType = "P";
        if (currentStatus === "none") nextStatus = "P";
        else if (currentStatus === "P") nextStatus = "A";
        else if (currentStatus === "A") nextStatus = "L";
        else if (currentStatus === "L") nextStatus = "H";
        else if (currentStatus === "H") nextStatus = "GH";
        else if (currentStatus === "GH") nextStatus = "none";

        const updatedDays = { ...emp.days };
        if (nextStatus === "none") {
          delete updatedDays[day];
        } else {
          updatedDays[day] = nextStatus;
        }

        return { ...emp, days: updatedDays };
      }),
    );
  };

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.avatar.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesBranch =
        selectedBranch === "All Branches" || emp.branch === selectedBranch;
      return matchesSearch && matchesBranch;
    });
  }, [employees, searchQuery, selectedBranch]);

  // Metrics summary based on day 27 (or today's status)
  const todayDayNum = 27;
  const todayPresentCount = useMemo(
    () =>
      filteredEmployees.filter(
        (e) => e.days[todayDayNum] === "P" || e.days[todayDayNum] === "H",
      ).length,
    [filteredEmployees],
  );

  const todayAbsentCount = useMemo(
    () => filteredEmployees.filter((e) => e.days[todayDayNum] === "A").length,
    [filteredEmployees],
  );

  const todayLeaveCount = useMemo(
    () => filteredEmployees.filter((e) => e.days[todayDayNum] === "L").length,
    [filteredEmployees],
  );

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col gap-6 p-6">
      {/* HEADER TITLE & SUBTITLE */}
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Attendance
        </h1>
        <p className="text-muted-foreground text-xs font-medium">
          Tap a cell to cycle status: Present &rarr; Absent &rarr; Leave &rarr;
          Half-day. Overtime auto-tracked.
        </p>
      </div>

      {/* TOP METRIC CARDS GRID (4 CARDS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* TODAY'S PRESENT */}
        <Card className="bg-card border-border relative flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Today&apos;s Present
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            {todayPresentCount}
          </div>
        </Card>

        {/* TODAY'S ABSENT */}
        <Card className="bg-card border-border relative flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Today&apos;s Absent
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            {todayAbsentCount}
          </div>
        </Card>

        {/* TODAY'S ON LEAVE */}
        <Card className="bg-card border-border relative flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Today&apos;s On Leave
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            {todayLeaveCount}
          </div>
        </Card>

        {/* WORKING DAYS SUMMARY */}
        <Card className="bg-card border-border relative flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Working Days Summary
            </span>
            <span className="bg-foreground h-2 w-2 shrink-0 rounded-full" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            31 Days
          </div>
        </Card>
      </div>

      {/* MAIN CONTAINER CARD FOR CONTROL BAR & MATRIX TABLE */}
      <Card className="bg-card border-border flex flex-col gap-5 rounded-none p-5 shadow-xs">
        {/* CONTROL BAR: MONTH SELECTOR, SEARCH, BRANCH FILTER & LEGEND */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* LEFT CONTROLS: Month Navigation, Search & Branch Select */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Month Navigation */}
            <div className="border-border bg-background flex items-center rounded-none border shadow-2xs">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer rounded-none"
                title="Previous Month"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-foreground min-w-[110px] px-4 py-1 text-center text-xs font-bold select-none">
                {monthsList[currentMonthIndex]} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="text-muted-foreground hover:text-foreground h-8 w-8 cursor-pointer rounded-none"
                title="Next Month"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Employee Search */}
            <div className="relative w-56">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                placeholder="Search employee..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border focus-visible:ring-primary h-8 rounded-none pl-8 text-xs shadow-2xs"
              />
            </div>

            {/* Branch Selector */}
            <div className="relative">
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary h-8 cursor-pointer appearance-none rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
              >
                <option value="All Branches">All Branches</option>
                <option value="Bengaluru HQ">Bengaluru HQ</option>
                <option value="Hyderabad Tech Hub">Hyderabad Tech Hub</option>
                <option value="Dehradun Office">Dehradun Office</option>
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5" />
            </div>
          </div>

          {/* RIGHT CONTROLS: STATUS LEGEND BADGES */}
          <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-[11px] font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Present (P)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              <span>Absent (A)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Leave (L)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span>Half-Day (H)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Govt Holiday (GH)</span>
            </div>
          </div>
        </div>

        {/* MONTHLY ATTENDANCE MATRIX TABLE */}
        <div className="border-border/80 bg-background overflow-x-auto border select-none">
          <table className="w-full min-w-[1000px] border-collapse text-left">
            <thead>
              <tr className="border-border/80 bg-card/60 border-b">
                <th className="text-muted-foreground bg-card border-border/60 sticky left-0 z-10 w-44 border-r px-3 py-2.5 text-[10px] font-bold tracking-wider uppercase">
                  Employee
                </th>
                {MONTH_DAYS_2026_AUG.map((item) => (
                  <th
                    key={item.day}
                    className="border-border/40 min-w-[30px] border-r px-1 py-1 text-center font-mono"
                  >
                    <div className="text-foreground text-[10px] font-bold">
                      {item.day}
                    </div>
                    <div className="text-muted-foreground/70 text-[9px] uppercase">
                      {item.dow}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y">
              {filteredEmployees.map((emp) => (
                <tr
                  key={emp.id}
                  className="hover:bg-secondary/30 transition-colors"
                >
                  {/* EMPLOYEE COLUMN (Sticky Left) */}
                  <td className="text-foreground bg-background border-border/60 sticky left-0 z-10 border-r px-3 py-2.5 text-xs font-semibold">
                    <div className="flex items-center gap-2">
                      <div className="bg-secondary border-border/80 text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold">
                        {emp.avatar}
                      </div>
                      <span className="text-foreground truncate text-xs font-semibold">
                        {emp.name}
                      </span>
                    </div>
                  </td>

                  {/* 31 DAY CELL COLUMNS */}
                  {MONTH_DAYS_2026_AUG.map((item) => {
                    const status = emp.days[item.day] || "none";
                    return (
                      <td
                        key={item.day}
                        onClick={() => handleCellClick(emp.id, item.day)}
                        className="border-border/40 hover:bg-primary/10 cursor-pointer border-r px-0.5 py-1.5 text-center align-middle transition-colors"
                        title={`Day ${item.day}: Click to cycle status (${status})`}
                      >
                        <div className="flex h-6 items-center justify-center">
                          {status === "P" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-emerald-600 text-[10px] font-bold text-white shadow-2xs">
                              P
                            </span>
                          )}
                          {status === "A" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-rose-600 text-[10px] font-bold text-white shadow-2xs">
                              A
                            </span>
                          )}
                          {status === "L" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-amber-500 text-[10px] font-bold text-white shadow-2xs">
                              L
                            </span>
                          )}
                          {status === "H" && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-xs bg-sky-500 text-[10px] font-bold text-white shadow-2xs">
                              H
                            </span>
                          )}
                          {status === "GH" && (
                            <span className="flex h-5 w-6 items-center justify-center rounded-xs border border-purple-500/30 bg-purple-500/20 text-[9px] font-bold text-purple-400">
                              GH
                            </span>
                          )}
                          {status === "none" && (
                            <span className="text-muted-foreground/40 text-xs font-bold">
                              .
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
