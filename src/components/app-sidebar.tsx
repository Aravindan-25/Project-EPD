"use client";

import * as React from "react";
import {
  FolderKanban,
  Layers,
  LogOut,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
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

        {/* Sidebar Footer - Balanced Square Space Around Footer Buttons */}
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

          {/* User Profile Footer */}
          {!isCollapsed ? (
            <div className="hover:bg-sidebar-accent border-sidebar-border/50 flex items-center justify-between border-t p-2 pt-2 transition-colors">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="border-primary/40 bg-primary/30 text-primary-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold">
                  EP
                </div>
                <div className="flex flex-col truncate">
                  <span className="text-sidebar-foreground truncate text-xs font-semibold">
                    Lead Engineer
                  </span>
                  <span className="text-muted-foreground truncate text-[10px]">
                    admin@project-epd.io
                  </span>
                </div>
              </div>
              <LogOut className="text-muted-foreground hover:text-foreground h-4 w-4 shrink-0 cursor-pointer" />
            </div>
          ) : (
            <div className="flex w-full items-center justify-center py-1">
              <div
                className="border-primary/40 bg-primary/30 text-primary-foreground flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold"
                title="Lead Engineer (admin@project-epd.io)"
              >
                EP
              </div>
            </div>
          )}
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      {/* SETTINGS DIALOG */}
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
