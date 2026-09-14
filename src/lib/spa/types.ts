/**
 * Domain models for the Event Spark platform.
 * All persistent entities live here; the store layer (store.ts) owns state.
 */

export type EventCategory =
  | "Workshop"
  | "Social"
  | "Hackathon"
  | "Conference"
  | "Meetup";

export type EventStatus = "draft" | "published" | "archived";

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface EventItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: EventCategory;
  date: string;
  endDate?: string;
  city: string;
  venue?: string;
  isRemote: boolean;
  price: number;
  imageUrl: string;
  accentColor: string;
  capacity: number;
  status: EventStatus;
  ticketTiers: TicketTier[];
  ownerId: string;
  createdAt: string;
  formFields: RegistrationFormField[];
}

export type RegistrationFormFieldType =
  | "text"
  | "email"
  | "number"
  | "select";

export interface RegistrationFormField {
  id: string;
  label: string;
  type: RegistrationFormFieldType;
  required: boolean;
  options?: string[];
}

export type RegistrationStatus = "confirmed" | "cancelled";

export interface Registration {
  id: string;
  eventId: string;
  attendeeName: string;
  attendeeEmail: string;
  quantity: number;
  tierId?: string;
  status: RegistrationStatus;
  checkedIn: boolean;
  createdAt: string;
  source: "direct" | "social" | "search" | "referral";
}

export type UserRole = "organizer" | "attendee";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  /** SHA-256 hex digest of the password. Demo auth only — never do this in production without salt + KDF. */
  passwordHash: string;
  role: UserRole;
  createdAt: string;
}

export type IntegrationId =
  | "slack"
  | "zoom"
  | "hubspot"
  | "mailchimp"
  | "google-calendar"
  | "stripe";

export interface IntegrationState {
  id: IntegrationId;
  connected: boolean;
}

export interface LandingContent {
  hero: {
    badge: string;
    headlinePrefix: string;
    rotatingWords: string[];
    subhead: string;
    cta: string;
  };
  popularEvents: {
    titleLine1: string;
    titleLine2: string;
    subhead: string;
    ctaLabel: string;
  };
  features: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    subhead: string;
    items: Array<{ tag: string; title: string; description: string }>;
  };
  testimonials: {
    title: string;
    items: Array<{ quote: string; name: string; role: string }>;
  };
  cta: {
    titleLine1: string;
    titleLine2: string;
    subhead: string;
    ctaLabel: string;
  };
}

export interface DailyMetric {
  date: string;
  registrations: number;
  views: number;
}
