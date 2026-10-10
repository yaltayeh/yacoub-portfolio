"use client";

export function PrintButton() {
  return (
    <button type="button" className="abtn abtn--primary abtn--sm" onClick={() => window.print()}>
      Print
    </button>
  );
}
