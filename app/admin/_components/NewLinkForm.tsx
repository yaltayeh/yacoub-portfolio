"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { createLink, type CreateState } from "../actions";

const uses = [
  { key: "cv", label: "CV", suggestion: "CV (PDF)" },
  { key: "linkedin", label: "LinkedIn", suggestion: "LinkedIn profile" },
  { key: "github", label: "GitHub", suggestion: "GitHub README" },
  { key: "company", label: "Company", suggestion: "Application — " },
  { key: "other", label: "Other", suggestion: "" },
] as const;

type UseKey = (typeof uses)[number]["key"];

/** A single digital link (CV, LinkedIn, GitHub, one company). Cards come from batches. */
export function NewLinkForm({ code, host }: { code: string; host: string }) {
  const [state, action, pending] = useActionState<CreateState, FormData>(createLink, undefined);
  const [use, setUse] = useState<UseKey | null>(null);
  const [name, setName] = useState("");

  return (
    <div className="new-link">
      <form action={action} className="panel new-link__form">
        <p className="new-link__intro">
          A single digital link for your CV, LinkedIn, GitHub or one company. For business cards, use a printed batch.
        </p>

        <fieldset className="field">
          <legend>Used for</legend>
          <div className="choice-row">
            {uses.map((u) => (
              <button
                key={u.key}
                type="button"
                aria-pressed={use === u.key}
                className="choice"
                onClick={() => {
                  setUse(u.key);
                  setName(u.suggestion);
                }}
              >
                {u.label}
              </button>
            ))}
          </div>
          <p className="field__help">Picking one fills in a suggested name. Edit it freely.</p>
        </fieldset>

        <div className="field">
          <label htmlFor="new-name">Name</label>
          <input
            id="new-name"
            name="name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            required
            autoComplete="off"
            placeholder="e.g. Application — Company X"
            aria-invalid={state?.error ? true : undefined}
            aria-describedby={state?.error ? "new-error" : undefined}
          />
        </div>
        <div className="field">
          <label htmlFor="new-notes" className="field__label-row">
            Notes <span className="optional">optional</span>
          </label>
          <textarea
            id="new-notes"
            name="notes"
            className="input input--area"
            rows={3}
            maxLength={500}
            placeholder="Sent with my application for the security internship."
          />
        </div>
        <input type="hidden" name="code" value={code} />

        {state?.error ? (
          <p id="new-error" role="alert" className="field__error">
            {state.error}
          </p>
        ) : null}

        <div className="new-link__actions">
          <button type="submit" className="abtn abtn--primary" disabled={pending}>
            {pending ? "Creating…" : "Create link"}
          </button>
          <Link href="/admin/links" className="abtn abtn--ghost only-desktop">
            Cancel
          </Link>
        </div>
      </form>

      <aside className="panel new-link__preview" aria-label="Preview">
        <span className="new-link__preview-label">Your link</span>
        <span className="new-link__preview-kind">Digital · no card number</span>
        <code className="new-link__url">
          {host}/l/<span className="accent">{code}</span>
        </code>
        <p className="field__help">
          The 7-character code is random and can&apos;t be guessed. Copy and the QR downloads unlock once the link is created.
        </p>
        <div className="new-link__appears">
          <span className="field__help">Appears in Links as</span>
          <span className="new-link__row">
            <span className="badge-digital">Digital</span>
            {name.trim() ? <strong>{name}</strong> : <em className="unnamed">Unnamed</em>}
          </span>
        </div>
      </aside>
    </div>
  );
}
