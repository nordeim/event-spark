"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Eye, Ticket, TrendingUp, Users } from "lucide-react";
import { useSparkStore } from "@/lib/spa/store";
import type { Registration } from "@/lib/spa/types";

const SOURCE_COLORS = [
  "hsl(340 75% 58%)",
  "hsl(172 50% 40%)",
  "hsl(38 80% 55%)",
  "hsl(250 40% 60%)",
];

function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-[0.14em]">
          {label}
        </span>
        <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center">
          <Icon className="w-4 h-4" aria-hidden="true" />
        </span>
      </div>
      <p
        className="font-display text-3xl font-bold leading-none text-foreground"
        style={{ fontWeight: 700 }}
      >
        {value}
      </p>
      <p className="text-xs text-[hsl(172_50%_40%)] font-semibold mt-1.5">{delta}</p>
    </div>
  );
}

export function AnalyticsView() {
  const metrics = useSparkStore((s) => s.metrics);
  const registrations = useSparkStore((s) => s.registrations);
  const events = useSparkStore((s) => s.events);

  const chartData = useMemo(
    () =>
      metrics.map((m) => ({
        date: new Date(m.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        views: m.views,
        registrations: m.registrations,
      })),
    [metrics]
  );

  const confirmed = useMemo(
    () => registrations.filter((r) => r.status === "confirmed"),
    [registrations]
  );

  const sourceData = useMemo(() => {
    const sources: Registration["source"][] = ["direct", "social", "search", "referral"];
    return sources.map((source, i) => ({
      name: source.charAt(0).toUpperCase() + source.slice(1),
      value: confirmed.filter((r) => r.source === source).length,
      color: SOURCE_COLORS[i],
    }));
  }, [confirmed]);

  const eventData = useMemo(
    () =>
      events.map((e) => ({
        name: e.name.length > 16 ? `${e.name.slice(0, 15)}…` : e.name,
        attendees: registrations.filter(
          (r) => r.eventId === e.id && r.status === "confirmed"
        ).length,
      })),
    [events, registrations]
  );

  const totalViews = metrics.reduce((s, m) => s + m.views, 0);
  const last7 = metrics.slice(-7);
  const prev7 = metrics.slice(-14, -7);
  const sum = (arr: typeof metrics) => arr.reduce((s, m) => s + m.registrations, 0);
  const weekDelta =
    prev7.length > 0
      ? Math.round(((sum(last7) - sum(prev7)) / Math.max(1, sum(prev7))) * 100)
      : 0;
  const conversion = totalViews > 0
    ? ((confirmed.length / totalViews) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h2
          className="font-display text-2xl sm:text-3xl font-bold text-foreground tracking-[-0.02em]"
          style={{ fontWeight: 700 }}
        >
          Analytics
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Where attendees come from, drop off, and convert.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard
          label="Page views"
          value={totalViews.toLocaleString()}
          delta="Last 30 days"
          icon={Eye}
        />
        <KpiCard
          label="Registrations"
          value={confirmed.length.toLocaleString()}
          delta={`${weekDelta >= 0 ? "+" : ""}${weekDelta}% vs last week`}
          icon={Ticket}
        />
        <KpiCard
          label="Attendees"
          value={String(confirmed.reduce((s, r) => s + r.quantity, 0))}
          delta="Including multi-ticket orders"
          icon={Users}
        />
        <KpiCard
          label="Conversion"
          value={`${conversion}%`}
          delta="Views to registrations"
          icon={TrendingUp}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-border bg-card p-5 sm:p-6"
      >
        <h3 className="font-display font-semibold text-foreground mb-1" style={{ fontWeight: 700 }}>
          Traffic and conversions
        </h3>
        <p className="text-xs text-muted-foreground mb-5">
          Daily page views vs registrations over the last 30 days.
        </p>
        <div className="h-72" role="img" aria-label="Area chart of views and registrations by day">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(340 75% 58%)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="hsl(340 75% 58%)" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(172 50% 40%)" stopOpacity={0.32} />
                  <stop offset="100%" stopColor="hsl(172 50% 40%)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "hsl(240 5% 46%)" }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "hsl(240 5% 46%)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(0 0% 91%)",
                  fontSize: 12,
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area
                type="monotone"
                dataKey="views"
                name="Views"
                stroke="hsl(340 75% 58%)"
                strokeWidth={2}
                fill="url(#viewsGradient)"
              />
              <Area
                type="monotone"
                dataKey="registrations"
                name="Registrations"
                stroke="hsl(172 50% 40%)"
                strokeWidth={2}
                fill="url(#regGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-1" style={{ fontWeight: 700 }}>
            Registrations by source
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Where confirmed registrations originated.
          </p>
          <div className="h-64" role="img" aria-label="Donut chart of registrations by source">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sourceData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={58}
                  outerRadius={90}
                  paddingAngle={3}
                  strokeWidth={0}
                >
                  {sourceData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(0 0% 91%)",
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h3 className="font-display font-semibold text-foreground mb-1" style={{ fontWeight: 700 }}>
            Attendees by event
          </h3>
          <p className="text-xs text-muted-foreground mb-5">
            Confirmed registrations per event.
          </p>
          <div className="h-64" role="img" aria-label="Bar chart of attendees by event">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventData} margin={{ top: 4, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 91%)" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fill: "hsl(240 5% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  interval={0}
                  angle={-12}
                  dy={8}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "hsl(240 5% 46%)" }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "hsl(240 10% 96%)" }}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid hsl(0 0% 91%)",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="attendees" name="Attendees" fill="hsl(340 75% 58%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
