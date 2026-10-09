"use server";

import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-session";
import { createDigitalLink, updateLink } from "@/lib/admin-data";

export type SaveResult = { ok: true; name: string | null; notes: string | null } | { ok: false; error: string };

/** Inline edit of a link's name and/or notes from the link sheet. */
export async function saveLink(id: number, fields: { name?: string; notes?: string }): Promise<SaveResult> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Unknown link." };
  const row = await updateLink(id, fields);
  if (!row) return { ok: false, error: "This link no longer exists." };
  return { ok: true, name: row.name, notes: row.notes };
}

export type CreateState = { error?: string } | undefined;

/** "New link" form: creates a digital link, then opens it in the Links sheet. */
export async function createLink(_prev: CreateState, form: FormData): Promise<CreateState> {
  await requireAdmin();
  const name = String(form.get("name") ?? "").trim();
  if (!name) return { error: "Give the link a name, so you can recognise it later." };
  const row = await createDigitalLink({
    code: String(form.get("code") ?? ""),
    name,
    notes: String(form.get("notes") ?? ""),
  });
  redirect(`/admin/links?link=${row.code}&created=1`);
}
