import Link from "next/link";
import type { Link as LinkRecord, LinkEvent } from "@/db/schema";
import { cardNumber, countryName, deviceLabel, platformName, relativeTime } from "@/lib/format";
import { Chevron, Eye, Share } from "./admin-icons";

/** One activity in the Overview feed; the whole row opens that link's sheet. */
export function EventRow({ event, link }: { event: LinkEvent; link: LinkRecord }) {
  const share = event.type === "share";
  const when = relativeTime(event.createdAt);
  const device = deviceLabel(event.device, event.os);
  const country = countryName(event.country);
  return (
    <li>
      <Link href={`/admin/links?link=${link.code}`} scroll={false} className="event">
        <span aria-hidden="true" className={`event__icon${share ? " event__icon--share" : ""}`}>
          {share ? <Share /> : <Eye />}
        </span>
        <span className="event__main">
          <span className="event__line">
            {link.name ? <strong>{link.name}</strong> : <span className="unnamed">Unnamed</span>}
            {link.kind === "card" ? <span className="num">{cardNumber(link.number)}</span> : <span className="digital">Digital</span>}
            <span className="verb">{share ? "shared via" : "visited"}</span>
            {share ? <span className="platform">{platformName(event.platform)}</span> : null}
          </span>
          <span className="event__meta">
            {share ? `${when} · ${country}` : `${when} · ${device} · ${country}`}
          </span>
        </span>
        <span className="event__col">{share ? "—" : device}</span>
        <span className="event__col">{country}</span>
        <span className="event__col event__col--when">{when}</span>
        <span aria-hidden="true" className="event__chev">
          <Chevron />
        </span>
      </Link>
    </li>
  );
}
