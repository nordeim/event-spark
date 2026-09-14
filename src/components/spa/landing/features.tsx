"use client";

import { motion } from "framer-motion";
import { Plug2, CalendarDays, Users } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/spa/copy";

const INTEGRATION_LOGOS: Array<{ src: string; alt: string }> = [
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/slack-icon.svg",
    alt: "Slack",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/zoom-icon.svg",
    alt: "Zoom",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/hubspot.svg",
    alt: "HubSpot",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/mailchimp-freddie.svg",
    alt: "Mailchimp",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/google-calendar.svg",
    alt: "Calendar",
  },
  {
    src: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/stripe.svg",
    alt: "Stripe",
  },
];

const AUDIENCE_AVATARS = [
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=8",
  "https://i.pravatar.cc/150?img=9",
  "https://i.pravatar.cc/150?img=12",
  "https://i.pravatar.cc/150?img=16",
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const BAR_HEIGHTS = [40, 65, 30, 55, 80, 45, 70];

/** Miniature event registration page rendered inside the "Pages" card. */
function EventPageMockup() {
  return (
    <div className="w-[85%] bg-white rounded-xl shadow-lg overflow-hidden">
      <img
        src="/images/event-vibe-coding-summit-C9Heb7_3.jpg"
        alt="Event page preview"
        className="w-full h-24 object-cover"
      />
      <div className="p-4">
        <h4
          className="text-sm font-display font-bold text-foreground leading-tight mb-2"
          style={{ fontWeight: 700 }}
        >
          Vibe coding summit 2026
        </h4>
        <p className="text-[11px] text-muted-foreground mb-1">
          📅 Apr 19, 2026
        </p>
        <p className="text-[11px] text-muted-foreground mb-3">📍 San Francisco</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground w-12">Name</span>
            <div className="h-5 bg-muted rounded-md flex-1" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] text-muted-foreground w-12">Email</span>
            <div className="h-5 bg-muted rounded-md flex-1" />
          </div>
        </div>
        <div className="h-7 rounded-full flex items-center justify-center bg-primary">
          <span className="text-[9px] text-white font-semibold">
            Register now
          </span>
        </div>
      </div>
    </div>
  );
}

