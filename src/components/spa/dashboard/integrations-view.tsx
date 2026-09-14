"use client";

import { motion } from "framer-motion";
import { Check, Plug2 } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { useSparkStore } from "@/lib/spa/store";
import type { IntegrationId } from "@/lib/spa/types";

interface IntegrationMeta {
  id: IntegrationId;
  name: string;
  category: string;
  description: string;
  logo: string;
}

const INTEGRATIONS: IntegrationMeta[] = [
  {
    id: "slack",
    name: "Slack",
    category: "Messaging",
    description: "Post registrations and check-ins to a channel.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/slack-icon.svg",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Video",
    description: "Auto-create meetings for online events.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/zoom-icon.svg",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    description: "Sync attendees into your contacts pipeline.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/hubspot.svg",
  },
  {
    id: "mailchimp",
    name: "Mailchimp",
    category: "Email",
    description: "Add attendees to lists and campaigns.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/mailchimp-freddie.svg",
  },
  {
    id: "google-calendar",
    name: "Google Calendar",
    category: "Calendar",
    description: "One-click add-to-calendar for attendees.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/google-calendar.svg",
  },
  {
    id: "stripe",
    name: "Stripe",
    category: "Payments",
    description: "Collect payments for paid tickets.",
    logo: "https://cdn.jsdelivr.net/gh/gilbarbara/logos@main/logos/stripe.svg",
  },
];

export function IntegrationsView() {
  const integrations = useSparkStore((s) => s.integrations);
  const toggleIntegration = useSparkStore((s) => s.toggleIntegration);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2
          className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em]"
          style={{ fontWeight: 700 }}
        >
          Integrations
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Connect Zoom, HubSpot, Mailchimp, and 20+ tools in a few clicks.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {INTEGRATIONS.map((meta, i) => {
          const state = integrations.find((s) => s.id === meta.id);
          const connected = state?.connected ?? false;
          return (
            <motion.div
              key={meta.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className={`rounded-2xl border bg-card p-5 transition-colors ${
                connected ? "border-primary/40" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      connected ? "bg-primary/10" : "bg-muted"
                    }`}
                  >
                    <img
                      src={meta.logo}
                      alt={`${meta.name} logo`}
                      className="w-6 h-6 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{meta.name}</p>
                      {connected && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[hsl(172_50%_40%)] bg-[hsl(172_50%_40%)]/10 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3" aria-hidden="true" />
                          Live
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{meta.category}</p>
                  </div>
                </div>
                <Switch
                  checked={connected}
                  onCheckedChange={(value) => {
                    toggleIntegration(meta.id);
                    toast.success(
                      value
                        ? `${meta.name} connected (demo)`
                        : `${meta.name} disconnected`
                    );
                  }}
                  aria-label={`Toggle ${meta.name} integration`}
                />
              </div>
              <p className="text-sm text-muted-foreground mt-4">{meta.description}</p>
              <p className="text-xs text-muted-foreground/70 mt-3">
                <Plug2 className="w-3 h-3 inline mr-1" aria-hidden="true" />
                Toggling simulates the OAuth handshake — no real accounts are touched.
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
