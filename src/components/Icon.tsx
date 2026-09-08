import type { Factor } from "../lib/hexaco";

const PATHS: Record<Factor["ic"], JSX.Element> = {
  ar: (
    <>
      <rect x="2.5" y="4" width="19" height="9" rx="1.5" />
      <path d="M6 8h12M6 10.5h8" />
      <path d="M5 17c1.2-1.2 2.4-1.2 3.6 0M11 17c1.2-1.2 2.4-1.2 3.6 0M17 17c1.2-1.2 2.4-1.2 3.6 0" />
    </>
  ),
  chuveiro: (
    <>
      <path d="M14 3.5c3.6 0 6.5 2.9 6.5 6.5H7.5C7.5 6.4 10.4 3.5 14 3.5Z" />
      <path d="M14 3.5V2M8 13v2M12 14.5v3M16 13.5v2.5M12.5 20v1.5M15.5 19.5v2" />
    </>
  ),
  tv: (
    <>
      <rect x="2.5" y="5" width="12" height="9" rx="1.5" />
      <path d="M6 17h5" />
      <path d="M17.5 7.5c1.4 1.4 1.4 5.6 0 7M20 5c2.6 2.6 2.6 9.4 0 12" />
    </>
  ),
  ventilador: (
    <>
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0-4 1.5-7 4-7s2 4-1 6M14 12c4 0 7 1.5 7 4s-4 2-6-1M12 14c0 4-1.5 7-4 7s-2-4 1-6M10 12c-4 0-7-1.5-7-4s4-2 6 1" />
    </>
  ),
  fogao: (
    <path d="M12 3c1.6 2.3 3 4 3 6.5 0 1-.5 2-1.4 2.6.6-2-.6-3.6-1.6-4.6-1.4 1.6-3.5 3.4-3.5 6.4A5.5 5.5 0 0 0 18 15.5c0-4.2-3.5-7.2-6-12.5Z" />
  ),
  luz: (
    <>
      <path d="M9 15a5 5 0 1 1 6 0c-.6.5-1 1.3-1 2.1H10c0-.8-.4-1.6-1-2.1Z" />
      <path d="M10 20h4M11 22h2M12 1.5V3M4 12H2.5M21.5 12H20M5 5 6 6M19 5l-1 1" />
    </>
  ),
};

export function ApplianceIcon({ ic, className, style }: { ic: Factor["ic"]; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" className={`appl-ic ${className ?? ""}`} style={style} aria-hidden="true">
      {PATHS[ic]}
    </svg>
  );
}
