import { useRef, useState } from "react";
import { FACTORS, faixaLabel, posPct, ALTRUISMO, type Resultado } from "../lib/hexaco";
import { ResultFader } from "./Faders";

export function ResultView({ result, presenterName }: { result: Resultado; presenterName?: string }) {
  const [nome, setNome] = useState(presenterName ?? "");
  const cardsRef = useRef<HTMLDivElement>(null);
  const data = new Date().toLocaleDateString("pt-BR");

  function toPDF() {
    document.querySelectorAll<HTMLDetailsElement>("details.result-disc").forEach((d) => (d.open = true));
    window.print();
  }

  function scrollTo(i: number) {
    cardsRef.current?.querySelectorAll<HTMLElement>("[data-rc]")[i]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <div>
      <div className="hidden print:mb-4 print:block print:border-b-2 print:border-black print:pb-2">
        <b className="font-display text-xl">Meu painel Hexacon</b>
        <span className="mono block text-sm" style={{ color: "#555" }}>
          {nome ? `${nome} · ` : ""}versão {result.versao} · {data}
        </span>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[300px_1fr]">
        <div className="card mx-auto w-full max-w-[300px] p-4 print:hidden md:mx-0">
          <div className="mb-2 flex items-baseline justify-between">
            <b className="font-display text-[0.9rem]">Resumo HEXACO</b>
            <span className="mono text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
              v{result.versao}
            </span>
          </div>
          {result.fatores.map((s, i) => (
            <ResultFader key={s.f.k} s={s} onClick={() => scrollTo(i)} />
          ))}
          {result.altruismo != null && <AltRow value={result.altruismo} />}
        </div>
        <div>
          <div className="eyebrow">Resultado completo</div>
          <h2 className="mt-1 text-2xl">Seus seis fatores HEXACO</h2>
          <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
            A marca fina no meio de cada trilho é o <b>ajuste comum</b> (a média das pessoas). Seu botão
            mostra onde você ficou. Quanto mais longe do meio, mais aquela força — e a sombra dela —
            aparece no seu dia a dia.
          </p>
          <div className="no-print mt-4 flex flex-wrap items-center gap-2.5">
            <input
              className="field max-w-[220px]"
              placeholder="Seu nome (opcional, só no PDF)"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
            <button className="btn btn-sm" onClick={toPDF}>
              Baixar em PDF
            </button>
          </div>
        </div>
      </div>

      <div ref={cardsRef} className="mt-6 grid gap-4">
        {result.fatores.map((s) => {
          const p = s.pole;
          const P = posPct(s.mean);
          const A = posPct(s.f.anchor);
          return (
            <div key={s.f.k} data-rc className="print-block card p-4" style={{ ["--cc" as string]: `var(${s.f.cssVar})` }}>
              <div className="mb-0.5 flex items-center gap-2.5">
                <span
                  className="grid h-7 w-7 flex-none place-items-center rounded-full font-display text-sm font-bold"
                  style={{ background: "var(--cc)", color: "var(--bg)" }}
                >
                  {s.f.k}
                </span>
                <span className="font-display text-[1.05rem] font-bold">{s.f.name}</span>
                <span className="text-[0.76rem]" style={{ color: "var(--ink-faint)" }}>
                  ({s.f.appliance})
                </span>
                <span
                  className="mono ml-auto text-[0.68rem] font-semibold uppercase tracking-wide"
                  style={{ color: "var(--cc)" }}
                >
                  {faixaLabel(s.z)}
                </span>
              </div>
              <div className="relative my-6 h-2">
                <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded" style={{ background: "var(--surface-3)" }} />
                <div
                  className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded"
                  style={{ left: `${Math.min(P, A)}%`, width: `${Math.abs(P - A)}%`, background: "color-mix(in srgb, var(--cc) 45%, transparent)" }}
                />
                <div className="absolute" style={{ left: `${A}%`, top: -6, bottom: -6, width: 2, background: "var(--ink-faint)", opacity: 0.5 }} />
                <span className="mono absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[0.55rem]" style={{ color: "var(--ink-faint)" }}>
                  ajuste comum
                </span>
                <div
                  className="absolute top-1/2 rounded"
                  style={{ left: `${P}%`, width: 14, height: 24, transform: "translate(-50%,-50%)", background: "var(--cc)", border: "2px solid var(--surface)", boxShadow: "var(--shadow-sm)" }}
                />
                <span className="mono absolute -top-5 right-0 text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
                  {s.mean.toFixed(1)}/5
                </span>
              </div>
              <p className="mt-2 text-sm" style={{ color: "var(--ink-soft)" }}>
                {p === "alto" && (
                  <>
                    <b style={{ color: "var(--ink)" }}>Perto do talo ({s.f.hi}).</b>{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>No ponto:</span> {s.f.forca}{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>Se passar:</span> {s.f.excesso}
                  </>
                )}
                {p === "baixo" && (
                  <>
                    <b style={{ color: "var(--ink)" }}>Perto do mínimo ({s.f.lo}).</b>{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>Costuma faltar:</span> {s.f.falta}{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>O que a outra ponta traria:</span> {s.f.forca}
                  </>
                )}
                {p === "meio" && (
                  <>
                    <b style={{ color: "var(--ink)" }}>No meio-termo.</b> Você transita pelas duas pontas conforme o momento — o
                    cuidado é não ficar sem posição quando a situação exige uma.{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>Alto demais:</span> {s.f.excesso}{" "}
                    <span className="font-semibold" style={{ color: "var(--cc)" }}>Baixo demais:</span> {s.f.falta}
                  </>
                )}
              </p>
            </div>
          );
        })}
        {result.altruismo != null && (
          <div className="print-block card p-4">
            <div className="mb-1 flex items-center gap-2">
              <span className="font-display font-bold">Altruísmo</span>
              <span className="mono ml-auto text-[0.68rem] font-semibold uppercase" style={{ color: "var(--ink-faint)" }}>
                {faixaLabel((result.altruismo - ALTRUISMO.anchor) / 0.6)}
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {result.altruismo - ALTRUISMO.anchor >= 0 ? ALTRUISMO.descAlto : ALTRUISMO.descBaixo}{" "}
              <span className="mono">({result.altruismo.toFixed(1)}/5)</span>
            </p>
          </div>
        )}
      </div>

      <details className="result-disc no-print mt-4 overflow-hidden rounded-xl border" style={{ borderColor: "var(--line)", background: "var(--surface)" }}>
        <summary className="cursor-pointer p-4 font-semibold">Guia de comunicação — como falar com alguém em cada ponta</summary>
        <div className="px-4 pb-4 text-sm" style={{ color: "var(--ink-soft)" }}>
          {FACTORS.map((f) => (
            <div key={f.k} className="border-t py-3" style={{ borderColor: "var(--line-soft)", ["--cc" as string]: `var(${f.cssVar})` }}>
              <h4 className="mb-1 text-[0.78rem] font-semibold uppercase tracking-wide" style={{ color: "var(--cc)" }}>
                {f.k} — {f.name} <span style={{ color: "var(--ink-faint)", textTransform: "none" }}>({f.appliance})</span>
              </h4>
              <p className="my-1">
                <b>Com quem está no talo:</b> {f.comAlto}
              </p>
              <p className="my-1" style={{ color: "var(--ink-faint)" }}>
                <b>Com quem está no mínimo:</b> {f.comBaixo}
              </p>
            </div>
          ))}
        </div>
      </details>

      <blockquote
        className="mt-6 rounded-xl border-l-4 p-5 font-display text-lg font-semibold leading-snug"
        style={{ background: "var(--surface-2)", borderColor: "var(--brand)" }}
      >
        O quanto eu estou disposto a mexer no <em>meu</em> controle — e não no do outro — para a casa
        toda continuar funcionando?
      </blockquote>
    </div>
  );
}

function AltRow({ value }: { value: number }) {
  const P = posPct(value);
  return (
    <div className="border-t py-2" style={{ borderColor: "var(--line-soft)" }}>
      <div className="mb-1 flex items-center gap-2 text-[0.78rem]">
        <span className="font-semibold">Altruísmo</span>
        <span className="mono ml-auto text-[0.6rem]" style={{ color: "var(--ink-faint)" }}>
          {value.toFixed(1)}
        </span>
      </div>
      <div className="relative flex h-4 items-center">
        <div className="absolute left-0 right-0 h-1.5 rounded" style={{ background: "var(--surface-3)" }} />
        <div className="absolute h-1.5 rounded" style={{ left: 0, width: `${P}%`, background: "var(--ink-soft)", opacity: 0.5 }} />
        <div
          className="absolute rounded"
          style={{ left: `${P}%`, top: "50%", width: 12, height: 18, transform: "translate(-50%,-50%)", background: "var(--ink-soft)", border: "2px solid var(--bg)" }}
        />
      </div>
    </div>
  );
}
