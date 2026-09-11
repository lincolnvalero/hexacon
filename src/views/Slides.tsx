import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import { FACTORS } from "../lib/hexaco";
import { ApplianceIcon } from "../components/Icon";
import { QR } from "../components/QR";

type Slide = { kind: string; cover?: boolean; cc?: string; render: () => JSX.Element };

export function Slides() {
  const { id } = useParams();
  const [ev, setEv] = useState<EventRow | null>(null);
  const [i, setI] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = id
      ? supabase.from("events").select("*").eq("id", id).maybeSingle()
      : supabase.from("events").select("*").eq("aberto", true).order("criado_em", { ascending: false }).limit(1).maybeSingle();
    q.then(({ data }) => setEv((data as EventRow) ?? null));
  }, [id]);

  const link = ev ? `${window.location.origin}/e/${ev.slug}` : "";

  const slides = useMemo<Slide[]>(() => buildDeck(link, ev?.titulo), [link, ev?.titulo]);
  const n = slides.length;
  const go = useCallback((d: number) => setI((x) => Math.min(n - 1, Math.max(0, x + d))), [n]);

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        go(1);
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "Home") setI(0);
      else if (e.key === "End") setI(n - 1);
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [go, n]);

  function fullscreen() {
    const el = wrapRef.current;
    if (!el) return;
    if (!document.fullscreenElement) el.requestFullscreen?.();
    else document.exitFullscreen();
  }

  const s = slides[i];

  return (
    <div ref={wrapRef} className="flex min-h-screen flex-col print:block" style={{ background: "var(--bg)" }}>
      <div className="flex flex-1 flex-col print:hidden">
        <div className="flex flex-1 items-center justify-center p-4 sm:p-10">
          <div
            className="card relative flex w-full max-w-[900px] flex-col justify-center p-8 sm:p-14"
            style={{ minHeight: "min(64vh, 520px)", boxShadow: "var(--shadow-lg)", ["--cc" as string]: s.cc ? `var(${s.cc})` : "var(--brand)" }}
          >
            {i === 0 && ev && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm absolute right-6 top-6"
                style={{ position: "absolute" }}
              >
                Página de respostas ↗
              </a>
            )}
            <div className="mono mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand)" }}>
              {s.kind}
            </div>
            {s.render()}
          </div>
        </div>

        <div
          className="sticky bottom-0 border-t px-4 py-2.5 sm:px-6"
          style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(10px)", borderColor: "var(--line-soft)" }}
        >
          <div className="mx-auto flex max-w-[900px] items-center gap-3">
            <Link to="/painel" className="btn btn-ghost btn-sm" title="Voltar ao menu">
              ☰ menu
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={() => go(-1)} disabled={i === 0}>
              ‹
            </button>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {slides.map((_, k) => (
                <button
                  key={k}
                  aria-label={`Slide ${k + 1}`}
                  onClick={() => setI(k)}
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: k === i ? "var(--brand)" : "var(--surface-3)", transform: k === i ? "scale(1.3)" : undefined }}
                />
              ))}
            </div>
            <span className="mono text-xs" style={{ color: "var(--ink-faint)" }}>
              {i + 1} / {n}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={fullscreen} title="Tela cheia">
              ⛶
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => go(1)} disabled={i === n - 1}>
              ›
            </button>
          </div>
        </div>
      </div>

      {/* impressão: todos os slides, um por página (usado para exportar o deck em PDF) */}
      <div className="hidden print:block">
        {slides.map((sl, k) => (
          <div
            key={k}
            className="print-slide flex flex-col justify-center p-10"
            style={{ ["--cc" as string]: sl.cc ? `var(${sl.cc})` : "var(--brand)" }}
          >
            <div className="mono mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand)" }}>
              {sl.kind}
            </div>
            {sl.render()}
          </div>
        ))}
      </div>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-3xl font-extrabold sm:text-5xl">{children}</h2>;
}
function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2 text-2xl sm:text-3xl">{children}</h3>;
}
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-[62ch] text-lg sm:text-xl" style={{ color: "var(--ink-soft)" }}>
      {children}
    </p>
  );
}
function Row({ cc, children }: { cc: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl p-3 text-base sm:text-lg" style={{ background: "var(--surface-2)", color: "var(--ink-soft)", borderLeft: `3px solid var(${cc})` }}>
      {children}
    </div>
  );
}

