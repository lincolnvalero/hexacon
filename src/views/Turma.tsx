import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase, type EventRow, type ResponseRow } from "../lib/supabase";
import { Shell } from "../components/Shell";
import { FACTORS, SD, faixaLabel, type Factor } from "../lib/hexaco";
import { AggBar } from "../components/Faders";
import { eventLink } from "../lib/links";

const KEYS = ["h", "e", "x", "a", "c", "o"] as const;

function pearson(xs: number[], ys: number[]): number {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, dx = 0, dy = 0;
  for (let i = 0; i < n; i++) {
    const a = xs[i] - mx, b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den === 0 ? 0 : num / den;
}

export function Turma() {
  const { id = "" } = useParams();
  const [ev, setEv] = useState<EventRow | null>(null);
  const [rows, setRows] = useState<ResponseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [minFilter, setMinFilter] = useState<string>("");
  const [editingTitulo, setEditingTitulo] = useState(false);
  const [tituloDraft, setTituloDraft] = useState("");

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

  const link = ev ? eventLink(ev.slug) : "";

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

  const MIN_N_CORR = 4;
  const corr = useMemo(() => {
    if (filtered.length < MIN_N_CORR) return null;
    const cols = KEYS.map((k) => filtered.map((r) => Number(r[k])));
    return KEYS.map((_, i) => KEYS.map((_, j) => (i === j ? 1 : pearson(cols[i], cols[j]))));
  }, [filtered]);

  const pairs = useMemo(() => {
    if (!corr) return [];
    const out: { i: number; j: number; v: number }[] = [];
    for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) out.push({ i, j, v: corr[i][j] });
    return out;
  }, [corr]);
  const atrito = [...pairs].filter((p) => p.v < 0).sort((a, b) => a.v - b.v).slice(0, 2);
  const suporte = [...pairs].filter((p) => p.v > 0).sort((a, b) => b.v - a.v).slice(0, 2);

  async function salvarTitulo() {
    const novo = tituloDraft.trim();
    setEditingTitulo(false);
    if (!ev || !novo || novo === ev.titulo) return;
    await supabase.from("events").update({ titulo: novo }).eq("id", ev.id);
    load();
  }

  async function toggleAberto() {
    if (!ev) return;
    await supabase.from("events").update({ aberto: !ev.aberto }).eq("id", ev.id);
    load();
  }

  async function limparRespostas() {
    if (!ev || !rows.length) return;
    const ok = window.confirm(
      `Apagar as ${rows.length} respostas desta turma? Não dá para desfazer — os dados somem de vez.`,
    );
    if (!ok) return;
    await supabase.from("responses").delete().eq("event_id", ev.id);
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

      <div className="mt-2">
        <div>
          {editingTitulo ? (
            <input
              autoFocus
              className="field text-2xl font-bold"
              style={{ padding: "0.2rem 0.5rem" }}
              value={tituloDraft}
              onChange={(e) => setTituloDraft(e.target.value)}
              onBlur={salvarTitulo}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
                if (e.key === "Escape") setEditingTitulo(false);
              }}
            />
          ) : (
            <h1
              className="cursor-pointer rounded text-2xl transition-colors hover:bg-[var(--surface-2)]"
              title="Clique para renomear a turma"
              onClick={() => {
                setTituloDraft(ev.titulo);
                setEditingTitulo(true);
              }}
            >
              {ev.titulo} <span className="text-sm" style={{ color: "var(--ink-faint)" }}>✎</span>
            </h1>
          )}
          <div className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            {[ev.igreja, ev.cidade, ev.data_evento].filter(Boolean).join(" · ") || "—"}
          </div>
          <div className="mono mt-2 flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--ink-faint)" }}>
            <span>{rows.length} respostas</span>
            <a href={link} target="_blank" rel="noreferrer" style={{ color: "var(--focus)" }}>
              /e/{ev.slug}
            </a>
          </div>
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
        <button
          className="btn btn-ghost btn-sm"
          onClick={limparRespostas}
          disabled={!rows.length}
          style={{ color: "var(--bad)", borderColor: "var(--bad)" }}
        >
          Limpar respostas
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
          <h2 className="mt-8 text-lg">Média da turma nos seis fatores</h2>
          <div className="card mt-2 p-4">
            {stats.map((s) => (
              <AggBar key={s.f.k} k={s.f.k} name={s.f.name} cssVar={s.f.cssVar} mean={s.mean} spread={s.spread} />
            ))}
          </div>

          <h2 className="mt-6 text-lg">Distribuição</h2>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {stats.map((s) => {
              const tot = s.dist.abaixo + s.dist.meio + s.dist.acima || 1;
              return (
                <div key={s.f.k} className="card p-3" style={{ ["--cc" as string]: `var(${s.f.cssVar})` }}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="font-semibold">
                      {s.f.k} · {s.f.name}
                    </span>
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
                    <span>↓ {s.dist.abaixo}</span>
                    <span>meio {s.dist.meio}</span>
                    <span>{s.dist.acima} ↑</span>
                  </div>
                </div>
              );
            })}
          </div>

          <h2 className="mt-6 text-lg">Cruzamentos</h2>
          {!corr ? (
            <p className="mt-1 text-sm" style={{ color: "var(--ink-faint)" }}>
              Pedem pelo menos {MIN_N_CORR} respostas — há {filtered.length}.
            </p>
          ) : (
            <>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {atrito.map((p) => (
                  <PairChip key={`a${p.i}${p.j}`} kind="atrito" a={stats[p.i].f} b={stats[p.j].f} v={p.v} />
                ))}
                {suporte.map((p) => (
                  <PairChip key={`s${p.i}${p.j}`} kind="suporte" a={stats[p.i].f} b={stats[p.j].f} v={p.v} />
                ))}
                {atrito.length + suporte.length === 0 && (
                  <p className="text-sm" style={{ color: "var(--ink-faint)" }}>
                    Sem correlações relevantes nesta turma.
                  </p>
                )}
              </div>

              <div className="card mt-3 overflow-x-auto p-3">
                <table className="mono w-full text-center text-[0.7rem]" style={{ borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      <th />
                      {FACTORS.map((f) => (
                        <th key={f.k} className="pb-1 font-semibold" style={{ color: "var(--ink-faint)" }}>
                          {f.k}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FACTORS.map((fr, i) => (
                      <tr key={fr.k}>
                        <td className="pr-2 text-right font-semibold" style={{ color: "var(--ink-faint)" }}>
                          {fr.k}
                        </td>
                        {FACTORS.map((_, j) => {
                          const v = corr![i][j];
                          const diag = i === j;
                          const bg = diag
                            ? "transparent"
                            : v >= 0
                              ? `color-mix(in srgb, var(--good) ${Math.round(Math.abs(v) * 85)}%, var(--surface-2))`
                              : `color-mix(in srgb, var(--bad) ${Math.round(Math.abs(v) * 85)}%, var(--surface-2))`;
                          return (
                            <td key={j} className="p-1">
                              <div
                                className="grid h-8 w-8 place-items-center rounded"
                                style={{ background: bg, color: diag ? "var(--ink-faint)" : "var(--ink)" }}
                              >
                                {diag ? "·" : v.toFixed(2)}
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mono mt-2 flex items-center gap-3 text-[0.62rem]" style={{ color: "var(--ink-faint)" }}>
                  <span className="flex items-center gap-1">
                    <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--bad)" }} /> atrito
                  </span>
                  <span className="flex items-center gap-1">
                    <i className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "var(--good)" }} /> suporte
                  </span>
                  <span>n = {filtered.length}</span>
                </div>
              </div>
            </>
          )}

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

function PairChip({ kind, a, b, v }: { kind: "atrito" | "suporte"; a: Factor; b: Factor; v: number }) {
  const cc = kind === "atrito" ? "var(--bad)" : "var(--good)";
  return (
    <div className="card flex items-center gap-3 p-3" style={{ borderColor: cc }}>
      <span
        className="mono flex-none rounded px-1.5 py-0.5 text-[0.62rem] font-bold uppercase tracking-wide"
        style={{ background: cc, color: "var(--bg)" }}
      >
        {kind}
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-semibold">
        {a.k} · {a.name} ↔ {b.k} · {b.name}
      </span>
      <span className="mono flex-none text-sm font-bold" style={{ color: cc }}>
        {v >= 0 ? "+" : ""}
        {v.toFixed(2)}
      </span>
    </div>
  );
}
