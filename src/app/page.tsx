"use client";

import { useState, useEffect, Suspense } from "react";
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
  Sun,
  Moon,
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
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

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
      <div className="bg-background text-foreground flex min-h-screen w-full transition-colors duration-200">
        {/* Shadcn UI Sidebar */}
        <AppSidebar />

        {/* Main Content Workspace Inset */}
        <SidebarInset className="bg-background flex flex-1 flex-col">
          {/* Top Navbar Header */}
          <header className="border-border bg-background/90 sticky top-0 z-10 flex h-16 items-center justify-between border-b px-6 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:bg-accent hover:text-foreground" />
              <div className="bg-border h-4 w-[1px]" />
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-sm font-medium">
                  Workspace
                </span>
                <span className="text-muted-foreground text-sm">\</span>
                <span className="text-foreground text-sm font-semibold">
                  Projects
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden w-64 md:block">
                <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <Input
                  placeholder="Quick search..."
                  className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary h-9 pl-9 text-xs"
                />
              </div>

              {/* Light / Dark Mode Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="border-border bg-secondary/40 text-foreground hover:border-primary/50 flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-medium shadow-sm transition-all"
              >
                {isDarkMode ? (
                  <>
                    <Moon className="text-primary h-4 w-4" /> Dark (#1E1F24)
                  </>
                ) : (
                  <>
                    <Sun className="h-4 w-4 text-amber-500" /> Light (#FFFFFF)
                  </>
                )}
              </button>

              <button className="border-border bg-secondary/40 text-muted-foreground hover:text-foreground hover:border-primary/40 flex h-9 w-9 items-center justify-center rounded-lg border transition-colors">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* Workspace Body */}
          <main className="flex-1 space-y-8 p-6 md:p-8">
            {/* Top Workspace Banner */}
            <div className="border-border flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-foreground text-2xl font-bold tracking-tight md:text-3xl">
                    Engineering Operations
                  </h1>
                  <Badge className="border-primary/30 bg-primary/10 text-primary text-xs font-medium">
                    Accent #3D63DD | Gray #8B8D98
                  </Badge>
                </div>
                <p className="text-muted-foreground max-w-2xl text-sm">
                  Task Directory Engine with Nuqs URL state management, Zod
                  schema validations, and TanStack Data Table.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <CreateRecordDialog onAddRecord={handleAddTask} />
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-border bg-card shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-500">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Total Tasks
                    </p>
                    <h3 className="text-foreground text-2xl font-bold">
                      {tasks.length}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Completed
                    </p>
                    <h3 className="text-foreground text-2xl font-bold">
                      {completedCount}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      In Progress
                    </p>
                    <h3 className="text-foreground text-2xl font-bold">
                      {inProgressCount}
                    </h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card shadow-sm">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="border-primary/20 bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl border">
                    <DollarSign className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
                      Total Budget
                    </p>
                    <h3 className="text-foreground text-2xl font-bold">
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
                  <h2 className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight">
                    <Terminal className="text-primary h-4 w-4" /> Task Directory
                    Engine
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    TanStack Table with{" "}
                    <code className="text-primary font-mono font-semibold">
                      nuqs
                    </code>{" "}
                    search params state management.
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="gap-1 border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> Schema Validated
                </Badge>
              </div>

              <Suspense
                fallback={
                  <div className="text-muted-foreground border-border bg-card flex items-center justify-center rounded-xl border p-12">
                    <Loader2 className="text-primary mr-2 h-5 w-5 animate-spin" />
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
