import type { ReactNode } from "react";

export function Phone({ title, sub, children }: { title: string; sub?: string; children: ReactNode }) {
  return (
    <div
      className="relative w-full max-w-[320px] flex-none rounded-[34px] border p-3"
      style={{ background: "var(--surface-2)", borderColor: "var(--line)", boxShadow: "var(--shadow-lg)" }}
    >
      <span
        className="absolute left-1/2 top-[9px] h-[5px] w-[34%] -translate-x-1/2 rounded"
        style={{ background: "var(--surface-3)" }}
      />
      <div className="rounded-[24px] px-4 pb-4 pt-5" style={{ background: "var(--bg)" }}>
        <div className="mb-2 flex items-baseline justify-between">
          <b className="font-display text-[0.9rem]">{title}</b>
          {sub && (
            <span className="mono text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
              {sub}
            </span>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
