// mesma dupla usada nas pontas: --focus (discordo) → --brand (concordo)
function tone(v: number): string {
  const pct = ((v - 1) / 4) * 100;
  return `color-mix(in srgb, var(--brand) ${pct}%, var(--focus))`;
}

export function Scale({ name, value, onChange }: { name: string; value: number | null; onChange: (v: number) => void }) {
  return (
    <>
      <div className="grid grid-cols-5 gap-1.5" role="radiogroup" aria-labelledby={name}>
        {[1, 2, 3, 4, 5].map((v) => {
          const on = value === v;
          const c = tone(v);
          return (
            <label
              key={v}
              className="relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border p-2 text-center text-[0.7rem] transition-colors"
              style={{
                borderColor: on ? c : "var(--line)",
                background: on ? `color-mix(in srgb, ${c} 14%, transparent)` : "transparent",
                color: on ? "var(--ink)" : "var(--ink-faint)",
              }}
            >
              <input
                type="radio"
                name={name}
                value={v}
                checked={on}
                onChange={() => onChange(v)}
                className="absolute inset-0 m-0 h-full w-full cursor-pointer opacity-0"
              />
              <span
                className="h-[15px] w-[15px] rounded-full border-2"
                style={{ borderColor: c, background: on ? c : "transparent" }}
                aria-hidden="true"
              />
              <span>{v}</span>
            </label>
          );
        })}
      </div>
      <div className="mt-2 flex justify-between text-[0.72rem] font-semibold">
        <span style={{ color: "var(--focus)" }}>Discordo</span>
        <span style={{ color: "var(--brand)" }}>Concordo</span>
      </div>
    </>
  );
}
