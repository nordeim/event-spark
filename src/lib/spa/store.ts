"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AppUser,
  DailyMetric,
  EventItem,
  IntegrationId,
  IntegrationState,
  Registration,
} from "./types";
import {
  buildDemoUser,
  buildSeedMetrics,
  buildSeedRegistrations,
  DEMO_ORGANIZER_EMAIL,
  SEED_EVENTS,
} from "./seed";
import { generateId, sha256Hex, slugify } from "./utils";

const INTEGRATIONS: IntegrationState[] = [
  { id: "slack", connected: true },
  { id: "zoom", connected: false },
  { id: "hubspot", connected: false },
  { id: "mailchimp", connected: false },
  { id: "google-calendar", connected: true },
  { id: "stripe", connected: false },
];

interface SparkState {
  users: AppUser[];
  sessionEmail: string | null;
  events: EventItem[];
  registrations: Registration[];
  integrations: IntegrationState[];
  metrics: DailyMetric[];
  /** Transient: set once the demo user is guaranteed to exist. */
  authReady: boolean;

  ensureDemoUser: () => Promise<void>;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ ok: true } | { ok: false; error: string }>;
  signOut: () => void;

  createEvent: (
    draft: Omit<EventItem, "id" | "slug" | "createdAt" | "formFields" | "ownerId">
  ) => EventItem;
  updateEvent: (id: string, patch: Partial<EventItem>) => void;
  deleteEvent: (id: string) => void;

  registerForEvent: (input: {
    eventId: string;
    attendeeName: string;
    attendeeEmail: string;
    quantity: number;
    tierId?: string;
    source?: Registration["source"];
  }) => Registration;
  cancelRegistration: (registrationId: string) => void;
  setCheckedIn: (registrationId: string, checkedIn: boolean) => void;

  toggleIntegration: (id: IntegrationId) => void;
  updateProfile: (name: string, email: string) => void;
  resetDemoData: () => void;
}

/** localStorage may be unavailable in restricted browsers; degrade to memory. */
function safeStorage(): Storage {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      const probe = "__spark_probe__";
      window.localStorage.setItem(probe, "1");
      window.localStorage.removeItem(probe);
      return window.localStorage;
    }
  } catch {
    // fall through to memory storage
  }
  const memory = new Map<string, string>();
  return {
    getItem: (key: string) => memory.get(key) ?? null,
    setItem: (key: string, value: string) => memory.set(key, value),
    removeItem: (key: string) => memory.delete(key),
    clear: () => memory.clear(),
    key: (index: number) => Array.from(memory.keys())[index] ?? null,
    get length() {
      return memory.size;
    },
  };
}

