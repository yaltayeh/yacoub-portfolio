import type { Metadata, Viewport } from "next";
import "../globals.css";
import { fontsHref } from "@/lib/fonts";

// Root layout for the temporary dev pages (/health, /design-tokens). Removed in Phase 6.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0c0627",
  colorScheme: "dark",
};

export default function DevLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
