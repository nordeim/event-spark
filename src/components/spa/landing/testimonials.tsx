"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/spa/copy";

const AVATAR_SRC = [
  "/images/avatar-sarah-QPxqwbbx.jpg",
  "/images/avatar-marcus-Yc_NPS6F.jpg",
  "/images/avatar-priya-Damooia0.jpg",
  "https://i.pravatar.cc/300?img=33",
  "https://i.pravatar.cc/300?img=47",
];

function Stars() {
  return (
    <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4 fill-primary text-primary"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function Testimonials() {
  const { testimonials } = LANDING_CONTENT;

  return (
    <section className="py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2
          className="text-3xl sm:text-5xl font-display text-foreground tracking-[-0.03em] leading-[1.05] mb-12 text-center"
          style={{ fontWeight: 700 }}
        >
          {testimonials.title}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {testimonials.items.map((item, i) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.55,
                delay: i * 0.07,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={i > 2 ? "hidden md:block" : ""}
            >
              <div className="bg-card text-card-foreground h-full border-0 shadow-sm overflow-hidden rounded-2xl">
                <div className="h-[180px] overflow-hidden">
                  <img
                    src={AVATAR_SRC[i] ?? AVATAR_SRC[0]}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <div className="p-6">
                  <Stars />
                  <p className="text-sm text-foreground/90 leading-relaxed mb-4">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <p
                    className="text-sm font-semibold text-foreground"
                    style={{ fontWeight: 700 }}
                  >
                    {item.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.role}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
