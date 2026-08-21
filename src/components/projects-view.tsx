"use client";

import { useState, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  Search,
  Plus,
  Filter,
  X,
  Pencil,
  Trash2,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import {
  SAMPLE_PROJECTS,
  type Project,
  type ProjectStage,
} from "@/types/project";
import { AddProjectDialog } from "@/components/add-project-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STAGE_GROUPS: { name: ProjectStage; dotColor: string }[] = [
  { name: "New", dotColor: "bg-amber-400" },
  { name: "In Discovery", dotColor: "bg-emerald-400" },
  { name: "Sprint Planning", dotColor: "bg-slate-400" },
  { name: "In Development", dotColor: "bg-[#7C66DC]" },
];

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(SAMPLE_PROJECTS);

  // URL state management with nuqs
  const [activeTab, setActiveTab] = useQueryState(
    "tab",
    parseAsString.withDefault("client_projects"),
  );
  const [searchQuery, setSearchQuery] = useQueryState(
    "q",
    parseAsString.withDefault(""),
  );

  const handleAddProject = (newProject: Project) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  // Filter projects by search query & tab
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.managerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.managerCode.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        activeTab === "client_projects"
          ? project.clientType === "client"
          : activeTab === "in_house_projects"
            ? project.clientType === "in_house"
            : true;

      return matchesSearch && matchesTab;
    });
  }, [projects, searchQuery, activeTab]);

  return (
    <div className="bg-background text-foreground flex h-screen flex-col overflow-hidden">
      {/* SOLID OPAQUE FIXED TOP HEADER SECTION */}
      <div className="border-border bg-background relative z-20 shrink-0 border-b shadow-sm">
        {/* Top Controls Bar */}
        <div className="border-border bg-card flex flex-col gap-3 border-b px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-lg font-bold tracking-tight">
                Manage Project
              </h1>
              <Badge
                variant="secondary"
                className="rounded-none px-2 py-0.5 text-xs font-semibold"
              >
                2
              </Badge>
            </div>

            <div className="bg-border hidden h-4 w-[1px] sm:block" />

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-8 rounded-none text-xs"
              >
                ...
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-border h-8 gap-1 rounded-none text-xs font-medium"
              >
                <Filter className="mr-1 h-3 w-3" /> Filter
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery(null)}
                className="text-muted-foreground hover:text-foreground h-8 rounded-none text-xs"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Right Search & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative w-full max-w-xs sm:w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-3 h-3.5 w-3.5" />
              <Input
                placeholder="Find projects here"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value || null)}
                className="bg-secondary/50 border-border focus-visible:ring-primary h-8 rounded-none pr-7 pl-8 text-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery(null)}
                  className="text-muted-foreground hover:text-foreground absolute top-2 right-2"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="border-border h-8 rounded-none text-xs font-medium"
            >
              <Plus className="mr-1 h-3 w-3" /> Add Clients
            </Button>

            <AddProjectDialog onAddProject={handleAddProject} />
          </div>
        </div>

        {/* Project Types Tabs Header */}
        <div className="bg-card px-6 pt-2">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="h-10 space-x-6 border-b-0 bg-transparent p-0">
              <TabsTrigger
                value="client_projects"
                className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-semibold transition-all data-[state=active]:bg-transparent"
              >
                Client Projects
              </TabsTrigger>
              <TabsTrigger
                value="in_house_projects"
                className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-semibold transition-all data-[state=active]:bg-transparent"
              >
                In House Projects
              </TabsTrigger>
              <TabsTrigger
                value="clients"
                className="data-[state=active]:border-primary data-[state=active]:text-primary text-muted-foreground rounded-none border-b-2 border-transparent bg-transparent px-1 py-2 text-xs font-semibold transition-all data-[state=active]:bg-transparent"
              >
                Clients
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* SCROLLABLE TABLE AREA */}
      <div className="flex-1 overflow-auto">
        <table className="w-full table-fixed border-collapse text-left text-xs">
          {/* Sticky Table Column Headers */}
          <thead className="border-border bg-secondary text-muted-foreground sticky top-0 z-10 border-b font-medium tracking-wider uppercase opacity-100 shadow-sm">
            <tr>
              <th className="bg-secondary w-[20%] p-3.5 pl-6 font-semibold">
                Name
              </th>
              <th className="bg-secondary w-[15%] p-3.5 font-semibold">
                Stage
              </th>
              <th className="bg-secondary w-[20%] p-3.5 font-semibold">
                Period
              </th>
              <th className="bg-secondary w-[22%] p-3.5 font-semibold">
                Manager
              </th>
              <th className="bg-secondary w-[13%] p-3.5 font-semibold">
                Progress
              </th>
              <th className="bg-secondary w-[10%] p-3.5 pr-6 text-right font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-border/50 bg-card divide-y">
            {STAGE_GROUPS.map((group) => {
              const groupProjects = filteredProjects.filter(
                (p) => p.stageGroup === group.name,
              );

              if (groupProjects.length === 0 && searchQuery) return null;

              return (
                <tr key={group.name} className="contents">
                  {/* Stage Group Section Title Header */}
                  <tr className="bg-secondary/60 border-border border-t border-b">
                    <td
                      colSpan={6}
                      className="text-foreground py-2.5 pr-6 pl-6 text-xs font-semibold"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 ${group.dotColor}`} />
                        <span>{group.name}</span>
                        <span className="text-muted-foreground text-[10px] font-normal">
                          ({groupProjects.length})
                        </span>
                      </div>
                    </td>
                  </tr>

                  {/* Project Rows under Group */}
                  {groupProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="hover:bg-secondary/40 border-border/40 border-b transition-colors"
                    >
                      {/* Name Column */}
                      <td className="py-3 pr-3 pl-6">
                        <div className="flex items-center gap-3 truncate">
                          <div className="bg-secondary text-foreground border-border flex h-7 w-7 shrink-0 items-center justify-center border text-xs font-bold">
                            {project.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-foreground truncate text-xs font-semibold">
                            {project.name}
                          </span>
                        </div>
                      </td>

                      {/* Stage Column */}
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className="rounded-none border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-[11px] font-normal text-orange-500"
                        >
                          {project.stage}
                        </Badge>
                      </td>

                      {/* Period Column */}
                      <td className="text-muted-foreground truncate px-3 py-3 font-mono text-xs">
                        {project.periodStart} - {project.periodEnd}
                      </td>

                      {/* Manager Column */}
                      <td className="px-3 py-3">
                        <div className="border-border bg-secondary/50 text-foreground inline-flex max-w-full items-center gap-1.5 truncate border px-2 py-1 text-xs">
                          <div className="bg-primary/20 text-primary flex h-5 w-5 shrink-0 items-center justify-center text-[10px] font-bold">
                            {project.managerName.charAt(0)}
                          </div>
                          <span className="truncate font-medium">
                            {project.managerName}
                          </span>
                          <span className="text-muted-foreground shrink-0 text-[10px]">
                            ({project.managerCode})
                          </span>
                          <ChevronDown className="text-muted-foreground ml-1 h-3 w-3 shrink-0" />
                        </div>
                      </td>

                      {/* Progress Column */}
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Progress
                            value={project.progress}
                            className="bg-secondary h-1.5 flex-1 rounded-none"
                          />
                          <span className="text-muted-foreground w-8 shrink-0 text-right font-mono text-[11px] font-medium">
                            {project.progress}%
                          </span>
                        </div>
                      </td>

                      {/* Actions Column */}
                      <td className="py-3 pr-6 pl-3 text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-border hover:bg-secondary h-7 w-7 rounded-none"
                          >
                            <Pencil className="text-muted-foreground h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
                            className="border-border hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-none"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="border-border hover:bg-secondary h-7 w-7 rounded-none"
                          >
                            <ExternalLink className="text-muted-foreground h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
