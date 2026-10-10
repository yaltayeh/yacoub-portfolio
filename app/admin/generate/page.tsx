import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { getCardRange, MAX_BATCH, nextCardNumber, parseRange } from "@/lib/admin-data";
import { cardNumber } from "@/lib/format";
import { qrLinkUrl } from "@/lib/site";
import { qrSvg } from "@/lib/qr";
import { AdminShell } from "../_components/AdminShell";
import { CreateTabs } from "../_components/CreateTabs";
import { GenerateForm } from "../_components/GenerateForm";
import { CheckIcon, Download } from "../_components/admin-icons";

export const metadata: Metadata = { title: "Generate batch" };
export const dynamic = "force-dynamic";

const PREVIEW_TILES = 23;

export default async function GeneratePage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; created?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const next = await nextCardNumber();
  const range = parseRange(params.from, params.to);
  const cards = range ? await getCardRange(range.from, range.to) : [];
  const shown = cards.slice(0, PREVIEW_TILES);
  const rangeLabel = range ? (range.from === range.to ? cardNumber(range.from) : `${cardNumber(range.from)} – ${cardNumber(range.to)}`) : "";
  const query = range ? `from=${range.from}&to=${range.to}` : "";

  return (
    <AdminShell section="create">
      <main className="page">
        <header className="page__head page__head--wrap">
          <div className="page__title">
            <h1>Create</h1>
          </div>
          <CreateTabs current="batch" />
        </header>
        <p className="page__intro">
          Numbered, printed links for business cards.{" "}
          {next > 1 ? (
            <>
              Numbers continue from <span className="mono">{cardNumber(next - 1)}</span>,
            </>
          ) : (
            <>Numbers start at <span className="mono">#001</span>,</>
          )}{" "}
          and every link also gets its own code. Nothing is created until you press Generate.
        </p>

        <GenerateForm next={next} max={MAX_BATCH} />

        {range ? (
          <section aria-labelledby="preview-title" className="batch-preview">
            <div className="batch-preview__head">
              <div className="batch-preview__title">
                <h2 id="preview-title">{params.created === "1" ? "Created" : "Printed links"}</h2>
                <span className="mono dim">
                  {rangeLabel} · {cards.length} printed {cards.length === 1 ? "link" : "links"}
                </span>
                {params.created === "1" ? (
                  <span className="save-status" role="status">
                    <CheckIcon />
                    Saved
                  </span>
                ) : null}
              </div>
              {cards.length > 0 ? (
                <div className="batch-preview__actions">
                  <a href={`/admin/generate/print?${query}`} className="abtn abtn--ghost abtn--sm" target="_blank" rel="noopener">
                    <PrinterIcon />
                    Print sheet (A4)
                  </a>
                  <a href={`/admin/generate/zip?${query}`} className="abtn abtn--ghost abtn--sm" download>
                    <Download size={16} />
                    Download ZIP (SVG)
                  </a>
                </div>
              ) : null}
            </div>
            {cards.length === 0 ? (
              <p className="panel panel__empty">No printed links in {rangeLabel}.</p>
            ) : (
              <ul className="qr-grid">
                {shown.map((card) => (
                  <li key={card.id} className="qr-tile">
                    <span
                      className="qr-tile__code"
                      role="img"
                      aria-label={`QR code ${cardNumber(card.number)}`}
                      dangerouslySetInnerHTML={{ __html: qrSvg(qrLinkUrl(card.code), { margin: 1 }) }}
                    />
                    <span className="qr-tile__num mono">{cardNumber(card.number)}</span>
                    <span className="qr-tile__id mono">{card.code}</span>
                  </li>
                ))}
                {cards.length > shown.length ? (
                  <li className="qr-tile qr-tile--more">
                    <span className="mono">+{cards.length - shown.length}</span>
                    <span>more in the export</span>
                  </li>
                ) : null}
              </ul>
            )}
          </section>
        ) : null}

        {next > 1 ? (
          <form action="/admin/generate" className="panel reprint" aria-label="Print or export an existing range">
            <span className="reprint__title">Reprint or export a range</span>
            <label>
              <span>From #</span>
              <input name="from" type="number" inputMode="numeric" min={1} max={next - 1} defaultValue={range?.from ?? 1} className="input" />
            </label>
            <label>
              <span>to #</span>
              <input name="to" type="number" inputMode="numeric" min={1} max={next - 1} defaultValue={range?.to ?? next - 1} className="input" />
            </label>
            <button type="submit" className="abtn abtn--ghost abtn--sm">
              Show
            </button>
          </form>
        ) : null}
      </main>
    </AdminShell>
  );
}

function PrinterIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9V3h12v6" />
      <rect x="3" y="9" width="18" height="8" rx="2" />
      <path d="M7 14h10v7H7z" />
    </svg>
  );
}
