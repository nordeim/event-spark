"use client";

import { Hero } from "./hero";
import { LandingNav } from "./nav";
import { PopularEvents } from "./popular-events";
import { Features } from "./features";
import { Testimonials } from "./testimonials";
import { FinalCta, LandingFooter } from "./final-cta";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      <LandingNav />
      <main>
        <Hero />
        <PopularEvents />
        <Features />
        <Testimonials />
        <FinalCta />
      </main>
      <div className="mt-auto">
        <LandingFooter />
      </div>
    </div>
  );
}
