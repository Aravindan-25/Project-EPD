"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQueryState, parseAsString } from "nuqs";
import {
  ChevronLeft,
  Upload,
  Sun,
  Moon,
  Check,
  Building2,
  Sliders,
  Shield,
  Calendar,
  Users,
  FileText,
  HelpCircle,
  Briefcase,
  Layers,
  Camera,
  Plus,
  MapPin,
  Phone,
  Mail,
  Pencil,
  Trash2,
  Globe,
  Search,
  Star,
  Award,
  Tag,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  CUSTOM_THEMES,
  applyCombinedTheme,
  type ThemeDefinition,
} from "@/lib/theme";
import {
  useUserRole,
  NAV_MODULE_MAPPING,
  type RoleType,
} from "@/lib/user-role-context";

export { CUSTOM_THEMES, applyCombinedTheme, type ThemeDefinition };

export interface BranchItem {
  id: string;
  name: string;
  code: string;
  city: string;
  address: string;
  manager: string;
  members: number;
  phone: string;
  email: string;
  isPrimary: boolean;
}

const INITIAL_BRANCHES: BranchItem[] = [
  {
    id: "br-1",
    name: "Head Office - Bengaluru",
    code: "BLR-HQ",
    city: "Bengaluru, Karnataka",
    address: "Indiranagar 100ft Road, Bengaluru, KA - 560038",
    manager: "Elena Vance",
    members: 85,
    phone: "+91 80 4920 1100",
    email: "blr-hq@pockethr.io",
    isPrimary: true,
  },
  {
    id: "br-2",
    name: "Tech Hub - Hyderabad",
    code: "HYD-02",
    city: "Hyderabad, Telangana",
    address: "HITEC City, Phase 2, Hyderabad, TS - 500081",
    manager: "Aman Sharma",
    members: 42,
    phone: "+91 40 6811 2200",
    email: "hyd-tech@pockethr.io",
    isPrimary: false,
  },
  {
    id: "br-3",
    name: "US Operations - San Jose",
    code: "SJC-US",
    city: "San Jose, California",
    address: "Silicon Valley Blvd, San Jose, CA - 95110",
    manager: "Sarah Jenkins",
    members: 15,
    phone: "+1 408 555 0199",
    email: "us-ops@pockethr.io",
    isPrimary: false,
  },
];

export interface DepartmentItem {
  id: string;
  name: string;
  count: number;
  lead?: string;
  dotColor?: string;
}

export interface TeamItem {
  id: string;
  name: string;
  department: string;
  lead: string;
  members: number;
}

export interface DesignationItem {
  id: string;
  title: string;
  department: string;
  level: string;
  count: number;
}

const INITIAL_DEPARTMENTS: DepartmentItem[] = [
  { id: "dep-1", name: "New department", count: 4, dotColor: "bg-emerald-500" },
  {
    id: "dep-2",
    name: "TestDepartment t",
    count: 3,
    lead: "Amayara 1 Dastur",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-3",
    name: "Test Department",
    count: 3,
    lead: "Sahara Acharya",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-4",
    name: "New",
    count: 0,
    lead: "Sanjay Yadav",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-5",
    name: "menegr",
    count: 5,
    lead: "Gaurvi Sharmi",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-6",
    name: "Management",
    count: 3,
    lead: "Sahara Acharya",
    dotColor: "bg-rose-500",
  },
  {
    id: "dep-7",
    name: "Finance & Accounting",
    count: 4,
    lead: "Danish Katariya",
    dotColor: "bg-purple-500",
  },
  {
    id: "dep-8",
    name: "Legal & Compliance",
    count: 2,
    lead: "Testing443 User",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-9",
    name: "Customer Success/Support",
    count: 1,
    lead: "Shay Bonner",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-10",
    name: "Marketing & Communications",
    count: 2,
    lead: "Testing Sync In User User",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-11",
    name: "Human Resources (HR)",
    count: 0,
    lead: "Ram Syahm",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-12",
    name: "Sales & Business Development",
    count: 0,
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-13",
    name: "Data Science/Analytics",
    count: 0,
    lead: "Amayara 1 Dastur",
    dotColor: "bg-emerald-500",
  },
  {
    id: "dep-14",
    name: "Research & Development (R&D)",
    count: 0,
    lead: "Sunil Kumar",
    dotColor: "bg-emerald-500",
  },
];

const INITIAL_TEAMS: TeamItem[] = [
  {
    id: "tm-1",
    name: "Frontend Squad",
    department: "Engineering & Product",
    lead: "Sahara Acharya",
    members: 12,
  },
  {
    id: "tm-2",
    name: "Backend Core",
    department: "Engineering & Product",
    lead: "Elena Vance",
    members: 18,
  },
  {
    id: "tm-3",
    name: "Growth Marketing",
    department: "Marketing & Communications",
    lead: "Aman Sharma",
    members: 8,
  },
  {
    id: "tm-4",
    name: "Talent Ops",
    department: "Human Resources (HR)",
    lead: "Sarah Jenkins",
    members: 5,
  },
];

const INITIAL_DESIGNATIONS: DesignationItem[] = [
  {
    id: "des-1",
    title: "Magni minim voluptas",
    department: "Engineering & Product",
    level: "L1 - Entry",
    count: 1,
  },
  {
    id: "des-2",
    title: "HR",
    department: "Human Resources",
    level: "L2 - Mid",
    count: 6,
  },
  {
    id: "des-3",
    title: "CMO",
    department: "Marketing & Growth",
    level: "L5 - Director",
    count: 3,
  },
  {
    id: "des-4",
    title: "CTO",
    department: "Engineering & Product",
    level: "L5 - Director",
    count: 3,
  },
  {
    id: "des-5",
    title: "Admin2",
    department: "Finance & Operations",
    level: "L2 - Mid",
    count: 2,
  },
  {
    id: "des-6",
    title: "OnSite manager",
    department: "Finance & Operations",
    level: "L4 - Lead",
    count: 2,
  },
  {
    id: "des-7",
    title: "Sr. Developer",
    department: "Engineering & Product",
    level: "L3 - Senior",
    count: 8,
  },
  {
    id: "des-8",
    title: "Sr. Designer",
    department: "Engineering & Product",
    level: "L3 - Senior",
    count: 1,
  },
  {
    id: "des-9",
    title: "Sr. Full stack Developer",
    department: "Engineering & Product",
    level: "L3 - Senior",
    count: 4,
  },
  {
    id: "des-10",
    title: "Sr. Frontend Developer",
    department: "Engineering & Product",
    level: "L3 - Senior",
    count: 2,
  },
  {
    id: "des-11",
    title: "Inter Backend Developer",
    department: "Engineering & Product",
    level: "L1 - Entry",
    count: 1,
  },
  {
    id: "des-12",
    title: "Intern Frontend Developer",
    department: "Engineering & Product",
    level: "L1 - Entry",
    count: 2,
  },
  {
    id: "des-13",
    title: "Site Reliability Engineer (SRE)",
    department: "Engineering & Product",
    level: "L3 - Senior",
    count: 7,
  },
  {
    id: "des-14",
    title: "Technical Support Engineer",
    department: "Engineering & Product",
    level: "L2 - Mid",
    count: 0,
  },
];

export interface ModulePermission {
  id: string;
  name: string;
  accessScreen: boolean;
  viewData: boolean;
  editAdd: boolean;
  delete: boolean;
}

