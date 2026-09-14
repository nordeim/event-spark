"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarDays,
  ChevronsLeft,
  ChevronsRight,
  LayoutDashboard,
  LogOut,
  Menu,
  Plug2,
  Settings,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EventSparkLogo } from "@/components/spa/logo";
import { navigate } from "@/lib/spa/router";
import { selectCurrentUser, useSparkStore } from "@/lib/spa/store";

export interface DashNavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const NAV_SECTIONS: Array<{ label: string; items: DashNavItem[] }> = [
  {
    label: "Organize",
    items: [
      { key: "home", label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
      { key: "events", label: "Events", icon: CalendarDays, path: "/dashboard/events" },
      { key: "attendees", label: "Attendees", icon: Users, path: "/dashboard/attendees" },
      { key: "analytics", label: "Analytics", icon: BarChart3, path: "/dashboard/analytics" },
    ],
  },
  {
    label: "Workspace",
    items: [
      { key: "integrations", label: "Integrations", icon: Plug2, path: "/dashboard/integrations" },
      { key: "settings", label: "Settings", icon: Settings, path: "/dashboard/settings" },
    ],
  },
];

function SidebarNav({
  currentPath,
  collapsed,
  onNavigate,
}: {
  currentPath: string;
  collapsed: boolean;
  onNavigate: (path: string) => void;
}) {
  const myTickets = useSparkStore((s) => {
    const user = selectCurrentUser(s);
    if (!user) return 0;
    return s.registrations.filter(
      (r) => r.attendeeEmail === user.email && r.status === "confirmed"
    ).length;
  });

  const isActive = (path: string) => {
    if (path === "/dashboard") return currentPath === "/dashboard";
    return currentPath.startsWith(path);
  };

  return (
    <nav
      className="flex-1 overflow-y-auto px-3 py-4 space-y-6"
      aria-label="Dashboard navigation"
    >
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {section.label}
            </p>
          )}
          <ul className="space-y-1">
            {section.items.map((item) => {
              const active = isActive(item.path);
              return (
                <li key={item.key}>
                  <button
                    onClick={() => onNavigate(item.path)}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      active
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    } ${collapsed ? "justify-center px-0" : ""}`}
                  >
                    <item.icon className="w-[18px] h-[18px]" aria-hidden="true" />
                    {!collapsed && <span>{item.label}</span>}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {!collapsed && myTickets > 0 && (
        <div>
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
            Personal
          </p>
          <button
            onClick={() => onNavigate("/dashboard")}
            className="w-full flex items-center gap-3 rounded-xl px-3 h-10 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Ticket className="w-[18px] h-[18px]" aria-hidden="true" />
            <span>My tickets</span>
            <span className="ml-auto text-xs font-bold bg-primary/10 text-primary rounded-full px-2 py-0.5">
              {myTickets}
            </span>
          </button>
        </div>
      )}
    </nav>
  );
}

function SidebarUser({ collapsed }: { collapsed: boolean }) {
  const user = useSparkStore(selectCurrentUser);
  const signOut = useSparkStore((s) => s.signOut);

  return (
    <div className="border-t border-border p-3">
      {user ? (
        <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
          <div
            className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold shrink-0"
            aria-hidden="true"
          >
            {user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")
              .toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          )}
          <button
            onClick={() => {
              signOut();
              toast.success("Signed out");
              navigate("/");
            }}
            aria-label="Sign out"
            title="Sign out"
            className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-destructive transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shrink-0"
          >
            <LogOut className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => navigate("/auth")}
        >
          Sign in
        </Button>
      )}
    </div>
  );
}

export function DashboardShell({
  currentPath,
  title,
  children,
}: {
  currentPath: string;
  title: string;
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close the mobile drawer whenever in-app navigation happens (hashchange),
  // including browser back/forward.
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  const goTo = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-border bg-card transition-all duration-200 ${
          collapsed ? "w-[76px]" : "w-64"
        }`}
      >
        <div
          className={`h-16 flex items-center border-b border-border px-4 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            aria-label="eventspark home"
          >
            {collapsed ? (
              <img
                src="/images/logo-glyph-3YxcYhaR.png"
                alt=""
                className="w-8 h-8 object-contain"
                aria-hidden="true"
              />
            ) : (
              <EventSparkLogo />
            )}
          </a>
        </div>
        <SidebarNav currentPath={currentPath} collapsed={collapsed} onNavigate={goTo} />
        <div className="p-3">
          <button
            onClick={() => setCollapsed((c) => !c)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="w-full h-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {collapsed ? (
              <ChevronsRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronsLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
        <SidebarUser collapsed={collapsed} />
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative w-72 max-w-[85vw] flex flex-col bg-card border-r border-border shadow-2xl">
            <div className="h-16 flex items-center justify-between border-b border-border px-4">
              <EventSparkLogo />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
            <SidebarNav currentPath={currentPath} collapsed={false} onNavigate={goTo} />
            <SidebarUser collapsed={false} />
          </aside>
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="lg:hidden w-10 h-10 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>
          <h1
            className="font-display font-semibold text-lg text-foreground tracking-[-0.01em] truncate"
            style={{ fontWeight: 700 }}
          >
            {title}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>

        <footer className="px-6 py-4 text-xs text-muted-foreground border-t border-border/60 hidden sm:block">
          © 2026 eventspark — local demo clone. Data stays in your browser.
        </footer>
      </div>
    </div>
  );
}
