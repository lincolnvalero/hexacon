import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import {
  buildItems,
  pontuar,
  VERSOES,
  type Versao,
  type Item,
  type Resultado,
} from "../lib/hexaco";
import { Phone } from "../components/Phone";
import { DemoPanel } from "../components/Faders";
import { ThemeToggle } from "../components/ThemeToggle";
import { ResultView } from "../components/ResultView";
import { Scale } from "../components/Scale";

type Stage = "intro" | "quiz" | "result";

export function Responder() {
  const { slug = "" } = useParams();
  const [ev, setEv] = useState<EventRow | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "closed" | "notfound">("loading");

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setState("notfound");
        else {
          setEv(data as EventRow);
          setState((data as EventRow).aberto ? "ok" : "closed");
        }
      });
  }, [slug]);

  if (state === "loading")
    return (
      <Centered>
        <span className="mono text-sm" style={{ color: "var(--ink-faint)" }}>
          carregando…
        </span>
      </Centered>
    );
  if (state === "notfound")
    return (
      <Centered>
        <p style={{ color: "var(--ink-soft)" }}>Evento não encontrado. Confira o link.</p>
      </Centered>
    );
  if (state === "closed" || !ev)
    return (
      <Centered>
        <p style={{ color: "var(--ink-soft)" }}>
          As respostas deste evento estão encerradas.
        </p>
      </Centered>
    );

  return <Flow ev={ev} />;
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="grid min-h-screen place-items-center p-6 text-center">{children}</div>;
}

function Flow({ ev }: { ev: EventRow }) {
  const [stage, setStage] = useState<Stage>("intro");
  const [versao, setVersao] = useState<Versao>(ev.versao_default);
  const items = useMemo(() => buildItems(versao), [versao]);
  const [answers, setAnswers] = useState<(number | null)[]>(() => items.map(() => null));
  const [result, setResult] = useState<Resultado | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setAnswers(items.map(() => null));
  }, [items]);

  function start(v: Versao) {
    setVersao(v);
    setStage("quiz");
    window.scrollTo(0, 0);
  }

  function finish() {
    const r = pontuar(items, answers, versao);
    setResult(r);
    setStage("result");
    window.scrollTo(0, 0);
    submit(r);
  }

  async function submit(r: Resultado) {
    const byFactor = Object.fromEntries(r.fatores.map((s) => [s.f.k.toLowerCase(), Number(s.mean.toFixed(2))]));
    const itens: Record<string, number> = {};
    items.forEach((it, i) => {
      if (answers[i] != null) itens[`${it.f}:${it.facet}:${i}`] = answers[i] as number;
    });
    const { error } = await supabase.from("responses").insert({
      event_id: ev.id,
      versao,
      ...byFactor,
      altruismo: r.altruismo != null ? Number(r.altruismo.toFixed(2)) : null,
      itens,
    });
    if (!error) setSent(true);
  }

  return (
    <div className="mx-auto max-w-3xl px-4 pb-24 pt-4 sm:px-6">
      <header className="mb-6 flex items-start justify-between gap-4">
        <div>
          <div className="eyebrow">{ev.igreja || "Hexacon"}{ev.cidade ? ` · ${ev.cidade}` : ""}</div>
          <div className="font-display text-sm font-bold" style={{ color: "var(--ink-soft)" }}>
            {ev.titulo}
          </div>
        </div>
        <ThemeToggle />
      </header>

      {stage === "intro" && <Intro ev={ev} onStart={start} />}
      {stage === "quiz" && (
        <Quiz items={items} answers={answers} setAnswers={setAnswers} versao={versao} onDone={finish} onBack={() => setStage("intro")} />
      )}
      {stage === "result" && result && (
        <>
          <ResultView result={result} />
          <p className="no-print mt-6 text-center text-xs" style={{ color: sent ? "var(--good)" : "var(--ink-faint)" }}>
            {sent ? "✓ Resultado registrado para a turma." : "registrando…"}
          </p>
        </>
      )}
    </div>
  );
}

