"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Link2,
  Loader2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EventSparkLogo } from "@/components/spa/logo";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import { formatDateLong, formatPrice, isValidEmail } from "@/lib/spa/utils";
import type { EventItem, TicketTier } from "@/lib/spa/types";

function formatEventTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function TierOption({
  tier,
  selected,
  onSelect,
  spotsLeft,
}: {
  tier: TicketTier;
  selected: boolean;
  onSelect: () => void;
  spotsLeft: number;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`w-full text-left rounded-2xl border p-4 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
        selected
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border hover:border-foreground/25"
      }`}
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-sm text-foreground">{tier.name}</p>
          {tier.description && (
            <p className="text-xs text-muted-foreground mt-0.5">
              {tier.description}
            </p>
          )}
        </div>
        <span
          className={`text-sm font-bold ${tier.price === 0 ? "text-[hsl(172_50%_40%)]" : "text-foreground"}`}
        >
          {formatPrice(tier.price)}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground mt-2">
        {spotsLeft > 0 ? `${spotsLeft} spots left` : "Sold out"}
      </p>
    </button>
  );
}

export function RegisterView({ slug }: { slug: string }) {
  const events = useSparkStore((s) => s.events);
  const registrations = useSparkStore((s) => s.registrations);
  const registerForEvent = useSparkStore((s) => s.registerForEvent);

  const event = useMemo(
    () => events.find((e) => e.slug === slug),
    [events, slug]
  );

  const soldByTier = useMemo(() => {
    const counts = new Map<string, number>();
    if (event) {
      registrations
        .filter((r) => r.eventId === event.id && r.status === "confirmed")
        .forEach((r) => {
          const key = r.tierId ?? "default";
          counts.set(key, (counts.get(key) ?? 0) + r.quantity);
        });
    }
    return counts;
  }, [registrations, event]);

  const [tierId, setTierId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <EventSparkLogo className="justify-center mb-6" />
          <h1 className="text-2xl font-display font-bold mb-2">Event not found</h1>
          <p className="text-muted-foreground mb-8">
            This event may have ended or the link is invalid.
          </p>
          <Button onClick={() => navigate("/")} variant="outline">
            Back to home
          </Button>
        </div>
      </div>
    );
  }

  const isDraft = event.status !== "published";
  const selectedTier =
    event.ticketTiers.find((t) => t.id === tierId) ??
    event.ticketTiers[0] ??
    null;

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!selectedTier) {
      setError("Please choose a ticket to continue.");
      return;
    }
    if (!acceptTerms) {
      setError("Please accept the privacy policy to register.");
      return;
    }
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setBusy(true);
    const registration = registerForEvent({
      eventId: event!.id,
      attendeeName: name,
      attendeeEmail: email,
      quantity,
      tierId: selectedTier.id,
      source: "direct",
    });
    setBusy(false);

    toast.success("You're in! Your ticket is ready.");
    navigate(`/ticket/${registration.id}`);
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {isDraft && (
        <div className="sticky top-0 z-50 w-full bg-foreground text-background text-center text-xs sm:text-sm py-2 px-4 font-medium">
          Preview mode — this event is not published yet.
        </div>
      )}

      <header className="border-b border-border/70">
        <div className="max-w-6xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            aria-label="eventspark home"
          >
            <EventSparkLogo />
          </a>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground bg-muted px-3 py-1.5 rounded-full">
            <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
            {event.isRemote ? "Online event" : `In person · ${event.city}`}
          </span>
        </div>
      </header>

      <div className="relative">
        <div
          className="absolute inset-x-0 top-0 h-72 pointer-events-none opacity-90"
          style={{
            background: `linear-gradient(180deg, ${event.accentColor}22, transparent)`,
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 lg:py-14 relative">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-14">
            {/* Event details */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-3"
            >
              <div className="rounded-[2rem] overflow-hidden shadow-lg mb-8">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                  className="w-full aspect-[16/9] object-cover"
                />
              </div>

              <span className="text-[11px] font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-[0.15em]">
                {event.category}
              </span>

              <h1
                className="text-3xl sm:text-5xl font-display text-foreground tracking-[-0.03em] leading-[1.05] mt-4 mb-3"
                style={{ fontWeight: 700 }}
              >
                {event.name}
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                {event.tagline}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                <div className="flex items-start gap-3 rounded-2xl border border-border/70 p-4">
                  <CalendarDays
                    className="w-5 h-5 text-primary mt-0.5"
                    aria-hidden="true"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {formatDateLong(event.date)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" aria-hidden="true" />
                      {formatEventTime(event.date)}
                      {event.endDate ? ` – ${formatEventTime(event.endDate)}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border/70 p-4">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {event.isRemote ? "Remote" : event.city}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {event.isRemote
                        ? "Join link sent after registration"
                        : event.venue ?? "Venue details on your ticket"}
                    </p>
                  </div>
                </div>
              </div>

              <h2
                className="text-xl font-display font-semibold text-foreground mb-3"
                style={{ fontWeight: 700 }}
              >
                About this event
              </h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </motion.div>

            {/* Registration card */}
            <motion.aside
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-2"
            >
              <div className="lg:sticky lg:top-8 bg-card rounded-[2rem] border border-border shadow-xl p-6 sm:p-7">
                <h2
                  className="font-display text-lg font-semibold text-foreground mb-1"
                  style={{ fontWeight: 700 }}
                >
                  Secure your spot
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {event.capacity} capacity ·{" "}
                  {event.ticketTiers.length > 1
                    ? `${event.ticketTiers.length} ticket options`
                    : "one ticket option"}
                </p>

                <div className="space-y-3 mb-6">
                  {event.ticketTiers.map((tier) => {
                    const sold = soldByTier.get(tier.id) ?? 0;
                    const spotsLeft = tier.quantity - sold;
                    return (
                      <TierOption
                        key={tier.id}
                        tier={tier}
                        selected={selectedTier?.id === tier.id}
                        onSelect={() => setTierId(tier.id)}
                        spotsLeft={spotsLeft}
                      />
                    );
                  })}
                </div>

                <form onSubmit={handleRegister} className="space-y-4" noValidate>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-name">Full name</Label>
                    <Input
                      id="reg-name"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-email">Email address</Label>
                    <Input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="reg-qty">Tickets</Label>
                    <select
                      id="reg-qty"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="flex w-full h-10 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n} {n === 1 ? "ticket" : "tickets"}
                        </option>
                      ))}
                    </select>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="mt-0.5 accent-[hsl(340_75%_58%)]"
                    />
                    <span>
                      I agree to the event policies and the eventspark privacy
                      policy, and I consent to receiving event-related emails.
                    </span>
                  </label>

                  {error && (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    className="w-full font-semibold"
                    disabled={busy}
                  >
                    {busy ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                        Registering…
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                        Register now
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-[11px] text-muted-foreground text-center mt-4">
                  You'll get a ticket with a QR code — no account needed.
                </p>
              </div>
            </motion.aside>
          </div>
        </div>
      </div>
    </div>
  );
}
