"use client";

import React, { useState, useMemo } from "react";
import { useUserRole } from "@/lib/user-role-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  CheckCircle2,
  Clock,
  Download,
  Search,
  ShieldAlert,
  ShieldCheck,
  Users,
  Eye,
  Check,
  Building2,
  Zap,
  Briefcase,
} from "lucide-react";

export interface EmployeeWeeklyWorklog {
  id: string;
  empId: string;
  name: string;
  avatar: string;
  department: string;
  designation: string;
  projectRole: string;
  dailyHours: {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
  };
  status: "Approved" | "Pending Review" | "Changes Requested";
  submittedDate: string;
  taskLogs: {
    id: string;
    day: string;
    taskTitle: string;
    taskId: string;
    hours: number;
    category:
      "Development" | "Code Review" | "Architecture" | "Testing" | "Meeting";
    notes: string;
  }[];
}

const INITIAL_PROJECTS = [
  {
    id: "p1",
    name: "EPD Enterprise System",
    code: "EPD-2026",
    lead: "Alex Morgan",
  },
  {
    id: "p2",
    name: "Client Onboarding Portal",
    code: "ONB-101",
    lead: "David Miller",
  },
  {
    id: "p3",
    name: "Cloud Native Infrastructure",
    code: "INF-990",
    lead: "Elena Vance",
  },
  {
    id: "p4",
    name: "Design System Redesign",
    code: "DS-404",
    lead: "Julian Thorne",
  },
];

