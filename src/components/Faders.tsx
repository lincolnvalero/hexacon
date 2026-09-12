import { useState } from "react";
import { FACTORS, posPct, faixaLabel, type FactorScore } from "../lib/hexaco";
import { ApplianceIcon } from "./Icon";

/* ---------- 6 itens, compacto (legenda da metáfora) ---------- */
export function MethodItems() {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {FACTORS.map((f) => (
        <div
          key={f.k}
          className="flex items-center gap-1.5 rounded-lg px-2 py-1.5"
          style={{ background: "var(--surface-2)", ["--cc" as string]: `var(${f.cssVar})` }}
        >
          <span
            className="grid h-6 w-6 flex-none place-items-center rounded-full"
            style={{ background: "color-mix(in srgb, var(--cc) 20%, transparent)" }}
          >
            <ApplianceIcon ic={f.ic} className="!h-3.5 !w-3.5" style={{ color: "var(--cc)" }} />
          </span>
          <span className="min-w-0 truncate text-[0.7rem] font-semibold">{f.appliance}</span>
          <span className="mono ml-auto text-[0.56rem]" style={{ color: "var(--ink-faint)" }}>
            {f.k}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- painel interativo (demonstração da metáfora) ---------- */
export function DemoPanel() {
  const start = [60, 45, 55, 68, 40, 50];
  return (
    <div className="grid gap-1">
      {FACTORS.map((f, i) => (
        <DemoFader key={f.k} f={f} start={start[i]} />
      ))}
    </div>
  );
}

function DemoFader({ f, start }: { f: (typeof FACTORS)[number]; start: number }) {
  const [v, setV] = useState(start);
  const hint =
    v >= 68 ? { c: "var(--bad)", t: `⚠ ${f.short.hi}` } : v <= 32 ? { c: "var(--ink-soft)", t: f.short.lo } : { c: "var(--good)", t: `✓ ${f.short.p}` };
  return (
    <div className="border-t py-2 first:border-t-0" style={{ borderColor: "var(--line-soft)", ["--cc" as string]: `var(${f.cssVar})` }}>
      <div className="mb-1 flex items-center gap-2">
        <ApplianceIcon ic={f.ic} className="!w-4 !h-4" style={{ color: "var(--cc)" }} />
        <span className="text-[0.78rem] font-semibold">{f.appliance}</span>
        <span className="mono ml-auto text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
          {f.k}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={v}
        onChange={(e) => setV(+e.target.value)}
        aria-label={f.appliance}
        className="h-5 w-full appearance-none bg-transparent"
        style={{
          background: `linear-gradient(90deg, var(--cc) ${v}%, var(--surface-3) ${v}%)`,
          borderRadius: 3,
          height: 6,
        }}
      />
      <div className="mt-1 flex justify-between text-[0.58rem]" style={{ color: "var(--ink-faint)" }}>
        <span>{f.lo}</span>
        <span>{f.hi}</span>
      </div>
      <div className="mt-1 min-h-[1.4em] text-[0.66rem]" style={{ color: hint.c }}>
        {hint.t}
      </div>
    </div>
  );
}

/* ---------- fader de leitura (resultado) ---------- */
export function ResultFader({ s, onClick }: { s: FactorScore; onClick?: () => void }) {
  const P = posPct(s.mean);
  const A = posPct(s.f.anchor);
  return (
    <div
      className="cursor-pointer border-t py-2 first:border-t-0"
      style={{ borderColor: "var(--line-soft)", ["--cc" as string]: `var(${s.f.cssVar})` }}
      onClick={onClick}
    >
      <div className="mb-1 flex items-center gap-2">
        <span
          className="grid h-5 w-5 flex-none place-items-center rounded-full text-[0.62rem] font-bold"
          style={{ background: "var(--cc)", color: "var(--bg)" }}
        >
          {s.f.k}
        </span>
        <span className="text-[0.78rem] font-semibold">{s.f.name}</span>
        <span className="mono ml-auto text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
          {faixaLabel(s.z)}
        </span>
      </div>
      <div className="relative flex h-5 items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded" style={{ background: "var(--surface-3)" }} />
        <div className="absolute left-0 h-1.5 rounded" style={{ width: `${P}%`, background: "var(--cc)", opacity: 0.5 }} />
        <div className="absolute" style={{ left: `${A}%`, top: 1, bottom: 1, width: 2, background: "var(--ink-faint)", opacity: 0.55 }} />
        <div
          className="absolute rounded"
          style={{
            left: `${P}%`,
            top: "50%",
            width: 13,
            height: 19,
            transform: "translate(-50%,-50%)",
            background: "var(--cc)",
            border: "2px solid var(--bg)",
            boxShadow: "var(--shadow-sm)",
          }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[0.58rem]" style={{ color: "var(--ink-faint)" }}>
        <span>{s.f.lo}</span>
        <span>{s.f.hi}</span>
      </div>
    </div>
  );
}

/* ---------- barra agregada (dashboard) ---------- */
export function AggBar({ label, ic, cssVar, mean, spread }: { label: string; ic: (typeof FACTORS)[number]["ic"]; cssVar: string; mean: number; spread: number }) {
  const P = posPct(mean);
  return (
    <div className="py-2" style={{ ["--cc" as string]: `var(${cssVar})` }}>
      <div className="mb-1 flex items-center gap-2 text-[0.82rem]">
        <ApplianceIcon ic={ic} className="!w-4 !h-4" style={{ color: "var(--cc)" }} />
        <span className="font-semibold">{label}</span>
        <span className="mono ml-auto text-[0.66rem]" style={{ color: "var(--ink-faint)" }}>
          média {mean.toFixed(2)} · dispersão {spread.toFixed(2)}
        </span>
      </div>
      <div className="relative flex h-4 items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded" style={{ background: "var(--surface-3)" }} />
        {/* faixa de dispersão */}
        <div
          className="absolute h-2 rounded"
          style={{
            left: `${posPct(mean - spread)}%`,
            width: `${posPct(mean + spread) - posPct(mean - spread)}%`,
            background: "var(--cc)",
            opacity: 0.22,
          }}
        />
        <div className="absolute h-1.5 rounded" style={{ left: 0, width: `${P}%`, background: "var(--cc)", opacity: 0.55 }} />
        <div
          className="absolute rounded"
          style={{ left: `${P}%`, top: "50%", width: 12, height: 18, transform: "translate(-50%,-50%)", background: "var(--cc)", border: "2px solid var(--bg)" }}
        />
      </div>
    </div>
  );
}
