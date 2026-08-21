"use client";

import { Pencil, Trash2 } from "lucide-react";
import { type Client } from "@/types/client";
import { Button } from "@/components/ui/button";

interface ClientsTableProps {
  data: Client[];
  onDeleteClient: (id: string) => void;
}

export function ClientsTable({ data, onDeleteClient }: ClientsTableProps) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full table-fixed border-collapse text-left text-xs">
        {/* Sticky Column Headers with 100% Solid Background */}
        <thead className="border-border bg-secondary text-muted-foreground sticky top-0 z-10 border-b font-medium tracking-wider uppercase opacity-100 shadow-sm">
          <tr>
            <th className="bg-secondary w-[22%] p-3.5 pl-6 font-semibold">
              Clients Name
            </th>
            <th className="bg-secondary w-[20%] p-3.5 font-semibold">
              Contact Details
            </th>
            <th className="bg-secondary w-[15%] p-3.5 font-semibold">
              GST Number
            </th>
            <th className="bg-secondary w-[15%] p-3.5 font-semibold">
              Industry
            </th>
            <th className="bg-secondary w-[10%] p-3.5 font-semibold">
              Number of projects
            </th>
            <th className="bg-secondary w-[12%] p-3.5 font-semibold">
              Account manager
            </th>
            <th className="bg-secondary w-[6%] p-3.5 pr-6 text-right font-semibold">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-border/50 bg-card divide-y">
          {data.length > 0 ? (
            data.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-secondary/40 border-border/40 border-b transition-colors"
              >
                {/* Clients Name Column */}
                <td className="py-3 pr-3 pl-6">
                  <div className="flex items-center gap-3 truncate">
                    <div className="bg-secondary text-foreground border-border flex h-8 w-8 shrink-0 items-center justify-center border text-xs font-bold">
                      {client.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-foreground truncate text-xs font-semibold">
                        {client.name}
                      </span>
                      <span className="text-muted-foreground font-mono text-[10px]">
                        {client.code}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Contact Details Column */}
                <td className="px-3 py-3">
                  <div className="flex flex-col truncate text-xs">
                    {client.email ? (
                      <span className="text-foreground truncate font-medium">
                        {client.email}
                      </span>
                    ) : null}
                    {client.phone ? (
                      <span className="text-muted-foreground font-mono text-[11px]">
                        {client.phone}
                      </span>
                    ) : null}
                    {!client.email && !client.phone && (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </td>

                {/* GST Number Column */}
                <td className="text-muted-foreground truncate px-3 py-3 font-mono text-xs">
                  {client.gstNumber || "-"}
                </td>

                {/* Industry Column */}
                <td className="text-muted-foreground truncate px-3 py-3 text-xs">
                  {client.industry}
                </td>

                {/* Number of projects Column */}
                <td className="px-3 py-3">
                  <span className="text-primary text-xs font-semibold">
                    {client.projectCount}
                  </span>
                </td>

                {/* Account manager Column */}
                <td className="px-3 py-3">
                  {client.managerName && client.managerName !== "-" ? (
                    <div className="border-border bg-secondary/50 text-foreground inline-flex max-w-full items-center gap-1.5 truncate border px-2 py-1 text-xs">
                      <div className="bg-primary/20 text-primary flex h-4 w-4 shrink-0 items-center justify-center text-[9px] font-bold">
                        {client.managerName.charAt(0)}
                      </div>
                      <span className="truncate font-medium">
                        {client.managerName}
                      </span>
                      {client.managerCode ? (
                        <span className="text-muted-foreground shrink-0 text-[10px]">
                          ({client.managerCode})
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>

                {/* Actions Column */}
                <td className="py-3 pr-6 pl-3 text-right">
                  <div className="inline-flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-border hover:bg-secondary h-7 w-7 rounded-none"
                    >
                      <Pencil className="text-muted-foreground h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onDeleteClient(client.id)}
                      className="border-border hover:bg-destructive/10 hover:text-destructive h-7 w-7 rounded-none"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="text-muted-foreground h-32 text-center text-xs"
              >
                No clients found matching your search.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
