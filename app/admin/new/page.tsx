import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { generateCode } from "@/lib/codes";
import { SITE_HOST } from "@/lib/site";
import { AdminShell } from "../_components/AdminShell";
import { NewLinkForm } from "../_components/NewLinkForm";

export const metadata: Metadata = { title: "New link" };
export const dynamic = "force-dynamic";

export default async function NewLinkPage() {
  await requireAdmin();
  // Shown as a preview; used on create unless it has been taken meanwhile.
  const code = generateCode();
  return (
    <AdminShell section="create">
      <main className="page page--narrow">
        <header className="page__head">
          <div className="page__title">
            <h1>Create</h1>
          </div>
        </header>
        <div className="segmented segmented--tabs" role="tablist" aria-label="Create">
          <span className="segmented__item" role="tab" aria-selected="true" aria-current="true">
            New link
          </span>
        </div>
        <NewLinkForm code={code} host={SITE_HOST} />
      </main>
    </AdminShell>
  );
}
