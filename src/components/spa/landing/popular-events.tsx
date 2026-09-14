"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useSparkStore } from "@/lib/spa/store";
import { LANDING_CONTENT } from "@/lib/spa/copy";
import { navigate } from "@/lib/spa/router";
import { formatDateShort, formatPrice } from "@/lib/spa/utils";
import type { EventItem } from "@/lib/spa/types";

function EventCard({ event, index }: { event: EventItem; index: number }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/register/${event.slug}`)}
      className="group cursor-pointer text-left w-full"
      aria-label={`View ${event.name}`}
    >
      <div className="relative rounded-3xl overflow-hidden mb-4 aspect-[4/5]">
        <img
          src={event.imageUrl}
          alt={event.name}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent" />
        <span className="absolute top-4 left-4 bg-background/95 backdrop-blur text-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-[0.15em] shadow-sm">
          {formatPrice(event.price)}
        </span>
      </div>
      <p className="text-[11px] text-primary font-bold uppercase tracking-[0.18em] mb-1.5">
        {formatDateShort(event.date)}
      </p>
      <h3
        className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors tracking-[-0.01em]"
        style={{ fontWeight: 700 }}
      >
        {event.name}
      </h3>
      <p className="text-sm text-muted-foreground mt-0.5">{event.city}</p>
    </motion.button>
  );
}

export function PopularEvents() {
  const { popularEvents } = LANDING_CONTENT;
  const events = useSparkStore((s) => s.events);
  const featured = events
    .filter((e) => e.status === "published")
    .slice(0, 4);

  return (
    <section className="py-20 lg:py-28 bg-muted/40">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
          <div className="max-w-xl">
            <h2
              className="text-3xl sm:text-5xl font-display text-foreground tracking-[-0.03em] leading-[1.05] mb-3"
              style={{ fontWeight: 700 }}
            >
              {popularEvents.titleLine1}
              <br />
              {popularEvents.titleLine2}
            </h2>
            <p className="text-muted-foreground text-base lg:text-lg">
              {popularEvents.subhead}
            </p>
          </div>
          <button
            onClick={() => navigate("/auth")}
            className="group inline-flex items-center gap-2 text-primary font-semibold text-sm self-start md:self-end focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-full p-1"
          >
            {popularEvents.ctaLabel}
            <span className="w-9 h-9 rounded-full bg-primary text-primary-foreground inline-flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
