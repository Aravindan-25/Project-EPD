"use client";

import { useState } from "react";
import { Users, Plus, Trash2, Crown } from "lucide-react";
import type { Project, TeamMember } from "@/types/project";
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

interface ManageTeamDialogProps {
  project: Project;
  onUpdateTeam: (projectId: string, teamMembers: TeamMember[]) => void;
}

export function ManageTeamDialog({
  project,
  onUpdateTeam,
}: ManageTeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [members, setMembers] = useState<TeamMember[]>(
    project.teamMembers || [],
  );

  // New member inline form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [isTechLead, setIsTechLead] = useState(false);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim()) return;

    const newMember: TeamMember = {
      id: `tm-${Date.now()}`,
      name: name.trim(),
      role: role.trim(),
      email:
        email.trim() ||
        `${name.toLowerCase().replace(/\s+/g, ".")}@ailoitte.com`,
      isTechLead,
    };

    let updatedMembers = [...members];
    if (isTechLead) {
      // Unset TL on previous members if new member is set as TL
      updatedMembers = updatedMembers.map((m) => ({
        ...m,
        isTechLead: false,
      }));
    }

    updatedMembers.push(newMember);
    setMembers(updatedMembers);
    onUpdateTeam(project.id, updatedMembers);

    // Reset inline form
    setName("");
    setRole("");
    setEmail("");
    setIsTechLead(false);
  };

  const handleToggleTL = (memberId: string) => {
    const updated = members.map((m) => ({
      ...m,
      isTechLead: m.id === memberId ? !m.isTechLead : false,
    }));
    setMembers(updated);
    onUpdateTeam(project.id, updated);
  };

  const handleDeleteMember = (memberId: string) => {
    const updated = members.filter((m) => m.id !== memberId);
    setMembers(updated);
    onUpdateTeam(project.id, updated);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Manage Team Members & Tech Lead"
          className="border-border hover:bg-secondary relative h-7 w-7 rounded-none"
        >
          <Users className="text-muted-foreground h-3.5 w-3.5" />
          {members.length > 0 && (
            <span className="bg-primary absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] font-bold text-white">
              {members.length}
            </span>
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-card border-border max-h-[90vh] overflow-y-auto rounded-none p-6 shadow-2xl sm:max-w-[540px]">
        <DialogHeader className="border-border border-b pb-3">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 text-primary rounded-none p-1.5">
              <Users className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-base font-bold">
                Team Members - {project.name}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Managed by Project Manager ({project.managerName})
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* CURRENT TEAM MEMBERS LIST */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-foreground text-xs font-bold tracking-wider uppercase">
                Assigned Team ({members.length})
              </h4>
              <span className="text-muted-foreground text-[11px]">
                Click crown to designate Tech Lead (TL)
              </span>
            </div>

            {members.length === 0 ? (
              <div className="border-border text-muted-foreground border border-dashed p-4 text-center text-xs">
                No team members assigned yet. Add team members below.
              </div>
            ) : (
              <div className="max-h-[220px] space-y-2 overflow-y-auto pr-1">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className={`flex items-center justify-between rounded-none border p-2.5 transition-colors ${
                      member.isTechLead
                        ? "border-amber-500/50 bg-amber-500/10"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
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
                              <Crown className="h-2.5 w-2.5" /> TL (Tech Lead)
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
                        title={
                          member.isTechLead
                            ? "Currently Tech Lead"
                            : "Set as Tech Lead (TL)"
                        }
                      >
                        <Crown className="mr-1 h-3.5 w-3.5" />
                        {member.isTechLead ? "TL" : "Set TL"}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteMember(member.id)}
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

          {/* ADD NEW TEAM MEMBER FORM */}
          <form
            onSubmit={handleAddMember}
            className="border-border space-y-3 border-t pt-4"
          >
            <h4 className="text-foreground text-xs font-bold">
              Add New Team Member
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label
                  htmlFor="memberName"
                  className="text-foreground text-xs font-semibold"
                >
                  Member Name
                </Label>
                <Input
                  id="memberName"
                  placeholder="e.g. Rahul Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="memberRole"
                  className="text-foreground text-xs font-semibold"
                >
                  Role / Title
                </Label>
                <Input
                  id="memberRole"
                  placeholder="e.g. Senior Frontend Dev"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-secondary/40 border-border h-8 w-full rounded-none text-xs"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="text-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
                <input
                  type="checkbox"
                  checked={isTechLead}
                  onChange={(e) => setIsTechLead(e.target.checked)}
                  className="accent-primary h-4 w-4"
                />
                Designate as Tech Lead (TL)
              </label>

              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 rounded-none px-4 text-xs font-semibold text-white"
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Member
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
