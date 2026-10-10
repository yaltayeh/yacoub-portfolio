import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin-session";
import { generateCode } from "@/lib/codes";
import { SITE_HOST } from "@/lib/site";
import { AdminShell } from "../../_components/AdminShell";
import { CreateTabs } from "../../_components/CreateTabs";
import { NewLinkForm } from "../../_components/NewLinkForm";

export const metadata: Metadata = { title: "New link" };
export const dynamic = "force-dynamic";

export default async function NewLinkPage() {
  await requireAdmin();
  // Shown as a preview; used on create unless it has been taken meanwhile.
  const code = generateCode();
  return (
    <AdminShell section="create">
      <main className="page page--narrow">
        <header className="page__head page__head--wrap">
          <div className="page__title">
            <h1>Create</h1>
          </div>
          <CreateTabs current="link" />
        </header>
        <NewLinkForm code={code} host={SITE_HOST} />
      </main>
    </AdminShell>
  );
}
