import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase, type EventRow } from "../lib/supabase";
import { useAuth } from "../lib/auth";
import { Shell } from "../components/Shell";
import { slugFrom } from "../lib/slug";
import { VERSOES, type Versao } from "../lib/hexaco";

export function Dashboard() {
  const { session } = useAuth();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    if (!session) {
      setLoading(false);
      return;
    }
    // filtra pelo dono explicitamente — a policy de leitura também libera eventos
    // abertos de OUTROS donos (para o participante), o que não deve aparecer aqui.
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("owner", session.user.id)
      .order("criado_em", { ascending: false });
    const evs = (data ?? []) as EventRow[];
    setEvents(evs);
    if (evs.length) {
      const { data: rc } = await supabase.from("responses").select("event_id").in("event_id", evs.map((e) => e.id));
      const c: Record<string, number> = {};
      (rc ?? []).forEach((r: { event_id: string }) => (c[r.event_id] = (c[r.event_id] ?? 0) + 1));
      setCounts(c);
    }
    setLoading(false);
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user.id]);

  return (
    <Shell>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow">Eventos</div>
          <h1 className="mt-1 text-2xl">Suas turmas</h1>
        </div>
        <button className="btn" onClick={() => setShowNew((s) => !s)}>
          {showNew ? "Fechar" : "Novo evento"}
        </button>
      </div>

      {showNew && session && (
        <EventForm
          owner={session.user.id}
          onDone={() => {
            setShowNew(false);
            load();
          }}
          onCancel={() => setShowNew(false)}
        />
      )}

      {loading ? (
        <p className="mt-6 text-sm" style={{ color: "var(--ink-faint)" }}>
          carregando…
        </p>
      ) : events.length === 0 ? (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          Nenhum evento ainda. Crie o primeiro para gerar o link da turma.
        </p>
      ) : (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {events.map((e) =>
            editingId === e.id ? (
              <EventForm
                key={e.id}
                owner={e.owner}
                eventId={e.id}
                initial={e}
                onDone={() => {
                  setEditingId(null);
                  load();
                }}
                onCancel={() => setEditingId(null)}
              />
            ) : (
              <Link
                key={e.id}
                to={`/turma/${e.id}`}
                className="card relative block p-4 transition-transform hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="font-display text-lg font-bold">{e.titulo}</div>
                  <div className="flex flex-none items-center gap-1.5">
                    <span
                      className="mono rounded px-1.5 py-0.5 text-[0.6rem] font-semibold"
                      style={{
                        background: e.aberto ? "color-mix(in srgb, var(--good) 18%, transparent)" : "var(--surface-2)",
                        color: e.aberto ? "var(--good)" : "var(--ink-faint)",
                      }}
                    >
                      {e.aberto ? "ABERTO" : "FECHADO"}
                    </span>
                    <button
                      type="button"
                      aria-label="Editar evento"
                      title="Editar evento"
                      className="grid h-6 w-6 place-items-center rounded"
                      style={{ color: "var(--ink-faint)" }}
                      onClick={(ev) => {
                        ev.preventDefault();
                        ev.stopPropagation();
                        setEditingId(e.id);
                      }}
                    >
                      ✎
                    </button>
                  </div>
                </div>
                <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
                  {[e.igreja, e.cidade, e.data_evento].filter(Boolean).join(" · ") || "sem detalhes"}
                </div>
                <div className="mono mt-3 text-[0.72rem]" style={{ color: "var(--ink-faint)" }}>
                  {counts[e.id] ?? 0} respostas · versão {e.versao_default}
                </div>
              </Link>
            ),
          )}
        </div>
      )}
    </Shell>
  );
}

function EventForm({
  owner,
  eventId,
  initial,
  onDone,
  onCancel,
}: {
  owner: string;
  eventId?: string;
  initial?: Partial<EventRow>;
  onDone: () => void;
  onCancel?: () => void;
}) {
  const [titulo, setTitulo] = useState(initial?.titulo ?? "");
  const [igreja, setIgreja] = useState(initial?.igreja ?? "");
  const [cidade, setCidade] = useState(initial?.cidade ?? "");
  const [data, setData] = useState(initial?.data_evento ?? "");
  const [versao, setVersao] = useState<Versao>((initial?.versao_default as Versao) ?? 60);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const payload = {
      titulo: titulo.trim(),
      igreja: igreja.trim() || null,
      cidade: cidade.trim() || null,
      data_evento: data || null,
      versao_default: versao,
    };
    const { error } = eventId
      ? await supabase.from("events").update(payload).eq("id", eventId)
      : await supabase.from("events").insert({ ...payload, owner, slug: slugFrom(igreja || titulo), aberto: true });
    setBusy(false);
    if (error) setErr(error.message);
    else onDone();
  }

  return (
    <form onSubmit={submit} className="card mt-4 grid gap-3 p-4 sm:grid-cols-2">
      <label className="text-sm sm:col-span-2">
        Título da turma
        <input className="field mt-1" required placeholder="Ex.: Líderes e ministérios" value={titulo} onChange={(e) => setTitulo(e.target.value)} />
      </label>
      <label className="text-sm">
        Igreja
        <input className="field mt-1" placeholder="Ex.: IBAB Central" value={igreja} onChange={(e) => setIgreja(e.target.value)} />
      </label>
      <label className="text-sm">
        Cidade
        <input className="field mt-1" placeholder="Ex.: Belo Horizonte" value={cidade} onChange={(e) => setCidade(e.target.value)} />
      </label>
      <label className="text-sm">
        Data
        <input type="date" className="field mt-1" value={data} onChange={(e) => setData(e.target.value)} />
      </label>
      <label className="text-sm">
        Versão sugerida no link
        <select className="field mt-1" value={versao} onChange={(e) => setVersao(Number(e.target.value) as Versao)}>
          {Object.values(VERSOES).map((v) => (
            <option key={v.n} value={v.n}>
              {v.n} itens · ~{v.min} min ({v.label})
            </option>
          ))}
        </select>
      </label>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button className="btn" disabled={busy}>
          {busy ? "salvando…" : eventId ? "Salvar" : "Criar evento"}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={busy}>
            Cancelar
          </button>
        )}
        {err && (
          <span className="text-sm" style={{ color: "var(--bad)" }}>
            {err}
          </span>
        )}
      </div>
    </form>
  );
}
