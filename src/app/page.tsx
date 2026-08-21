"use client";

import { useState, Suspense } from "react";
import {
  Layers,
  Sparkles,
  Database,
  CheckCircle,
  Clock,
  DollarSign,
  Terminal,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { type Task } from "@/types/schema";
import { DiceDataTable } from "@/components/dice-data-table";
import { CreateRecordDialog } from "@/components/create-record-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <main className="from-background via-background/95 to-secondary/20 min-h-screen bg-gradient-to-b px-4 py-8 md:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header */}
        <div className="border-border/60 flex flex-col gap-4 border-b pb-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="border-primary/30 bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-lg border shadow-inner">
                <Layers className="h-5 w-5" />
              </div>
              <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent md:text-3xl">
                Project EPD Dashboard
              </h1>
              <Badge className="border-primary/30 bg-primary/20 text-primary text-xs font-semibold">
                v1.0.0
              </Badge>
            </div>
            <p className="text-muted-foreground max-w-2xl text-sm">
              Production-ready stack featuring Next.js (App Router), TypeScript,
              Tailwind CSS v4, Shadcn-ui, Zod, Nuqs, TanStack & Dice Data Table,
              React Hook Form, ESLint, Husky, Prettier, and pnpm.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <CreateRecordDialog onAddRecord={handleAddTask} />
          </div>
        </div>

        {/* Tech Stack Badges Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-muted-foreground mr-1 flex items-center gap-1 font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Active Tech
            Stack:
          </span>
          {[
            "Next.js 16",
            "TypeScript",
            "Tailwind CSS v4",
            "Shadcn UI",
            "Zod",
            "Nuqs State Manager",
            "TanStack Table",
            "Dice UI Pattern",
            "React Hook Form",
            "Husky Hooks",
            "Prettier",
            "pnpm",
          ].map((tech) => (
            <Badge
              key={tech}
              variant="outline"
              className="border-border/80 bg-secondary/40 text-foreground/80 font-normal"
            >
              {tech}
            </Badge>
          ))}
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60 bg-card/50 shadow-md backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
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

          <Card className="border-border/60 bg-card/50 shadow-md backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
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

          <Card className="border-border/60 bg-card/50 shadow-md backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
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

          <Card className="border-border/60 bg-card/50 shadow-md backdrop-blur">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 text-purple-400">
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

        {/* Dice UI / TanStack Data Table Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-foreground flex items-center gap-2 text-lg font-bold tracking-tight">
                <Terminal className="text-primary h-4 w-4" /> Task Directory
                Engine
              </h2>
              <p className="text-muted-foreground text-xs">
                TanStack Table integrated with{" "}
                <code className="text-primary font-mono font-semibold">
                  nuqs
                </code>{" "}
                URL state search parameters.
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
              <div className="text-muted-foreground border-border flex items-center justify-center rounded-xl border p-12">
                <Loader2 className="text-primary mr-2 h-5 w-5 animate-spin" />
                Loading search params data table...
              </div>
            }
          >
            <DiceDataTable data={tasks} />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