/* ---------------- intro ---------------- */
function Intro({ ev, onStart }: { ev: EventRow; onStart: (v: Versao) => void }) {
  return (
    <>
      <div className="grid items-start gap-8 md:grid-cols-[320px_1fr]">
        <div className="mx-auto md:mx-0">
          <Phone title="Meu painel" sub="arraste">
            <DemoPanel />
          </Phone>
        </div>
        <div>
          <div className="mono mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand)" }}>
            Comunicação &amp; relações
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Seis controles, na palma da mão</h1>
          <p className="mt-4 max-w-[52ch]" style={{ color: "var(--ink-soft)" }}>
            A metodologia <b style={{ color: "var(--ink)" }}>HEXACO</b> descreve a personalidade em seis
            fatores; aqui ela serve a um objetivo prático — <b style={{ color: "var(--ink)" }}>melhorar
            o relacionamento e a comunicação</b> no time. Você responde de 1 (discordo) a 5 (concordo) e
            recebe seus seis controles calibrados, com a luz e a sombra de cada ponta. São três versões:
            a de <b style={{ color: "var(--ink)" }}>~10 minutos já é suficiente</b> para um retrato
            confiável; a de ~20 minutos aprofunda; a de{" "}
            <b style={{ color: "var(--ink)" }}>~30 minutos entrega um resultado excelente</b>. Tudo roda
            no seu aparelho.
          </p>
          <p className="mt-4 border-l-[3px] pl-3 text-sm" style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}>
            Comece pela imagem: uma casa inteligente tem seis controles deslizantes, nenhum de
            liga-desliga. O segredo nunca é deixar tudo no máximo — é achar o ponto de cada um.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {(Object.values(VERSOES)).map((v) => (
          <button
            key={v.n}
            onClick={() => onStart(v.n)}
            className="flex flex-col gap-1.5 rounded-2xl border p-4 text-left transition-transform hover:-translate-y-0.5"
            style={{ borderColor: v.n === ev.versao_default ? "var(--brand)" : "var(--line)", borderWidth: 1.5, background: "var(--surface)" }}
          >
            {v.n === ev.versao_default && (
              <span
                className="mono self-start rounded px-1.5 py-0.5 text-[0.6rem] tracking-wider"
                style={{ background: "var(--brand)", color: "var(--brand-ink)" }}
              >
                SUGERIDO PELO EVENTO
              </span>
            )}
            <span className="font-display text-2xl font-extrabold leading-none">
              {v.n} <span className="text-sm font-semibold" style={{ color: "var(--ink-faint)" }}>itens</span>
            </span>
            <span className="mono text-[0.68rem] font-semibold tracking-wide" style={{ color: "var(--ink-faint)" }}>
              {v.label.toUpperCase()} · ~{v.min} MIN
            </span>
            <span className="text-sm" style={{ color: "var(--ink-soft)" }}>
              {v.qualidade}
            </span>
            <span className="mt-1 text-sm font-semibold" style={{ color: "var(--brand)" }}>
              começar →
            </span>
          </button>
        ))}
      </div>

      <p className="mt-8 border-t pt-4 text-xs" style={{ borderColor: "var(--line-soft)", color: "var(--ink-faint)" }}>
        Itens de redação própria, montados sobre a estrutura oficial do HEXACO (6 fatores × 4 facetas +
        Altruísmo) — não são o inventário HEXACO-PI-R. As faixas usam médias normativas aproximadas.
        Seus seis resultados {`(e, se preenchido, seu nome e ministério)`} ficam visíveis para o
        palestrante no painel da turma. Responda pensando em como você é num dia comum.
      </p>
    </>
  );
}

/* ---------------- quiz ---------------- */
function Quiz({
  items,
  answers,
  setAnswers,
  versao,
  onDone,
  onBack,
}: {
  items: Item[];
  answers: (number | null)[];
  setAnswers: (a: (number | null)[]) => void;
  versao: Versao;
  onDone: () => void;
  onBack: () => void;
}) {
  const done = answers.filter((a) => a != null).length;
  const total = items.length;
  const complete = done === total;
  const listRef = useRef<HTMLDivElement>(null);

  function set(i: number, v: number) {
    const next = answers.slice();
    next[i] = v;
    setAnswers(next);
  }
  function jump() {
    const b = answers.findIndex((a) => a == null);
    if (b < 0) return;
    listRef.current?.querySelectorAll<HTMLElement>("[data-q]")[b]?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  return (
    <>
      <div
        className="no-print sticky top-0 z-30 -mx-4 mb-5 border-b px-4 py-2.5 sm:-mx-6 sm:px-6"
        style={{ background: "color-mix(in srgb, var(--bg) 90%, transparent)", backdropFilter: "blur(10px)", borderColor: "var(--line-soft)" }}
      >
        <div className="mx-auto flex max-w-3xl items-center gap-3">
          <button className="btn btn-ghost btn-sm" onClick={onBack}>
            ‹ versão
          </button>
          <div className="h-1.5 flex-1 overflow-hidden rounded" style={{ background: "var(--surface-2)" }}>
            <div className="h-full transition-all" style={{ width: `${(done / total) * 100}%`, background: "var(--brand)" }} />
          </div>
          <span className="mono whitespace-nowrap text-xs" style={{ color: "var(--ink-faint)" }}>
            {done} / {total}
          </span>
          <button className="btn btn-sm" disabled={!complete} onClick={onDone}>
            painel
          </button>
        </div>
      </div>

      <div ref={listRef} className="mx-auto max-w-xl">
        <p className="mb-2 text-sm" style={{ color: "var(--ink-faint)" }}>
          Versão {versao} · ~{VERSOES[versao].min} min
        </p>
        {items.map((it, i) => (
          <div key={i} data-q className="border-b py-4" style={{ borderColor: "var(--line-soft)" }}>
            <div className="mb-2.5 flex gap-2.5">
              <span className="mono pt-0.5 text-[0.78rem] font-semibold" style={{ color: "var(--ink-faint)" }}>
                {i + 1 < 10 ? "0" : ""}
                {i + 1}
              </span>
              <span id={`l${i}`} className="text-[1.03rem]">
                {it.t}
              </span>
            </div>
            <Scale name={`l${i}`} value={answers[i]} onChange={(v) => set(i, v)} />
          </div>
        ))}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button className="btn" disabled={!complete} onClick={onDone}>
            Ver o meu painel
          </button>
          {!complete && (
            <>
              <button className="btn btn-ghost" onClick={jump}>
                Ir para a próxima em branco
              </button>
              <span className="text-sm" style={{ color: "var(--bad)" }}>
                faltam {total - done}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}
