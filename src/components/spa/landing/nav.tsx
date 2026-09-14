"use client";

import { EventSparkLogo } from "@/components/spa/logo";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/spa/router";

export function LandingNav() {
  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur-md"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-[72px] px-6 lg:px-8">
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
          }}
          aria-label="eventspark home"
        >
          <EventSparkLogo />
        </a>
        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <a
              href="#/auth"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth");
              }}
            >
              Log in
            </a>
          </Button>
          <Button
            className="hidden sm:inline-flex font-semibold"
            asChild
          >
            <a
              href="#/auth?mode=signup"
              onClick={(e) => {
                e.preventDefault();
                navigate("/auth?mode=signup");
              }}
            >
              Sign up
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