/** Live analytics widget rendered inside the "Insights" card. */
function AnalyticsMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="w-[85%] bg-white/80 rounded-xl shadow-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <CalendarDays
            className="w-4 h-4 text-[hsl(172_50%_40%)]"
            aria-hidden="true"
          />
          <span
            className="text-[10px] font-bold text-[hsl(172_50%_40%)]"
          >
            Live
          </span>
          <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-[hsl(172_50%_40%)]" />
        </div>
        <div className="flex items-end gap-1.5 h-20" aria-hidden="true">
          {BAR_HEIGHTS.map((height, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-[hsl(172_50%_40%)]"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {WEEK_DAYS.map((day) => (
            <span key={day} className="text-[8px] text-muted-foreground">
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Hub-and-spoke integration constellation rendered inside the "Integrations" card. */
function IntegrationsMockup() {
  const ring = [0, 1, 2, 3, 4, 5];
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="relative w-44 h-44">
        <div className="absolute inset-0 rounded-full border border-dashed border-foreground/15" />
        <div className="absolute inset-6 rounded-full border border-dashed border-foreground/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center">
          <Plug2 className="w-6 h-6 text-foreground" aria-hidden="true" />
        </div>
        {ring.map((i) => {
          const angle = (i / ring.length) * Math.PI * 2 - Math.PI / 2;
          const radius = 74;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const logo = INTEGRATION_LOGOS[i];
          return (
            <div
              key={i}
              className="absolute w-11 h-11 rounded-2xl bg-white shadow-md flex items-center justify-center"
              style={{
                top: `calc(50% + ${y}px - 22px)`,
                left: `calc(50% + ${x}px - 22px)`,
              }}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-6 h-6 object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Overlapping avatar cluster rendered inside the "Audience" card. */
function AudienceMockup() {
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6">
      <div className="grid grid-cols-3 gap-4">
        {AUDIENCE_AVATARS.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Attendee ${i + 1}`}
            className="w-16 h-16 rounded-full overflow-hidden shadow-md border-[3px] border-white object-cover"
          />
        ))}
      </div>
    </div>
  );
}

function FeatureTag({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold tracking-[0.18em] uppercase opacity-70">
      {children}
    </span>
  );
}

export function Features() {
  const { features } = LANDING_CONTENT;
  const [pages, insights, integrations, audience] = features.items;

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14 lg:mb-20">
          <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-primary">
            {features.eyebrow}
          </span>
          <h2
            className="text-3xl sm:text-5xl font-display text-foreground tracking-[-0.03em] leading-[1.05] mt-3 mb-4"
            style={{ fontWeight: 700 }}
          >
            {features.titleLine1}
            <br />
            {features.titleLine2}
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg">
            {features.subhead}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          {/* Pages — dark showcase card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-full rounded-[2rem] overflow-hidden flex flex-col shadow-sm bg-foreground text-background">
              <div className="bg-[hsl(340,75%,95%)] aspect-[5/3] flex items-center justify-center">
                <EventPageMockup />
              </div>
              <div className="p-7 lg:p-8">
                <FeatureTag>{pages.tag}</FeatureTag>
                <h3
                  className="font-display text-xl font-semibold mt-1.5 mb-2 tracking-[-0.01em]"
                  style={{ fontWeight: 700 }}
                >
                  {pages.title}
                </h3>
                <p className="text-sm text-background/70 leading-relaxed">
                  {pages.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Insights — pink card with live analytics */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="h-full rounded-[2rem] overflow-hidden flex flex-col shadow-sm bg-primary/10 text-foreground">
              <div className="bg-[hsl(170,60%,92%)] aspect-[5/3] flex items-center justify-center">
                <AnalyticsMockup />
              </div>
              <div className="p-7 lg:p-8">
                <FeatureTag>{insights.tag}</FeatureTag>
                <h3
                  className="font-display text-xl font-semibold mt-1.5 mb-2 tracking-[-0.01em]"
                  style={{ fontWeight: 700 }}
                >
                  {insights.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {insights.description}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Integrations — muted card with logo constellation */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-2"
          >
            <div className="h-full rounded-[2rem] overflow-hidden flex flex-col shadow-sm bg-muted text-foreground">
              <div className="bg-[hsl(45,90%,92%)] aspect-[5/3] flex items-center justify-center relative flex-shrink-0">
                <IntegrationsMockup />
              </div>
              <div className="p-7 lg:p-8 flex flex-col justify-center">
                <FeatureTag>{integrations.tag}</FeatureTag>
                <h3
                  className="font-display text-xl font-semibold mt-1.5 mb-2 tracking-[-0.01em]"
                  style={{ fontWeight: 700 }}
                >
                  {integrations.title}
                </h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  {integrations.description}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Audience — pink card with avatar cluster */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-3"
          >
            <div className="h-full rounded-[2rem] overflow-hidden flex flex-col sm:flex-row shadow-sm bg-primary text-primary-foreground">
              <div className="bg-[hsl(250,60%,94%)] sm:w-1/2 aspect-[5/3] sm:aspect-auto flex items-center justify-center relative">
                <AudienceMockup />
              </div>
              <div className="p-7 lg:p-8 flex flex-col justify-center">
                <FeatureTag>{audience.tag}</FeatureTag>
                <h3
                  className="font-display text-xl font-semibold mt-1.5 mb-2 tracking-[-0.01em]"
                  style={{ fontWeight: 700 }}
                >
                  {audience.title}
                </h3>
                <p className="text-sm text-primary-foreground/80 leading-relaxed">
                  {audience.description}
                </p>
                <div className="flex items-center gap-2 mt-5 text-sm font-semibold">
                  <Users className="w-4 h-4" aria-hidden="true" />
                  12,400+ organizers onboard
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
