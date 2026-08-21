"use client";

import { useState } from "react";
import { Sun, Moon, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
        ? "dark"
        : "light";
    }
    return "dark";
  });

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border rounded-none p-6 shadow-2xl sm:max-w-[480px]">
        <DialogHeader className="border-border border-b pb-3">
          <DialogTitle className="text-foreground text-base font-bold">
            Settings
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Manage your interface appearance and workspace preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* THEME SELECTION SECTION */}
          <div className="space-y-2">
            <h4 className="text-foreground text-xs font-semibold tracking-wider uppercase">
              Appearance & Theme Mode
            </h4>
            <p className="text-muted-foreground text-xs">
              Choose between light and dark theme mode.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              {/* Light Mode Option */}
              <button
                type="button"
                onClick={() => handleThemeChange("light")}
                className={`relative flex flex-col items-center justify-center rounded-none border p-4 text-left transition-all ${
                  theme === "light"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Sun className="h-5 w-5" />
                  <span className="text-xs font-bold">Light Mode</span>
                </div>
                <span className="text-muted-foreground text-center text-[10px]">
                  White background (#FFFFFF) with blue accent
                </span>
                {theme === "light" && (
                  <div className="bg-primary absolute top-2 right-2 p-0.5 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>

              {/* Dark Mode Option */}
              <button
                type="button"
                onClick={() => handleThemeChange("dark")}
                className={`relative flex flex-col items-center justify-center rounded-none border p-4 text-left transition-all ${
                  theme === "dark"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-secondary/30 hover:bg-secondary/60 text-muted-foreground"
                }`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Moon className="h-5 w-5" />
                  <span className="text-xs font-bold">Dark Mode</span>
                </div>
                <span className="text-muted-foreground text-center text-[10px]">
                  Dark background (#1E1F24) with blue accent
                </span>
                {theme === "dark" && (
                  <div className="bg-primary absolute top-2 right-2 p-0.5 text-white">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