export interface EmployeeAccessControl {
  id: string;
  empId: string;
  name: string;
  role: string;
  department: string;
  designation: string;
  permissions: ModulePermission[];
}

const DEFAULT_MODULES: ModulePermission[] = [
  {
    id: "mod-1",
    name: "Dashboard",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-2",
    name: "My Task",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-3",
    name: "My Attendance",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: false,
  },
  {
    id: "mod-4",
    name: "My Leaves",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: false,
  },
  {
    id: "mod-5",
    name: "My Worklog",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-6",
    name: "My Assets",
    accessScreen: true,
    viewData: true,
    editAdd: false,
    delete: false,
  },
  {
    id: "mod-7",
    name: "Service Request",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: false,
  },
  {
    id: "mod-18",
    name: "Chatty",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-8",
    name: "Projects",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-9",
    name: "Sprints",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-10",
    name: "Attendance Management",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-11",
    name: "Employees Management",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-12",
    name: "Assets Management",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-13",
    name: "General",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-14",
    name: "Branches",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-15",
    name: "Department",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-16",
    name: "Designation",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
  {
    id: "mod-17",
    name: "Access control",
    accessScreen: true,
    viewData: true,
    editAdd: true,
    delete: true,
  },
];

const INITIAL_EMPLOYEES_ACCESS: EmployeeAccessControl[] = [
  {
    id: "emp-1",
    empId: "EMP-001",
    name: "Sarah Jenkins",
    role: "HR Manager",
    department: "Human Resources",
    designation: "Head of Human Resources",
    permissions: DEFAULT_MODULES.map((m) => {
      if (["Access control"].includes(m.name))
        return { ...m, accessScreen: false };
      return { ...m };
    }),
  },
  {
    id: "emp-2",
    empId: "EMP-002",
    name: "David Miller",
    role: "Project Manager",
    department: "Engineering",
    designation: "Senior Project Manager",
    permissions: DEFAULT_MODULES.map((m) => {
      if (
        ["Branches", "Department", "Designation", "Access control"].includes(
          m.name,
        )
      ) {
        return { ...m, accessScreen: false };
      }
      return { ...m };
    }),
  },
  {
    id: "emp-3",
    empId: "EMP-003",
    name: "Peer Mohamed Nafees J",
    role: "Employee",
    department: "Engineering",
    designation: "Software Engineer",
    permissions: DEFAULT_MODULES.map((m) => {
      if (
        [
          "General",
          "Branches",
          "Department",
          "Designation",
          "Access control",
        ].includes(m.name)
      ) {
        return { ...m, accessScreen: false };
      }
      return { ...m };
    }),
  },
];

export function WorkspaceSettingsView() {
  const router = useRouter();
  const [userCode] = useQueryState("user", parseAsString.withDefault("ADMIN"));
  const { role, updateRoleNavItems } = useUserRole();
  const [activeTab, setActiveTab] = useState(() =>
    role === "EMPLOYEE" ? "Profile" : "General",
  );

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      const target =
        userCode && userCode !== "ADMIN" ? `/?user=${userCode}` : "/";
      router.push(target);
    }
  };

  // Branches State
  const [branches, setBranches] = useState<BranchItem[]>(INITIAL_BRANCHES);
  const [branchSearch, setBranchSearch] = useState("");
  const [showAddBranch, setShowAddBranch] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchCode, setNewBranchCode] = useState("");
  const [newBranchCity, setNewBranchCity] = useState("");
  const [newBranchAddress, setNewBranchAddress] = useState("");
  const [newBranchManager, setNewBranchManager] = useState("");
  const [newBranchPhone, setNewBranchPhone] = useState("");
  const [newBranchEmail, setNewBranchEmail] = useState("");

  // Department State
  const [departments, setDepartments] =
    useState<DepartmentItem[]>(INITIAL_DEPARTMENTS);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [showAddDepartment, setShowAddDepartment] = useState(false);
  const [newDepName, setNewDepName] = useState("");

  // Designation State
  const [designations, setDesignations] =
    useState<DesignationItem[]>(INITIAL_DESIGNATIONS);
  const [designationSearch, setDesignationSearch] = useState("");
  const [showAddDesignation, setShowAddDesignation] = useState(false);
  const [newDesTitle, setNewDesTitle] = useState("");
  const [newDesDepartment, setNewDesDepartment] = useState(
    "Engineering & Product",
  );
  const [newDesLevel, setNewDesLevel] = useState("L2 - Mid");

  // Access Control State
  const [employeeAccessList, setEmployeeAccessList] = useState<
    EmployeeAccessControl[]
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const storedList = localStorage.getItem("employeeAccessList");
        if (storedList) {
          const parsed: EmployeeAccessControl[] = JSON.parse(storedList);
          return parsed.map((emp) => {
            const perms = [...emp.permissions].filter(
              (p) => p.name !== "Settings",
            );
            const newRows: ModulePermission[] = [
              {
                id: "mod-13",
                name: "General",
                accessScreen: true,
                viewData: true,
                editAdd: true,
                delete: true,
              },
              {
                id: "mod-14",
                name: "Branches",
                accessScreen: true,
                viewData: true,
                editAdd: true,
                delete: true,
              },
              {
                id: "mod-15",
                name: "Department",
                accessScreen: true,
                viewData: true,
                editAdd: true,
                delete: true,
              },
              {
                id: "mod-16",
                name: "Designation",
                accessScreen: true,
                viewData: true,
                editAdd: true,
                delete: true,
              },
              {
                id: "mod-17",
                name: "Access control",
                accessScreen: true,
                viewData: true,
                editAdd: true,
                delete: true,
              },
            ];
            newRows.forEach((nr) => {
              if (!perms.some((p) => p.name === nr.name)) {
                perms.push(nr);
              }
            });
            return { ...emp, permissions: perms };
          });
        }
      } catch (e) {
        console.error("Failed to load employeeAccessList from localStorage", e);
      }
    }
    return INITIAL_EMPLOYEES_ACCESS;
  });
  const [searchEmpIdInput, setSearchEmpIdInput] = useState<string>("EMP-001");

  // Form State matching screenshot
  const [workspaceName, setWorkspaceName] = useState("AAA Techno Pvt Ltd");
  const [workspaceUrl, setWorkspaceUrl] = useState(
    "https://aaatechnopark.com ",
  );
  const [identifier, setIdentifier] = useState("AAA-");
  const [workingHours, setWorkingHours] = useState("10");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  // Profile Tab State
  const [profileName, setProfileName] = useState("Sahara Acharya");
  const [profileEmail, setProfileEmail] = useState("aman@ailoitte.com");
  const [profilePhone, setProfilePhone] = useState("+91 98765 43210");
  const [profileTitle, setProfileTitle] = useState("Intern Frontend Developer");
  const [profileDepartment, setProfileDepartment] = useState("Engineering");
  const [profileAvatar, setProfileAvatar] = useState<string | null>(
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
  );

  // Password Reset State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Working days checkboxes matching screenshot
  const [workingDays, setWorkingDays] = useState<{ [key: string]: boolean }>({
    Mon: true,
    Tue: true,
    Wed: true,
    Thu: true,
    Fri: true,
    Sat: false,
    Sun: false,
  });

  // Combined Theme State (5 Color Themes + Light/Dark Mode)
  const [selectedColorTheme, setSelectedColorTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("themeColor") || "violet";
    }
    return "violet";
  });

  const [themeMode, setThemeMode] = useState<"light" | "dark">(
    (): "light" | "dark" => {
      if (typeof window !== "undefined") {
        const savedMode = localStorage.getItem("themeMode");
        if (savedMode === "light" || savedMode === "dark") return savedMode;
        return document.documentElement.classList.contains("dark")
          ? "dark"
          : "light";
      }
      return "dark";
    },
  );

  React.useEffect(() => {
    applyCombinedTheme(selectedColorTheme, themeMode);
  }, []);

  const handleCombinedThemeChange = (
    colorId: string,
    mode: "light" | "dark",
  ) => {
    setSelectedColorTheme(colorId);
    setThemeMode(mode);
    applyCombinedTheme(colorId, mode);
    const themeObj = CUSTOM_THEMES.find((t) => t.id === colorId);
    handleSaveNotification(
      `Applied ${themeObj?.name || colorId} in ${mode === "dark" ? "Dark" : "Light"} mode.`,
    );
  };

  const handleDayToggle = (day: string) => {
    setWorkingDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleSaveNotification = (msg: string) => {
    toast.success(msg);
  };

  const workspaceNavItems = [
    "General",
    "Branches",
    "Department",
    "Designation",
    "Access control",
  ];

  const accountNavItems = ["Profile", "Theme Preferences"];

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-1 items-start">
      {/* LEFT SUB-SIDEBAR NAVIGATION (FIXED ON SCROLL) */}
      <div className="border-border/80 bg-card/30 sticky top-0 flex h-screen w-64 shrink-0 flex-col overflow-y-auto border-r px-3 py-4 select-none">
        {/* Top Back Link matching screenshot: < Settings */}
        <button
          type="button"
          onClick={handleBack}
          className="text-muted-foreground hover:text-foreground mb-4 flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Settings</span>
        </button>

        {(() => {
          const permittedWorkspaceItems = workspaceNavItems.filter((item) => {
            if (role === "ADMIN") return true;
            const empRecord = employeeAccessList.find((e) => {
              if (role === "HR") return e.empId === "EMP-001";
              if (role === "PM") return e.empId === "EMP-002";
              return e.empId === "EMP-003";
            });
            if (!empRecord) return false;
            const perm = empRecord.permissions.find((p) => p.name === item);
            return perm ? perm.accessScreen : false;
          });

          // Fallback activeTab if current tab is not permitted
          if (
            workspaceNavItems.includes(activeTab) &&
            !permittedWorkspaceItems.includes(activeTab)
          ) {
            const fallback = permittedWorkspaceItems[0] || "Profile";
            setTimeout(() => setActiveTab(fallback), 0);
          }

          return (
            <div className="flex flex-col gap-6 overflow-y-auto pr-1">
              {/* SECTION 1: WORKSPACE (Only rendered if user has access to at least 1 workspace settings screen) */}
              {permittedWorkspaceItems.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground mb-1 px-2 text-[11px] font-bold tracking-wider uppercase">
                    Workspace
                  </span>
                  {permittedWorkspaceItems.map((item) => {
                    const isActive = activeTab === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setActiveTab(item)}
                        className={`cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                          isActive
                            ? "bg-secondary text-foreground font-bold shadow-2xs"
                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SECTION 2: MY ACCOUNT */}
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground mb-1 px-2 text-[11px] font-bold tracking-wider uppercase">
                  My Account
                </span>
                {accountNavItems.map((item) => {
                  const isActive = activeTab === item;
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setActiveTab(item)}
                      className={`cursor-pointer rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-secondary text-foreground font-bold shadow-2xs"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>

      {/* MAIN RIGHT CONTENT AREA (FULL WIDTH) */}
      <div className="w-full flex-1 overflow-y-auto p-8">
        {savedSuccess && (
          <div className="animate-in fade-in mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-500">
            <Check className="h-4 w-4" />
            <span>{savedSuccess}</span>
          </div>
        )}

        {/* GENERAL TAB CONTENT (MATCHING SCREENSHOT) */}
        {activeTab === "General" && (
          <div className="flex flex-col gap-8">
            {/* Header */}
            <div className="border-border/80 flex flex-col gap-1 border-b pb-4">
              <h1 className="text-foreground text-xl font-bold">General</h1>
              <p className="text-muted-foreground text-xs">
                Manage your workspace settings
              </p>
            </div>

            {/* Logo Section */}
            <div className="border-border/80 flex flex-col gap-4 border-b pb-6">
              <h2 className="text-foreground text-sm font-bold">Logo</h2>

              <div className="flex items-center gap-4">
                {/* Single Logo Upload & Preview Container */}
                <label className="border-border/80 bg-card hover:border-primary/60 group relative flex h-20 w-24 cursor-pointer items-center justify-center overflow-hidden rounded-xl border p-2 shadow-sm transition-all">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Workspace Logo"
                      className="h-full w-full rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-primary flex items-center gap-1.5 text-sm font-extrabold tracking-tight">
                      <span className="text-primary/80 font-serif text-base italic">
                        a
                      </span>
                      <span>iloitte</span>
                    </div>
                  )}

                  {/* Hover Change Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100">
                    <Upload className="text-primary-foreground h-4 w-4" />
                    <span className="text-[9px] font-bold">Change</span>
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          if (evt.target?.result) {
                            setLogoPreview(evt.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>

              <span className="text-muted-foreground text-[11px]">
                Pick a logo for your workspace, recommended is 256 px * 256 px
              </span>
            </div>

            {/* Basic Details Section */}
            <div className="border-border/80 flex flex-col gap-4 border-b pb-6">
              <h2 className="text-foreground text-sm font-bold">
                Basic Details
              </h2>

              <div className="flex max-w-2xl flex-col gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground text-xs font-semibold">
                    Workspace name
                  </label>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                    className="bg-card border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground text-xs font-semibold">
                    Workspace URL
                  </label>
                  <input
                    type="text"
                    value={workspaceUrl}
                    onChange={(e) => setWorkspaceUrl(e.target.value)}
                    className="bg-card border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={() =>
                      handleSaveNotification(
                        "Basic details updated successfully.",
                      )
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-lg px-5 text-xs font-bold shadow-sm transition-colors"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>

            {/* Identifier Section */}
            <div className="border-border/80 flex flex-col gap-4 border-b pb-6">
              <div>
                <h2 className="text-foreground text-sm font-bold">
                  Identifier
                </h2>
                <p className="text-muted-foreground text-[11px]">
                  Identifier - used in people id&apos;s
                </p>
              </div>

              <div className="flex max-w-2xl flex-col gap-3">
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="bg-card border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                />

                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={() =>
                      handleSaveNotification("Identifier updated successfully.")
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-lg px-5 text-xs font-bold shadow-sm transition-colors"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>

            {/* Working Schedule Section */}
            <div className="border-border/80 flex flex-col gap-4 border-b pb-6">
              <div>
                <h2 className="text-foreground text-sm font-bold">
                  Working schedule
                </h2>
                <span className="text-muted-foreground mt-1 block text-xs font-semibold">
                  Working days
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <label
                      key={day}
                      className="flex cursor-pointer items-center gap-2 select-none"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(workingDays[day])}
                        onChange={() => handleDayToggle(day)}
                        className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded"
                      />
                      <span
                        className={
                          workingDays[day]
                            ? "text-foreground font-medium"
                            : "text-muted-foreground"
                        }
                      >
                        {day}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* Working Hours Section */}
            <div className="border-border/80 flex flex-col gap-4 border-b pb-6">
              <h2 className="text-foreground text-sm font-bold">
                Working hours
              </h2>

              <div className="flex max-w-2xl flex-col gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={workingHours}
                    onChange={(e) => setWorkingHours(e.target.value)}
                    className="bg-card border-border/80 text-foreground focus:border-primary w-28 rounded-lg border px-3 py-2 text-xs outline-none"
                  />
                  <span className="text-foreground text-xs font-semibold">
                    Hours
                  </span>
                </div>

                <div className="pt-1">
                  <Button
                    type="button"
                    onClick={() =>
                      handleSaveNotification(
                        "Working hours updated successfully.",
                      )
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-lg px-5 text-xs font-bold shadow-sm transition-colors"
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>

            {/* Delete Workspace Section */}
            <div className="flex flex-col gap-3">
              <div>
                <h2 className="text-foreground text-sm font-bold">
                  Delete workspace
                </h2>
                <p className="text-muted-foreground mt-1 text-xs">
                  All the data will be deleted in 30 days upon successful
                  deletion request
                </p>
              </div>

              <div className="pt-1">
                <Button
                  type="button"
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.confirm(
                        "Are you sure you want to request workspace deletion?",
                      )
                    ) {
                      handleSaveNotification(
                        "Workspace deletion request submitted.",
                      );
                    }
                  }}
                  className="h-9 cursor-pointer rounded-lg bg-[#E55353] px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-rose-600"
                >
                  Delete Workspace
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* THEME PREFERENCES TAB (5 COLOR THEMES + DARK/LIGHT MODE OPTIONS) */}
        {activeTab === "Theme Preferences" && (
          <div className="flex w-full max-w-4xl flex-col gap-8">
            <div className="border-border/80 flex flex-col gap-1 border-b pb-4">
              <h1 className="text-foreground text-xl font-bold">
                Theme Preferences
              </h1>
              <p className="text-muted-foreground text-xs">
                Customize your website appearance mode and select from 5
                distinct color themes.
              </p>
            </div>

            {/* OPTION 1: APPEARANCE MODE (LIGHT / DARK) */}
            <div className="flex flex-col gap-3">
              <h2 className="text-foreground text-sm font-bold">
                1. Appearance Mode
              </h2>
              <div className="grid max-w-md grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() =>
                    handleCombinedThemeChange(selectedColorTheme, "light")
                  }
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-left transition-all ${
                    themeMode === "light"
                      ? "border-primary bg-primary/10 text-primary ring-primary/30 font-bold shadow-xs ring-2"
                      : "border-border/80 bg-card hover:bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Sun className="h-5 w-5" />
                    <span className="text-xs font-bold">Light Mode</span>
                  </div>
                  <span className="text-muted-foreground text-center text-[10px]">
                    Clean light layout with custom theme accent
                  </span>
                  {themeMode === "light" && (
                    <div className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleCombinedThemeChange(selectedColorTheme, "dark")
                  }
                  className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 text-left transition-all ${
                    themeMode === "dark"
                      ? "border-primary bg-primary/10 text-primary ring-primary/30 font-bold shadow-xs ring-2"
                      : "border-border/80 bg-card hover:bg-secondary/60 text-muted-foreground"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Moon className="h-5 w-5" />
                    <span className="text-xs font-bold">Dark Mode</span>
                  </div>
                  <span className="text-muted-foreground text-center text-[10px]">
                    Deep dark layout with custom theme accent
                  </span>
                  {themeMode === "dark" && (
                    <div className="bg-primary text-primary-foreground absolute top-2.5 right-2.5 rounded-full p-0.5">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* OPTION 2: 5 DISTINCT COLOR THEMES */}
            <div className="flex flex-col gap-3">
              <h2 className="text-foreground text-sm font-bold">
                2. Select Color Theme (5 Options)
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {CUSTOM_THEMES.map((themeItem) => {
                  const isSelected = selectedColorTheme === themeItem.id;
                  return (
                    <button
                      key={themeItem.id}
                      type="button"
                      onClick={() =>
                        handleCombinedThemeChange(themeItem.id, themeMode)
                      }
                      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border p-4 text-left shadow-xs transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 ring-primary/40 font-bold ring-2"
                          : "border-border/80 bg-card hover:bg-secondary/60"
                      }`}
                    >
                      {/* Color Swatch Preview Header */}
                      <div
                        className={`h-20 w-full rounded-xl bg-gradient-to-br ${themeItem.previewGradient} mb-3 flex items-end justify-between border border-white/10 p-3 shadow-inner`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`h-4 w-4 rounded-full ${themeItem.badgeBg} border border-white/30 shadow-md`}
                          />
                          <span className="text-[11px] font-bold tracking-wide text-white drop-shadow-sm">
                            {themeItem.name}
                          </span>
                        </div>
                        {isSelected && (
                          <div className="bg-primary text-primary-foreground rounded-full p-1 shadow-md">
                            <Check className="h-3.5 w-3.5" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-foreground mb-1 text-xs font-bold">
                        {themeItem.name}
                      </h3>
                      <p className="text-muted-foreground text-[11px] leading-relaxed">
                        {themeItem.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB CONTENT (CUSTOM MODERN UI LAYOUT - FULL WIDTH) */}
        {activeTab === "Profile" && (
          <div className="flex w-full flex-col gap-8">
            {/* Page Header */}
            <div className="border-border/80 flex flex-col gap-1 border-b pb-4">
              <h1 className="text-foreground text-xl font-bold">Profile</h1>
              <p className="text-muted-foreground text-xs">
                Manage your personal details and security preferences
              </p>
            </div>

            {/* Hero Profile Banner Header Card */}
            <div className="border-border/80 bg-card relative overflow-hidden rounded-2xl border shadow-xs">
              {/* Decorative Header Banner */}
              <div className="to-primary/40 relative h-28 w-full bg-gradient-to-r from-indigo-900/60 via-purple-900/50" />

              <div className="-mt-12 flex flex-col items-start justify-between gap-4 p-6 pt-0 md:flex-row md:items-end">
                <div className="flex items-end gap-4">
                  {/* Avatar with Camera Upload Badge */}
                  <div className="group relative">
                    <div className="border-card bg-secondary/80 h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 shadow-md">
                      {profileAvatar ? (
                        <img
                          src={profileAvatar}
                          alt="Profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="text-primary bg-primary/10 flex h-full w-full items-center justify-center text-xl font-bold">
                          {profileName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                      )}
                    </div>

                    <label
                      className="bg-primary text-primary-foreground hover:bg-primary/90 absolute right-1 bottom-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg shadow-md transition-colors"
                      title="Change Avatar"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              if (evt.target?.result) {
                                setProfileAvatar(evt.target.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col gap-0.5 pb-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-foreground text-lg font-bold">
                        {profileName}
                      </h2>
                      <span className="flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />{" "}
                        Active
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs font-medium">
                      {profileTitle} • {profileDepartment}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={() =>
                      handleSaveNotification(
                        "Profile details saved successfully.",
                      )
                    }
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-lg px-5 text-xs font-bold shadow-sm transition-colors"
                  >
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>

            {/* Section 1: Basic Details Card */}
            <div className="border-border/80 bg-card flex flex-col gap-5 rounded-2xl border p-6 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-foreground text-sm font-bold">
                    Basic Details
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Update your personal information and email address
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 pr-8 text-xs transition-colors outline-none"
                    />
                    <Check className="absolute top-2.5 right-2.5 h-3.5 w-3.5 text-emerald-500" />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={profileTitle}
                    onChange={(e) => setProfileTitle(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Reset Password Card */}
            <div className="border-border/80 bg-card flex flex-col gap-5 rounded-2xl border p-6 shadow-xs">
              <div className="border-border/60 flex items-center justify-between border-b pb-3">
                <div>
                  <h2 className="text-foreground text-sm font-bold">
                    Reset Password
                  </h2>
                  <p className="text-muted-foreground text-xs">
                    Manage your login security and authentication
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-primary cursor-pointer text-xs font-semibold hover:underline"
                >
                  {showPassword ? "Hide Passwords" : "Show Passwords"}
                </button>
              </div>

              <div className="flex max-w-2xl flex-col gap-4 text-xs">
                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Current Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-muted-foreground font-semibold">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>

                <div className="pt-2">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!currentPassword || !newPassword) {
                        alert("Please fill in password fields.");
                        return;
                      }
                      if (newPassword !== confirmPassword) {
                        alert("New passwords do not match.");
                        return;
                      }
                      handleSaveNotification("Password updated successfully.");
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                    }}
                    className="h-9 cursor-pointer rounded-lg bg-indigo-600 px-5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-500"
                  >
                    Update my password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BRANCHES TAB CONTENT */}
        {activeTab === "Branches" && (
          <div className="flex w-full flex-col gap-6">
            {/* Page Header */}
            <div className="border-border/80 flex flex-col justify-between gap-4 border-b pb-4 sm:flex-row sm:items-center">
              <div>
                <h1 className="text-foreground text-xl font-bold">Branches</h1>
                <p className="text-muted-foreground text-xs">
                  Manage your company offices, regional hubs, and location
                  details
                </p>
              </div>

              <Button
                type="button"
                onClick={() => setShowAddBranch(!showAddBranch)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 cursor-pointer items-center gap-1.5 self-start rounded-lg px-4 text-xs font-bold shadow-sm sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{showAddBranch ? "Cancel" : "Add Branch"}</span>
              </Button>
            </div>

            {/* Inline Add Branch Form Card */}
            {showAddBranch && (
              <div className="border-primary/40 bg-card animate-in fade-in slide-in-from-top-2 flex flex-col gap-4 rounded-2xl border p-6 shadow-sm duration-200">
                <div className="border-border/60 flex items-center justify-between border-b pb-2">
                  <h2 className="text-foreground flex items-center gap-2 text-sm font-bold">
                    <Building2 className="text-primary h-4 w-4" />
                    <span>Create New Branch</span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs md:grid-cols-2 lg:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      Branch Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. West Coast Office"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      Branch Code / ID *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. WCO-04"
                      value={newBranchCode}
                      onChange={(e) => setNewBranchCode(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      City & State *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      value={newBranchCity}
                      onChange={(e) => setNewBranchCity(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      Branch Manager
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Morgan"
                      value={newBranchManager}
                      onChange={(e) => setNewBranchManager(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      Contact Phone
                    </label>
                    <input
                      type="text"
                      placeholder="+1 415 555 0122"
                      value={newBranchPhone}
                      onChange={(e) => setNewBranchPhone(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-muted-foreground font-semibold">
                      Contact Email
                    </label>
                    <input
                      type="email"
                      placeholder="sf-office@company.com"
                      value={newBranchEmail}
                      onChange={(e) => setNewBranchEmail(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2 lg:col-span-3">
                    <label className="text-muted-foreground font-semibold">
                      Full Address
                    </label>
                    <input
                      type="text"
                      placeholder="Street address, building, postal code"
                      value={newBranchAddress}
                      onChange={(e) => setNewBranchAddress(e.target.value)}
                      className="bg-background border-border/80 text-foreground focus:border-primary rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    onClick={() => setShowAddBranch(false)}
                    variant="outline"
                    className="h-8 cursor-pointer px-4 text-xs"
                  >
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    onClick={() => {
                      if (!newBranchName || !newBranchCode || !newBranchCity) {
                        alert("Please fill in Branch Name, Code, and City.");
                        return;
                      }
                      const newBr: BranchItem = {
                        id: `br-${Date.now()}`,
                        name: newBranchName,
                        code: newBranchCode,
                        city: newBranchCity,
                        address: newBranchAddress || newBranchCity,
                        manager: newBranchManager || "Unassigned",
                        members: 0,
                        phone: newBranchPhone || "N/A",
                        email: newBranchEmail || "n/a@pockethr.io",
                        isPrimary: branches.length === 0,
                      };
                      setBranches([...branches, newBr]);
                      setShowAddBranch(false);
                      setNewBranchName("");
                      setNewBranchCode("");
                      setNewBranchCity("");
                      setNewBranchAddress("");
                      setNewBranchManager("");
                      setNewBranchPhone("");
                      setNewBranchEmail("");
                      handleSaveNotification(
                        `Branch '${newBr.name}' created successfully.`,
                      );
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer rounded-lg px-5 text-xs font-bold"
                  >
                    Save Branch
                  </Button>
                </div>
              </div>
            )}

            {/* Search & Statistics Bar */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="relative w-full sm:w-72">
                <Search className="text-muted-foreground absolute top-2.5 left-3 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search branches by name, city..."
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  className="bg-card border-border/80 text-foreground focus:border-primary w-full rounded-xl border py-2 pr-3 pl-9 text-xs transition-colors outline-none"
                />
              </div>

              <div className="text-muted-foreground flex items-center gap-3 text-xs font-semibold">
                <span className="bg-card border-border/80 flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
                  <Building2 className="text-primary h-3.5 w-3.5" />
                  <span>{branches.length} Total Branches</span>
                </span>
                <span className="bg-card border-border/80 flex items-center gap-1.5 rounded-lg border px-3 py-1.5">
                  <Users className="h-3.5 w-3.5 text-indigo-400" />
                  <span>
                    {branches.reduce((acc, b) => acc + b.members, 0)} Total
                    Staff
                  </span>
                </span>
              </div>
            </div>

            {/* Branches Grid Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {branches
                .filter(
                  (b) =>
                    b.name.toLowerCase().includes(branchSearch.toLowerCase()) ||
                    b.city.toLowerCase().includes(branchSearch.toLowerCase()) ||
                    b.code.toLowerCase().includes(branchSearch.toLowerCase()),
                )
                .map((branch) => (
                  <div
                    key={branch.id}
                    className={`bg-card relative flex flex-col justify-between gap-4 overflow-hidden rounded-2xl border p-5 shadow-xs transition-all ${
                      branch.isPrimary
                        ? "border-primary ring-primary/30 ring-1"
                        : "border-border/80 hover:border-border"
                    }`}
                  >
                    {/* Primary HQ Ribbon / Badge */}
                    {branch.isPrimary && (
                      <div className="bg-primary text-primary-foreground absolute top-0 right-0 flex items-center gap-1 rounded-bl-xl px-3 py-1 text-[10px] font-bold">
                        <Star className="h-3 w-3 fill-current" /> Primary HQ
                      </div>
                    )}

                    <div className="flex flex-col gap-3 pt-1">
                      <div className="flex items-start justify-between gap-2 pr-16">
                        <div>
                          <span className="text-muted-foreground bg-secondary mb-1 inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                            {branch.code}
                          </span>
                          <h3 className="text-foreground text-sm font-bold">
                            {branch.name}
                          </h3>
                        </div>
                      </div>

                      <div className="text-muted-foreground flex flex-col gap-2 pt-1 text-xs">
                        <div className="flex items-center gap-2">
                          <MapPin className="text-primary h-3.5 w-3.5 shrink-0" />
                          <span className="truncate">{branch.address}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                          <span>
                            Manager:{" "}
                            <strong className="text-foreground">
                              {branch.manager}
                            </strong>{" "}
                            ({branch.members} members)
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          <span>{branch.phone}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                          <span className="truncate">{branch.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions Footer */}
                    <div className="border-border/60 flex items-center justify-between border-t pt-3 text-xs">
                      {!branch.isPrimary ? (
                        <button
                          type="button"
                          onClick={() => {
                            setBranches(
                              branches.map((b) => ({
                                ...b,
                                isPrimary: b.id === branch.id,
                              })),
                            );
                            handleSaveNotification(
                              `Set '${branch.name}' as primary headquarters.`,
                            );
                          }}
                          className="text-muted-foreground hover:text-primary cursor-pointer text-[11px] font-semibold transition-colors"
                        >
                          Set as Primary
                        </button>
                      ) : (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-500">
                          <Check className="h-3 w-3" /> Main Office
                        </span>
                      )}

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const updatedName = prompt(
                              "Edit Branch Name:",
                              branch.name,
                            );
                            if (updatedName) {
                              setBranches(
                                branches.map((b) =>
                                  b.id === branch.id
                                    ? { ...b, name: updatedName }
                                    : b,
                                ),
                              );
                              handleSaveNotification(`Branch updated.`);
                            }
                          }}
                          className="hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer rounded-lg p-1.5 transition-colors"
                          title="Edit Branch"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Delete branch '${branch.name}'?`)) {
                              setBranches(
                                branches.filter((b) => b.id !== branch.id),
                              );
                              handleSaveNotification(
                                `Branch '${branch.name}' deleted.`,
                              );
                            }
                          }}
                          className="text-muted-foreground cursor-pointer rounded-lg p-1.5 transition-colors hover:bg-rose-500/10 hover:text-rose-500"
                          title="Delete Branch"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* DEPARTMENT TAB CONTENT */}
        {activeTab === "Department" && (
          <div className="flex w-full flex-col gap-6">
            {/* Top Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-xl font-bold">Department</h1>
              <p className="text-muted-foreground text-xs">
                Manage your workspace Department
              </p>
            </div>

            {/* Action Bar: Search on Left + New Department Button on Right */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={departmentSearch}
                    onChange={(e) => setDepartmentSearch(e.target.value)}
                    className="bg-card border-border/80 text-foreground focus:border-primary placeholder:text-muted-foreground/60 w-full rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="bg-secondary border-border/80 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border p-2 transition-colors"
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <Button
                type="button"
                onClick={() => setShowAddDepartment(!showAddDepartment)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 cursor-pointer items-center gap-1.5 self-end rounded-lg px-4 text-xs font-semibold shadow-sm sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{showAddDepartment ? "Cancel" : "New Department"}</span>
              </Button>
            </div>

            {/* Single Line Inline Creation Form for New Department */}
            {showAddDepartment && (
              <div className="border-primary/40 bg-card animate-in fade-in slide-in-from-top-2 flex flex-col items-stretch justify-between gap-3 rounded-xl border p-3.5 shadow-sm duration-200 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-foreground shrink-0 text-xs font-bold">
                    New Department:
                  </span>
                  <input
                    type="text"
                    placeholder="Enter department name..."
                    value={newDepName}
                    onChange={(e) => setNewDepName(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary max-w-md flex-1 rounded-lg border px-3 py-2 text-xs outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!newDepName.trim()) {
                        toast.error("Please enter a department name.");
                        return;
                      }
                      const newDep: DepartmentItem = {
                        id: `dep-${Date.now()}`,
                        name: newDepName.trim(),
                        count: 0,
                        dotColor: "bg-emerald-500",
                      };
                      setDepartments([...departments, newDep]);
                      setShowAddDepartment(false);
                      setNewDepName("");
                      handleSaveNotification(
                        `Department '${newDep.name}' created.`,
                      );
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-bold"
                  >
                    Save Department
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowAddDepartment(false)}
                    variant="outline"
                    className="h-8 shrink-0 cursor-pointer px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* DEPARTMENT ROWS LIST */}
            <div className="flex flex-col gap-2.5">
              {departments
                .filter((dep) =>
                  dep.name
                    .toLowerCase()
                    .includes(departmentSearch.toLowerCase()),
                )
                .map((dep, idx) => (
                  <div
                    key={dep.id}
                    className="border-border/60 bg-card hover:bg-secondary/40 group flex items-center justify-between rounded-xl border p-3.5 shadow-2xs transition-colors"
                  >
                    {/* Left: Number + Green/Color Dot + Title + (Count People) */}
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6 text-right text-xs font-semibold">
                        {idx + 1}.
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${dep.dotColor || "bg-emerald-500"} shrink-0`}
                      />
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                        <span>{dep.name}</span>
                        <span className="text-muted-foreground font-normal">
                          ({dep.count} People)
                        </span>
                      </div>
                    </div>

                    {/* Right Actions: Edit and Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedName = prompt(
                            "Edit Department Name:",
                            dep.name,
                          );
                          if (updatedName) {
                            setDepartments(
                              departments.map((d) =>
                                d.id === dep.id
                                  ? { ...d, name: updatedName }
                                  : d,
                              ),
                            );
                            handleSaveNotification("Department updated.");
                          }
                        }}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                        title="Edit Department"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete department '${dep.name}'?`)) {
                            setDepartments(
                              departments.filter((d) => d.id !== dep.id),
                            );
                            handleSaveNotification(
                              `Department '${dep.name}' deleted.`,
                            );
                          }
                        }}
                        className="text-muted-foreground cursor-pointer p-1 transition-colors hover:text-rose-500"
                        title="Delete Department"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* DESIGNATION TAB CONTENT */}
        {activeTab === "Designation" && (
          <div className="flex w-full flex-col gap-6">
            {/* Top Title & Subtitle */}
            <div className="flex flex-col gap-1">
              <h1 className="text-foreground text-xl font-bold">Designation</h1>
              <p className="text-muted-foreground text-xs">
                Manage your workspace Designation
              </p>
            </div>

            {/* Action Bar: Search on Left + New Designation Button on Right */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex w-full items-center gap-2 sm:w-auto">
                <div className="relative flex-1 sm:w-80">
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={designationSearch}
                    onChange={(e) => setDesignationSearch(e.target.value)}
                    className="bg-card border-border/80 text-foreground focus:border-primary placeholder:text-muted-foreground/60 w-full rounded-lg border px-3 py-2 text-xs transition-colors outline-none"
                  />
                </div>
                <button
                  type="button"
                  className="bg-secondary border-border/80 text-muted-foreground hover:text-foreground cursor-pointer rounded-lg border p-2 transition-colors"
                  title="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>

              <Button
                type="button"
                onClick={() => setShowAddDesignation(!showAddDesignation)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-9 cursor-pointer items-center gap-1.5 self-end rounded-lg px-4 text-xs font-semibold shadow-sm sm:self-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{showAddDesignation ? "Cancel" : "New Designation"}</span>
              </Button>
            </div>

            {/* Single Line Inline Creation Form */}
            {showAddDesignation && (
              <div className="border-primary/40 bg-card animate-in fade-in slide-in-from-top-2 flex flex-col items-stretch justify-between gap-3 rounded-xl border p-3.5 shadow-sm duration-200 sm:flex-row sm:items-center">
                <div className="flex flex-1 items-center gap-3">
                  <span className="text-foreground shrink-0 text-xs font-bold">
                    New Designation:
                  </span>
                  <input
                    type="text"
                    placeholder="Enter designation name..."
                    value={newDesTitle}
                    onChange={(e) => setNewDesTitle(e.target.value)}
                    className="bg-background border-border/80 text-foreground focus:border-primary max-w-md flex-1 rounded-lg border px-3 py-2 text-xs outline-none"
                    autoFocus
                  />
                </div>

                <div className="flex shrink-0 items-center justify-end gap-2">
                  <Button
                    type="button"
                    onClick={() => {
                      if (!newDesTitle.trim()) {
                        toast.error("Please enter a designation name.");
                        return;
                      }
                      const newDes: DesignationItem = {
                        id: `des-${Date.now()}`,
                        title: newDesTitle.trim(),
                        department: "General",
                        level: "L1",
                        count: 0,
                      };
                      setDesignations([...designations, newDes]);
                      setShowAddDesignation(false);
                      setNewDesTitle("");
                      handleSaveNotification(
                        `Designation '${newDes.title}' created.`,
                      );
                    }}
                    className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 cursor-pointer rounded-lg px-4 text-xs font-bold"
                  >
                    Save Designation
                  </Button>

                  <Button
                    type="button"
                    onClick={() => setShowAddDesignation(false)}
                    variant="outline"
                    className="h-8 shrink-0 cursor-pointer px-3 text-xs"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* DESIGNATION ROWS LIST (MATCHING USER SCREENSHOT) */}
            <div className="flex flex-col gap-2.5">
              {designations
                .filter((des) =>
                  des.title
                    .toLowerCase()
                    .includes(designationSearch.toLowerCase()),
                )
                .map((des, idx) => (
                  <div
                    key={des.id}
                    className="border-border/60 bg-card hover:bg-secondary/40 group flex items-center justify-between rounded-xl border p-3.5 shadow-2xs transition-colors"
                  >
                    {/* Left: Number + Green Dot + Title + (Count People) */}
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground w-6 text-right text-xs font-semibold">
                        {idx + 1}.
                      </span>
                      <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                      <div className="text-foreground flex items-center gap-1.5 text-xs font-bold">
                        <span>{des.title}</span>
                        <span className="text-muted-foreground font-normal">
                          ({des.count} People)
                        </span>
                      </div>
                    </div>

                    {/* Right Actions: Edit and Delete */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const updatedTitle = prompt(
                            "Edit Designation Title:",
                            des.title,
                          );
                          if (updatedTitle) {
                            setDesignations(
                              designations.map((d) =>
                                d.id === des.id
                                  ? { ...d, title: updatedTitle }
                                  : d,
                              ),
                            );
                            handleSaveNotification("Designation updated.");
                          }
                        }}
                        className="text-muted-foreground hover:text-foreground cursor-pointer p-1 transition-colors"
                        title="Edit Designation"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Delete designation '${des.title}'?`)) {
                            setDesignations(
                              designations.filter((d) => d.id !== des.id),
                            );
                            handleSaveNotification(
                              `Designation '${des.title}' deleted.`,
                            );
                          }
                        }}
                        className="text-muted-foreground cursor-pointer p-1 transition-colors hover:text-rose-500"
                        title="Delete Designation"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ACCESS CONTROL TAB CONTENT (EMPLOYEE ID INPUT & AUTO-FETCHED NAME) */}
        {activeTab === "Access control" &&
          (() => {
            const currentEmp =
              employeeAccessList.find(
                (e) =>
                  e.empId.toLowerCase().trim() ===
                    searchEmpIdInput.toLowerCase().trim() ||
                  e.id === searchEmpIdInput,
              ) || employeeAccessList[0];

            const syncRolePermissions = (
              targetEmpId: string,
              perms: ModulePermission[],
            ) => {
              const allowed = perms
                .filter((p) => p.accessScreen)
                .map((p) => NAV_MODULE_MAPPING[p.name])
                .filter(Boolean);
              if (!allowed.includes("settings")) allowed.push("settings");
              if (!allowed.includes("dashboard")) allowed.unshift("dashboard");

              const targetRole: RoleType =
                targetEmpId === "EMP-001"
                  ? "HR"
                  : targetEmpId === "EMP-002"
                    ? "PM"
                    : "EMPLOYEE";
              updateRoleNavItems(targetRole, allowed);
            };

            const handleTogglePermission = (
              modId: string,
              field: "accessScreen" | "viewData" | "editAdd" | "delete",
            ) => {
              if (!currentEmp) return;
              let updatedTargetPerms: ModulePermission[] = [];
              const updatedList = employeeAccessList.map((emp) => {
                if (emp.id !== currentEmp.id) return emp;
                const updatedPerms = emp.permissions.map((perm) => {
                  if (perm.id !== modId) return perm;
                  return { ...perm, [field]: !perm[field] };
                });
                updatedTargetPerms = updatedPerms;
                return { ...emp, permissions: updatedPerms };
              });
              setEmployeeAccessList(updatedList);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "employeeAccessList",
                  JSON.stringify(updatedList),
                );
              }
              syncRolePermissions(currentEmp.empId, updatedTargetPerms);
              handleSaveNotification(
                `Permissions updated for ${currentEmp.name}`,
              );
            };

            const handleSelectAll = (check: boolean) => {
              if (!currentEmp) return;
              let updatedTargetPerms: ModulePermission[] = [];
              const updatedList = employeeAccessList.map((emp) => {
                if (emp.id !== currentEmp.id) return emp;
                const updatedPerms = emp.permissions.map((perm) => ({
                  ...perm,
                  accessScreen: check,
                  viewData: check,
                  editAdd: check,
                  delete: check,
                }));
                updatedTargetPerms = updatedPerms;
                return { ...emp, permissions: updatedPerms };
              });
              setEmployeeAccessList(updatedList);
              if (typeof window !== "undefined") {
                localStorage.setItem(
                  "employeeAccessList",
                  JSON.stringify(updatedList),
                );
              }
              syncRolePermissions(currentEmp.empId, updatedTargetPerms);
              handleSaveNotification(
                check
                  ? `Full access granted to ${currentEmp.name}`
                  : `Permissions cleared for ${currentEmp.name}`,
              );
            };

            return (
              <div className="animate-in fade-in flex w-full flex-col gap-6 duration-200">
                {/* Header */}
                <div className="flex flex-col gap-1">
                  <h1 className="text-foreground text-2xl font-bold tracking-tight">
                    Role & Access Control
                  </h1>
                  <p className="text-muted-foreground text-xs">
                    Set feature-level access controls, visibility permissions,
                    and action allowances for employees.
                  </p>
                </div>

                {/* Configure Member Permissions Container Card (Matching Screenshot) */}
                <div className="border-border/80 bg-card flex flex-col gap-6 rounded-2xl border p-6 shadow-sm">
                  {/* Employee ID Input & Auto-fetched Name Section */}
                  <div className="border-border/60 flex flex-col gap-4 border-b pb-4">
                    <div className="flex flex-col gap-1">
                      <h2 className="text-foreground text-base font-bold">
                        Configure Member Permissions
                      </h2>
                      <p className="text-muted-foreground text-xs">
                        Enter the Employee ID to auto-fetch employee details,
                        then grant or restrict feature permissions.
                      </p>
                    </div>

                    <div className="bg-secondary/30 border-border/60 grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-3">
                      {/* Input 1: Employee ID */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-foreground flex items-center justify-between text-xs font-bold">
                          <span>Employee ID *</span>
                          <span className="text-primary text-[10px] font-semibold">
                            Enter ID
                          </span>
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. AAA-001"
                          value={searchEmpIdInput}
                          onChange={(e) => setSearchEmpIdInput(e.target.value)}
                          className="bg-card border-border/80 text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-xs font-bold uppercase outline-none"
                        />
                      </div>

                      {/* Input 2: Employee Name (Auto-fetched & Read-only) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-foreground flex items-center justify-between text-xs font-bold">
                          <span>Employee Name</span>
                          <span className="text-[10px] font-semibold text-emerald-500">
                            Auto-fetched ✓
                          </span>
                        </label>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={
                            currentEmp ? currentEmp.name : "Employee Not Found"
                          }
                          className="bg-secondary/60 border-border/60 text-foreground cursor-not-allowed rounded-lg border px-3 py-2 text-xs font-bold outline-none select-none"
                        />
                      </div>

                      {/* Input 3: Role / Designation (Auto-fetched & Read-only) */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-foreground text-xs font-bold">
                          Designation & Role
                        </label>
                        <input
                          type="text"
                          readOnly
                          disabled
                          value={
                            currentEmp
                              ? `${currentEmp.designation} (${currentEmp.role})`
                              : "N/A"
                          }
                          className="bg-secondary/60 border-border/60 text-muted-foreground cursor-not-allowed rounded-lg border px-3 py-2 text-xs font-semibold outline-none select-none"
                        />
                      </div>
                    </div>

                    {/* Quick Action Buttons & ID suggestions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                      <div className="text-muted-foreground flex items-center gap-2">
                        <span className="text-foreground font-semibold">
                          Quick Switch ID:
                        </span>
                        {employeeAccessList.map((emp) => (
                          <button
                            key={emp.id}
                            type="button"
                            onClick={() => setSearchEmpIdInput(emp.empId)}
                            className={`cursor-pointer rounded-lg border px-2.5 py-1 text-[11px] font-bold transition-colors ${
                              currentEmp?.id === emp.id
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border/80 text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {emp.empId}
                          </button>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSelectAll(true)}
                          className="hover:bg-primary/10 hover:text-primary h-8 cursor-pointer px-3 text-xs transition-colors"
                        >
                          Grant Full Access
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSelectAll(false)}
                          className="h-8 cursor-pointer px-3 text-xs text-rose-400 transition-colors hover:bg-rose-500/10"
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Permissions Matrix Table Categorized by Menu Types */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs">
                      <thead>
                        <tr className="border-border/80 text-muted-foreground border-b text-[11px] font-bold tracking-wider uppercase">
                          <th className="w-1/3 px-4 py-3">
                            MODULE / SCREEN MENU
                          </th>
                          <th className="px-4 py-3 text-center">
                            ACCESS SCREEN
                          </th>
                          <th className="px-4 py-3 text-center">VIEW DATA</th>
                          <th className="px-4 py-3 text-center">EDIT / ADD</th>
                          <th className="px-4 py-3 text-center">DELETE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-border/40 divide-y">
                        {/* SECTION 1: MAIN SIDEBAR MENU SCREENS */}
                        <tr className="bg-secondary/40 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                          <td colSpan={5} className="text-primary px-4 py-2">
                            Main Sidebar Navigation Menus
                          </td>
                        </tr>
                        {currentEmp?.permissions
                          .filter(
                            (mod) =>
                              ![
                                "General",
                                "Branches",
                                "Department",
                                "Designation",
                                "Access control",
                              ].includes(mod.name),
                          )
                          .map((mod) => (
                            <tr
                              key={mod.id}
                              className="hover:bg-secondary/30 transition-colors"
                            >
                              <td className="text-foreground px-4 py-3 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                  <span>{mod.name}</span>
                                  {mod.accessScreen ? (
                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                                      Menu Visible
                                    </span>
                                  ) : (
                                    <span className="bg-muted/30 text-muted-foreground border-border rounded-full border px-1.5 py-0.5 text-[9px] font-bold">
                                      Menu Hidden
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.accessScreen}
                                  onChange={() =>
                                    handleTogglePermission(
                                      mod.id,
                                      "accessScreen",
                                    )
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.viewData}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "viewData")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.editAdd}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "editAdd")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.delete}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "delete")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>
                            </tr>
                          ))}

                        {/* SECTION 2: WORKSPACE SETTINGS MENU SCREENS */}
                        <tr className="bg-secondary/40 text-muted-foreground text-[10px] font-bold tracking-wider uppercase">
                          <td colSpan={5} className="text-primary px-4 py-2">
                            Workspace Settings Sub-Menus
                          </td>
                        </tr>
                        {currentEmp?.permissions
                          .filter((mod) =>
                            [
                              "General",
                              "Branches",
                              "Department",
                              "Designation",
                              "Access control",
                            ].includes(mod.name),
                          )
                          .map((mod) => (
                            <tr
                              key={mod.id}
                              className="hover:bg-secondary/30 transition-colors"
                            >
                              <td className="text-foreground px-4 py-3 text-xs font-bold">
                                <div className="flex items-center gap-2">
                                  <span>{mod.name}</span>
                                  {mod.accessScreen ? (
                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-500">
                                      Tab Visible
                                    </span>
                                  ) : (
                                    <span className="bg-muted/30 text-muted-foreground border-border rounded-full border px-1.5 py-0.5 text-[9px] font-bold">
                                      Tab Hidden
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.accessScreen}
                                  onChange={() =>
                                    handleTogglePermission(
                                      mod.id,
                                      "accessScreen",
                                    )
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.viewData}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "viewData")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.editAdd}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "editAdd")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>

                              <td className="px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={mod.delete}
                                  onChange={() =>
                                    handleTogglePermission(mod.id, "delete")
                                  }
                                  className="border-border text-primary focus:ring-primary accent-primary h-4 w-4 cursor-pointer rounded transition-transform active:scale-95"
                                />
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* OTHER TABS PLACEHOLDER */}
        {activeTab !== "General" &&
          activeTab !== "Theme Preferences" &&
          activeTab !== "Profile" &&
          activeTab !== "Branches" &&
          activeTab !== "Department" &&
          activeTab !== "Designation" &&
          activeTab !== "Access control" && (
            <div className="flex flex-col gap-4">
              <div className="border-border/80 flex flex-col gap-1 border-b pb-4">
                <h1 className="text-foreground text-xl font-bold">
                  {activeTab}
                </h1>
                <p className="text-muted-foreground text-xs">
                  Manage your workspace {activeTab.toLowerCase()} options
                </p>
              </div>

              <div className="border-border/80 bg-card/20 flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed p-8 text-center">
                <Sliders className="text-muted-foreground/60 h-8 w-8" />
                <h3 className="text-foreground text-sm font-bold">
                  {activeTab} Configuration
                </h3>
                <p className="text-muted-foreground max-w-sm text-xs">
                  Workspace settings for {activeTab} can be configured here.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
