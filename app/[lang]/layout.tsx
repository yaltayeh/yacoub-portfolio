import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import "../styles/site.css";
import { dirOf, isLocale, locales } from "@/lib/i18n";
import { fontsHref } from "@/lib/fonts";
import { getDictionary } from "@/i18n";

type Props = Readonly<{ children: React.ReactNode; params: Promise<{ lang: string }> }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: Pick<Props, "params">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang);
  return {
    title: t.meta.homeTitle,
    description: t.meta.description,
  };
}

export const viewport: Viewport = {
  themeColor: "#0c0627",
  colorScheme: "dark",
};

// Root layout of the public site: sets lang/dir per locale so the whole page mirrors in Arabic.
export default async function LocaleLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} dir={dirOf(lang)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={fontsHref} />
      </head>
      <body>{children}</body>
    </html>
  );
}