const INITIAL_EMPLOYEE_WORKLOGS: Record<string, EmployeeWeeklyWorklog[]> = {
  p1: [
    {
      id: "wl-1",
      empId: "AAA-001",
      name: "Elena Vance",
      avatar: "EV",
      department: "Engineering",
      designation: "Lead Systems Architect",
      projectRole: "Tech Lead",
      dailyHours: {
        mon: 8.5,
        tue: 8.0,
        wed: 9.0,
        thu: 8.5,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-1",
          day: "Mon (24 Aug)",
          taskTitle: "Microservices Auth Layer Refactoring",
          taskId: "EPD-401",
          hours: 5.0,
          category: "Architecture",
          notes:
            "Designed OAuth2 token rotation & centralized session store with Redis cluster integration.",
        },
        {
          id: "tl-2",
          day: "Mon (24 Aug)",
          taskTitle: "PR Code Reviews & Tech Sync",
          taskId: "EPD-392",
          hours: 3.5,
          category: "Code Review",
          notes:
            "Reviewed backend pull requests for sprint 14 auth middleware and rate limiting.",
        },
        {
          id: "tl-3",
          day: "Tue (25 Aug)",
          taskTitle: "Database Indexing & Query Tuning",
          taskId: "EPD-410",
          hours: 5.0,
          category: "Development",
          notes:
            "Optimized Postgres composite indexes for fast user directory lookup and organization tenant filters.",
        },
        {
          id: "tl-4",
          day: "Tue (25 Aug)",
          taskTitle: "Architecture Backlog Grooming",
          taskId: "EPD-415",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Refined architectural epics and estimation benchmarks for upcoming sprint milestones.",
        },
        {
          id: "tl-5",
          day: "Wed (26 Aug)",
          taskTitle: "Distributed Tracing & OpenTelemetry",
          taskId: "EPD-422",
          hours: 6.0,
          category: "Architecture",
          notes:
            "Instrumented trace context propagation across core gateway and payment billing services.",
        },
        {
          id: "tl-6",
          day: "Wed (26 Aug)",
          taskTitle: "System Design Council Presentation",
          taskId: "EPD-428",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Presented event-driven messaging RFC and dead-letter queue recovery architecture.",
        },
        {
          id: "tl-7",
          day: "Thu (27 Aug)",
          taskTitle: "Redis Cluster Cache Invalidation Pipeline",
          taskId: "EPD-435",
          hours: 5.5,
          category: "Development",
          notes:
            "Engineered pub/sub cache eviction strategy on entity updates to eliminate stale reads.",
        },
        {
          id: "tl-8",
          day: "Thu (27 Aug)",
          taskTitle: "Security Audit & Vulnerability Remediation",
          taskId: "EPD-438",
          hours: 3.0,
          category: "Testing",
          notes:
            "Patched CVE vulnerabilities in cryptographic helper packages and updated docker base images.",
        },
        {
          id: "tl-9",
          day: "Fri (28 Aug)",
          taskTitle: "End-to-End Stress & Chaos Simulation",
          taskId: "EPD-444",
          hours: 5.0,
          category: "Testing",
          notes:
            "Ran simulated network latency and failover stress tests against read replicas.",
        },
        {
          id: "tl-10",
          day: "Fri (28 Aug)",
          taskTitle: "Engineering Retrospective & Sprint Demo",
          taskId: "EPD-450",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Conducted bi-weekly team retrospective and demonstrated system architecture improvements.",
        },
      ],
    },
    {
      id: "wl-2",
      empId: "AAA-005",
      name: "Sarah Chen",
      avatar: "SC",
      department: "Engineering",
      designation: "Senior Backend Developer",
      projectRole: "Backend Developer",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.0,
        thu: 7.5,
        fri: 8.5,
        sat: 0,
        sun: 0,
      },
      status: "Pending Review",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-11",
          day: "Mon (24 Aug)",
          taskTitle: "REST API Endpoint Implementation",
          taskId: "EPD-422",
          hours: 5.0,
          category: "Development",
          notes:
            "Implemented weekly worklog submission endpoint with payload schema validation.",
        },
        {
          id: "tl-12",
          day: "Mon (24 Aug)",
          taskTitle: "OpenAPI Spec Documentation",
          taskId: "EPD-425",
          hours: 3.0,
          category: "Development",
          notes:
            "Documented parameters, request bodies, and error response models in Swagger spec.",
        },
        {
          id: "tl-13",
          day: "Tue (25 Aug)",
          taskTitle: "Integration Unit Test Suite",
          taskId: "EPD-429",
          hours: 5.0,
          category: "Testing",
          notes:
            "Authored unit test coverage for role-based authorization filters and edge cases.",
        },
        {
          id: "tl-14",
          day: "Tue (25 Aug)",
          taskTitle: "PR Code Reviews",
          taskId: "EPD-431",
          hours: 3.0,
          category: "Code Review",
          notes:
            "Reviewed pull requests for data pagination and dynamic sorting helpers.",
        },
        {
          id: "tl-15",
          day: "Wed (26 Aug)",
          taskTitle: "Notification Service Webhook Handler",
          taskId: "EPD-436",
          hours: 5.5,
          category: "Development",
          notes:
            "Built resilient webhook dispatch mechanism for manager timesheet review alerts.",
        },
        {
          id: "tl-16",
          day: "Wed (26 Aug)",
          taskTitle: "Backend Architecture Standup",
          taskId: "EPD-440",
          hours: 2.5,
          category: "Meeting",
          notes:
            "Coordinated database schema migration schedules with the infrastructure team.",
        },
        {
          id: "tl-17",
          day: "Thu (27 Aug)",
          taskTitle: "Async CSV Export Queue Worker",
          taskId: "EPD-442",
          hours: 4.5,
          category: "Development",
          notes:
            "Implemented BullMQ background job processor to stream large CSV exports to S3.",
        },
        {
          id: "tl-18",
          day: "Thu (27 Aug)",
          taskTitle: "Timezone Boundary Bug Fixes",
          taskId: "EPD-445",
          hours: 3.0,
          category: "Development",
          notes:
            "Resolved UTC date boundary drift affecting Sunday worklog submission entries.",
        },
        {
          id: "tl-19",
          day: "Fri (28 Aug)",
          taskTitle: "ElasticSearch Query Optimization",
          taskId: "EPD-449",
          hours: 5.5,
          category: "Development",
          notes:
            "Optimized complex boolean filter queries on employee timesheet search indices.",
        },
        {
          id: "tl-20",
          day: "Fri (28 Aug)",
          taskTitle: "Sprint 14 Wrap-up & Showcase",
          taskId: "EPD-452",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Demonstrated batch approval endpoints and metrics dashboard to project managers.",
        },
      ],
    },
    {
      id: "wl-3",
      empId: "AAA-002",
      name: "Sahara Acharya",
      avatar: "SA",
      department: "Engineering",
      designation: "Intern Frontend Developer",
      projectRole: "Frontend Contributor",
      dailyHours: {
        mon: 7.5,
        tue: 8.0,
        wed: 7.5,
        thu: 8.0,
        fri: 7.0,
        sat: 0,
        sun: 0,
      },
      status: "Pending Review",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-21",
          day: "Mon (24 Aug)",
          taskTitle: "UI Component Library & Table Fixes",
          taskId: "EPD-430",
          hours: 4.5,
          category: "Development",
          notes:
            "Built dark-mode table grid layouts for the employee timesheet review directory.",
        },
        {
          id: "tl-22",
          day: "Mon (24 Aug)",
          taskTitle: "Frontend Pair Programming",
          taskId: "EPD-432",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Paired with Sarah on API response schema validation and TypeScript interface models.",
        },
        {
          id: "tl-23",
          day: "Tue (25 Aug)",
          taskTitle: "Modal Responsive Layout Tuning",
          taskId: "EPD-433",
          hours: 5.0,
          category: "Development",
          notes:
            "Adapted inspection dialog styles for tablet and mobile responsive viewports.",
        },
        {
          id: "tl-24",
          day: "Tue (25 Aug)",
          taskTitle: "Component Storybook Documentation",
          taskId: "EPD-437",
          hours: 3.0,
          category: "Development",
          notes:
            "Added Storybook documentation and prop tables for custom Badge and Card elements.",
        },
        {
          id: "tl-25",
          day: "Wed (26 Aug)",
          taskTitle: "Client-Side Form Validation & Error States",
          taskId: "EPD-441",
          hours: 4.5,
          category: "Development",
          notes:
            "Implemented Zod validation hooks and subtle toast notifications for error states.",
        },
        {
          id: "tl-26",
          day: "Wed (26 Aug)",
          taskTitle: "Accessibility (a11y) Screen Reader Audit",
          taskId: "EPD-443",
          hours: 3.0,
          category: "Testing",
          notes:
            "Verified ARIA live regions and keyboard focus rings across all dropdown controls.",
        },
        {
          id: "tl-27",
          day: "Thu (27 Aug)",
          taskTitle: "Filter Bar Debounce & Search Optimization",
          taskId: "EPD-446",
          hours: 5.0,
          category: "Development",
          notes:
            "Added debounced input handling on employee search to reduce unnecessary re-renders.",
        },
        {
          id: "tl-28",
          day: "Thu (27 Aug)",
          taskTitle: "PR Review Feedback Revisions",
          taskId: "EPD-448",
          hours: 3.0,
          category: "Code Review",
          notes:
            "Refactored CSS utility class groupings per senior frontend code review comments.",
        },
        {
          id: "tl-29",
          day: "Fri (28 Aug)",
          taskTitle: "Lighthouse Performance Benchmarks",
          taskId: "EPD-451",
          hours: 4.0,
          category: "Testing",
          notes:
            "Optimized client bundle chunk splitting to maintain 98+ Lighthouse performance score.",
        },
        {
          id: "tl-30",
          day: "Fri (28 Aug)",
          taskTitle: "Frontend Guild Knowledge Transfer",
          taskId: "EPD-453",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Attended frontend architecture guild deep dive on React 19 concurrent features.",
        },
      ],
    },
  ],
  p2: [
    {
      id: "wl-4",
      empId: "AAA-003",
      name: "Aman Sharma",
      avatar: "AS",
      department: "Marketing",
      designation: "Growth Marketing Manager",
      projectRole: "Marketing Lead",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.0,
        thu: 8.0,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-31",
          day: "Mon (24 Aug)",
          taskTitle: "Client Onboarding Campaign Planning",
          taskId: "ONB-88",
          hours: 5.0,
          category: "Meeting",
          notes:
            "Prepared marketing collateral & step-by-step user onboarding manuals for enterprise clients.",
        },
        {
          id: "tl-32",
          day: "Mon (24 Aug)",
          taskTitle: "Registration Funnel Drop-off Analysis",
          taskId: "ONB-89",
          hours: 3.0,
          category: "Testing",
          notes:
            "Analyzed Mixpanel event funnels to identify conversion bottlenecks in corporate signup.",
        },
        {
          id: "tl-33",
          day: "Tue (25 Aug)",
          taskTitle: "Automated Welcome Email Drip Sequence",
          taskId: "ONB-91",
          hours: 5.0,
          category: "Development",
          notes:
            "Drafted and scheduled 5-part personalized onboarding email sequences via Customer.io.",
        },
        {
          id: "tl-34",
          day: "Tue (25 Aug)",
          taskTitle: "Customer Success Alignment Sync",
          taskId: "ONB-92",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Reviewed early user feedback on organization profile configuration flow.",
        },
        {
          id: "tl-35",
          day: "Wed (26 Aug)",
          taskTitle: "CTA Variant A/B Experiment Setup",
          taskId: "ONB-96",
          hours: 5.0,
          category: "Development",
          notes:
            "Configured split-testing variations for enterprise landing page demo request buttons.",
        },
        {
          id: "tl-36",
          day: "Wed (26 Aug)",
          taskTitle: "Executive Growth Metrics Review",
          taskId: "ONB-98",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Presented monthly activation conversion charts and enterprise retention cohorts.",
        },
        {
          id: "tl-37",
          day: "Thu (27 Aug)",
          taskTitle: "Enterprise Client Discovery Interviews",
          taskId: "ONB-103",
          hours: 5.0,
          category: "Meeting",
          notes:
            "Conducted 3 live discovery calls with enterprise HR heads on workspace onboarding.",
        },
        {
          id: "tl-38",
          day: "Thu (27 Aug)",
          taskTitle: "Self-Serve Knowledge Base Articles",
          taskId: "ONB-105",
          hours: 3.0,
          category: "Development",
          notes:
            "Published onboarding walkthroughs and enterprise security verification instructions.",
        },
        {
          id: "tl-39",
          day: "Fri (28 Aug)",
          taskTitle: "Channel Partner Marketing Alignment",
          taskId: "ONB-109",
          hours: 4.0,
          category: "Meeting",
          notes:
            "Coordinated joint launch messaging and webinars with technology integration partners.",
        },
        {
          id: "tl-40",
          day: "Fri (28 Aug)",
          taskTitle: "Weekly CAC & Throughput Synthesis",
          taskId: "ONB-112",
          hours: 4.0,
          category: "Testing",
          notes:
            "Synthesized week-over-week acquisition cost reductions and completed weekly recap report.",
        },
      ],
    },
    {
      id: "wl-5",
      empId: "AAA-004",
      name: "Julian Thorne",
      avatar: "JT",
      department: "Product Design",
      designation: "Principal UI/UX Designer",
      projectRole: "Design Lead",
      dailyHours: {
        mon: 8.5,
        tue: 8.0,
        wed: 8.5,
        thu: 8.0,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-41",
          day: "Mon (24 Aug)",
          taskTitle: "Onboarding Flow Wireframes & Information Architecture",
          taskId: "ONB-95",
          hours: 5.5,
          category: "Architecture",
          notes:
            "Designed candidate document upload UX and corporate domain verification wizard.",
        },
        {
          id: "tl-42",
          day: "Mon (24 Aug)",
          taskTitle: "Design Critique & Feedback Sync",
          taskId: "ONB-97",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Collected engineering and product critique on multi-step onboarding navigation.",
        },
        {
          id: "tl-43",
          day: "Tue (25 Aug)",
          taskTitle: "High-Fidelity Interactive Figma Prototype",
          taskId: "ONB-99",
          hours: 5.0,
          category: "Development",
          notes:
            "Constructed clickable prototype featuring edge-case error states and progressive disclosure.",
        },
        {
          id: "tl-44",
          day: "Tue (25 Aug)",
          taskTitle: "Engineering Design Handoff Review",
          taskId: "ONB-100",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Walked frontend team through responsive layout specs, auto-layout tokens, and breakpoints.",
        },
        {
          id: "tl-45",
          day: "Wed (26 Aug)",
          taskTitle: "Custom Vector Iconography & Micro-Animations",
          taskId: "ONB-104",
          hours: 5.5,
          category: "Development",
          notes:
            "Crafted bespoke onboarding checklist SVG icons and lightweight Lottie celebration animations.",
        },
        {
          id: "tl-46",
          day: "Wed (26 Aug)",
          taskTitle: "Moderated Usability Testing Lab",
          taskId: "ONB-106",
          hours: 3.0,
          category: "Testing",
          notes:
            "Observed 4 test participants navigating document drag-and-drop and validation errors.",
        },
        {
          id: "tl-47",
          day: "Thu (27 Aug)",
          taskTitle: "Dark Theme Accessibility & Contrast Tuning",
          taskId: "ONB-108",
          hours: 5.0,
          category: "Development",
          notes:
            "Verified WCAG AAA contrast ratios for dark theme onboarding cards and input borders.",
        },
        {
          id: "tl-48",
          day: "Thu (27 Aug)",
          taskTitle: "Design System Governance Council",
          taskId: "ONB-110",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Reviewed shared button and input overrides to ensure brand consistency across portals.",
        },
        {
          id: "tl-49",
          day: "Fri (28 Aug)",
          taskTitle: "Mobile Viewport Touch Target Audit",
          taskId: "ONB-114",
          hours: 5.0,
          category: "Testing",
          notes:
            "Fine-tuned mobile bottom sheet modals and 48px minimum touch targets on mobile view.",
        },
        {
          id: "tl-50",
          day: "Fri (28 Aug)",
          taskTitle: "Sprint 14 Design Showcase",
          taskId: "ONB-116",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Showcased finalized onboarding user flows to project stakeholders and executive leadership.",
        },
      ],
    },
  ],
  p3: [
    {
      id: "wl-6",
      empId: "AAA-006",
      name: "Mike Chen",
      avatar: "MC",
      department: "DevOps",
      designation: "Senior DevOps Engineer",
      projectRole: "Infrastructure Lead",
      dailyHours: {
        mon: 8.0,
        tue: 8.5,
        wed: 8.0,
        thu: 8.5,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-51",
          day: "Mon (24 Aug)",
          taskTitle: "Kubernetes Cluster Provisioning",
          taskId: "INF-101",
          hours: 5.0,
          category: "Architecture",
          notes:
            "Provisioned multi-region AWS EKS 1.30 production clusters using Terraform infrastructure-as-code.",
        },
        {
          id: "tl-52",
          day: "Mon (24 Aug)",
          taskTitle: "Terraform VPC & Subnet Architecture",
          taskId: "INF-103",
          hours: 3.0,
          category: "Development",
          notes:
            "Modularized private VPC subnets and NAT gateway high availability routing policies.",
        },
        {
          id: "tl-53",
          day: "Tue (25 Aug)",
          taskTitle: "CI/CD Pipeline GitHub Actions Integration",
          taskId: "INF-102",
          hours: 5.5,
          category: "Development",
          notes:
            "Engineered secure GitHub Actions runner cluster with AWS OIDC short-lived credentials.",
        },
        {
          id: "tl-54",
          day: "Tue (25 Aug)",
          taskTitle: "Cloud Infrastructure Cost Architecture Sync",
          taskId: "INF-106",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Analyzed compute utilization and implemented Karpenter spot instance auto-scaling rules.",
        },
        {
          id: "tl-55",
          day: "Wed (26 Aug)",
          taskTitle: "ArgoCD GitOps Deployment Architecture",
          taskId: "INF-110",
          hours: 5.0,
          category: "Architecture",
          notes:
            "Configured automated GitOps sync waves and progressive canary rollout controllers.",
        },
        {
          id: "tl-56",
          day: "Wed (26 Aug)",
          taskTitle: "Helm Chart Standardization",
          taskId: "INF-112",
          hours: 3.0,
          category: "Development",
          notes:
            "Standardized microservice Helm charts with resource limits, liveness, and readiness probes.",
        },
        {
          id: "tl-57",
          day: "Thu (27 Aug)",
          taskTitle: "Prometheus & Grafana Observability Dashboard",
          taskId: "INF-115",
          hours: 5.5,
          category: "Development",
          notes:
            "Configured custom alerting rules for pod throttling, HTTP 5xx spikes, and memory leak warnings.",
        },
        {
          id: "tl-58",
          day: "Thu (27 Aug)",
          taskTitle: "Multi-AZ RDS Failover Drill",
          taskId: "INF-118",
          hours: 3.0,
          category: "Testing",
          notes:
            "Executed automated database primary failover drill without dropped client socket connections.",
        },
        {
          id: "tl-59",
          day: "Fri (28 Aug)",
          taskTitle: "Zero-Downtime Deployment Verification",
          taskId: "INF-122",
          hours: 5.0,
          category: "Testing",
          notes:
            "Verified zero-loss rolling updates under sustained 2,500 requests-per-second load simulation.",
        },
        {
          id: "tl-60",
          day: "Fri (28 Aug)",
          taskTitle: "DevOps Retrospective & On-Call Rotation Handover",
          taskId: "INF-125",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Documented infrastructure incident playbooks and conducted weekly on-call engineer handover.",
        },
      ],
    },
    {
      id: "wl-6b",
      empId: "AAA-009",
      name: "Devanshi Patel",
      avatar: "DP",
      department: "DevOps",
      designation: "Senior Cloud Security Engineer",
      projectRole: "Security Lead",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.0,
        thu: 8.0,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-26",
      taskLogs: [
        {
          id: "tl-61",
          day: "Mon (24 Aug)",
          taskTitle: "IAM Least Privilege Role Hardening",
          taskId: "INF-104",
          hours: 5.0,
          category: "Architecture",
          notes:
            "Audited AWS IAM permissions and eliminated wildcard actions across all service accounts.",
        },
        {
          id: "tl-62",
          day: "Mon (24 Aug)",
          taskTitle: "Security Operations Incident Review",
          taskId: "INF-105",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Investigated AWS GuardDuty perimeter scan alerts and verified WAF IP blocklist rules.",
        },
        {
          id: "tl-63",
          day: "Tue (25 Aug)",
          taskTitle: "Container Vulnerability Scanning Automation",
          taskId: "INF-107",
          hours: 5.0,
          category: "Testing",
          notes:
            "Integrated Trivy container scanner into CI build pipeline to block high/critical CVE images.",
        },
        {
          id: "tl-64",
          day: "Tue (25 Aug)",
          taskTitle: "DevSecOps Architecture Coordination",
          taskId: "INF-108",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Aligned with engineering tech leads on automated dependency patching SLAs.",
        },
        {
          id: "tl-65",
          day: "Wed (26 Aug)",
          taskTitle: "HashiCorp Vault Dynamic Secret Injection",
          taskId: "INF-111",
          hours: 5.0,
          category: "Development",
          notes:
            "Deployed Vault sidecar injector to supply ephemeral database credentials to services.",
        },
        {
          id: "tl-66",
          day: "Wed (26 Aug)",
          taskTitle: "TLS Certificate Auto-Renewal Configuration",
          taskId: "INF-113",
          hours: 3.0,
          category: "Development",
          notes:
            "Configured cert-manager with Let's Encrypt DNS-01 challenges for wildcard ingress endpoints.",
        },
        {
          id: "tl-67",
          day: "Thu (27 Aug)",
          taskTitle: "Kubernetes Calico Network Policy Lockdown",
          taskId: "INF-116",
          hours: 5.0,
          category: "Development",
          notes:
            "Applied strict zero-trust ingress and egress network isolation policies between namespaces.",
        },
        {
          id: "tl-68",
          day: "Thu (27 Aug)",
          taskTitle: "Perimeter Penetration Testing Audit",
          taskId: "INF-119",
          hours: 3.0,
          category: "Testing",
          notes:
            "Executed external simulated attack scripts to validate AWS CloudFront and ALB protection.",
        },
        {
          id: "tl-69",
          day: "Fri (28 Aug)",
          taskTitle: "SOC2 Compliance Evidence Collection",
          taskId: "INF-123",
          hours: 5.0,
          category: "Architecture",
          notes:
            "Exported audit logs, encryption-at-rest keys, and backup verification reports for SOC2 auditors.",
        },
        {
          id: "tl-70",
          day: "Fri (28 Aug)",
          taskTitle: "Security Best Practices Workshop",
          taskId: "INF-126",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Delivered team security briefing on phishing awareness and secure ssh key management.",
        },
      ],
    },
  ],
  p4: [
    {
      id: "wl-7",
      empId: "AAA-007",
      name: "Lisa Wong",
      avatar: "LW",
      department: "Product Design",
      designation: "UX Researcher",
      projectRole: "Research Lead",
      dailyHours: {
        mon: 7.5,
        tue: 8.0,
        wed: 8.0,
        thu: 7.5,
        fri: 8.0,
        sat: 0,
        sun: 0,
      },
      status: "Pending Review",
      submittedDate: "2026-08-27",
      taskLogs: [
        {
          id: "tl-71",
          day: "Mon (24 Aug)",
          taskTitle: "Developer Usability Interviews",
          taskId: "DS-201",
          hours: 4.5,
          category: "Meeting",
          notes:
            "Conducted 1-on-1 interviews with developers regarding design system token adoption blockers.",
        },
        {
          id: "tl-72",
          day: "Mon (24 Aug)",
          taskTitle: "Survey Data Synthesis & Affinity Mapping",
          taskId: "DS-202",
          hours: 3.0,
          category: "Testing",
          notes:
            "Synthesized qualitative feedback from 35 internal developers on component ergonomics.",
        },
        {
          id: "tl-73",
          day: "Tue (25 Aug)",
          taskTitle: "Legacy Component Usage Audit",
          taskId: "DS-205",
          hours: 5.0,
          category: "Testing",
          notes:
            "Scanned frontend repository imports to quantify usage of deprecated v1 modal dialogs.",
        },
        {
          id: "tl-74",
          day: "Tue (25 Aug)",
          taskTitle: "Design System Working Group Alignment",
          taskId: "DS-207",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Presented research insights on form validation friction points to core designers.",
        },
        {
          id: "tl-75",
          day: "Wed (26 Aug)",
          taskTitle: "Screen Reader Accessibility Usability Testing",
          taskId: "DS-210",
          hours: 5.0,
          category: "Testing",
          notes:
            "Evaluated NVDA and VoiceOver screen reader workflows on data grid and sorting headers.",
        },
        {
          id: "tl-76",
          day: "Wed (26 Aug)",
          taskTitle: "Accessibility Debrief with Product Engineering",
          taskId: "DS-212",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Prioritized keyboard navigation bug fixes and ARIA label consistency for Q3 release.",
        },
        {
          id: "tl-77",
          day: "Thu (27 Aug)",
          taskTitle: "Design Guidelines Documentation UX",
          taskId: "DS-215",
          hours: 4.5,
          category: "Development",
          notes:
            "Authored practical usage guidelines and dos/donts for buttons, tooltips, and badges.",
        },
        {
          id: "tl-78",
          day: "Thu (27 Aug)",
          taskTitle: "Component Taxonomy Card Sorting Workshop",
          taskId: "DS-217",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Moderated hybrid card sorting session with UI designers to reorganize docs navigation.",
        },
        {
          id: "tl-79",
          day: "Fri (28 Aug)",
          taskTitle: "Design System Benchmark Report Publication",
          taskId: "DS-220",
          hours: 5.0,
          category: "Development",
          notes:
            "Published comprehensive 24-page Design System UX benchmark report for company leadership.",
        },
        {
          id: "tl-80",
          day: "Fri (28 Aug)",
          taskTitle: "Design Sprint Showcase & Video Highlights",
          taskId: "DS-222",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Shared recorded video interview highlights during the Friday engineering townhall.",
        },
      ],
    },
    {
      id: "wl-7b",
      empId: "AAA-008",
      name: "Alex Rivera",
      avatar: "AR",
      department: "Product Design",
      designation: "Senior Design Systems Engineer",
      projectRole: "UI Engineer",
      dailyHours: {
        mon: 8.0,
        tue: 8.0,
        wed: 8.5,
        thu: 8.0,
        fri: 7.5,
        sat: 0,
        sun: 0,
      },
      status: "Approved",
      submittedDate: "2026-08-25",
      taskLogs: [
        {
          id: "tl-81",
          day: "Mon (24 Aug)",
          taskTitle: "Style Dictionary Cross-Platform Token Compiler",
          taskId: "DS-203",
          hours: 5.0,
          category: "Development",
          notes:
            "Configured Style Dictionary transformation pipeline to generate CSS variables and iOS Swift tokens.",
        },
        {
          id: "tl-82",
          day: "Mon (24 Aug)",
          taskTitle: "Component API Architecture RFC Review",
          taskId: "DS-204",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Reviewed polymorphic `asChild` composition patterns with senior frontend architects.",
        },
        {
          id: "tl-83",
          day: "Tue (25 Aug)",
          taskTitle: "Radix UI Primitives Re-implementation",
          taskId: "DS-206",
          hours: 5.0,
          category: "Development",
          notes:
            "Migrated custom dropdowns and selects to robust Radix UI headless components.",
        },
        {
          id: "tl-84",
          day: "Tue (25 Aug)",
          taskTitle: "Peer Code Reviews for Design Tokens",
          taskId: "DS-208",
          hours: 3.0,
          category: "Code Review",
          notes:
            "Reviewed pull requests introducing color scale shades and typography line-height variables.",
        },
        {
          id: "tl-85",
          day: "Wed (26 Aug)",
          taskTitle: "Data Table Virtualization & Sticky Header Support",
          taskId: "DS-211",
          hours: 5.5,
          category: "Development",
          notes:
            "Engineered headless table sorting and virtualized row rendering for 10,000+ data items.",
        },
        {
          id: "tl-86",
          day: "Wed (26 Aug)",
          taskTitle: "Figma Tokens Studio Sync Meeting",
          taskId: "DS-213",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Automated two-way GitHub sync with Figma Tokens Studio plugin via GitHub webhooks.",
        },
        {
          id: "tl-87",
          day: "Thu (27 Aug)",
          taskTitle: "Zero-Runtime Theme Switcher Engine",
          taskId: "DS-216",
          hours: 5.0,
          category: "Development",
          notes:
            "Optimized dark/light mode switching with CSS class toggling to eliminate layout recalculations.",
        },
        {
          id: "tl-88",
          day: "Thu (27 Aug)",
          taskTitle: "Playwright Automated Visual Regression Suite",
          taskId: "DS-218",
          hours: 3.0,
          category: "Testing",
          notes:
            "Configured automated visual snapshot diffing across 35 component variants on pull requests.",
        },
        {
          id: "tl-89",
          day: "Fri (28 Aug)",
          taskTitle: "Storybook v2 Interactive Playground Release",
          taskId: "DS-221",
          hours: 4.5,
          category: "Development",
          notes:
            "Published redesigned Storybook docs with live editable JSX sandbox playgrounds.",
        },
        {
          id: "tl-90",
          day: "Fri (28 Aug)",
          taskTitle: "Design System Showcase & Retrospective",
          taskId: "DS-223",
          hours: 3.0,
          category: "Meeting",
          notes:
            "Conducted weekly team demo of new accessible components and reviewed team velocity.",
        },
      ],
    },
  ],
};

