"use client";

import React, { createContext, useContext, ReactNode, useState } from "react";
import { ShieldCheck, UserCheck, Briefcase, User } from "lucide-react";

export type RoleType = "ADMIN" | "HR" | "PM" | "EMPLOYEE";

export interface UserRoleProfile {
  code: RoleType;
  name: string;
  email: string;
  designation: string;
  avatar: string;
  icon: typeof ShieldCheck;
  allowedNavItems: string[];
}

export const NAV_MODULE_MAPPING: Record<string, string> = {
  Dashboard: "dashboard",
  "My Task": "tasks",
  "My Attendance": "attendance",
  "My Leaves": "leaves",
  "My Worklog": "worklog",
  "My Assets": "assets",
  Documents: "documents",
  "Service Request": "servicerequest",
  Projects: "projects",
  "Project Workspace": "projectworkspace",
  Sprints: "sprints",
  "Weekly Worklog": "weeklyworklog",
  "Attendance Management": "attendancemanagement",
  "Employees Management": "employeesmanagement",
  "Assets Management": "assetsmanagement",
  General: "settings_general",
  Branches: "settings_branches",
  Department: "settings_department",
  Designation: "settings_designation",
  "Access control": "settings_accesscontrol",
};

export const INITIAL_ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  ADMIN: [
    "dashboard",
    "projects",
    "projectworkspace",
    "tasks",
    "sprints",
    "worklog",
    "weeklyworklog",
    "attendance",
    "attendancemanagement",
    "assets",
    "assetsmanagement",
    "employeesmanagement",
    "leaves",
    "documents",
    "servicerequest",
    "settings",
  ],
  HR: [
    "dashboard",
    "employeesmanagement",
    "attendancemanagement",
    "attendance",
    "assetsmanagement",
    "assets",
    "leaves",
    "documents",
    "servicerequest",
    "settings",
  ],
  PM: [
    "dashboard",
    "projects",
    "projectworkspace",
    "sprints",
    "tasks",
    "worklog",
    "weeklyworklog",
    "attendance",
    "leaves",
    "documents",
    "servicerequest",
    "settings",
  ],
  EMPLOYEE: [
    "dashboard",
    "sprints",
    "tasks",
    "worklog",
    "attendance",
    "assets",
    "leaves",
    "documents",
    "servicerequest",
    "settings",
  ],
};

export const USER_ROLE_PROFILES: Record<
  RoleType,
  Omit<UserRoleProfile, "allowedNavItems">
> = {
  ADMIN: {
    code: "ADMIN",
    name: "Alex Morgan (Admin)",
    email: "alex.admin@company.com",
    designation: "Chief Executive Officer / Super Admin",
    avatar: "AM",
    icon: ShieldCheck,
  },
  HR: {
    code: "HR",
    name: "Sarah Jenkins (HR)",
    email: "sarah.hr@company.com",
    designation: "Head of Human Resources",
    avatar: "SJ",
    icon: UserCheck,
  },
  PM: {
    code: "PM",
    name: "David Miller (PM)",
    email: "david.pm@company.com",
    designation: "Senior Engineering Project Manager",
    avatar: "DM",
    icon: Briefcase,
  },
  EMPLOYEE: {
    code: "EMPLOYEE",
    name: "Peer Mohamed Nafees J",
    email: "nafees@aaatechnopark.com",
    designation: "Software Engineer",
    avatar: "PN",
    icon: User,
  },
};

interface UserRoleContextType {
  role: RoleType;
  setRole: (role: RoleType) => void;
  currentProfile: UserRoleProfile;
  rolePermissionsMap: Record<RoleType, string[]>;
  updateRoleNavItems: (role: RoleType, allowedNavItems: string[]) => void;
  hasScreenAccess: (navItemId: string) => boolean;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(
  undefined,
);

export function UserRoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<RoleType>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const rParam = params.get("role") as RoleType;
      const storedRole = localStorage.getItem("userRole") as RoleType;
      if (rParam && rParam in USER_ROLE_PROFILES) {
        localStorage.setItem("userRole", rParam);
        return rParam;
      }
      if (storedRole && storedRole in USER_ROLE_PROFILES) {
        return storedRole;
      }
    }
    return "ADMIN";
  });
  const [rolePermissionsMap, setRolePermissionsMap] = useState<
    Record<RoleType, string[]>
  >(() => {
    if (typeof window !== "undefined") {
      try {
        const storedPermissions = localStorage.getItem("rolePermissionsMap");
        if (storedPermissions) {
          const parsed = JSON.parse(storedPermissions);
          return {
            ADMIN: Array.from(
              new Set([
                ...INITIAL_ROLE_PERMISSIONS.ADMIN,
                ...(parsed.ADMIN || []),
              ]),
            ),
            HR: parsed.HR || INITIAL_ROLE_PERMISSIONS.HR,
            PM: Array.from(
              new Set([...INITIAL_ROLE_PERMISSIONS.PM, ...(parsed.PM || [])]),
            ),
            EMPLOYEE: parsed.EMPLOYEE || INITIAL_ROLE_PERMISSIONS.EMPLOYEE,
          };
        }
      } catch (e) {
        console.error(
          "Failed to load stored role permissions from localStorage",
          e,
        );
      }
    }
    return INITIAL_ROLE_PERMISSIONS;
  });

  const setRole = (newRole: RoleType) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      localStorage.setItem("userRole", newRole);
      const url = new URL(window.location.href);
      url.searchParams.set("role", newRole);
      window.history.pushState({}, "", url.toString());
    }
  };

  const updateRoleNavItems = (
    targetRole: RoleType,
    allowedNavItems: string[],
  ) => {
    setRolePermissionsMap((prev) => {
      const updated = { ...prev, [targetRole]: allowedNavItems };
      if (typeof window !== "undefined") {
        localStorage.setItem("rolePermissionsMap", JSON.stringify(updated));
      }
      return updated;
    });
  };

  const hasScreenAccess = (navItemId: string): boolean => {
    if (role === "ADMIN") return true;
    const allowed = rolePermissionsMap[role] || INITIAL_ROLE_PERMISSIONS[role];
    return allowed.includes(navItemId);
  };

  const baseProfile = USER_ROLE_PROFILES[role] || USER_ROLE_PROFILES.ADMIN;
  const currentProfile: UserRoleProfile = {
    ...baseProfile,
    allowedNavItems: rolePermissionsMap[role] || INITIAL_ROLE_PERMISSIONS[role],
  };

  return (
    <UserRoleContext.Provider
      value={{
        role,
        setRole,
        currentProfile,
        rolePermissionsMap,
        updateRoleNavItems,
        hasScreenAccess,
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
}

export function useUserRole() {
  const context = useContext(UserRoleContext);
  if (!context) {
    return {
      role: "ADMIN" as RoleType,
      setRole: () => {},
      currentProfile: {
        ...USER_ROLE_PROFILES.ADMIN,
        allowedNavItems: INITIAL_ROLE_PERMISSIONS.ADMIN,
      },
      rolePermissionsMap: INITIAL_ROLE_PERMISSIONS,
      updateRoleNavItems: () => {},
      hasScreenAccess: () => true,
    };
  }
  return context;
}
