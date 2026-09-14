"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventSparkLogo } from "@/components/spa/logo";
import { navigate } from "@/lib/spa/router";
import { useSparkStore } from "@/lib/spa/store";
import { DEMO_ORGANIZER_EMAIL, DEMO_ORGANIZER_PASSWORD } from "@/lib/spa/seed";
import { isValidEmail } from "@/lib/spa/utils";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

export function AuthView({ initialMode }: { initialMode: "login" | "signup" }) {
  const signIn = useSparkStore((s) => s.signIn);
  const signUp = useSparkStore((s) => s.signUp);

  const [mode, setMode] = useState<"login" | "signup">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (mode === "signup" && name.trim().length < 2) {
      setError("Please tell us your name.");
      return;
    }

    setBusy(true);
    const result =
      mode === "signup"
        ? await signUp(name, email, password)
        : await signIn(email, password);
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    toast.success(
      mode === "signup" ? "Welcome to eventspark!" : "Welcome back!"
    );
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 sm:py-12 relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 -z-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="mx-auto h-[560px] w-[120%] -translate-x-[10%] bg-[radial-gradient(ellipse_at_50%_0%,hsl(340_75%_92%/_0.85)_0%,hsl(340_75%_96%/_0.4)_35%,transparent_70%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4 -ml-1 px-2 h-9 rounded-full hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="w-4 h-4" aria-hidden="true" />
          Back
        </button>

        <div className="text-center mb-6">
          <a
            href="#/"
            className="inline-block transition-transform duration-300 hover:scale-[1.03]"
            onClick={(e) => {
              e.preventDefault();
              navigate("/");
            }}
            aria-label="eventspark home"
          >
            <EventSparkLogo size="lg" />
          </a>
          <p className="text-muted-foreground mt-2 text-sm">
            Create events people actually want to attend
          </p>
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-lg p-6 sm:p-7">
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as "login" | "signup");
              setError(null);
            }}
          >
            <TabsList className="h-10 items-center justify-center text-muted-foreground grid w-full grid-cols-2 rounded-full bg-muted p-1 mb-6">
              <TabsTrigger value="login" className="rounded-full">
                Log in
              </TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full">
                Sign up
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="auth-name">Full name</Label>
                <Input
                  id="auth-name"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Ada Lovelace"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="auth-email">Email</Label>
              <Input
                id="auth-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="auth-password">Password</Label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        "Password reset is not wired up in this local demo."
                      )
                    }
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <Input
                id="auth-password"
                type="password"
                autoComplete={
                  mode === "signup" ? "new-password" : "current-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p
                className="text-sm text-destructive"
                role="alert"
                aria-live="polite"
              >
                {error}
              </p>
            )}

            <Button type="submit" className="w-full font-semibold" disabled={busy}>
              {busy ? "Please wait…" : mode === "signup" ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="relative my-5" aria-hidden="true">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <span className="relative flex justify-center text-xs uppercase bg-card px-2 text-muted-foreground tracking-wider">
              OR
            </span>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={() =>
              toast.info(
                "Google sign-in needs an OAuth provider — not available in this local demo."
              )
            }
          >
            <GoogleIcon />
            Continue with Google
          </Button>

          <div className="mt-5 rounded-xl bg-muted/70 border border-border/70 px-4 py-3 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">
              Demo account
            </span>{" "}
            — email{" "}
            <span className="font-mono text-[11px]">{DEMO_ORGANIZER_EMAIL}</span>{" "}
            / password{" "}
            <span className="font-mono text-[11px]">{DEMO_ORGANIZER_PASSWORD}</span>
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setEmail(DEMO_ORGANIZER_EMAIL);
                setPassword(DEMO_ORGANIZER_PASSWORD);
              }}
              className="ml-2 inline-flex items-center gap-1 text-primary font-semibold hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded"
            >
              <Mail className="w-3 h-3" aria-hidden="true" />
              Fill in
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
