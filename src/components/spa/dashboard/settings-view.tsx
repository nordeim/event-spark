"use client";

import { useState } from "react";
import { Database, Save } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { selectCurrentUser, useSparkStore } from "@/lib/spa/store";
import { isValidEmail } from "@/lib/spa/utils";

export function SettingsView() {
  const user = useSparkStore(selectCurrentUser);
  const updateProfile = useSparkStore((s) => s.updateProfile);
  const resetDemoData = useSparkStore((s) => s.resetDemoData);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState<string | null>(null);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Name is too short.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    updateProfile(name, email);
    toast.success("Profile updated");
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h2
          className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em]"
          style={{ fontWeight: 700 }}
        >
          Settings
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your profile and demo workspace controls.
        </p>
      </div>

      <form onSubmit={save} className="rounded-2xl border border-border bg-card p-6 space-y-5">
        <h3 className="font-display font-semibold text-foreground" style={{ fontWeight: 700 }}>
          Profile
        </h3>
        <div className="space-y-1.5">
          <Label htmlFor="st-name">Full name</Label>
          <Input
            id="st-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="st-email">Email</Label>
          <Input
            id="st-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary">
          <Save className="w-4 h-4" aria-hidden="true" />
          Save profile
        </Button>
      </form>

      <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
        <h3 className="font-display font-semibold text-foreground" style={{ fontWeight: 700 }}>
          Demo data
        </h3>
        <p className="text-sm text-muted-foreground">
          Reset events, registrations, analytics, and integrations to the seeded
          demo state. Your account stays intact.
        </p>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <Database className="w-4 h-4" aria-hidden="true" />
              Reset demo data
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset demo data?</AlertDialogTitle>
              <AlertDialogDescription>
                Every event, registration, and metric you created will be replaced
                with the original demo content. This cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => {
                resetDemoData();
                toast.success("Demo data restored");
              }}>
                Reset
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-2xl border border-border/70 bg-muted/40 p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">
          About this clone
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          This is a self-contained rebuild of the Event Spark template. There is no
          backend: accounts, events, and registrations live in your browser&apos;s
          localStorage via a persisted Zustand store. Passwords are SHA-256 hashed
          with the Web Crypto API before storage — sufficient for a local demo, not
          a production auth system.
        </p>
      </div>
    </div>
  );
}
