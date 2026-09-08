"use client";

import { useEffect } from "react";
import { initGlobalTheme } from "@/lib/theme";

export function ThemeInitializer() {
  useEffect(() => {
    initGlobalTheme();
  }, []);

  return null;
}
