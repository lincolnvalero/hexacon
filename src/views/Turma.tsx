import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase, type EventRow, type ResponseRow } from "../lib/supabase";
import { Shell } from "../components/Shell";
import { FACTORS, SD, faixaLabel } from "../lib/hexaco";
import { AggBar } from "../components/Faders";
import { QR } from "../components/QR";

const KEYS = ["h", "e", "x", "a", "c", "o"] as const;

export function Turma() {
  const { id = "" } = useParams();
  const [ev, setEv] = useState<EventRow | null>(null);
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [minFilter, setMinFilter] = useState<string>("");

  async function load() {
    setLoading(true);
    const [{ data: e }, { data: r }] = await Promise.all([
      supabase.from("events").select("*").eq("id", id).maybeSingle(),
      supabase.from("responses").select("*").eq("event_id", id).order("criado_em", { ascending: false }),
    ]);
    setEv((e as EventRow) ?? null);
    setRows((r ?? []) as ResponseRow[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, [id]);

  const link = ev ? `${window.location.origin}/e/${ev.slug}` : "";

  const ministerios = useMemo(() => {
    const s = new Set<string>();
    rows.forEach((r) => r.ministerio && s.add(r.ministerio));
    return [...s].sort();
  }, [rows]);

  const filtered = minFilter ? rows.filter((r) => r.ministerio === minFilter) : rows;

  const stats = useMemo(() => {
    if (!filtered.length) return null;
    return KEYS.map((k, i) => {
      const vals = filtered.map((r) => Number(r[k]));
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length;
      const spread = Math.sqrt(variance);
      const z = (mean - FACTORS[i].anchor) / SD;
      const dist = { abaixo: 0, meio: 0, acima: 0 };
      vals.forEach((v) => {
        const zz = (v - FACTORS[i].anchor) / SD;
        if (zz <= -0.5) dist.abaixo++;
        else if (zz < 0.5) dist.meio++;
        else dist.acima++;
      });
      return { f: FACTORS[i], mean, spread, z, dist };
    });
  }, [filtered]);

  const choques = useMemo(() => {
    if (!stats) return [];
    return [...stats].sort((a, b) => b.spread - a.spread).slice(0, 2);
  }, [stats]);

  async function toggleAberto() {
    if (!ev) return;
    await supabase.from("events").update({ aberto: !ev.aberto }).eq("id", ev.id);
    load();
  }

  function exportCSV() {
    const head = "criado_em,nome,ministerio,versao,h,e,x,a,c,o,altruismo";
    const lines = rows.map((r) =>
      [r.criado_em, r.nome ?? "", r.ministerio ?? "", r.versao, r.h, r.e, r.x, r.a, r.c, r.o, r.altruismo ?? ""]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[head, ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `hexacon-${ev?.slug ?? "turma"}.csv`;
    a.click();
  }

  if (loading)
    return (
      <Shell>
        <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
          carregando…
        </p>
      </Shell>
    );
  if (!ev)
    return (
      <Shell>
        <p>
          Evento não encontrado. <Link to="/painel">Voltar</Link>
        </p>
      </Shell>
    );

  return (
    <Shell>
      <Link to="/painel" className="text-sm">
        ‹ todas as turmas
      </Link>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl">{ev.titulo}</h1>
          <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            {[ev.igreja, ev.cidade, ev.data_evento].filter(Boolean).join(" · ") || "—"}
          </div>
          <div className="mono mt-2 text-sm" style={{ color: "var(--ink-faint)" }}>
            {rows.length} respostas
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <QR text={link} size={140} />
          <a href={link} target="_blank" rel="noreferrer" className="mono text-[0.7rem]">
            /e/{ev.slug}
          </a>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button className="btn btn-ghost btn-sm" onClick={toggleAberto}>
          {ev.aberto ? "Encerrar respostas" : "Reabrir respostas"}
        </button>
        <Link to={`/apresentar/${ev.id}`} className="btn btn-ghost btn-sm">
          Apresentar slides
        </Link>
        <button className="btn btn-ghost btn-sm" onClick={exportCSV} disabled={!rows.length}>
          Exportar CSV
        </button>
        <button className="btn btn-ghost btn-sm" onClick={load}>
          Atualizar
        </button>
      </div>

      {ministerios.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: "var(--ink-faint)" }}>
            recorte:
          </span>
          <button
            className="rounded-full border px-2.5 py-0.5 text-xs"
            style={{ borderColor: minFilter ? "var(--line)" : "var(--brand)", color: minFilter ? "var(--ink-soft)" : "var(--ink)" }}
            onClick={() => setMinFilter("")}
          >
            toda a turma
          </button>
          {ministerios.map((m) => (
            <button
              key={m}
              className="rounded-full border px-2.5 py-0.5 text-xs"
              style={{ borderColor: minFilter === m ? "var(--brand)" : "var(--line)", color: minFilter === m ? "var(--ink)" : "var(--ink-soft)" }}
              onClick={() => setMinFilter(m)}
            >
              {m}
            </button>
          ))}
        </div>
      )}

      {!stats ? (
        <p className="mt-8 text-sm" style={{ color: "var(--ink-soft)" }}>
          Sem respostas ainda{minFilter ? " neste recorte" : ""}. Mostre o QR para a turma.
        </p>
      ) : (
        <>
          <h2 className="mt-8 text-lg">Média da turma nos seis controles</h2>
          <div className="card mt-2 p-4">
            {stats.map((s) => (
              <AggBar key={s.f.k} label={s.f.appliance} ic={s.f.ic} cssVar={s.f.cssVar} mean={s.mean} spread={s.spread} />
            ))}
          </div>

          <h2 className="mt-6 text-lg">Distribuição</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {stats.map((s) => {
              const tot = s.dist.abaixo + s.dist.meio + s.dist.acima || 1;
              return (
                <div key={s.f.k} className="card p-3" style={{ ["--cc" as string]: `var(${s.f.cssVar})` }}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">{s.f.appliance}</span>
                    <span className="mono text-[0.7rem]" style={{ color: "var(--ink-faint)" }}>
                      {faixaLabel(s.z)}
                    </span>
                  </div>
                  <div className="flex h-3 overflow-hidden rounded" style={{ background: "var(--surface-3)" }}>
                    <div style={{ width: `${(s.dist.abaixo / tot) * 100}%`, background: "var(--ink-faint)" }} />
                    <div style={{ width: `${(s.dist.meio / tot) * 100}%`, background: "color-mix(in srgb, var(--cc) 40%, transparent)" }} />
                    <div style={{ width: `${(s.dist.acima / tot) * 100}%`, background: "var(--cc)" }} />
                  </div>
                  <div className="mono mt-1 flex justify-between text-[0.62rem]" style={{ color: "var(--ink-faint)" }}>
                    <span>↓ {s.dist.abaixo} ({s.f.lo})</span>
                    <span>meio {s.dist.meio}</span>
                    <span>{s.dist.acima} ↑ ({s.f.hi})</span>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mt-6 text-lg">Onde a turma mais se choca</h2>
          <p className="text-sm" style={{ color: "var(--ink-soft)" }}>
            Os dois controles com maior dispersão — ganchos prontos para comentar no dia.
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            {choques.map((s) => (
              <div key={s.f.k} className="card p-4" style={{ ["--cc" as string]: `var(${s.f.cssVar})` }}>
                <div className="font-display font-bold" style={{ color: "var(--cc)" }}>
                  {s.f.appliance} — {s.f.name}
                </div>
                <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
                  Nesta turma há quem regule no <b>{s.f.lo}</b> e quem regule no <b>{s.f.hi}</b>. Choque
                  típico: {s.f.k === "C" || s.f.k === "O" ? "cronograma × ideia de última hora" : s.f.k === "E" ? "quem mergulha na dor × quem mantém a cabeça fria" : "quem ocupa o espaço × quem cede demais"}.
                </p>
              </div>
            ))}
          </div>

          {stats.length > 0 && rows.some((r) => r.altruismo != null) && (
            <p className="mono mt-6 text-sm" style={{ color: "var(--ink-faint)" }}>
              Altruísmo médio (quem respondeu 100/200):{" "}
              {(
                rows.filter((r) => r.altruismo != null).reduce((a, r) => a + Number(r.altruismo), 0) /
                rows.filter((r) => r.altruismo != null).length
              ).toFixed(2)}
              /5
            </p>
          )}
        </>
      )}

      <p className="mt-10 border-t pt-4 text-xs" style={{ borderColor: "var(--line-soft)", color: "var(--ink-faint)" }}>
        Só você (dono do evento) vê estas respostas. Triagem própria sobre a estrutura oficial do
        HEXACO; médias normativas aproximadas.
      </p>
    </Shell>
  );
}
