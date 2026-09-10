"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MessageSquare,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Reply,
  Pin,
  Copy,
  Edit3,
  Trash2,
  Plus,
  Search,
  Users,
  CheckCheck,
  Megaphone,
  UserPlus,
  UserMinus,
  Info,
  X,
  FileText,
  Image as ImageIcon,
  FileArchive,
  Eye,
  Download,
  Check,
  AtSign,
  ChevronDown,
  ChevronUp,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { useUserRole } from "@/lib/user-role-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ----------------------------------------------------
// TYPES & MOCK DATA STRUCTURES
// ----------------------------------------------------

export interface GroupMember {
  id: string;
  name: string;
  role: "PM" | "EMPLOYEE" | "ADMIN";
  designation: string;
  avatar: string;
  isOnline: boolean;
  statusText?: string;
}

export interface ProjectGroup {
  id: string;
  projectId: string;
  projectName: string;
  name: string;
  unreadCount: number;
  members: GroupMember[];
}

export interface AttachmentItem {
  id: string;
  fileName: string;
  fileType: "PDF" | "DOCX" | "XLSX" | "ZIP" | "PNG" | "JPG";
  fileSize: string;
  url?: string;
}

export interface ReactionItem {
  emoji: string;
  count: number;
  users: string[]; // user names who reacted
}

export interface ChatMessage {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string;
  content: string;
  timestamp: string;
  date: string;
  isRead: boolean;
  isPinned: boolean;
  isEdited?: boolean;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions: ReactionItem[];
  attachments?: AttachmentItem[];
  mentions?: string[];
}

export interface Announcement {
  id: string;
  groupId: string;
  title: string;
  message: string;
  postedBy: string;
  postedByRole: string;
  timestamp: string;
  isPinned: boolean;
  isRead: boolean;
}

// Initial Mock Members
const ALL_CANDIDATE_MEMBERS: GroupMember[] = [
  {
    id: "usr-pm",
    name: "David Miller",
    role: "PM",
    designation: "Senior Project Manager",
    avatar: "DM",
    isOnline: true,
  },
  {
    id: "usr-emp-1",
    name: "Peer Mohamed Nafees J",
    role: "EMPLOYEE",
    designation: "Software Engineer",
    avatar: "PN",
    isOnline: true,
  },
  {
    id: "usr-emp-2",
    name: "Sarah Chen",
    role: "EMPLOYEE",
    designation: "Production Lead",
    avatar: "SC",
    isOnline: true,
    statusText: "Typing...",
  },
  {
    id: "usr-emp-3",
    name: "Alex Rivera",
    role: "EMPLOYEE",
    designation: "QC Specialist",
    avatar: "AR",
    isOnline: false,
  },
  {
    id: "usr-emp-4",
    name: "Michael Scott",
    role: "EMPLOYEE",
    designation: "Operations Lead",
    avatar: "MS",
    isOnline: false,
  },
  {
    id: "usr-emp-5",
    name: "Emma Watson",
    role: "EMPLOYEE",
    designation: "UI/UX Designer",
    avatar: "EW",
    isOnline: true,
  },
  {
    id: "usr-emp-6",
    name: "Robert Downey",
    role: "EMPLOYEE",
    designation: "Backend Developer",
    avatar: "RD",
    isOnline: false,
  },
  {
    id: "usr-emp-7",
    name: "Dwight Schrute",
    role: "EMPLOYEE",
    designation: "Assistant Manager",
    avatar: "DS",
    isOnline: true,
  },
  {
    id: "usr-emp-8",
    name: "Jim Halpert",
    role: "EMPLOYEE",
    designation: "Frontend Engineer",
    avatar: "JH",
    isOnline: false,
  },
];

// Initial Groups
const INITIAL_GROUPS: ProjectGroup[] = [
  {
    id: "g-alpha",
    projectId: "proj-1",
    projectName: "Project Alpha",
    name: "Project Alpha Team",
    unreadCount: 2,
    members: ALL_CANDIDATE_MEMBERS.slice(0, 5),
  },
  {
    id: "g-beta",
    projectId: "proj-2",
    projectName: "Project Beta",
    name: "Project Beta Team",
    unreadCount: 0,
    members: [
      ALL_CANDIDATE_MEMBERS[0],
      ALL_CANDIDATE_MEMBERS[1],
      ALL_CANDIDATE_MEMBERS[5],
      ALL_CANDIDATE_MEMBERS[6],
    ],
  },
  {
    id: "g-gamma",
    projectId: "proj-3",
    projectName: "Project Gamma",
    name: "Project Gamma Team",
    unreadCount: 1,
    members: [
      ALL_CANDIDATE_MEMBERS[0],
      ALL_CANDIDATE_MEMBERS[7],
      ALL_CANDIDATE_MEMBERS[8],
    ],
  },
];

