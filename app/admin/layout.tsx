import type { Metadata, Viewport } from "next";
import "../globals.css";
import "./admin.css";
import { siteIcons } from "@/lib/metadata";
import { fontPreloads } from "@/lib/fonts";


// Root layout of the private admin: English only, never indexed.
export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
  icons: siteIcons,
};

export const viewport: Viewport = {
  themeColor: "#0c0627",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" dir="ltr">
      <head>
        {fontPreloads.admin.map((href) => (
          <link key={href} rel="preload" href={href} as="font" type="font/woff2" crossOrigin="anonymous" />
        ))}
      </head>
      <body className="admin">{children}</body>
    </html>
  );
}
