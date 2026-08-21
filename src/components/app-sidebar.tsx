"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Table as TableIcon,
  FolderKanban,
  BarChart3,
  Settings,
  Users,
  ShieldAlert,
  Sparkles,
  Layers,
  ChevronRight,
  LogOut,
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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

const mainNavItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    isActive: true,
  },
  {
    title: "Task Directory Engine",
    icon: TableIcon,
    badge: "Nuqs Sync",
  },
  {
    title: "Projects",
    icon: FolderKanban,
  },
  {
    title: "Analytics",
    icon: BarChart3,
  },
];

const managementNavItems = [
  {
    title: "Team Members",
    icon: Users,
  },
  {
    title: "Security & Audit",
    icon: ShieldAlert,
  },
  {
    title: "Settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="border-sidebar-border bg-sidebar border-r">
      {/* Brand Header */}
      <SidebarHeader className="border-sidebar-border border-b p-4">
        <div className="flex items-center gap-3">
          <div className="border-primary/40 bg-primary/20 text-primary flex h-9 w-9 items-center justify-center rounded-lg border shadow-inner">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sidebar-foreground font-bold tracking-tight">
                Project EPD
              </span>
              <Badge className="bg-primary/20 text-primary border-primary/30 py-0 text-[10px] font-medium">
                v1.0
              </Badge>
            </div>
            <span className="text-muted-foreground text-xs">
              Workspace Engine
            </span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-3">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
            Platform Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-primary/20 data-[active=true]:text-primary text-sidebar-foreground w-full justify-between transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="text-primary h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge ? (
                      <Badge
                        variant="outline"
                        className="border-primary/40 bg-primary/10 text-primary text-[10px]"
                      >
                        {item.badge}
                      </Badge>
                    ) : (
                      <ChevronRight className="text-muted-foreground h-3.5 w-3.5 opacity-60" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Group */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="text-muted-foreground px-3 text-[11px] font-semibold tracking-wider uppercase">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="hover:bg-sidebar-accent text-sidebar-foreground w-full justify-between transition-colors">
                    <div className="flex items-center gap-2.5">
                      <item.icon className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <ChevronRight className="text-muted-foreground h-3.5 w-3.5 opacity-60" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tech Stack Indicator Box */}
        <div className="border-border bg-card/60 mx-2 mt-6 rounded-xl border p-3 shadow-sm">
          <div className="text-primary flex items-center gap-1.5 text-xs font-semibold">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Active Color
            Scheme
          </div>
          <p className="text-muted-foreground mt-1 text-[11px]">
            Accent: <code className="text-primary font-mono">#3D63DD</code> |
            Gray:{" "}
            <code className="text-muted-foreground font-mono">#8B8D98</code>
          </p>
        </div>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-sidebar-border border-t p-3">
        <div className="hover:bg-sidebar-accent flex items-center justify-between rounded-lg p-2 transition-colors">
          <div className="flex items-center gap-3">
            <div className="bg-primary/30 text-primary-foreground border-primary/40 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
              EP
            </div>
            <div className="flex flex-col">
              <span className="text-sidebar-foreground text-xs font-semibold">
                Lead Engineer
              </span>
              <span className="text-muted-foreground text-[10px]">
                admin@project-epd.io
              </span>
            </div>
          </div>
          <LogOut className="text-muted-foreground hover:text-foreground h-4 w-4 cursor-pointer" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
