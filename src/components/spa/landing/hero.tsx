"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkle } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/spa/copy";
import { navigate } from "@/lib/spa/router";

const FLOATING_CARDS = [
  {
    img: "/images/event-chill-code-workshop-DoJDLJ0E.jpg",
    alt: "Chill code workshop",
    label: "Workshop",
    position:
      "left-[-100px] lg:left-[-40px] top-[20px]",
    rotate: "rotate-[6deg]",
  },
  {
    img: "/images/event-late-night-jam-BIQZsWFH.jpg",
    alt: "Late night jam",
    label: "Social",
    position: "left-[-120px] lg:left-[-60px] bottom-[20px]",
    rotate: "rotate-[-5deg]",
  },
  {
    img: "/images/event-startup-weekend-ChHnYru0.jpg",
    alt: "Startup weekend",
    label: "Hackathon",
    position: "right-[-100px] lg:right-[-40px] top-[20px]",
    rotate: "rotate-[-6deg]",
  },
  {
    img: "/images/event-vibe-coding-summit-C9Heb7_3.jpg",
    alt: "Vibe coding summit",
    label: "Conference",
    position: "right-[-120px] lg:right-[-60px] bottom-[20px]",
    rotate: "rotate-[5deg]",
  },
];

function RotatingWord({ words }: { words: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length <= 1) return;
    const timer = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      2600
    );
    return () => window.clearInterval(timer);
  }, [words.length]);

  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b), "");

  return (
    <span className="inline-block relative">
      <motion.span
        key={index}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="text-primary inline-block italic"
      >
        {words[index]}
      </motion.span>
      <span
        className="invisible inline-block h-0 overflow-hidden"
        aria-hidden="true"
      >
        {longest}
      </span>
    </span>
  );
}

/** Decorative confetti scattered around the hero floating cards. */
const CONFETTI: Array<{
  className: string;
  shape: "circle" | "triangle" | "rect" | "squiggle";
  color: string;
  size: number;
  rotate: number;
}> = [
  { className: "left-[6%] top-[16%]", shape: "circle", color: "#F9A8D4", size: 10, rotate: 0 },
  { className: "left-[3%] top-[46%]", shape: "triangle", color: "#86EFAC", size: 14, rotate: 18 },
  { className: "left-[10%] bottom-[24%]", shape: "rect", color: "#FCD34D", size: 12, rotate: 24 },
  { className: "right-[5%] top-[12%]", shape: "circle", color: "#93C5FD", size: 8, rotate: 0 },
  { className: "right-[9%] top-[38%]", shape: "triangle", color: "#F9A8D4", size: 16, rotate: -12 },
  { className: "right-[4%] bottom-[30%]", shape: "rect", color: "#F9A8D4", size: 10, rotate: -18 },
  { className: "left-[16%] top-[8%]", shape: "squiggle", color: "#93C5FD", size: 22, rotate: 8 },
  { className: "right-[18%] bottom-[12%]", shape: "circle", color: "#FCD34D", size: 9, rotate: 0 },
  { className: "left-[20%] bottom-[10%]", shape: "circle", color: "#86EFAC", size: 7, rotate: 0 },
  { className: "right-[16%] top-[6%]", shape: "rect", color: "#FCD34D", size: 11, rotate: 40 },
];

function ConfettiShape({
  shape,
  color,
  size,
  rotate,
}: {
  shape: "circle" | "triangle" | "rect" | "squiggle";
  color: string;
  size: number;
  rotate: number;
}) {
  if (shape === "squiggle") {
    return (
      <svg width={size * 2} height={size / 2} viewBox={`0 0 ${size * 2} ${size / 2}`} aria-hidden="true">
        <path
          d={`M0 ${size / 4} Q ${size / 2} 0, ${size} ${size / 4} T ${size * 2} ${size / 4}`}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    );
  }
  if (shape === "triangle") {
    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <path d={`M${size / 2} 0 L${size} ${size} L0 ${size} Z`} fill={color} />
      </svg>
    );
  }
  return (
    <span
      style={{
        backgroundColor: color,
        width: size,
        height: shape === "rect" ? size * 0.62 : size,
        borderRadius: shape === "circle" ? "50%" : 2,
        display: "block",
      }}
    />
  );
}

export function Hero() {
  const { hero } = LANDING_CONTENT;

  return (
    <section className="relative overflow-hidden pt-[72px]">
      <div
        className="absolute inset-x-0 top-0 -z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="mx-auto h-[720px] w-[120%] -translate-x-[10%] bg-[radial-gradient(ellipse_at_50%_0%,hsl(340_75%_92%/_0.85)_0%,hsl(340_75%_96%/_0.4)_35%,transparent_70%)]" />
      </div>

      <div className="absolute inset-0 -z-0 pointer-events-none" aria-hidden="true">
        {CONFETTI.map((piece, i) => (
          <span
            key={i}
            className={`absolute ${piece.className} opacity-80`}
            style={{ transform: `rotate(${piece.rotate}deg)` }}
          >
            <ConfettiShape {...piece} />
          </span>
        ))}
      </div>

      <div className="relative min-h-[620px] flex items-center justify-center">
        {FLOATING_CARDS.map((card) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className={`hidden md:block absolute ${card.position} w-[200px] lg:w-[260px]`}
          >
            <div
              className={`rounded-2xl overflow-hidden shadow-lg ${card.rotate}`}
            >
              <img
                src={card.img}
                alt={card.alt}
                className="w-full h-[150px] object-cover"
              />
              <div className="bg-card px-3 py-2">
                <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {card.label}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-20 lg:py-28 relative text-center">
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-0.5">
              <img
                src="/images/logo-glyph-3YxcYhaR.png"
                alt=""
                className="w-12 h-12 object-contain"
                aria-hidden="true"
              />
              <span
                className="font-display font-bold text-primary tracking-tight text-2xl"
                style={{ fontWeight: 700 }}
              >
                eventspark
              </span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 mb-7 bg-primary/10 text-primary px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-[0.18em] uppercase">
            <Sparkle className="w-3 h-3" aria-hidden="true" />
            {hero.badge}
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-[68px] 2xl:text-[80px] font-display font-bold tracking-[-0.035em] leading-[0.95] text-foreground max-w-4xl mx-auto">
            {hero.headlinePrefix} <RotatingWord words={hero.rotatingWords} />
          </h1>

          <p className="text-lg lg:text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {hero.subhead}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground text-background hover:bg-foreground/90 text-base font-semibold px-9 h-14 shadow-xl shadow-foreground/10 transition-[transform,colors,box-shadow] duration-200 ease-out active:scale-[0.97] hover:-translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {hero.cta}
              <ArrowRight className="ml-2 w-4 h-4" aria-hidden="true" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
