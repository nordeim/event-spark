"use client";

import { useMemo, useState } from "react";
import { Check, Download, Search, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSparkStore } from "@/lib/spa/store";
import type { Registration } from "@/lib/spa/types";

function toCsv(rows: Array<Registration & { eventName: string }>): string {
  const header = "name,email,event,tier,quantity,status,checked_in,registered_at";
  const escape = (value: string) =>
    /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  const lines = rows.map((r) =>
    [
      r.attendeeName,
      r.attendeeEmail,
      r.eventName,
      r.tierName ?? "",
      String(r.quantity),
      r.status,
      String(r.checkedIn),
      r.createdAt,
    ]
      .map((v) => escape(String(v)))
      .join(",")
  );
  return [header, ...lines].join("\n");
}

export function AttendeesView() {
  const events = useSparkStore((s) => s.events);
  const registrations = useSparkStore((s) => s.registrations);
  const setCheckedIn = useSparkStore((s) => s.setCheckedIn);
  const [query, setQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return registrations
      .map((r) => {
        const event = events.find((e) => e.id === r.eventId);
        const tier = event?.ticketTiers.find((t) => t.id === r.tierId);
        return {
          ...r,
          eventName: event?.name ?? "Unknown event",
          tierName: tier?.name,
        };
      })
      .filter((r) => {
        if (eventFilter !== "all" && r.eventId !== eventFilter) return false;
        if (!q) return true;
        return (
          r.attendeeName.toLowerCase().includes(q) ||
          r.attendeeEmail.toLowerCase().includes(q) ||
          r.eventName.toLowerCase().includes(q)
        );
      });
  }, [registrations, events, query, eventFilter]);

  function exportCsv() {
    const csv = toCsv(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eventspark-attendees-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${rows.length} rows`);
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em]"
            style={{ fontWeight: 700 }}
          >
            Attendees
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Everyone registered across your events.
          </p>
        </div>
        <Button variant="outline" onClick={exportCsv} disabled={rows.length === 0}>
          <Download className="w-4 h-4" aria-hidden="true" />
          Export CSV
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or event…"
            className="pl-9"
            aria-label="Search attendees"
          />
        </div>
        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          aria-label="Filter by event"
          className="h-10 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="all">All events</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {rows.length > 0 ? (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-left">
                  <th className="px-4 py-3 font-semibold text-foreground">Attendee</th>
                  <th className="px-4 py-3 font-semibold text-foreground">Event</th>
                  <th className="px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                    Tier
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground hidden lg:table-cell">
                    Registered
                  </th>
                  <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                  <th className="px-4 py-3 font-semibold text-foreground text-right">
                    Checked in
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-b border-border/60 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{r.attendeeName}</p>
                      <p className="text-xs text-muted-foreground">{r.attendeeEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-foreground">{r.eventName}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                      {r.tierName ?? "General"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          r.status === "confirmed"
                            ? "bg-[hsl(172_50%_40%)]/10 text-[hsl(172_50%_40%)]"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setCheckedIn(r.id, !r.checkedIn)}
                        disabled={r.status === "cancelled"}
                        aria-label={`Toggle check-in for ${r.attendeeName}`}
                        className={`w-9 h-9 rounded-full inline-flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          r.checkedIn
                            ? "bg-[hsl(172_50%_40%)] text-white"
                            : "bg-muted text-muted-foreground hover:bg-muted/70"
                        } disabled:opacity-40`}
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No attendees found</h3>
          <p className="text-muted-foreground">
            {query || eventFilter !== "all"
              ? "Try a different search or filter."
              : "Registrations will show up here."}
          </p>
        </div>
      )}
    </div>
  );
}
