import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import { Shell } from "../components/Shell";
import { QR } from "../components/QR";

/** Área do palestrante: a "Página de resposta" — escolher um evento e
 *  pegar o link/QR que a turma usa. */
export function ResponderPicker() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [sel, setSel] = useState<EventRow | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .order("criado_em", { ascending: false })
      .then(({ data }) => {
        const evs = (data ?? []) as EventRow[];
        setEvents(evs);
        setSel(evs.find((e) => e.aberto) ?? evs[0] ?? null);
      });
  }, []);

  const link = sel ? `${window.location.origin}/e/${sel.slug}` : "";

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
              <div className="mx-auto md:mx-0">
                <QR text={link} size={200} />
              </div>
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
              </div>
            </div>
          )}
        </>
      )}
    </Shell>
  );
}
