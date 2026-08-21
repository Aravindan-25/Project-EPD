"use client";

import * as React from "react";
import { useQueryState, parseAsString } from "nuqs";
import {
  FolderKanban,
  Layers,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  ChevronUp,
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
import { USER_PROFILES, type UserRoleProfile } from "@/types/project";
import { cn } from "@/lib/utils";

const projectNavItems = [
  {
    title: "Projects",
    icon: FolderKanban,
    isActive: true,
    badge: "Active",
  },
];

export function AppSidebar() {
  const { toggleSidebar, state } = useSidebar();
  const [settingsOpen, setSettingsOpen] = React.useState(false);

  // Active user query param for RBAC
  const [userCode, setUserCode] = useQueryState(
    "user",
    parseAsString.withDefault("ADMIN"),
  );

  const currentUser: UserRoleProfile =
    USER_PROFILES.find((u) => u.code === userCode) || USER_PROFILES[0];

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
                    Workspace Engine
                  </span>
                </div>
              </div>
            )}

            {/* Collapse Toggle Button - Balanced Square Space */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className={cn(
                "text-muted-foreground hover:text-foreground shrink-0 rounded-none transition-colors",
                isCollapsed
                  ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                  : "h-7 w-7",
              )}
              title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          </div>
        </SidebarHeader>

        {/* Sidebar Content - Balanced Square Space Around Icons */}
        <SidebarContent className={cn("py-3", isCollapsed ? "px-1" : "px-2")}>
          <SidebarGroup className="p-0">
            {!isCollapsed && (
              <SidebarGroupLabel className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
                Navigation
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {projectNavItems.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className="flex justify-center"
                  >
                    <SidebarMenuButton
                      isActive={item.isActive}
                      tooltip={item.title}
                      className={cn(
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/20 data-[active=true]:text-primary text-sidebar-foreground rounded-none transition-colors",
                        isCollapsed
                          ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                          : "w-full justify-between",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center gap-2.5",
                          isCollapsed &&
                            "h-full w-full items-center justify-center",
                        )}
                      >
                        <item.icon className="text-primary h-4 w-4 shrink-0" />
                        {!isCollapsed && (
                          <span className="text-xs font-medium">
                            {item.title}
                          </span>
                        )}
                      </div>
                      {!isCollapsed && (
                        <Badge
                          variant="outline"
                          className="border-primary/40 bg-primary/10 text-primary rounded-none text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
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
                onClick={() => setSettingsOpen(true)}
                tooltip="Settings"
                className={cn(
                  "hover:bg-sidebar-accent text-sidebar-foreground hover:text-sidebar-accent-foreground rounded-none transition-colors",
                  isCollapsed
                    ? "mx-auto flex h-8 w-8 items-center justify-center p-0"
                    : "w-full justify-start",
                )}
              >
                <Settings className="text-muted-foreground h-4 w-4 shrink-0" />
                {!isCollapsed && (
                  <span className="text-xs font-medium">Settings</span>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>

          {/* USER ROLE SWITCHER FOOTER */}
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
                      currentUser.role === "admin"
                        ? "border-amber-500/40 bg-amber-500/20 text-amber-500"
                        : "bg-primary/20 text-primary border-primary/40",
                    )}
                  >
                    {currentUser.avatar}
                  </div>
                  {!isCollapsed && (
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sidebar-foreground truncate text-xs font-semibold">
                          {currentUser.name}
                        </span>
                        <Badge
                          variant="outline"
                          className={cn(
                            "rounded-none px-1 py-0 text-[9px] font-bold uppercase",
                            currentUser.role === "admin"
                              ? "border-amber-500/30 bg-amber-500/10 text-amber-500"
                              : "border-blue-500/30 bg-blue-500/10 text-blue-500",
                          )}
                        >
                          {currentUser.role === "admin" ? "Admin" : "PM"}
                        </Badge>
                      </div>
                      <span className="text-muted-foreground truncate text-[10px]">
                        {currentUser.code}
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
              className="bg-card border-border w-64 rounded-none p-1 shadow-xl"
            >
              <DropdownMenuLabel className="text-muted-foreground px-2 py-1 text-[11px] font-semibold tracking-wider uppercase">
                Switch Logged-In User Role
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              {USER_PROFILES.map((u) => (
                <DropdownMenuItem
                  key={u.id}
                  onClick={() => setUserCode(u.code)}
                  className={`flex cursor-pointer items-center justify-between rounded-none p-2 text-xs ${
                    userCode === u.code
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-foreground hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-none text-[10px] font-bold ${
                        u.role === "admin"
                          ? "bg-amber-500/20 text-amber-500"
                          : "bg-primary/20 text-primary"
                      }`}
                    >
                      {u.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{u.name}</span>
                      <span className="text-muted-foreground text-[10px]">
                        {u.role === "admin"
                          ? "Admin / All Access"
                          : `PM (${u.code})`}
                      </span>
                    </div>
                  </div>
                  {userCode === u.code && (
                    <UserCheck className="text-primary h-4 w-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* SETTINGS DIALOG */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
