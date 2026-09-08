"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useQueryState, parseAsString } from "nuqs";
import { useSidebar } from "@/components/ui/sidebar";
import {
  ChevronDown,
  Tag,
  Columns,
  Kanban,
  LayoutGrid,
  List,
  ListTodo,
  CalendarCheck,
  FileText,
  Laptop,
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  HardDrive,
  Cpu,
  Smartphone,
  ShieldCheck,
  Send,
  CheckSquare,
  Square,
  Trash2,
  ChevronLeft,
  ChevronRight,
  User,
  Eye,
  MoreHorizontal,
  Lock,
  Ban,
  Calendar,
  ArrowLeft,
  Pencil,
  CalendarOff,
  Zap,
  Target,
  TrendingUp,
  Layers,
  FolderKanban,
  XCircle,
  RefreshCw,
  ArrowLeftRight,
  Circle,
  SignalHigh,
  SignalMedium,
  SignalLow,
  Filter,
  Paperclip,
  Link2,
  GitBranch,
  AlertTriangle,
  Info,
  Maximize2,
  X,
  Download,
  Image as ImageIcon,
} from "lucide-react";
import { USER_PROFILES, type UserRoleProfile } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/rich-text-editor";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/* =========================================================================
   TASK ACTIVITY LOG COMPONENT
   ========================================================================= */
interface ActivityLogItem {
  id: string;
  user: string;
  role: string;
  type: "comment" | "status" | "attachment" | "create";
  content: string;
  image?: string;
  timestamp: string;
}

