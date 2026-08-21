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
    <Sidebar className="border-r border-[#2C2E36] bg-[#16171B]">
      {/* Brand Header */}
      <SidebarHeader className="border-b border-[#2C2E36] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#7C66DC]/40 bg-[#7C66DC]/20 text-[#7C66DC] shadow-inner">
            <Layers className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white">
                Project EPD
              </span>
              <Badge className="border-[#7C66DC]/30 bg-[#7C66DC]/20 py-0 text-[10px] font-medium text-[#A492E8]">
                v1.0
              </Badge>
            </div>
            <span className="text-xs text-[#9E9EA5]">Radix Dark Workspace</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Sidebar Content */}
      <SidebarContent className="px-2 py-3">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider text-[#9E9EA5] uppercase">
            Platform Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.isActive}
                    className="w-full justify-between text-[#EEEEF0] transition-colors hover:bg-[#282930] data-[active=true]:bg-[#7C66DC]/20 data-[active=true]:text-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-[#A492E8]" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    {item.badge ? (
                      <Badge
                        variant="outline"
                        className="border-[#7C66DC]/40 bg-[#7C66DC]/10 text-[10px] text-[#A492E8]"
                      >
                        {item.badge}
                      </Badge>
                    ) : (
                      <ChevronRight className="h-3.5 w-3.5 text-[#9E9EA5] opacity-60" />
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management Group */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="px-3 text-[11px] font-semibold tracking-wider text-[#9E9EA5] uppercase">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {managementNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="w-full justify-between text-[#EEEEF0] transition-colors hover:bg-[#282930]">
                    <div className="flex items-center gap-2.5">
                      <item.icon className="h-4 w-4 text-[#9E9EA5]" />
                      <span className="text-sm font-medium">{item.title}</span>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-[#9E9EA5] opacity-60" />
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tech Stack Indicator Box */}
        <div className="mx-2 mt-6 rounded-xl border border-[#2C2E36] bg-[#25262C]/60 p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#A492E8]">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" /> Radix Custom
            Theme
          </div>
          <p className="mt-1 text-[11px] text-[#9E9EA5]">
            Dark color palette tuned to{" "}
            <code className="font-mono text-white">#1E1F24</code>.
          </p>
        </div>
      </SidebarContent>

      {/* User Profile Footer */}
      <SidebarFooter className="border-t border-[#2C2E36] p-3">
        <div className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-[#282930]">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#7C66DC]/40 bg-[#7C66DC]/30 text-xs font-bold text-white">
              EP
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white">
                Lead Engineer
              </span>
              <span className="text-[10px] text-[#9E9EA5]">
                admin@project-epd.io
              </span>
            </div>
          </div>
          <LogOut className="h-4 w-4 cursor-pointer text-[#9E9EA5] hover:text-white" />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
