import type { Locale } from "@/lib/i18n";
import type { Dictionary } from "@/i18n";
import { profile } from "@/content/profile";
import { RichText } from "./RichText";

export function SiteFooter({ locale, t }: { locale: Locale; t: Dictionary }) {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <span>
          {profile.name[locale]} · <RichText text={t.footer.location} locale={locale} />
        </span>
        <time dateTime={String(new Date().getFullYear())}>{new Date().getFullYear()}</time>
      </div>
    </footer>
  );
}
