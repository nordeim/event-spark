import type {
  AppUser,
  DailyMetric,
  EventItem,
  Registration,
} from "./types";
import { seededRandom, sha256Hex } from "./utils";

/** Demo organizer credentials shown on the auth screen. */
export const DEMO_ORGANIZER_EMAIL = "demo@eventspark.app";
export const DEMO_ORGANIZER_PASSWORD = "SparkDemo2026!";

const DEMO_ORGANIZER_ID = "user_demo_organizer";

/** Precomputed at runtime once; avoids embedding a plaintext password in source. */
export async function buildDemoUser(): Promise<AppUser> {
  return {
    id: DEMO_ORGANIZER_ID,
    name: "Demo Organizer",
    email: DEMO_ORGANIZER_EMAIL,
    passwordHash: await sha256Hex(DEMO_ORGANIZER_PASSWORD),
    role: "organizer",
    createdAt: "2026-01-15T09:00:00.000Z",
  };
}

export const SEED_EVENTS: EventItem[] = [
  {
    id: "evt_ai_hackathon",
    slug: "ai-hackathon",
    name: "AI hackathon",
    tagline: "48 hours to build the impossible",
    description:
      "Team up with builders, designers, and AI enthusiasts to prototype the next big thing. Mentors from leading AI labs, free food, and prizes for the top three teams.",
    category: "Hackathon",
    date: "2026-03-28T09:00:00.000Z",
    endDate: "2026-03-30T17:00:00.000Z",
    city: "San Francisco",
    venue: "Pier 48, The Cantina",
    isRemote: false,
    price: 0,
    imageUrl: "/images/event-hackathon-ai-CS7-Y9_n.jpg",
    accentColor: "#E23A7C",
    capacity: 220,
    status: "published",
    ticketTiers: [
      {
        id: "tier_general",
        name: "General admission",
        price: 0,
        quantity: 200,
        description: "Full weekend access",
      },
      {
        id: "tier_vip",
        name: "VIP track",
        price: 0,
        quantity: 20,
        description: "Reserved seating + mentor office hours",
      },
    ],
    ownerId: DEMO_ORGANIZER_ID,
    createdAt: "2026-02-01T10:00:00.000Z",
    formFields: [
      { id: "field_name", label: "Name", type: "text", required: true },
      { id: "field_email", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "evt_chill_workshop",
    slug: "chill-code-workshop",
    name: "Chill code workshop",
    tagline: "Low-key evening, high-value learning",
    description:
      "Bring your laptop and a project (or start one). We pair beginners with mentors, order pizza, and code at a humane pace. Zero pressure, maximum support.",
    category: "Workshop",
    date: "2026-04-03T18:30:00.000Z",
    city: "London",
    venue: "Second Home, Spitalfields",
    isRemote: false,
    price: 0,
    imageUrl: "/images/event-chill-code-workshop-DoJDLJ0E.jpg",
    accentColor: "#7C5CE0",
    capacity: 60,
    status: "published",
    ticketTiers: [
      {
        id: "tier_workshop_free",
        name: "Free seat",
        price: 0,
        quantity: 60,
        description: "Mentor pairing + pizza",
      },
    ],
    ownerId: DEMO_ORGANIZER_ID,
    createdAt: "2026-02-10T14:00:00.000Z",
    formFields: [
      { id: "field_name", label: "Name", type: "text", required: true },
      { id: "field_email", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "evt_startup_weekend",
    slug: "startup-weekend",
    name: "Startup weekend",
    tagline: "From idea to pitch in 54 hours",
    description:
      "Pitch Friday night, build all Saturday, demo Sunday afternoon. Investors, operators, and serial founders in the room. Ticket includes all meals.",
    category: "Conference",
    date: "2026-04-11T17:00:00.000Z",
    endDate: "2026-04-13T20:00:00.000Z",
    city: "New York",
    venue: "Galvanize, SoHo",
    isRemote: false,
    price: 25,
    imageUrl: "/images/event-startup-weekend-ChHnYru0.jpg",
    accentColor: "#1F9D66",
    capacity: 150,
    status: "published",
    ticketTiers: [
      {
        id: "tier_early",
        name: "Early bird",
        price: 25,
        quantity: 80,
        description: "Full weekend + meals",
      },
      {
        id: "tier_regular",
        name: "Regular",
        price: 40,
        quantity: 70,
        description: "Full weekend + meals",
      },
    ],
    ownerId: DEMO_ORGANIZER_ID,
    createdAt: "2026-02-15T11:30:00.000Z",
    formFields: [
      { id: "field_name", label: "Name", type: "text", required: true },
      { id: "field_email", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "evt_vibe_summit",
    slug: "vibe-coding-summit",
    name: "Vibe coding summit",
    tagline: "The conference for people who ship",
    description:
      "Talks, live-coding sessions, and hallway track galore. Everything runs online, with regional watch parties listed after registration.",
    category: "Conference",
    date: "2026-04-19T15:00:00.000Z",
    endDate: "2026-04-19T23:00:00.000Z",
    city: "Remote",
    isRemote: true,
    price: 0,
    imageUrl: "/images/event-vibe-coding-summit-C9Heb7_3.jpg",
    accentColor: "#E23A7C",
    capacity: 1000,
    status: "published",
    ticketTiers: [
      {
        id: "tier_summit_free",
        name: "Community pass",
        price: 0,
        quantity: 900,
        description: "All talks + Discord",
      },
      {
        id: "tier_summit_pro",
        name: "Pro pass",
        price: 0,
        quantity: 100,
        description: "Talks + workshops + recordings",
      },
    ],
    ownerId: DEMO_ORGANIZER_ID,
    createdAt: "2026-02-20T09:00:00.000Z",
    formFields: [
      { id: "field_name", label: "Name", type: "text", required: true },
      { id: "field_email", label: "Email", type: "email", required: true },
    ],
  },
  {
    id: "evt_late_night_jam",
    slug: "late-night-jam",
    name: "Late night jam",
    tagline: "Open stage, open hearts",
    description:
      "Musicians, poets, and storytellers take the stage after 10pm. Sign up for a five-minute slot when you register.",
    category: "Social",
    date: "2026-04-25T22:00:00.000Z",
    city: "Berlin",
    venue: "Kesselhaus, KulturBrauerei",
    isRemote: false,
    price: 5,
    imageUrl: "/images/event-late-night-jam-BIQZsWFH.jpg",
    accentColor: "#2B6CB0",
    capacity: 90,
    status: "draft",
    ticketTiers: [
      {
        id: "tier_jam",
        name: "Entry + welcome drink",
        price: 5,
        quantity: 90,
      },
    ],
    ownerId: DEMO_ORGANIZER_ID,
    createdAt: "2026-03-01T16:00:00.000Z",
    formFields: [
      { id: "field_name", label: "Name", type: "text", required: true },
      { id: "field_email", label: "Email", type: "email", required: true },
    ],
  },
];

const ATTENDEE_NAMES: Array<[string, string]> = [
  ["Ava Torres", "ava.torres@example.com"],
  ["Noah Kim", "noah.kim@example.com"],
  ["Mia Rossi", "mia.rossi@example.com"],
  ["Liam Okafor", "liam.okafor@example.com"],
  ["Sofia Novak", "sofia.novak@example.com"],
  ["Ethan Park", "ethan.park@example.com"],
  ["Isabel Moreno", "isabel.moreno@example.com"],
  ["Jonas Weber", "jonas.weber@example.com"],
  ["Priya Sharma", "priya.sharma@example.com"],
  ["Marcus Lee", "marcus.lee@example.com"],
  ["Nina Petrov", "nina.petrov@example.com"],
  ["Omar Haddad", "omar.haddad@example.com"],
  ["Chloe Martin", "chloe.martin@example.com"],
  ["Diego Alvarez", "diego.alvarez@example.com"],
  ["Grace Chen", "grace.chen@example.com"],
  ["Hannah Baker", "hannah.baker@example.com"],
];

const SOURCES: Registration["source"][] = [
  "direct",
  "social",
  "search",
  "referral",
];

/** Deterministic seed registrations spread across events and dates. */
export function buildSeedRegistrations(): Registration[] {
  const rand = seededRandom(20260314);
  const registrations: Registration[] = [];
  const publishedEvents = SEED_EVENTS.filter((e) => e.status === "published");

  publishedEvents.forEach((event, eventIndex) => {
    const count = [7, 5, 6, 4][eventIndex] ?? 5;
    for (let i = 0; i < count; i++) {
      const [name, email] = ATTENDEE_NAMES[(eventIndex * 5 + i) % ATTENDEE_NAMES.length];
      const dayOffset = Math.floor(rand() * 20);
      const createdAt = new Date(
        new Date(event.createdAt).getTime() + dayOffset * 86400000
      ).toISOString();
      registrations.push({
        id: `reg_${event.slug}_${i}`,
        eventId: event.id,
        attendeeName: name,
        attendeeEmail: email,
        quantity: rand() > 0.85 ? 2 : 1,
        tierId: event.ticketTiers[0]?.id,
        status: "confirmed",
        checkedIn: false,
        createdAt,
        source: SOURCES[Math.floor(rand() * SOURCES.length)],
      });
    }
  });

  return registrations;
}

/** 30-day series of views and registrations for the analytics dashboard. */
export function buildSeedMetrics(): DailyMetric[] {
  const rand = seededRandom(20260315);
  const metrics: DailyMetric[] = [];
  const today = new Date("2026-03-14T00:00:00.000Z");
  for (let i = 29; i >= 0; i--) {
    const day = new Date(today.getTime() - i * 86400000);
    const base = 18 + Math.floor(rand() * 24);
    metrics.push({
      date: day.toISOString().slice(0, 10),
      views: base * 7,
      registrations: base,
    });
  }
  return metrics;
}