function buildDeck(link: string, titulo?: string): Slide[] {
  const deck: Slide[] = [];

  deck.push({
    kind: "Hexacon",
    cover: true,
    render: () => (
      <>
        <H2>
          Seis controles.
          <br />
          Uma casa. Um time.
        </H2>
        <P>Comunicação e relações não se resolvem no liga-desliga. Regula-se a intensidade.</P>
        <div className="mt-6 flex gap-1.5">
          {FACTORS.map((f) => (
            <span key={f.k} className="h-1.5 w-7 rounded" style={{ background: `var(${f.cssVar})` }} />
          ))}
        </div>
        {titulo && (
          <p className="mono mt-6 text-sm" style={{ color: "var(--ink-faint)" }}>
            {titulo}
          </p>
        )}
      </>
    ),
  });

  deck.push({
    kind: "a metáfora",
    render: () => (
      <>
        <H3>O app da casa inteligente</H3>
        <P>
          Seis controles deslizantes. Nenhum é botão de liga-desliga. Se o projeto precisa de ritmo,
          você aumenta o <b>fogo do fogão</b>. Se a equipe está cansada, abranda o <b>ventilador</b>{" "}
          para acalmar os ânimos.
        </P>
        <p className="mt-3 max-w-[62ch] text-lg sm:text-xl" style={{ color: "var(--ink)" }}>
          <b>O sucesso não é deixar tudo no máximo.</b> Ninguém liga o som da TV no talo com o chuveiro
          fervendo e o ar-condicionado no talo ao mesmo tempo.
        </p>
      </>
    ),
  });

  deck.push({
    kind: "tudo no celular",
    render: () => (
      <>
        <H3>Da casa para a palma da mão</H3>
        <P>A partir daqui, os seis controles são os seis fatores da personalidade — cada um com o seu fader, entre a luz e a sombra.</P>
        <div className="mt-4 grid gap-2">
          {FACTORS.map((f) => (
            <Row key={f.k} cc={f.cssVar}>
              <span className="inline-flex items-center gap-2">
                <ApplianceIcon ic={f.ic} style={{ color: `var(${f.cssVar})` }} />
                <b>{f.appliance}</b> — {f.name}: {f.regula}
              </span>
            </Row>
          ))}
        </div>
      </>
    ),
  });

  deck.push({
    kind: "antes de tudo",
    render: () => (
      <>
        <H3>O que isto não é</H3>
        <ul className="mt-2 list-disc pl-6 text-lg sm:text-xl" style={{ color: "var(--ink-soft)" }}>
          <li>Não é teste de QI, de inteligência emocional ou de competência.</li>
          <li>Não mede espiritualidade nem maturidade.</li>
          <li>Não serve para escalar, barrar ou remanejar ninguém. É linguagem para entender atrito.</li>
        </ul>
      </>
    ),
  });

  FACTORS.forEach((f) => {
    deck.push({
      kind: `controle · ${f.k}`,
      cc: f.cssVar,
      render: () => (
        <>
          <ApplianceIcon ic={f.ic} className="mb-4 !h-16 !w-16" style={{ color: "var(--cc)" }} />
          <H3>
            {f.appliance}{" "}
            <span className="text-[0.6em] font-semibold" style={{ color: "var(--ink-faint)" }}>
              — {f.name}
            </span>
          </H3>
          <div className="mt-2 grid gap-2.5">
            <div className="rounded-xl p-3.5 text-base sm:text-lg" style={{ background: "var(--surface-2)", borderLeft: "3px solid var(--cc)" }}>
              <b className="mono block text-xs uppercase tracking-wide">No ponto</b>
              <span style={{ color: "var(--ink-soft)" }}>{f.forca}</span>
            </div>
            <div className="rounded-xl p-3.5 text-base sm:text-lg" style={{ background: "var(--surface-2)" }}>
              <b className="mono block text-xs uppercase tracking-wide">Passou do ponto ({f.hi})</b>
              <span style={{ color: "var(--ink-soft)" }}>{f.excesso}</span>
            </div>
            <div className="rounded-xl p-3.5 text-base sm:text-lg" style={{ background: "var(--surface-2)" }}>
              <b className="mono block text-xs uppercase tracking-wide">Perto do mínimo ({f.lo})</b>
              <span style={{ color: "var(--ink-soft)" }}>{f.falta}</span>
            </div>
          </div>
        </>
      ),
    });
  });

  deck.push({
    kind: "módulo 2",
    render: () => (
      <>
        <H3>Calibrar a conversa — não a pessoa</H3>
        <P>Você não muda o controle do outro. Você ajusta o seu jeito de entregar a mensagem para quem está em cada ponta.</P>
      </>
    ),
  });

  [FACTORS.slice(0, 3), FACTORS.slice(3, 6)].forEach((grp, gi) => {
    deck.push({
      kind: `equalizador ${gi + 1}/2`,
      render: () => (
        <>
          <H3>Como falar com…</H3>
          <div className="grid gap-2">
            {grp.map((f) => (
              <Row key={f.k} cc={f.cssVar}>
                <b style={{ color: `var(${f.cssVar})` }}>{f.appliance} no talo:</b> {f.comAlto}
                <br />
                <b style={{ color: `var(${f.cssVar})` }}>{f.appliance} no mínimo:</b> {f.comBaixo}
              </Row>
            ))}
          </div>
        </>
      ),
    });
  });

  deck.push({
    kind: "módulo 3",
    render: () => (
      <>
        <H3>Os atritos da casa</H3>
        <div className="grid gap-2">
          <Row cc="--ac-c">
            <b>O ensaio.</b> Fogão alto (cronograma fechado) × luz forte (ideia nova 10 min antes). O
            fogão define o limite técnico; a luz entrega dentro dele.
          </Row>
          <Row cc="--ac-e">
            <b>A visita à família.</b> Chuveiro quente (mergulha na dor) × chuveiro frio (mantém a
            cabeça fria). Vão juntos: um sustenta o vínculo, o outro a estrutura.
          </Row>
          <Row cc="--ac-h">
            <b>Cargos e influência.</b> Alguém mexe no termostato só para si. A régua da função é a
            mesma para todos.
          </Row>
          <Row cc="--ac-x">
            <b>A reunião.</b> Som no talo domina; som no mudo tinha a fala decisiva e não foi ouvido.
            Rodada: cada um fala uma vez antes de decidir.
          </Row>
        </div>
      </>
    ),
  });

  deck.push({
    kind: "módulo 4",
    render: () => (
      <>
        <H3>O equilíbrio</H3>
        <P>
          Maturidade não é ficar no meio de tudo — isso é não ter personalidade. É saber{" "}
          <b>qual controle mexer nesta situação</b>, e por quanto tempo.
        </P>
        <p className="mt-3 max-w-[62ch] text-lg sm:text-xl" style={{ color: "var(--ink)" }}>
          <b>Um controle não se mexe para agradar: o ar-condicionado.</b> A integridade não é dial que
          se reduz para manter a paz.
        </p>
      </>
    ),
  });

  deck.push({
    kind: "a pergunta",
    cover: true,
    render: () => (
      <h2 className="text-2xl font-extrabold sm:text-4xl">
        O quanto eu estou disposto a mexer no <em>meu</em> controle — e não no do outro — para a casa
        toda continuar funcionando?
      </h2>
    ),
  });

  deck.push({
    kind: "agora",
    render: () => (
      <>
        <H3>Abra o seu painel</H3>
        <P>Aponte a câmera. Responda o teste e veja seus seis controles calibrados.</P>
        {link ? (
          <div className="mt-4 flex flex-wrap items-center gap-5">
            <QR text={link} size={190} />
            <a href={link} target="_blank" rel="noreferrer" className="mono text-sm">
              {link}
            </a>
          </div>
        ) : (
          <p className="mono mt-4 text-sm" style={{ color: "var(--ink-faint)" }}>
            Crie/abra um evento para gerar o QR desta turma.
          </p>
        )}
      </>
    ),
  });

  return deck;
}
