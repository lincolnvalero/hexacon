import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import { QR } from "../components/QR";
import { eventLink } from "../lib/links";

const DECK_IMAGE_COUNT = 14;
// prefixado com BASE_URL: raiz em produção normal, "/hexacon/" no build do GitHub Pages
const DECK_IMAGES = Array.from(
  { length: DECK_IMAGE_COUNT },
  (_, i) => `${import.meta.env.BASE_URL}deck/slide-${String(i + 1).padStart(2, "0")}.jpg`,
);

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

  const link = ev ? eventLink(ev.slug) : "";
  const n = DECK_IMAGE_COUNT + 1; // + slide final de chamada (QR ao vivo)
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

  const isCTA = i === DECK_IMAGE_COUNT;

  return (
    <div ref={wrapRef} className="flex min-h-screen flex-col print:block" style={{ background: "var(--bg)" }}>
      <div className="flex flex-1 flex-col print:hidden">
        <div className="flex flex-1 items-center justify-center p-3 sm:p-8">
          <div
            className="relative flex w-full max-w-[1100px] flex-col items-center justify-center overflow-hidden rounded-2xl"
            style={{ boxShadow: "var(--shadow-lg)", background: "#0b0d12" }}
          >
            {i === 0 && ev && (
              <a
                href={link}
                target="_blank"
                rel="noreferrer"
                className="btn btn-ghost btn-sm absolute right-4 top-4 z-10"
                style={{ position: "absolute", background: "rgba(20,20,24,.7)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}
              >
                Página de respostas ↗
              </a>
            )}
            {!isCTA ? (
              <img
                src={DECK_IMAGES[i]}
                alt={`Slide ${i + 1} de ${DECK_IMAGE_COUNT}`}
                className="block w-full"
                style={{ aspectRatio: "1376 / 768" }}
              />
            ) : (
              <CTASlide link={link} />
            )}
          </div>
        </div>

        <div
          className="sticky bottom-0 border-t px-4 py-2.5 sm:px-6"
          style={{ background: "color-mix(in srgb, var(--bg) 92%, transparent)", backdropFilter: "blur(10px)", borderColor: "var(--line-soft)" }}
        >
          <div className="mx-auto flex max-w-[1100px] items-center gap-3">
            <Link to="/painel" className="btn btn-ghost btn-sm" title="Voltar ao menu">
              ☰ menu
            </Link>
            <button className="btn btn-ghost btn-sm" onClick={() => go(-1)} disabled={i === 0}>
              ‹
            </button>
            <div className="flex flex-1 flex-wrap gap-1.5">
              {Array.from({ length: n }, (_, k) => (
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
        {DECK_IMAGES.map((src, k) => (
          <div key={k} className="print-slide flex items-center justify-center">
            <img src={src} alt={`Slide ${k + 1}`} style={{ width: "100%" }} />
          </div>
        ))}
        <div className="print-slide flex flex-col justify-center p-10" style={{ color: "var(--ink)" }}>
          <div className="mono mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand)" }}>
            agora
          </div>
          <h3 className="mb-2 text-2xl sm:text-3xl">Abra o seu painel</h3>
          <p className="max-w-[62ch] text-lg sm:text-xl" style={{ color: "var(--ink-soft)" }}>
            Aponte a câmera. Responda o teste e veja seus seis fatores calibrados.
          </p>
          <p className="mono mt-4 text-sm" style={{ color: "var(--ink-faint)" }}>
            {link || "Crie/abra um evento para gerar o link desta turma."}
          </p>
        </div>
      </div>
    </div>
  );
}

function CTASlide({ link }: { link: string }) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-5 px-8 py-14 text-center" style={{ color: "#eef1f8" }}>
      <div className="mono text-[0.7rem] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--brand)" }}>
        agora
      </div>
      <h2 className="text-2xl font-extrabold sm:text-4xl">Abra o seu painel</h2>
      <p className="max-w-[52ch] text-lg" style={{ color: "#aab2c4" }}>
        Aponte a câmera. Responda o teste e veja seus seis fatores calibrados.
      </p>
      {link ? (
        <div className="flex flex-col items-center gap-3">
          <QR text={link} size={190} />
          <a href={link} target="_blank" rel="noreferrer" className="mono text-sm" style={{ color: "#eef1f8" }}>
            {link}
          </a>
        </div>
      ) : (
        <p className="mono text-sm" style={{ color: "#7a8296" }}>
          Crie/abra um evento para gerar o QR desta turma.
        </p>
      )}
    </div>
  );
}
