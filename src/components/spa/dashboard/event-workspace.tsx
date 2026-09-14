"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BarChart3,
  Brush,
  Check,
  Copy,
  ExternalLink,
  Eye,
  LayoutDashboard,
  ListChecks,
  Mail,
  Megaphone,
  Palette,
  Plus,
  QrCode,
  Search,
  Settings,
  Ticket,
  Trash2,
  TrendingUp,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import { formatDateLong, formatPrice } from "@/lib/spa/utils";
import type { EventItem } from "@/lib/spa/types";

/* ----------------------------- workspace nav ----------------------------- */

interface WorkspaceSection {
  label: string;
  items: Array<{
    key: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }>;
}

const WORKSPACE_SECTIONS: WorkspaceSection[] = [
  {
    label: "Build",
    items: [
      { key: "overview", label: "Overview", icon: LayoutDashboard },
      { key: "page", label: "Landing page", icon: Eye },
      { key: "form", label: "Tickets / Registration", icon: Ticket },
      { key: "branding", label: "Branding", icon: Palette },
    ],
  },
  {
    label: "Grow",
    items: [
      { key: "promotion", label: "Promotion", icon: Megaphone },
      { key: "attendees", label: "Attendees", icon: Users },
      { key: "checkin", label: "Check-in scanner", icon: QrCode },
    ],
  },
  {
    label: "Configure",
    items: [{ key: "settings", label: "Settings", icon: Settings }],
  },
];

/* ------------------------------- overview ------------------------------- */

