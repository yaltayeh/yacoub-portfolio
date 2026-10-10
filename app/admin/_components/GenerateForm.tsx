"use client";

import { useActionState, useState } from "react";
import { cardNumber } from "@/lib/format";
import { generateBatch, type BatchState } from "../actions";
import { Plus } from "./admin-icons";

const PRESETS = [10, 25, 50, 100];

/** How many links, the resulting number range, and the Generate button. */
export function GenerateForm({ next, max }: { next: number; max: number }) {
  const [state, action, pending] = useActionState<BatchState, FormData>(generateBatch, undefined);
  const [raw, setRaw] = useState("50");
  const count = Math.max(1, Math.min(max, Number.parseInt(raw, 10) || 1));
  const range = count === 1 ? cardNumber(next) : `${cardNumber(next)} – ${cardNumber(next + count - 1)}`;

  return (
    <form action={action} className="panel batch-form" aria-label="Batch settings">
      <div className="field batch-form__count">
        <label htmlFor="count">How many links?</label>
        <div className="batch-form__count-row">
          <input
            id="count"
            name="count"
            type="number"
            inputMode="numeric"
            min={1}
            max={max}
            required
            className="input batch-form__input"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onBlur={() => setRaw(String(count))}
            aria-describedby="count-range"
          />
          <div className="batch-form__presets">
            {PRESETS.map((n) => (
              <button key={n} type="button" className="preset" aria-pressed={count === n} onClick={() => setRaw(String(n))}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="batch-form__range" id="count-range" aria-live="polite">
        <span>Will create</span>
        <strong className="mono">{range}</strong>
      </div>
      {state?.error ? (
        <p role="alert" className="field__error">
          {state.error}
        </p>
      ) : null}
      <button type="submit" className="abtn abtn--primary batch-form__submit" disabled={pending}>
        <Plus size={17} />
        {pending ? "Generating…" : `Generate ${count} ${count === 1 ? "link" : "links"}`}
      </button>
    </form>
  );
}
