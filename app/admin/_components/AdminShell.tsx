import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/icons";
import { SITE_HOST } from "@/lib/site";
import { Grid, LinkIcon, PlusSquare } from "./admin-icons";
import { SignOutButton } from "./SignOutButton";

export type AdminSection = "overview" | "links" | "create";

const items: { key: AdminSection; href: string; label: string; icon: ReactNode }[] = [
  { key: "overview", href: "/admin", label: "Overview", icon: <Grid size={22} /> },
  { key: "links", href: "/admin/links", label: "Links", icon: <LinkIcon size={22} /> },
  { key: "create", href: "/admin/new", label: "Create", icon: <PlusSquare size={22} /> },
];

/** Sidebar on desktop, bottom tab bar on mobile. */
export function AdminShell({ section, linkCount, children }: { section: AdminSection; linkCount?: number; children: ReactNode }) {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="sidebar__brand">
          <LogoMark size={24} />
          <span className="sidebar__brand-text">
            <span>Admin</span>
            <span className="sidebar__host">{SITE_HOST}</span>
          </span>
        </div>
        <nav aria-label="Admin" className="sidebar__nav">
          {items.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              aria-current={item.key === section ? "page" : undefined}
              className="sidebar__link"
            >
              {item.icon}
              {item.label}
              {item.key === "links" && linkCount != null ? <span className="sidebar__count">{linkCount}</span> : null}
            </Link>
          ))}
        </nav>
        <SignOutButton className="sidebar__link sidebar__signout" />
      </aside>

      <div className="shell__main">{children}</div>

      <nav aria-label="Admin" className="tabbar">
        {items.map((item) => (
          <Link key={item.key} href={item.href} aria-current={item.key === section ? "page" : undefined} className="tabbar__link">
            {item.icon}
            {item.label}
          </Link>
        ))}
        <SignOutButton className="tabbar__link" />
      </nav>
    </div>
  );
}
