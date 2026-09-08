"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FolderKanban,
  LayoutDashboard,
  LayoutGrid,
  ListTodo,
  CalendarCheck,
  CalendarOff,
  FileText,
  Laptop,
  LifeBuoy,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  ChevronUp,
  Zap,
  HardDrive,
  Users,
  ShieldCheck,
  Briefcase,
  User,
  CalendarDays,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { SettingsDialog } from "@/components/settings-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useUserRole,
  USER_ROLE_PROFILES,
  type RoleType,
} from "@/lib/user-role-context";
import { cn } from "@/lib/utils";

const allNavItems = [
  {
    id: "dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    id: "tasks",
    title: "My Task",
    icon: ListTodo,
    href: "/tasks",
  },
  {
    id: "attendance",
    title: "My Attendance",
    icon: CalendarCheck,
    href: "/attendance",
  },
  {
    id: "leaves",
    title: "My Leaves",
    icon: CalendarOff,
    href: "/leaves",
  },
  {
    id: "worklog",
    title: "My Worklog",
    icon: FileText,
    href: "/worklog",
  },
  {
    id: "assets",
    title: "My Assets",
    icon: Laptop,
    href: "/assets",
  },
  {
    id: "documents",
    title: "Documents",
    icon: FileText,
    href: "/documents",
  },
  {
    id: "servicerequest",
    title: "Service Request",
    icon: LifeBuoy,
    href: "/servicerequest",
  },
  {
    id: "projects",
    title: "Projects",
    icon: FolderKanban,
    href: "/projects",
  },
  {
    id: "projectworkspace",
    title: "Project Workspace",
    icon: LayoutGrid,
    href: "/projectworkspace",
  },
  {
    id: "sprints",
    title: "Sprints",
    icon: Zap,
    href: "/sprints",
  },
  {
    id: "weeklyworklog",
    title: "Weekly Worklog",
    icon: CalendarDays,
    href: "/weeklyworklog",
  },
  {
    id: "attendancemanagement",
    title: "Attendance Management",
    icon: UserCheck,
    href: "/attendancemanagement",
  },
  {
    id: "employeesmanagement",
    title: "Employees Management",
    icon: Users,
    href: "/employeesmanagement",
  },
  {
    id: "assetsmanagement",
    title: "Assets Management",
    icon: HardDrive,
    href: "/assetsmanagement",
  },
];

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const pathname = usePathname();
  const [settingsOpen, setSettingsOpen] = React.useState(false);
  const { role, setRole, currentProfile } = useUserRole();

  const getNavHref = (href: string) => {
    return `${href}?role=${role}`;
  };

  // Filter navigation items based on current role's permissions
  const filteredNavItems = allNavItems.filter((item) => {
    if (item.id === "weeklyworklog" && (role === "ADMIN" || role === "PM")) {
      return true;
    }
    return currentProfile.allowedNavItems.includes(item.id);
  });

  const isCollapsed = state === "collapsed";

  return (
    <>
      <Sidebar
        collapsible="icon"
        className="border-sidebar-border bg-sidebar border-r"
      >
        {/* Brand Header with Center-Aligned Collapse Icon */}
        <SidebarHeader className="border-sidebar-border border-b p-3">
          <div
            className={cn(
              "flex w-full items-center",
              isCollapsed ? "justify-center" : "justify-between",
            )}
          >
            {!isCollapsed && (
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="border-primary/40 bg-primary/20 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border shadow-inner">
                  <Layers className="h-4 w-4" />
                </div>
                <div className="flex flex-col truncate">
                  <div className="flex items-center gap-2">
                    <span className="text-sidebar-foreground text-xs font-bold tracking-tight">
                      Project EPD
                    </span>
                    <Badge className="bg-primary/20 text-primary border-primary/30 py-0 text-[9px] font-medium">
                      v1.0
                    </Badge>
                  </div>
                  <span className="text-muted-foreground truncate text-[10px]">
                    Enterprise Portal
                  </span>
                </div>
              </div>
            )}

            {/* Collapse Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground h-8 w-8 cursor-pointer rounded-lg",
                isCollapsed && "mx-auto",
              )}
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarHeader>

        {/* Sidebar Navigation Links */}
        <SidebarContent className="px-2 py-3">
          <SidebarGroup className="p-0">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-muted-foreground px-2 pb-2 text-[10px] font-bold tracking-wider uppercase">
                Menu &bull; {currentProfile.code} Role
              </SidebarGroupLabel>
            )}

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {filteredNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;

                  return (
                    <SidebarMenuItem
                      key={item.id}
                      className="flex justify-center"
                    >
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={item.title}
                        className={cn(
                          "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/20 data-[active=true]:text-primary cursor-pointer rounded-none transition-colors",
                          isCollapsed
                            ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                            : "w-full justify-start",
                        )}
                      >
                        <Link href={getNavHref(item.href)}>
                          <div
                            className={cn(
                              "flex items-center",
                              isCollapsed ? "justify-center" : "gap-3",
                            )}
                          >
                            <Icon className="h-4 w-4 shrink-0" />
                            {!isCollapsed && (
                              <span className="text-xs font-medium">
                                {item.title}
                              </span>
                            )}
                          </div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Sidebar Footer - Settings & Role Switcher */}
        <SidebarFooter
          className={cn(
            "border-sidebar-border border-t py-2",
            isCollapsed ? "space-y-2 px-1" : "space-y-1 px-2",
          )}
        >
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center">
              <SidebarMenuButton
                asChild
                isActive={pathname === "/settings"}
                tooltip="Settings"
                className={cn(
                  "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/20 data-[active=true]:text-primary cursor-pointer rounded-none transition-colors",
                  isCollapsed
                    ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                    : "w-full justify-start",
                )}
              >
                <Link href={getNavHref("/settings")}>
                  <Settings className="text-muted-foreground h-4 w-4 shrink-0" />
                  {!isCollapsed && (
                    <span className="text-xs font-medium">Settings</span>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* 4-ROLE EMPLOYEE LOGIN SWITCHER */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div
                className={cn(
                  "hover:bg-sidebar-accent border-sidebar-border/60 cursor-pointer rounded-none border p-2 transition-colors",
                  isCollapsed
                    ? "mx-auto flex h-9 w-9 items-center justify-center p-0"
                    : "flex w-full items-center justify-between",
                )}
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-none border text-xs font-bold",
                      role === "ADMIN"
                        ? "border-amber-500/40 bg-amber-500/20 text-amber-500"
                        : role === "HR"
                          ? "border-rose-500/40 bg-rose-500/20 text-rose-500"
                          : role === "PM"
                            ? "border-blue-500/40 bg-blue-500/20 text-blue-400"
                            : "border-primary/40 bg-primary/20 text-primary",
                    )}
                  >
                    {currentProfile.avatar}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sidebar-foreground truncate text-xs font-semibold">
                          {currentProfile.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-none px-1 py-0 text-[9px] font-bold uppercase",
                            role === "ADMIN"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                              : role === "HR"
                                ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                                : role === "PM"
                                  ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                  : "border-emerald-500/30 bg-emerald-500/10 text-emerald-500",
                          )}
                        >
                          {role}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground truncate text-[10px]">
                        {currentProfile.designation}
                      </span>
                    </div>
                  )}
                </div>
                {!isCollapsed && (
                  <ChevronUp className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                )}
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              className="bg-card border-border w-72 rounded-none p-1 shadow-xl"
            >
              <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-semibold tracking-wider uppercase">
                Select Employee Login Role
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {(Object.keys(USER_ROLE_PROFILES) as RoleType[]).map((rKey) => {
                const profile = USER_ROLE_PROFILES[rKey];
                const isSelected = role === rKey;

                return (
                  <DropdownMenuItem
                    key={rKey}
                    onClick={() => setRole(rKey)}
                    className={`flex cursor-pointer items-center justify-between rounded-none p-2 text-xs ${
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`flex h-7 w-7 items-center justify-center rounded-none border text-[10px] font-bold ${
                          rKey === "ADMIN"
                            ? "border-amber-500/40 bg-amber-500/20 text-amber-500"
                            : rKey === "HR"
                              ? "border-rose-500/40 bg-rose-500/20 text-rose-500"
                              : rKey === "PM"
                                ? "border-blue-500/40 bg-blue-500/20 text-blue-400"
                                : "border-emerald-500/40 bg-emerald-500/20 text-emerald-500"
                        }`}
                      >
                        {profile.avatar}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{profile.name}</span>
                        <span className="text-muted-foreground text-[10px]">
                          {profile.designation}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <UserCheck className="text-primary h-4 w-4 shrink-0" />
                    )}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
