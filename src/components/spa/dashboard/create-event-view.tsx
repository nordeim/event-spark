"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import type { EventCategory, EventItem } from "@/lib/spa/types";

const CATEGORIES: EventCategory[] = [
  "Workshop",
  "Social",
  "Hackathon",
  "Conference",
  "Meetup",
];

const SAMPLE_IMAGES = [
  "/images/event-hackathon-ai-CS7-Y9_n.jpg",
  "/images/event-chill-code-workshop-DoJDLJ0E.jpg",
  "/images/event-startup-weekend-ChHnYru0.jpg",
  "/images/event-vibe-coding-summit-C9Heb7_3.jpg",
  "/images/event-late-night-jam-BIQZsWFH.jpg",
];

const ACCENT_COLORS = ["#E23A7C", "#7C5CE0", "#1F9D66", "#2B6CB0", "#D97706"];

interface EventDraft {
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  date: string;
  city: string;
  venue: string;
  isRemote: boolean;
  price: number;
  capacity: number;
  imageUrl: string;
  accentColor: string;
  status: "draft" | "published";
}

const STEPS = ["Details", "Tickets", "Branding", "Review"] as const;

export function CreateEventView() {
  const createEvent = useSparkStore((s) => s.createEvent);

  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft>({
    name: "",
    tagline: "",
    description: "",
    category: "Workshop",
    date: "",
    city: "",
    venue: "",
    isRemote: false,
    price: 0,
    capacity: 100,
    imageUrl: SAMPLE_IMAGES[0],
    accentColor: ACCENT_COLORS[0],
    status: "draft",
  });

  const update = <K extends keyof EventDraft>(key: K, value: EventDraft[K]) =>
    setDraft((d) => ({ ...d, [key]: value }));

  function validateStep(current: number): string | null {
    if (current === 0) {
      if (draft.name.trim().length < 3) return "Give your event a name (3+ characters).";
      if (!draft.date) return "Pick a date for your event.";
      if (!draft.isRemote && draft.city.trim().length < 2)
        return "Where is it happening? Add a city (or mark it remote).";
    }
    if (current === 1) {
      if (draft.capacity < 1) return "Capacity must be at least 1.";
    }
    return null;
  }

  function next() {
    const problem = validateStep(step);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  function finish(publish: boolean) {
    const problem = validateStep(0) ?? validateStep(1);
    if (problem) {
      setError(problem);
      setStep(problem.includes("name") || problem.includes("date") || problem.includes("city") ? 0 : 1);
      return;
    }
    const payload: Omit<
      EventItem,
      "id" | "slug" | "createdAt" | "formFields" | "ownerId"
    > = {
      name: draft.name.trim(),
      tagline: draft.tagline.trim() || "Hosted with eventspark",
      description: draft.description.trim() || "Details coming soon.",
      category: draft.category,
      date: new Date(`${draft.date}T17:00:00`).toISOString(),
      city: draft.isRemote ? "Remote" : draft.city.trim(),
      venue: draft.isRemote ? undefined : draft.venue.trim() || undefined,
      isRemote: draft.isRemote,
      price: draft.price,
      imageUrl: draft.imageUrl,
      accentColor: draft.accentColor,
      capacity: draft.capacity,
      status: publish ? "published" : "draft",
      ticketTiers: [
        {
          id: "tier_1",
          name: draft.price > 0 ? "General admission" : "Free admission",
          price: draft.price,
          quantity: draft.capacity,
          description: "Standard access",
        },
      ],
    };

    const event = createEvent(payload);
    toast.success(
      publish ? "Event published — page is live!" : "Draft saved"
    );
    navigate(`/dashboard/events/${event.id}`);
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/dashboard/events")}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-5 px-2 h-9 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back to events
      </button>

      <h2
        className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em] mb-2"
        style={{ fontWeight: 700 }}
      >
        Create an event
      </h2>
      <p className="text-sm text-muted-foreground mb-8">
        Four quick steps — you can edit everything later.
      </p>

      {/* Stepper */}
      <ol className="flex items-center gap-2 mb-8" aria-label="Progress">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2 flex-1">
            <span
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                i < step
                  ? "bg-[hsl(172_50%_40%)] text-white"
                  : i === step
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
              }`}
              aria-current={i === step ? "step" : undefined}
            >
              {i < step ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : i + 1}
            </span>
            <span
              className={`text-xs font-semibold hidden sm:block ${
                i <= step ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span
                className={`h-px flex-1 ${i < step ? "bg-[hsl(172_50%_40%)]" : "bg-border"}`}
                aria-hidden="true"
              />
            )}
          </li>
        ))}
      </ol>

      <motion.div
        key={step}
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-card rounded-3xl border border-border shadow-sm p-6 sm:p-8"
      >
        {step === 0 && (
          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="ce-name">Event name</Label>
              <Input
                id="ce-name"
                value={draft.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Design systems meetup"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ce-tagline">Tagline</Label>
              <Input
                id="ce-tagline"
                value={draft.tagline}
                onChange={(e) => update("tagline", e.target.value)}
                placeholder="One line that sells the event"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ce-category">Category</Label>
                <select
                  id="ce-category"
                  value={draft.category}
                  onChange={(e) => update("category", e.target.value as EventCategory)}
                  className="flex w-full h-10 rounded-lg border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce-date">Date</Label>
                <Input
                  id="ce-date"
                  type="date"
                  value={draft.date}
                  onChange={(e) => update("date", e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ce-city">City</Label>
                <Input
                  id="ce-city"
                  value={draft.city}
                  onChange={(e) => update("city", e.target.value)}
                  disabled={draft.isRemote}
                  placeholder="Berlin"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce-venue">Venue (optional)</Label>
                <Input
                  id="ce-venue"
                  value={draft.venue}
                  onChange={(e) => update("venue", e.target.value)}
                  disabled={draft.isRemote}
                  placeholder="Superstore, Kreuzberg"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={draft.isRemote}
                onChange={(e) => update("isRemote", e.target.checked)}
                className="accent-[hsl(340_75%_58%)]"
              />
              This is an online event
            </label>
            <div className="space-y-1.5">
              <Label htmlFor="ce-desc">Description</Label>
              <Textarea
                id="ce-desc"
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
                placeholder="What should attendees expect? Agenda, guests, what to bring…"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="ce-price">Ticket price (USD, 0 = free)</Label>
                <Input
                  id="ce-price"
                  type="number"
                  min={0}
                  step={1}
                  value={draft.price}
                  onChange={(e) => update("price", Number(e.target.value))}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce-capacity">Capacity</Label>
                <Input
                  id="ce-capacity"
                  type="number"
                  min={1}
                  value={draft.capacity}
                  onChange={(e) => update("capacity", Number(e.target.value))}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              A single ticket tier is created from these values — manage tiers and
              custom form fields later in the event workspace.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="mb-2.5 block">Cover image</Label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {SAMPLE_IMAGES.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => update("imageUrl", src)}
                    aria-pressed={draft.imageUrl === src}
                    className={`rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      draft.imageUrl === src
                        ? "border-primary shadow-md"
                        : "border-transparent hover:border-foreground/20"
                    }`}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label className="mb-2.5 block">Accent color</Label>
              <div className="flex items-center gap-3" role="radiogroup" aria-label="Accent color">
                {ACCENT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={draft.accentColor === color}
                    onClick={() => update("accentColor", color)}
                    className={`w-10 h-10 rounded-full transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      draft.accentColor === color
                        ? "scale-110 ring-2 ring-offset-2 ring-foreground/30"
                        : "hover:scale-105"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Accent ${color}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Used on your event page, tickets, and workspace highlights.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border overflow-hidden">
              <div className="h-40 bg-muted">
                <img
                  src={draft.imageUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-[0.15em]">
                  {draft.category}
                </span>
                <h3
                  className="font-display text-xl font-bold text-foreground mt-2"
                  style={{ fontWeight: 700 }}
                >
                  {draft.name || "Untitled event"}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {draft.date || "Date TBD"} ·{" "}
                  {draft.isRemote ? "Remote" : draft.city || "City TBD"}
                </p>
              </div>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">Price</dt>
                <dd className="font-semibold">{draft.price > 0 ? `$${draft.price}` : "Free"}</dd>
              </div>
              <div className="rounded-xl bg-muted/60 p-3">
                <dt className="text-xs text-muted-foreground">Capacity</dt>
                <dd className="font-semibold">{draft.capacity}</dd>
              </div>
            </dl>
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive mt-5" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between gap-3 mt-8">
          <Button variant="ghost" onClick={back} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next}>
              Continue
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => finish(false)}>
                Save draft
              </Button>
              <Button variant="primary" onClick={() => finish(true)}>
                <Rocket className="w-4 h-4" aria-hidden="true" />
                Publish
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
