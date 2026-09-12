import { posPct, faixaLabel, type FactorScore } from "../lib/hexaco";

function LetterBadge({ k, size = 20 }: { k: string; size?: number }) {
  return (
    <span
      className="grid flex-none place-items-center rounded-full font-display font-bold"
      style={{ width: size, height: size, fontSize: size * 0.46, background: "var(--cc)", color: "var(--bg)" }}
    >
      {k}
    </span>
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
        <LetterBadge k={s.f.k} size={20} />
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
export function AggBar({ k, name, cssVar, mean, spread }: { k: string; name: string; cssVar: string; mean: number; spread: number }) {
  const P = posPct(mean);
  return (
    <div className="py-2" style={{ ["--cc" as string]: `var(${cssVar})` }}>
      <div className="mb-1 flex items-center gap-2 text-[0.82rem]">
        <LetterBadge k={k} size={18} />
        <span className="font-semibold">{name}</span>
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
