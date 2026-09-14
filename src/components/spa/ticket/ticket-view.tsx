"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, CalendarDays, MapPin, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EventSparkLogo } from "@/components/spa/logo";
import { TicketQrCode } from "@/components/spa/qr-code";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import { formatDateLong } from "@/lib/spa/utils";

export function TicketView({ registrationId }: { registrationId: string }) {
  const registrations = useSparkStore((s) => s.registrations);
  const events = useSparkStore((s) => s.events);

  const pair = useMemo(() => {
    const registration = registrations.find(
      (r) => r.id === registrationId
    );
    if (!registration) return null;
    const event = events.find((e) => e.id === registration.eventId);
    if (!event) return null;
    return { registration, event };
  }, [registrations, events, registrationId]);

  if (!pair) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <EventSparkLogo className="justify-center mb-6" />
          <h1 className="text-2xl font-display font-bold mb-2">Ticket not found</h1>
          <p className="text-muted-foreground mb-8">
            This ticket link is invalid or the event is no longer live.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const { registration, event } = pair;
  const accent = event.accentColor;

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:py-14 flex items-center justify-center overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <button
          onClick={() => navigate(`/register/${event.slug}`)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1 px-2 h-9 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          View event page
        </button>

        <div className="rounded-[28px] overflow-hidden bg-card shadow-[0_24px_70px_-20px_rgba(0,0,0,0.25)]">
          <div
            className="px-6 pt-7 pb-6 text-white relative"
            style={{
              background: `linear-gradient(135deg, ${accent}, ${accent}cc)`,
            }}
          >
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] opacity-90">
              <Ticket className="w-3.5 h-3.5" aria-hidden="true" />
              Your ticket
            </div>
            <h1
              className="font-display font-bold text-2xl sm:text-3xl mt-2 leading-tight tracking-[-0.02em]"
              style={{ fontWeight: 700 }}
            >
              {event.name}
            </h1>
            <div className="mt-4 text-sm/relaxed opacity-95">
              <div className="flex items-start gap-2">
                <CalendarDays className="w-4 h-4 mt-0.5" aria-hidden="true" />
                {formatDateLong(event.date)}
              </div>
              <div className="flex items-start gap-2 mt-1.5">
                <MapPin className="w-4 h-4 mt-0.5" aria-hidden="true" />
                {event.isRemote ? "Remote (link in email)" : `${event.city}${event.venue ? ` · ${event.venue}` : ""}`}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-muted-foreground font-bold">
                  Attendee
                </p>
                <p className="font-semibold text-foreground mt-1">
                  {registration.attendeeName}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {registration.attendeeEmail}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {registration.quantity}{" "}
                  {registration.quantity === 1 ? "ticket" : "tickets"}
                </p>
              </div>
              <TicketQrCode seed={registration.id} size={116} className="rounded-lg" />
            </div>

            <div className="border-t border-dashed border-border mt-5 pt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-mono">{registration.id}</span>
              <span
                className={`inline-flex items-center gap-1.5 font-semibold ${
                  registration.status === "confirmed"
                    ? "text-[hsl(172_50%_40%)]"
                    : "text-destructive"
                }`}
              >
                {registration.status === "confirmed" ? "Confirmed" : "Cancelled"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-5">
              Show this QR at the door. Bookmark this page to keep your ticket
              handy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
