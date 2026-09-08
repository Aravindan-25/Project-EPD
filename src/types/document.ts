export interface HRDocument {
  id: string;
  title: string;
  lastUpdate: string;
  category: string;
  categoryColor: "slate" | "primary";
  version: string;
  status: "Published" | "Expired" | "Draft";
  needsAck: boolean;
  expiresOn?: string;
  downloadCount: number;
  author: string;
  authorAvatar?: string;
  topStripeColor: string;
  fileSize?: string;
  folderId?: string;
}

export interface ExplorerFolder {
  id: string;
  name: string;
  parentId: string | null;
  dateCreated?: string;
}

export const INITIAL_FOLDERS: ExplorerFolder[] = [
  { id: "f-root", name: "HR Vault", parentId: null, dateCreated: "2024-01-01" },
  {
    id: "f-personal",
    name: "Personal Documents",
    parentId: "f-root",
    dateCreated: "2024-01-01",
  },
  {
    id: "f-legal",
    name: "Legal Documents",
    parentId: "f-root",
    dateCreated: "2024-01-01",
  },
  {
    id: "f-legal-policies",
    name: "Policies & Compliance",
    parentId: "f-legal",
    dateCreated: "2024-01-02",
  },
  {
    id: "f-legal-security",
    name: "Security & Ethics",
    parentId: "f-legal",
    dateCreated: "2024-01-03",
  },
  {
    id: "f-financial",
    name: "Financial Documents",
    parentId: "f-root",
    dateCreated: "2024-01-05",
  },
  {
    id: "f-employment",
    name: "Employment Documents",
    parentId: "f-root",
    dateCreated: "2024-01-20",
  },
  {
    id: "f-training",
    name: "Training Certificates",
    parentId: "f-root",
    dateCreated: "2024-02-15",
  },
  {
    id: "f-performance",
    name: "Performance Records",
    parentId: "f-root",
    dateCreated: "2024-03-01",
  },
  {
    id: "f-medical",
    name: "Medical Records",
    parentId: "f-root",
    dateCreated: "2024-01-10",
  },
];

export const INITIAL_HR_DOCUMENTS: HRDocument[] = [
  {
    id: "doc-1",
    title: "Emergency Contact Form",
    lastUpdate: "2024-01-01",
    category: "Personal Documents",
    categoryColor: "primary",
    version: "v.1.1",
    status: "Published",
    needsAck: false,
    downloadCount: 89,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "450 KB",
    folderId: "f-personal",
  },
  {
    id: "doc-2",
    title: "Data Privacy and Security Policy",
    lastUpdate: "2024-01-01",
    category: "Legal Documents",
    categoryColor: "slate",
    version: "v.2.3",
    status: "Published",
    needsAck: true,
    downloadCount: 56,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "1.2 MB",
    folderId: "f-legal-security",
  },
  {
    id: "doc-3",
    title: "Expense Reimbursement Policy",
    lastUpdate: "2024-01-05",
    category: "Financial Documents",
    categoryColor: "slate",
    version: "v.1.6",
    status: "Published",
    needsAck: false,
    downloadCount: 41,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "850 KB",
    folderId: "f-financial",
  },
  {
    id: "doc-4",
    title: "Remote Work Policy",
    lastUpdate: "2024-01-20",
    category: "Employment Documents",
    categoryColor: "primary",
    version: "v.1.4",
    status: "Published",
    needsAck: true,
    downloadCount: 78,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "920 KB",
    folderId: "f-employment",
  },
  {
    id: "doc-5",
    title: "Training and Development Policy",
    lastUpdate: "2024-02-15",
    category: "Training Certificates",
    categoryColor: "slate",
    version: "v.1.2",
    status: "Expired",
    needsAck: false,
    expiresOn: "2025-02-14",
    downloadCount: 34,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "610 KB",
    folderId: "f-training",
  },
  {
    id: "doc-6",
    title: "Performance Evaluation Form",
    lastUpdate: "2024-03-01",
    category: "Performance Records",
    categoryColor: "primary",
    version: "v.2.0",
    status: "Published",
    needsAck: false,
    downloadCount: 67,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "1.5 MB",
    folderId: "f-performance",
  },
  {
    id: "doc-7",
    title: "Health and Safety Guidelines",
    lastUpdate: "2024-01-10",
    category: "Medical Records",
    categoryColor: "slate",
    version: "v.1.8",
    status: "Published",
    needsAck: true,
    downloadCount: 29,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "2.1 MB",
    folderId: "f-medical",
  },
  {
    id: "doc-8",
    title: "Leave Policy Document",
    lastUpdate: "2024-02-01",
    category: "Employment Documents",
    categoryColor: "slate",
    version: "v.1.3",
    status: "Expired",
    needsAck: true,
    expiresOn: "2024-12-31",
    downloadCount: 52,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "780 KB",
    folderId: "f-employment",
  },
  {
    id: "doc-9",
    title: "Code of Conduct & Ethics",
    lastUpdate: "2024-03-10",
    category: "Legal Documents",
    categoryColor: "primary",
    version: "v.3.0",
    status: "Published",
    needsAck: true,
    downloadCount: 94,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "1.1 MB",
    folderId: "f-legal-policies",
  },
  {
    id: "doc-10",
    title: "IT Security & Acceptable Use Policy",
    lastUpdate: "2024-03-15",
    category: "Legal Documents",
    categoryColor: "slate",
    version: "v.1.5",
    status: "Published",
    needsAck: true,
    downloadCount: 88,
    author: "Company",
    topStripeColor: "hsl(var(--primary))",
    fileSize: "1.4 MB",
    folderId: "f-legal-security",
  },
];
