"use client";

import React, { useState, useMemo } from "react";
import {
  Laptop,
  Plus,
  Search,
  ChevronDown,
  HardDrive,
  Monitor,
  ShieldCheck,
  Wrench,
  UserCheck,
  Building2,
  Trash2,
  Edit,
  Tag,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export interface AssetItem {
  id: string;
  tag: string;
  name: string;
  category:
    "Laptop" | "Display" | "Peripheral" | "Mobile Device" | "Networking";
  serialNumber: string;
  assignedTo: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  branch: string;
  purchaseDate: string;
  warrantyExpiry: string;
  status: "Assigned" | "In Stock" | "Under Repair" | "Retired";
  valueAmount: string;
}

const INITIAL_ASSETS: AssetItem[] = [
  {
    id: "ast-1",
    tag: "AST-MBP-901",
    name: "MacBook Pro 16-inch (M2 Max)",
    category: "Laptop",
    serialNumber: "C02G4012Q05N",
    assignedTo: {
      name: "Elena Vance",
      email: "elena@pockethr.io",
      avatar: "EV",
    },
    branch: "Bengaluru HQ",
    purchaseDate: "10 Sep 2024",
    warrantyExpiry: "09 Sep 2027",
    status: "Assigned",
    valueAmount: "₹2,49,900",
  },
  {
    id: "ast-2",
    tag: "AST-MON-302",
    name: "Dell UltraSharp 27-inch 4K Monitor",
    category: "Display",
    serialNumber: "CN-093821-701",
    assignedTo: {
      name: "Sahara Acharya",
      email: "sahara@pockethr.io",
      avatar: "SA",
    },
    branch: "Dehradun Office",
    purchaseDate: "15 Sep 2024",
    warrantyExpiry: "14 Sep 2026",
    status: "Assigned",
    valueAmount: "₹42,500",
  },
  {
    id: "ast-3",
    tag: "AST-ACC-110",
    name: "Logitech MX Master 3S Mouse",
    category: "Peripheral",
    serialNumber: "LZ-881920-001",
    assignedTo: {
      name: "Aman Sharma",
      email: "aman@pockethr.io",
      avatar: "AS",
    },
    branch: "Bengaluru HQ",
    purchaseDate: "10 Sep 2024",
    warrantyExpiry: "09 Sep 2025",
    status: "Assigned",
    valueAmount: "₹9,995",
  },
  {
    id: "ast-4",
    tag: "AST-LTP-405",
    name: "ThinkPad X1 Carbon Gen 11",
    category: "Laptop",
    serialNumber: "PF-49102X-99",
    assignedTo: null,
    branch: "Hyderabad Tech Hub",
    purchaseDate: "01 Nov 2024",
    warrantyExpiry: "31 Oct 2027",
    status: "In Stock",
    valueAmount: "₹1,85,000",
  },
  {
    id: "ast-5",
    tag: "AST-MON-812",
    name: "LG Ergonomic 34-inch Ultrawide",
    category: "Display",
    serialNumber: "LG-391029-44",
    assignedTo: {
      name: "Julian Thorne",
      email: "julian@pockethr.io",
      avatar: "JT",
    },
    branch: "Bengaluru HQ",
    purchaseDate: "12 Dec 2024",
    warrantyExpiry: "11 Dec 2027",
    status: "Under Repair",
    valueAmount: "₹58,000",
  },
  {
    id: "ast-6",
    tag: "AST-MOB-101",
    name: "iPad Pro 12.9-inch (M2 Wi-Fi + 5G)",
    category: "Mobile Device",
    serialNumber: "DL-901239-11",
    assignedTo: {
      name: "Sarah Chen",
      email: "sarah@pockethr.io",
      avatar: "SC",
    },
    branch: "Hyderabad Tech Hub",
    purchaseDate: "05 Jan 2025",
    warrantyExpiry: "04 Jan 2028",
    status: "Assigned",
    valueAmount: "₹1,12,900",
  },
  {
    id: "ast-7",
    tag: "AST-NET-201",
    name: "Cisco Catalyst 9200L Gigabit Switch",
    category: "Networking",
    serialNumber: "CSC-990123-00",
    assignedTo: null,
    branch: "Bengaluru HQ",
    purchaseDate: "15 Feb 2024",
    warrantyExpiry: "14 Feb 2029",
    status: "In Stock",
    valueAmount: "₹1,45,000",
  },
];

export function AssetsManagementView() {
  const [assets, setAssets] = useState<AssetItem[]>(INITIAL_ASSETS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Modal State for Adding Asset
  const [isAddAssetOpen, setIsAddAssetOpen] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] =
    useState<AssetItem["category"]>("Laptop");
  const [newSerial, setNewSerial] = useState("");
  const [newBranch, setNewBranch] = useState("Bengaluru HQ");
  const [newAssignee, setNewAssignee] = useState("");
  const [newValue, setNewValue] = useState("₹50,000");

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const tagToUse = newTag.trim() || `AST-${Date.now().toString().slice(-4)}`;
    const newAsset: AssetItem = {
      id: `ast-${Date.now()}`,
      tag: tagToUse,
      name: newName.trim(),
      category: newCategory,
      serialNumber: newSerial.trim() || "SN-PENDING",
      assignedTo: newAssignee.trim()
        ? {
            name: newAssignee.trim(),
            email: `${newAssignee.toLowerCase().replace(" ", ".")}@pockethr.io`,
            avatar: newAssignee
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase(),
          }
        : null,
      branch: newBranch,
      purchaseDate: "Today",
      warrantyExpiry: "3 Years",
      status: newAssignee.trim() ? "Assigned" : "In Stock",
      valueAmount: newValue || "₹50,000",
    };

    setAssets([newAsset, ...assets]);
    setIsAddAssetOpen(false);
    setNewTag("");
    setNewName("");
    setNewSerial("");
    setNewAssignee("");
  };

  // Filtered Assets
  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesSearch =
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (asset.assignedTo &&
          asset.assignedTo.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesCategory =
        selectedCategory === "All Categories" ||
        asset.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All Statuses" || asset.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, searchQuery, selectedCategory, selectedStatus]);

  // Metrics
  const totalAssetsCount = assets.length;
  const assignedCount = useMemo(
    () => assets.filter((a) => a.status === "Assigned").length,
    [assets],
  );
  const inStockCount = useMemo(
    () => assets.filter((a) => a.status === "In Stock").length,
    [assets],
  );
  const repairCount = useMemo(
    () => assets.filter((a) => a.status === "Under Repair").length,
    [assets],
  );

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-1 flex-col gap-6 p-6">
      {/* TOP HEADER & ACTION BUTTON */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HardDrive className="text-primary h-5 w-5" />
            <h1 className="text-foreground text-xl font-bold tracking-tight">
              Assets Management
            </h1>
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary rounded-none text-xs"
            >
              {totalAssetsCount} Total Inventory
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1 text-xs">
            Track company laptops, displays, peripherals, warranty schedules,
            and hardware allocations.
          </p>
        </div>

        <Button
          onClick={() => setIsAddAssetOpen(true)}
          className="bg-primary text-primary-foreground cursor-pointer gap-1.5 rounded-none text-xs font-semibold shadow-none"
        >
          <Plus className="h-4 w-4" /> Add Asset
        </Button>
      </div>

      {/* METRIC SUMMARY CARDS GRID (4 CARDS) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Total Hardware Assets
            </span>
            <span className="bg-foreground h-2 w-2 shrink-0 rounded-full" />
          </div>
          <div className="text-foreground mt-3 text-2xl font-extrabold">
            {totalAssetsCount}
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Assigned to Employees
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-emerald-500">
            {assignedCount}
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              In Stock / Available
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-sky-500" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-sky-500">
            {inStockCount}
          </div>
        </Card>

        <Card className="bg-card border-border flex flex-col justify-between rounded-none p-4 shadow-xs">
          <div className="flex w-full items-center justify-between">
            <span className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              Under Repair / Maintenance
            </span>
            <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          </div>
          <div className="mt-3 text-2xl font-extrabold text-amber-500">
            {repairCount}
          </div>
        </Card>
      </div>

      {/* FILTER CONTROL BAR & ASSETS TABLE */}
      <Card className="bg-card border-border flex flex-col gap-5 rounded-none p-5 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-3.5 w-3.5" />
              <Input
                placeholder="Search asset tag, name, serial..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-background border-border focus-visible:ring-primary h-8 rounded-none pl-8 text-xs shadow-2xs"
              />
            </div>

            {/* Category Filter */}
            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary h-8 cursor-pointer appearance-none rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
              >
                <option value="All Categories">All Categories</option>
                <option value="Laptop">Laptop</option>
                <option value="Display">Display</option>
                <option value="Peripheral">Peripheral</option>
                <option value="Mobile Device">Mobile Device</option>
                <option value="Networking">Networking</option>
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5" />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-background border-border text-foreground focus:border-primary h-8 cursor-pointer appearance-none rounded-none border px-3 pr-8 text-xs font-semibold shadow-2xs outline-none"
              >
                <option value="All Statuses">All Statuses</option>
                <option value="Assigned">Assigned</option>
                <option value="In Stock">In Stock</option>
                <option value="Under Repair">Under Repair</option>
                <option value="Retired">Retired</option>
              </select>
              <ChevronDown className="text-muted-foreground pointer-events-none absolute top-2.5 right-2.5 h-3.5 w-3.5" />
            </div>
          </div>
        </div>

        {/* ASSETS INVENTORY TABLE */}
        <div className="border-border/80 bg-background overflow-x-auto border select-none">
          <table className="w-full min-w-[900px] border-collapse text-left">
            <thead>
              <tr className="border-border/80 bg-card/60 border-b">
                <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                  Asset Tag / Name
                </th>
                <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                  Category & Serial
                </th>
                <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                  Assigned Employee
                </th>
                <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                  Location / Branch
                </th>
                <th className="text-muted-foreground px-4 py-3 text-[10px] font-bold tracking-wider uppercase">
                  Warranty Expiry
                </th>
                <th className="text-muted-foreground px-4 py-3 text-center text-[10px] font-bold tracking-wider uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-border/40 divide-y">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground py-12 text-center text-xs"
                  >
                    No assets found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    className="hover:bg-secondary/30 transition-colors"
                  >
                    {/* Tag & Name */}
                    <td className="text-foreground px-4 py-3.5 text-xs font-semibold">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className="text-muted-foreground rounded-none font-mono text-[10px]"
                          >
                            {asset.tag}
                          </Badge>
                          <span className="text-foreground text-xs font-bold">
                            {asset.name}
                          </span>
                        </div>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          Value: {asset.valueAmount}
                        </span>
                      </div>
                    </td>

                    {/* Category & Serial */}
                    <td className="text-foreground px-4 py-3.5 text-xs">
                      <div className="flex flex-col">
                        <span className="font-semibold">{asset.category}</span>
                        <span className="text-muted-foreground font-mono text-[10px]">
                          {asset.serialNumber}
                        </span>
                      </div>
                    </td>

                    {/* Assigned Employee */}
                    <td className="text-foreground px-4 py-3.5 text-xs">
                      {asset.assignedTo ? (
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/20 text-primary border-primary/30 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold">
                            {asset.assignedTo.avatar}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold">
                              {asset.assignedTo.name}
                            </span>
                            <span className="text-muted-foreground text-[10px]">
                              {asset.assignedTo.email}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-xs italic">
                          Unassigned (In Stock)
                        </span>
                      )}
                    </td>

                    {/* Location */}
                    <td className="text-muted-foreground px-4 py-3.5 text-xs font-medium">
                      {asset.branch}
                    </td>

                    {/* Warranty Expiry */}
                    <td className="text-muted-foreground px-4 py-3.5 font-mono text-xs">
                      {asset.warrantyExpiry}
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-3.5 text-center">
                      {asset.status === "Assigned" && (
                        <Badge className="rounded-none border-emerald-500/40 bg-emerald-500/10 text-[10px] text-emerald-500">
                          Assigned
                        </Badge>
                      )}
                      {asset.status === "In Stock" && (
                        <Badge className="rounded-none border-sky-500/40 bg-sky-500/10 text-[10px] text-sky-500">
                          In Stock
                        </Badge>
                      )}
                      {asset.status === "Under Repair" && (
                        <Badge className="rounded-none border-amber-500/40 bg-amber-500/10 text-[10px] text-amber-500">
                          Under Repair
                        </Badge>
                      )}
                      {asset.status === "Retired" && (
                        <Badge className="rounded-none border-rose-500/40 bg-rose-500/10 text-[10px] text-rose-500">
                          Retired
                        </Badge>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ADD ASSET DIALOG */}
      <Dialog open={isAddAssetOpen} onOpenChange={setIsAddAssetOpen}>
        <DialogContent className="bg-card border-border rounded-none p-6 shadow-2xl sm:max-w-[480px]">
          <DialogHeader className="border-border border-b pb-3">
            <DialogTitle className="text-foreground text-base font-bold">
              Add New Hardware Asset
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Register a new hardware item into the workspace inventory.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddAsset} className="space-y-4 pt-3">
            <div className="space-y-1">
              <Label className="text-foreground text-xs font-semibold">
                Asset Name
              </Label>
              <Input
                placeholder="e.g. MacBook Pro 14-inch (M3)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                required
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Asset Tag Code
                </Label>
                <Input
                  placeholder="AST-LTP-501"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="bg-background border-border rounded-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Category
                </Label>
                <select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as AssetItem["category"])
                  }
                  className="bg-background border-border text-foreground focus:border-primary h-9 w-full rounded-none border px-2 text-xs font-semibold outline-none"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Display">Display</option>
                  <option value="Peripheral">Peripheral</option>
                  <option value="Mobile Device">Mobile Device</option>
                  <option value="Networking">Networking</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Serial Number
                </Label>
                <Input
                  placeholder="C02G..."
                  value={newSerial}
                  onChange={(e) => setNewSerial(e.target.value)}
                  className="bg-background border-border rounded-none font-mono text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-foreground text-xs font-semibold">
                  Location / Branch
                </Label>
                <select
                  value={newBranch}
                  onChange={(e) => setNewBranch(e.target.value)}
                  className="bg-background border-border text-foreground focus:border-primary h-9 w-full rounded-none border px-2 text-xs font-semibold outline-none"
                >
                  <option value="Bengaluru HQ">Bengaluru HQ</option>
                  <option value="Hyderabad Tech Hub">Hyderabad Tech Hub</option>
                  <option value="Dehradun Office">Dehradun Office</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="text-foreground text-xs font-semibold">
                Assign to Employee (Optional)
              </Label>
              <Input
                placeholder="Employee Name (e.g. Sahara Acharya)"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="bg-background border-border rounded-none text-xs"
              />
            </div>

            <DialogFooter className="border-border mt-4 border-t pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddAssetOpen(false)}
                className="rounded-none text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary text-primary-foreground rounded-none text-xs font-semibold"
              >
                Save Asset
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
