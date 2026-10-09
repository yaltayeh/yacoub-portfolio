import type { ReactNode } from "react";
import type { Dictionary } from "@/i18n";
import { contactLinks } from "@/content/profile";
import { AddContact, Briefcase, Chat, Code, Mail } from "./icons";

type Props = {
  t: Dictionary;
  eyebrow: string;
  title: string;
};

/** The "stay in touch" block that closes every public page. */
export function ContactBlock({ t, eyebrow, title }: Props) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="contact">
      <div className="contact__inner">
        <div className="contact__head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id="contact-title" className="contact__title">
            {title}
          </h2>
        </div>
        <div className="contact__actions">
          <a href="/contact.vcf" className="btn btn--primary btn--lg">
            <AddContact size={20} />
            {t.contact.saveContact}
          </a>
          <div className="contact__grid">
            <ContactLink href={contactLinks.email} icon={<Mail />} label={t.contact.email} />
            <ContactLink href={contactLinks.whatsapp} icon={<Chat />} label={t.contact.whatsapp} external />
            <ContactLink href={contactLinks.linkedin} icon={<Briefcase />} label={t.contact.linkedin} external />
            <ContactLink href={contactLinks.github} icon={<Code />} label={t.contact.github} external />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLink({
  href,
  icon,
  label,
  external,
}: {
  href: string | undefined;
  icon: ReactNode;
  label: string;
  external?: boolean;
}) {
  // Until the owner fills in profile.ts, the button stays visible but inert.
  return (
    <a
      href={href}
      aria-disabled={href ? undefined : "true"}
      className="btn btn--ghost btn--contact"
      {...(external && href ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {icon}
      {label}
    </a>
  );
}
