"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays, Plus, Ticket, TrendingUp, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/spa/router";
import { selectCurrentUser, useSparkStore } from "@/lib/spa/store";
import { formatDateShort, formatPrice } from "@/lib/spa/utils";
import type { EventItem } from "@/lib/spa/types";

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em]">
          {label}
        </span>
        <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
      <p
        className="font-display text-3xl font-bold leading-none text-foreground"
        style={{ fontWeight: 700 }}
      >
        {value}
      </p>
      <p className="text-xs text-muted-foreground mt-1.5">{hint}</p>
    </div>
  );
}

function EventRow({ event, attendees }: { event: EventItem; attendees: number }) {
  const fill = Math.min(100, Math.round((attendees / event.capacity) * 100));
  return (
    <button
      onClick={() => navigate(`/dashboard/events/${event.id}`)}
      className="w-full flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img
        src={event.imageUrl}
        alt=""
        className="w-14 h-14 rounded-xl object-cover shrink-0"
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-foreground truncate">{event.name}</p>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
              event.status === "published"
                ? "bg-[hsl(172_50%_40%)]/10 text-[hsl(172_50%_40%)]"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {event.status}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 truncate">
          {formatDateShort(event.date)} · {event.city} · {formatPrice(event.price)}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${fill}%` }}
              aria-hidden="true"
            />
          </div>
          <span className="text-[11px] text-muted-foreground shrink-0">
            {attendees}/{event.capacity}
          </span>
        </div>
      </div>
      <ArrowUpRight
        className="w-4 h-4 text-muted-foreground shrink-0"
        aria-hidden="true"
      />
    </button>
  );
}

export function DashboardHome() {
  const user = useSparkStore(selectCurrentUser);
  const events = useSparkStore((s) => s.events);
  const registrations = useSparkStore((s) => s.registrations);

  const stats = useMemo(() => {
    const myEvents = events.filter((e) => e.status !== "archived");
    const confirmed = registrations.filter((r) => r.status === "confirmed");
    const totalAttendees = confirmed.reduce((sum, r) => sum + r.quantity, 0);
    const last7 = confirmed.filter(
      (r) =>
        Date.now() - new Date(r.createdAt).getTime() < 7 * 86400000
    ).length;
    const revenue = confirmed.reduce((sum, r) => {
      const event = events.find((e) => e.id === r.eventId);
      if (!event) return sum;
      const tier = event.ticketTiers.find((t) => t.id === r.tierId);
      const price = tier?.price ?? event.price;
      return sum + price * r.quantity;
    }, 0);
    return { myEvents, totalAttendees, last7, revenue };
  }, [events, registrations]);

  const myTickets = useMemo(() => {
    if (!user) return [];
    return registrations
      .filter((r) => r.attendeeEmail === user.email && r.status === "confirmed")
      .map((r) => ({ r, e: events.find((ev) => ev.id === r.eventId) }))
      .filter((p) => p.e);
  }, [registrations, events, user]);

  const recentEvents = stats.myEvents.slice(0, 5);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end justify-between gap-4"
      >
        <div>
          <p className="text-sm text-muted-foreground">
            {user ? `Welcome back, ${user.name.split(" ")[0]}` : "Welcome back"}
          </p>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em] mt-1"
            style={{ fontWeight: 700 }}
          >
            Here's your event pulse
          </h2>
        </div>
        <Button variant="primary" onClick={() => navigate("/dashboard/events/create")}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create event
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total events"
          value={String(stats.myEvents.length)}
          hint={`${events.filter((e) => e.status === "published").length} published`}
          icon={CalendarDays}
        />
        <StatCard
          label="Attendees"
          value={String(stats.totalAttendees)}
          hint={`${stats.last7} registered this week`}
          icon={Users}
        />
        <StatCard
          label="Ticket revenue"
          value={`$${stats.revenue.toLocaleString()}`}
          hint="Across confirmed registrations"
          icon={TrendingUp}
        />
        <StatCard
          label="My tickets"
          value={String(myTickets.length)}
          hint="Events you're attending"
          icon={Ticket}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <section aria-labelledby="upcoming-heading">
          <div className="flex items-center justify-between mb-4">
            <h3
              id="upcoming-heading"
              className="font-display text-lg font-semibold text-foreground"
              style={{ fontWeight: 700 }}
            >
              Upcoming events
            </h3>
            <button
              onClick={() => navigate("/dashboard/events")}
              className="text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentEvents.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                attendees={registrations.filter(
                  (r) => r.eventId === event.id && r.status === "confirmed"
                ).length}
              />
            ))}
            {recentEvents.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No events yet — create your first one.
              </p>
            )}
          </div>
        </section>

        <section aria-labelledby="tickets-heading">
          <h3
            id="tickets-heading"
            className="font-display text-lg font-semibold text-foreground mb-4"
            style={{ fontWeight: 700 }}
          >
            My tickets
          </h3>
          {myTickets.length > 0 ? (
            <div className="space-y-3">
              {myTickets.map(({ r, e }) => (
                <button
                  key={r.id}
                  onClick={() => navigate(`/ticket/${r.id}`)}
                  className="w-full flex items-center gap-4 rounded-2xl border border-border/70 bg-card p-3 hover:border-primary/40 hover:shadow-sm transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0"
                    style={{ background: e!.accentColor }}
                    aria-hidden="true"
                  >
                    <Ticket className="w-5 h-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {e!.name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDateShort(e!.date)} · {r.quantity}{" "}
                      {r.quantity === 1 ? "ticket" : "tickets"}
                    </p>
                  </div>
                  <ArrowUpRight
                    className="w-4 h-4 text-muted-foreground shrink-0"
                    aria-hidden="true"
                  />
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No tickets yet. Register for any public event and your ticket
                shows up here.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => navigate("/register/ai-hackathon")}
              >
                Try a demo event page
              </Button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
