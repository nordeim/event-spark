import type { LandingContent } from "./types";

/** Landing page copy, mirroring the Event Spark template content. */
export const LANDING_CONTENT: LandingContent = {
  hero: {
    badge: "For organizers everywhere",
    headlinePrefix: "The event platform where ideas become",
    rotatingWords: ["events.", "experiences.", "communities.", "connections."],
    subhead:
      "Whatever your event — from workshops to conferences — build branded registration pages, track attendees, and grow your community. No code required.",
    cta: "Get started",
  },
  popularEvents: {
    titleLine1: "Popular events",
    titleLine2: "on eventspark",
    subhead: "A glimpse at the experiences our community is hosting right now.",
    ctaLabel: "Browse all events",
  },
  features: {
    eyebrow: "Built for organizers",
    titleLine1: "Everything you need to",
    titleLine2: "run amazing events.",
    subhead: "From page creation to post-event analytics, eventspark has you covered.",
    items: [
      {
        tag: "Pages",
        title: "Pages in minutes",
        description:
          "Beautiful registration pages that make your event shine — no design skills needed.",
      },
      {
        tag: "Insights",
        title: "Understand everything",
        description:
          "Live dashboards that show where attendees come from, drop off, and convert.",
      },
      {
        tag: "Integrations",
        title: "Integrate with everything",
        description:
          "Connect Zoom, HubSpot, Mailchimp, and 20+ tools in a few clicks.",
      },
      {
        tag: "Audience",
        title: "One hub for everyone",
        description:
          "Manage, message, and track every attendee from a single beautiful dashboard.",
      },
    ],
  },
  testimonials: {
    title: "Loved by organizers",
    items: [
      {
        quote:
          "eventspark cut our setup time by 80%. We went from spending hours on registration to minutes.",
        name: "Sarah Chen",
        role: "Community manager",
      },
      {
        quote:
          "The analytics alone are worth it. We finally know where our attendees are coming from.",
        name: "Marcus Williams",
        role: "Event coordinator",
      },
      {
        quote:
          "Clean, professional, and easy to use. Our attendees always compliment the registration experience.",
        name: "Priya Patel",
        role: "Startup founder",
      },
      {
        quote:
          "We switched from three different tools to just eventspark. Everything in one place is a game changer.",
        name: "James Liu",
        role: "Tech meetup organizer",
      },
      {
        quote:
          "Our registrations doubled after switching. The pages just look so much more professional.",
        name: "Amara Osei",
        role: "Conference director",
      },
    ],
  },
  cta: {
    titleLine1: "Ready to spark",
    titleLine2: "your next event?",
    subhead: "Join thousands of organizers who use eventspark to build better events.",
    ctaLabel: "Get started for free",
  },
};
