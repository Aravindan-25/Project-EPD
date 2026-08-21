"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ProjectsView } from "@/components/projects-view";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
      <div className="bg-background text-foreground flex min-h-screen w-full transition-colors duration-200">
        {/* Shadcn UI Sidebar wrapped in Suspense for nuqs query state */}
        <Suspense
          fallback={
            <div className="bg-sidebar border-sidebar-border w-16 border-r" />
          }
        >
          <AppSidebar />
        </Suspense>

        {/* Main Content Workspace Inset */}
        <SidebarInset className="bg-background flex flex-1 flex-col">
          <Suspense
            fallback={
              <div className="text-muted-foreground flex items-center justify-center p-12">
                <Loader2 className="text-primary mr-2 h-5 w-5 animate-spin" />
                Loading Projects workspace...
              </div>
            }
          >
            <ProjectsView />
          </Suspense>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