// Initial Messages
const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  "g-alpha": [
    {
      id: "msg-1",
      groupId: "g-alpha",
      senderId: "usr-emp-2",
      senderName: "Sarah Chen",
      senderAvatar: "SC",
      senderRole: "Production Lead",
      content: "Production completed for SEG-004.",
      timestamp: "10:32 AM",
      date: "Today",
      isRead: true,
      isPinned: false,
      reactions: [
        { emoji: "👍", count: 2, users: ["Peer Mohamed Nafees J", "David Miller"] },
        { emoji: "🎉", count: 1, users: ["David Miller"] },
      ],
    },
    {
      id: "msg-2",
      groupId: "g-alpha",
      senderId: "usr-pm",
      senderName: "David Miller",
      senderAvatar: "DM",
      senderRole: "PM",
      content: "Okay, I will allocate the next segment.",
      timestamp: "10:34 AM",
      date: "Today",
      isRead: true,
      isPinned: false,
      replyTo: {
        id: "msg-1",
        senderName: "Sarah Chen",
        content: "Production completed for SEG-004.",
      },
      reactions: [],
    },
    {
      id: "msg-3",
      groupId: "g-alpha",
      senderId: "usr-emp-1",
      senderName: "Peer Mohamed Nafees J",
      senderAvatar: "PN",
      senderRole: "Software Engineer",
      content: "SEG-005 requires QC. @Alex Rivera please review when free.",
      timestamp: "10:40 AM",
      date: "Today",
      isRead: true,
      isPinned: false,
      mentions: ["Alex Rivera"],
      reactions: [{ emoji: "👀", count: 1, users: ["Alex Rivera"] }],
    },
    {
      id: "msg-4",
      groupId: "g-alpha",
      senderId: "usr-emp-2",
      senderName: "Sarah Chen",
      senderAvatar: "SC",
      senderRole: "Production Lead",
      content: "Here are the QC inspection documents and batch logs for SEG-004.",
      timestamp: "10:45 AM",
      date: "Today",
      isRead: true,
      isPinned: false,
      attachments: [
        {
          id: "att-1",
          fileName: "SEG-004_QC_Inspection_Report.pdf",
          fileType: "PDF",
          fileSize: "2.4 MB",
        },
        {
          id: "att-2",
          fileName: "Batch_003_Metrics.xlsx",
          fileType: "XLSX",
          fileSize: "1.1 MB",
        },
      ],
      reactions: [],
    },
    {
      id: "msg-5",
      groupId: "g-alpha",
      senderId: "usr-emp-3",
      senderName: "Alex Rivera",
      senderAvatar: "AR",
      senderRole: "QC Specialist",
      content: "SEG-006 returned for Production Rework due to minor schema mismatch in field #4.",
      timestamp: "10:50 AM",
      date: "Today",
      isRead: true,
      isPinned: true,
      reactions: [{ emoji: "🔥", count: 1, users: ["Sarah Chen"] }],
    },
  ],
  "g-beta": [
    {
      id: "msg-b1",
      groupId: "g-beta",
      senderId: "usr-pm",
      senderName: "David Miller",
      senderAvatar: "DM",
      senderRole: "PM",
      content: "Welcome to Project Beta Chatty group. Please complete UI design reviews.",
      timestamp: "09:15 AM",
      date: "Today",
      isRead: true,
      isPinned: true,
      reactions: [{ emoji: "🚀", count: 2, users: ["Emma Watson", "Peer Mohamed Nafees J"] }],
    },
    {
      id: "msg-b2",
      groupId: "g-beta",
      senderId: "usr-emp-5",
      senderName: "Emma Watson",
      senderAvatar: "EW",
      senderRole: "UI/UX Designer",
      content: "Attached the preliminary wireframes for the workspace redesign.",
      timestamp: "09:30 AM",
      date: "Today",
      isRead: true,
      isPinned: false,
      attachments: [
        {
          id: "att-b1",
          fileName: "Project_Beta_Wireframes_v1.pdf",
          fileType: "PDF",
          fileSize: "4.8 MB",
        },
      ],
      reactions: [],
    },
  ],
  "g-gamma": [
    {
      id: "msg-g1",
      groupId: "g-gamma",
      senderId: "usr-emp-7",
      senderName: "Dwight Schrute",
      senderAvatar: "DS",
      senderRole: "Assistant Manager",
      content: "Batch 101 data extraction has commenced.",
      timestamp: "Yesterday",
      date: "Yesterday",
      isRead: true,
      isPinned: false,
      reactions: [],
    },
  ],
};

// Initial Announcements
const INITIAL_ANNOUNCEMENTS: Record<string, Announcement[]> = {
  "g-alpha": [
    {
      id: "ann-1",
      groupId: "g-alpha",
      title: "Sprint 4 Quality & Delivery Deadline",
      message:
        "All team members must submit their daily worklogs before 6:00 PM today. SEG-001 through SEG-005 QC inspection must be finalized prior to Friday build release.",
      postedBy: "David Miller",
      postedByRole: "PM",
      timestamp: "Today at 09:00 AM",
      isPinned: true,
      isRead: true,
    },
    {
      id: "ann-2",
      groupId: "g-alpha",
      title: "New Batch Allocation: Batch 003 Released",
      message:
        "Batch 003 has been allocated to Production Team Alpha. Please verify your assigned work segment worklist under My Work.",
      postedBy: "David Miller",
      postedByRole: "PM",
      timestamp: "Yesterday at 04:30 PM",
      isPinned: false,
      isRead: true,
    },
  ],
  "g-beta": [
    {
      id: "ann-b1",
      groupId: "g-beta",
      title: "Project Beta Design Sprint Kickoff",
      message:
        "Design assets and component tokens are available in Figma. All feedback should be shared directly in this Chatty group.",
      postedBy: "David Miller",
      postedByRole: "PM",
      timestamp: "Today at 08:30 AM",
      isPinned: true,
      isRead: true,
    },
  ],
  "g-gamma": [],
};

const EMOJI_OPTIONS = ["👍", "❤️", "🔥", "🎉", "👀", "🚀"];