function WorkspaceOverview({ event, attendees }: { event: EventItem; attendees: number }) {
  const registrations = useSparkStore((s) => s.registrations);
  const confirmed = registrations.filter(
    (r) => r.eventId === event.id && r.status === "confirmed"
  );
  const revenue = confirmed.reduce((sum, r) => {
    const tier = event.ticketTiers.find((t) => t.id === r.tierId);
    return sum + (tier?.price ?? event.price) * r.quantity;
  }, 0);
  const checkedIn = confirmed.filter((r) => r.checkedIn).length;
  const fill = Math.min(100, Math.round((attendees / event.capacity) * 100));

  const steps = [
    { label: "Event details", done: true },
    { label: "Ticket tiers", done: event.ticketTiers.length > 0 },
    { label: "Branding", done: true },
    { label: "Published", done: event.status === "published" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Registrations", value: String(attendees), icon: Users },
          { label: "Revenue", value: `$${revenue.toLocaleString()}`, icon: TrendingUp },
          { label: "Checked in", value: `${checkedIn}/${attendees}`, icon: Check },
          { label: "Capacity used", value: `${fill}%`, icon: BarChart3 },
        ].map((card) => (
          <div key={card.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em]">
                {card.label}
              </span>
              <card.icon className="w-4 h-4 text-primary" aria-hidden="true" />
            </div>
            <p
              className="font-display text-3xl font-bold leading-none"
              style={{ fontWeight: 700 }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4" style={{ fontWeight: 700 }}>
          Setup progress
        </h3>
        <ul className="space-y-3">
          {steps.map((step) => (
            <li key={step.label} className="flex items-center gap-3 text-sm">
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  step.done
                    ? "bg-[hsl(172_50%_40%)] text-white"
                    : "bg-muted text-muted-foreground"
                }`}
                aria-hidden="true"
              >
                {step.done ? <Check className="w-3.5 h-3.5" /> : "—"}
              </span>
              <span className={step.done ? "text-foreground" : "text-muted-foreground"}>
                {step.label}
              </span>
              <span
                className={`ml-auto text-xs font-semibold ${
                  step.done ? "text-[hsl(172_50%_40%)]" : "text-muted-foreground"
                }`}
              >
                {step.done ? "Done" : "Pending"}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ----------------------------- landing page ----------------------------- */

function WorkspaceLandingPage({ event }: { event: EventItem }) {
  const updateEvent = useSparkStore((s) => s.updateEvent);
  const [name, setName] = useState(event.name);
  const [tagline, setTagline] = useState(event.tagline);
  const [description, setDescription] = useState(event.description);

  const dirty = name !== event.name || tagline !== event.tagline || description !== event.description;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="lp-name">Event name</Label>
          <Input id="lp-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lp-tagline">Tagline</Label>
          <Input
            id="lp-tagline"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="lp-desc">Description</Label>
          <Textarea
            id="lp-desc"
            rows={6}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            disabled={!dirty}
            onClick={() => {
              if (name.trim().length < 3) {
                toast.error("Event name is too short");
                return;
              }
              updateEvent(event.id, {
                name: name.trim(),
                tagline: tagline.trim(),
                description: description.trim(),
              });
              toast.success("Landing page updated");
            }}
          >
            Save changes
          </Button>
          <Button variant="outline" onClick={() => navigate(`/register/${event.slug}`)}>
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
            View public page
          </Button>
        </div>
      </div>

      {/* Live preview */}
      <div className="xl:sticky xl:top-8 self-start">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] mb-3">
          Live preview
        </p>
        <div className="rounded-3xl border border-border overflow-hidden shadow-lg bg-card max-w-md">
          <img src={event.imageUrl} alt="" className="w-full aspect-[16/9] object-cover" />
          <div className="p-6">
            <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-[0.15em]">
              {event.category}
            </span>
            <h3
              className="font-display text-xl font-bold text-foreground mt-3"
              style={{ fontWeight: 700 }}
            >
              {name || "Untitled"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
            <p className="text-xs text-muted-foreground mt-3">
              {formatDateLong(event.date)} ·{" "}
              {event.isRemote ? "Remote" : event.city}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------- tickets / registration -------------------------- */

function WorkspaceTickets({ event }: { event: EventItem }) {
  const updateEvent = useSparkStore((s) => s.updateEvent);
  const [tiers, setTiers] = useState(event.ticketTiers);

  const totalSold = useSparkStore((s) =>
    s.registrations
      .filter((r) => r.eventId === event.id && r.status === "confirmed")
      .reduce((sum, r) => sum + r.quantity, 0)
  );

  const updateTier = (id: string, patch: Partial<EventItem["ticketTiers"][number]>) =>
    setTiers((ts) => ts.map((t) => (t.id === id ? { ...t, ...patch } : t)));

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {tiers.length} {tiers.length === 1 ? "tier" : "tiers"} · {totalSold} sold
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            setTiers((ts) => [
              ...ts,
              {
                id: `tier_${Date.now().toString(36)}`,
                name: "New tier",
                price: 0,
                quantity: 50,
              },
            ])
          }
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          Add tier
        </Button>
      </div>

      <div className="space-y-4">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className="rounded-2xl border border-border bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-3">
              <Input
                value={tier.name}
                onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                aria-label="Tier name"
                className="font-semibold"
              />
              {tiers.length > 1 && (
                <button
                  onClick={() => setTiers((ts) => ts.filter((t) => t.id !== tier.id))}
                  aria-label={`Remove ${tier.name}`}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`tier-price-${tier.id}`}>Price (USD)</Label>
                <Input
                  id={`tier-price-${tier.id}`}
                  type="number"
                  min={0}
                  value={tier.price}
                  onChange={(e) => updateTier(tier.id, { price: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`tier-qty-${tier.id}`}>Quantity</Label>
                <Input
                  id={`tier-qty-${tier.id}`}
                  type="number"
                  min={1}
                  value={tier.quantity}
                  onChange={(e) => updateTier(tier.id, { quantity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={() => {
          const valid = tiers.every((t) => t.name.trim().length > 0 && t.quantity > 0);
          if (!valid) {
            toast.error("Tiers need a name and quantity above zero");
            return;
          }
          const lowest = Math.min(...tiers.map((t) => t.price));
          updateEvent(event.id, { ticketTiers: tiers, price: lowest });
          toast.success("Ticket tiers saved");
        }}
      >
        Save tiers
      </Button>

      <div className="rounded-2xl bg-muted/60 border border-border/70 p-5">
        <h4 className="text-sm font-semibold text-foreground mb-2">
          Registration form
        </h4>
        <p className="text-xs text-muted-foreground">
          Registrations collect <strong>Name</strong> and <strong>Email</strong>. Custom
          form fields live on the roadmap for this demo.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------- branding ------------------------------- */

const BRAND_COLORS = ["#E23A7C", "#7C5CE0", "#1F9D66", "#2B6CB0", "#D97706", "#0F766E"];

function WorkspaceBranding({ event }: { event: EventItem }) {
  const updateEvent = useSparkStore((s) => s.updateEvent);
  const [accent, setAccent] = useState(event.accentColor);

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <Label className="mb-2.5 block">Accent color</Label>
        <div className="flex items-center gap-3" role="radiogroup" aria-label="Accent color">
          {BRAND_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={accent === color}
              onClick={() => setAccent(color)}
              className={`w-10 h-10 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                accent === color
                  ? "scale-110 ring-2 ring-offset-2 ring-foreground/30"
                  : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`Accent ${color}`}
            />
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <div
          className="p-6 text-white"
          style={{ background: `linear-gradient(135deg, ${accent}, ${accent}cc)` }}
        >
          <p className="text-xs uppercase tracking-[0.2em] opacity-90">Ticket preview</p>
          <p
            className="font-display text-2xl font-bold mt-1"
            style={{ fontWeight: 700 }}
          >
            {event.name}
          </p>
        </div>
      </div>

      <Button
        variant="primary"
        onClick={() => {
          updateEvent(event.id, { accentColor: accent });
          toast.success("Branding saved");
        }}
      >
        <Brush className="w-4 h-4" aria-hidden="true" />
        Save branding
      </Button>
    </div>
  );
}

/* ------------------------------- promotion ------------------------------- */

function WorkspacePromotion({ event }: { event: EventItem }) {
  const registerUrl = typeof window === "undefined"
    ? `#/register/${event.slug}`
    : `${window.location.origin}${window.location.pathname}#/register/${event.slug}`;

  const channels = [
    { label: "Email announcement", icon: Mail, hint: "Draft a launch email with your event link" },
    { label: "Social posts", icon: Megaphone, hint: "Pre-sized copy for X, LinkedIn, and Instagram" },
    { label: "Embed widget", icon: Copy, hint: "Embed the registration card on any site" },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-border bg-card p-5">
        <Label className="mb-2 block">Your event link</Label>
        <div className="flex items-center gap-2">
          <Input readOnly value={registerUrl} className="font-mono text-xs" />
          <Button
            variant="outline"
            size="icon"
            aria-label="Copy event link"
            onClick={() => {
              navigator.clipboard
                .writeText(registerUrl)
                .then(() => toast.success("Link copied"))
                .catch(() => toast.error("Could not copy link"));
            }}
          >
            <Copy className="w-4 h-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {channels.map((channel) => (
          <button
            key={channel.label}
            onClick={() => toast.info("Promotion tooling is demo-only in this clone.")}
            className="rounded-2xl border border-border bg-card p-5 text-left hover:border-primary/40 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <channel.icon className="w-5 h-5 text-primary mb-3" aria-hidden="true" />
            <p className="text-sm font-semibold text-foreground">{channel.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{channel.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- attendees ------------------------------- */

function WorkspaceAttendees({ event }: { event: EventItem }) {
  const allRegistrations = useSparkStore((s) => s.registrations);
  const registrations = useMemo(
    () => allRegistrations.filter((r) => r.eventId === event.id),
    [allRegistrations, event.id]
  );
  const setCheckedIn = useSparkStore((s) => s.setCheckedIn);
  const cancelRegistration = useSparkStore((s) => s.cancelRegistration);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return registrations;
    return registrations.filter(
      (r) =>
        r.attendeeName.toLowerCase().includes(q) ||
        r.attendeeEmail.toLowerCase().includes(q)
    );
  }, [registrations, query]);

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search attendees…"
          className="pl-9"
          aria-label="Search attendees"
        />
      </div>

      {rows.length > 0 ? (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left">
                <th className="px-4 py-3 font-semibold text-foreground">Attendee</th>
                <th className="px-4 py-3 font-semibold text-foreground hidden sm:table-cell">
                  Tier
                </th>
                <th className="px-4 py-3 font-semibold text-foreground hidden md:table-cell">
                  Registered
                </th>
                <th className="px-4 py-3 font-semibold text-foreground">Status</th>
                <th className="px-4 py-3 font-semibold text-foreground text-right">
                  Check-in
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const tier = event.ticketTiers.find((t) => t.id === r.tierId);
                return (
                  <tr key={r.id} className="border-b border-border/60 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{r.attendeeName}</p>
                      <p className="text-xs text-muted-foreground">{r.attendeeEmail}</p>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                      {tier?.name ?? "General"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
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
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => {
                            if (r.status === "cancelled") {
                              cancelRegistration(r.id);
                              toast.info("Registration already cancelled");
                              return;
                            }
                            setCheckedIn(r.id, !r.checkedIn);
                            toast.success(
                              r.checkedIn ? "Checked out" : `${r.attendeeName} checked in`
                            );
                          }}
                          disabled={r.status === "cancelled"}
                          aria-label={`Toggle check-in for ${r.attendeeName}`}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                            r.checkedIn
                              ? "bg-[hsl(172_50%_40%)] text-white"
                              : "bg-muted text-muted-foreground hover:bg-muted/70"
                          } disabled:opacity-40`}
                        >
                          <Check className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border py-14 text-center">
          <Users className="w-10 h-10 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">
            {query ? "No attendees match your search." : "No registrations yet."}
          </p>
        </div>
      )}
    </div>
  );
}

/* ----------------------------- check-in scanner ----------------------------- */

function WorkspaceCheckIn({ event }: { event: EventItem }) {
  const allRegistrations = useSparkStore((s) => s.registrations);
  const registrations = useMemo(
    () =>
      allRegistrations.filter(
        (r) => r.eventId === event.id && r.status === "confirmed" && !r.checkedIn
      ),
    [allRegistrations, event.id]
  );
  const setCheckedIn = useSparkStore((s) => s.setCheckedIn);
  const [code, setCode] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const match = registrations.find(
      (r) => r.id.toLowerCase() === code.trim().toLowerCase()
    );
    if (!match) {
      toast.error("No pending registration matches that code");
      return;
    }
    setCheckedIn(match.id, true);
    toast.success(`${match.attendeeName} checked in`);
    setCode("");
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6">
          <span className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
            <QrCode className="w-6 h-6" aria-hidden="true" />
          </span>
          <div>
            <h3 className="font-display font-semibold text-foreground" style={{ fontWeight: 700 }}>
              Scan or enter a ticket code
            </h3>
            <p className="text-xs text-muted-foreground">
              {registrations.length} attendees waiting at the door
            </p>
          </div>
        </div>
        <form onSubmit={submit} className="flex items-center gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="reg_xxxxxxxx"
            className="font-mono"
            aria-label="Ticket code"
          />
          <Button type="submit" variant="primary">
            Check in
          </Button>
        </form>
        <p className="text-xs text-muted-foreground mt-3">
          Camera scanning needs device permissions — this demo accepts the ticket ID
          printed on each ticket.
        </p>
      </div>

      {registrations.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em] mb-3">
            Waiting list
          </p>
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {registrations.map((r) => (
              <li
                key={r.id}
                className="flex items-center justify-between gap-3 text-sm border-b border-border/50 last:border-0 pb-2 last:pb-0"
              >
                <span className="text-foreground">{r.attendeeName}</span>
                <code className="text-xs text-muted-foreground">{r.id}</code>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ------------------------------- settings ------------------------------- */

function WorkspaceSettings({ event }: { event: EventItem }) {
  const updateEvent = useSparkStore((s) => s.updateEvent);
  const deleteEvent = useSparkStore((s) => s.deleteEvent);
  const [published, setPublished] = useState(event.status === "published");

  return (
    <div className="max-w-xl space-y-6">
      <div className="rounded-2xl border border-border bg-card p-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">Event visibility</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Published events appear on their public registration page.
          </p>
        </div>
        <Switch
          checked={published}
          onCheckedChange={(value) => {
            setPublished(value);
            updateEvent(event.id, { status: value ? "published" : "draft" });
            toast.success(value ? "Event published" : "Event moved to draft");
          }}
          aria-label="Toggle event published"
        />
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
        <p className="text-sm font-semibold text-foreground">Event summary</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs text-muted-foreground">Slug</dt>
            <dd className="font-mono text-xs break-all">{event.slug}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Price</dt>
            <dd className="font-semibold">{formatPrice(event.price)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Capacity</dt>
            <dd className="font-semibold">{event.capacity}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Date</dt>
            <dd className="font-semibold">{formatDateLong(event.date)}</dd>
          </div>
        </dl>
      </div>

      <AlertDialog>
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Danger zone</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Permanently delete this event and all registrations.
            </p>
          </div>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2 className="w-4 h-4" aria-hidden="true" />
              Delete
            </Button>
          </AlertDialogTrigger>
        </div>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{event.name}&rdquo; and all its registrations will be permanently
              removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                deleteEvent(event.id);
                toast.success("Event deleted");
                navigate("/dashboard/events");
              }}
            >
              Delete event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/* ------------------------------ the shell ------------------------------ */

const SECTION_TITLES: Record<string, string> = {
  overview: "Overview",
  page: "Landing page",
  form: "Tickets / Registration",
  branding: "Branding",
  promotion: "Promotion",
  attendees: "Attendees",
  checkin: "Check-in scanner",
  settings: "Settings",
};

export function EventWorkspace({ eventId }: { eventId: string }) {
  const event = useSparkStore((s) => s.events.find((e) => e.id === eventId));
  const registrations = useSparkStore((s) => s.registrations);
  const [section, setSection] = useState("overview");

  const attendees = useMemo(
    () =>
      event
        ? registrations.filter(
            (r) => r.eventId === event.id && r.status === "confirmed"
          ).length
        : 0,
    [event, registrations]
  );

  if (!event) {
    return (
      <div className="text-center py-20">
        <p className="text-lg font-semibold text-foreground mb-2">Event not found</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/events")}>
          Back to events
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => navigate("/dashboard/events")}
            aria-label="Back to events"
            className="w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          </button>
          <div className="min-w-0">
            <h2
              className="font-display text-xl sm:text-2xl font-bold text-foreground tracking-[-0.02em] truncate"
              style={{ fontWeight: 700 }}
            >
              {event.name}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
              <ListChecks className="w-3.5 h-3.5" aria-hidden="true" />
              {attendees} registered · {event.status}
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="self-start sm:self-auto"
          onClick={() => navigate(`/register/${event.slug}`)}
        >
          <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          Public page
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <nav
          className="lg:w-60 shrink-0"
          aria-label="Event workspace sections"
        >
          <ul className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-1 lg:pb-0">
            {WORKSPACE_SECTIONS.map((group) => (
              <li key={group.label} className="lg:w-full">
                <p className="hidden lg:block px-3 mb-1.5 mt-2 first:mt-0 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                  {group.label}
                </p>
                <div className="flex lg:flex-col gap-1.5">
                  {group.items.map((item) => {
                    const active = section === item.key;
                    return (
                      <button
                        key={item.key}
                        onClick={() => setSection(item.key)}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-2.5 rounded-xl px-3 h-10 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" aria-hidden="true" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </li>
            ))}
          </ul>
        </nav>

        <motion.div
          key={section}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 min-w-0"
        >
          <h3
            className="font-display text-lg font-semibold text-foreground mb-5"
            style={{ fontWeight: 700 }}
          >
            {SECTION_TITLES[section] ?? "Overview"}
          </h3>
          {section === "overview" && (
            <WorkspaceOverview event={event} attendees={attendees} />
          )}
          {section === "page" && <WorkspaceLandingPage event={event} />}
          {section === "form" && <WorkspaceTickets event={event} />}
          {section === "branding" && <WorkspaceBranding event={event} />}
          {section === "promotion" && <WorkspacePromotion event={event} />}
          {section === "attendees" && <WorkspaceAttendees event={event} />}
          {section === "checkin" && <WorkspaceCheckIn event={event} />}
          {section === "settings" && <WorkspaceSettings event={event} />}
        </motion.div>
      </div>
    </div>
  );
}