function TaskActivitySection({
  userMetadata = { name: "Elena Vance", designation: "Senior Systems Lead" },
  activityLogs = [],
  onAddLog,
  onUpdateLog,
  onDeleteLog,
  showLog = true,
  showInput = true,
  filterType = "all",
}: {
  userMetadata?: { name: string; designation: string };
  activityLogs?: ActivityLogItem[];
  onAddLog?: (log: ActivityLogItem) => void;
  onUpdateLog?: (
    id: string,
    updatedContent: string,
    updatedImage?: string,
  ) => void;
  onDeleteLog?: (id: string) => void;
  showLog?: boolean;
  showInput?: boolean;
  filterType?: "all" | "comments" | "activity";
}) {
  const [commentText, setCommentText] = useState("");
  const [commentImage, setCommentImage] = useState<string | null>(null);
  const [isCommenting, setIsCommenting] = useState(false);

  // Edit Comment State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");
  const [editingCommentImage, setEditingCommentImage] = useState<string | null>(
    null,
  );

  const filteredLogs = useMemo(() => {
    if (filterType === "comments") {
      return activityLogs.filter((log) => log.type === "comment");
    }
    if (filterType === "activity") {
      return activityLogs.filter((log) => log.type !== "comment");
    }
    return activityLogs;
  }, [activityLogs, filterType]);

  const sectionTitle =
    filterType === "comments"
      ? "Comments"
      : filterType === "activity"
        ? "Activity Log"
        : "Activity & Comments";

  const handleSendComment = () => {
    const isContentEmpty =
      !commentText.trim() ||
      commentText === "<br>" ||
      commentText === "<p></p>";
    if (isContentEmpty && !commentImage) return;

    const newLog: ActivityLogItem = {
      id: `act-${Date.now()}`,
      user: userMetadata.name,
      role: userMetadata.designation,
      type: "comment",
      content: isContentEmpty ? "" : commentText.trim(),
      image: commentImage || undefined,
      timestamp: "Just now",
    };
    onAddLog?.(newLog);
    setCommentText("");
    setCommentImage(null);
    setIsCommenting(false);
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        showLog && "border-border mt-4 border-t pt-6",
      )}
    >
      {showLog && (
        <>
          {/* Activity Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-foreground text-sm font-bold">
                {sectionTitle}
              </h3>
              <span className="bg-secondary text-muted-foreground border-border rounded-full border px-2 py-0.5 text-[10px] font-semibold">
                {filteredLogs.length}
              </span>
            </div>
          </div>

          {/* Activity Log Feed (REVERSED ORDER: oldest at top, newest at bottom) */}
          <div className="flex flex-col gap-3">
            {filteredLogs.length === 0 ? (
              <div className="text-muted-foreground border-border/60 rounded-lg border border-dashed py-6 text-center text-xs">
                {filterType === "comments"
                  ? "No comments yet."
                  : "No activity logs found."}
              </div>
            ) : (
              [...filteredLogs].reverse().map((log, idx) => {
                if (log.type === "comment") {
                  const isAuthor = log.user === userMetadata.name;

                  return (
                    <div
                      key={`${log.id}-${idx}`}
                      className="group flex gap-3 text-xs"
                    >
                      {/* User Avatar Badge */}
                      <div
                        className="bg-primary/10 border-primary/30 text-primary mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold"
                        title={log.user}
                      >
                        {log.user
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>

                      <div className="flex flex-1 flex-col gap-1">
                        {/* Log Header: Timestamp + Author Action Buttons */}
                        <div className="flex items-center justify-between gap-2 text-[11px]">
                          <span className="text-muted-foreground text-[10px]">
                            {log.timestamp}
                          </span>

                          {/* EDIT & DELETE BUTTONS - ONLY FOR COMMENT AUTHOR */}
                          {isAuthor && editingCommentId !== log.id && (
                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCommentId(log.id);
                                  setEditingCommentText(log.content);
                                  setEditingCommentImage(log.image || null);
                                }}
                                className="text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer rounded-md p-1 transition-colors"
                                title="Edit comment"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => onDeleteLog?.(log.id)}
                                className="text-muted-foreground cursor-pointer rounded-md p-1 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                                title="Delete comment"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Log Content Body or Inline Editor */}
                        {editingCommentId === log.id ? (
                          <div className="border-border bg-card animate-in fade-in mt-1 flex flex-col gap-3 rounded-xl border p-3 shadow-xs duration-150">
                            <RichTextEditor
                              value={editingCommentText}
                              onChange={(content) =>
                                setEditingCommentText(content)
                              }
                              placeholder="Edit comment..."
                              minHeight="70px"
                              borderless={true}
                            />

                            {editingCommentImage && (
                              <div className="border-border bg-secondary/30 group relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border">
                                <img
                                  src={editingCommentImage}
                                  alt="Attached preview"
                                  className="h-full w-full object-cover"
                                />
                                <button
                                  type="button"
                                  onClick={() => setEditingCommentImage(null)}
                                  className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/70 p-0.5 text-white transition-colors hover:bg-black"
                                  title="Remove image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}

                            <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCommentId(null);
                                  setEditingCommentText("");
                                  setEditingCommentImage(null);
                                }}
                                className="text-muted-foreground hover:text-foreground cursor-pointer px-2.5 py-1 text-xs transition-colors"
                              >
                                Cancel
                              </button>

                              <label
                                className="hover:bg-secondary text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-center rounded-full p-1 transition-colors"
                                title="Attach image"
                              >
                                <Paperclip className="h-3.5 w-3.5" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      const reader = new FileReader();
                                      reader.onload = (evt) => {
                                        const result = evt.target
                                          ?.result as string;
                                        if (result)
                                          setEditingCommentImage(result);
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }}
                                />
                              </label>

                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateLog?.(
                                    log.id,
                                    editingCommentText,
                                    editingCommentImage || undefined,
                                  );
                                  setEditingCommentId(null);
                                }}
                                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer rounded-md px-3 py-1 text-xs font-semibold shadow-xs transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-2">
                            {log.content &&
                              log.content !== "<br>" &&
                              log.content !== "<p></p>" && (
                                <div
                                  className="border-border/80 bg-card text-foreground mt-0.5 rounded-lg border p-3 text-xs leading-relaxed shadow-2xs [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-5"
                                  dangerouslySetInnerHTML={{
                                    __html: log.content,
                                  }}
                                />
                              )}
                            {log.image && (
                              <div className="border-border/80 bg-card mt-0.5 max-w-sm overflow-hidden rounded-lg border shadow-xs">
                                <img
                                  src={log.image}
                                  alt="Comment attachment"
                                  className="h-auto max-h-56 w-full object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={`${log.id}-${idx}`}
                    className="hover:bg-secondary/40 flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1 text-xs transition-colors"
                  >
                    {/* User Avatar Badge */}
                    <div
                      className="bg-primary/10 border-primary/30 text-primary flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold"
                      title={log.user}
                    >
                      {log.user
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 text-[11px]">
                      {/* Icon + What Action */}
                      <div className="text-muted-foreground flex min-w-0 flex-1 items-center gap-1.5 truncate font-medium">
                        {log.type === "status" && (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        )}
                        {log.type === "attachment" && (
                          <Paperclip className="text-primary h-3.5 w-3.5 shrink-0" />
                        )}
                        {log.type === "create" && (
                          <Plus className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        )}
                        <span className="truncate">
                          {(() => {
                            const statusMatch = log.content.match(
                              /^changed status from (.+) to (.+)$/,
                            );
                            if (statusMatch) {
                              return (
                                <span>
                                  changed status from{" "}
                                  <span className="text-foreground font-bold">
                                    {statusMatch[1]}
                                  </span>{" "}
                                  to{" "}
                                  <span className="font-bold text-emerald-500">
                                    {statusMatch[2]}
                                  </span>
                                </span>
                              );
                            }
                            const priorityMatch = log.content.match(
                              /^changed priority to (.+)$/,
                            );
                            if (priorityMatch) {
                              return (
                                <span>
                                  changed priority to{" "}
                                  <span className="font-bold text-amber-500">
                                    {priorityMatch[1]}
                                  </span>
                                </span>
                              );
                            }
                            const reassignMatch = log.content.match(
                              /^reassigned task from (.+) to (.+)$/,
                            );
                            if (reassignMatch) {
                              return (
                                <span>
                                  reassigned task from{" "}
                                  <span className="text-foreground font-bold">
                                    {reassignMatch[1]}
                                  </span>{" "}
                                  to{" "}
                                  <span className="text-foreground font-bold">
                                    {reassignMatch[2]}
                                  </span>
                                </span>
                              );
                            }
                            const reassignToMatch = log.content.match(
                              /^reassigned task to (.+)$/,
                            );
                            if (reassignToMatch) {
                              return (
                                <span>
                                  reassigned task to{" "}
                                  <span className="text-foreground font-bold">
                                    {reassignToMatch[1]}
                                  </span>
                                </span>
                              );
                            }
                            const attachMatch = log.content.match(
                              /^uploaded image attachment (.+)$/,
                            );
                            if (attachMatch) {
                              return (
                                <span>
                                  uploaded image attachment{" "}
                                  <span className="text-foreground font-bold">
                                    {attachMatch[1]}
                                  </span>
                                </span>
                              );
                            }
                            return log.content;
                          })()}
                        </span>
                      </div>

                      {/* Time */}
                      <span className="text-muted-foreground/80 shrink-0 text-[10px]">
                        {log.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}

      {/* Leave a Comment Action (POSITIONED AT BOTTOM BELOW ACTIVITY LOG) */}
      {showInput &&
        (!isCommenting ? (
          <button
            type="button"
            onClick={() => setIsCommenting(true)}
            className="border-border/80 bg-card hover:bg-secondary/40 text-muted-foreground hover:text-foreground group mt-1 flex w-full cursor-pointer items-center justify-between rounded-xl border p-3 shadow-xs transition-all"
          >
            <div className="flex items-center gap-3 text-xs font-medium">
              <div className="bg-primary/20 text-primary border-primary/30 flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-bold">
                {userMetadata.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <span>Leave a comment...</span>
            </div>
            <span className="text-primary bg-primary/10 border-primary/20 rounded-md border px-2.5 py-1 text-[11px] font-semibold group-hover:underline">
              + Comment
            </span>
          </button>
        ) : (
          <div className="border-border bg-card animate-in fade-in mt-1 flex flex-col gap-3 rounded-xl border p-3 shadow-xs duration-150">
            <RichTextEditor
              value={commentText}
              onChange={(content) => setCommentText(content)}
              placeholder="Leave a comment..."
              minHeight="80px"
              borderless={true}
            />

            {/* Attached Image Preview */}
            {commentImage && (
              <div className="border-border bg-secondary/30 group relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                <img
                  src={commentImage}
                  alt="Attached preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCommentImage(null)}
                  className="absolute top-1 right-1 cursor-pointer rounded-full bg-black/70 p-1 text-white transition-colors hover:bg-black"
                  title="Remove image"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}

            <div className="border-border/60 flex items-center justify-end gap-2 border-t pt-2.5">
              <button
                type="button"
                onClick={() => {
                  setCommentText("");
                  setCommentImage(null);
                  setIsCommenting(false);
                }}
                className="text-muted-foreground hover:text-foreground cursor-pointer px-2.5 py-1 text-xs transition-colors"
              >
                Cancel
              </button>

              <label
                className="hover:bg-secondary text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-center rounded-full p-1.5 transition-colors"
                title="Attach image"
              >
                <Paperclip className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (evt) => {
                        const result = evt.target?.result as string;
                        if (result) setCommentImage(result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>

              <button
                type="button"
                onClick={handleSendComment}
                disabled={
                  (!commentText.trim() ||
                    commentText === "<br>" ||
                    commentText === "<p></p>") &&
                  !commentImage
                }
                className={cn(
                  "cursor-pointer rounded-full p-2 transition-all",
                  (commentText.trim() &&
                    commentText !== "<br>" &&
                    commentText !== "<p></p>") ||
                    commentImage
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xs"
                    : "bg-muted text-muted-foreground cursor-not-allowed opacity-60",
                )}
                title="Post comment"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

/* =========================================================================
   1. MY TASK VIEW (TO-DO APP WITH IMPORTANT ITEMS)
   ========================================================================= */
interface TodoTask {
  id: string;
  title: string;
  isImportant: boolean;
  isCompleted: boolean;
  dueDate?: string;
  category?: string;
}

export function MyTaskView() {
  const [tasks, setTasks] = useState<TodoTask[]>([
    {
      id: "TSK-01",
      title: "Submit standup report & attendance check-in",
      isImportant: true,
      isCompleted: false,
      dueDate: "Today",
      category: "Routine",
    },
    {
      id: "TSK-02",
      title: "Implement Dashboard Layout & Color Theme",
      isImportant: true,
      isCompleted: true,
      dueDate: "24 Aug 2026",
      category: "Appofy Project",
    },
    {
      id: "TSK-03",
      title: "Review pull requests & merge frontend updates",
      isImportant: false,
      isCompleted: false,
      dueDate: "Today",
      category: "Code Review",
    },
    {
      id: "TSK-04",
      title: "Fix Nuqs query parameter hydration warning",
      isImportant: true,
      isCompleted: false,
      dueDate: "26 Aug 2026",
      category: "Bugfix",
    },
    {
      id: "TSK-05",
      title: "Sync with QA team on UAT release build",
      isImportant: false,
      isCompleted: true,
      dueDate: "Today",
      category: "Meeting",
    },
    {
      id: "TSK-06",
      title: "Prepare Q3 sprint retrospective documentation",
      isImportant: false,
      isCompleted: false,
      dueDate: "28 Aug 2026",
      category: "Documentation",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"all" | "important" | "completed">(
    "all",
  );
  const [search, setSearch] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isNewImportant, setIsNewImportant] = useState(false);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TodoTask = {
      id: `TSK-${String(tasks.length + 1).padStart(2, "0")}`,
      title: newTaskTitle.trim(),
      isImportant: isNewImportant,
      isCompleted: false,
      dueDate: "28 Aug 2026",
      category: "General",
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
    setIsNewImportant(false);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isCompleted: !t.isCompleted } : t,
      ),
    );
  };

  const handleToggleImportant = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, isImportant: !t.isImportant } : t,
      ),
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (activeTab === "important" && !t.isImportant) return false;
    if (activeTab === "completed" && !t.isCompleted) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  const totalCount = tasks.length;
  const importantCount = tasks.filter((t) => t.isImportant).length;
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header Banner */}
      <div className="border-border bg-card flex flex-col justify-between gap-4 border p-5 shadow-xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <ListTodo className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              My Tasks & To-Do List
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
            >
              {totalCount} Items
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Organize task deliverables, mark priority items as important, and
            check off completed tasks.
          </p>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="bg-card border-border rounded-none border p-4 shadow-none">
          <span className="text-muted-foreground block text-xs">
            Total Tasks
          </span>
          <span className="text-foreground text-2xl font-bold">
            {totalCount}
          </span>
        </Card>
        <Card className="bg-card border-border rounded-none border p-4 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground block text-xs">
              Important
            </span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <span className="text-2xl font-bold text-amber-500">
            {importantCount}
          </span>
        </Card>
        <Card className="bg-card border-border rounded-none border p-4 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground block text-xs">
              Completed
            </span>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </div>
          <span className="text-2xl font-bold text-emerald-500">
            {completedCount}
          </span>
        </Card>
      </div>

      {/* Main To-Do Card */}
      <Card className="bg-card border-border flex flex-col gap-4 rounded-none border p-5 shadow-none">
        {/* Quick Add Bar */}
        <form
          onSubmit={handleAddTask}
          className="border-border bg-background flex w-full flex-col items-center gap-2 border p-2 sm:flex-row"
        >
          <Input
            placeholder="Add a new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full flex-1 border-none bg-transparent text-xs focus-visible:ring-0"
          />

          <div className="border-border flex w-full shrink-0 items-center justify-end gap-2 border-t pt-2 sm:w-auto sm:border-t-0 sm:border-l sm:pt-0 sm:pl-2">
            {/* Toggle Important flag for new task */}
            <Button
              type="button"
              variant={isNewImportant ? "default" : "outline"}
              size="sm"
              onClick={() => setIsNewImportant(!isNewImportant)}
              className={cn(
                "h-7 gap-1 rounded-none border-amber-500/40 px-2 text-xs",
                isNewImportant
                  ? "bg-amber-500 text-black hover:bg-amber-600"
                  : "text-amber-500 hover:bg-amber-500/10",
              )}
            >
              <AlertCircle className="h-3.5 w-3.5" /> Important
            </Button>

            <Button
              type="submit"
              size="sm"
              className="h-7 cursor-pointer rounded-none px-3 text-xs font-semibold shadow-none"
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Task
            </Button>
          </div>
        </form>

        {/* Filter Tabs & Search Bar */}
        <div className="border-border/60 flex w-full flex-col items-center justify-between gap-4 border-b pb-3 sm:flex-row">
          {/* Tabs - Full Width */}
          <div className="border-border bg-background flex w-full flex-1 items-center gap-1 border p-1">
            <Button
              variant={activeTab === "all" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("all")}
              className="h-7 flex-1 cursor-pointer justify-center rounded-none text-xs"
            >
              All ({totalCount})
            </Button>
            <Button
              variant={activeTab === "important" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("important")}
              className="h-7 flex-1 cursor-pointer justify-center gap-1 rounded-none text-xs text-amber-500"
            >
              <AlertCircle className="h-3 w-3 text-amber-500" /> Important (
              {importantCount})
            </Button>
            <Button
              variant={activeTab === "completed" ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab("completed")}
              className="h-7 flex-1 cursor-pointer justify-center gap-1 rounded-none text-xs text-emerald-500"
            >
              Completed ({completedCount})
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative w-full shrink-0 sm:w-72">
            <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
            <Input
              placeholder="Filter tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-background border-border h-8 w-full rounded-none pl-8 text-xs"
            />
          </div>
        </div>

        {/* Task Items List */}
        <div className="flex flex-col gap-2">
          {filteredTasks.length === 0 ? (
            <div className="border-border/60 bg-background flex flex-col items-center justify-center border border-dashed p-8 text-center">
              <ListTodo className="text-muted-foreground/50 mb-2 h-8 w-8" />
              <p className="text-foreground text-xs font-bold">
                No tasks found
              </p>
              <p className="text-muted-foreground mt-0.5 text-[11px]">
                {activeTab === "important"
                  ? "No tasks marked as Important."
                  : "Your to-do list is clean."}
              </p>
            </div>
          ) : (
            filteredTasks.map((t) => (
              <div
                key={t.id}
                className={cn(
                  "border-border bg-background flex items-center justify-between gap-3 border p-3 transition-all",
                  t.isCompleted && "bg-secondary/30 opacity-80",
                )}
              >
                {/* Left: Checkbox & Task Details */}
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  {/* Completion Checkbox Button */}
                  <button
                    onClick={() => handleToggleComplete(t.id)}
                    className="text-muted-foreground hover:text-primary shrink-0 cursor-pointer"
                    title={t.isCompleted ? "Mark incomplete" : "Mark completed"}
                  >
                    {t.isCompleted ? (
                      <CheckSquare className="h-5 w-5 text-emerald-500" />
                    ) : (
                      <Square className="text-muted-foreground hover:text-primary h-5 w-5" />
                    )}
                  </button>

                  <div className="flex min-w-0 flex-col gap-0.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-foreground truncate text-xs font-semibold",
                          t.isCompleted && "text-muted-foreground line-through",
                        )}
                      >
                        {t.title}
                      </span>
                    </div>

                    <div className="text-muted-foreground flex items-center gap-2 text-[10px]">
                      <span>{t.id}</span>
                      <span>•</span>
                      <span>{t.category || "General"}</span>
                      {t.dueDate && (
                        <>
                          <span>•</span>
                          <span>Due: {t.dueDate}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Badges & Action Buttons */}
                <div className="flex shrink-0 items-center gap-2">
                  {/* Important Toggle Badge */}
                  <button
                    onClick={() => handleToggleImportant(t.id)}
                    className="cursor-pointer"
                    title={
                      t.isImportant
                        ? "Remove Important priority"
                        : "Mark as Important"
                    }
                  >
                    {t.isImportant ? (
                      <Badge className="flex items-center gap-1 rounded-none border-amber-500/40 bg-amber-500/10 px-1.5 py-0 text-[9px] text-amber-500">
                        <AlertCircle className="h-3 w-3" /> Important
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="border-border text-muted-foreground hover:text-foreground rounded-none px-1.5 py-0 text-[9px]"
                      >
                        + Important
                      </Badge>
                    )}
                  </button>

                  {/* Delete Task */}
                  <button
                    onClick={() => handleDeleteTask(t.id)}
                    className="text-muted-foreground hover:text-destructive cursor-pointer p-1"
                    title="Delete task"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   2. MY ATTENDANCE VIEW (SPEC MATCHING SCREENSHOT)
   ========================================================================= */
export function MyAttendanceView() {
  const [userCode] = useQueryState("user", parseAsString.withDefault("ADMIN"));

  const currentUser: UserRoleProfile =
    USER_PROFILES.find((u) => u.code === userCode) || USER_PROFILES[0];

  const userMetadata = React.useMemo(() => {
    if (currentUser.code === "EMP39" || currentUser.name.includes("Sahara")) {
      return {
        name: "Sahara Acharya",
        designation: "Intern Frontend Developer",
        employeeId: "EMP-0039",
      };
    } else if (currentUser.role === "admin") {
      return {
        name: "Elena Vance",
        designation: "Senior Systems Lead",
        employeeId: "EMP-0042",
      };
    } else {
      return {
        name: currentUser.name,
        designation: "Project Lead & Manager",
        employeeId: `EMP-${currentUser.code.slice(-4)}`,
      };
    }
  }, [currentUser]);

  // Live Timecard & Shift Timer State
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timeString, setTimeString] = useState("03:03:50 PM");

  // Dynamic Calendar Month & Year State (Default August 2026)
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(7); // 0-indexed: 7 = August

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeString(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }),
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleCheckIn = () => {
    setIsCheckedIn(!isCheckedIn);
  };

  // Calendar calculations for any month and year
  const monthDate = React.useMemo(
    () => new Date(calendarYear, calendarMonth, 1),
    [calendarYear, calendarMonth],
  );

  const calendarMonthStr = React.useMemo(
    () =>
      monthDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      }),
    [monthDate],
  );

  const daysInMonth = React.useMemo(
    () => new Date(calendarYear, calendarMonth + 1, 0).getDate(),
    [calendarYear, calendarMonth],
  );

  // Dynamic day initials for the current month view (e.g. S, M, T, W, T, F, S)
  const monthDayInitials = React.useMemo(() => {
    return Array.from({ length: daysInMonth }, (_, i) => {
      const d = new Date(calendarYear, calendarMonth, i + 1);
      return d.toLocaleDateString("en-US", { weekday: "narrow" });
    });
  }, [calendarYear, calendarMonth, daysInMonth]);

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

  // Attendance record store keyed by "YYYY-MM-DD"
  const attendanceRecords: Record<string, { code: string; bg: string }> =
    React.useMemo(
      () => ({
        // July 2026 (Past Month - Complete Attendance Records)
        "2026-07-04": {
          code: "GH",
          bg: "bg-purple-500/20 border-purple-500/40 text-purple-400",
        },
        "2026-07-10": {
          code: "P",
          bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
        },
        "2026-07-15": {
          code: "L",
          bg: "bg-amber-500/20 border-amber-500/40 text-amber-500",
        },
        "2026-07-21": {
          code: "P",
          bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
        },

        // August 2026 (Current Month - Up to Today Aug 24)
        "2026-08-15": {
          code: "GH",
          bg: "bg-purple-500/20 border-purple-500/40 text-purple-400",
        },
        "2026-08-20": {
          code: "P",
          bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
        },
        "2026-08-21": {
          code: "P",
          bg: "bg-emerald-500/20 border-emerald-500/40 text-emerald-500",
        },
        "2026-08-24": {
          code: "A",
          bg: "bg-destructive text-destructive-foreground font-bold",
        },
        // Future dates in August 2026 (Only scheduled Leave or Govt Holiday)
        "2026-08-25": {
          code: "L",
          bg: "bg-amber-500/20 border-amber-500/40 text-amber-500",
        },
        "2026-08-27": {
          code: "GH",
          bg: "bg-purple-500/20 border-purple-500/40 text-purple-400",
        },

        // September 2026 (Future Unstarted Month - Only Scheduled Govt Holidays / Leaves)
        "2026-09-07": {
          code: "GH",
          bg: "bg-purple-500/20 border-purple-500/40 text-purple-400",
        },
        "2026-09-18": {
          code: "L",
          bg: "bg-amber-500/20 border-amber-500/40 text-amber-500",
        },
      }),
      [],
    );

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Top Section Header */}
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Attendance
        </h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Clock in and out to record your shift hours.
        </p>
      </div>

      {/* TOP ROW GRID: 3 CARDS */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* CARD 1: TIMECARD (4 Cols) */}
        <Card className="bg-card border-border flex flex-col justify-between rounded-none border p-5 shadow-none lg:col-span-4">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              TIMECARD
            </span>
            <div className="text-muted-foreground flex items-center gap-1.5 font-mono text-xs">
              <Clock className="text-primary h-3.5 w-3.5" />
              <span>{timeString}</span>
            </div>
          </div>

          <div className="border-border bg-background flex items-center justify-between gap-4 border p-4">
            <div className="flex flex-col">
              <span className="text-muted-foreground text-[10px] font-semibold uppercase">
                STATUS
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    isCheckedIn
                      ? "animate-pulse bg-emerald-500"
                      : "bg-muted-foreground/60",
                  )}
                />
                <span className="text-foreground text-sm font-bold">
                  {isCheckedIn ? "On Duty" : "Off Duty"}
                </span>
              </div>
            </div>

            <Button
              onClick={handleToggleCheckIn}
              variant={isCheckedIn ? "destructive" : "default"}
              className={cn(
                "cursor-pointer rounded-none px-5 text-xs font-semibold shadow-none",
                !isCheckedIn &&
                  "bg-emerald-600 text-white hover:bg-emerald-700",
              )}
            >
              {isCheckedIn ? "Check Out" : "Check In"}
            </Button>
          </div>
        </Card>

        {/* CARD 2: TODAY'S SHIFT SUMMARY (5 Cols) */}
        <Card className="bg-card border-border flex flex-col justify-between rounded-none border p-5 shadow-none lg:col-span-5">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              TODAY&apos;S SHIFT SUMMARY
            </span>
            <User className="text-muted-foreground h-4 w-4" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="border-border bg-background flex flex-col items-center justify-center border p-3 text-center">
              <span className="text-muted-foreground text-[9px] font-semibold uppercase">
                STATUS
              </span>
              <span
                className={cn(
                  "mt-1 text-sm font-extrabold uppercase",
                  isCheckedIn ? "text-emerald-500" : "text-destructive",
                )}
              >
                {isCheckedIn ? "PRESENT" : "ABSENT"}
              </span>
            </div>

            <div className="border-border bg-background flex flex-col items-center justify-center border p-3 text-center">
              <span className="text-muted-foreground text-[9px] font-semibold uppercase">
                WORKED
              </span>
              <span className="text-foreground mt-1 text-sm font-extrabold">
                {isCheckedIn ? "3.5h" : "0.0h"}
              </span>
            </div>

            <div className="border-border bg-background flex flex-col items-center justify-center border p-3 text-center">
              <span className="text-muted-foreground text-[9px] font-semibold uppercase">
                OVERTIME
              </span>
              <span className="text-primary mt-1 text-sm font-extrabold">
                0.0h
              </span>
            </div>
          </div>
        </Card>

        {/* CARD 3: MY PROFILE (3 Cols) */}
        <Card className="bg-card border-border flex flex-col justify-between rounded-none border p-5 shadow-none lg:col-span-3">
          <div className="border-border/60 mb-4 flex items-center justify-between border-b pb-3">
            <span className="text-foreground text-xs font-bold tracking-wider uppercase">
              MY PROFILE
            </span>
            <Badge
              variant="outline"
              className="border-border rounded-none text-[10px]"
            >
              {userMetadata.employeeId}
            </Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground font-bold">
                {userMetadata.name}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Designation:</span>
              <span className="text-foreground text-right font-semibold">
                {userMetadata.designation}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* BOTTOM CARD: MY ATTENDANCE CALENDAR SPREADSHEET */}
      <Card className="bg-card border-border flex flex-col gap-4 rounded-none border p-5 shadow-none">
        {/* Calendar Header with Title, Month Navigation, and Legend */}
        <div className="border-border/60 flex flex-col justify-between gap-4 border-b pb-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Clock className="text-primary h-4 w-4" />
              <h2 className="text-foreground text-sm font-bold">
                My Attendance Calendar
              </h2>
            </div>

            {/* Month Navigator */}
            <div className="border-border bg-background ml-2 flex items-center gap-1 border px-2 py-0.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePrevMonth}
                className="text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer rounded-none"
                title="Previous Month"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="text-foreground min-w-[95px] px-2 text-center text-xs font-bold">
                {calendarMonthStr}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleNextMonth}
                className="text-muted-foreground hover:text-foreground h-5 w-5 cursor-pointer rounded-none"
                title="Next Month"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-3 text-[10px]">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-muted-foreground">Present (P)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="bg-destructive h-2 w-2 rounded-full" />
              <span className="text-muted-foreground">Absent (A)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">Leave (L)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sky-500" />
              <span className="text-muted-foreground">Half-Day (H)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span className="text-muted-foreground">Govt Holiday (GH)</span>
            </div>
          </div>
        </div>

        {/* Horizontal Spreadsheet Attendance Timeline Table (Full Width Cover) */}
        <div className="w-full overflow-x-auto">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <thead>
              <tr className="border-border bg-background/50 border-b">
                <th className="text-muted-foreground border-border w-36 border-r p-2 text-[10px] font-semibold uppercase sm:w-44">
                  EMPLOYEE
                </th>
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const initial = monthDayInitials[i] || "";
                  return (
                    <th
                      key={dayNum}
                      className="border-border/40 border-r px-0.5 py-1 text-center text-[10px] font-normal"
                    >
                      <div className="text-foreground font-bold">{dayNum}</div>
                      <div className="text-muted-foreground text-[9px]">
                        {initial}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr className="border-border/60 hover:bg-secondary/20 border-b">
                {/* Employee Name Column */}
                <td className="border-border text-foreground border-r p-2 font-medium">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="border-primary/40 bg-primary/20 text-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-none border text-[9px] font-bold">
                      {userMetadata.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <span className="truncate text-xs font-semibold">
                      {userMetadata.name}
                    </span>
                  </div>
                </td>

                {/* Day Status Grid Cells */}
                {Array.from({ length: daysInMonth }, (_, i) => {
                  const dayNum = i + 1;
                  const dateKey = `${calendarYear}-${String(
                    calendarMonth + 1,
                  ).padStart(2, "0")}-${String(dayNum).padStart(2, "0")}`;
                  const override = attendanceRecords[dateKey];

                  return (
                    <td
                      key={dayNum}
                      className="border-border/40 border-r px-0.5 py-1 text-center text-[10px]"
                    >
                      {override ? (
                        <div
                          className={cn(
                            "mx-auto flex h-6 w-6 items-center justify-center rounded-none border text-[9px] font-bold",
                            override.bg,
                          )}
                          title={`Date ${dateKey}: ${override.code}`}
                        >
                          {override.code}
                        </div>
                      ) : (
                        <span className="text-muted-foreground/40 font-mono text-[11px]">
                          -
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* =========================================================================
   3. MY WORKLOG VIEW (SPEC MATCHING SCREENSHOT)
   ========================================================================= */
interface WorklogWeek {
  id: string;
  range: string;
  month: string;
  isMissing?: boolean;
  isLocked?: boolean;
  hoursLogged?: number;
  logs?: Array<{
    date: string;
    project: string;
    hours: string;
    desc: string;
  }>;
}

export function MyWorklogView() {
  const [activeTab, setActiveTab] = useState<
    "worksheet" | "calendar" | "history"
  >("worksheet");
  const [selectedWeekId, setSelectedWeekId] = useState<string>("w-aug-4");

  // Modal States
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [activeDayForAdd, setActiveDayForAdd] = useState<{
    dayLabel: string;
    dateStr: string;
  } | null>(null);
  const [activeViewWeek, setActiveViewWeek] = useState<WorklogWeek | null>(
    null,
  );

  // Add Log Form States
  const [logProject, setLogProject] = useState("Appofy");
  const [logCategory, setLogCategory] = useState("Development");
  const [logHours, setLogHours] = useState("8.0");
  const [logDesc, setLogDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProjectFilter, setSelectedProjectFilter] = useState("All");

  // Toast feedback message
  const [submittedSuccessMsg, setSubmittedSuccessMsg] = useState<string | null>(
    null,
  );

  // Current Month Weeks (Aug 2026)
  const [currentMonthWeeks, setCurrentMonthWeeks] = useState<WorklogWeek[]>([
    {
      id: "w-aug-1",
      range: "3 Aug 2026 - 9 Aug 2026",
      month: "Aug 2026",
      isMissing: true,
      hoursLogged: 40.0,
      logs: [
        {
          date: "4 Aug 2026",
          project: "Appofy",
          hours: "8.0 hrs",
          desc: "API schema definitions and database migrations.",
        },
      ],
    },
    {
      id: "w-aug-2",
      range: "10 Aug 2026 - 16 Aug 2026",
      month: "Aug 2026",
      isMissing: false,
      hoursLogged: 40.0,
      logs: [
        {
          date: "11 Aug 2026",
          project: "WorkSync",
          hours: "8.0 hrs",
          desc: "Built calendar view widget and event scheduling handlers.",
        },
      ],
    },
    {
      id: "w-aug-3",
      range: "17 Aug 2026 - 23 Aug 2026",
      month: "Aug 2026",
      isMissing: false,
      hoursLogged: 38.5,
      logs: [
        {
          date: "18 Aug 2026",
          project: "Design System",
          hours: "7.5 hrs",
          desc: "Configured color palette tokens and dark mode styling.",
        },
      ],
    },
    {
      id: "w-aug-4",
      range: "24 Aug 2026 - 30 Aug 2026",
      month: "Aug 2026",
      isMissing: false,
      hoursLogged: 38.0,
      logs: [
        {
          date: "24 Aug 2026",
          project: "Appofy",
          hours: "7.5 hrs",
          desc: "Developed frontend layout component for Dashboard and Sidebar menu routing.",
        },
      ],
    },
    {
      id: "w-aug-5",
      range: "31 Aug 2026 - 6 Sep 2026",
      month: "Aug 2026",
      isMissing: false,
      hoursLogged: 16.0,
      logs: [],
    },
  ]);

  // 7-day day store for current week
  const [weeklyDayStore, setWeeklyDayStore] = useState<
    Record<
      string,
      Array<{
        id: string;
        dayLabel: string;
        dateStr: string;
        entries: Array<{
          id: string;
          project: string;
          category?: string;
          hours: string;
          desc: string;
        }>;
      }>
    >
  >({
    "w-aug-4": [
      {
        id: "d1",
        dayLabel: "Aug 24, Mon",
        dateStr: "24 Aug 2026",
        entries: [
          {
            id: "e-1",
            project: "Appofy",
            category: "Development",
            hours: "7.5 hrs",
            desc: "Developed frontend layout component for Dashboard and Sidebar menu routing.",
          },
        ],
      },
      {
        id: "d2",
        dayLabel: "Aug 25, Tue",
        dateStr: "25 Aug 2026",
        entries: [
          {
            id: "e-2",
            project: "Design System",
            category: "UI/UX",
            hours: "8.0 hrs",
            desc: "Configured theme tokens and dark mode components.",
          },
        ],
      },
      {
        id: "d3",
        dayLabel: "Aug 26, Wed",
        dateStr: "26 Aug 2026",
        entries: [
          {
            id: "e-3",
            project: "Testing Filter",
            category: "Testing & QC",
            hours: "7.5 hrs",
            desc: "Executed RBAC permissions and user role filter regression testing.",
          },
        ],
      },
      {
        id: "d4",
        dayLabel: "Aug 27, Thu",
        dateStr: "27 Aug 2026",
        entries: [
          {
            id: "e-4",
            project: "WorkSync",
            category: "Development",
            hours: "7.5 hrs",
            desc: "Implemented timesheet approval workflow and email trigger hooks.",
          },
        ],
      },
      {
        id: "d5",
        dayLabel: "Aug 28, Fri",
        dateStr: "28 Aug 2026",
        entries: [
          {
            id: "e-5",
            project: "Appofy",
            category: "Code Review",
            hours: "7.5 hrs",
            desc: "Reviewed pull requests for authentication service integration.",
          },
        ],
      },
      {
        id: "d6",
        dayLabel: "Aug 29, Sat",
        dateStr: "29 Aug 2026",
        entries: [],
      },
      {
        id: "d7",
        dayLabel: "Aug 30, Sun",
        dateStr: "30 Aug 2026",
        entries: [],
      },
    ],
  });

  const selectedWeek = useMemo(() => {
    return (
      currentMonthWeeks.find((w) => w.id === selectedWeekId) ||
      currentMonthWeeks[3]
    );
  }, [currentMonthWeeks, selectedWeekId]);

  const handleSaveDayLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDayForAdd || !logDesc) return;
    const newEntry = {
      id: `entry-${Date.now()}`,
      project: logProject,
      category: logCategory,
      hours: `${logHours} hrs`,
      desc: logDesc,
    };
    setWeeklyDayStore((prev) => {
      const currentDays = prev[selectedWeekId] || [];
      const updatedDays = currentDays.map((d) => {
        if (
          d.dateStr === activeDayForAdd.dateStr ||
          d.dayLabel === activeDayForAdd.dayLabel
        ) {
          return { ...d, entries: [...d.entries, newEntry] };
        }
        return d;
      });
      return { ...prev, [selectedWeekId]: updatedDays };
    });
    setActiveDayForAdd(null);
    setLogDesc("");
    setSubmittedSuccessMsg("Worklog entry added successfully.");
    setTimeout(() => setSubmittedSuccessMsg(null), 3000);
  };

  // Historical Months (Jan - Dec 2026)
  const historicalMonths = useMemo(
    () => [
      {
        monthName: "Jan 2026",
        hours: "160 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-jan-1",
            range: "5 Jan 2026 - 11 Jan 2026",
            month: "Jan 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jan-2",
            range: "12 Jan 2026 - 18 Jan 2026",
            month: "Jan 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jan-3",
            range: "19 Jan 2026 - 25 Jan 2026",
            month: "Jan 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jan-4",
            range: "26 Jan 2026 - 1 Feb 2026",
            month: "Jan 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
        ],
      },
      {
        monthName: "Feb 2026",
        hours: "158 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-feb-1",
            range: "2 Feb 2026 - 8 Feb 2026",
            month: "Feb 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-feb-2",
            range: "9 Feb 2026 - 15 Feb 2026",
            month: "Feb 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-feb-3",
            range: "16 Feb 2026 - 22 Feb 2026",
            month: "Feb 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-feb-4",
            range: "23 Feb 2026 - 1 Mar 2026",
            month: "Feb 2026",
            isMissing: false,
            hoursLogged: 38.0,
          },
        ],
      },
      {
        monthName: "Mar 2026",
        hours: "168 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-mar-1",
            range: "2 Mar 2026 - 8 Mar 2026",
            month: "Mar 2026",
            isMissing: false,
            hoursLogged: 42.0,
          },
          {
            id: "w-mar-2",
            range: "9 Mar 2026 - 15 Mar 2026",
            month: "Mar 2026",
            isMissing: false,
            hoursLogged: 42.0,
          },
          {
            id: "w-mar-3",
            range: "16 Mar 2026 - 22 Mar 2026",
            month: "Mar 2026",
            isMissing: false,
            hoursLogged: 42.0,
          },
          {
            id: "w-mar-4",
            range: "23 Mar 2026 - 29 Mar 2026",
            month: "Mar 2026",
            isMissing: false,
            hoursLogged: 42.0,
          },
        ],
      },
      {
        monthName: "Apr 2026",
        hours: "160 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-apr-1",
            range: "30 Mar 2026 - 5 Apr 2026",
            month: "Apr 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-apr-2",
            range: "6 Apr 2026 - 12 Apr 2026",
            month: "Apr 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-apr-3",
            range: "13 Apr 2026 - 19 Apr 2026",
            month: "Apr 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-apr-4",
            range: "20 Apr 2026 - 26 Apr 2026",
            month: "Apr 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
        ],
      },
      {
        monthName: "May 2026",
        hours: "160 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-may-1",
            range: "27 Apr 2026 - 3 May 2026",
            month: "May 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-may-2",
            range: "4 May 2026 - 10 May 2026",
            month: "May 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-may-3",
            range: "11 May 2026 - 17 May 2026",
            month: "May 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-may-4",
            range: "18 May 2026 - 24 May 2026",
            month: "May 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
        ],
      },
      {
        monthName: "Jun 2026",
        hours: "160 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-jun-1",
            range: "1 Jun 2026 - 7 Jun 2026",
            month: "Jun 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jun-2",
            range: "8 Jun 2026 - 14 Jun 2026",
            month: "Jun 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jun-3",
            range: "15 Jun 2026 - 21 Jun 2026",
            month: "Jun 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jun-4",
            range: "22 Jun 2026 - 28 Jun 2026",
            month: "Jun 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
        ],
      },
      {
        monthName: "Jul 2026",
        hours: "160 hrs",
        status: "Submitted",
        weeks: [
          {
            id: "w-jul-1",
            range: "29 Jun 2026 - 5 Jul 2026",
            month: "Jul 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jul-2",
            range: "6 Jul 2026 - 12 Jul 2026",
            month: "Jul 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jul-3",
            range: "13 Jul 2026 - 19 Jul 2026",
            month: "Jul 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
          {
            id: "w-jul-4",
            range: "20 Jul 2026 - 26 Jul 2026",
            month: "Jul 2026",
            isMissing: false,
            hoursLogged: 40.0,
          },
        ],
      },
      {
        monthName: "Aug 2026",
        isCurrent: true,
        hours: "172.5 hrs",
        status: "In Progress",
        weeks: currentMonthWeeks,
      },
      {
        monthName: "Sep 2026",
        hours: "0 hrs",
        status: "Upcoming",
        weeks: [
          {
            id: "w-sep-1",
            range: "31 Aug 2026 - 6 Sep 2026",
            month: "Sep 2026",
            isLocked: true,
          },
          {
            id: "w-sep-2",
            range: "7 Sep 2026 - 13 Sep 2026",
            month: "Sep 2026",
            isLocked: true,
          },
          {
            id: "w-sep-3",
            range: "14 Sep 2026 - 20 Sep 2026",
            month: "Sep 2026",
            isLocked: true,
          },
          {
            id: "w-sep-4",
            range: "21 Sep 2026 - 27 Sep 2026",
            month: "Sep 2026",
            isLocked: true,
          },
        ],
      },
    ],
    [currentMonthWeeks],
  );

  // All History Log Items compiled
  const allHistoryLogs = useMemo(() => {
    const logsList: Array<{
      id: string;
      date: string;
      project: string;
      category: string;
      hours: string;
      desc: string;
    }> = [];
    Object.values(weeklyDayStore).forEach((days) => {
      days.forEach((day) => {
        day.entries.forEach((entry) => {
          logsList.push({
            id: entry.id,
            date: day.dateStr,
            project: entry.project,
            category: entry.category || "Development",
            hours: entry.hours,
            desc: entry.desc,
          });
        });
      });
    });
    return logsList.filter((log) => {
      const matchesSearch =
        log.project.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesProject =
        selectedProjectFilter === "All" ||
        log.project === selectedProjectFilter;
      return matchesSearch && matchesProject;
    });
  }, [weeklyDayStore, searchQuery, selectedProjectFilter]);

  // Handle Form Submission for Adding Log
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logDesc.trim()) return;

    const newEntry = {
      id: `e-${Date.now()}`,
      project: logProject,
      category: logCategory,
      hours: `${logHours} hrs`,
      desc: logDesc,
    };

    const targetWeekId = selectedWeek.id;
    const targetDayLabel = activeDayForAdd?.dayLabel || "Aug 24, Mon";

    setWeeklyDayStore((prev) => {
      const currentDays = prev[targetWeekId] || [
        {
          id: "d1",
          dayLabel: "Aug 24, Mon",
          dateStr: "24 Aug 2026",
          entries: [],
        },
        {
          id: "d2",
          dayLabel: "Aug 25, Tue",
          dateStr: "25 Aug 2026",
          entries: [],
        },
        {
          id: "d3",
          dayLabel: "Aug 26, Wed",
          dateStr: "26 Aug 2026",
          entries: [],
        },
        {
          id: "d4",
          dayLabel: "Aug 27, Thu",
          dateStr: "27 Aug 2026",
          entries: [],
        },
        {
          id: "d5",
          dayLabel: "Aug 28, Fri",
          dateStr: "28 Aug 2026",
          entries: [],
        },
        {
          id: "d6",
          dayLabel: "Aug 29, Sat",
          dateStr: "29 Aug 2026",
          entries: [],
        },
        {
          id: "d7",
          dayLabel: "Aug 30, Sun",
          dateStr: "30 Aug 2026",
          entries: [],
        },
      ];

      const updatedDays = currentDays.map((d) => {
        if (
          d.dayLabel === targetDayLabel ||
          d.dateStr === activeDayForAdd?.dateStr
        ) {
          return { ...d, entries: [...d.entries, newEntry] };
        }
        return d;
      });

      return { ...prev, [targetWeekId]: updatedDays };
    });

    setIsAddLogOpen(false);
    setActiveDayForAdd(null);
    setLogDesc("");
    setSubmittedSuccessMsg("Worklog entry added successfully!");
    setTimeout(() => setSubmittedSuccessMsg(null), 3000);
  };

  const handleSubmitWeeklyLog = () => {
    if (!selectedWeek) return;
    setSubmittedSuccessMsg(
      `Weekly log for ${selectedWeek.range} submitted to manager for approval!`,
    );
    setTimeout(() => setSubmittedSuccessMsg(null), 3500);

    setCurrentMonthWeeks((prev) =>
      prev.map((w) =>
        w.id === selectedWeek.id ? { ...w, isMissing: false } : w,
      ),
    );
  };

  const currentDays = weeklyDayStore[selectedWeek.id] || [
    { id: "d1", dayLabel: "Aug 24, Mon", dateStr: "24 Aug 2026", entries: [] },
    { id: "d2", dayLabel: "Aug 25, Tue", dateStr: "25 Aug 2026", entries: [] },
    { id: "d3", dayLabel: "Aug 26, Wed", dateStr: "26 Aug 2026", entries: [] },
    { id: "d4", dayLabel: "Aug 27, Thu", dateStr: "27 Aug 2026", entries: [] },
    { id: "d5", dayLabel: "Aug 28, Fri", dateStr: "28 Aug 2026", entries: [] },
    { id: "d6", dayLabel: "Aug 29, Sat", dateStr: "29 Aug 2026", entries: [] },
    { id: "d7", dayLabel: "Aug 30, Sun", dateStr: "30 Aug 2026", entries: [] },
  ];

  // Calculate total week hours in active worksheet
  const currentWeekTotalHours = useMemo(() => {
    return currentDays.reduce((acc, d) => {
      const daySum = d.entries.reduce(
        (sum, e) => sum + (parseFloat(e.hours) || 0),
        0,
      );
      return acc + daySum;
    }, 0);
  }, [currentDays]);

  return (
    <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
      {/* Toast Feedback Notification */}
      {submittedSuccessMsg && (
        <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-600 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            <span>{submittedSuccessMsg}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSubmittedSuccessMsg(null)}
            className="h-5 cursor-pointer p-0 text-[11px] text-emerald-600 hover:text-emerald-500"
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Header Row: Title, Subtitle, Quick Action Button */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              My Worklogs
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none border px-3 py-0.5 text-xs font-semibold">
              Aug 2026
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Track daily project activities, submit weekly timesheets, and review
            monthly work logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Button
            onClick={() => {
              setActiveDayForAdd({
                dayLabel: "Aug 24, Mon",
                dateStr: "24 Aug 2026",
              });
              setIsAddLogOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-2 rounded-none px-4 text-xs font-semibold shadow-xs"
          >
            <Plus className="h-4 w-4" /> + Log Time
          </Button>
        </div>
      </div>

      {/* 4 Executive Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: MONTHLY HOURS LOGGED */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              MONTHLY HOURS
            </span>
            <div className="bg-primary/10 border-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-none border">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold tracking-tight">
              172.5 hrs
            </div>
            <div className="text-muted-foreground mt-1 flex items-center justify-between text-[11px]">
              <span>Target: 168.0 hrs</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                102%
              </span>
            </div>
          </div>
        </Card>

        {/* Card 2: WEEKLY GOAL */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              WEEKLY GOAL
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold tracking-tight">
              {currentWeekTotalHours.toFixed(1)} / 40.0 hrs
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Week of {selectedWeek.range.split(" - ")[0]}
            </p>
          </div>
        </Card>

        {/* Card 3: SUBMISSION STATUS */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              SUBMISSION STATUS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              Up to Date
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              0 pending timesheets
            </p>
          </div>
        </Card>

        {/* Card 4: ACTIVE PROJECTS */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              ACTIVE PROJECTS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-purple-500/20 bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <FolderKanban className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold tracking-tight">
              4 Projects
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Appofy, WorkSync, QC, Design
            </p>
          </div>
        </Card>
      </div>

      {/* View Mode Navigation Tabs */}
      <div className="border-border no-scrollbar flex items-center gap-6 overflow-x-auto border-b pb-2 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab("worksheet")}
          className={cn(
            "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
            activeTab === "worksheet"
              ? "border-primary text-primary font-bold"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          <Calendar className="h-4 w-4" />
          <span>Weekly Worksheet</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("calendar")}
          className={cn(
            "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
            activeTab === "calendar"
              ? "border-primary text-primary font-bold"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          <CalendarCheck className="h-4 w-4" />
          <span>Monthly Calendar</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("history")}
          className={cn(
            "flex cursor-pointer items-center gap-2 border-b-2 pb-2 whitespace-nowrap transition-all",
            activeTab === "history"
              ? "border-primary text-primary font-bold"
              : "text-muted-foreground hover:text-foreground border-transparent",
          )}
        >
          <FileText className="h-4 w-4" />
          <span>Activity History</span>
          <span className="bg-primary/10 text-primary rounded-none px-2 py-0.5 text-[11px]">
            {allHistoryLogs.length}
          </span>
        </button>
      </div>

      {/* TAB 1: WEEKLY WORKSHEET */}
      {activeTab === "worksheet" && (
        <div className="space-y-5">
          {/* Week Selector Bar */}
          <Card className="bg-card border-border flex flex-col justify-between gap-3 rounded-none p-3.5 shadow-xs sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground text-xs font-semibold">
                Select Week:
              </span>
              <div className="bg-secondary/50 border-border flex items-center rounded-none border p-1">
                {currentMonthWeeks.map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWeekId(w.id)}
                    className={cn(
                      "cursor-pointer rounded-none px-3 py-1 text-xs font-semibold whitespace-nowrap transition-all",
                      selectedWeek.id === w.id
                        ? "bg-primary text-primary-foreground font-bold shadow-xs"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {w.range.split(" - ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleSubmitWeeklyLog}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 cursor-pointer gap-1.5 self-start rounded-none px-4 text-xs font-semibold shadow-xs sm:self-auto"
            >
              <Send className="h-3.5 w-3.5" /> Submit Weekly Log
            </Button>
          </Card>

          {/* 7 Horizontal Day Cards Grid (Mon - Sun) */}
          <div className="overflow-x-auto pb-2">
            <div className="grid min-w-[1100px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7">
              {currentDays.map((day) => {
                const dayTotal = day.entries.reduce(
                  (sum, e) => sum + (parseFloat(e.hours) || 0),
                  0,
                );
                return (
                  <Card
                    key={day.id}
                    className="bg-card border-border/80 hover:border-border flex min-h-[380px] flex-col justify-between rounded-none border p-3.5 shadow-xs transition-all"
                  >
                    {/* Day Header Floating Pill */}
                    <div className="border-border/60 mb-3 flex items-center justify-between border-b pb-2.5">
                      <span className="text-foreground text-xs font-bold">
                        {day.dayLabel}
                      </span>
                      <Badge
                        className={cn(
                          "rounded-none border px-2 py-0.5 font-mono text-[10px] font-bold",
                          dayTotal >= 8
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : dayTotal > 0
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                              : "bg-secondary text-muted-foreground border-border",
                        )}
                      >
                        {dayTotal > 0 ? `${dayTotal.toFixed(1)} hrs` : "0 hrs"}
                      </Badge>
                    </div>

                    {/* Day Content Area */}
                    <div className="flex flex-1 flex-col items-center justify-center gap-3">
                      {day.entries.length === 0 ? (
                        <div className="my-auto flex flex-col items-center justify-center gap-2 p-3 text-center">
                          <div className="bg-secondary/60 text-muted-foreground/60 border-border flex h-9 w-9 items-center justify-center rounded-none border">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <span className="text-muted-foreground text-[11px] font-medium">
                            No logs logged yet
                          </span>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveDayForAdd({
                                dayLabel: day.dayLabel,
                                dateStr: day.dateStr,
                              });
                              setIsAddLogOpen(true);
                            }}
                            className="border-border hover:bg-primary/5 hover:text-primary mt-1 h-7 cursor-pointer rounded-none px-2.5 text-[11px] font-semibold"
                          >
                            + Add Entry
                          </Button>
                        </div>
                      ) : (
                        <div className="my-auto flex w-full flex-col gap-2.5">
                          {day.entries.map((entry) => (
                            <Card
                              key={entry.id}
                              className="bg-secondary/30 border-border hover:bg-secondary/50 space-y-1.5 rounded-none border p-3 text-left shadow-2xs transition-all"
                            >
                              <div className="flex items-center justify-between gap-1">
                                <Badge className="bg-primary/10 text-primary border-primary/20 truncate rounded-none border px-2 py-0.5 text-[10px] font-semibold">
                                  {entry.project}
                                </Badge>
                                <span className="text-foreground font-mono text-[10px] font-bold">
                                  {entry.hours}
                                </span>
                              </div>
                              {entry.category && (
                                <span className="text-muted-foreground block text-[10px] font-semibold">
                                  {entry.category}
                                </span>
                              )}
                              <p className="text-muted-foreground line-clamp-3 text-[11px] leading-snug">
                                {entry.desc}
                              </p>
                            </Card>
                          ))}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setActiveDayForAdd({
                                dayLabel: day.dayLabel,
                                dateStr: day.dateStr,
                              });
                              setIsAddLogOpen(true);
                            }}
                            className="border-border hover:bg-primary/5 hover:text-primary h-7 w-full cursor-pointer rounded-none text-[11px] font-semibold"
                          >
                            + Add Entry
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY CALENDAR */}
      {activeTab === "calendar" && (
        <div className="space-y-6">
          {/* Current Month Box */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
                CURRENT MONTH &bull; AUG 2026
              </h3>
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none border px-3 py-0.5 text-xs font-semibold">
                Active Month
              </Badge>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {currentMonthWeeks.map((week) => (
                <Card
                  key={week.id}
                  className="bg-card border-border hover:border-primary/40 space-y-3 rounded-none p-4 shadow-xs transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-mono text-xs font-bold">
                      {week.range}
                    </span>
                    {week.isMissing ? (
                      <span className="inline-flex items-center gap-1 rounded-none border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        <AlertCircle className="h-3 w-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-none border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="h-3 w-3" /> Submitted
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-muted-foreground">Hours Logged:</span>
                    <span className="text-foreground font-mono font-bold">
                      {week.hoursLogged || 0} hrs
                    </span>
                  </div>

                  <div className="border-border/40 flex items-center gap-2 border-t pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWeekId(week.id);
                        setActiveTab("worksheet");
                      }}
                      className="border-border hover:bg-secondary h-8 w-full cursor-pointer gap-1.5 rounded-none text-xs font-semibold"
                    >
                      <Calendar className="text-primary h-3.5 w-3.5" /> Open
                      Worksheet
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Historical 12-Month Calendar */}
          <div className="space-y-3">
            <h3 className="text-foreground text-xs font-bold tracking-wider uppercase">
              ALL MONTHS (2026 CALENDAR)
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {historicalMonths.map(
                (m: {
                  monthName: string;
                  hours: string;
                  status: string;
                  isCurrent?: boolean;
                }) => (
                  <Card
                    key={m.monthName}
                    className={cn(
                      "bg-card border-border space-y-3 rounded-none p-4 shadow-xs",
                      m.isCurrent && "border-primary/50 ring-primary/20 ring-1",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-foreground text-sm font-bold">
                        {m.monthName}
                      </span>
                      <Badge
                        className={cn(
                          "rounded-none border px-2.5 py-0.5 text-[11px] font-semibold",
                          m.status === "Submitted"
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : m.status === "In Progress"
                              ? "bg-primary/10 text-primary border-primary/20 font-bold"
                              : "bg-secondary text-muted-foreground border-border",
                        )}
                      >
                        {m.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between pt-1 font-mono text-xs">
                      <span className="text-muted-foreground">Logged:</span>
                      <span className="text-foreground font-bold">
                        {m.hours}
                      </span>
                    </div>
                  </Card>
                ),
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ACTIVITY HISTORY */}
      {activeTab === "history" && (
        <Card className="bg-card border-border space-y-4 rounded-none p-4 shadow-xs">
          <div className="border-border flex items-center justify-between border-b pb-3">
            <div>
              <h3 className="text-foreground text-sm font-bold">
                Recent Submissions & Logs
              </h3>
              <p className="text-muted-foreground text-xs">
                Historical log of all recorded worklog entries
              </p>
            </div>
            <Badge variant="outline" className="rounded-none text-xs">
              Total{" "}
              {
                (weeklyDayStore[selectedWeekId] || []).flatMap((d) => d.entries)
                  .length
              }{" "}
              records
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-border text-muted-foreground bg-secondary/30 border-b text-[10px] tracking-wider uppercase">
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Project</th>
                  <th className="px-3 py-2.5">Hours</th>
                  <th className="px-3 py-2.5">Deliverable / Description</th>
                  <th className="px-3 py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-border/40 divide-y">
                {(weeklyDayStore[selectedWeekId] || [])
                  .flatMap((d) =>
                    d.entries.map((e) => ({ ...e, dateStr: d.dateStr })),
                  )
                  .map(
                    (entry: {
                      id: string;
                      project: string;
                      hours: string;
                      desc: string;
                      dateStr: string;
                    }) => (
                      <tr
                        key={entry.id}
                        className="hover:bg-secondary/20 transition-colors"
                      >
                        <td className="text-foreground px-3 py-2.5 font-mono font-medium whitespace-nowrap">
                          {entry.dateStr}
                        </td>
                        <td className="text-primary px-3 py-2.5 font-semibold">
                          {entry.project}
                        </td>
                        <td className="text-foreground px-3 py-2.5 font-mono font-bold">
                          {entry.hours}
                        </td>
                        <td className="text-muted-foreground max-w-md truncate px-3 py-2.5">
                          {entry.desc}
                        </td>
                        <td className="px-3 py-2.5">
                          <span className="inline-flex items-center gap-1 rounded-none border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Logged
                          </span>
                        </td>
                      </tr>
                    ),
                  )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Day Log Dialog */}
      <Dialog
        open={!!activeDayForAdd}
        onOpenChange={(open) => !open && setActiveDayForAdd(null)}
      >
        <DialogContent className="bg-card border-border max-w-md rounded-none">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Add Worklog
            </DialogTitle>
            {activeDayForAdd && (
              <span className="text-primary text-xs font-semibold">
                Date: {activeDayForAdd.dayLabel} ({activeDayForAdd.dateStr})
              </span>
            )}
          </DialogHeader>

          <form onSubmit={handleSaveDayLog} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Project</Label>
              <select
                value={logProject}
                onChange={(e) => setLogProject(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full rounded-none border p-2 text-xs outline-none"
              >
                <option value="Appofy" className="bg-card text-foreground">
                  Appofy
                </option>
                <option
                  value="Testing filter for user filter"
                  className="bg-card text-foreground"
                >
                  Testing filter for user filter
                </option>
                <option value="WorkSync" className="bg-card text-foreground">
                  WorkSync
                </option>
                <option
                  value="Design System & Component Library"
                  className="bg-card text-foreground"
                >
                  Design System
                </option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Hours Logged</Label>
              <Input
                required
                type="number"
                step="0.5"
                min="0.5"
                max="24"
                value={logHours}
                onChange={(e) => setLogHours(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">
                Deliverables / Task Description
              </Label>
              <textarea
                rows={3}
                required
                placeholder="Describe your daily task deliverables..."
                value={logDesc}
                onChange={(e) => setLogDesc(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full resize-none rounded-none border p-2 text-xs outline-none"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveDayForAdd(null)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs"
              >
                Save Worklog
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================================================================
   4. MY ASSETS VIEW
   ========================================================================= */
export function MyAssetsView() {
  const assets = [
    {
      tag: "AST-MBP-901",
      name: "MacBook Pro 16-inch (M2 Max)",
      category: "Laptop",
      serial: "C02G4012Q05N",
      issuedDate: "10 Sep 2024",
      status: "In Use",
    },
    {
      tag: "AST-MON-302",
      name: "Dell UltraSharp 27-inch 4K Monitor",
      category: "Display",
      serial: "CN-093821-701",
      issuedDate: "15 Sep 2024",
      status: "In Use",
    },
    {
      tag: "AST-ACC-110",
      name: "Logitech MX Master 3S Mouse",
      category: "Peripheral",
      serial: "LZ-881920-001",
      issuedDate: "10 Sep 2024",
      status: "In Use",
    },
  ];

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      <div className="border-border bg-card flex flex-col justify-between gap-4 border p-5 shadow-xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Laptop className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              My Assets
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
            >
              {assets.length} Assigned Hardware
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Hardware equipment, laptops, peripherals, and device inventory
            assigned to your account.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {assets.map((asset) => (
          <Card
            key={asset.tag}
            className="bg-card border-border flex flex-col justify-between gap-4 rounded-none border p-5 shadow-none"
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Badge
                  variant="outline"
                  className="text-muted-foreground rounded-none text-[10px]"
                >
                  {asset.tag}
                </Badge>
                <Badge className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500">
                  {asset.status}
                </Badge>
              </div>

              <h3 className="text-foreground mt-1 text-sm font-bold">
                {asset.name}
              </h3>
              <div className="text-muted-foreground space-y-1 text-xs">
                <div>
                  Category:{" "}
                  <span className="text-foreground">{asset.category}</span>
                </div>
                <div>
                  Serial No:{" "}
                  <span className="text-foreground font-mono">
                    {asset.serial}
                  </span>
                </div>
                <div>
                  Issued On:{" "}
                  <span className="text-foreground">{asset.issuedDate}</span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="w-full cursor-pointer rounded-none text-xs"
            >
              Report Issue
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* =========================================================================
   5. SERVICE REQUEST VIEW (SPEC MATCHING SCREENSHOT)
   ========================================================================= */
interface ServiceRequestItem {
  id: string;
  type: string;
  description: string;
  dateFiled: string;
  status: "Pending" | "Approved" | "In Progress" | "Rejected";
}

export function ServiceRequestView() {
  const [requests, setRequests] = useState<ServiceRequestItem[]>([
    {
      id: "SR-101",
      type: "IT Support",
      description:
        "Need a high-performance developer mouse and an external keyboard.",
      dateFiled: "Jul 18, 2026",
      status: "Pending",
    },
    {
      id: "SR-102",
      type: "HR Inquiry",
      description:
        "Requesting a copy of my employment contract and health insurance handbook.",
      dateFiled: "Jul 15, 2026",
      status: "Approved",
    },
    {
      id: "SR-103",
      type: "Facility Maintenance",
      description:
        "Air conditioning unit in developer room B requires temperature adjustment.",
      dateFiled: "Jul 10, 2026",
      status: "In Progress",
    },
  ]);

  // Form State for Top "Create Service Request" Bar
  const [reqType, setReqType] = useState("IT Support");
  const [reqDesc, setReqDesc] = useState("");

  // State for Editing a Request Modal
  const [editingItem, setEditingItem] = useState<ServiceRequestItem | null>(
    null,
  );
  const [editType, setEditType] = useState("IT Support");
  const [editDesc, setEditDesc] = useState("");

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqDesc.trim()) return;

    const newItem: ServiceRequestItem = {
      id: `SR-${Date.now().toString().slice(-3)}`,
      type: reqType,
      description: reqDesc,
      dateFiled: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      status: "Pending",
    };

    setRequests([newItem, ...requests]);
    setReqDesc("");
  };

  const handleDeleteRequest = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id));
  };

  const handleStartEdit = (item: ServiceRequestItem) => {
    setEditingItem(item);
    setEditType(item.type);
    setEditDesc(item.description);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setRequests(
      requests.map((r) =>
        r.id === editingItem.id
          ? { ...r, type: editType, description: editDesc }
          : r,
      ),
    );
    setEditingItem(null);
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Page Title Header */}
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight">
          Service Requests
        </h1>
        <p className="text-muted-foreground mt-0.5 text-xs">
          Submit service tickets for IT support, HR exceptions, or facility
          maintenance, and check their resolution status.
        </p>
      </div>

      {/* TOP CARD: CREATE SERVICE REQUEST FORM BAR */}
      <Card className="bg-card border-border flex flex-col gap-4 rounded-none border p-5 shadow-none">
        <div className="border-border/60 flex items-center gap-2 border-b pb-3">
          <FileText className="text-primary h-4 w-4" />
          <h2 className="text-foreground text-sm font-bold">
            Create Service Request
          </h2>
        </div>

        <form
          onSubmit={handleCreateRequest}
          className="grid grid-cols-1 items-end gap-4 md:grid-cols-12"
        >
          {/* Request Type Select */}
          <div className="space-y-1.5 md:col-span-4">
            <Label className="text-foreground text-xs font-semibold">
              Request Type
            </Label>
            <select
              value={reqType}
              onChange={(e) => setReqType(e.target.value)}
              className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
            >
              <option value="IT Support">IT Support</option>
              <option value="HR Inquiry">HR Inquiry</option>
              <option value="Facility Maintenance">Facility Maintenance</option>
              <option value="Asset Request">Asset Request</option>
              <option value="Software License">Software License</option>
            </select>
          </div>

          {/* Description Input */}
          <div className="space-y-1.5 md:col-span-6">
            <Label className="text-foreground text-xs font-semibold">
              Description
            </Label>
            <Input
              required
              type="text"
              placeholder="Detail your request here (e.g. issues, specifications, requirements)"
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              className="bg-background border-border rounded-none text-xs"
            />
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2">
            <Button
              type="submit"
              className="bg-primary text-primary-foreground w-full cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
            >
              <Plus className="h-4 w-4" /> Submit
            </Button>
          </div>
        </form>
      </Card>

      {/* BOTTOM CARD: MY SERVICE REQUESTS DATA TABLE */}
      <Card className="bg-card border-border flex flex-col gap-4 rounded-none border p-5 shadow-none">
        <div className="border-border/60 flex flex-col gap-1 border-b pb-3">
          <h2 className="text-foreground text-sm font-bold">
            My Service Requests
          </h2>
          <p className="text-muted-foreground text-xs">
            List of submitted requests, approval logs, and tickets.
          </p>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-border bg-background/50 border-b">
                <th className="text-muted-foreground border-border/40 w-44 border-r p-3 text-[10px] font-semibold uppercase">
                  REQUEST TYPE
                </th>
                <th className="text-muted-foreground border-border/40 border-r p-3 text-[10px] font-semibold uppercase">
                  DESCRIPTION
                </th>
                <th className="text-muted-foreground border-border/40 w-36 border-r p-3 text-[10px] font-semibold uppercase">
                  DATE FILED
                </th>
                <th className="text-muted-foreground border-border/40 w-28 border-r p-3 text-center text-[10px] font-semibold uppercase">
                  STATUS
                </th>
                <th className="text-muted-foreground w-24 p-3 text-center text-[10px] font-semibold uppercase">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody>
              {requests.map((item) => (
                <tr
                  key={item.id}
                  className="border-border/60 hover:bg-secondary/20 border-b transition-all"
                >
                  {/* Request Type */}
                  <td className="text-foreground border-border/40 border-r p-3 font-bold">
                    {item.type}
                  </td>

                  {/* Description */}
                  <td className="text-muted-foreground border-border/40 border-r p-3">
                    {item.description}
                  </td>

                  {/* Date Filed */}
                  <td className="text-muted-foreground border-border/40 border-r p-3 font-mono">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="text-muted-foreground/70 h-3.5 w-3.5" />
                      <span>{item.dateFiled}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="border-border/40 border-r p-3 text-center">
                    <Badge
                      className={cn(
                        "rounded-none px-2 py-0.5 text-[10px] font-semibold uppercase",
                        item.status === "Pending" &&
                          "border-amber-500/40 bg-amber-500/10 text-amber-500",
                        item.status === "Approved" &&
                          "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
                        item.status === "In Progress" &&
                          "border-sky-500/40 bg-sky-500/10 text-sky-400",
                        item.status === "Rejected" &&
                          "border-destructive/40 bg-destructive/10 text-destructive",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </td>

                  {/* Action Buttons: Edit Pencil & Delete Trash */}
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleStartEdit(item)}
                        className="border-border text-primary hover:bg-primary/10 h-7 w-7 cursor-pointer rounded-none border"
                        title="Edit Request"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteRequest(item.id)}
                        className="border-border text-destructive hover:bg-destructive/10 h-7 w-7 cursor-pointer rounded-none border"
                        title="Delete Request"
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

      {/* EDIT REQUEST DIALOG */}
      <Dialog
        open={!!editingItem}
        onOpenChange={(open) => !open && setEditingItem(null)}
      >
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Edit Service Request
            </DialogTitle>
            {editingItem && (
              <span className="text-muted-foreground font-mono text-xs">
                {editingItem.id}
              </span>
            )}
          </DialogHeader>

          <form onSubmit={handleSaveEdit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Request Type</Label>
              <select
                value={editType}
                onChange={(e) => setEditType(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
              >
                <option value="IT Support">IT Support</option>
                <option value="HR Inquiry">HR Inquiry</option>
                <option value="Facility Maintenance">
                  Facility Maintenance
                </option>
                <option value="Asset Request">Asset Request</option>
                <option value="Software License">Software License</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Description</Label>
              <textarea
                rows={3}
                required
                value={editDesc}
                onChange={(e) => setEditDesc(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full resize-none border p-2 text-xs outline-none"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingItem(null)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================================================================
   6. MY LEAVES VIEW
   ========================================================================= */
interface LeaveRequestItem {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: "Approved" | "Pending" | "Rejected";
}

export function MyLeavesView() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestItem[]>([
    {
      id: "LV-101",
      type: "Casual Leave (CL)",
      startDate: "14 Aug 2026",
      endDate: "14 Aug 2026",
      totalDays: 1,
      reason: "Personal emergency work",
      status: "Approved",
    },
    {
      id: "LV-102",
      type: "Sick Leave (SL)",
      startDate: "02 Sep 2026",
      endDate: "03 Sep 2026",
      totalDays: 2,
      reason: "Medical consultation & recovery",
      status: "Pending",
    },
    {
      id: "LV-103",
      type: "Earned Leave (EL)",
      startDate: "20 Oct 2026",
      endDate: "24 Oct 2026",
      totalDays: 5,
      reason: "Annual family vacation",
      status: "Pending",
    },
  ]);

  // Modal State for Apply Leave
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave (CL)");
  const [startDate, setStartDate] = useState("2026-09-10");
  const [endDate, setEndDate] = useState("2026-09-12");
  const [reason, setReason] = useState("");

  const handleApplyLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    // Calculate total days
    const d1 = new Date(startDate);
    const d2 = new Date(endDate);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newRequest: LeaveRequestItem = {
      id: `LV-${Date.now().toString().slice(-3)}`,
      type: leaveType,
      startDate: new Date(startDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      endDate: new Date(endDate).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      totalDays: isNaN(diffDays) ? 1 : diffDays,
      reason: reason,
      status: "Pending",
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    setIsModalOpen(false);
    setReason("");
  };

  const handleDeleteLeave = (id: string) => {
    setLeaveRequests(leaveRequests.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <CalendarOff className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              My Leaves
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            View leave balances, track approval status, and submit time off
            requests.
          </p>
        </div>

        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
        >
          <Plus className="h-4 w-4" /> Apply Leave
        </Button>
      </div>

      {/* LEAVE BALANCES SUMMARY CARDS (3-COLUMN GRID) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Casual Leave */}
        <Card className="bg-card border-border flex flex-col justify-between gap-3 rounded-none border p-4 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold">
              Casual Leave (CL)
            </span>
            <Badge
              variant="outline"
              className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500"
            >
              Active
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl font-extrabold">8</span>
            <span className="text-muted-foreground text-xs font-medium">
              / 12 Days Available
            </span>
          </div>
          <div className="bg-secondary h-1.5 w-full overflow-hidden">
            <div className="h-full w-[66%] bg-emerald-500" />
          </div>
          <span className="text-muted-foreground text-[11px]">
            4 days used this year
          </span>
        </Card>

        {/* Sick Leave */}
        <Card className="bg-card border-border flex flex-col justify-between gap-3 rounded-none border p-4 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold">
              Sick Leave (SL)
            </span>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-[10px]"
            >
              Active
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl font-extrabold">6</span>
            <span className="text-muted-foreground text-xs font-medium">
              / 7 Days Available
            </span>
          </div>
          <div className="bg-secondary h-1.5 w-full overflow-hidden">
            <div className="bg-primary h-full w-[85%]" />
          </div>
          <span className="text-muted-foreground text-[11px]">
            1 day used this year
          </span>
        </Card>

        {/* Earned Leave */}
        <Card className="bg-card border-border flex flex-col justify-between gap-3 rounded-none border p-4 shadow-none">
          <div className="flex items-center justify-between">
            <span className="text-foreground text-xs font-bold">
              Earned Leave (EL)
            </span>
            <Badge
              variant="outline"
              className="rounded-none border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-500"
            >
              Accumulating
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-foreground text-2xl font-extrabold">15</span>
            <span className="text-muted-foreground text-xs font-medium">
              / 18 Days Available
            </span>
          </div>
          <div className="bg-secondary h-1.5 w-full overflow-hidden">
            <div className="h-full w-[83%] bg-amber-500" />
          </div>
          <span className="text-muted-foreground text-[11px]">
            3 days used this year
          </span>
        </Card>
      </div>

      {/* LEAVE APPLICATIONS TABLE */}
      <Card className="bg-card border-border flex flex-col gap-4 rounded-none border p-5 shadow-none">
        <div className="border-border/60 flex flex-col gap-1 border-b pb-3">
          <h2 className="text-foreground text-sm font-bold">
            Leave History & Status
          </h2>
          <p className="text-muted-foreground text-xs">
            Track submitted leave applications, date ranges, and approval logs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-border bg-background/50 border-b">
                <th className="text-muted-foreground border-border/40 w-44 border-r p-3 text-[10px] font-semibold uppercase">
                  LEAVE TYPE
                </th>
                <th className="text-muted-foreground border-border/40 w-32 border-r p-3 text-[10px] font-semibold uppercase">
                  START DATE
                </th>
                <th className="text-muted-foreground border-border/40 w-32 border-r p-3 text-[10px] font-semibold uppercase">
                  END DATE
                </th>
                <th className="text-muted-foreground border-border/40 w-28 border-r p-3 text-center text-[10px] font-semibold uppercase">
                  DAYS
                </th>
                <th className="text-muted-foreground border-border/40 border-r p-3 text-[10px] font-semibold uppercase">
                  REASON
                </th>
                <th className="text-muted-foreground border-border/40 w-28 border-r p-3 text-center text-[10px] font-semibold uppercase">
                  STATUS
                </th>
                <th className="text-muted-foreground w-20 p-3 text-center text-[10px] font-semibold uppercase">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody>
              {leaveRequests.map((item) => (
                <tr
                  key={item.id}
                  className="border-border/60 hover:bg-secondary/20 border-b transition-all"
                >
                  <td className="text-foreground border-border/40 border-r p-3 font-bold">
                    {item.type}
                  </td>
                  <td className="text-muted-foreground border-border/40 border-r p-3 font-mono">
                    {item.startDate}
                  </td>
                  <td className="text-muted-foreground border-border/40 border-r p-3 font-mono">
                    {item.endDate}
                  </td>
                  <td className="text-foreground border-border/40 border-r p-3 text-center font-bold">
                    <Badge
                      variant="outline"
                      className="border-border rounded-none text-[10px]"
                    >
                      {item.totalDays} {item.totalDays === 1 ? "Day" : "Days"}
                    </Badge>
                  </td>
                  <td className="text-muted-foreground border-border/40 border-r p-3">
                    {item.reason}
                  </td>
                  <td className="border-border/40 border-r p-3 text-center">
                    <Badge
                      className={cn(
                        "rounded-none px-2 py-0.5 text-[10px] font-semibold uppercase",
                        item.status === "Approved" &&
                          "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
                        item.status === "Pending" &&
                          "border-amber-500/40 bg-amber-500/10 text-amber-500",
                        item.status === "Rejected" &&
                          "border-destructive/40 bg-destructive/10 text-destructive",
                      )}
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteLeave(item.id)}
                      className="border-border text-destructive hover:bg-destructive/10 h-7 w-7 cursor-pointer rounded-none border"
                      title="Withdraw Leave Application"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* APPLY FOR LEAVE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Apply for Leave
            </DialogTitle>
            <span className="text-muted-foreground text-xs">
              Submit your time off request for manager approval.
            </span>
          </DialogHeader>

          <form onSubmit={handleApplyLeave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Leave Type</Label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
              >
                <option value="Casual Leave (CL)">Casual Leave (CL)</option>
                <option value="Sick Leave (SL)">Sick Leave (SL)</option>
                <option value="Earned Leave (EL)">Earned Leave (EL)</option>
                <option value="Maternity/Paternity Leave">
                  Maternity/Paternity Leave
                </option>
                <option value="Loss of Pay (LOP)">Loss of Pay (LOP)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Start Date</Label>
                <Input
                  required
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-background border-border rounded-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">End Date</Label>
                <Input
                  required
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-background border-border rounded-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Reason for Leave</Label>
              <textarea
                rows={3}
                required
                placeholder="State the reason for your leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full resize-none border p-2 text-xs outline-none"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs"
              >
                Submit Application
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* =========================================================================
   7. SPRINTS VIEW (SPEC MATCHING SCREENSHOT & DURATION MATH)
   ========================================================================= */
interface SprintItem {
  id: string;
  name: string;
  dateNode: string;
  hoursAllocated: string;
  status: "Completed" | "Current" | "Planning";
}

interface SprintTaskItem {
  id: string;
  code: string;
  title: string;
  description?: string;
  attachments?: string[];
  status: string;
  priority: "Urgent" | "High" | "Medium" | "Low" | "No Priority";
  dueDate: string;
  createdDate: string;
  assignee: string;
  assigneeInitials: string;
  assigneeColor: string;
  points?: string | number;
}

export function SprintsView() {
  const sidebarContext = useSidebar();
  const sidebarState = sidebarContext?.state || "expanded";
  const isMobile = sidebarContext?.isMobile || false;

  const contentWidthClass = isMobile
    ? "w-full max-w-full"
    : sidebarState === "collapsed"
      ? "w-[calc(100vw-3rem)] max-w-[calc(100vw-3rem)]"
      : "w-[calc(100vw-16rem)] max-w-[calc(100vw-16rem)]";

  const [sprintTabQueryParam, setSprintTabQueryParam] = useQueryState(
    "sprintTab",
    parseAsString.withDefault("sprints"),
  );

  const activeTab = (
    ["sprints", "backlog", "modules", "current"].includes(sprintTabQueryParam)
      ? sprintTabQueryParam
      : "sprints"
  ) as "sprints" | "backlog" | "modules" | "current";

  const setActiveTab = (tab: "sprints" | "backlog" | "modules" | "current") => {
    setSprintTabQueryParam(tab === "sprints" ? null : tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("epd_active_sprint_tab", tab);
    }
  };

  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState("Cloud...");
  const [viewMode, setViewMode] = useState<"pipes" | "list">("pipes");

  // INITIALLY NO SPRINTS SHOWN (EMPTY LIST BY DEFAULT)
  const [sprints, setSprints] = useState<SprintItem[]>([]);

  // Task Items State for Active Sprint (matching Pipe Columns from user reference image)
  const [currentSprintTasks, setCurrentSprintTasks] = useState<
    SprintTaskItem[]
  >([
    // Column 1: In Progress
    {
      id: "t-91",
      code: "IT-91",
      title: "Improve test coverage",
      status: "In Progress",
      priority: "Low",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "1",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    },
    {
      id: "t-92",
      code: "IT-92",
      title: "Build API sandbox",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "1",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    },
    {
      id: "t-93",
      code: "IT-93",
      title: "Add time tracking",
      status: "In Progress",
      priority: "Low",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "1",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    },
    {
      id: "t-94",
      code: "IT-94",
      title: "Fix tooltip positioning",
      status: "In Progress",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Priya Verma",
      assigneeInitials: "2",
      assigneeColor: "bg-indigo-500/20 text-indigo-500 border-indigo-500/40",
    },
    {
      id: "t-95",
      code: "IT-95",
      title: "Implement data archiving",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Priya Verma",
      assigneeInitials: "2",
      assigneeColor: "bg-indigo-500/20 text-indigo-500 border-indigo-500/40",
    },
    {
      id: "t-96",
      code: "IT-96",
      title: "Add multi-select",
      status: "In Progress",
      priority: "Low",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Priya Verma",
      assigneeInitials: "2",
      assigneeColor: "bg-indigo-500/20 text-indigo-500 border-indigo-500/40",
    },
    {
      id: "t-97",
      code: "IT-97",
      title: "Build integration tests",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Sahara Acharya",
      assigneeInitials: "3",
      assigneeColor: "bg-amber-500/20 text-amber-500 border-amber-500/40",
    },
    {
      id: "t-98",
      code: "IT-98",
      title: "Fix email links",
      status: "In Progress",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Sahara Acharya",
      assigneeInitials: "3",
      assigneeColor: "bg-amber-500/20 text-amber-500 border-amber-500/40",
    },
    {
      id: "task-1",
      code: "ALE-3",
      title: "Design System UI components refactoring & token setup",
      description:
        "Refactor core design system tokens and standard UI library components.",
      status: "In Progress",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "P",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    },
    {
      id: "task-3",
      code: "ALE-12",
      title: "Build system authentication API & database migration",
      status: "In Progress",
      priority: "High",
      dueDate: "Jan 05",
      createdDate: "Dec 22",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "G",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
    },

    // Column 2: Discussion
    {
      id: "t-87",
      code: "IT-87",
      title: "Add print export",
      status: "Discussion",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "2",
    },
    {
      id: "t-88",
      code: "IT-88",
      title: "Build event system",
      status: "Discussion",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "3",
    },
    {
      id: "t-89",
      code: "IT-89",
      title: "Fix broken avatars",
      status: "Discussion",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "3",
    },
    {
      id: "t-90",
      code: "IT-90",
      title: "Add sticky headers",
      status: "Discussion",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "4",
    },

    // Column 3: Reopen
    {
      id: "t-80",
      code: "IT-80",
      title: "Fix calendar widget",
      status: "Reopen",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Julian Thorne",
      assigneeInitials: "DT",
      assigneeColor: "bg-purple-500/20 text-purple-500 border-purple-500/40",
      points: "3",
    },
    {
      id: "t-81",
      code: "IT-81",
      title: "Add quick search",
      status: "Reopen",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Julian Thorne",
      assigneeInitials: "DT",
      assigneeColor: "bg-purple-500/20 text-purple-500 border-purple-500/40",
      points: "4",
    },

    // Column 4: Move to QA
    {
      id: "t-83",
      code: "IT-83",
      title: "Build tag management",
      status: "Move to QA",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "1",
    },
    {
      id: "t-84",
      code: "IT-84",
      title: "Add comment reactions",
      status: "Move to QA",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "1",
    },
    {
      id: "t-85",
      code: "IT-85",
      title: "Fix dropdown overflow",
      status: "Move to QA",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "2",
    },
    {
      id: "t-86",
      code: "IT-86",
      title: "Implement schema migrations",
      status: "Move to QA",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "2",
    },
    {
      id: "t-82",
      code: "IT-82",
      title: "Improve table sorting",
      status: "Move to QA",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "3",
    },

    // Column 5: Todo
    {
      id: "t-78",
      code: "IT-78",
      title: "Add custom fields",
      status: "Todo",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Elena Vance",
      assigneeInitials: "CP",
      assigneeColor: "bg-rose-500/20 text-rose-500 border-rose-500/40",
      points: "2",
    },
    {
      id: "t-79",
      code: "IT-79",
      title: "Build approval workflow",
      status: "Todo",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Elena Vance",
      assigneeInitials: "CP",
      assigneeColor: "bg-rose-500/20 text-rose-500 border-rose-500/40",
      points: "3",
    },
    {
      id: "task-4",
      code: "ALE-15",
      title: "Integrate nuqs URL state management for workspace filters",
      status: "Todo",
      priority: "Medium",
      dueDate: "Jan 12",
      createdDate: "Dec 23",
      assignee: "Priya Verma",
      assigneeInitials: "P",
      assigneeColor: "bg-indigo-500/20 text-indigo-500 border-indigo-500/40",
    },

    // Column 6: Completed
    {
      id: "t-75",
      code: "IT-75",
      title: "Add role-based access",
      status: "Completed",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "1",
    },
    {
      id: "t-76",
      code: "IT-76",
      title: "Fix memory issue",
      status: "Completed",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "2",
    },
    {
      id: "t-77",
      code: "IT-77",
      title: "Implement token refresh",
      status: "Completed",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "2",
    },

    // Column 7: Done
    {
      id: "t-67",
      code: "IT-67",
      title: "Fix cookie handling",
      status: "Done",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "2",
    },
    {
      id: "t-68",
      code: "IT-68",
      title: "Implement deep links",
      status: "Done",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "2",
    },
    {
      id: "t-69",
      code: "IT-69",
      title: "Add color theme picker",
      status: "Done",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "2",
    },
    {
      id: "t-70",
      code: "IT-70",
      title: "Build notification preferences",
      status: "Done",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "3",
    },
    {
      id: "t-71",
      code: "IT-71",
      title: "Fix race condition",
      status: "Done",
      priority: "High",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "3",
    },
    {
      id: "t-72",
      code: "IT-72",
      title: "Add import from CSV",
      status: "Done",
      priority: "Medium",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "4",
    },
    {
      id: "t-73",
      code: "IT-73",
      title: "Improve form validation",
      status: "Done",
      priority: "Low",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Pritam Shukla",
      assigneeInitials: "AD",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
      points: "1",
    },
    {
      id: "t-74",
      code: "IT-74",
      title: "Build audit trail",
      status: "Done",
      priority: "Urgent",
      dueDate: "Jan 08",
      createdDate: "Dec 20",
      assignee: "Gaurvi Sharmi",
      assigneeInitials: "BD",
      assigneeColor: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
      points: "1",
    },
    {
      id: "task-2",
      code: "ALE-7",
      title: "fdsafdsa",
      status: "Done",
      priority: "Urgent",
      dueDate: "Jan 05",
      createdDate: "Dec 22",
      assignee: "Sahara Acharya",
      assigneeInitials: "S",
      assigneeColor: "bg-amber-500/20 text-amber-500 border-amber-500/40",
    },
  ]);

  // Modal State for Add Task
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskAttachments, setTaskAttachments] = useState<string[]>([]);
  const [createMore, setCreateMore] = useState(false);
  const [taskStatus, setTaskStatus] = useState("Todo");
  const [taskPriority, setTaskPriority] = useState<
    "Urgent" | "High" | "Medium" | "Low" | "No Priority"
  >("High");
  const [taskAssignee, setTaskAssignee] = useState("Pritam Shukla");
  const [taskDueDate, setTaskDueDate] = useState("Jan 10");

  const handleAddTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    const initials = taskAssignee
      ? taskAssignee
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "P";

    const newTask: SprintTaskItem & {
      description?: string;
      attachments?: string[];
    } = {
      id: `task-${Date.now()}`,
      code: `ALE-${currentSprintTasks.length + 18}`,
      title: taskTitle.trim(),
      description: taskDescription.trim() || undefined,
      attachments:
        taskAttachments.length > 0 ? [...taskAttachments] : undefined,
      status: taskStatus || "Todo",
      priority: taskPriority,
      dueDate: taskDueDate || "Jan 10",
      createdDate: "Dec 24",
      assignee: taskAssignee || "Pritam Shukla",
      assigneeInitials: initials || "P",
      assigneeColor: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    };

    setCurrentSprintTasks([...currentSprintTasks, newTask]);

    setTaskTitle("");
    setTaskDescription("");
    setTaskAttachments([]);

    if (!createMore) {
      setIsAddTaskOpen(false);
    }
  };

  const ASSIGNEES_LIST = [
    {
      name: "Pritam Shukla",
      initials: "P",
      color: "bg-sky-500/20 text-sky-500 border-sky-500/40",
    },
    {
      name: "Priya Verma",
      initials: "P",
      color: "bg-indigo-500/20 text-indigo-500 border-indigo-500/40",
    },
    {
      name: "Sahara Acharya",
      initials: "S",
      color: "bg-amber-500/20 text-amber-500 border-amber-500/40",
    },
    {
      name: "Gaurvi Sharmi",
      initials: "G",
      color: "bg-emerald-500/20 text-emerald-500 border-emerald-500/40",
    },
    {
      name: "Elena Vance",
      initials: "EV",
      color: "bg-rose-500/20 text-rose-500 border-rose-500/40",
    },
    {
      name: "Julian Thorne",
      initials: "JT",
      color: "bg-purple-500/20 text-purple-500 border-purple-500/40",
    },
    {
      name: "Sarah Chen",
      initials: "SC",
      color: "bg-cyan-500/20 text-cyan-500 border-cyan-500/40",
    },
    {
      name: "Wei Lin",
      initials: "WL",
      color: "bg-teal-500/20 text-teal-500 border-teal-500/40",
    },
    {
      name: "Marcus Okafor",
      initials: "MO",
      color: "bg-blue-500/20 text-blue-500 border-blue-500/40",
    },
  ];

  const handleReassignTask = (
    taskId: string,
    person: { name: string; initials: string; color: string },
  ) => {
    setCurrentSprintTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              assignee: person.name,
              assigneeInitials: person.initials,
              assigneeColor: person.color,
            }
          : t,
      ),
    );
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: string) => {
    setCurrentSprintTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t)),
    );
  };
  // Task Detail View Screen State
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<
    (SprintTaskItem & { description?: string }) | null
  >(null);
  const [initialTaskDetail, setInitialTaskDetail] = useState<
    (SprintTaskItem & { description?: string }) | null
  >(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [taskActivityLogs, setTaskActivityLogs] = useState<ActivityLogItem[]>([
    {
      id: "act-1",
      user: "Elena Vance",
      role: "Senior Systems Lead",
      type: "comment",
      content:
        "Completed initial refactoring and component tokens. Ready for review and testing.",
      timestamp: "25 minutes ago",
    },
    {
      id: "act-2",
      user: "Elena Vance",
      role: "Senior Systems Lead",
      type: "status",
      content: "reassigned task from Pritam Shukla to Sahara Acharya",
      timestamp: "45 minutes ago",
    },
    {
      id: "act-3",
      user: "Sahara Acharya",
      role: "Intern Frontend Developer",
      type: "status",
      content: "changed status from To Do to In Progress",
      timestamp: "1 hour ago",
    },
    {
      id: "act-3b",
      user: "Sahara Acharya",
      role: "Intern Frontend Developer",
      type: "attachment",
      content: "uploaded image attachment Task Attachment",
      timestamp: "2 hours ago",
    },
    {
      id: "act-4",
      user: "Elena Vance",
      role: "Senior Systems Lead",
      type: "create",
      content: "created this task",
      timestamp: "4 hours ago",
    },
  ]);

  const handleAddActivityLog = (log: ActivityLogItem) => {
    setTaskActivityLogs((prev) => [log, ...prev]);
  };

  const handleUpdateActivityLog = (
    id: string,
    updatedContent: string,
    updatedImage?: string,
  ) => {
    setTaskActivityLogs((prev) =>
      prev.map((log) =>
        log.id === id
          ? { ...log, content: updatedContent, image: updatedImage }
          : log,
      ),
    );
  };

  const handleDeleteActivityLog = (id: string) => {
    setTaskActivityLogs((prev) => prev.filter((log) => log.id !== id));
  };

  const logTaskChange = (content: string) => {
    setTaskActivityLogs((prev) => [
      {
        id: `act-${prev.length + 1}`,
        user: "Elena Vance",
        role: "Senior Systems Lead",
        type: "status",
        content,
        timestamp: "Just now",
      },
      ...prev,
    ]);
  };

  const openTaskDetail = (
    task: (SprintTaskItem & { description?: string }) | null,
  ) => {
    setSelectedTaskDetail(task);
    setInitialTaskDetail(task ? { ...task } : null);
  };

  const hasTaskChanged = Boolean(
    selectedTaskDetail &&
    initialTaskDetail &&
    (selectedTaskDetail.title !== initialTaskDetail.title ||
      (selectedTaskDetail.description ?? "") !==
        (initialTaskDetail.description ?? "")),
  );

  const handleUpdateTaskInList = (
    updatedTask: SprintTaskItem & { description?: string },
  ) => {
    setCurrentSprintTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t)),
    );
  };

  // Modal State for Add / Generate Sprints
  const [isAddSprintOpen, setIsAddSprintOpen] = useState(false);
  const [modalProject, setModalProject] = useState("Cloud...");
  const [durationMonths, setDurationMonths] = useState("3"); // Default 3 Months
  const [startDateStr, setStartDateStr] = useState("2026-10-01");

  // Single Sprint creation state (when sprints already exist)
  const [singleSprintName, setSingleSprintName] = useState("");
  const [singleDateNode, setSingleDateNode] = useState("Jan 21");
  const [singleHours, setSingleHours] = useState("80");
  const [singleStatus, setSingleStatus] = useState<
    "Completed" | "Current" | "Planning"
  >("Planning");

  // Active Board Filter States (Persisted in URL Query & localStorage across page reloads)
  const [searchQueryParam, setSearchQueryParam] = useQueryState(
    "search",
    parseAsString.withDefault(""),
  );
  const [assigneeQueryParam, setAssigneeQueryParam] = useQueryState(
    "assignee",
    parseAsString.withDefault(""),
  );
  const [labelQueryParam, setLabelQueryParam] = useQueryState(
    "label",
    parseAsString.withDefault(""),
  );
  const [priorityQueryParam, setPriorityQueryParam] = useQueryState(
    "priority",
    parseAsString.withDefault(""),
  );
  const [statusQueryParam, setStatusQueryParam] = useQueryState(
    "status",
    parseAsString.withDefault(""),
  );

  const boardSearchQuery = searchQueryParam || "";
  const selectedAssigneeFilter = assigneeQueryParam || null;
  const selectedLabelFilter = labelQueryParam || null;
  const selectedPriorityFilter = priorityQueryParam || null;
  const selectedStatusFilter = statusQueryParam || null;

  // Sync state changes with URL query state and localStorage
  const setBoardSearchQuery = (val: string) => {
    setSearchQueryParam(val || null);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("epd_filter_search", val);
      else localStorage.removeItem("epd_filter_search");
    }
  };

  const setSelectedAssigneeFilter = (val: string | null) => {
    setAssigneeQueryParam(val || null);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("epd_filter_assignee", val);
      else localStorage.removeItem("epd_filter_assignee");
    }
  };

  const setSelectedLabelFilter = (val: string | null) => {
    setLabelQueryParam(val || null);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("epd_filter_label", val);
      else localStorage.removeItem("epd_filter_label");
    }
  };

  const setSelectedPriorityFilter = (val: string | null) => {
    setPriorityQueryParam(val || null);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("epd_filter_priority", val);
      else localStorage.removeItem("epd_filter_priority");
    }
  };

  const setSelectedStatusFilter = (val: string | null) => {
    setStatusQueryParam(val || null);
    if (typeof window !== "undefined") {
      if (val) localStorage.setItem("epd_filter_status", val);
      else localStorage.removeItem("epd_filter_status");
    }
  };

  const handleClearBoardFilters = () => {
    setBoardSearchQuery("");
    setSelectedAssigneeFilter(null);
    setSelectedLabelFilter(null);
    setSelectedPriorityFilter(null);
    setSelectedStatusFilter(null);
  };

  const currentTaskIndex = selectedTaskDetail
    ? currentSprintTasks.findIndex((t) => t.id === selectedTaskDetail.id)
    : -1;
  const totalTaskCount = currentSprintTasks.length || 1;

  const handlePrevTask = () => {
    if (currentTaskIndex > 0) {
      openTaskDetail(currentSprintTasks[currentTaskIndex - 1]);
    }
  };

  const handleNextTask = () => {
    if (
      currentTaskIndex >= 0 &&
      currentTaskIndex < currentSprintTasks.length - 1
    ) {
      openTaskDetail(currentSprintTasks[currentTaskIndex + 1]);
    }
  };

  const isAnyBoardFilterActive = Boolean(
    boardSearchQuery ||
    selectedAssigneeFilter ||
    selectedLabelFilter ||
    selectedPriorityFilter ||
    selectedStatusFilter,
  );

  const filteredSprintTasks = currentSprintTasks.filter((task) => {
    if (
      boardSearchQuery &&
      !task.title.toLowerCase().includes(boardSearchQuery.toLowerCase()) &&
      !task.code.toLowerCase().includes(boardSearchQuery.toLowerCase())
    ) {
      return false;
    }

    if (
      selectedAssigneeFilter &&
      task.assignee.toLowerCase() !== selectedAssigneeFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      selectedPriorityFilter &&
      task.priority.toLowerCase() !== selectedPriorityFilter.toLowerCase()
    ) {
      return false;
    }

    if (
      selectedStatusFilter &&
      task.status.toLowerCase() !== selectedStatusFilter.toLowerCase()
    ) {
      return false;
    }

    if (selectedLabelFilter) {
      const lowerLbl = selectedLabelFilter.toLowerCase();
      const matchesTitle = task.title.toLowerCase().includes(lowerLbl);
      if (!matchesTitle) return false;
    }

    return true;
  });

  const defaultGroupOrder = [
    "In Progress",
    "Todo",
    "Move to QA",
    "Discussion",
    "Reopen",
    "Done",
    "Completed",
    "Cancelled",
  ];

  const activeBoardStatusNames = Array.from(
    new Set([
      "In Progress",
      "Todo",
      "Done",
      ...currentSprintTasks.map((t) => t.status),
    ]),
  ).sort((a, b) => {
    const getRank = (name: string) => {
      const idx = defaultGroupOrder.findIndex(
        (g) => g.toLowerCase() === name.toLowerCase(),
      );
      return idx !== -1 ? idx : 5;
    };
    return getRank(a) - getRank(b);
  });

  const getStatusBadgeStyle = (name: string) => {
    const lower = name.toLowerCase();
    if (lower === "in progress") {
      return {
        badgeClass: "border-amber-500/40 bg-amber-500/10 text-amber-500",
        icon: <Square className="h-3.5 w-3.5" />,
      };
    }
    if (lower === "todo") {
      return {
        badgeClass: "border-border bg-muted text-muted-foreground",
        icon: <Circle className="h-3.5 w-3.5" />,
      };
    }
    if (lower === "move to qa" || lower === "qa") {
      return {
        badgeClass: "border-purple-500/40 bg-purple-500/10 text-purple-500",
        icon: <ShieldCheck className="h-3.5 w-3.5" />,
      };
    }
    if (lower === "done" || lower === "completed") {
      return {
        badgeClass: "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
        icon: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
      };
    }
    if (lower === "cancelled") {
      return {
        badgeClass: "border-rose-500/40 bg-rose-500/10 text-rose-500",
        icon: <XCircle className="h-3.5 w-3.5" />,
      };
    }
    return {
      badgeClass: "border-rose-500/40 bg-rose-500/10 text-rose-500",
      icon: <Circle className="h-3.5 w-3.5" />,
    };
  };

  // Current Sprint Panel Filter Tabs State
  const [filterTab, setFilterTab] = useState<
    "assignees" | "labels" | "priority" | "status"
  >("assignees");

  // Custom Labels State
  const [labels, setLabels] = useState([
    { id: "lbl-1", name: "Bug", color: "bg-rose-600" },
    { id: "lbl-2", name: "Feature", color: "bg-amber-500" },
    { id: "lbl-3", name: "Improvement", color: "bg-emerald-500" },
  ]);
  const [isCreateLabelOpen, setIsCreateLabelOpen] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");
  const [newLabelColor, setNewLabelColor] = useState("bg-indigo-500");

  // Custom Statuses State (Matching Screenshot 3)
  const [statuses, setStatuses] = useState([
    { id: "st-1", name: "Todo", type: "todo" },
    { id: "st-2", name: "Discussion", type: "discussion" },
    { id: "st-4", name: "Reopen", type: "reopen" },
    { id: "st-5", name: "In Progress", type: "in_progress" },
    { id: "st-9", name: "Move to QA", type: "qa" },
    { id: "st-6", name: "Done", type: "done" },
    { id: "st-7", name: "Completed", type: "completed" },
    { id: "st-8", name: "Cancelled", type: "cancelled" },
  ]);
  const [isCreateStatusOpen, setIsCreateStatusOpen] = useState(false);
  const [newStatusName, setNewStatusName] = useState("");

  // Backlog View State
  const [backlogSearchQuery, setBacklogSearchQuery] = useState("");
  const [backlogItems, setBacklogItems] = useState([
    {
      id: "bl-1",
      code: "ALE-30",
      title: "Implement OAuth2 Social Logins (Google & GitHub)",
      priority: "High",
      category: "Feature",
      assignee: "Pritam Shukla",
      status: "Backlog",
      createdDate: "Dec 15",
    },
    {
      id: "bl-2",
      code: "ALE-31",
      title: "Optimize SVG icon bundle size & dynamic imports",
      priority: "Medium",
      category: "Performance",
      assignee: "Gaurvi Sharmi",
      status: "Backlog",
      createdDate: "Dec 14",
    },
    {
      id: "bl-3",
      code: "ALE-32",
      title: "Dark mode contrast ratio audit for accessibility (WCAG 2.1)",
      priority: "Low",
      category: "Improvement",
      assignee: "Sahara Acharya",
      status: "Backlog",
      createdDate: "Dec 12",
    },
  ]);

  const handleCreateLabelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabelName.trim()) return;
    setLabels([
      ...labels,
      {
        id: `lbl-${Date.now()}`,
        name: newLabelName.trim(),
        color: newLabelColor,
      },
    ]);
    setIsCreateLabelOpen(false);
    setNewLabelName("");
  };

  const handleCreateStatusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStatusName.trim()) return;
    setStatuses([
      ...statuses,
      { id: `st-${Date.now()}`, name: newStatusName.trim(), type: "todo" },
    ]);
    setIsCreateStatusOpen(false);
    setNewStatusName("");
  };

  // Handler: Add Single Sprint (for subsequent additions when sprints > 0)
  const handleAddSingleSprint = (e: React.FormEvent) => {
    e.preventDefault();
    const nextNum = sprints.length + 1;
    const nameToUse = singleSprintName.trim() || `Sprint ${nextNum}`;

    const newSprint: SprintItem = {
      id: `sp-${Date.now()}`,
      name: nameToUse,
      dateNode: singleDateNode || "Jan 21",
      hoursAllocated: `${singleHours || "80"}h allocated`,
      status: singleStatus,
    };

    setSprints([...sprints, newSprint]);
    setIsAddSprintOpen(false);
    setSingleSprintName("");
  };

  // Modal State for Edit Sprint
  const [editingSprint, setEditingSprint] = useState<SprintItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editDateNode, setEditDateNode] = useState("");
  const [editHours, setEditHours] = useState("80");
  const [editStatus, setEditStatus] = useState<
    "Completed" | "Current" | "Planning"
  >("Current");

  // Drag and Drop State for Pipes Board Columns
  const [draggingTaskId, setDraggingTaskId] = useState<string | null>(null);
  const [dragOverStatusName, setDragOverStatusName] = useState<string | null>(
    null,
  );

  const handleDropTaskToStatus = (taskId: string, targetStatus: string) => {
    if (!taskId || !targetStatus) return;
    setCurrentSprintTasks((prev) =>
      prev.map((t) => {
        if (
          t.id === taskId &&
          t.status.toLowerCase() !== targetStatus.toLowerCase()
        ) {
          const oldStatus = t.status;
          logTaskChange(`changed status from ${oldStatus} to ${targetStatus}`);
          return { ...t, status: targetStatus };
        }
        return t;
      }),
    );
  };

  // Math Calculation: 1 Month = ~30 calendar days. 14 calendar days (including Saturday & Sunday) = 1 Sprint (80h)
  const durationMonthsNum = Math.max(1, parseInt(durationMonths, 10) || 1);
  const totalCalendarDays = durationMonthsNum * 30; // 3 months = 90 calendar days
  const calculatedSprintCount = Math.ceil(totalCalendarDays / 14); // 90 / 14 = 7 Sprints

  // Active Sprint & Date Range helper
  const activeSprint =
    sprints.find((s) => s.id === selectedSprintId) ||
    sprints.find((s) => s.status === "Current") ||
    sprints[0];

  const getSprintDateRange = (sprint?: SprintItem) => {
    if (!sprint || !sprint.dateNode) return "Oct 01 – Oct 14";

    const now = new Date();
    const year = now.getFullYear();
    const startDate = new Date(`${sprint.dateNode}, ${year}`);

    if (isNaN(startDate.getTime())) {
      return `${sprint.dateNode} – End Date`;
    }

    // 14 calendar days (sprint duration including Saturday & Sunday)
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 13);

    const startFormatted = startDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });
    const endFormatted = endDate.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    });

    return `${startFormatted} – ${endFormatted}`;
  };

  // Handler: Generate Sprints for Project based on Duration Math (Divided by 14 calendar days)
  const handleGenerateSprints = (e: React.FormEvent) => {
    e.preventDefault();

    const baseDate = new Date(startDateStr || "2026-10-01");
    const generated: SprintItem[] = [];

    for (let i = 1; i <= calculatedSprintCount; i++) {
      // Each sprint starts 14 calendar days apart (includes Saturday & Sunday)
      const sprintDate = new Date(baseDate);
      sprintDate.setDate(baseDate.getDate() + (i - 1) * 14);

      const formattedDate = sprintDate.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
      });

      generated.push({
        id: `sp-${Date.now()}-${i}`,
        name: `Sprint ${i}`,
        dateNode: formattedDate,
        hoursAllocated: "80h allocated", // 14 calendar days (10 working days x 8h/day = 80h)
        status: i === 1 ? "Current" : "Planning",
      });
    }

    setSprints(generated);
    setSelectedProject(modalProject);
    if (generated.length > 0) {
      setSelectedSprintId(generated[0].id);
    }
    setIsAddSprintOpen(false);
  };

  const handleEditStart = (sprint: SprintItem) => {
    setEditingSprint(sprint);
    setEditName(sprint.name);
    setEditDateNode(sprint.dateNode);
    setEditHours(sprint.hoursAllocated.replace("h allocated", ""));
    setEditStatus(sprint.status);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSprint) return;

    setSprints(
      sprints.map((s) =>
        s.id === editingSprint.id
          ? {
              ...s,
              name: editName,
              dateNode: editDateNode,
              hoursAllocated: `${editHours}h allocated`,
              status: editStatus,
            }
          : s,
      ),
    );
    setEditingSprint(null);
  };

  if (selectedTaskDetail) {
    return (
      <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col">
        {/* TOP BREADCRUMB & HEADER BAR */}
        <div className="border-border bg-card/95 sticky top-0 z-30 flex items-center justify-between border-b px-6 py-3 shadow-2xs backdrop-blur-md">
          {/* Left: Breadcrumb */}
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedTaskDetail(null)}
              className="hover:text-foreground flex cursor-pointer items-center gap-1.5"
            >
              <span className="bg-primary/20 text-primary flex h-5 w-5 items-center justify-center rounded-xs text-[10px] font-bold">
                A
              </span>
              <span>Sprints</span>
            </button>
            <span>&gt;</span>
            <button
              type="button"
              onClick={() => setSelectedTaskDetail(null)}
              className="hover:text-foreground cursor-pointer"
            >
              {activeSprint?.name || "Sprint 1"}
            </button>
            <span>&gt;</span>
            <span className="text-foreground font-mono font-bold">
              {selectedTaskDetail.code}
            </span>
          </div>

          {/* Right: Copy Prompt & Navigation */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (typeof navigator !== "undefined" && navigator.clipboard) {
                  navigator.clipboard.writeText(
                    `Task ${selectedTaskDetail.code}: ${selectedTaskDetail.title}`,
                  );
                }
              }}
              className="bg-background border-border text-foreground h-7 cursor-pointer gap-1.5 rounded-md text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" /> Copy as Prompt
            </Button>
            <div className="border-border bg-card flex items-center gap-2 rounded-md border px-2.5 py-1 font-mono text-xs">
              <span className="font-bold">
                {currentTaskIndex !== -1 ? currentTaskIndex + 1 : 1} /{" "}
                {totalTaskCount}
              </span>
              <div className="ml-1 flex flex-col gap-0.5">
                <button
                  type="button"
                  onClick={handlePrevTask}
                  disabled={currentTaskIndex <= 0}
                  className="hover:text-primary cursor-pointer text-[9px] leading-none disabled:opacity-30"
                  title="Previous Task"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={handleNextTask}
                  disabled={currentTaskIndex >= currentSprintTasks.length - 1}
                  className="hover:text-primary cursor-pointer text-[9px] leading-none disabled:opacity-30"
                  title="Next Task"
                >
                  ▼
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN BODY: 2 COLUMNS (LEFT MAIN CONTENT, RIGHT PROPERTIES PANEL) */}
        <div className="divide-border flex w-full flex-1 flex-col items-start divide-y lg:flex-row lg:divide-x lg:divide-y-0">
          {/* LEFT MAIN CONTENT */}
          <div className="relative flex h-[calc(100vh-53px)] w-full flex-1 flex-col overflow-hidden">
            {/* SCROLLABLE MAIN CONTENT AREA */}
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-8">
              {/* Task Title (Editable) */}
              <div>
                <input
                  type="text"
                  value={selectedTaskDetail.title}
                  onChange={(e) => {
                    setSelectedTaskDetail({
                      ...selectedTaskDetail,
                      title: e.target.value,
                    });
                  }}
                  className="text-foreground hover:border-border focus:border-primary w-full border-b border-transparent bg-transparent py-1 text-2xl font-bold outline-none"
                />
              </div>

              {/* Task Description & Attachments Box */}
              <div className="flex flex-col gap-4">
                <RichTextEditor
                  value={selectedTaskDetail.description ?? ""}
                  onChange={(content) => {
                    setSelectedTaskDetail({
                      ...selectedTaskDetail,
                      description: content,
                    });
                  }}
                  placeholder="Add description..."
                  minHeight="140px"
                />

                {/* Attached Media / Images Container matching user screenshot spec */}
                {selectedTaskDetail.attachments &&
                  selectedTaskDetail.attachments.length > 0 && (
                    <div className="mt-1 flex flex-col gap-3">
                      {selectedTaskDetail.attachments.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="border-border/80 group bg-card relative max-w-3xl overflow-hidden rounded-xl border shadow-xs"
                        >
                          {/* Top-Right Floating Action Overlay Pill matching user screenshot */}
                          <div className="bg-card/95 border-border/80 text-foreground absolute top-3 right-3 z-20 flex items-center gap-2.5 rounded-md border px-2.5 py-1 shadow-md backdrop-blur-md">
                            <button
                              type="button"
                              onClick={() => setLightboxImage(imgUrl)}
                              className="hover:text-primary text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors"
                              title="Preview image"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                            <span className="bg-border/80 h-3.5 w-[1px]" />
                            <a
                              href={imgUrl}
                              download="attachment"
                              target="_blank"
                              rel="noreferrer"
                              className="hover:text-primary text-muted-foreground hover:text-foreground cursor-pointer p-0.5 transition-colors"
                              title="Download image"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </a>
                          </div>

                          {/* Attached Image */}
                          <img
                            src={imgUrl}
                            alt="Task Attachment"
                            className="h-auto max-h-[500px] w-full cursor-pointer object-cover transition-opacity hover:opacity-95"
                            onClick={() => setLightboxImage(imgUrl)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                {/* Attach File / Image trigger button */}
                <div className="flex items-center gap-2 pt-1">
                  <label className="text-muted-foreground hover:text-foreground border-border bg-card hover:bg-secondary flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors">
                    <Paperclip className="h-3.5 w-3.5" />
                    <span>Attach image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const newUrl = event.target?.result as string;
                            if (newUrl) {
                              const updatedAttachments = [
                                ...(selectedTaskDetail.attachments || []),
                                newUrl,
                              ];
                              setSelectedTaskDetail({
                                ...selectedTaskDetail,
                                attachments: updatedAttachments,
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Conditional Update Button (Only visible when content has changed) */}
              {hasTaskChanged && (
                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      handleUpdateTaskInList(selectedTaskDetail);
                      setInitialTaskDetail({ ...selectedTaskDetail });
                    }}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground animate-in fade-in h-9 cursor-pointer rounded-lg px-6 text-xs font-bold shadow-sm"
                  >
                    Update
                  </Button>
                </div>
              )}
              {/* Comments Section on Left Panel (Next to task content) */}
              <TaskActivitySection
                activityLogs={taskActivityLogs}
                onAddLog={handleAddActivityLog}
                onUpdateLog={handleUpdateActivityLog}
                onDeleteLog={handleDeleteActivityLog}
                showLog={true}
                showInput={false}
                filterType="comments"
              />
            </div>

            {/* FIXED BOTTOM COMMENT INPUT BAR */}
            <div className="bg-background/95 border-border z-30 shrink-0 border-t p-4 px-8 shadow-lg backdrop-blur-md">
              <TaskActivitySection
                activityLogs={taskActivityLogs}
                onAddLog={handleAddActivityLog}
                onUpdateLog={handleUpdateActivityLog}
                onDeleteLog={handleDeleteActivityLog}
                showLog={false}
                showInput={true}
              />
            </div>
          </div>

          {/* RIGHT PROPERTIES PANEL */}
          <div className="bg-card/20 flex w-full shrink-0 flex-col gap-6 overflow-y-auto p-6 lg:sticky lg:top-[53px] lg:h-[calc(100vh-53px)] lg:w-[480px]">
            <div className="flex items-center justify-between">
              <h3 className="text-foreground text-sm font-bold">Properties</h3>
              <div className="text-muted-foreground flex items-center gap-2">
                <Link2 className="hover:text-foreground h-4 w-4 cursor-pointer" />
                <GitBranch className="hover:text-foreground h-4 w-4 cursor-pointer" />
              </div>
            </div>

            <div className="flex flex-col gap-5 text-xs">
              {/* Status Picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-semibold">
                  Status
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-card hover:bg-secondary/60 flex cursor-pointer items-center gap-2 rounded-xs border p-1.5 text-left outline-none"
                    >
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span className="text-foreground font-bold">
                        {selectedTaskDetail.status}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-48"
                  >
                    {statuses.map((st) => (
                      <DropdownMenuItem
                        key={st.id || st.name}
                        onClick={() => {
                          if (selectedTaskDetail.status !== st.name) {
                            const oldStatus = selectedTaskDetail.status;
                            const updated = {
                              ...selectedTaskDetail,
                              status: st.name,
                            };
                            setSelectedTaskDetail(updated);
                            handleUpdateTaskInList(updated);
                            logTaskChange(
                              `changed status from ${oldStatus} to ${st.name}`,
                            );
                          }
                        }}
                        className="cursor-pointer"
                      >
                        {st.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Priority Picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-semibold">
                  Priority
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-card hover:bg-secondary/60 text-foreground cursor-pointer rounded-xs border p-1.5 text-left font-semibold outline-none"
                    >
                      {selectedTaskDetail.priority || "No Priority"}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-48"
                  >
                    {["Urgent", "High", "Medium", "Low", "No Priority"].map(
                      (prio) => (
                        <DropdownMenuItem
                          key={prio}
                          onClick={() => {
                            if (selectedTaskDetail.priority !== prio) {
                              const updated = {
                                ...selectedTaskDetail,
                                priority: prio as SprintTaskItem["priority"],
                              };
                              setSelectedTaskDetail(updated);
                              handleUpdateTaskInList(updated);
                              logTaskChange(`changed priority to ${prio}`);
                            }
                          }}
                          className="cursor-pointer"
                        >
                          {prio}
                        </DropdownMenuItem>
                      ),
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Assignee Picker */}
              <div className="flex flex-col gap-1.5">
                <span className="text-muted-foreground font-semibold">
                  Assignee
                </span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className="border-border bg-card hover:bg-secondary/60 flex cursor-pointer items-center gap-2 rounded-xs border p-1.5 text-left outline-none"
                    >
                      <div
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                          selectedTaskDetail.assigneeColor,
                        )}
                      >
                        {selectedTaskDetail.assigneeInitials}
                      </div>
                      <span className="text-foreground truncate font-bold">
                        {selectedTaskDetail.assignee}
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-52"
                  >
                    {ASSIGNEES_LIST.map((person) => (
                      <DropdownMenuItem
                        key={person.name}
                        onClick={() => {
                          if (selectedTaskDetail.assignee !== person.name) {
                            const oldAssignee =
                              selectedTaskDetail.assignee || "Unassigned";
                            const updated = {
                              ...selectedTaskDetail,
                              assignee: person.name,
                              assigneeInitials: person.initials,
                              assigneeColor: person.color,
                            };
                            setSelectedTaskDetail(updated);
                            handleUpdateTaskInList(updated);
                            logTaskChange(
                              `reassigned task from ${oldAssignee} to ${person.name}`,
                            );
                          }
                        }}
                        className="cursor-pointer gap-2"
                      >
                        <div
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold",
                            person.color,
                          )}
                        >
                          {person.initials}
                        </div>
                        <span className="truncate">{person.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Estimated Effort */}
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground font-semibold">
                  Estimated Effort
                </span>
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>4h</span>
                  <Info className="text-muted-foreground ml-0.5 h-3 w-3 cursor-pointer" />
                </div>
              </div>

              {/* Actual Effort */}
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground font-semibold">
                  Actual Effort
                </span>
                <div className="flex items-center gap-1.5 font-bold text-amber-500">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>4h</span>
                  <Info className="text-muted-foreground ml-0.5 h-3 w-3 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Activity Log Feed ONLY (System events under Properties) */}
            <TaskActivitySection
              activityLogs={taskActivityLogs}
              onAddLog={handleAddActivityLog}
              onUpdateLog={handleUpdateActivityLog}
              onDeleteLog={handleDeleteActivityLog}
              showLog={true}
              showInput={false}
              filterType="activity"
            />
          </div>
        </div>

        {/* IMAGE LIGHTBOX PREVIEW MODAL FOR TASK DETAIL */}
        {lightboxImage && (
          <Dialog
            open={Boolean(lightboxImage)}
            onOpenChange={() => setLightboxImage(null)}
          >
            <DialogContent className="bg-card/95 border-border z-[9999] flex flex-col items-center gap-4 overflow-hidden rounded-xl p-5 shadow-2xl backdrop-blur-xl sm:max-w-5xl [&>button]:hidden">
              <div className="border-border/60 flex w-full items-center justify-between border-b pb-3">
                <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                  <Eye className="text-primary h-4 w-4" />
                  <span>Image Attachment Preview</span>
                </div>
                <div className="flex items-center gap-3">
                  <a
                    href={lightboxImage}
                    download="attachment"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary bg-primary/10 border-primary/30 flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-bold hover:underline"
                  >
                    <Download className="h-4 w-4" /> Download
                  </a>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(null)}
                    className="hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1.5 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-background/50 flex max-h-[80vh] w-full items-center justify-center overflow-auto rounded-lg p-2">
                <img
                  src={lightboxImage}
                  alt="Attachment Preview"
                  className="max-h-[75vh] max-w-full rounded-md object-contain shadow-lg"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div className="bg-background flex h-screen max-h-screen min-w-0 flex-1 flex-col overflow-hidden">
      {/* FIXED TOP HEADER SECTION (shrink-0) */}
      <div
        className={cn(
          "bg-background border-border z-10 box-border shrink-0 space-y-3 overflow-hidden border-b p-4 pb-3 shadow-xs transition-all duration-200 ease-linear",
          contentWidthClass,
        )}
      >
        {/* TOP HEADER BAR: PROJECT SELECTOR & ACTION BUTTONS */}
        <div className="flex items-center justify-between gap-4">
          {/* Project Selector Dropdown */}
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="bg-card border-border text-foreground focus:border-primary cursor-pointer border px-3 py-1.5 text-xs font-bold shadow-xs outline-none"
          >
            <option value="Cloud...">Cloud...</option>
            <option value="Appofy Web">Appofy Web</option>
            <option value="WorkSync HR">WorkSync HR</option>
            <option value="Design System">Design System</option>
          </select>

          {/* Header Action Buttons */}
          <div className="flex items-center gap-2">
            {activeTab === "current" && (
              <Button
                onClick={() => {
                  setTaskStatus("In Progress");
                  setIsAddTaskOpen(true);
                }}
                className="cursor-pointer gap-1.5 rounded-none bg-emerald-600 text-xs font-semibold text-white shadow-none hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4" /> Add Task
              </Button>
            )}

            {sprints.length > 0 && (
              <Button
                onClick={() => setIsAddSprintOpen(true)}
                className="bg-primary text-primary-foreground cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
              >
                <Plus className="h-4 w-4" /> Add Sprint
              </Button>
            )}
          </div>
        </div>

        {/* SUBHEADER NAVIGATION TABS BAR WITH ACTIVE FILTERS & VIEW MODE SWITCHER */}
        <div className="border-border bg-card flex items-center justify-between gap-3 overflow-x-auto border p-1 shadow-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab("sprints")}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-bold transition-colors",
                activeTab === "sprints"
                  ? "bg-background text-foreground border-border shadow-2xs"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Zap className="h-3.5 w-3.5" />
              <span>Sprints</span>
            </button>

            <button
              onClick={() => setActiveTab("backlog")}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "backlog"
                  ? "bg-background text-foreground border-border font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>Backlog</span>
            </button>

            <button
              onClick={() => setActiveTab("current")}
              className={cn(
                "flex cursor-pointer items-center gap-1.5 rounded-none border px-3 py-1.5 text-xs font-semibold transition-colors",
                activeTab === "current"
                  ? "bg-background text-foreground border-border font-bold shadow-2xs"
                  : "text-muted-foreground hover:text-foreground border-transparent",
              )}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Current</span>
            </button>

            {/* INDIVIDUAL FILTER DROPDOWNS (NAME/ASSIGNEE, STATUS, LABEL, PRIORITY) */}
            {activeTab === "current" && (
              <div className="border-border ml-1 flex items-center gap-1.5 border-l pl-2.5">
                {/* 1. ASSIGNEE / NAME FILTER */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                        selectedAssigneeFilter
                          ? "border-sky-500/40 bg-sky-500/15 font-bold text-sky-400"
                          : "text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <User className="h-3.5 w-3.5" />
                      <span>{selectedAssigneeFilter || "Assignee"}</span>
                      <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-56 p-1.5 shadow-xl"
                  >
                    <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase">
                      <span>Filter by Assignee</span>
                      {selectedAssigneeFilter && (
                        <button
                          type="button"
                          onClick={() => setSelectedAssigneeFilter(null)}
                          className="text-primary cursor-pointer text-[10px] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto py-1">
                      {ASSIGNEES_LIST.map((person) => {
                        const isSelected =
                          selectedAssigneeFilter?.toLowerCase() ===
                          person.name.toLowerCase();
                        return (
                          <DropdownMenuItem
                            key={person.name}
                            onClick={() =>
                              setSelectedAssigneeFilter(
                                isSelected ? null : person.name,
                              )
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs",
                              isSelected
                                ? "bg-primary/15 text-primary font-bold"
                                : "hover:bg-secondary/60 text-foreground",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <div
                                className={cn(
                                  "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold",
                                  person.color,
                                )}
                              >
                                {person.initials}
                              </div>
                              <span className="truncate">{person.name}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 2. STATUS FILTER */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                        selectedStatusFilter
                          ? "border-emerald-500/40 bg-emerald-500/15 font-bold text-emerald-400"
                          : "text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <Circle className="h-3.5 w-3.5" />
                      <span>{selectedStatusFilter || "Status"}</span>
                      <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-56 p-1.5 shadow-xl"
                  >
                    <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase">
                      <span>Filter by Status</span>
                      {selectedStatusFilter && (
                        <button
                          type="button"
                          onClick={() => setSelectedStatusFilter(null)}
                          className="text-primary cursor-pointer text-[10px] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto py-1">
                      {statuses.map((st) => {
                        const isSelected =
                          selectedStatusFilter?.toLowerCase() ===
                          st.name.toLowerCase();
                        const { icon, badgeClass } = getStatusBadgeStyle(
                          st.name,
                        );
                        return (
                          <DropdownMenuItem
                            key={st.id || st.name}
                            onClick={() =>
                              setSelectedStatusFilter(
                                isSelected ? null : st.name,
                              )
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs",
                              isSelected
                                ? "bg-primary/15 text-primary font-bold"
                                : "hover:bg-secondary/60 text-foreground",
                            )}
                          >
                            <div className="flex min-w-0 items-center gap-2">
                              <div
                                className={cn(
                                  "shrink-0 rounded-full border p-0.5",
                                  badgeClass,
                                )}
                              >
                                {icon}
                              </div>
                              <span className="truncate">{st.name}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 3. LABEL FILTER */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                        selectedLabelFilter
                          ? "border-indigo-500/40 bg-indigo-500/15 font-bold text-indigo-400"
                          : "text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <Tag className="h-3.5 w-3.5" />
                      <span>{selectedLabelFilter || "Label"}</span>
                      <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-56 p-1.5 shadow-xl"
                  >
                    <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase">
                      <span>Filter by Label</span>
                      {selectedLabelFilter && (
                        <button
                          type="button"
                          onClick={() => setSelectedLabelFilter(null)}
                          className="text-primary cursor-pointer text-[10px] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto py-1">
                      {labels.map((lbl) => {
                        const isSelected =
                          selectedLabelFilter?.toLowerCase() ===
                          lbl.name.toLowerCase();
                        return (
                          <DropdownMenuItem
                            key={lbl.id}
                            onClick={() =>
                              setSelectedLabelFilter(
                                isSelected ? null : lbl.name,
                              )
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs",
                              isSelected
                                ? "bg-primary/15 text-primary font-bold"
                                : "hover:bg-secondary/60 text-foreground",
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  lbl.color,
                                )}
                              />
                              <span>{lbl.name}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* 4. PRIORITY FILTER */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex cursor-pointer items-center gap-1.5 rounded-none border px-2.5 py-1.5 text-xs font-semibold transition-colors outline-none",
                        selectedPriorityFilter
                          ? "border-amber-500/40 bg-amber-500/15 font-bold text-amber-400"
                          : "text-muted-foreground border-border hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      <span>{selectedPriorityFilter || "Priority"}</span>
                      <ChevronDown className="ml-0.5 h-3 w-3 opacity-60" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="bg-card border-border z-50 w-56 p-1.5 shadow-xl"
                  >
                    <DropdownMenuLabel className="text-muted-foreground flex items-center justify-between px-2 py-1 text-[11px] font-bold uppercase">
                      <span>Filter by Priority</span>
                      {selectedPriorityFilter && (
                        <button
                          type="button"
                          onClick={() => setSelectedPriorityFilter(null)}
                          className="text-primary cursor-pointer text-[10px] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-border" />
                    <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto py-1">
                      {["Urgent", "High", "Medium", "Low"].map((prio) => {
                        const isSelected =
                          selectedPriorityFilter?.toLowerCase() ===
                          prio.toLowerCase();
                        return (
                          <DropdownMenuItem
                            key={prio}
                            onClick={() =>
                              setSelectedPriorityFilter(
                                isSelected ? null : prio,
                              )
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs",
                              isSelected
                                ? "bg-primary/15 text-primary font-bold"
                                : "hover:bg-secondary/60 text-foreground",
                            )}
                          >
                            <span>{prio}</span>
                            {isSelected && (
                              <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                            )}
                          </DropdownMenuItem>
                        );
                      })}
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

            {/* ACTIVE FILTERS SUMMARY BADGES */}
            {activeTab === "current" && isAnyBoardFilterActive && (
              <div className="border-border ml-1 flex flex-wrap items-center gap-1.5 border-l pl-3">
                <span className="text-muted-foreground flex shrink-0 items-center gap-1 text-[11px] font-bold">
                  Active:
                </span>

                {boardSearchQuery && (
                  <Badge className="bg-primary/15 text-primary border-primary/30 gap-1 rounded-none px-1.5 py-0.5 font-mono text-[11px]">
                    Search: &quot;{boardSearchQuery}&quot;
                    <button
                      onClick={() => setBoardSearchQuery("")}
                      className="hover:text-foreground ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {selectedAssigneeFilter && (
                  <Badge className="gap-1 rounded-none border-sky-500/30 bg-sky-500/15 px-1.5 py-0.5 text-[11px] text-sky-400">
                    Assignee: {selectedAssigneeFilter}
                    <button
                      onClick={() => setSelectedAssigneeFilter(null)}
                      className="hover:text-foreground ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {selectedPriorityFilter && (
                  <Badge className="gap-1 rounded-none border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[11px] text-amber-400">
                    Priority: {selectedPriorityFilter}
                    <button
                      onClick={() => setSelectedPriorityFilter(null)}
                      className="hover:text-foreground ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {selectedStatusFilter && (
                  <Badge className="gap-1 rounded-none border-emerald-500/30 bg-emerald-500/15 px-1.5 py-0.5 text-[11px] text-emerald-400">
                    Status: {selectedStatusFilter}
                    <button
                      onClick={() => setSelectedStatusFilter(null)}
                      className="hover:text-foreground ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                {selectedLabelFilter && (
                  <Badge className="gap-1 rounded-none border-indigo-500/30 bg-indigo-500/15 px-1.5 py-0.5 text-[11px] text-indigo-400">
                    Label: {selectedLabelFilter}
                    <button
                      onClick={() => setSelectedLabelFilter(null)}
                      className="hover:text-foreground ml-0.5 cursor-pointer font-bold"
                    >
                      ×
                    </button>
                  </Badge>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearBoardFilters}
                  className="text-muted-foreground hover:text-foreground h-5 cursor-pointer rounded-none px-1.5 text-[10px] font-bold"
                >
                  Reset All
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SCROLLABLE MAIN CONTENT AREA (flex-1 min-h-0 overflow-x-auto overflow-y-auto) */}
      <div
        className={cn(
          "custom-scrollbar box-border min-h-0 flex-1 overflow-x-auto overflow-y-auto p-4 pt-4 transition-all duration-200 ease-linear",
          contentWidthClass,
        )}
      >
        {/* MAIN VIEW AREA: SPRINT TIMELINE OR CURRENT SPRINT BOARD VIEW */}
        {activeTab === "current" ? (
          viewMode === "pipes" ? (
            /* CURRENT SPRINT PIPES BOARD VIEW (MATCHING USER REFERENCE SCREENSHOT SPEC) */
            <div className="flex h-full min-w-max flex-row items-start gap-4 pb-4">
              {filteredSprintTasks.length === 0 ? (
                <div className="border-border bg-card flex w-full flex-col items-center justify-center border border-dashed p-12 text-center shadow-xs">
                  <div className="border-border/80 bg-background/80 text-muted-foreground/60 mb-3 rounded-full border p-3">
                    <User className="text-muted-foreground h-6 w-6" />
                  </div>
                  <h3 className="text-foreground text-sm font-bold">
                    {selectedAssigneeFilter
                      ? `No tasks assigned to ${selectedAssigneeFilter}`
                      : "No tasks found matching active filters"}
                  </h3>
                  <p className="text-muted-foreground mt-1 max-w-md text-xs">
                    {selectedAssigneeFilter
                      ? `There are currently no tasks in this sprint assigned to ${selectedAssigneeFilter}.`
                      : "Try clearing some filters or searching for a different keyword."}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearBoardFilters}
                    className="mt-4 cursor-pointer rounded-none text-xs font-bold"
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                activeBoardStatusNames.map((statusName, idx) => {
                  const tasksInGroup = filteredSprintTasks.filter(
                    (t) => t.status.toLowerCase() === statusName.toLowerCase(),
                  );

                  if (isAnyBoardFilterActive && tasksInGroup.length === 0) {
                    return null;
                  }

                  const columnBgStyles = [
                    "bg-slate-500/10 border-slate-500/20 shadow-xs", // In Progress (Slate)
                    "bg-sky-500/10 border-sky-500/20 shadow-xs", // Todo (Blue/Sky)
                    "bg-amber-500/10 border-amber-500/20 shadow-xs", // Move to QA (Amber)
                    "bg-orange-500/10 border-orange-500/20 shadow-xs", // Discussion (Orange)
                    "bg-purple-500/10 border-purple-500/20 shadow-xs", // Reopen (Purple)
                    "bg-emerald-500/10 border-emerald-500/20 shadow-xs", // Done (Emerald)
                  ];

                  const colBgClass =
                    columnBgStyles[idx % columnBgStyles.length];
                  const isDragOverThisCol =
                    dragOverStatusName?.toLowerCase() ===
                    statusName.toLowerCase();

                  return (
                    <div
                      key={statusName}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        if (dragOverStatusName !== statusName) {
                          setDragOverStatusName(statusName);
                        }
                      }}
                      onDragLeave={(e) => {
                        if (
                          !e.currentTarget.contains(e.relatedTarget as Node)
                        ) {
                          setDragOverStatusName(null);
                        }
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        const taskId =
                          e.dataTransfer.getData("taskId") || draggingTaskId;
                        if (taskId) {
                          handleDropTaskToStatus(taskId, statusName);
                        }
                        setDragOverStatusName(null);
                        setDraggingTaskId(null);
                      }}
                      className={cn(
                        "flex h-full max-h-full w-72 max-w-[300px] min-w-[270px] shrink-0 flex-col gap-3 rounded-2xl border p-3 shadow-xs transition-all",
                        colBgClass,
                        isDragOverThisCol &&
                          "ring-primary border-primary bg-primary/10 scale-[1.01] shadow-lg ring-2",
                      )}
                    >
                      {/* Pipe Column Header */}
                      <div className="border-border/60 flex items-center justify-between border-b px-1 pb-1">
                        <span className="text-foreground text-xs font-bold tracking-wide">
                          {statusName}
                        </span>
                        <span className="text-muted-foreground bg-secondary/80 text-secondary-foreground border-border rounded-full border px-2 py-0.5 font-mono text-[11px] font-semibold">
                          {tasksInGroup.length}
                        </span>
                      </div>

                      {/* Pipe Column Scrollable Cards Area */}
                      <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pr-1">
                        {tasksInGroup.length === 0 ? (
                          <div className="border-border/80 text-muted-foreground flex items-center justify-center rounded-xl border border-dashed p-4 text-xs italic">
                            {isDragOverThisCol
                              ? "Drop task here"
                              : "No tasks in pipe"}
                          </div>
                        ) : (
                          tasksInGroup.map((task) => {
                            const isBeingDragged = draggingTaskId === task.id;
                            return (
                              <div
                                key={task.id}
                                draggable={true}
                                onDragStart={(e) => {
                                  e.dataTransfer.setData("taskId", task.id);
                                  e.dataTransfer.effectAllowed = "move";
                                  setDraggingTaskId(task.id);
                                }}
                                onDragEnd={() => {
                                  setDraggingTaskId(null);
                                  setDragOverStatusName(null);
                                }}
                                onClick={() => openTaskDetail(task)}
                                className={cn(
                                  "bg-card hover:bg-secondary/70 border-border/80 hover:border-primary/50 group flex cursor-grab flex-col gap-2.5 rounded-xl border p-3 shadow-2xs transition-all select-none active:cursor-grabbing",
                                  isBeingDragged &&
                                    "border-primary scale-95 border-dashed opacity-35 shadow-none",
                                )}
                              >
                                {/* Card Title */}
                                <span className="text-foreground group-hover:text-primary text-xs leading-snug font-bold transition-colors">
                                  {task.title}
                                </span>

                                {/* Card Metadata Footer */}
                                <div className="flex items-center justify-between gap-2 pt-0.5">
                                  <div className="flex min-w-0 items-center gap-1.5">
                                    {task.priority === "Urgent" ||
                                    task.priority === "High" ? (
                                      <span className="h-2 w-2 shrink-0 rounded-full bg-rose-500 shadow-xs shadow-rose-500/50" />
                                    ) : task.status.toLowerCase() === "done" ||
                                      task.status.toLowerCase() ===
                                        "completed" ? (
                                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                    ) : (
                                      <span className="h-2 w-2 shrink-0 rounded-full bg-amber-400 shadow-xs shadow-amber-400/50" />
                                    )}
                                    <span className="text-muted-foreground font-mono text-[11px] font-bold">
                                      {task.code}
                                    </span>
                                  </div>

                                  <div className="bg-secondary text-secondary-foreground border-border/70 flex shrink-0 items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold">
                                    <span>{task.assigneeInitials}</span>
                                    {task.points && <span>{task.points}</span>}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      {/* Pipe Column Bottom Action Button: + Add task */}
                      <button
                        type="button"
                        onClick={() => {
                          setTaskStatus(statusName);
                          setIsAddTaskOpen(true);
                        }}
                        className="text-muted-foreground hover:text-foreground hover:bg-secondary/60 hover:border-border flex w-full shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-transparent py-2 text-xs font-semibold transition-colors"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Add task</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          ) : (
            /* CURRENT SPRINT LIST VIEW (IMAGE 1 SPEC) */
            <div className="flex flex-1 flex-col items-start gap-6 md:flex-row">
              {/* LEFT MAIN PANEL: TASK GROUPS (IN PROGRESS TOP, TO DO NEXT, DONE/COMPLETED/CANCELLED BOTTOM) */}
              <div className="flex w-full flex-1 flex-col gap-6">
                {filteredSprintTasks.length === 0 ? (
                  <div className="border-border bg-card flex flex-col items-center justify-center border border-dashed p-12 text-center shadow-xs">
                    <div className="border-border/80 bg-background/80 text-muted-foreground/60 mb-3 rounded-full border p-3">
                      <User className="text-muted-foreground h-6 w-6" />
                    </div>
                    <h3 className="text-foreground text-sm font-bold">
                      {selectedAssigneeFilter
                        ? `No tasks assigned to ${selectedAssigneeFilter}`
                        : "No tasks found matching active filters"}
                    </h3>
                    <p className="text-muted-foreground mt-1 max-w-md text-xs">
                      {selectedAssigneeFilter
                        ? `There are currently no tasks in this sprint assigned to ${selectedAssigneeFilter}.`
                        : "Try clearing some filters or searching for a different keyword."}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleClearBoardFilters}
                      className="mt-4 cursor-pointer rounded-none text-xs font-bold"
                    >
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  activeBoardStatusNames.map((statusName) => {
                    const tasksInGroup = filteredSprintTasks.filter(
                      (t) =>
                        t.status.toLowerCase() === statusName.toLowerCase(),
                    );

                    // If any filter is active, skip status cards with 0 tasks
                    if (isAnyBoardFilterActive && tasksInGroup.length === 0) {
                      return null;
                    }

                    const { badgeClass, icon } =
                      getStatusBadgeStyle(statusName);

                    return (
                      <div
                        key={statusName}
                        className="border-border bg-card flex flex-col gap-3 border p-4 shadow-xs"
                      >
                        <div className="border-border flex items-center justify-between border-b pb-2.5">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "rounded-full border p-1",
                                badgeClass,
                              )}
                            >
                              {icon}
                            </div>
                            <span className="text-foreground text-sm font-bold">
                              {statusName}
                            </span>
                            <span className="text-muted-foreground flex items-center gap-1 font-mono text-xs">
                              <AlertCircle className="h-3 w-3 text-amber-500" />{" "}
                              {tasksInGroup.length}
                            </span>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setTaskStatus(statusName);
                              setIsAddTaskOpen(true);
                            }}
                            className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer rounded-none"
                            title={`Add task to ${statusName}`}
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        {/* Task Rows */}
                        <div className="flex flex-col gap-2">
                          {tasksInGroup.length === 0 ? (
                            <div className="border-border/60 bg-background/50 text-muted-foreground flex items-center justify-between border border-dashed p-3 text-xs">
                              <span>No tasks in {statusName}</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setTaskStatus(statusName);
                                  setIsAddTaskOpen(true);
                                }}
                                className="text-primary hover:text-primary h-6 cursor-pointer gap-1 rounded-none text-[11px] font-semibold"
                              >
                                <Plus className="h-3 w-3" /> Add Task
                              </Button>
                            </div>
                          ) : (
                            tasksInGroup.map((task) => (
                              <div
                                key={task.id}
                                className="bg-background border-border hover:border-primary/40 flex items-center justify-between gap-4 border p-2.5 text-xs transition-colors"
                              >
                                <div className="flex min-w-0 flex-1 items-center gap-2.5">
                                  <div className="flex w-4 shrink-0 justify-center">
                                    {task.priority === "Urgent" ? (
                                      <div className="flex h-3.5 w-3.5 items-center justify-center rounded-xs bg-amber-500 text-[9px] font-bold text-white">
                                        !
                                      </div>
                                    ) : (
                                      <MoreHorizontal className="text-muted-foreground h-3.5 w-3.5" />
                                    )}
                                  </div>
                                  <span
                                    onClick={() => openTaskDetail(task)}
                                    className="text-muted-foreground hover:text-primary w-14 shrink-0 cursor-pointer font-mono text-[11px] transition-colors"
                                    title="Click to view task details"
                                  >
                                    {task.code}
                                  </span>

                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <button
                                        type="button"
                                        className="hover:bg-secondary/80 flex shrink-0 cursor-pointer items-center justify-center rounded-xs p-0.5 transition-colors outline-none"
                                        title={`Click to change status (Currently: ${task.status})`}
                                      >
                                        {task.status.toLowerCase() === "done" ||
                                        task.status.toLowerCase() ===
                                          "completed" ? (
                                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                        ) : task.status.toLowerCase() ===
                                            "move to qa" ||
                                          task.status.toLowerCase() === "qa" ? (
                                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                                        ) : task.status.toLowerCase() ===
                                          "in progress" ? (
                                          <Square className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                                        ) : (
                                          <Circle className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                                        )}
                                      </button>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                      align="start"
                                      className="bg-card border-border z-50 w-48 p-1 shadow-xl"
                                    >
                                      <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-bold uppercase">
                                        Change Task Status
                                      </DropdownMenuLabel>
                                      <DropdownMenuSeparator className="bg-border" />
                                      <div className="flex max-h-60 flex-col gap-0.5 overflow-y-auto">
                                        {statuses.map((st) => {
                                          const isCurrent =
                                            task.status.toLowerCase() ===
                                            st.name.toLowerCase();
                                          const { icon, badgeClass } =
                                            getStatusBadgeStyle(st.name);

                                          return (
                                            <DropdownMenuItem
                                              key={st.id || st.name}
                                              onClick={() =>
                                                handleUpdateTaskStatus(
                                                  task.id,
                                                  st.name,
                                                )
                                              }
                                              className={cn(
                                                "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs font-semibold transition-colors",
                                                isCurrent
                                                  ? "bg-primary/15 text-primary font-bold"
                                                  : "hover:bg-secondary/60 text-foreground",
                                              )}
                                            >
                                              <div className="flex min-w-0 items-center gap-2">
                                                <div
                                                  className={cn(
                                                    "shrink-0 rounded-full border p-0.5",
                                                    badgeClass,
                                                  )}
                                                >
                                                  {icon}
                                                </div>
                                                <span className="truncate">
                                                  {st.name}
                                                </span>
                                              </div>
                                              {isCurrent && (
                                                <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                                              )}
                                            </DropdownMenuItem>
                                          );
                                        })}
                                      </div>
                                    </DropdownMenuContent>
                                  </DropdownMenu>

                                  <span
                                    onClick={() => openTaskDetail(task)}
                                    className="text-foreground hover:text-primary flex-1 cursor-pointer truncate font-bold transition-colors"
                                    title="Click to view task details"
                                  >
                                    {task.title}
                                  </span>
                                </div>

                                <div className="flex shrink-0 items-center gap-3">
                                  <div className="flex w-20 justify-end">
                                    <span className="flex shrink-0 items-center gap-1 border border-rose-500/40 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-500">
                                      <Calendar className="h-2.5 w-2.5" />{" "}
                                      {task.dueDate}
                                    </span>
                                  </div>
                                  <div className="text-muted-foreground w-14 text-right font-mono text-[10px]">
                                    {task.createdDate}
                                  </div>
                                  <div className="flex w-6 justify-center">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <button
                                          type="button"
                                          className={cn(
                                            "hover:ring-primary/60 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border text-[9px] font-bold transition-all outline-none hover:ring-2",
                                            task.assigneeColor,
                                          )}
                                          title={`Click to reassign ${task.title} (Currently: ${task.assignee})`}
                                        >
                                          {task.assigneeInitials}
                                        </button>
                                      </DropdownMenuTrigger>

                                      <DropdownMenuContent
                                        align="end"
                                        className="bg-card border-border z-50 w-52 p-1 shadow-xl"
                                      >
                                        <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-bold uppercase">
                                          Reassign Task To
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-border" />
                                        <div className="flex max-h-56 flex-col gap-0.5 overflow-y-auto">
                                          {ASSIGNEES_LIST.map((person) => {
                                            const isCurrent =
                                              task.assignee.toLowerCase() ===
                                              person.name.toLowerCase();
                                            return (
                                              <DropdownMenuItem
                                                key={person.name}
                                                onClick={() =>
                                                  handleReassignTask(
                                                    task.id,
                                                    person,
                                                  )
                                                }
                                                className={cn(
                                                  "flex cursor-pointer items-center justify-between rounded-xs px-2 py-1.5 text-xs font-semibold transition-colors",
                                                  isCurrent
                                                    ? "bg-primary/15 text-primary font-bold"
                                                    : "hover:bg-secondary/60 text-foreground",
                                                )}
                                              >
                                                <div className="flex min-w-0 items-center gap-2">
                                                  <div
                                                    className={cn(
                                                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                                                      person.color,
                                                    )}
                                                  >
                                                    {person.initials}
                                                  </div>
                                                  <span className="truncate">
                                                    {person.name}
                                                  </span>
                                                </div>
                                                {isCurrent && (
                                                  <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                                                )}
                                              </DropdownMenuItem>
                                            );
                                          })}
                                        </div>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* RIGHT SIDE PANEL: SPRINT SUMMARY & ASSIGNEES FILTERS */}
              <div className="border-border flex w-full flex-col gap-4 border-t pt-4 md:w-72 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                {/* Top Badge & Date */}
                <div className="flex items-center justify-between text-xs">
                  <Badge className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-[10px] font-semibold text-emerald-500 uppercase">
                    Current
                  </Badge>
                  <span className="text-muted-foreground font-mono text-[11px]">
                    {getSprintDateRange(activeSprint)}
                  </span>
                </div>
                {/* Search Input */}
                <div className="relative">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                  <Input
                    type="text"
                    placeholder="Search Sprint..."
                    value={boardSearchQuery}
                    onChange={(e) => setBoardSearchQuery(e.target.value)}
                    className="bg-card border-border h-8 rounded-none pr-7 pl-8 text-xs font-bold"
                  />
                  {boardSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setBoardSearchQuery("")}
                      className="text-muted-foreground hover:text-foreground absolute top-2 right-2.5 cursor-pointer text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Title */}
                <div className="border-border border-b pb-2 text-xs">
                  <h2 className="text-foreground text-base font-bold">
                    {activeSprint?.name || "Sprint 1"}
                  </h2>
                </div>

                {/* Filter Sub-Tabs Navigation (Spec Matching Screenshots 1, 2, 3) */}
                <div className="bg-secondary/40 border-border/60 grid grid-cols-4 gap-1 border p-1 text-[11px] font-semibold">
                  <button
                    type="button"
                    onClick={() => setFilterTab("assignees")}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xs px-1 py-1 text-[11px] transition-all",
                      filterTab === "assignees"
                        ? "bg-card text-foreground border-border border font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground border border-transparent",
                    )}
                  >
                    <span className="truncate">Assignees</span>
                    {selectedAssigneeFilter && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterTab("labels")}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xs px-1 py-1 text-[11px] transition-all",
                      filterTab === "labels"
                        ? "bg-card text-foreground border-border border font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground border border-transparent",
                    )}
                  >
                    <span className="truncate">Labels</span>
                    {selectedLabelFilter && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterTab("priority")}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xs px-1 py-1 text-[11px] transition-all",
                      filterTab === "priority"
                        ? "bg-card text-foreground border-border border font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground border border-transparent",
                    )}
                  >
                    <span className="truncate">Priority</span>
                    {selectedPriorityFilter && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setFilterTab("status")}
                    className={cn(
                      "flex min-w-0 cursor-pointer items-center justify-center gap-1 rounded-xs px-1 py-1 text-[11px] transition-all",
                      filterTab === "status"
                        ? "bg-card text-foreground border-border border font-bold shadow-2xs"
                        : "text-muted-foreground hover:text-foreground border border-transparent",
                    )}
                  >
                    <span className="truncate">Status</span>
                    {selectedStatusFilter && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                    )}
                  </button>
                </div>

                {/* SUB-TAB CONTENT 1: ASSIGNEES */}
                {filterTab === "assignees" && (
                  <div className="flex flex-col gap-1 py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedAssigneeFilter(null)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                        !selectedAssigneeFilter
                          ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <span>All Assignees</span>
                      {!selectedAssigneeFilter && (
                        <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>

                    {[
                      {
                        name: "Pritam Shukla",
                        avatar: "P",
                        color: "bg-sky-500/20 text-sky-400 border-sky-500/40",
                      },
                      {
                        name: "Priya Verma",
                        avatar: "P",
                        color:
                          "bg-indigo-500/20 text-indigo-400 border-indigo-500/40",
                      },
                      {
                        name: "Sahara Acharya",
                        avatar: "SA",
                        color:
                          "bg-rose-500/20 text-rose-400 border-rose-500/40",
                      },
                      {
                        name: "Gaurvi Sharmi",
                        avatar: "G",
                        color:
                          "bg-emerald-500/20 text-emerald-400 border-emerald-500/40",
                      },
                      {
                        name: "Elena Vance",
                        avatar: "EV",
                        color:
                          "bg-amber-500/20 text-amber-400 border-amber-500/40",
                      },
                      {
                        name: "Julian Thorne",
                        avatar: "JT",
                        color:
                          "bg-purple-500/20 text-purple-400 border-purple-500/40",
                      },
                      {
                        name: "Sarah Chen",
                        avatar: "SC",
                        color:
                          "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
                      },
                      {
                        name: "Wei Lin",
                        avatar: "WL",
                        color:
                          "bg-teal-500/20 text-teal-400 border-teal-500/40",
                      },
                      {
                        name: "Marcus Okafor",
                        avatar: "MO",
                        color:
                          "bg-blue-500/20 text-blue-400 border-blue-500/40",
                      },
                    ].map((item) => {
                      const isSelected =
                        selectedAssigneeFilter?.toLowerCase() ===
                        item.name.toLowerCase();
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() =>
                            setSelectedAssigneeFilter(
                              isSelected ? null : item.name,
                            )
                          }
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                            isSelected
                              ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                              : "text-foreground hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <div
                              className={cn(
                                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                                item.color,
                              )}
                            >
                              {item.avatar}
                            </div>
                            <span className="truncate">{item.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* SUB-TAB CONTENT 2: LABELS (MATCHING USER SCREENSHOT 1) */}
                {filterTab === "labels" && (
                  <div className="flex flex-col gap-1 py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedLabelFilter(null)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                        !selectedLabelFilter
                          ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <span>All Labels</span>
                      {!selectedLabelFilter && (
                        <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>

                    {labels.map((lbl) => {
                      const isSelected =
                        selectedLabelFilter?.toLowerCase() ===
                        lbl.name.toLowerCase();
                      return (
                        <button
                          key={lbl.id}
                          type="button"
                          onClick={() =>
                            setSelectedLabelFilter(isSelected ? null : lbl.name)
                          }
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                            isSelected
                              ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                              : "text-foreground hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            <div
                              className={cn(
                                "h-2.5 w-2.5 shrink-0 rounded-full",
                                lbl.color,
                              )}
                            />
                            <span>{lbl.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}

                    <div className="border-border mt-1 border-t pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateLabelOpen(true)}
                        className="text-primary flex cursor-pointer items-center gap-1.5 px-2.5 text-xs font-bold hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create Label</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* SUB-TAB CONTENT 3: PRIORITY (MATCHING USER SCREENSHOT 2) */}
                {filterTab === "priority" && (
                  <div className="flex flex-col gap-1 py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedPriorityFilter(null)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                        !selectedPriorityFilter
                          ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <span>All Priorities</span>
                      {!selectedPriorityFilter && (
                        <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>

                    {[
                      {
                        name: "No Priority",
                        icon: (
                          <MoreHorizontal className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                      {
                        name: "Urgent",
                        icon: (
                          <div className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-xs bg-amber-500 text-[9px] font-bold text-white">
                            !
                          </div>
                        ),
                      },
                      {
                        name: "High",
                        icon: (
                          <SignalHigh className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                      {
                        name: "Medium",
                        icon: (
                          <SignalMedium className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                      {
                        name: "Low",
                        icon: (
                          <SignalLow className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                    ].map((p) => {
                      const isSelected =
                        selectedPriorityFilter?.toLowerCase() ===
                        p.name.toLowerCase();
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() =>
                            setSelectedPriorityFilter(
                              isSelected ? null : p.name,
                            )
                          }
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                            isSelected
                              ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                              : "text-foreground hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {p.icon}
                            <span>{p.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* SUB-TAB CONTENT 4: STATUS (MATCHING USER SCREENSHOT 3) */}
                {filterTab === "status" && (
                  <div className="flex flex-col gap-1 py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedStatusFilter(null)}
                      className={cn(
                        "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                        !selectedStatusFilter
                          ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40",
                      )}
                    >
                      <span>All Statuses</span>
                      {!selectedStatusFilter && (
                        <CheckCircle2 className="text-primary h-3.5 w-3.5 shrink-0" />
                      )}
                    </button>

                    {[
                      {
                        name: "Todo",
                        icon: (
                          <Circle className="text-muted-foreground/80 h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                      {
                        name: "Discussion",
                        icon: (
                          <Circle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        ),
                      },
                      {
                        name: "Reopen",
                        icon: (
                          <Circle className="h-3.5 w-3.5 shrink-0 text-rose-500" />
                        ),
                      },
                      {
                        name: "In Progress",
                        icon: (
                          <Square className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                        ),
                      },
                      {
                        name: "Move to QA",
                        icon: (
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-purple-500" />
                        ),
                      },
                      {
                        name: "Done",
                        icon: (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ),
                      },
                      {
                        name: "Completed",
                        icon: (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                        ),
                      },
                      {
                        name: "Cancelled",
                        icon: (
                          <XCircle className="text-muted-foreground/80 h-3.5 w-3.5 shrink-0" />
                        ),
                      },
                    ].map((st) => {
                      const isSelected =
                        selectedStatusFilter?.toLowerCase() ===
                        st.name.toLowerCase();
                      return (
                        <button
                          key={st.name}
                          type="button"
                          onClick={() =>
                            setSelectedStatusFilter(isSelected ? null : st.name)
                          }
                          className={cn(
                            "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                            isSelected
                              ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                              : "text-foreground hover:bg-secondary/40",
                          )}
                        >
                          <div className="flex items-center gap-2.5">
                            {st.icon}
                            <span>{st.name}</span>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                          )}
                        </button>
                      );
                    })}

                    {statuses
                      .filter(
                        (st) =>
                          ![
                            "Todo",
                            "Discussion",
                            "Reopen",
                            "In Progress",
                            "Move to QA",
                            "Done",
                            "Completed",
                            "Cancelled",
                          ].includes(st.name),
                      )
                      .map((st) => {
                        const isSelected =
                          selectedStatusFilter?.toLowerCase() ===
                          st.name.toLowerCase();
                        return (
                          <button
                            key={st.id}
                            type="button"
                            onClick={() =>
                              setSelectedStatusFilter(
                                isSelected ? null : st.name,
                              )
                            }
                            className={cn(
                              "flex cursor-pointer items-center justify-between rounded-xs px-2.5 py-1.5 text-left text-xs font-semibold transition-colors",
                              isSelected
                                ? "bg-primary/15 text-primary border-primary/30 border font-bold"
                                : "text-foreground hover:bg-secondary/40",
                            )}
                          >
                            <div className="flex items-center gap-2.5">
                              <Circle className="text-primary h-3.5 w-3.5 shrink-0" />
                              <span>{st.name}</span>
                            </div>
                            {isSelected && (
                              <CheckCircle2 className="text-primary ml-1 h-3.5 w-3.5 shrink-0" />
                            )}
                          </button>
                        );
                      })}

                    <div className="border-border mt-1 border-t pt-2">
                      <button
                        type="button"
                        onClick={() => setIsCreateStatusOpen(true)}
                        className="text-primary flex cursor-pointer items-center gap-1.5 px-2.5 text-xs font-bold hover:underline"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        <span>Create Status</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        ) : activeTab === "backlog" ? (
          /* BACKLOG VIEW LIST */
          <div className="flex w-full flex-1 flex-col gap-6">
            <div className="border-border bg-card flex flex-col items-start justify-between gap-4 border p-4 shadow-xs sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <ListTodo className="text-primary h-5 w-5" />
                  <h2 className="text-foreground text-base font-bold">
                    Project Backlog
                  </h2>
                  <Badge className="bg-primary/15 text-primary border-primary/30 rounded-none font-mono text-xs font-bold">
                    {backlogItems.length} Backlog Items
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  Unassigned project work backlog items ready for future sprint
                  planning.
                </p>
              </div>

              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
                  <Input
                    type="text"
                    placeholder="Search backlog..."
                    value={backlogSearchQuery}
                    onChange={(e) => setBacklogSearchQuery(e.target.value)}
                    className="bg-background border-border h-8 rounded-none pl-8 text-xs font-bold"
                  />
                </div>

                <Button
                  onClick={() => {
                    setTaskStatus("Todo");
                    setIsAddTaskOpen(true);
                  }}
                  className="bg-primary text-primary-foreground h-8 shrink-0 cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Backlog Item
                </Button>
              </div>
            </div>

            <div className="border-border bg-card flex flex-col border shadow-xs">
              <div className="bg-secondary/40 border-border text-muted-foreground flex items-center justify-between border-b px-4 py-2.5 text-xs font-bold tracking-wider uppercase">
                <span>Backlog Items ({backlogItems.length})</span>
                <span>Assignee / Action</span>
              </div>

              <div className="divide-border divide-y">
                {backlogItems
                  .filter(
                    (item) =>
                      item.title
                        .toLowerCase()
                        .includes(backlogSearchQuery.toLowerCase()) ||
                      item.code
                        .toLowerCase()
                        .includes(backlogSearchQuery.toLowerCase()),
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="hover:bg-secondary/20 flex flex-col justify-between gap-4 p-3.5 transition-colors sm:flex-row sm:items-center"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span
                          onClick={() => {
                            const tempTask: SprintTaskItem = {
                              id: item.id,
                              code: item.code,
                              title: item.title,
                              status: "Todo",
                              priority:
                                item.priority as SprintTaskItem["priority"],
                              dueDate: "Jan 14",
                              createdDate: item.createdDate,
                              assignee: item.assignee,
                              assigneeInitials: item.assignee[0],
                              assigneeColor:
                                "bg-sky-500/20 text-sky-500 border-sky-500/40",
                            };
                            openTaskDetail(tempTask);
                          }}
                          className="text-primary shrink-0 cursor-pointer font-mono text-xs font-bold hover:underline"
                          title="Click to view task details"
                        >
                          {item.code}
                        </span>
                        <span
                          onClick={() => {
                            const tempTask: SprintTaskItem = {
                              id: item.id,
                              code: item.code,
                              title: item.title,
                              status: "Todo",
                              priority:
                                item.priority as SprintTaskItem["priority"],
                              dueDate: "Jan 14",
                              createdDate: item.createdDate,
                              assignee: item.assignee,
                              assigneeInitials: item.assignee[0],
                              assigneeColor:
                                "bg-sky-500/20 text-sky-500 border-sky-500/40",
                            };
                            openTaskDetail(tempTask);
                          }}
                          className="text-foreground hover:text-primary flex-1 cursor-pointer truncate text-sm font-bold transition-colors"
                          title="Click to view task details"
                        >
                          {item.title}
                        </span>
                        <Badge className="bg-secondary text-foreground border-border text-[10px] font-semibold">
                          {item.category}
                        </Badge>
                      </div>

                      <div className="flex shrink-0 items-center gap-3">
                        <span className="text-muted-foreground font-mono text-xs">
                          {item.assignee}
                        </span>
                        <Button
                          onClick={() => {
                            const newTask: SprintTaskItem = {
                              id: `task-${Date.now()}`,
                              code: item.code,
                              title: item.title,
                              status: "Todo",
                              priority:
                                item.priority as SprintTaskItem["priority"],
                              dueDate: "Jan 14",
                              createdDate: item.createdDate,
                              assignee: item.assignee,
                              assigneeInitials: item.assignee[0],
                              assigneeColor:
                                "bg-sky-500/20 text-sky-500 border-sky-500/40",
                            };
                            setCurrentSprintTasks([
                              newTask,
                              ...currentSprintTasks,
                            ]);
                            setBacklogItems(
                              backlogItems.filter((b) => b.id !== item.id),
                            );
                          }}
                          className="bg-primary text-primary-foreground h-7 cursor-pointer gap-1 rounded-none text-xs text-[11px] font-semibold shadow-none"
                        >
                          <Zap className="h-3 w-3" /> Add to Sprint
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : sprints.length === 0 ? (
          /* INITIALLY NO SPRINTS SHOWN (EMPTY STATE MATCHING RULE) */
          <div className="border-border bg-card flex flex-col items-center justify-center border border-dashed p-12 text-center shadow-xs">
            <div className="border-border/80 bg-background/80 text-muted-foreground/60 mb-3 border p-3">
              <Zap className="h-8 w-8" />
            </div>
            <h3 className="text-foreground text-sm font-bold">
              No Sprints Created Yet
            </h3>
            <p className="text-muted-foreground mt-1 max-w-md text-xs">
              Initially no sprints are loaded. Click{" "}
              <strong>Generate Project Sprints</strong> to calculate sprint
              count based on project duration (3 months = 7 sprints at 14 days /
              80h each including Saturday & Sunday).
            </p>
            <Button
              onClick={() => setIsAddSprintOpen(true)}
              className="bg-primary text-primary-foreground mt-4 cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
            >
              <Plus className="h-4 w-4" /> Generate Project Sprints
            </Button>
          </div>
        ) : (
          /* GENERATED SPRINT TIMELINE LIST (SPEC MATCHING SCREENSHOT) */
          <div className="relative flex flex-col gap-4 pl-24">
            {/* Vertical Timeline Guide Line (Positioned at 70px) */}
            <div className="bg-border/80 absolute top-6 bottom-6 left-[70px] z-0 w-[2px]" />

            {sprints.map((sprint) => {
              const isSelected = sprint.id === selectedSprintId;

              return (
                <div key={sprint.id} className="relative flex items-center">
                  {/* Date Node Label (Positioned cleanly to the LEFT of the line) */}
                  <div className="text-muted-foreground absolute -left-[96px] w-[56px] text-right font-mono text-xs font-semibold">
                    {sprint.dateNode}
                  </div>

                  {/* Node Bullet Circle (Centered perfectly ON the 70px line) */}
                  <div className="border-card bg-border absolute -left-[29px] z-10 h-2.5 w-2.5 rounded-full border-2 shadow-2xs" />

                  {/* Sprint Card Row (Positioned to the RIGHT of the line) */}
                  <div
                    onClick={() => {
                      setSelectedSprintId(sprint.id);
                      if (sprint.status === "Current") {
                        setActiveTab("current");
                      }
                    }}
                    className={cn(
                      "bg-card flex flex-1 cursor-pointer items-center justify-between gap-4 border p-3.5 shadow-xs transition-all",
                      isSelected
                        ? "border-primary bg-primary/5 ring-primary/30 shadow-sm ring-1"
                        : "border-border hover:border-primary/40",
                    )}
                  >
                    {/* Left Side: Checkmark Icon + Sprint Name */}
                    <div className="flex items-center gap-3">
                      <div className="rounded-full border border-emerald-500/40 bg-emerald-500/10 p-1 text-emerald-500">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-foreground text-sm font-bold">
                        {sprint.name}
                      </span>
                    </div>

                    {/* Right Side: Status Badge, Hours Badge, Pencil Edit */}
                    <div className="flex items-center gap-3">
                      {/* Status Badge */}
                      <Badge
                        className={cn(
                          "rounded-none px-2 py-0.5 text-[10px] font-semibold uppercase",
                          sprint.status === "Completed" &&
                            "border-emerald-500/40 bg-emerald-500/10 text-emerald-500",
                          sprint.status === "Current" &&
                            "border-primary/40 bg-primary/10 text-primary",
                          sprint.status === "Planning" &&
                            "border-amber-500/40 bg-amber-500/10 text-amber-500",
                        )}
                      >
                        {sprint.status}
                      </Badge>

                      {/* Hours Allocated Badge */}
                      <Badge
                        variant="outline"
                        className="border-border bg-background text-foreground gap-1.5 rounded-none px-2.5 py-1 text-[11px] font-normal"
                      >
                        <Clock className="text-muted-foreground h-3 w-3" />
                        <span>{sprint.hoursAllocated}</span>
                      </Badge>

                      {/* Pencil Edit Icon */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditStart(sprint);
                        }}
                        className="text-muted-foreground hover:text-foreground h-7 w-7 cursor-pointer rounded-none"
                        title="Edit Sprint"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ADD / GENERATE SPRINT MODAL */}
      <Dialog open={isAddSprintOpen} onOpenChange={setIsAddSprintOpen}>
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          {sprints.length === 0 ? (
            /* INITIAL ADD SPRINT: BULK CREATE FUNCTIONALITY BASED ON PROJECT DURATION */
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground text-base font-bold">
                  Initial Project Sprint Setup
                </DialogTitle>
                <span className="text-muted-foreground text-xs">
                  Calculate initial sprint count based on project deadline
                  duration (14 days / 80h per sprint including Saturday &
                  Sunday).
                </span>
              </DialogHeader>

              <form onSubmit={handleGenerateSprints} className="space-y-4 py-2">
                {/* Project Select */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Select Project
                  </Label>
                  <select
                    value={modalProject}
                    onChange={(e) => setModalProject(e.target.value)}
                    className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
                  >
                    <option value="Cloud...">Cloud...</option>
                    <option value="Appofy Web">Appofy Web</option>
                    <option value="WorkSync HR">WorkSync HR</option>
                    <option value="Design System">Design System</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Duration in Months */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Project Duration (Months)
                    </Label>
                    <Input
                      required
                      type="number"
                      min="1"
                      max="24"
                      value={durationMonths}
                      onChange={(e) => setDurationMonths(e.target.value)}
                      className="bg-background border-border rounded-none text-xs"
                    />
                  </div>

                  {/* Project Start Date */}
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Project Start Date
                    </Label>
                    <Input
                      required
                      type="date"
                      value={startDateStr}
                      onChange={(e) => setStartDateStr(e.target.value)}
                      className="bg-background border-border rounded-none text-xs"
                    />
                  </div>
                </div>

                {/* LIVE SPRINT COUNT CALCULATION DISPLAY BANNER */}
                <div className="border-primary/40 bg-primary/10 flex flex-col gap-1.5 border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-primary text-[10px] font-bold tracking-wider uppercase">
                      Sprint Bulk Formula
                    </span>
                    <Badge className="bg-primary text-primary-foreground rounded-none font-mono text-[10px] font-bold">
                      {calculatedSprintCount} Sprints
                    </Badge>
                  </div>
                  <div className="text-foreground text-xs font-bold">
                    {durationMonthsNum}{" "}
                    {durationMonthsNum === 1 ? "Month" : "Months"} Duration ={" "}
                    {totalCalendarDays} Calendar Days
                  </div>
                  <p className="text-muted-foreground text-[11px]">
                    {totalCalendarDays} calendar days ÷ 14 days/sprint ={" "}
                    <strong className="text-primary font-bold">
                      {calculatedSprintCount} Sprints
                    </strong>{" "}
                    (each sprint = 14 days including Saturday & Sunday, 80h
                    allocated).
                  </p>
                </div>

                <DialogFooter className="mt-4 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddSprintOpen(false)}
                    className="cursor-pointer rounded-none text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer rounded-none text-xs font-bold"
                  >
                    Generate {calculatedSprintCount} Sprints
                  </Button>
                </DialogFooter>
              </form>
            </>
          ) : (
            /* SUBSEQUENT ADD SPRINT: SINGLE SPRINT CREATION ONLY WITH AUTO-FILLED & DISABLED SPRINT NAME */
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground text-base font-bold">
                  Add Single Sprint
                </DialogTitle>
                <span className="text-muted-foreground text-xs">
                  Append a new sprint cycle to the existing project timeline.
                </span>
              </DialogHeader>

              <form onSubmit={handleAddSingleSprint} className="space-y-4 py-2">
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">
                    Sprint Name (Auto-Filled)
                  </Label>
                  <Input
                    disabled
                    type="text"
                    value={`Sprint ${sprints.length + 1}`}
                    className="bg-muted border-border text-foreground cursor-not-allowed rounded-none text-xs font-bold opacity-90"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">Date Label</Label>
                    <Input
                      required
                      type="text"
                      placeholder="e.g. Jan 21"
                      value={singleDateNode}
                      onChange={(e) => setSingleDateNode(e.target.value)}
                      className="bg-background border-border rounded-none text-xs"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold">
                      Hours Allocated
                    </Label>
                    <Input
                      required
                      type="number"
                      value={singleHours}
                      onChange={(e) => setSingleHours(e.target.value)}
                      className="bg-background border-border rounded-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold">Status</Label>
                  <select
                    value={singleStatus}
                    onChange={(e) =>
                      setSingleStatus(
                        e.target.value as "Completed" | "Current" | "Planning",
                      )
                    }
                    className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
                  >
                    <option value="Planning">Planning</option>
                    <option value="Current">Current</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <DialogFooter className="mt-4 gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsAddSprintOpen(false)}
                    className="cursor-pointer rounded-none text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer rounded-none text-xs font-bold"
                  >
                    Add Sprint
                  </Button>
                </DialogFooter>
              </form>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* EDIT SPRINT MODAL */}
      <Dialog
        open={!!editingSprint}
        onOpenChange={(open) => !open && setEditingSprint(null)}
      >
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Edit Sprint
            </DialogTitle>
            {editingSprint && (
              <span className="text-muted-foreground font-mono text-xs">
                {editingSprint.id}
              </span>
            )}
          </DialogHeader>

          <form onSubmit={handleEditSave} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Sprint Name</Label>
              <Input
                required
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Date Label</Label>
                <Input
                  required
                  type="text"
                  value={editDateNode}
                  onChange={(e) => setEditDateNode(e.target.value)}
                  className="bg-background border-border rounded-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Hours Allocated</Label>
                <Input
                  required
                  type="number"
                  value={editHours}
                  onChange={(e) => setEditHours(e.target.value)}
                  className="bg-background border-border rounded-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status</Label>
              <select
                value={editStatus}
                onChange={(e) =>
                  setEditStatus(
                    e.target.value as "Completed" | "Current" | "Planning",
                  )
                }
                className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
              >
                <option value="Current">Current</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingSprint(null)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE LABEL MODAL */}
      <Dialog open={isCreateLabelOpen} onOpenChange={setIsCreateLabelOpen}>
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Create New Label
            </DialogTitle>
            <span className="text-muted-foreground text-xs">
              Add a new category label for sprint tasks.
            </span>
          </DialogHeader>

          <form onSubmit={handleCreateLabelSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Label Name</Label>
              <Input
                required
                type="text"
                placeholder="e.g. Documentation"
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Label Color</Label>
              <select
                value={newLabelColor}
                onChange={(e) => setNewLabelColor(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full cursor-pointer border p-2 text-xs outline-none"
              >
                <option value="bg-rose-600">Red (Bug)</option>
                <option value="bg-amber-500">Gold/Yellow (Feature)</option>
                <option value="bg-emerald-500">Green (Improvement)</option>
                <option value="bg-indigo-500">Indigo (Task)</option>
                <option value="bg-purple-500">Purple (Refactor)</option>
              </select>
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateLabelOpen(false)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs font-bold"
              >
                Create Label
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* CREATE STATUS MODAL */}
      <Dialog open={isCreateStatusOpen} onOpenChange={setIsCreateStatusOpen}>
        <DialogContent className="bg-card border-border rounded-none sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold">
              Create Custom Status
            </DialogTitle>
            <span className="text-muted-foreground text-xs">
              Add a new workflow status column to the sprint lifecycle.
            </span>
          </DialogHeader>

          <form onSubmit={handleCreateStatusSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Status Name</Label>
              <Input
                required
                type="text"
                placeholder="e.g. Code Review"
                value={newStatusName}
                onChange={(e) => setNewStatusName(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateStatusOpen(false)}
                className="cursor-pointer rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="cursor-pointer rounded-none text-xs font-bold"
              >
                Create Status
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD TASK MODAL (MATCHING USER SCREENSHOT SPEC) */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="bg-card border-border gap-0 overflow-hidden rounded-xl p-0 shadow-2xl sm:max-w-2xl [&>button]:hidden">
          {/* HEADER BAR */}
          <div className="flex items-center justify-between p-4 pb-2">
            <div className="text-foreground flex items-center gap-2 text-xs font-semibold">
              <span className="text-sm font-bold">Add Task</span>
            </div>

            <div className="text-muted-foreground flex items-center gap-2">
              <button
                type="button"
                className="hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
                title="Expand"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsAddTaskOpen(false)}
                className="hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1"
                title="Close"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <form
            onSubmit={handleAddTaskSubmit}
            className="flex flex-col gap-4 p-4 pt-1"
          >
            {/* Issue Title Input */}
            <div>
              <input
                required
                type="text"
                placeholder="Issue title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="text-foreground placeholder:text-muted-foreground/60 w-full border-none bg-transparent py-1 text-lg font-bold outline-none"
              />
            </div>

            {/* Issue Description Rich Text Editor & Attachments */}
            <div className="flex flex-col gap-2">
              <RichTextEditor
                value={taskDescription}
                onChange={(content) => setTaskDescription(content)}
                placeholder="Add description..."
                minHeight="100px"
              />

              {/* Uploaded Attachment Thumbnails */}
              {taskAttachments.length > 0 && (
                <div className="border-border/60 bg-secondary/20 flex max-h-36 flex-wrap gap-2 overflow-y-auto rounded-lg border p-2">
                  {taskAttachments.map((img, index) => (
                    <div
                      key={index}
                      className="border-border/80 group bg-card relative h-24 w-24 shrink-0 overflow-hidden rounded-md border"
                    >
                      <div className="bg-card/90 absolute top-1 right-1 z-10 flex items-center gap-1 rounded-xs p-0.5 shadow-xs backdrop-blur-xs">
                        <button
                          type="button"
                          onClick={() => setLightboxImage(img)}
                          className="hover:text-primary text-muted-foreground cursor-pointer"
                          title="Preview"
                        >
                          <Eye className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setTaskAttachments(
                              taskAttachments.filter((_, i) => i !== index),
                            )
                          }
                          className="hover:text-destructive text-muted-foreground cursor-pointer"
                          title="Remove"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <img
                        src={img}
                        alt="Attachment"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* PROPERTY PILL BUTTONS BAR */}
            <div className="flex flex-wrap items-center gap-2 py-2">
              {/* Status Picker Pill */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="bg-secondary/60 hover:bg-secondary border-border/60 text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    <Circle className="text-muted-foreground h-3 w-3" />
                    <span>{taskStatus || "Todo"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-card border-border z-50 w-44"
                >
                  {statuses.map((s) => (
                    <DropdownMenuItem
                      key={s.id || s.name}
                      onClick={() => setTaskStatus(s.name)}
                      className="cursor-pointer text-xs"
                    >
                      {s.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Priority Picker Pill */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="bg-secondary/60 hover:bg-secondary border-border/60 text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    <span className="text-muted-foreground font-mono text-[10px]">
                      ---
                    </span>
                    <span>{taskPriority || "Priority"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-card border-border z-50 w-44"
                >
                  {["Urgent", "High", "Medium", "Low", "No Priority"].map(
                    (prio) => (
                      <DropdownMenuItem
                        key={prio}
                        onClick={() =>
                          setTaskPriority(
                            prio as
                              | "Urgent"
                              | "High"
                              | "Medium"
                              | "Low"
                              | "No Priority",
                          )
                        }
                        className="cursor-pointer text-xs"
                      >
                        {prio}
                      </DropdownMenuItem>
                    ),
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Assignee Picker Pill */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="bg-secondary/60 hover:bg-secondary border-border/60 text-foreground flex cursor-pointer items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium"
                  >
                    <User className="text-muted-foreground h-3.5 w-3.5" />
                    <span>{taskAssignee || "No Assignee"}</span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="bg-card border-border z-50 w-52"
                >
                  {ASSIGNEES_LIST.map((person) => (
                    <DropdownMenuItem
                      key={person.name}
                      onClick={() => setTaskAssignee(person.name)}
                      className="cursor-pointer gap-2 text-xs"
                    >
                      <div
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border text-[8px] font-bold",
                          person.color,
                        )}
                      >
                        {person.initials}
                      </div>
                      <span>{person.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* BOTTOM FOOTER BAR (Below divider line) */}
            <div className="border-border/60 mt-1 flex items-center justify-between border-t pt-3">
              {/* Attachment Icon & File Input */}
              <label
                className="hover:bg-secondary text-muted-foreground hover:text-foreground flex cursor-pointer items-center gap-1 rounded-md p-1.5"
                title="Attach file / image"
              >
                <Paperclip className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    files.forEach((file) => {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const newUrl = event.target?.result as string;
                        if (newUrl) {
                          setTaskAttachments((prev) => [...prev, newUrl]);
                        }
                      };
                      reader.readAsDataURL(file);
                    });
                  }}
                />
              </label>

              {/* Right Footer Actions: Create More Toggle + Create Issue Button */}
              <div className="flex items-center gap-3">
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-8 cursor-pointer rounded-lg px-5 text-xs font-bold shadow-xs"
                >
                  Create issue
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* IMAGE LIGHTBOX PREVIEW MODAL */}
      {lightboxImage && (
        <Dialog
          open={Boolean(lightboxImage)}
          onOpenChange={() => setLightboxImage(null)}
        >
          <DialogContent className="bg-card/95 border-border z-[9999] flex flex-col items-center gap-4 overflow-hidden rounded-xl p-5 shadow-2xl backdrop-blur-xl sm:max-w-5xl [&>button]:hidden">
            <div className="border-border/60 flex w-full items-center justify-between border-b pb-3">
              <div className="text-foreground flex items-center gap-2 text-sm font-bold">
                <Eye className="text-primary h-4 w-4" />
                <span>Image Attachment Preview</span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href={lightboxImage}
                  download="attachment"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary bg-primary/10 border-primary/30 flex cursor-pointer items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-bold hover:underline"
                >
                  <Download className="h-4 w-4" /> Download
                </a>
                <button
                  type="button"
                  onClick={() => setLightboxImage(null)}
                  className="hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-md p-1.5 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-background/50 flex max-h-[80vh] w-full items-center justify-center overflow-auto rounded-lg p-2">
              <img
                src={lightboxImage}
                alt="Attachment Preview"
                className="max-h-[75vh] max-w-full rounded-md object-contain shadow-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
