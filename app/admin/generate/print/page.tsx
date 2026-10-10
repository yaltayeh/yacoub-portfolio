import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { getCardRange, parseRange } from "@/lib/admin-data";
import { cardNumber } from "@/lib/format";
import { qrLinkUrl } from "@/lib/site";
import { qrSvg } from "@/lib/qr";
import { profile } from "@/content/profile";
import { PrintButton } from "../../_components/PrintButton";

export const metadata: Metadata = { title: "Print sheet" };
export const dynamic = "force-dynamic";

// 4 × 6 cards per A4 sheet, cut along the dashed lines.
const PER_SHEET = 24;

export default async function PrintPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  await requireAdmin();
  const { from, to } = await searchParams;
  const range = parseRange(from, to);
  if (!range) notFound();
  const cards = await getCardRange(range.from, range.to);
  if (cards.length === 0) notFound();

  const sheets: (typeof cards)[] = [];
  for (let i = 0; i < cards.length; i += PER_SHEET) sheets.push(cards.slice(i, i + PER_SHEET));
  const label = (list: typeof cards) =>
    `${cardNumber(list[0]?.number)} – ${cardNumber(list.at(-1)?.number)}`;

  return (
    <div className="print-view">
      <div className="print-toolbar">
        <span>
          {cards.length} printed links · {label(cards)} · {sheets.length} A4 {sheets.length === 1 ? "sheet" : "sheets"}
        </span>
        <span className="print-toolbar__hint">In the print dialog: A4, margins “None”, scale 100%.</span>
        <PrintButton />
      </div>
      {sheets.map((sheet, i) => (
        <section key={i} className="sheet-a4" aria-label={`Sheet ${i + 1}`}>
          <header className="sheet-a4__head">
            <span>
              <strong>{profile.name.en}</strong> · Printed links <span className="mono">{label(sheet)}</span>
            </span>
            <span className="mono">
              Sheet {i + 1} of {sheets.length} · cut along dashed lines
            </span>
          </header>
          <ul className="sheet-a4__grid">
            {sheet.map((card) => (
              <li key={card.id} className="sheet-a4__cell">
                <span
                  className="sheet-a4__qr"
                  role="img"
                  aria-label={`QR code ${cardNumber(card.number)}`}
                  dangerouslySetInnerHTML={{ __html: qrSvg(qrLinkUrl(card.code), { margin: 0, dark: "#000000" }) }}
                />
                <span className="sheet-a4__num mono">{cardNumber(card.number)}</span>
                <span className="sheet-a4__code mono">{card.code}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
