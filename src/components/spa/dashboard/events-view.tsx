"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Copy,
  ExternalLink,
  MapPin,
  Pencil,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import { formatDateShort, formatPrice } from "@/lib/spa/utils";
import type { EventItem } from "@/lib/spa/types";

type Filter = "all" | "published" | "draft";

function EventCard({
  event,
  attendees,
  index,
}: {
  event: EventItem;
  attendees: number;
  index: number;
}) {
  const deleteEvent = useSparkStore((s) => s.deleteEvent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group rounded-2xl border border-border bg-card overflow-hidden shadow-sm hover:shadow-lg hover:border-primary/30 transition-all"
    >
      <div
        className="relative h-36 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/dashboard/events/${event.id}`)}
        role="link"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") navigate(`/dashboard/events/${event.id}`);
        }}
        aria-label={`Open ${event.name} workspace`}
      >
        <img
          src={event.imageUrl}
          alt=""
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-foreground/10 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <span
            className={`text-[10px] font-bold uppercase tracking-[0.12em] px-2.5 py-1 rounded-full ${
              event.status === "published"
                ? "bg-[hsl(172_50%_40%)] text-white"
                : "bg-background/90 text-foreground"
            }`}
          >
            {event.status}
          </span>
          <span className="text-white text-xs font-semibold px-2.5 py-1 rounded-full bg-foreground/40 backdrop-blur">
            {formatPrice(event.price)}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3
          className="font-display font-semibold text-base text-foreground tracking-[-0.01em] truncate"
          style={{ fontWeight: 700 }}
        >
          {event.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
          <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
          {formatDateShort(event.date)}
          <MapPin className="w-3.5 h-3.5 ml-1.5" aria-hidden="true" />
          {event.isRemote ? "Remote" : event.city}
        </p>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" aria-hidden="true" />
          {attendees} registered · capacity {event.capacity}
        </p>

        <div className="flex items-center gap-2 mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => navigate(`/dashboard/events/${event.id}`)}
          >
            <Pencil className="w-3.5 h-3.5" aria-hidden="true" />
            Manage
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Copy registration link for ${event.name}`}
            title="Copy registration link"
            onClick={() => {
              const url = `${window.location.origin}${window.location.pathname}#/register/${event.slug}`;
              navigator.clipboard
                .writeText(url)
                .then(() => toast.success("Registration link copied"))
                .catch(() => toast.error("Could not copy link"));
            }}
          >
            <Copy className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            aria-label={`Open public page for ${event.name}`}
            title="Open public page"
            onClick={() => navigate(`/register/${event.slug}`)}
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                aria-label={`Delete ${event.name}`}
                title="Delete event"
              >
                <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this event?</AlertDialogTitle>
                <AlertDialogDescription>
                  &ldquo;{event.name}&rdquo; and its{" "}
                  {attendees > 0 ? `${attendees} registration(s)` : "registrations"}{" "}
                  will be permanently removed. This cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    deleteEvent(event.id);
                    toast.success("Event deleted");
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </motion.div>
  );
}

export function EventsView() {
  const events = useSparkStore((s) => s.events);
  const registrations = useSparkStore((s) => s.registrations);
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.status === filter);
  }, [events, filter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2
            className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em]"
            style={{ fontWeight: 700 }}
          >
            Events
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Create, publish, and manage everything you're hosting.
          </p>
        </div>
        <Button variant="primary" onClick={() => navigate("/dashboard/events/create")}>
          <Plus className="w-4 h-4" aria-hidden="true" />
          Create event
        </Button>
      </div>

      <div
        className="inline-flex items-center rounded-full bg-muted p-1 gap-1"
        role="tablist"
        aria-label="Filter events"
      >
        {(["all", "published", "draft"] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`h-8 px-4 rounded-full text-sm font-medium capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
              filter === f
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
            <span className="ml-1.5 text-xs opacity-70">
              {f === "all" ? events.length : events.filter((e) => e.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((event, i) => (
            <EventCard
              key={event.id}
              event={event}
              index={i}
              attendees={registrations.filter(
                (r) => r.eventId === event.id && r.status === "confirmed"
              ).length}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-border py-20 text-center">
          <CalendarDays
            className="w-12 h-12 text-muted-foreground mx-auto mb-4"
            aria-hidden="true"
          />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No {filter === "all" ? "" : filter} events yet
          </h3>
          <p className="text-muted-foreground mb-6">
            Check back soon for upcoming events — or create one now.
          </p>
          <Button variant="primary" onClick={() => navigate("/dashboard/events/create")}>
            <Plus className="w-4 h-4" aria-hidden="true" />
            Create event
          </Button>
        </div>
      )}
    </div>
  );
}
