"use client";

import { useEffect, useMemo } from "react";
import { Sparkles } from "lucide-react";
import { EventSparkLogo } from "@/components/spa/logo";
import { LandingPage } from "@/components/spa/landing/landing-page";
import { AuthView } from "@/components/spa/auth/auth-view";
import { RegisterView } from "@/components/spa/register/register-view";
import { TicketView } from "@/components/spa/ticket/ticket-view";
import { DashboardShell } from "@/components/spa/dashboard/dashboard-shell";
import { DashboardHome } from "@/components/spa/dashboard/dashboard-home";
import { EventsView } from "@/components/spa/dashboard/events-view";
import { CreateEventView } from "@/components/spa/dashboard/create-event-view";
import { EventWorkspace } from "@/components/spa/dashboard/event-workspace";
import { AttendeesView } from "@/components/spa/dashboard/attendees-view";
import { AnalyticsView } from "@/components/spa/dashboard/analytics-view";
import { IntegrationsView } from "@/components/spa/dashboard/integrations-view";
import { SettingsView } from "@/components/spa/dashboard/settings-view";
import { Button } from "@/components/ui/button";
import { navigate, routeSegments, useHashRoute } from "@/lib/spa/router";
import { selectCurrentUser, useSparkStore } from "@/lib/spa/store";

function NotFoundView() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <EventSparkLogo className="justify-center mb-6" />
        <p className="font-display text-7xl font-bold text-primary" style={{ fontWeight: 700 }}>
          404
        </p>
        <h1 className="text-lg font-semibold text-foreground mt-2 mb-1">
          This page took the night off
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          The link you followed doesn&apos;t lead anywhere.
        </p>
        <Button variant="primary" onClick={() => navigate("/")}>
          <Sparkles className="w-4 h-4" aria-hidden="true" />
          Back to home
        </Button>
      </div>
    </div>
  );
}

function DashboardRoutes({ path }: { path: string }) {
  const segments = routeSegments(path); // ["dashboard", ...rest]
  const rest = segments.slice(1);

  const { view, param } = useMemo(() => {
    if (rest.length === 0) return { view: "home", param: undefined as string | undefined };
    const [head, second] = rest;
    if (head === "home") return { view: "home", param: undefined };
    if (head === "events") {
      if (second === "create") return { view: "create", param: undefined };
      if (second) return { view: "workspace", param: second };
      return { view: "events", param: undefined };
    }
    if (head === "attendees") return { view: "attendees", param: undefined };
    if (head === "analytics") return { view: "analytics", param: undefined };
    if (head === "integrations") return { view: "integrations", param: undefined };
    if (head === "settings") return { view: "settings", param: undefined };
    return { view: "home", param: undefined };
  }, [rest]);

  const title = useMemo(() => {
    switch (view) {
      case "home":
        return "Overview";
      case "events":
        return "Events";
      case "create":
        return "Create event";
      case "workspace":
        return "Event workspace";
      case "attendees":
        return "Attendees";
      case "analytics":
        return "Analytics";
      case "integrations":
        return "Integrations";
      case "settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  }, [view]);

  return (
    <DashboardShell path="/dashboard" currentPath={path} title={title}>
      {view === "home" && <DashboardHome />}
      {view === "events" && <EventsView />}
      {view === "create" && <CreateEventView />}
      {view === "workspace" && param && <EventWorkspace eventId={param} />}
      {view === "attendees" && <AttendeesView />}
      {view === "analytics" && <AnalyticsView />}
      {view === "integrations" && <IntegrationsView />}
      {view === "settings" && <SettingsView />}
    </DashboardShell>
  );
}

export function EventSparkApp() {
  const path = useHashRoute();
  const authReady = useSparkStore((s) => s.authReady);
  const ensureDemoUser = useSparkStore((s) => s.ensureDemoUser);
  const user = useSparkStore(selectCurrentUser);

  useEffect(() => {
    void ensureDemoUser();
  }, [ensureDemoUser]);

  // Scroll to top whenever the route changes (mirrors SPA scroll behavior).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [path]);

  if (!authReady) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <img
            src="/images/logo-glyph-3YxcYhaR.png"
            alt=""
            className="w-14 h-14 object-contain animate-pulse"
            aria-hidden="true"
          />
          <p className="text-sm text-muted-foreground">Warming up eventspark…</p>
        </div>
      </div>
    );
  }

  const segments = routeSegments(path);
  const head = segments[0] ?? "";

  // Auth guard: dashboard requires a signed-in user.
  if (head === "dashboard" && !user) {
    return <AuthView initialMode="login" />;
  }

  switch (head) {
    case "":
      return <LandingPage />;
    case "auth": {
      const query = path.split("?")[1] ?? "";
      const mode = query.includes("mode=signup") ? "signup" : "login";
      return <AuthView key={mode} initialMode={mode} />;
    }
    case "register": {
      const slug = segments[1];
      if (!slug) return <NotFoundView />;
      return <RegisterView slug={slug} />;
    }
    case "ticket": {
      const id = segments[1];
      if (!id) return <NotFoundView />;
      return <TicketView registrationId={id} />;
    }
    case "dashboard":
      return <DashboardRoutes path={path} />;
    default:
      return <NotFoundView />;
  }
}
