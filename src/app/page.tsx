"use client";

import { useState, Suspense } from "react";
import {
  Database,
  CheckCircle,
  Clock,
  DollarSign,
  Terminal,
  ShieldCheck,
  Loader2,
  Search,
  Bell,
  HelpCircle,
} from "lucide-react";
import { type Task } from "@/types/schema";
import { DiceDataTable } from "@/components/dice-data-table";
import { CreateRecordDialog } from "@/components/create-record-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";

const INITIAL_TASKS: Task[] = [
  {
    id: "TSK-8921",
    title: "Configure Tailwind CSS v4 Engine",
    category: "Architecture",
    status: "completed",
    priority: "urgent",
    budget: 3500,
    createdAt: "2026-08-21",
  },
  {
    id: "TSK-4102",
    title: "Implement Nuqs URL State Sync",
    category: "State Management",
    status: "completed",
    priority: "high",
    budget: 2800,
    createdAt: "2026-08-20",
  },
  {
    id: "TSK-7719",
    title: "Build Dice UI TanStack Data Table",
    category: "Frontend UI",
    status: "in_progress",
    priority: "urgent",
    budget: 4200,
    createdAt: "2026-08-21",
  },
  {
    id: "TSK-3341",
    title: "Setup Zod & React Hook Form Resolver",
    category: "Forms & Validation",
    status: "completed",
    priority: "high",
    budget: 2100,
    createdAt: "2026-08-19",
  },
  {
    id: "TSK-5520",
    title: "Configure Prettier & Husky Hooks",
    category: "DevOps / DX",
    status: "completed",
    priority: "medium",
    budget: 1200,
    createdAt: "2026-08-18",
  },
  {
    id: "TSK-9904",
    title: "Perform Edge Runtime Performance Tuning",
    category: "Optimization",
    status: "in_progress",
    priority: "medium",
    budget: 3100,
    createdAt: "2026-08-21",
  },
  {
    id: "TSK-1029",
    title: "Audit ESLint 9 Flat Config Rules",
    category: "Linting",
    status: "todo",
    priority: "low",
    budget: 950,
    createdAt: "2026-08-21",
  },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const totalBudget = tasks.reduce((sum, task) => sum + task.budget, 0);
  const completedCount = tasks.filter((t) => t.status === "completed").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-[#1E1F24] text-[#EEEEF0]">
        {/* Shadcn UI Sidebar */}
        <AppSidebar />

        {/* Main Content Workspace Inset */}
        <SidebarInset className="flex flex-1 flex-col bg-[#1E1F24]">
          {/* Top Navbar Header */}
          <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#2C2E36] bg-[#1E1F24]/90 px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-[#9E9EA5] hover:bg-[#282930] hover:text-white" />
              <div className="h-4 w-[1px] bg-[#2C2E36]" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-[#9E9EA5]">
                  Workspace
                </span>
                <span className="text-sm text-[#9E9EA5]">\</span>
                <span className="text-sm font-semibold text-white">
                  Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden w-64 md:block">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-[#9E9EA5]" />
                <Input
                  placeholder="Quick search..."
                  className="h-9 border-[#2C2E36] bg-[#25262C] pl-9 text-xs text-white placeholder:text-[#9E9EA5] focus-visible:ring-[#7C66DC]"
                />
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2C2E36] bg-[#25262C] text-[#9E9EA5] transition-colors hover:border-[#7C66DC]/40 hover:text-white">
                <Bell className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2C2E36] bg-[#25262C] text-[#9E9EA5] transition-colors hover:border-[#7C66DC]/40 hover:text-white">
                <HelpCircle className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Workspace Body */}
          <main className="flex-1 space-y-8 p-6 md:p-8">
            {/* Top Workspace Banner */}
            <div className="flex flex-col gap-4 border-b border-[#2C2E36] pb-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                    Engineering Operations
                  </h1>
                  <Badge className="border-[#7C66DC]/40 bg-[#7C66DC]/20 text-xs text-[#A492E8]">
                    Radix Dark (#1E1F24)
                  </Badge>
                </div>
                <p className="max-w-2xl text-sm text-[#9E9EA5]">
                  Manage tasks, state synchronization with Nuqs, Zod schema
                  validations, and TanStack Data Table.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreateRecordDialog onAddRecord={handleAddTask} />
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-[#2C2E36] bg-[#25262C]/80 shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#9E9EA5] uppercase">
                      Total Tasks
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {tasks.length}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#2C2E36] bg-[#25262C]/80 shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#9E9EA5] uppercase">
                      Completed
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {completedCount}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#2C2E36] bg-[#25262C]/80 shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#9E9EA5] uppercase">
                      In Progress
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      {inProgressCount}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#2C2E36] bg-[#25262C]/80 shadow-md">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#7C66DC]/30 bg-[#7C66DC]/10 text-[#A492E8]">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider text-[#9E9EA5] uppercase">
                      Total Budget
                    </p>
                    <h3 className="text-2xl font-bold text-white">
                      ${totalBudget.toLocaleString()}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table Section */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold tracking-tight text-white">
                    <Terminal className="h-4 w-4 text-[#A492E8]" /> Task
                    Directory Engine
                  </h2>
                  <p className="text-xs text-[#9E9EA5]">
                    TanStack Table with{" "}
                    <code className="font-mono font-semibold text-[#A492E8]">
                      nuqs
                    </code>{" "}
                    search params state management.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-400"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Schema Validated
                </Badge>
              </div>

              <Suspense
                fallback={
                  <div className="flex items-center justify-center rounded-xl border border-[#2C2E36] bg-[#25262C] p-12 text-[#9E9EA5]">
                    <Loader2 className="mr-2 h-5 w-5 animate-spin text-[#A492E8]" />
                    Loading search params data table...
                  </div>
                }
              >
                <DiceDataTable data={tasks} />
              </Suspense>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
