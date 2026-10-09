import type { Metadata, Viewport } from "next";
import "./globals.css";

// Phase 2 moves lang/dir into app/[lang]/layout.tsx; this root stays minimal.
const fontsHref =
  "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap";

export const metadata: Metadata = {
  title: "Yacoub Altaieh",
  description: "I study post-quantum cryptography and build a hardware password manager.",
};

export const viewport: Viewport = {
  themeColor: "#0c0627",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
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
