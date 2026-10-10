import Link from "next/link";
import { LinkIcon, QrIcon } from "./admin-icons";

/** "Create" switches between a single digital link and a printed batch. */
export function CreateTabs({ current }: { current: "link" | "batch" }) {
  return (
    <nav aria-label="Create" className="create-tabs">
      <Link href="/admin/links/new" aria-current={current === "link" ? "page" : undefined} className="create-tabs__item">
        <LinkIcon size={15} />
        New link
      </Link>
      <Link href="/admin/generate" aria-current={current === "batch" ? "page" : undefined} className="create-tabs__item">
        <QrIcon size={15} />
        Generate batch
      </Link>
    </nav>
  );
}
