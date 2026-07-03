import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import Header from "../components/Header";
import ServiceWorkerRegistration from "../components/ServiceWorkerRegistration";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gamified Money Habit Builder",
  description:
    "Build better financial habits with daily quests, streaks, XP, and real-time level progression.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://finlevels.app"),
  manifest: "/manifest.json",
  icons: {
    icon: "/icon-512.svg",
    apple: "/icon-512.svg",
  },
  keywords: [
    "finlevels",
    "money habits",
    "financial habits",
    "gamified finance",
    "money archetype",
    "finance quiz",
    "stability coin",
    "saving coin",
    "investing coin",
    "habit builder",
    "streak tracker",
    "rpg money"
  ],
  authors: [{ name: "Finlevels Team", url: "https://finlevels.app" }],
  creator: "Finlevels",
  publisher: "Finlevels",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Gamified Money Habit Builder",
    description:
      "Build better financial habits with daily quests, streaks, XP, and real-time level progression.",
    url: "/",
    siteName: "Finlevels",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/challenge-preview.png",
        width: 1200,
        height: 630,
        alt: "Gamified Money Habit Builder App Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Gamified Money Habit Builder",
    description:
      "Build better financial habits with daily quests, streaks, XP, and real-time level progression.",
    images: ["/challenge-preview.png"],
  },
  other: {
    google: "notranslate",
    "geo.region": "US-NY",
    "geo.placename": "New York",
    "geo.position": "40.7128;-74.0060",
    "ICBM": "40.7128, -74.0060",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      translate="no"
      className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased notranslate`}
    >
      <body className="min-h-full flex flex-col">
        <ServiceWorkerRegistration />
        <Header />
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
