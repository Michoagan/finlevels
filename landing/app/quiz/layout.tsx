import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Discover Your Money Archetype Quiz | Finlevels",
  description:
    "Take the 2-minute money archetype quiz to find your path: Stability, Saving, or Investing. Gamify your money habits today.",
  openGraph: {
    title: "Discover Your Money Archetype Quiz | Finlevels",
    description:
      "Take the 2-minute money archetype quiz to find your path: Stability, Saving, or Investing. Gamify your money habits today.",
    url: "/quiz",
  },
  twitter: {
    title: "Discover Your Money Archetype Quiz | Finlevels",
    description:
      "Take the 2-minute money archetype quiz to find your path: Stability, Saving, or Investing. Gamify your money habits today.",
  },
};

export default function QuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