export function ChattyView() {
  const { role, currentProfile } = useUserRole();

  // State
  const [groups, setGroups] = useState<ProjectGroup[]>(INITIAL_GROUPS);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("g-alpha");
  const [activeTab, setActiveTab] = useState<"Chat" | "Announcements">("Chat");

  // Messages & Announcements State
  const [messagesMap, setMessagesMap] =
    useState<Record<string, ChatMessage[]>>(INITIAL_MESSAGES);
  const [announcementsMap, setAnnouncementsMap] = useState<
    Record<string, Announcement[]>
  >(INITIAL_ANNOUNCEMENTS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [highlightedMsgId, setHighlightedMsgId] = useState<string | null>(null);

  // Message Composer State
  const [composerText, setComposerText] = useState("");
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [editingMsg, setEditingMsg] = useState<ChatMessage | null>(null);
  const [attachedFile, setAttachedFile] = useState<AttachmentItem | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);

  // Pinned Messages Collapsible State
  const [pinnedExpanded, setPinnedExpanded] = useState(true);

  // Modals State
  const [showMembersModal, setShowMembersModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showGroupInfoModal, setShowGroupInfoModal] = useState(false);
  const [showCreateAnnModal, setShowCreateAnnModal] = useState(false);
  const [previewAttachment, setPreviewAttachment] = useState<AttachmentItem | null>(null);

  // Form State for Create Announcement Modal
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");

  // Ref for Chat Scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Current User Info based on profile / role
  const isPM = role === "PM" || role === "ADMIN";
  const currentUserName =
    currentProfile?.name || (isPM ? "David Miller" : "Peer Mohamed Nafees J");
  const currentUserAvatar = currentProfile?.avatar || (isPM ? "DM" : "PN");
  const currentUserRole = isPM ? "PM" : "Software Engineer";

  // Filter groups according to project membership rule:
  // PM sees all managed groups; Employees see assigned project groups (e.g. g-alpha & g-beta)
  const visibleGroups = groups.filter((g) => {
    if (isPM) return true;
    // Employee membership check: check if employee name/id is in group.members
    return g.members.some(
      (m) =>
        m.name === currentUserName ||
        m.id === "usr-emp-1" ||
        m.name.includes("Nafees"),
    );
  });

  // Selected Group
  const activeGroup =
    groups.find((g) => g.id === selectedGroupId) || visibleGroups[0] || groups[0];

  // Active Messages
  const currentMessages = messagesMap[activeGroup.id] || [];
  const pinnedMessages = currentMessages.filter((m) => m.isPinned);

  // Active Announcements
  const currentAnnouncements = announcementsMap[activeGroup.id] || [];

  // Clear unread count when switching group
  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setGroups((prev) =>
      prev.map((g) => (g.id === groupId ? { ...g, unreadCount: 0 } : g)),
    );
  };

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages.length, selectedGroupId]);

  // ----------------------------------------------------
  // MESSAGE ACTIONS
  // ----------------------------------------------------

  const handleSendMessage = () => {
    if (!composerText.trim() && !attachedFile) return;

    if (editingMsg) {
      // Edit mode
      setMessagesMap((prev) => ({
        ...prev,
        [activeGroup.id]: (prev[activeGroup.id] || []).map((m) =>
          m.id === editingMsg.id
            ? { ...m, content: composerText.trim(), isEdited: true }
            : m,
        ),
      }));
      toast.success("Message updated");
      setEditingMsg(null);
      setComposerText("");
      return;
    }

    // New Message
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      groupId: activeGroup.id,
      senderId: isPM ? "usr-pm" : "usr-emp-1",
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      senderRole: currentUserRole,
      content: composerText.trim(),
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: "Today",
      isRead: true,
      isPinned: false,
      replyTo: replyingTo
        ? {
            id: replyingTo.id,
            senderName: replyingTo.senderName,
            content: replyingTo.content,
          }
        : undefined,
      attachments: attachedFile ? [attachedFile] : undefined,
      reactions: [],
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeGroup.id]: [...(prev[activeGroup.id] || []), newMsg],
    }));

    setComposerText("");
    setReplyingTo(null);
    setAttachedFile(null);
    setShowEmojiPicker(false);
    setShowAttachMenu(false);
  };

  const handleTogglePinMessage = (msgId: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeGroup.id]: (prev[activeGroup.id] || []).map((m) => {
        if (m.id !== msgId) return m;
        const newPinned = !m.isPinned;
        toast.info(newPinned ? "Message pinned" : "Message unpinned");
        return { ...m, isPinned: newPinned };
      }),
    }));
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeGroup.id]: (prev[activeGroup.id] || []).filter((m) => m.id !== msgId),
    }));
    toast.success("Message deleted");
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  };

  const handleToggleReaction = (msgId: string, emoji: string) => {
    setMessagesMap((prev) => ({
      ...prev,
      [activeGroup.id]: (prev[activeGroup.id] || []).map((m) => {
        if (m.id !== msgId) return m;
        const existingReaction = m.reactions.find((r) => r.emoji === emoji);
        let updatedReactions = [...m.reactions];

        if (existingReaction) {
          const userAlreadyReacted = existingReaction.users.includes(currentUserName);
          if (userAlreadyReacted) {
            // Remove user reaction
            updatedReactions = updatedReactions
              .map((r) =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count - 1,
                      users: r.users.filter((u) => u !== currentUserName),
                    }
                  : r,
              )
              .filter((r) => r.count > 0);
          } else {
            // Add user reaction
            updatedReactions = updatedReactions.map((r) =>
              r.emoji === emoji
                ? {
                    ...r,
                    count: r.count + 1,
                    users: [...r.users, currentUserName],
                  }
                : r,
            );
          }
        } else {
          // New reaction
          updatedReactions.push({
            emoji,
            count: 1,
            users: [currentUserName],
          });
        }
        return { ...m, reactions: updatedReactions };
      }),
    }));
  };

  // ----------------------------------------------------
  // ANNOUNCEMENT ACTIONS
  // ----------------------------------------------------

  const handleCreateAnnouncement = () => {
    if (!annTitle.trim() || !annMessage.trim()) {
      toast.error("Please fill in all announcement fields");
      return;
    }

    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      groupId: activeGroup.id,
      title: annTitle.trim(),
      message: annMessage.trim(),
      postedBy: currentUserName,
      postedByRole: currentUserRole,
      timestamp: `Today at ${new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`,
      isPinned: false,
      isRead: true,
    };

    setAnnouncementsMap((prev) => ({
      ...prev,
      [activeGroup.id]: [newAnn, ...(prev[activeGroup.id] || [])],
    }));

    toast.success("Announcement posted successfully");
    setShowCreateAnnModal(false);
    setAnnTitle("");
    setAnnMessage("");
  };

  const handleTogglePinAnnouncement = (annId: string) => {
    setAnnouncementsMap((prev) => ({
      ...prev,
      [activeGroup.id]: (prev[activeGroup.id] || []).map((a) =>
        a.id === annId ? { ...a, isPinned: !a.isPinned } : a,
      ),
    }));
    toast.info("Announcement pin status updated");
  };

  const handleDeleteAnnouncement = (annId: string) => {
    setAnnouncementsMap((prev) => ({
      ...prev,
      [activeGroup.id]: (prev[activeGroup.id] || []).filter((a) => a.id !== annId),
    }));
    toast.success("Announcement deleted");
  };

  // ----------------------------------------------------
  // GROUP MEMBER MANAGEMENT (PM ONLY)
  // ----------------------------------------------------

  const handleAddMemberToGroup = (candidate: GroupMember) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroup.id
          ? {
              ...g,
              members: [...g.members, candidate],
            }
          : g,
      ),
    );
    toast.success(`${candidate.name} added to ${activeGroup.name}`);
  };

  const handleRemoveMemberFromGroup = (memberId: string, memberName: string) => {
    setGroups((prev) =>
      prev.map((g) =>
        g.id === activeGroup.id
          ? {
              ...g,
              members: g.members.filter((m) => m.id !== memberId),
            }
          : g,
      ),
    );
    toast.success(`${memberName} removed from ${activeGroup.name}`);
  };

  // Filter messages for search
  const filteredMessages = searchQuery.trim()
    ? currentMessages.filter(
        (m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.senderName.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : currentMessages;

  // Candidates available to add to selected group
  const nonGroupMembers = ALL_CANDIDATE_MEMBERS.filter(
    (c) => !activeGroup.members.some((m) => m.id === c.id),
  );

  const onlineCount = activeGroup.members.filter((m) => m.isOnline).length;

  return (
    <div className="bg-background text-foreground flex h-[calc(100vh-4rem)] w-full overflow-hidden">
      {/* ==================================================== */}
      {/* 1. LEFT PANEL: MY GROUPS                             */}
      {/* ==================================================== */}
      <div className="border-border bg-card/40 flex w-72 shrink-0 flex-col border-r md:w-80">
        {/* Header */}
        <div className="border-border flex items-center justify-between border-b p-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-primary/20 text-primary border-primary/30 flex h-8 w-8 items-center justify-center rounded-lg border">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-foreground text-sm font-bold tracking-tight">
                My Groups
              </h2>
              <p className="text-muted-foreground text-[11px]">
                Project Team Communications
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-primary/30 bg-primary/10 text-primary text-[10px] font-bold"
          >
            {visibleGroups.length} Groups
          </Badge>
        </div>

        {/* Groups List */}
        <div className="flex-1 space-y-1 overflow-y-auto p-2">
          {visibleGroups.map((group) => {
            const isSelected = group.id === activeGroup.id;
            const groupOnlineCount = group.members.filter((m) => m.isOnline).length;

            return (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelectGroup(group.id)}
                className={`w-full cursor-pointer rounded-xl p-3 text-left transition-all ${
                  isSelected
                    ? "bg-primary/15 border-primary/40 border shadow-xs"
                    : "hover:bg-secondary/60 border-transparent border"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-bold">
                      {group.name}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {group.projectName}
                    </span>
                  </div>

                  {group.unreadCount > 0 && !isSelected && (
                    <Badge className="bg-rose-500 text-white border-none text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                      {group.unreadCount} unread
                    </Badge>
                  )}
                </div>

                <div className="mt-2.5 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>
                      {group.members.length} Members &bull; {groupOnlineCount} Online
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* User Presence Footer */}
        <div className="border-border bg-card/60 flex items-center gap-3 border-t p-3">
          <div className="relative">
            <div className="bg-primary/20 border-primary/40 text-primary flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
              {currentUserAvatar}
            </div>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
          </div>
          <div className="flex flex-col truncate">
            <span className="text-foreground truncate text-xs font-bold">
              {currentUserName}
            </span>
            <span className="text-muted-foreground truncate text-[10px]">
              {currentUserRole} &bull; <span className="text-emerald-500 font-semibold">Online</span>
            </span>
          </div>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 2. RIGHT PANEL: SELECTED PROJECT GROUP               */}
      {/* ==================================================== */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* GROUP HEADER */}
        <div className="border-border bg-card flex flex-wrap items-center justify-between border-b px-5 py-3 gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-foreground text-base font-bold">
                {activeGroup.name}
              </h1>
              <Badge variant="outline" className="text-[10px] font-bold uppercase">
                {activeGroup.projectName}
              </Badge>
            </div>
            <p className="text-muted-foreground flex items-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                {activeGroup.members.length} Members &bull; {onlineCount} Online
              </span>
              <span>&bull;</span>
              <span className="text-emerald-400 font-medium">
                Sarah Chen is typing...
              </span>
            </p>
          </div>

          {/* Group Header Actions */}
          <div className="flex items-center gap-2">
            {/* Search Bar Toggle */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSearchInput(!showSearchInput)}
              className={`h-8 cursor-pointer text-xs gap-1.5 ${
                showSearchInput ? "bg-primary/20 text-primary border-primary" : ""
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search</span>
            </Button>

            {/* PM Group Actions Menu */}
            {isPM ? (
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMembersModal(true)}
                  className="h-8 cursor-pointer text-xs gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Members ({activeGroup.members.length})</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddMemberModal(true)}
                  className="h-8 cursor-pointer text-xs gap-1.5 border-emerald-500/40 text-emerald-500 hover:bg-emerald-500/10"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>Add Member</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGroupInfoModal(true)}
                  className="h-8 cursor-pointer text-xs"
                  title="Group Information"
                >
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              /* Employee Group Actions Menu */
              <div className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowMembersModal(true)}
                  className="h-8 cursor-pointer text-xs gap-1.5"
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>View Members</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGroupInfoModal(true)}
                  className="h-8 cursor-pointer text-xs"
                  title="Group Information"
                >
                  <Info className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* TABS NAVIGATION: CHAT | ANNOUNCEMENTS */}
        <div className="border-border bg-card/60 flex items-center justify-between border-b px-5 py-2">
          <div className="flex items-center gap-1 bg-secondary/50 p-1 rounded-lg border border-border/60">
            <button
              type="button"
              onClick={() => setActiveTab("Chat")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${
                activeTab === "Chat"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Chat</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("Announcements")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${
                activeTab === "Announcements"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Megaphone className="h-3.5 w-3.5" />
              <span>Announcements</span>
              {currentAnnouncements.length > 0 && (
                <Badge className="bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0 py-0.5 rounded-full ml-1">
                  {currentAnnouncements.length}
                </Badge>
              )}
            </button>
          </div>

          {/* PM Action for Announcements */}
          {activeTab === "Announcements" && isPM && (
            <Button
              type="button"
              onClick={() => setShowCreateAnnModal(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 cursor-pointer text-xs font-bold gap-1.5"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Announcement</span>
            </Button>
          )}
        </div>

        {/* SEARCH BAR INPUT OVERLAY */}
        {showSearchInput && (
          <div className="border-border bg-secondary/30 flex items-center gap-3 border-b px-5 py-2.5">
            <Search className="text-muted-foreground h-4 w-4 shrink-0" />
            <input
              type="text"
              placeholder={`Search messages in ${activeGroup.name}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-card border-border text-foreground focus:border-primary flex-1 rounded-lg border px-3 py-1.5 text-xs outline-none"
              autoFocus
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-muted-foreground hover:text-foreground text-xs font-bold"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setShowSearchInput(false);
                setSearchQuery("");
              }}
              className="text-muted-foreground hover:text-foreground p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* TAB 1: CHAT CONTENT */}
        {activeTab === "Chat" && (
          <div className="flex flex-1 flex-col overflow-hidden bg-background/50">
            {/* PINNED MESSAGES BANNER */}
            {pinnedMessages.length > 0 && (
              <div className="border-border/80 bg-primary/10 border-b px-5 py-2">
                <button
                  type="button"
                  onClick={() => setPinnedExpanded(!pinnedExpanded)}
                  className="flex w-full cursor-pointer items-center justify-between text-xs font-bold text-primary"
                >
                  <div className="flex items-center gap-2">
                    <Pin className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                    <span>Pinned Messages ({pinnedMessages.length})</span>
                  </div>
                  {pinnedExpanded ? (
                    <ChevronUp className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronDown className="h-3.5 w-3.5" />
                  )}
                </button>

                {pinnedExpanded && (
                  <div className="mt-2 space-y-2 max-h-28 overflow-y-auto">
                    {pinnedMessages.map((pm) => (
                      <div
                        key={pm.id}
                        className="bg-card/80 border-primary/30 flex items-center justify-between rounded-lg border px-3 py-2 text-xs"
                      >
                        <div className="flex flex-col truncate">
                          <span className="font-bold text-foreground">
                            {pm.senderName}:
                          </span>
                          <span className="text-muted-foreground truncate">
                            {pm.content}
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTogglePinMessage(pm.id)}
                          className="h-6 px-2 text-[10px] text-muted-foreground hover:text-rose-400"
                        >
                          Unpin
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* MESSAGES LIST AREA */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {/* Date Separator */}
              <div className="flex items-center justify-center my-2">
                <span className="bg-secondary text-muted-foreground rounded-full px-3 py-1 text-[10px] font-bold">
                  Today, September 10, 2026
                </span>
              </div>

              {filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-40" />
                  <p className="text-xs font-semibold">No messages found</p>
                  <p className="text-[11px]">
                    Start the conversation in {activeGroup.name}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isOwn =
                    msg.senderName === currentUserName ||
                    msg.senderId === (isPM ? "usr-pm" : "usr-emp-1");

                  return (
                    <div
                      key={msg.id}
                      className={`group flex items-start gap-3 ${
                        isOwn ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold border ${
                          isOwn
                            ? "bg-primary/20 border-primary/40 text-primary"
                            : "bg-secondary border-border text-foreground"
                        }`}
                      >
                        {msg.senderAvatar}
                      </div>

                      {/* Message Bubble Container */}
                      <div
                        className={`flex max-w-[75%] flex-col space-y-1 ${
                          isOwn ? "items-end" : "items-start"
                        }`}
                      >
                        {/* Header: Sender Name + Role + Time */}
                        <div className="flex items-center gap-2 text-[11px]">
                          <span className="font-bold text-foreground">
                            {msg.senderName}
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            ({msg.senderRole})
                          </span>
                          <span className="text-muted-foreground text-[10px]">
                            {msg.timestamp}
                          </span>
                        </div>

                        {/* Reply Indicator Preview if message is a reply */}
                        {msg.replyTo && (
                          <div className="bg-secondary/80 border-primary/40 border-l-2 rounded-r-md px-3 py-1.5 text-xs text-muted-foreground">
                            <span className="font-bold text-primary block text-[10px]">
                              Replying to {msg.replyTo.senderName}
                            </span>
                            <span className="line-clamp-1 italic text-[11px]">
                              "{msg.replyTo.content}"
                            </span>
                          </div>
                        )}

                        {/* Message Bubble */}
                        <div
                          className={`relative rounded-2xl px-4 py-2.5 text-xs shadow-2xs ${
                            isOwn
                              ? "bg-primary text-primary-foreground rounded-tr-xs"
                              : "bg-card border-border/80 text-foreground border rounded-tl-xs"
                          }`}
                        >
                          {/* Content with Mentions Support */}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {msg.content}
                          </p>

                          {msg.isEdited && (
                            <span className="text-[9px] opacity-70 italic ml-1">
                              (edited)
                            </span>
                          )}

                          {/* Attachments Display */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-1.5 pt-1">
                              {msg.attachments.map((att) => (
                                <div
                                  key={att.id}
                                  className="bg-background/80 border-border/80 flex items-center justify-between rounded-lg border p-2 text-xs"
                                >
                                  <div className="flex items-center gap-2 overflow-hidden">
                                    {att.fileType === "PDF" ? (
                                      <FileText className="h-4 w-4 text-rose-500 shrink-0" />
                                    ) : att.fileType === "XLSX" ? (
                                      <FileText className="h-4 w-4 text-emerald-500 shrink-0" />
                                    ) : att.fileType === "ZIP" ? (
                                      <FileArchive className="h-4 w-4 text-amber-500 shrink-0" />
                                    ) : (
                                      <ImageIcon className="h-4 w-4 text-blue-500 shrink-0" />
                                    )}
                                    <div className="flex flex-col truncate">
                                      <span className="font-bold text-foreground truncate text-[11px]">
                                        {att.fileName}
                                      </span>
                                      <span className="text-muted-foreground text-[9px]">
                                        {att.fileType} &bull; {att.fileSize}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-1 shrink-0 ml-2">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => setPreviewAttachment(att)}
                                      className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                                      title="Open / View"
                                    >
                                      <Eye className="h-3.5 w-3.5" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        toast.success(`Downloading ${att.fileName}`)
                                      }
                                      className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                                      title="Download"
                                    >
                                      <Download className="h-3.5 w-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Message Action Menu (Visible on Hover / Options) */}
                          <div
                            className={`absolute top-1 ${
                              isOwn ? "-left-20" : "-right-20"
                            } opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-card border border-border rounded-lg p-0.5 shadow-md z-10`}
                          >
                            {/* React */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleReaction(msg.id, "👍")}
                              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="React 👍"
                            >
                              <Smile className="h-3.5 w-3.5" />
                            </Button>

                            {/* Reply */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setReplyingTo(msg);
                                setEditingMsg(null);
                              }}
                              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Reply"
                            >
                              <Reply className="h-3.5 w-3.5" />
                            </Button>

                            {/* Copy */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyMessage(msg.content)}
                              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                              title="Copy"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>

                            {/* Pin */}
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleTogglePinMessage(msg.id)}
                              className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                              title={msg.isPinned ? "Unpin" : "Pin"}
                            >
                              <Pin className="h-3.5 w-3.5" />
                            </Button>

                            {/* Own Message Actions: Edit & Delete */}
                            {isOwn && (
                              <>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    setEditingMsg(msg);
                                    setComposerText(msg.content);
                                    setReplyingTo(null);
                                  }}
                                  className="h-6 w-6 text-muted-foreground hover:text-foreground cursor-pointer"
                                  title="Edit"
                                >
                                  <Edit3 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="h-6 w-6 text-rose-400 hover:text-rose-500 cursor-pointer"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Reactions Bar Below Bubble */}
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1 mt-1">
                            {msg.reactions.map((r, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleToggleReaction(msg.id, r.emoji)}
                                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] cursor-pointer transition-all ${
                                  r.users.includes(currentUserName)
                                    ? "bg-primary/20 border-primary text-primary font-bold"
                                    : "bg-secondary/60 border-border text-muted-foreground hover:bg-secondary"
                                }`}
                                title={r.users.join(", ")}
                              >
                                <span>{r.emoji}</span>
                                <span>{r.count}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* MESSAGE COMPOSER */}
            <div className="border-border bg-card p-3 border-t">
              {/* Replying Banner */}
              {replyingTo && (
                <div className="mb-2 bg-secondary/80 border-primary/40 border-l-2 flex items-center justify-between rounded-r-lg px-3 py-1.5 text-xs">
                  <div className="flex flex-col">
                    <span className="font-bold text-primary text-[10px]">
                      Replying to {replyingTo.senderName}
                    </span>
                    <span className="text-muted-foreground truncate text-[11px]">
                      "{replyingTo.content}"
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Editing Banner */}
              {editingMsg && (
                <div className="mb-2 bg-amber-500/10 border-amber-500/40 border-l-2 flex items-center justify-between rounded-r-lg px-3 py-1.5 text-xs">
                  <span className="font-bold text-amber-500 text-[10px]">
                    Editing message...
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMsg(null);
                      setComposerText("");
                    }}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Attachment Preview Banner */}
              {attachedFile && (
                <div className="mb-2 bg-primary/10 border-primary/30 flex items-center justify-between rounded-lg border px-3 py-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-3.5 w-3.5 text-primary" />
                    <span className="font-bold text-foreground">
                      {attachedFile.fileName}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      ({attachedFile.fileSize})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="text-muted-foreground hover:text-foreground p-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <div className="mb-2 flex items-center gap-2 bg-secondary/80 border border-border p-2 rounded-xl">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => {
                        setComposerText((prev) => prev + emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="hover:scale-125 transition-transform text-lg cursor-pointer p-1"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}

              {/* Attachment Picker Menu */}
              {showAttachMenu && (
                <div className="mb-2 grid grid-cols-2 gap-2 bg-secondary/80 border border-border p-2 rounded-xl text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile({
                        id: `att-${Date.now()}`,
                        fileName: "Project_Alpha_Summary.pdf",
                        fileType: "PDF",
                        fileSize: "1.8 MB",
                      });
                      setShowAttachMenu(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-card rounded-lg text-left cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-rose-500" />
                    <span>PDF Document</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile({
                        id: `att-${Date.now()}`,
                        fileName: "Production_Data.xlsx",
                        fileType: "XLSX",
                        fileSize: "2.1 MB",
                      });
                      setShowAttachMenu(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-card rounded-lg text-left cursor-pointer"
                  >
                    <FileText className="h-4 w-4 text-emerald-500" />
                    <span>XLSX Spreadsheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile({
                        id: `att-${Date.now()}`,
                        fileName: "Code_Archive_SEG.zip",
                        fileType: "ZIP",
                        fileSize: "5.4 MB",
                      });
                      setShowAttachMenu(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-card rounded-lg text-left cursor-pointer"
                  >
                    <FileArchive className="h-4 w-4 text-amber-500" />
                    <span>ZIP Archive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAttachedFile({
                        id: `att-${Date.now()}`,
                        fileName: "Screenshot_QC_Error.png",
                        fileType: "PNG",
                        fileSize: "850 KB",
                      });
                      setShowAttachMenu(false);
                    }}
                    className="flex items-center gap-2 p-2 hover:bg-card rounded-lg text-left cursor-pointer"
                  >
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                    <span>Image / Screenshot</span>
                  </button>
                </div>
              )}

              {/* Text Input Row */}
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowEmojiPicker(!showEmojiPicker);
                    setShowAttachMenu(false);
                  }}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Add Emoji"
                >
                  <Smile className="h-4 w-4" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowAttachMenu(!showAttachMenu);
                    setShowEmojiPicker(false);
                  }}
                  className="h-9 w-9 text-muted-foreground hover:text-foreground cursor-pointer"
                  title="Attach File"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>

                <input
                  type="text"
                  placeholder={`Type a message in ${activeGroup.name}...`}
                  value={composerText}
                  onChange={(e) => setComposerText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="bg-background border-border text-foreground focus:border-primary flex-1 rounded-xl border px-4 py-2 text-xs outline-none"
                />

                <Button
                  type="button"
                  onClick={handleSendMessage}
                  disabled={!composerText.trim() && !attachedFile}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 cursor-pointer text-xs font-bold gap-1.5"
                >
                  <span>{editingMsg ? "Save" : "Send"}</span>
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANNOUNCEMENTS CONTENT */}
        {activeTab === "Announcements" && (
          <div className="flex-1 space-y-4 overflow-y-auto p-5 bg-background/50">
            {currentAnnouncements.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground">
                <Megaphone className="h-8 w-8 mb-2 opacity-40" />
                <p className="text-xs font-semibold">No announcements posted yet</p>
                {isPM && (
                  <p className="text-[11px] mt-1">
                    Click "Create Announcement" to publish a new announcement for{" "}
                    {activeGroup.name}.
                  </p>
                )}
              </div>
            ) : (
              currentAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className={`border-border bg-card flex flex-col space-y-3 rounded-2xl border p-5 shadow-xs transition-all ${
                    ann.isPinned ? "border-amber-500/40 bg-amber-500/5" : ""
                  }`}
                >
                  {/* Top Bar: Title + Pinned Badge + Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {ann.isPinned && (
                        <Pin className="h-4 w-4 text-amber-500 fill-amber-500 shrink-0" />
                      )}
                      <h3 className="text-foreground text-sm font-bold">
                        {ann.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      {isPM && (
                        <>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleTogglePinAnnouncement(ann.id)}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            {ann.isPinned ? "Unpin" : "Pin"}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAnnouncement(ann.id)}
                            className="h-7 px-2 text-xs text-rose-400 hover:text-rose-500 cursor-pointer"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Announcement Message Body */}
                  <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-wrap">
                    {ann.message}
                  </p>

                  {/* Footer Meta */}
                  <div className="border-border/60 flex items-center justify-between border-t pt-3 text-[11px] text-muted-foreground">
                    <span>
                      Posted by{" "}
                      <strong className="text-foreground">{ann.postedBy}</strong> (
                      {ann.postedByRole})
                    </span>
                    <span>{ann.timestamp}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* 3. MODALS                                            */}
      {/* ==================================================== */}

      {/* VIEW MEMBERS MODAL */}
      <Dialog open={showMembersModal} onOpenChange={setShowMembersModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>{activeGroup.name} Members</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Project team members assigned to this Chatty group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-72 overflow-y-auto py-2">
            {activeGroup.members.map((member) => (
              <div
                key={member.id}
                className="bg-secondary/40 border-border/60 flex items-center justify-between rounded-xl border p-3"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="bg-primary/20 text-primary border-primary/40 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
                      {member.avatar}
                    </div>
                    <span
                      className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
                        member.isOnline ? "bg-emerald-500" : "bg-muted-foreground/40"
                      }`}
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-foreground text-xs font-bold">
                      {member.name}
                    </span>
                    <span className="text-muted-foreground text-[10px]">
                      {member.designation} &bull; {member.role}
                    </span>
                  </div>
                </div>

                {isPM && member.id !== "usr-pm" && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleRemoveMemberFromGroup(member.id, member.name)
                    }
                    className="h-7 text-xs text-rose-400 hover:text-rose-500 hover:bg-rose-500/10 cursor-pointer"
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowMembersModal(false)}
              className="cursor-pointer text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ADD MEMBER MODAL (PM ONLY) */}
      <Dialog open={showAddMemberModal} onOpenChange={setShowAddMemberModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-emerald-500" />
              <span>Add Member to {activeGroup.name}</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Select available project team members to add to this Chatty group.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 max-h-72 overflow-y-auto py-2">
            {nonGroupMembers.length === 0 ? (
              <p className="text-muted-foreground text-xs text-center py-4">
                All available project team members are already in this group.
              </p>
            ) : (
              nonGroupMembers.map((candidate) => (
                <div
                  key={candidate.id}
                  className="bg-secondary/40 border-border/60 flex items-center justify-between rounded-xl border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/20 text-primary border-primary/40 flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold">
                      {candidate.avatar}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-foreground text-xs font-bold">
                        {candidate.name}
                      </span>
                      <span className="text-muted-foreground text-[10px]">
                        {candidate.designation}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    size="sm"
                    onClick={() => handleAddMemberToGroup(candidate)}
                    className="bg-emerald-500 text-white hover:bg-emerald-600 h-7 text-xs font-bold cursor-pointer"
                  >
                    Add
                  </Button>
                </div>
              ))
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAddMemberModal(false)}
              className="cursor-pointer text-xs"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* GROUP INFORMATION MODAL */}
      <Dialog open={showGroupInfoModal} onOpenChange={setShowGroupInfoModal}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold flex items-center gap-2">
              <Info className="h-4 w-4 text-primary" />
              <span>Group Information</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="bg-secondary/40 border border-border p-3 rounded-xl space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                Group Name
              </span>
              <p className="text-foreground font-bold">{activeGroup.name}</p>
            </div>

            <div className="bg-secondary/40 border border-border p-3 rounded-xl space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                Associated Project
              </span>
              <p className="text-foreground font-bold">{activeGroup.projectName}</p>
            </div>

            <div className="bg-secondary/40 border border-border p-3 rounded-xl space-y-1">
              <span className="text-muted-foreground text-[10px] uppercase font-bold tracking-wider">
                Rule Enforced
              </span>
              <p className="text-foreground font-semibold">
                ONE PROJECT = ONE CHATTY GROUP. Messages are strictly isolated to this team group.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowGroupInfoModal(false)}
              className="cursor-pointer text-xs"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CREATE ANNOUNCEMENT MODAL (PM ONLY) */}
      <Dialog open={showCreateAnnModal} onOpenChange={setShowCreateAnnModal}>
        <DialogContent className="bg-card border-border sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground text-base font-bold flex items-center gap-2">
              <Megaphone className="h-4 w-4 text-primary" />
              <span>Create Announcement</span>
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Post an official announcement for {activeGroup.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            <div className="space-y-1.5">
              <label className="text-foreground font-bold">
                Announcement Title *
              </label>
              <input
                type="text"
                placeholder="e.g. Sprint Deliverables Update"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full rounded-lg border px-3 py-2 text-xs outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-foreground font-bold">
                Announcement Message *
              </label>
              <textarea
                rows={4}
                placeholder="Enter detailed announcement message..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary w-full rounded-lg border p-3 text-xs outline-none resize-none"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowCreateAnnModal(false)}
              className="cursor-pointer text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateAnnouncement}
              className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-xs font-bold"
            >
              Post Announcement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ATTACHMENT VIEW PREVIEW MODAL */}
      {previewAttachment && (
        <Dialog
          open={!!previewAttachment}
          onOpenChange={() => setPreviewAttachment(null)}
        >
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground text-base font-bold flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                <span>{previewAttachment.fileName}</span>
              </DialogTitle>
            </DialogHeader>

            <div className="border-border bg-secondary/30 flex flex-col items-center justify-center p-8 rounded-xl text-center space-y-3">
              {previewAttachment.fileType === "PDF" ? (
                <FileText className="h-12 w-12 text-rose-500" />
              ) : previewAttachment.fileType === "XLSX" ? (
                <FileText className="h-12 w-12 text-emerald-500" />
              ) : (
                <ImageIcon className="h-12 w-12 text-blue-500" />
              )}
              <div className="space-y-1">
                <p className="text-foreground text-sm font-bold">
                  {previewAttachment.fileName}
                </p>
                <p className="text-muted-foreground text-xs">
                  {previewAttachment.fileType} Document &bull; {previewAttachment.fileSize}
                </p>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setPreviewAttachment(null)}
                className="cursor-pointer text-xs"
              >
                Close
              </Button>
              <Button
                type="button"
                onClick={() => {
                  toast.success(`Downloading ${previewAttachment.fileName}`);
                  setPreviewAttachment(null);
                }}
                className="bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer text-xs font-bold gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
