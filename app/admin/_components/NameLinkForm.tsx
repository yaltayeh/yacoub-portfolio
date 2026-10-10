"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { cardNumber } from "@/lib/format";
import { ArrowRight } from "./admin-icons";

type Card = { id: number; number: number; code: string; name: string | null };

/**
 * "Name a link": type the number printed on the card you just handed out,
 * see which link it is, open it with the name field focused. Target: under
 * 10 seconds from unlocking the phone. The card list comes with the page, so
 * the preview needs no round trip.
 */
export function NameLinkForm({ cards, nextUnnamed }: { cards: Card[]; nextUnnamed: number | null }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [notFound, setNotFound] = useState<number | null>(null);
  const number = /^\d{1,6}$/.test(value) ? Number(value) : null;
  const match = useMemo(() => (number == null ? null : cards.find((c) => c.number === number) ?? null), [cards, number]);
  const first = cards[0]?.number;
  const last = cards.at(-1)?.number;

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (number == null) return;
    if (!match) {
      setNotFound(number);
      return;
    }
    router.push(`/admin/links?link=${match.code}&focus=name&from=overview`, { scroll: false });
  }

  return (
    <section aria-labelledby="name-link-title" className="name-link">
      <div className="name-link__head">
        <h2 id="name-link-title">Name a link</h2>
        <p className="name-link__hint only-desktop">Type the number printed on the business card you just gave out.</p>
        {nextUnnamed != null ? (
          <span className="name-link__next only-mobile">
            Next unnamed <span className="mono">{cardNumber(nextUnnamed)}</span>
          </span>
        ) : null}
      </div>
      <form className="name-link__form" onSubmit={onSubmit}>
        <label htmlFor="link-num" className="visually-hidden">
          Printed link number
        </label>
        <div className="number-input">
          <span aria-hidden="true">#</span>
          <input
            id="link-num"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            placeholder={nextUnnamed != null ? String(nextUnnamed).padStart(3, "0") : "Card number"}
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/[^\d]/g, "").slice(0, 6));
              setNotFound(null);
            }}
            aria-describedby="link-num-status"
          />
        </div>
        <button type="submit" className="abtn abtn--primary name-link__open" disabled={number == null}>
          Open
          <ArrowRight />
        </button>
        {nextUnnamed != null ? (
          <span className="name-link__next only-desktop">
            Next unnamed <span className="mono">{cardNumber(nextUnnamed)}</span>
          </span>
        ) : null}
      </form>
      <p id="link-num-status" className="name-link__status" aria-live="polite">
        {notFound != null ? (
          <span className="name-link__missing">
            There&apos;s no printed link <span className="mono">{cardNumber(notFound)}</span>.
            {first != null && last != null ? (
              <>
                {" "}
                Your printed links run from <span className="mono">{cardNumber(first)}</span> to{" "}
                <span className="mono">{cardNumber(last)}</span>.
              </>
            ) : (
              " You haven't generated any printed links yet."
            )}{" "}
            Check the number printed on the card, or <Link href="/admin/generate">generate more printed links</Link>.
          </span>
        ) : match ? (
          <span className="name-link__match">
            <span className="mono">{cardNumber(match.number)}</span> ·{" "}
            {match.name ? <strong>{match.name}</strong> : <em>Unnamed</em>} · <span className="mono">{match.code}</span>
          </span>
        ) : (
          <span className="only-mobile">The number printed on the business card. Opens the link with the name field ready.</span>
        )}
      </p>
    </section>
  );
}
