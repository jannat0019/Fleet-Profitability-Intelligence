
import type { Metadata } from "next";
// @ts-expect-error Next.js handles global CSS imports at runtime.
import "./globals.css";

export const metadata: Metadata = {
  title: "Fleet Profitability | Fleetwise",
  description:
    "A demo dashboard for understanding vehicle-level fleet profitability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
