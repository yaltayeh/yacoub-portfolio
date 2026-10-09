"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { saveLink } from "../actions";
import { CheckIcon, Close, Copy, Download, Eye, Share } from "./admin-icons";

export type SheetData = {
  id: number;
  code: string;
  title: string;
  kind: "card" | "digital";
  name: string | null;
  notes: string | null;
  displayUrl: string;
  shareUrl: string;
  qrSvg: string;
  fileBase: string;
  visits: number;
  shares: number;
  first: string;
  last: string;
  byPlatform: { label: string; count: number }[];
  log: { id: number; share: boolean; label: string; at: string; meta: string }[];
};

type SaveState = "idle" | "saving" | "saved" | "error";

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Link details: a centred dialog on desktop, a full-height bottom sheet on
 * mobile. The URL (?link=CODE) drives it, so refresh and deep links reopen it.
 */
export function LinkSheet({
  data,
  closeHref,
  focusName,
  created,
}: {
  data: SheetData;
  closeHref: string;
  focusName: boolean;
  created: boolean;
}) {
  const router = useRouter();
  const dialogRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const returnFocus = useRef<Element | null>(null);
  const [name, setName] = useState(data.name ?? "");
  const [notes, setNotes] = useState(data.notes ?? "");
  const saved = useRef({ name: data.name ?? "", notes: data.notes ?? "" });
  const [state, setState] = useState<SaveState>(created ? "saved" : "idle");
  const [copied, setCopied] = useState(false);
  const [dragY, setDragY] = useState(0);
  const drag = useRef<{ startY: number; pointerId: number } | null>(null);
  // Unnamed links (and "Name a link") open in naming mode: labelled fields and a Save button.
  const namingMode = focusName || !data.name;

  const close = useCallback(() => {
    router.push(closeHref, { scroll: false });
  }, [router, closeHref]);

  useEffect(() => {
    returnFocus.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    if (focusName) nameRef.current?.focus();
    else dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      if (returnFocus.current instanceof HTMLElement) returnFocus.current.focus();
    };
  }, [focusName]);

  async function save(fields: { name?: string; notes?: string }) {
    const changed =
      ("name" in fields && fields.name !== saved.current.name) || ("notes" in fields && fields.notes !== saved.current.notes);
    if (!changed) return true;
    setState("saving");
    const result = await saveLink(data.id, fields);
    if (!result.ok) {
      setState("error");
      return false;
    }
    saved.current = { name: result.name ?? "", notes: result.notes ?? "" };
    setState("saved");
    router.refresh();
    return true;
  }

  async function saveAndClose() {
    if (await save({ name, notes })) close();
  }

  function onKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    // Focus trap: keep Tab inside the dialog.
    const items = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null);
    const first = items[0];
    const last = items.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Swipe down on the grip/header to dismiss the mobile sheet.
  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === "mouse") return;
    drag.current = { startY: event.clientY, pointerId: event.pointerId };
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent) {
    if (!drag.current) return;
    setDragY(Math.max(0, event.clientY - drag.current.startY));
  }
  function onPointerUp() {
    if (!drag.current) return;
    drag.current = null;
    if (dragY > 110) close();
    else setDragY(0);
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", data.shareUrl);
    }
  }

  function downloadSvg() {
    downloadBlob(new Blob([data.qrSvg], { type: "image/svg+xml" }), `${data.fileBase}.svg`);
  }

  function downloadPng() {
    const img = new Image();
    img.onload = () => {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => blob && downloadBlob(blob, `${data.fileBase}.png`), "image/png");
    };
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(data.qrSvg)}`;
  }

  const status =
    state === "saving" ? "Saving…" : state === "saved" ? (created ? "Created" : "Saved") : state === "error" ? "Couldn't save" : null;

  return (
    <div className="sheet-layer">
      <button type="button" className="sheet-backdrop" aria-label="Close link details" tabIndex={-1} onClick={close} />
      <section
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className="sheet"
        tabIndex={-1}
        onKeyDown={onKeyDown}
        style={dragY ? { transform: `translateY(${dragY}px)`, transition: "none" } : undefined}
      >
        <div
          className="sheet__head"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <span aria-hidden="true" className="sheet__grip" />
          <div className="sheet__title-row">
            <div className="sheet__title">
              <h2 id="sheet-title" className={data.kind === "card" ? "mono" : undefined}>
                {data.title}
              </h2>
              <span className="chip-kind">{data.kind === "card" ? "Printed" : "Digital link"}</span>
              {!saved.current.name ? <span className="chip-unnamed">Unnamed</span> : null}
              {status ? (
                <span className={`save-status${state === "error" ? " save-status--error" : ""}`} role="status">
                  {state === "saved" ? <CheckIcon /> : null}
                  {status}
                </span>
              ) : null}
            </div>
            <button type="button" className="icon-btn" aria-label="Close" onClick={close}>
              <Close size={20} />
            </button>
          </div>
        </div>

        <div className="sheet__body">
          {namingMode ? (
            <form
              className="sheet__naming"
              onSubmit={(e) => {
                e.preventDefault();
                void saveAndClose();
              }}
            >
              <div className="field">
                <label htmlFor="sheet-name">Name</label>
                <input
                  ref={nameRef}
                  id="sheet-name"
                  className="input input--lg input--focus"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="words"
                  enterKeyHint="done"
                  maxLength={80}
                  placeholder="Who did you give it to?"
                />
              </div>
              <div className="field">
                <label htmlFor="sheet-notes" className="field__label-row">
                  Notes <span className="optional">optional</span>
                </label>
                <textarea
                  id="sheet-notes"
                  className="input input--area"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={500}
                  placeholder="Where you met, what you talked about…"
                />
              </div>
              <button type="submit" className="abtn abtn--primary abtn--block" disabled={state === "saving"}>
                {state === "saving" ? "Saving…" : "Save"}
              </button>
              <p className="sheet__hint only-mobile">Press Done on the keyboard to save.</p>
            </form>
          ) : (
            <div className="inline-edit">
              <label htmlFor="sheet-name" className="visually-hidden">
                Name
              </label>
              <input
                ref={nameRef}
                id="sheet-name"
                className="inline-edit__name"
                value={name}
                maxLength={80}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => void save({ name })}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                enterKeyHint="done"
              />
              <label htmlFor="sheet-notes" className="visually-hidden">
                Notes
              </label>
              <textarea
                id="sheet-notes"
                className="inline-edit__notes"
                rows={2}
                value={notes}
                maxLength={500}
                placeholder="Add notes: where you met, what you talked about…"
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => void save({ notes })}
              />
            </div>
          )}

          <div className="qr-box">
            <div className="qr-box__code" role="img" aria-label={`QR code for ${data.displayUrl}`} dangerouslySetInnerHTML={{ __html: data.qrSvg }} />
            <div className="qr-box__side">
              <span className="qr-box__label only-desktop">Link</span>
              <div className="qr-box__url-row">
                <code className="qr-box__url">
                  {data.displayUrl.replace(data.code, "")}
                  <span className="accent">{data.code}</span>
                </code>
                <button type="button" className="abtn abtn--ghost abtn--xs" onClick={copyLink}>
                  {copied ? <CheckIcon /> : <Copy />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className="qr-box__downloads">
                <button type="button" className="abtn abtn--ghost abtn--xs" onClick={downloadSvg}>
                  <Download />
                  SVG
                </button>
                <button type="button" className="abtn abtn--ghost abtn--xs" onClick={downloadPng}>
                  <Download />
                  PNG
                </button>
              </div>
            </div>
          </div>

          <dl className="mini-stats">
            <div>
              <dt>Visits</dt>
              <dd>{data.visits}</dd>
            </div>
            <div>
              <dt>Shares</dt>
              <dd className="accent">{data.shares}</dd>
            </div>
            <div>
              <dt>First activity</dt>
              <dd className="mono small">{data.first}</dd>
            </div>
            <div>
              <dt>Last activity</dt>
              <dd className="mono small">{data.last}</dd>
            </div>
          </dl>

          {data.byPlatform.length > 0 ? (
            <div className="platforms">
              <h3>Shares by platform</h3>
              <div className="platforms__grid">
                {data.byPlatform.map((p) => (
                  <PlatformBar key={p.label} label={p.label} count={p.count} max={data.byPlatform[0]?.count ?? 1} />
                ))}
              </div>
            </div>
          ) : null}

          <div className="log">
            <h3>
              Event log <span className="mono dim">· {data.log.length}</span>
            </h3>
            {data.log.length === 0 ? (
              <div className="log__empty">
                <p className="log__empty-title">No activity yet</p>
                <p>Visits and shares will appear here as soon as someone opens this link.</p>
              </div>
            ) : (
              <ul>
                {data.log.map((e) => (
                  <li key={e.id} className="log__item">
                    <span aria-hidden="true" className={`event__icon event__icon--sm${e.share ? " event__icon--share" : ""}`}>
                      {e.share ? <Share size={14} /> : <Eye size={14} />}
                    </span>
                    <span className="log__main">
                      <span className="log__row">
                        <span className="log__label">{e.label}</span>
                        <span className="log__at mono">{e.at}</span>
                      </span>
                      <span className="log__meta">{e.meta}</span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function PlatformBar({ label, count, max }: { label: string; count: number; max: number }) {
  return (
    <>
      <span>{label}</span>
      <span className="bar" aria-hidden="true">
        <span style={{ width: `${Math.round((count / Math.max(max, 1)) * 100)}%` }} />
      </span>
      <span className="mono right">{count}</span>
    </>
  );
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
