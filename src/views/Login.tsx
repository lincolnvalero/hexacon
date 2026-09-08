import { useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export function Login() {
  const { session, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/painel" replace />;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: `${window.location.origin}/painel` },
    });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight">Hexacon</span>
          <ThemeToggle />
        </div>
        <div className="card p-6">
          <h1 className="text-xl">Área do palestrante</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            Você recebe um link de acesso por e-mail. Sem senha.
          </p>
          {sent ? (
            <p className="mt-4 rounded-lg p-3 text-sm" style={{ background: "var(--surface-2)", color: "var(--ink-soft)" }}>
              Link enviado para <b>{email}</b>. Abra no mesmo dispositivo.
            </p>
          ) : (
            <form onSubmit={send} className="mt-4 flex flex-col gap-3">
              <input
                type="email"
                required
                className="field"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              <button className="btn" disabled={busy}>
                {busy ? "enviando…" : "Enviar link de acesso"}
              </button>
              {err && (
                <span className="text-sm" style={{ color: "var(--bad)" }}>
                  {err}
                </span>
              )}
            </form>
          )}
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: "var(--ink-faint)" }}>
          Participante não faz login — use o link do evento.
        </p>
      </div>
    </div>
  );
}
