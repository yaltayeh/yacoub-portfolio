// Line icons from the design: 24px grid, round caps and joins, currentColor.
// Icons that point along the reading direction take the `flip` class so they mirror in RTL.
import type { ReactNode, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number; strokeWidth?: number };

function Icon({ size = 18, strokeWidth = 1.8, children, className, ...rest }: IconProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const ArrowForward = (p: IconProps) => (
  <Icon {...p} className={`flip ${p.className ?? ""}`}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Icon>
);
export const ArrowDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M6 13l6 6 6-6" />
  </Icon>
);
export const ArrowUpRight = (p: IconProps) => (
  <Icon {...p} className={`flip ${p.className ?? ""}`}>
    <path d="M7 17L17 7M9 7h8v8" />
  </Icon>
);
export const ChevronDown = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);
export const Check = (p: IconProps) => (
  <Icon strokeWidth={3} {...p}>
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </Icon>
);
export const Trophy = (p: IconProps) => (
  <Icon {...p}>
    <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z" />
    <path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3" />
  </Icon>
);
export const Medal = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="15" r="5" />
    <path d="M8.5 3h7l-2 7.2M8.5 3l2 7.2" />
  </Icon>
);
export const Flag = (p: IconProps) => (
  <Icon {...p}>
    <path d="M5 21V4h11l-1.5 4L16 12H5" />
  </Icon>
);
export const Globe = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Icon>
);
export const Pin = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Icon>
);
export const Calendar = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </Icon>
);
export const Book = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z" />
    <path d="M4 19a2 2 0 0 1 2-2h13v4H6a2 2 0 0 1-2-2z" />
  </Icon>
);
export const Loop = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
    <path d="M3 3v5h5" />
  </Icon>
);
export const AddContact = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="10" cy="8" r="4" />
    <path d="M3 20a7 7 0 0 1 14 0" />
    <path d="M19 8v6M16 11h6" />
  </Icon>
);
export const Mail = (p: IconProps) => (
  <Icon strokeWidth={1.7} {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3.5 6.5l8.5 6.5 8.5-6.5" />
  </Icon>
);
export const Chat = (p: IconProps) => (
  <Icon strokeWidth={1.7} {...p}>
    <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z" />
  </Icon>
);
export const Briefcase = (p: IconProps) => (
  <Icon strokeWidth={1.7} {...p}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </Icon>
);
export const Code = (p: IconProps) => (
  <Icon strokeWidth={1.7} {...p}>
    <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
  </Icon>
);

/** The logo mark: two overlapping circles, one accent, one ink at 45%. */
export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 26 26" fill="none" aria-hidden="true" focusable="false">
      <circle cx="10" cy="13" r="7" stroke="var(--accent)" strokeWidth="1.5" />
      <circle cx="16" cy="13" r="7" stroke="var(--ink)" strokeOpacity="0.45" strokeWidth="1.5" />
    </svg>
  );
}