export const useSparkStore = create<SparkState>()(
  persist(
    (set, get) => ({
      users: [],
      sessionEmail: null,
      events: SEED_EVENTS,
      registrations: buildSeedRegistrations(),
      integrations: INTEGRATIONS,
      metrics: buildSeedMetrics(),
      authReady: false,

      ensureDemoUser: async () => {
        const existing = get().users.find(
          (u) => u.email === DEMO_ORGANIZER_EMAIL
        );
        if (existing) {
          set({ authReady: true });
          return;
        }
        const demoUser = await buildDemoUser();
        set((state) => ({
          users: [demoUser, ...state.users.filter((u) => u.id !== demoUser.id)],
          authReady: true,
        }));
      },

      signUp: async (name, email, password) => {
        const normalized = email.trim().toLowerCase();
        if (get().users.some((u) => u.email === normalized)) {
          return { ok: false, error: "An account with this email already exists." };
        }
        const user: AppUser = {
          id: generateId("user"),
          name: name.trim(),
          email: normalized,
          passwordHash: await sha256Hex(password),
          role: "organizer",
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ users: [...state.users, user], sessionEmail: user.email }));
        return { ok: true };
      },

      signIn: async (email, password) => {
        const normalized = email.trim().toLowerCase();
        const user = get().users.find((u) => u.email === normalized);
        if (!user) {
          return { ok: false, error: "No account found with this email." };
        }
        const hash = await sha256Hex(password);
        if (hash !== user.passwordHash) {
          return { ok: false, error: "Incorrect password. Please try again." };
        }
        set({ sessionEmail: user.email });
        return { ok: true };
      },

      signOut: () => set({ sessionEmail: null }),

      createEvent: (draft) => {
        const sessionEmail = get().sessionEmail ?? DEMO_ORGANIZER_EMAIL;
        const owner =
          get().users.find((u) => u.email === sessionEmail) ??
          get().users[0];
        const event: EventItem = {
          ...draft,
          id: generateId("evt"),
          slug: slugify(draft.name),
          ownerId: owner?.id ?? "user_demo_organizer",
          createdAt: new Date().toISOString(),
          formFields: [
            { id: "field_name", label: "Name", type: "text", required: true },
            { id: "field_email", label: "Email", type: "email", required: true },
          ],
        };
        set((state) => ({ events: [event, ...state.events] }));
        return event;
      },

      updateEvent: (id, patch) =>
        set((state) => ({
          events: state.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
        })),

      deleteEvent: (id) =>
        set((state) => ({
          events: state.events.filter((e) => e.id !== id),
          registrations: state.registrations.filter((r) => r.eventId !== id),
        })),

      registerForEvent: ({ eventId, attendeeName, attendeeEmail, quantity, tierId, source }) => {
        const registration: Registration = {
          id: generateId("reg"),
          eventId,
          attendeeName: attendeeName.trim(),
          attendeeEmail: attendeeEmail.trim().toLowerCase(),
          quantity,
          tierId,
          status: "confirmed",
          checkedIn: false,
          createdAt: new Date().toISOString(),
          source: source ?? "direct",
        };
        set((state) => ({ registrations: [registration, ...state.registrations] }));
        return registration;
      },

      cancelRegistration: (registrationId) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === registrationId ? { ...r, status: "cancelled" } : r
          ),
        })),

      setCheckedIn: (registrationId, checkedIn) =>
        set((state) => ({
          registrations: state.registrations.map((r) =>
            r.id === registrationId ? { ...r, checkedIn } : r
          ),
        })),

      toggleIntegration: (id) =>
        set((state) => ({
          integrations: state.integrations.map((i) =>
            i.id === id ? { ...i, connected: !i.connected } : i
          ),
        })),

      updateProfile: (name, email) =>
        set((state) => {
          const normalized = email.trim().toLowerCase();
          const currentEmail = state.sessionEmail;
          if (!currentEmail) return {};
          return {
            users: state.users.map((u) =>
              u.email === currentEmail
                ? { ...u, name: name.trim(), email: normalized }
                : u
            ),
            sessionEmail: normalized,
          };
        }),

      resetDemoData: () =>
        set({
          events: SEED_EVENTS,
          registrations: buildSeedRegistrations(),
          integrations: INTEGRATIONS,
          metrics: buildSeedMetrics(),
        }),
    }),
    {
      name: "eventspark-store-v1",
      version: 1,
      storage: createJSONStorage(safeStorage),
      partialize: (state) => ({
        users: state.users,
        sessionEmail: state.sessionEmail,
        events: state.events,
        registrations: state.registrations,
        integrations: state.integrations,
        metrics: state.metrics,
      }),
    }
  )
);

/* ------------------------- derived selectors ------------------------- */

export function selectCurrentUser(state: SparkState): AppUser | null {
  if (!state.sessionEmail) return null;
  return state.users.find((u) => u.email === state.sessionEmail) ?? null;
}

export function selectEventBySlug(state: SparkState, slug: string): EventItem | undefined {
  return state.events.find((e) => e.slug === slug);
}

export function selectRegistrationsForEvent(
  state: SparkState,
  eventId: string
): Registration[] {
  return state.registrations.filter((r) => r.eventId === eventId);
}

export function selectConfirmedAttendeeCount(
  state: SparkState,
  eventId: string
): number {
  return state.registrations
    .filter((r) => r.eventId === eventId && r.status === "confirmed")
    .reduce((sum, r) => sum + r.quantity, 0);
}

export function selectMyTickets(
  state: SparkState,
  email: string | null
): Array<{ registration: Registration; event: EventItem }> {
  if (!email) return [];
  return state.registrations
    .filter(
      (r) => r.attendeeEmail === email.toLowerCase() && r.status === "confirmed"
    )
    .map((registration) => ({
      registration,
      event: state.events.find((e) => e.id === registration.eventId),
    }))
    .filter(
      (pair): pair is { registration: Registration; event: EventItem } =>
        Boolean(pair.event)
    );
}
