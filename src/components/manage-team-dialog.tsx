"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Trash2,
  Crown,
  Layers,
  UserPlus,
  Pencil,
  Check,
} from "lucide-react";
import type { Project, TeamMember, ProjectTeam } from "@/types/project";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

interface ManageTeamDialogProps {
  project: Project;
  onUpdateTeam: (
    projectId: string,
    teamMembers: TeamMember[],
    teams?: ProjectTeam[],
  ) => void;
}

export function ManageTeamDialog({
  project,
  onUpdateTeam,
}: ManageTeamDialogProps) {
  const [open, setOpen] = useState(false);

  // Initialize teams from project.teams, or fallback to default single team if empty
  const [teams, setTeams] = useState<ProjectTeam[]>(() => {
    if (project.teams && project.teams.length > 0) {
      return project.teams;
    }
    return [
      {
        id: `team-default-${project.id}`,
        name: "Core Project Team",
        description: "Primary development & engineering team",
        leadName: project.teamMembers?.find((m) => m.isTechLead)?.name || "",
        members: project.teamMembers || [],
      },
    ];
  });

  const [activeTeamId, setActiveTeamId] = useState<string>(
    teams[0]?.id || `team-default-${project.id}`,
  );

  // Inline "Create New Team" Form State
  const [showCreateTeam, setShowCreateTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamLead, setNewTeamLead] = useState("");
  const [newTeamDescription, setNewTeamDescription] = useState("");

  // New Member Form State
  const [memberName, setMemberName] = useState("");
  const [memberRole, setMemberRole] = useState("");
  const [memberEmail, setMemberEmail] = useState("");
  const [isTechLead, setIsTechLead] = useState(false);

  const activeTeam = teams.find((t) => t.id === activeTeamId) || teams[0];

  const syncTeamsWithParent = (updatedTeams: ProjectTeam[]) => {
    setTeams(updatedTeams);
    // Flatten all unique members across all teams
    const allMembers: TeamMember[] = [];
    const seenIds = new Set<string>();
    updatedTeams.forEach((t) => {
      t.members.forEach((m) => {
        if (!seenIds.has(m.id)) {
          seenIds.add(m.id);
          allMembers.push(m);
        }
      });
    });
    onUpdateTeam(project.id, allMembers, updatedTeams);
  };

  // Create a new Team inside this project
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      toast.error("Please enter a team name.");
      return;
    }

    const newTeam: ProjectTeam = {
      id: `team-${Date.now()}`,
      name: newTeamName.trim(),
      leadName: newTeamLead.trim() || undefined,
      description: newTeamDescription.trim() || undefined,
      members: [],
    };

    const updated = [...teams, newTeam];
    syncTeamsWithParent(updated);
    setActiveTeamId(newTeam.id);
    setShowCreateTeam(false);

    setNewTeamName("");
    setNewTeamLead("");
    setNewTeamDescription("");
    toast.success(`Team '${newTeam.name}' created in project ${project.name}`);
  };

  // Delete a Team
  const handleDeleteTeam = (teamId: string, teamName: string) => {
    if (teams.length <= 1) {
      toast.error("A project must have at least one team.");
      return;
    }
    const updated = teams.filter((t) => t.id !== teamId);
    syncTeamsWithParent(updated);
    if (activeTeamId === teamId) {
      setActiveTeamId(updated[0].id);
    }
    toast.success(`Team '${teamName}' deleted.`);
  };

  // Add Member to Active Team
  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim() || !memberRole.trim()) {
      toast.error("Please provide member name and role.");
      return;
    }

    if (!activeTeam) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: memberName.trim(),
      role: memberRole.trim(),
      email:
        memberEmail.trim() ||
        `${memberName.toLowerCase().replace(/\s+/g, ".")}@ailoitte.com`,
      isTechLead,
    };

    let updatedActiveMembers = [...activeTeam.members];
    if (isTechLead) {
      updatedActiveMembers = updatedActiveMembers.map((m) => ({
        ...m,
        isTechLead: false,
      }));
    }
    updatedActiveMembers.push(newMember);

    const updatedTeams = teams.map((t) =>
      t.id === activeTeam.id
        ? {
            ...t,
            leadName: isTechLead
              ? newMember.name
              : t.leadName || newMember.name,
            members: updatedActiveMembers,
          }
        : t,
    );

    syncTeamsWithParent(updatedTeams);

    // Reset Member Form
    setMemberName("");
    setMemberRole("");
    setMemberEmail("");
    setIsTechLead(false);
    toast.success(`Added ${newMember.name} to ${activeTeam.name}`);
  };

  // Toggle TL status within active team
  const handleToggleTL = (memberId: string) => {
    if (!activeTeam) return;

    const updatedActiveMembers = activeTeam.members.map((m) => ({
      ...m,
      isTechLead: m.id === memberId ? !m.isTechLead : false,
    }));

    const newTL = updatedActiveMembers.find((m) => m.isTechLead);

    const updatedTeams = teams.map((t) =>
      t.id === activeTeam.id
        ? {
            ...t,
            leadName: newTL ? newTL.name : t.leadName,
            members: updatedActiveMembers,
          }
        : t,
    );

    syncTeamsWithParent(updatedTeams);
  };

  // Delete Member from Active Team
  const handleDeleteMember = (memberId: string, name: string) => {
    if (!activeTeam) return;
    const updatedActiveMembers = activeTeam.members.filter(
      (m) => m.id !== memberId,
    );
    const updatedTeams = teams.map((t) =>
      t.id === activeTeam.id ? { ...t, members: updatedActiveMembers } : t,
    );
    syncTeamsWithParent(updatedTeams);
    toast.success(`Removed ${name} from ${activeTeam.name}`);
  };

  const totalProjectMembersCount = teams.reduce(
    (acc, t) => acc + t.members.length,
    0,
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          title="Manage Project Teams & Members"
          className="border-border hover:bg-secondary relative flex h-7 items-center gap-1.5 rounded-none px-2 text-xs font-semibold"
        >
          <Users className="text-muted-foreground h-3.5 w-3.5" />
          <span>{teams.length} Teams</span>
          <Badge className="bg-primary text-primary-foreground ml-0.5 rounded-none px-1 py-0 text-[9px] font-bold">
            {totalProjectMembersCount}
          </Badge>
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border max-h-[92vh] overflow-y-auto rounded-none p-6 shadow-2xl sm:max-w-[620px]">
        <DialogHeader className="border-border border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 text-primary rounded-none p-1.5">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-foreground flex items-center gap-2 text-base font-bold">
                  <span>Project Teams — {project.name}</span>
                  <Badge
                    variant="outline"
                    className="border-primary/40 text-primary text-[10px] uppercase"
                  >
                    {teams.length} {teams.length === 1 ? "Team" : "Teams"}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Project Manager ({project.managerName}) can create and assign
                  multiple teams inside this project.
                </DialogDescription>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() => setShowCreateTeam(!showCreateTeam)}
              className="bg-primary text-primary-foreground hover:bg-primary/90 flex h-8 shrink-0 items-center gap-1 rounded-none px-3 text-xs font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>{showCreateTeam ? "Cancel" : "Create New Team"}</span>
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* CREATE NEW TEAM INLINE FORM */}
          {showCreateTeam && (
            <form
              onSubmit={handleCreateTeam}
              className="border-primary/40 bg-secondary/20 animate-in fade-in slide-in-from-top-2 space-y-3 rounded-none border p-4 duration-200"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-foreground flex items-center gap-1.5 text-xs font-bold tracking-wider uppercase">
                  <UserPlus className="text-primary h-3.5 w-3.5" />
                  <span>Create New Team in {project.name}</span>
                </h4>
                <span className="text-muted-foreground text-[11px]">
                  Add sub-team for this project
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="space-y-1">
                  <Label
                    htmlFor="teamName"
                    className="text-foreground text-xs font-semibold"
                  >
                    Team Name *
                  </Label>
                  <Input
                    id="teamName"
                    placeholder="e.g. Frontend Web Team, iOS Team, QA Team"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    className="bg-card border-border h-8 rounded-none text-xs"
                    autoFocus
                  />
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="teamLead"
                    className="text-foreground text-xs font-semibold"
                  >
                    Team Lead Name (Optional)
                  </Label>
                  <Input
                    id="teamLead"
                    placeholder="e.g. Amit Sharma"
                    value={newTeamLead}
                    onChange={(e) => setNewTeamLead(e.target.value)}
                    className="bg-card border-border h-8 rounded-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="teamDesc"
                  className="text-foreground text-xs font-semibold"
                >
                  Description / Focus Area
                </Label>
                <Input
                  id="teamDesc"
                  placeholder="e.g. Responsible for React/Next.js frontend features"
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="bg-card border-border h-8 rounded-none text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCreateTeam(false)}
                  className="h-7 rounded-none text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-7 rounded-none px-3 text-xs font-semibold"
                >
                  <Check className="mr-1 h-3.5 w-3.5" /> Create Team
                </Button>
              </div>
            </form>
          )}

          {/* TEAMS NAVIGATION TABS */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                Project Teams ({teams.length})
              </h4>
              <span className="text-muted-foreground text-[11px]">
                Select team to manage members
              </span>
            </div>

            <div className="border-border/80 flex items-center gap-1.5 overflow-x-auto border-b pb-1">
              {teams.map((t) => {
                const isActive = t.id === activeTeam?.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTeamId(t.id)}
                    className={`flex shrink-0 cursor-pointer items-center gap-2 rounded-none border-b-2 px-3 py-1.5 text-xs font-bold transition-colors ${
                      isActive
                        ? "border-primary text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/40 border-transparent"
                    }`}
                  >
                    <span>{t.name}</span>
                    <Badge
                      variant="secondary"
                      className="px-1.5 py-0 text-[10px]"
                    >
                      {t.members.length}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ACTIVE TEAM HEADER & DETAILS */}
          {activeTeam && (
            <div className="bg-secondary/20 border-border space-y-4 border p-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-foreground flex items-center gap-2 text-sm font-bold">
                    <span>{activeTeam.name}</span>
                    {activeTeam.leadName && (
                      <Badge className="gap-1 rounded-none border border-amber-500/40 bg-amber-500/20 text-[10px] font-semibold text-amber-400">
                        <Crown className="h-2.5 w-2.5" /> Lead:{" "}
                        {activeTeam.leadName}
                      </Badge>
                    )}
                  </h3>
                  {activeTeam.description && (
                    <p className="text-muted-foreground mt-0.5 text-xs">
                      {activeTeam.description}
                    </p>
                  )}
                </div>

                {teams.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleDeleteTeam(activeTeam.id, activeTeam.name)
                    }
                    className="h-7 rounded-none px-2 text-xs text-rose-400 hover:bg-rose-500/10 hover:text-rose-500"
                    title="Delete Team"
                  >
                    <Trash2 className="mr-1 h-3.5 w-3.5" /> Delete Team
                  </Button>
                )}
              </div>

              {/* MEMBERS LIST IN ACTIVE TEAM */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
                    Team Members ({activeTeam.members.length})
                  </h5>
                  <span className="text-muted-foreground text-[10px]">
                    Click crown to set Tech Lead (TL)
                  </span>
                </div>

                {activeTeam.members.length === 0 ? (
                  <div className="border-border/80 text-muted-foreground border border-dashed p-4 text-center text-xs">
                    No members in this team yet. Add members below.
                  </div>
                ) : (
                  <div className="max-h-[200px] space-y-2 overflow-y-auto pr-1">
                    {activeTeam.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center justify-between border p-2.5 transition-colors ${
                          member.isTechLead
                            ? "border-amber-500/50 bg-amber-500/10"
                            : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                              member.isTechLead
                                ? "bg-amber-500 text-white"
                                : "bg-primary/20 text-primary"
                            }`}
                          >
                            {member.name.charAt(0)}
                          </div>
                          <div className="flex flex-col truncate">
                            <div className="flex items-center gap-2">
                              <span className="text-foreground truncate text-xs font-semibold">
                                {member.name}
                              </span>
                              {member.isTechLead && (
                                <Badge className="gap-1 rounded-none bg-amber-500 px-1.5 py-0 text-[9px] font-bold text-white hover:bg-amber-600">
                                  <Crown className="h-2.5 w-2.5" /> TL
                                </Badge>
                              )}
                            </div>
                            <span className="text-muted-foreground truncate text-[11px]">
                              {member.role} • {member.email}
                            </span>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleTL(member.id)}
                            className={`h-7 rounded-none px-2 text-xs font-medium ${
                              member.isTechLead
                                ? "text-amber-500 hover:text-amber-600"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <Crown className="mr-1 h-3.5 w-3.5" />
                            {member.isTechLead ? "TL" : "Set TL"}
                          </Button>

                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              handleDeleteMember(member.id, member.name)
                            }
                            className="text-muted-foreground hover:text-destructive h-7 w-7 rounded-none"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ADD MEMBER FORM FOR ACTIVE TEAM */}
              <form
                onSubmit={handleAddMember}
                className="border-border/80 space-y-3 border-t pt-3"
              >
                <h5 className="text-foreground text-xs font-bold">
                  Add Member to {activeTeam.name}
                </h5>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <Label
                      htmlFor="memberName"
                      className="text-foreground text-xs font-semibold"
                    >
                      Member Name *
                    </Label>
                    <Input
                      id="memberName"
                      placeholder="e.g. Rahul Sharma"
                      value={memberName}
                      onChange={(e) => setMemberName(e.target.value)}
                      className="bg-card border-border h-8 rounded-none text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label
                      htmlFor="memberRole"
                      className="text-foreground text-xs font-semibold"
                    >
                      Role / Title *
                    </Label>
                    <Input
                      id="memberRole"
                      placeholder="e.g. Senior Frontend Dev"
                      value={memberRole}
                      onChange={(e) => setMemberRole(e.target.value)}
                      className="bg-card border-border h-8 rounded-none text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="memberEmail"
                    className="text-foreground text-xs font-semibold"
                  >
                    Email Address
                  </Label>
                  <Input
                    id="memberEmail"
                    placeholder="e.g. rahul.sharma@ailoitte.com"
                    value={memberEmail}
                    onChange={(e) => setMemberEmail(e.target.value)}
                    className="bg-card border-border h-8 rounded-none text-xs"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={isTechLead}
                      onChange={(e) => setIsTechLead(e.target.checked)}
                      className="accent-primary h-4 w-4 cursor-pointer"
                    />
                    Set as Tech Lead (TL) of {activeTeam.name}
                  </label>

                  <Button
                    type="submit"
                    size="sm"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none px-4 text-xs font-semibold"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Add Member
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
