// Admin line icons from the design (24px grid, round caps, currentColor).
import type { ReactNode } from "react";

function I({ size = 18, sw = 1.8, children, cap = "round" }: { size?: number; sw?: number; children: ReactNode; cap?: "round" | "square" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap={cap}
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export const Grid = ({ size }: { size?: number }) => (
  <I size={size}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </I>
);
export const LinkIcon = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1" />
    <path d="M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
  </I>
);
export const PlusSquare = ({ size }: { size?: number }) => (
  <I size={size}>
    <rect x="3" y="3" width="18" height="18" rx="3" />
    <path d="M12 8v8M8 12h8" />
  </I>
);
export const SignOutIcon = ({ size }: { size?: number }) => (
  <I size={size}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
  </I>
);
export const Plus = ({ size = 16 }: { size?: number }) => (
  <I size={size} sw={2}>
    <path d="M12 5v14M5 12h14" />
  </I>
);
export const Eye = ({ size = 17 }: { size?: number }) => (
  <I size={size}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
    <circle cx="12" cy="12" r="3" />
  </I>
);
export const Share = ({ size = 17 }: { size?: number }) => (
  <I size={size}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
  </I>
);
export const Chevron = ({ size = 16 }: { size?: number }) => (
  <I size={size} sw={2}>
    <path d="M9 6l6 6-6 6" />
  </I>
);
export const ArrowRight = ({ size = 16 }: { size?: number }) => (
  <I size={size} sw={2}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </I>
);
export const Close = ({ size = 18 }: { size?: number }) => (
  <I size={size} sw={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </I>
);
export const Search = ({ size = 16 }: { size?: number }) => (
  <I size={size}>
    <circle cx="11" cy="11" r="7" />
    <path d="M20 20l-3.5-3.5" />
  </I>
);
export const SortIcon = ({ size = 15 }: { size?: number }) => (
  <I size={size}>
    <path d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4" />
  </I>
);
export const Copy = ({ size = 14 }: { size?: number }) => (
  <I size={size}>
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </I>
);
export const Download = ({ size = 14 }: { size?: number }) => (
  <I size={size}>
    <path d="M12 4v12M7 11l5 5 5-5M5 20h14" />
  </I>
);
export const CheckIcon = ({ size = 13 }: { size?: number }) => (
  <I size={size} sw={2.2}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </I>
);
export const Lock = ({ size = 14 }: { size?: number }) => (
  <I size={size}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </I>
);
export const QrIcon = ({ size = 16 }: { size?: number }) => (
  <I size={size} cap="square">
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
    <path d="M14 14h3v3M21 14v.01M14 21h7v-4" />
  </I>
);
