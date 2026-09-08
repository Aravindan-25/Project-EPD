export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  primaryHsl: string;
  darkBgHsl: string;
  darkCardHsl: string;
  darkBorderHsl: string;
  lightBgHsl: string;
  lightCardHsl: string;
  lightBorderHsl: string;
  previewGradient: string;
  badgeBg: string;
}

export const CUSTOM_THEMES: ThemeDefinition[] = [
  {
    id: "slate",
    name: "Midnight Slate",
    description: "Deep Slate Blue with Electric Cyan accents",
    primaryHsl: "226 71% 55%",
    darkBgHsl: "230 9% 13%",
    darkCardHsl: "230 9% 16%",
    darkBorderHsl: "230 9% 22%",
    lightBgHsl: "0 0% 100%",
    lightCardHsl: "0 0% 98%",
    lightBorderHsl: "231 6% 88%",
    previewGradient: "from-slate-900 via-slate-800 to-sky-950",
    badgeBg: "bg-blue-500",
  },
  {
    id: "violet",
    name: "Cyberpunk Violet",
    description: "Neon Purple with Fuchsia & Violet accents",
    primaryHsl: "262 83% 58%",
    darkBgHsl: "240 10% 6%",
    darkCardHsl: "240 10% 10%",
    darkBorderHsl: "240 10% 16%",
    lightBgHsl: "250 20% 98%",
    lightCardHsl: "0 0% 100%",
    lightBorderHsl: "250 15% 90%",
    previewGradient: "from-purple-950 via-indigo-950 to-slate-900",
    badgeBg: "bg-purple-500",
  },
  {
    id: "emerald",
    name: "Emerald Forest",
    description: "Rich Dark Emerald with Mint Green accents",
    primaryHsl: "158 64% 42%",
    darkBgHsl: "155 30% 5%",
    darkCardHsl: "155 25% 9%",
    darkBorderHsl: "155 20% 15%",
    lightBgHsl: "150 25% 98%",
    lightCardHsl: "0 0% 100%",
    lightBorderHsl: "150 20% 90%",
    previewGradient: "from-emerald-950 via-zinc-900 to-teal-950",
    badgeBg: "bg-emerald-500",
  },
  {
    id: "oceanic",
    name: "Oceanic Abyss",
    description: "Deep Navy Ocean with Sapphire & Teal accents",
    primaryHsl: "199 89% 48%",
    darkBgHsl: "210 30% 6%",
    darkCardHsl: "210 25% 10%",
    darkBorderHsl: "210 20% 16%",
    lightBgHsl: "210 30% 98%",
    lightCardHsl: "0 0% 100%",
    lightBorderHsl: "210 20% 90%",
    previewGradient: "from-cyan-950 via-blue-950 to-slate-900",
    badgeBg: "bg-sky-500",
  },
  {
    id: "amber",
    name: "Sunset Amber",
    description: "Warm Dark Charcoal with Gold & Amber accents",
    primaryHsl: "38 92% 50%",
    darkBgHsl: "25 25% 6%",
    darkCardHsl: "25 20% 10%",
    darkBorderHsl: "25 15% 16%",
    lightBgHsl: "35 30% 98%",
    lightCardHsl: "0 0% 100%",
    lightBorderHsl: "35 20% 90%",
    previewGradient: "from-amber-950 via-stone-900 to-orange-950",
    badgeBg: "bg-amber-500",
  },
];

export function applyCombinedTheme(
  colorThemeId: string,
  mode: "dark" | "light",
) {
  if (typeof window === "undefined") return;

  const root = document.documentElement;
  const themeObj =
    CUSTOM_THEMES.find((t) => t.id === colorThemeId) || CUSTOM_THEMES[0];

  // 1. Toggle dark class
  if (mode === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  // 2. Set Primary Color HSL on root variables
  root.style.setProperty("--primary", themeObj.primaryHsl);
  root.style.setProperty("--ring", themeObj.primaryHsl);
  root.style.setProperty("--accent", themeObj.primaryHsl);
  root.style.setProperty("--sidebar-primary", themeObj.primaryHsl);
  root.style.setProperty("--sidebar-ring", themeObj.primaryHsl);
  root.style.setProperty("--sidebar-accent-foreground", themeObj.primaryHsl);

  // 3. Set Background, Card, and Border variables depending on mode
  if (mode === "dark") {
    root.style.setProperty("--background", themeObj.darkBgHsl);
    root.style.setProperty("--card", themeObj.darkCardHsl);
    root.style.setProperty("--border", themeObj.darkBorderHsl);
    root.style.setProperty("--sidebar-background", themeObj.darkBgHsl);
  } else {
    root.style.setProperty("--background", themeObj.lightBgHsl);
    root.style.setProperty("--card", themeObj.lightCardHsl);
    root.style.setProperty("--border", themeObj.lightBorderHsl);
    root.style.setProperty("--sidebar-background", themeObj.lightCardHsl);
  }

  // Persist selections consistently
  localStorage.setItem("themeMode", mode);
  localStorage.setItem("themeColor", colorThemeId);
}

export function initGlobalTheme() {
  if (typeof window === "undefined") return;
  const savedColor = localStorage.getItem("themeColor") || "slate";
  const savedMode =
    (localStorage.getItem("themeMode") as "dark" | "light") || "dark";
  applyCombinedTheme(savedColor, savedMode);
}
