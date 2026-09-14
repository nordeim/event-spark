import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dmsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Event Spark - Your event platform template",
  description:
    "Build your own event platform in minutes. Create branded registration pages, track attendees, and grow your community. No code required.",
  keywords: [
    "events",
    "event platform",
    "registration",
    "tickets",
    "attendees",
    "eventspark",
  ],
  authors: [{ name: "Event Spark" }],
  openGraph: {
    title: "Event Spark - Your event platform template",
    description: "Build your own event platform in minutes",
    siteName: "Event Spark",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Event Spark - Your event platform template",
    description: "Build your own event platform in minutes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bricolageGrotesque.variable} ${dmSans.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
