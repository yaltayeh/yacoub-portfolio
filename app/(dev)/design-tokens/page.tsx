// TEMPORARY (Phase 1): renders every design token for a visual check against
// the Calm Quantum design system. Remove in Phase 6.
import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design tokens",
  robots: { index: false, follow: false },
};

const colorGroups: { title: string; names: string[] }[] = [
  { title: "Grounds", names: ["space", "surface", "surface-sidebar", "surface-raised", "surface-glow", "surface-disc", "surface-dialog"] },
  { title: "Ink", names: ["ink", "ink-soft", "ink-muted", "ink-dim", "ink-faint"] },
  { title: "Accent", names: ["accent", "accent-soft", "accent-deep", "on-accent", "accent-08", "accent-14", "accent-24", "accent-35", "accent-45"] },
  { title: "Lines", names: ["line-hair", "line-soft", "line", "line-strong", "line-control", "line-neutral", "line-dialog", "line-dashed", "line-dashed-faint"] },
  { title: "Status and nebula", names: ["danger", "nebula-core", "nebula-mid", "nebula-dust", "scrim"] },
];

const typeStyles: { name: string; sample: string; tracking?: string; mono?: boolean; upper?: boolean }[] = [
  { name: "hero-desktop", sample: "Yacoub Altaieh", tracking: "hero-desktop" },
  { name: "hero", sample: "Yacoub Altaieh", tracking: "hero" },
  { name: "stat", sample: "4×", tracking: "stat" },
  { name: "h2", sample: "Building it, not just reading about it.", tracking: "h2" },
  { name: "h3", sample: "Hardware Password Manager" },
  { name: "lead", sample: "42 Amman student building cryptography from scratch." },
  { name: "body", sample: "Implementing hash functions and ciphers from scratch in C." },
  { name: "ui", sample: "Roadmap" },
  { name: "label", sample: "Links in use" },
  { name: "eyebrow", sample: "01 / The journey", tracking: "eyebrow", upper: true },
  { name: "status", sample: "In progress", tracking: "status", upper: true },
  { name: "tag", sample: "SHA-256" },
  { name: "code", sample: '$ ./ft_ssl sha256 -s "42 Amman"' },
];

const spacing = [4, 6, 8, 10, 12, 16, 20, 24, 32, 40, 52, 64];
const radii = ["tag", "code", "icon", "control", "card", "panel", "dialog", "sheet", "pill"];
const glows = ["glow-node", "glow-first", "glow-photo", "nav-active", "focus-field"];

export default function DesignTokensPage() {
  return (
    <main style={{ maxWidth: 1120, margin: "0 auto", padding: "var(--space-52) var(--space-20)" }}>
      <p style={eyebrow}>Temporary · Phase 1</p>
      <h1 style={{ font: "var(--text-h2)", letterSpacing: "var(--tracking-h2)", margin: "var(--space-8) 0 var(--space-40)" }}>
        Calm Quantum tokens
      </h1>

      {colorGroups.map((group) => (
        <Section key={group.title} title={group.title}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "var(--space-12)" }}>
            {group.names.map((name) => (
              <figure key={name} style={{ margin: 0 }}>
                <div
                  style={{
                    height: 64,
                    borderRadius: "var(--radius-control)",
                    background: `var(--${name})`,
                    border: "1px solid var(--line-soft)",
                  }}
                />
                <figcaption style={{ font: "var(--text-tag)", color: "var(--ink-muted)", marginTop: "var(--space-6)" }}>
                  {name}
                </figcaption>
              </figure>
            ))}
          </div>
        </Section>
      ))}

      <Section title="Type">
        <div style={{ display: "grid", gap: "var(--space-20)" }}>
          {typeStyles.map((t) => (
            <div key={t.name}>
              <p style={{ ...eyebrow, marginBottom: "var(--space-4)" }}>{t.name}</p>
              <p
                style={{
                  margin: 0,
                  font: `var(--text-${t.name})`,
                  letterSpacing: t.tracking ? `var(--tracking-${t.tracking})` : undefined,
                  textTransform: t.upper ? "uppercase" : undefined,
                  overflowWrap: "anywhere",
                }}
              >
                {t.sample}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Arabic (RTL)">
        <div dir="rtl" lang="ar" style={{ display: "grid", gap: "var(--space-16)" }}>
          <p style={{ margin: 0, font: "var(--text-ar-h2)" }}>أبنيه بيدي، لا أكتفي بالقراءة عنه.</p>
          <p style={{ margin: 0, font: "var(--text-ar-body)", color: "var(--ink-muted)" }}>
            أدرس التشفير ما بعد الكمّي، وأصنع <span dir="ltr">Hardware Password Manager</span> على{" "}
            <span dir="ltr">ESP32</span>.
          </p>
        </div>
      </Section>

      <Section title="Spacing">
        <div style={{ display: "grid", gap: "var(--space-8)" }}>
          {spacing.map((n) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: "var(--space-12)" }}>
              <span style={{ font: "var(--text-tag)", color: "var(--ink-muted)", minInlineSize: 80 }}>space-{n}</span>
              <span style={{ blockSize: 12, inlineSize: `var(--space-${n})`, background: "var(--accent)", borderRadius: 2 }} />
            </div>
          ))}
        </div>
      </Section>

      <Section title="Radii">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-16)" }}>
          {radii.map((r) => (
            <figure key={r} style={{ margin: 0 }}>
              <div style={{ inlineSize: 88, blockSize: 56, borderRadius: `var(--radius-${r})`, background: "var(--surface)", border: "1px solid var(--line-control)" }} />
              <figcaption style={{ font: "var(--text-tag)", color: "var(--ink-muted)", marginTop: "var(--space-6)" }}>radius-{r}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section title="Glow">
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-40)", padding: "var(--space-16)" }}>
          {glows.map((g) => (
            <figure key={g} style={{ margin: 0 }}>
              <div style={{ inlineSize: 72, blockSize: 72, borderRadius: g === "nav-active" || g === "focus-field" ? "var(--radius-control)" : "50%", background: g === "glow-first" ? "var(--accent)" : "var(--surface-disc)", boxShadow: `var(--${g})` }} />
              <figcaption style={{ font: "var(--text-tag)", color: "var(--ink-muted)", marginTop: "var(--space-16)" }}>{g}</figcaption>
            </figure>
          ))}
        </div>
      </Section>
    </main>
  );
}

const eyebrow: CSSProperties = {
  margin: 0,
  font: "var(--text-eyebrow)",
  letterSpacing: "var(--tracking-eyebrow)",
  textTransform: "uppercase",
  color: "var(--ink-faint)",
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section style={{ paddingBlock: "var(--space-32)", borderBlockStart: "1px solid var(--line-soft)" }}>
      <h2 style={{ font: "var(--text-h3)", margin: "0 0 var(--space-20)" }}>{title}</h2>
      {children}
    </section>
  );
}
