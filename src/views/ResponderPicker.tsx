import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { Shell } from "../components/Shell";
import { QR } from "../components/QR";
import { eventLink } from "../lib/links";

function useViewportMin() {
  const [v, setV] = useState(() => Math.min(window.innerWidth, window.innerHeight));
  useEffect(() => {
    const onResize = () => setV(Math.min(window.innerWidth, window.innerHeight));
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return v;
}

function BigQR({ ev, link, onClose }: { ev: EventRow; link: string; onClose: () => void }) {
  const vmin = useViewportMin();
  const size = Math.round(Math.min(Math.max(vmin * 0.6, 260), 640));

  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex cursor-pointer flex-col items-center justify-center gap-6 p-6"
      style={{ background: "#0b0d12" }}
      onClick={onClose}
    >
      <button
        className="btn btn-ghost btn-sm absolute right-6 top-6"
        style={{ color: "#fff", borderColor: "rgba(255,255,255,.3)" }}
        onClick={onClose}
      >
        ✕ fechar
      </button>

      <div className="flex items-center gap-2">
        <span className="grid grid-cols-3 gap-[3px]" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-[1px]"
              style={{ background: [0, 3].includes(i) ? "var(--brand)" : i === 1 ? "var(--ac-h)" : i === 2 ? "var(--ac-x)" : "var(--ac-a)" }}
            />
          ))}
        </span>
        <span className="font-display text-xl font-extrabold tracking-tight" style={{ color: "#fff" }}>
          Hexaco
        </span>
      </div>

      <div className="rounded-3xl bg-white p-5" style={{ boxShadow: "0 20px 60px rgba(0,0,0,.5)" }} onClick={(e) => e.stopPropagation()}>
        <QR text={link} size={size} />
      </div>

      <div className="text-center">
        <div className="font-display text-3xl font-extrabold sm:text-4xl" style={{ color: "#fff" }}>
          {ev.titulo}
        </div>
        {(ev.igreja || ev.cidade) && (
          <div className="mt-1 text-lg" style={{ color: "#aab2c4" }}>
            {[ev.igreja, ev.cidade].filter(Boolean).join(" · ")}
          </div>
        )}
        <div className="mono mt-4 text-sm" style={{ color: "#7a8296" }}>
          {link}
        </div>
      </div>
    </div>
  );
}

/** Área do palestrante: a "Página de resposta" — escolher um evento e
 *  pegar o link/QR que a turma usa. */
export function ResponderPicker() {
  const { session } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sel, setSel] = useState<EventRow | null>(null);
  const [copied, setCopied] = useState(false);
  const [bigOpen, setBigOpen] = useState(false);

  useEffect(() => {
    if (!session) return;
    // só as turmas do próprio usuário — a policy de leitura também libera
    // eventos abertos de OUTROS donos (para o participante), o que não deve
    // aparecer aqui.
    supabase
      .from("events")
      .select("*")
      .eq("owner", session.user.id)
      .order("criado_em", { ascending: false })
      .then(({ data }) => {
        const evs = (data ?? []) as EventRow[];
        setEvents(evs);
        setSel(evs.find((e) => e.aberto) ?? evs[0] ?? null);
      });
  }, [session?.user.id]);

  const link = sel ? eventLink(sel.slug) : "";

  return (
    <Shell>
      <div className="eyebrow">Página de resposta</div>
      <h1 className="mt-1 text-2xl">O link da turma</h1>
      <p className="mt-1 max-w-[56ch] text-sm" style={{ color: "var(--ink-soft)" }}>
        Cada evento tem o seu link público. A turma abre, responde sem login, vê o resultado completo e
        baixa o PDF. Você acompanha os números no <Link to="/painel">Dashboard</Link>.
      </p>

      {events.length === 0 ? (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          Crie um evento no <Link to="/painel">Dashboard</Link> para gerar o link.
        </p>
      ) : (
        <>
          <label className="mt-6 block max-w-sm text-sm">
            Evento
            <select
              className="field mt-1"
              value={sel?.id ?? ""}
              onChange={(e) => setSel(events.find((x) => x.id === e.target.value) ?? null)}
            >
              {events.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.titulo} {e.aberto ? "" : "(fechado)"}
                </option>
              ))}
            </select>
          </label>

          {sel && (
            <div className="mt-6 grid items-start gap-6 md:grid-cols-[200px_1fr]">
              <button
                type="button"
                className="mx-auto md:mx-0"
                title="Clique para abrir grande (apresentação)"
                onClick={() => setBigOpen(true)}
              >
                <QR text={link} size={200} />
              </button>
              <div>
                <div className="font-display text-lg font-bold">{sel.titulo}</div>
                <div className="text-sm" style={{ color: "var(--ink-soft)" }}>
                  {[sel.igreja, sel.cidade].filter(Boolean).join(" · ")}
                </div>
                <div
                  className="mono mt-3 flex items-center gap-2 rounded-lg border p-2 text-sm"
                  style={{ borderColor: "var(--line)" }}
                >
                  <span className="truncate">{link}</span>
                  <button
                    className="btn btn-sm shrink-0"
                    onClick={() => {
                      navigator.clipboard?.writeText(link);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 1800);
                    }}
                  >
                    {copied ? "copiado" : "copiar"}
                  </button>
                </div>
                <p className="mt-3 text-sm" style={{ color: sel.aberto ? "var(--good)" : "var(--bad)" }}>
                  {sel.aberto ? "● respostas abertas" : "● respostas encerradas — reabra na turma"}
                </p>
                <a href={link} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm mt-3">
                  Abrir a página como participante
                </a>
                <p className="mt-2 text-xs" style={{ color: "var(--ink-faint)" }}>
                  Clique no QR para abrir grande e projetar no telão.
                </p>
              </div>
            </div>
          )}
        </>
      )}
      {bigOpen && sel && <BigQR ev={sel} link={link} onClose={() => setBigOpen(false)} />}
    </Shell>
  );
}
