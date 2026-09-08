import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeInitializer } from "@/components/theme-initializer";
import { UserRoleProvider } from "@/lib/user-role-context";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "Project EPD - Radix Dark Sidebar Dashboard",
  description:
    "Built with Next.js, Tailwind CSS v4, Shadcn UI Sidebar, Zod, React Hook Form, Nuqs, and TanStack Table.",
};

const themeInlineScript = `(function(){try{var m=localStorage.getItem('themeMode')||'dark';var c=localStorage.getItem('themeColor')||'slate';var t={slate:{primary:'226 71% 55%',darkBg:'230 9% 13%',darkCard:'230 9% 16%',darkBorder:'230 9% 22%',lightBg:'0 0% 100%',lightCard:'0 0% 98%',lightBorder:'231 6% 88%'},violet:{primary:'262 83% 58%',darkBg:'240 10% 6%',darkCard:'240 10% 10%',darkBorder:'240 10% 16%',lightBg:'250 20% 98%',lightCard:'0 0% 100%',lightBorder:'250 15% 90%'},emerald:{primary:'158 64% 42%',darkBg:'155 30% 5%',darkCard:'155 25% 9%',darkBorder:'155 20% 15%',lightBg:'150 25% 98%',lightCard:'0 0% 100%',lightBorder:'150 20% 90%'},oceanic:{primary:'199 89% 48%',darkBg:'210 30% 6%',darkCard:'210 25% 10%',darkBorder:'210 20% 16%',lightBg:'210 30% 98%',lightCard:'0 0% 100%',lightBorder:'210 20% 90%'},amber:{primary:'38 92% 50%',darkBg:'25 25% 6%',darkCard:'25 20% 10%',darkBorder:'25 15% 16%',lightBg:'35 30% 98%',lightCard:'0 0% 100%',lightBorder:'35 20% 90%'}}[c]||{primary:'226 71% 55%',darkBg:'230 9% 13%',darkCard:'230 9% 16%',darkBorder:'230 9% 22%',lightBg:'0 0% 100%',lightCard:'0 0% 98%',lightBorder:'231 6% 88%'};var r=document.documentElement;if(m==='dark'){r.classList.add('dark');}else{r.classList.remove('dark');}r.style.setProperty('--primary',t.primary);r.style.setProperty('--ring',t.primary);r.style.setProperty('--accent',t.primary);r.style.setProperty('--sidebar-primary',t.primary);r.style.setProperty('--sidebar-ring',t.primary);r.style.setProperty('--sidebar-accent-foreground',t.primary);if(m==='dark'){r.style.setProperty('--background',t.darkBg);r.style.setProperty('--card',t.darkCard);r.style.setProperty('--border',t.darkBorder);r.style.setProperty('--sidebar-background',t.darkBg);}else{r.style.setProperty('--background',t.lightBg);r.style.setProperty('--card',t.lightCard);r.style.setProperty('--border',t.lightBorder);r.style.setProperty('--sidebar-background',t.lightCard);}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInlineScript }} />
      </head>
      <body
        className={`${outfit.variable} ${outfit.className} text-foreground min-h-screen bg-[#1E1F24] antialiased`}
      >
        <ThemeInitializer />
        <NuqsAdapter>
          <UserRoleProvider>
            <TooltipProvider>
              <SidebarProvider>
                <div className="bg-background text-foreground flex min-h-screen w-full transition-colors duration-200">
                  <Suspense
                    fallback={
                      <div className="bg-sidebar border-sidebar-border w-16 border-r" />
                    }
                  >
                    <AppSidebar />
                  </Suspense>

                  <SidebarInset className="bg-background flex flex-1 flex-col">
                    <Suspense
                      fallback={
                        <div className="text-muted-foreground flex items-center justify-center p-12">
                          <Loader2 className="text-primary mr-2 h-5 w-5 animate-spin" />
                          Loading workspace...
                        </div>
                      }
                    >
                      {children}
                    </Suspense>
                  </SidebarInset>
                </div>
              </SidebarProvider>
              <Toaster position="bottom-right" />
            </TooltipProvider>
          </UserRoleProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
