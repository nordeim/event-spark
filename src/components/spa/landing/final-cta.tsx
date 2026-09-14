"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/spa/copy";
import { navigate } from "@/lib/spa/router";
import { EventSparkLogo } from "@/components/spa/logo";

export function FinalCta() {
  const { cta } = LANDING_CONTENT;

  return (
    <section className="pt-10 lg:pt-16 pb-12 lg:pb-16 relative">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        <div className="bg-foreground rounded-[2.5rem] relative overflow-hidden px-6 pt-24 pb-20 lg:px-10 lg:pt-32 lg:pb-28 text-center">
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            aria-hidden="true"
          >
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_center,hsl(340_75%_58%)_0%,transparent_65%)]" />
          </div>
          <div
            className="absolute inset-x-0 top-0 z-20 flex justify-center pointer-events-none"
            aria-hidden="true"
          >
            <motion.img
              src="/images/logo-glyph-3YxcYhaR.png"
              alt=""
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="w-20 h-20 object-contain drop-shadow-[0_18px_40px_hsl(240_30%_14%_/_0.18)] -mt-10"
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2
              className="text-4xl sm:text-6xl lg:text-7xl font-display mb-6 text-background tracking-[-0.035em] leading-[0.95]"
              style={{ fontWeight: 700 }}
            >
              {cta.titleLine1}
              <br />
              {cta.titleLine2}
            </h2>
            <p className="text-lg text-background/70 mb-10 max-w-md mx-auto">
              {cta.subhead}
            </p>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-base font-semibold px-8 h-12 transition-[transform,colors,box-shadow] duration-200 ease-out active:scale-[0.97] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
            >
              {cta.ctaLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function LandingFooter() {
  return (
    <footer className="py-12 px-6 lg:px-8 bg-muted/40">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <EventSparkLogo />
        <p className="text-sm text-muted-foreground">
          © 2026 eventspark. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