export function WeeklyWorklogView() {
  const { role, setRole } = useUserRole();

  // Role Access Guard: Allowed for ADMIN and PM
  const isAuthorized = role === "ADMIN" || role === "PM";

  const [selectedProjectId, setSelectedProjectId] = useState<string>("p1");
  const [weekOffset, setWeekOffset] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | "Approved" | "Pending Review" | "Changes Requested"
  >("All");

  const [worklogData, setWorklogData] = useState(INITIAL_EMPLOYEE_WORKLOGS);
  const [selectedInspectionLog, setSelectedInspectionLog] =
    useState<EmployeeWeeklyWorklog | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<string>("All");
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);

  // Selected Project
  const currentProject = useMemo(() => {
    return (
      INITIAL_PROJECTS.find((p) => p.id === selectedProjectId) ||
      INITIAL_PROJECTS[0]
    );
  }, [selectedProjectId]);

  // Current project's employee worklogs
  const projectWorklogs = useMemo(() => {
    let logs: EmployeeWeeklyWorklog[] = [];
    if (selectedProjectId === "all") {
      logs = Object.values(worklogData).flat();
    } else {
      logs = worklogData[selectedProjectId] || [];
    }

    return logs.filter((log) => {
      const matchesSearch =
        log.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.designation.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || log.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [worklogData, selectedProjectId, searchQuery, statusFilter]);

  // Executive Metrics Calculations
  const totalWeeklyHours = useMemo(() => {
    return projectWorklogs.reduce((acc, log) => {
      const sum =
        log.dailyHours.mon +
        log.dailyHours.tue +
        log.dailyHours.wed +
        log.dailyHours.thu +
        log.dailyHours.fri +
        log.dailyHours.sat +
        log.dailyHours.sun;
      return acc + sum;
    }, 0);
  }, [projectWorklogs]);

  const approvedCount = useMemo(() => {
    return projectWorklogs.filter((log) => log.status === "Approved").length;
  }, [projectWorklogs]);

  const approvalPercentage = useMemo(() => {
    if (projectWorklogs.length === 0) return 100;
    return Math.round((approvedCount / projectWorklogs.length) * 100);
  }, [approvedCount, projectWorklogs.length]);

  const handleApproveWorklog = (logId: string) => {
    setWorklogData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((pId) => {
        updated[pId] = updated[pId].map((l) =>
          l.id === logId ? { ...l, status: "Approved" as const } : l,
        );
      });
      return updated;
    });
  };

  const handleApproveAll = () => {
    setWorklogData((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((pId) => {
        updated[pId] = updated[pId].map((l) => ({
          ...l,
          status: "Approved" as const,
        }));
      });
      return updated;
    });
  };

  const handleInspectLog = (
    log: EmployeeWeeklyWorklog,
    dayFilter: string = "All",
  ) => {
    setSelectedInspectionLog(log);
    setSelectedDayFilter(dayFilter);
    setIsInspectModalOpen(true);
  };

  // Filter task logs for the inspection modal by the selected day
  const displayedTaskLogs = useMemo(() => {
    if (!selectedInspectionLog) return [];
    if (selectedDayFilter === "All") {
      return selectedInspectionLog.taskLogs;
    }
    const filterPrefix = selectedDayFilter.slice(0, 3).toLowerCase();
    return selectedInspectionLog.taskLogs.filter(
      (task) =>
        task.day.toLowerCase().startsWith(filterPrefix) ||
        task.day === selectedDayFilter,
    );
  }, [selectedInspectionLog, selectedDayFilter]);

  const displayedHours = useMemo(() => {
    return displayedTaskLogs.reduce((acc, t) => acc + t.hours, 0);
  }, [displayedTaskLogs]);

  const totalEmployeeWeeklyHours = useMemo(() => {
    if (!selectedInspectionLog) return 0;
    const { mon, tue, wed, thu, fri, sat, sun } =
      selectedInspectionLog.dailyHours;
    return mon + tue + wed + thu + fri + sat + sun;
  }, [selectedInspectionLog]);

  // RESTRICTED ACCESS SCREEN FOR NON-ADMIN / NON-PM ROLES
  if (!isAuthorized) {
    return (
      <div className="bg-background flex min-h-screen flex-1 flex-col items-center justify-center p-8 text-center">
        <Card className="bg-card border-border flex max-w-md flex-col items-center gap-4 rounded-none p-8 shadow-2xl">
          <div className="flex h-16 w-16 items-center justify-center rounded-none border border-rose-500/30 bg-rose-500/10 text-rose-500">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-foreground text-lg font-bold">
            Access Restricted &bull; Manager Only
          </h2>
          <p className="text-muted-foreground text-xs leading-relaxed">
            The{" "}
            <span className="text-foreground font-bold">Weekly Worklog</span>{" "}
            module is restricted to{" "}
            <span className="text-primary font-semibold">Admin</span> and{" "}
            <span className="text-primary font-semibold">Project Manager</span>{" "}
            roles for reviewing and approving team timesheets.
          </p>

          <div className="flex w-full flex-col gap-2 pt-2">
            <Button
              onClick={() => setRole("PM")}
              className="bg-primary text-primary-foreground w-full gap-2 rounded-none text-xs font-semibold"
            >
              <Briefcase className="h-4 w-4" /> Switch Role to Project Manager
              (PM)
            </Button>
            <Button
              variant="outline"
              onClick={() => setRole("ADMIN")}
              className="border-border w-full gap-2 rounded-none text-xs font-semibold"
            >
              <ShieldCheck className="h-4 w-4 text-amber-500" /> Switch Role to
              Admin
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background text-foreground min-h-screen w-full space-y-6 p-4 sm:p-6">
      {/* HEADER TITLE BAR */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
              Weekly Worklog Review
            </h1>
            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-none border px-3 py-0.5 text-xs font-semibold">
              {role === "ADMIN" ? "Admin Access" : "PM Access"}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Review and approve project team weekly timesheets, daily hour
            allocations, and task breakdown.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <Button
            size="sm"
            onClick={handleApproveAll}
            className="h-9 cursor-pointer gap-1.5 rounded-none bg-emerald-600 px-4 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700"
          >
            <CheckCircle2 className="h-4 w-4" /> Approve All Pending
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Exporting Weekly Worklog Report (CSV)...")}
            className="border-border hover:bg-secondary h-9 cursor-pointer gap-1.5 rounded-none px-4 text-xs font-semibold"
          >
            <Download className="h-4 w-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* EXECUTIVE METRICS CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: TOTAL LOGGED HOURS */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              TOTAL TEAM HOURS
            </span>
            <div className="bg-primary/10 border-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-none border">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground font-mono text-2xl font-bold tracking-tight">
              {totalWeeklyHours.toFixed(1)} hrs
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Selected Project Weekly Total
            </p>
          </div>
        </Card>

        {/* Card 2: ACTIVE TEAM MEMBERS */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              ACTIVE TEAM MEMBERS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-sky-500/20 bg-sky-500/10 text-sky-600 dark:text-sky-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground text-2xl font-bold tracking-tight">
              {projectWorklogs.length} Employees
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Logging Hours This Week
            </p>
          </div>
        </Card>

        {/* Card 3: AVERAGE DAILY LOG */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              AVERAGE DAILY LOG
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-amber-500/20 bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-foreground font-mono text-2xl font-bold tracking-tight">
              {projectWorklogs.length > 0
                ? (totalWeeklyHours / (projectWorklogs.length * 5)).toFixed(1)
                : "0.0"}{" "}
              hrs/day
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              Target Capacity: 8.0 hrs/day
            </p>
          </div>
        </Card>

        {/* Card 4: APPROVAL STATUS */}
        <Card className="bg-card border-border space-y-3 rounded-none p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              APPROVAL STATUS
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-none border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="font-mono text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {approvalPercentage}%
            </div>
            <p className="text-muted-foreground mt-1 text-[11px]">
              {approvedCount} of {projectWorklogs.length} Approved
            </p>
          </div>
        </Card>
      </div>

      {/* FILTER & CONTROLS STRIP */}
      <Card className="bg-card border-border flex flex-col justify-between gap-4 rounded-none p-4 shadow-xs md:flex-row md:items-center">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* PROJECT SELECTOR DROPDOWN */}
          <div className="flex items-center gap-2">
            <Label className="text-foreground flex items-center gap-1.5 text-xs font-bold whitespace-nowrap">
              <FolderKanban className="text-primary h-3.5 w-3.5" /> Select
              Project:
            </Label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="bg-background border-border text-foreground focus:border-primary h-9 cursor-pointer rounded-none border px-3 pr-8 text-xs font-bold shadow-2xs outline-none"
            >
              <option value="all" className="bg-card text-foreground">
                All Projects
              </option>
              {INITIAL_PROJECTS.map((p) => (
                <option
                  key={p.id}
                  value={p.id}
                  className="bg-card text-foreground"
                >
                  {p.name} ({p.code})
                </option>
              ))}
            </select>
          </div>

          {/* SEARCH EMPLOYEE */}
          <div className="relative w-full sm:w-56">
            <Search className="text-muted-foreground absolute top-2.5 left-3 h-3.5 w-3.5" />
            <Input
              placeholder="Search employee name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-background border-border focus-visible:ring-primary h-9 rounded-none pl-9 text-xs shadow-2xs"
            />
          </div>

          {/* STATUS FILTER */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value as
                    "All" | "Approved" | "Pending Review" | "Changes Requested",
                )
              }
              className="bg-background border-border text-foreground focus:border-primary h-9 cursor-pointer rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
            >
              <option value="All" className="bg-card text-foreground">
                All Statuses
              </option>
              <option value="Approved" className="bg-card text-foreground">
                Approved
              </option>
              <option
                value="Pending Review"
                className="bg-card text-foreground"
              >
                Pending Review
              </option>
              <option
                value="Changes Requested"
                className="bg-card text-foreground"
              >
                Changes Requested
              </option>
            </select>
          </div>
        </div>

        {/* WEEK NAVIGATION PICKER */}
        <div className="border-border bg-background flex items-center gap-2 self-start rounded-none border px-3 py-1.5 shadow-2xs md:self-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev - 1)}
            className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer rounded-none"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="text-foreground min-w-[190px] text-center font-mono text-xs font-bold">
            24 Aug &ndash; 30 Aug 2026 (W35)
          </span>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setWeekOffset((prev) => prev + 1)}
            className="text-muted-foreground hover:text-foreground h-6 w-6 cursor-pointer rounded-none"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {weekOffset !== 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setWeekOffset(0)}
              className="text-primary h-6 cursor-pointer px-2 text-[10px] font-bold hover:underline"
            >
              Current Week
            </Button>
          )}
        </div>
      </Card>

      {/* WEEKLY WORKLOG GRID TABLE */}
      <Card className="bg-card border-border space-y-4 overflow-hidden rounded-none p-4 shadow-xs">
        <div className="border-border/60 flex items-center justify-between border-b pb-3">
          <h2 className="text-foreground flex items-center gap-2 text-sm font-bold">
            <Building2 className="text-primary h-4 w-4" />
            {currentProject.name} &bull; Employee Weekly Log Grid
          </h2>

          <Badge
            variant="outline"
            className="border-border rounded-none px-3 font-mono text-xs font-semibold"
          >
            {projectWorklogs.length} Team Members
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-border bg-secondary/50 text-muted-foreground border-b text-[11px] font-bold uppercase">
                <th className="min-w-[200px] px-4 py-3">Employee & Role</th>
                <th className="px-3 py-3 text-center">Mon (24)</th>
                <th className="px-3 py-3 text-center">Tue (25)</th>
                <th className="px-3 py-3 text-center">Wed (26)</th>
                <th className="px-3 py-3 text-center">Thu (27)</th>
                <th className="px-3 py-3 text-center">Fri (28)</th>
                <th className="text-muted-foreground/60 px-3 py-3 text-center">
                  Sat (29)
                </th>
                <th className="text-muted-foreground/60 px-3 py-3 text-center">
                  Sun (30)
                </th>
                <th className="px-4 py-3 text-center">Total Logged</th>
                <th className="px-4 py-3 text-center">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-border divide-y">
              {projectWorklogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={11}
                    className="text-muted-foreground py-12 text-center text-xs"
                  >
                    No worklogs found for this project filter.
                  </td>
                </tr>
              ) : (
                projectWorklogs.map((log) => {
                  const totalHrs =
                    log.dailyHours.mon +
                    log.dailyHours.tue +
                    log.dailyHours.wed +
                    log.dailyHours.thu +
                    log.dailyHours.fri +
                    log.dailyHours.sat +
                    log.dailyHours.sun;

                  return (
                    <tr
                      key={log.id}
                      onClick={() => handleInspectLog(log)}
                      className="hover:bg-secondary/30 group cursor-pointer transition-colors"
                    >
                      {/* Employee Avatar & Role */}
                      <td className="text-foreground px-4 py-3.5 text-xs font-semibold">
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 text-primary border-primary/20 flex h-8 w-8 shrink-0 items-center justify-center rounded-none border text-xs font-bold">
                            {log.avatar}
                          </div>
                          <div className="flex min-w-0 flex-col">
                            <span className="text-foreground group-hover:text-primary truncate text-xs font-bold transition-colors">
                              {log.name}
                            </span>
                            <span className="text-muted-foreground truncate text-[10px]">
                              {log.designation} &bull;{" "}
                              <span className="text-foreground font-semibold">
                                {log.projectRole}
                              </span>
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Daily Hours Mon - Sun (Clickable per day) */}
                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Mon (24 Aug)");
                        }}
                        title="Click to view Monday (24 Aug) worklog"
                        className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono font-semibold transition-colors"
                      >
                        <span
                          className={cn(
                            log.dailyHours.mon >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.mon.toFixed(1)}h
                        </span>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Tue (25 Aug)");
                        }}
                        title="Click to view Tuesday (25 Aug) worklog"
                        className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono font-semibold transition-colors"
                      >
                        <span
                          className={cn(
                            log.dailyHours.tue >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.tue.toFixed(1)}h
                        </span>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Wed (26 Aug)");
                        }}
                        title="Click to view Wednesday (26 Aug) worklog"
                        className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono font-semibold transition-colors"
                      >
                        <span
                          className={cn(
                            log.dailyHours.wed >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.wed.toFixed(1)}h
                        </span>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Thu (27 Aug)");
                        }}
                        title="Click to view Thursday (27 Aug) worklog"
                        className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono font-semibold transition-colors"
                      >
                        <span
                          className={cn(
                            log.dailyHours.thu >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.thu.toFixed(1)}h
                        </span>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Fri (28 Aug)");
                        }}
                        title="Click to view Friday (28 Aug) worklog"
                        className="hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono font-semibold transition-colors"
                      >
                        <span
                          className={cn(
                            log.dailyHours.fri >= 8
                              ? "font-bold text-emerald-600 dark:text-emerald-400"
                              : "text-foreground",
                          )}
                        >
                          {log.dailyHours.fri.toFixed(1)}h
                        </span>
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Sat (29 Aug)");
                        }}
                        title="Click to view Saturday (29 Aug) worklog"
                        className="text-muted-foreground/60 hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono transition-colors"
                      >
                        {log.dailyHours.sat.toFixed(1)}h
                      </td>

                      <td
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInspectLog(log, "Sun (30 Aug)");
                        }}
                        title="Click to view Sunday (30 Aug) worklog"
                        className="text-muted-foreground/60 hover:bg-primary/20 hover:text-primary cursor-pointer px-3 py-3.5 text-center font-mono transition-colors"
                      >
                        {log.dailyHours.sun.toFixed(1)}h
                      </td>

                      {/* Total Logged */}
                      <td className="px-4 py-3.5 text-center">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-none border px-2.5 py-0.5 font-mono text-xs font-bold",
                            totalHrs >= 40
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
                          )}
                        >
                          {totalHrs.toFixed(1)} / 40.0 hrs
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 text-center">
                        {log.status === "Approved" ? (
                          <span className="inline-flex items-center gap-1 rounded-none border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-3 w-3" /> Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-none border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                            <Clock className="h-3 w-3" /> Pending Review
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {log.status === "Pending Review" && (
                            <Button
                              size="sm"
                              onClick={() => handleApproveWorklog(log.id)}
                              className="h-8 cursor-pointer gap-1 rounded-none bg-emerald-600 px-2.5 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" /> Approve
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleInspectLog(log, "All")}
                            className="border-border hover:bg-secondary h-8 cursor-pointer gap-1 rounded-none px-2.5 text-xs font-semibold"
                          >
                            <Eye className="h-3.5 w-3.5" /> Inspect
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ITEMIZED WORKLOG INSPECTION MODAL */}
      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent className="bg-card border-border rounded-none p-6 shadow-2xl sm:max-w-[700px]">
          <DialogHeader className="border-border flex flex-row items-center justify-between border-b pb-4">
            <div>
              <DialogTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                <Clock className="text-primary h-4 w-4" />
                Worklog Details: {selectedInspectionLog?.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground mt-0.5 font-mono text-xs">
                {selectedInspectionLog?.designation} &bull;{" "}
                {currentProject.name} &bull; 24 Aug – 30 Aug 2026
              </DialogDescription>
            </div>
            {selectedInspectionLog?.status === "Approved" ? (
              <Badge className="rounded-none border border-emerald-500/30 bg-emerald-500/10 text-xs text-emerald-500">
                Approved
              </Badge>
            ) : (
              <Badge className="rounded-none border border-amber-500/30 bg-amber-500/10 text-xs text-amber-500">
                Pending Review
              </Badge>
            )}
          </DialogHeader>

          {/* DAY SELECTION TABS */}
          <div className="border-border/80 flex items-center gap-1.5 overflow-x-auto border-b pt-1 pb-3">
            <span className="text-muted-foreground mr-1 shrink-0 text-xs font-semibold">
              Day Filter:
            </span>
            {[
              { id: "All", label: "All Days" },
              { id: "Mon (24 Aug)", label: "Mon (24)" },
              { id: "Tue (25 Aug)", label: "Tue (25)" },
              { id: "Wed (26 Aug)", label: "Wed (26)" },
              { id: "Thu (27 Aug)", label: "Thu (27)" },
              { id: "Fri (28 Aug)", label: "Fri (28)" },
            ].map((d) => {
              const isActive = selectedDayFilter === d.id;
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setSelectedDayFilter(d.id)}
                  className={cn(
                    "shrink-0 cursor-pointer rounded-none border px-2.5 py-1 text-xs font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:bg-secondary",
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>

          {/* ITEMIZED TASK LOG LIST */}
          <div className="max-h-[55vh] space-y-3 overflow-y-auto py-3 pr-1">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                {selectedDayFilter === "All"
                  ? "Itemized Daily Task Logs (Mon – Fri)"
                  : `Itemized Tasks &bull; ${selectedDayFilter}`}
              </h4>
              <Badge
                variant="outline"
                className="border-border rounded-none font-mono text-[10px]"
              >
                {displayedTaskLogs.length}{" "}
                {displayedTaskLogs.length === 1 ? "task" : "tasks"} &bull;{" "}
                {displayedHours.toFixed(1)} hrs
              </Badge>
            </div>

            {displayedTaskLogs.length === 0 ? (
              <div className="border-border/70 bg-secondary/10 rounded-none border border-dashed py-10 text-center">
                <p className="text-muted-foreground text-xs">
                  No worklog task entries recorded for {selectedDayFilter}.
                </p>
              </div>
            ) : (
              displayedTaskLogs.map((task) => (
                <Card
                  key={task.id}
                  className="bg-background border-border flex flex-col gap-2 rounded-none p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground text-xs font-bold">
                        {task.taskTitle}
                      </span>
                      <Badge
                        variant="outline"
                        className="border-border text-primary rounded-none font-mono text-[9px]"
                      >
                        {task.taskId}
                      </Badge>
                      <Badge className="bg-secondary text-secondary-foreground rounded-none text-[9px]">
                        {task.category}
                      </Badge>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-500">
                      {task.hours.toFixed(1)} hrs
                    </span>
                  </div>

                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {task.notes}
                  </p>

                  <div className="text-muted-foreground border-border/40 mt-1 flex justify-between border-t pt-1.5 font-mono text-[10px]">
                    <span className="text-foreground/80 font-semibold">
                      Logged Date: {task.day}
                    </span>
                    <span>Project: {currentProject.name}</span>
                  </div>
                </Card>
              ))
            )}
          </div>

          <DialogFooter className="border-border flex w-full items-center justify-between border-t pt-3">
            <span className="text-muted-foreground font-mono text-xs">
              {selectedDayFilter === "All" ? (
                <>
                  Total Weekly Log:{" "}
                  <span className="text-foreground font-mono font-bold">
                    {totalEmployeeWeeklyHours.toFixed(1)} hrs
                  </span>
                </>
              ) : (
                <>
                  {selectedDayFilter} Logged:{" "}
                  <span className="text-foreground font-mono font-bold">
                    {displayedHours.toFixed(1)} hrs
                  </span>{" "}
                  <span className="text-muted-foreground">
                    (Weekly: {totalEmployeeWeeklyHours.toFixed(1)} hrs)
                  </span>
                </>
              )}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsInspectModalOpen(false)}
                className="rounded-none text-xs"
              >
                Close
              </Button>
              {selectedInspectionLog?.status !== "Approved" && (
                <Button
                  size="sm"
                  onClick={() => {
                    if (selectedInspectionLog) {
                      handleApproveWorklog(selectedInspectionLog.id);
                      setIsInspectModalOpen(false);
                    }
                  }}
                  className="gap-1.5 rounded-none bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  <Check className="h-3.5 w-3.5" /> Approve Weekly Worklog
                </Button>
              )}
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
