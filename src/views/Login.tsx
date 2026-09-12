import { useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { Navigate } from "react-router-dom";
import { ThemeToggle } from "../components/ThemeToggle";

export function Login() {
  const { session, loading } = useAuth();
  const [mode, setMode] = useState<"entrar" | "criar">("entrar");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/painel" replace />;

  function traduzErro(m: string): string {
    if (/invalid login credentials/i.test(m)) return "E-mail ou senha incorretos.";
    if (/email not confirmed/i.test(m)) return "E-mail ainda não confirmado — confira sua caixa de entrada.";
    if (/user already registered/i.test(m)) return "Essa conta já existe. Use “Entrar”.";
    if (/password should be at least/i.test(m)) return "A senha precisa ter pelo menos 6 caracteres.";
    return m;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    setInfo("");

    if (mode === "criar") {
      const { data, error } = await supabase.auth.signUp({ email: email.trim(), password: senha });
      setBusy(false);
      if (error) return setErr(traduzErro(error.message));
      if (data.session) return; // logado — AuthProvider redireciona
      setInfo("Conta criada. Se pedir confirmação por e-mail, confirme e depois volte para Entrar.");
      setMode("entrar");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
    setBusy(false);
    if (error) setErr(traduzErro(error.message));
  }

  return (
    <div className="grid min-h-screen place-items-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex items-center justify-between">
          <span className="font-display text-lg font-extrabold tracking-tight">Hexaco</span>
          <ThemeToggle />
        </div>
        <div className="card p-6">
          <h1 className="text-xl">Área do palestrante</h1>
          <p className="mt-1 text-sm" style={{ color: "var(--ink-soft)" }}>
            {mode === "entrar" ? "Entre com e-mail e senha." : "Crie a sua conta de palestrante."}
          </p>

          <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
            <input
              type="email"
              required
              className="field"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <input
              type="password"
              required
              minLength={6}
              className="field"
              placeholder="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete={mode === "entrar" ? "current-password" : "new-password"}
            />
            <button className="btn" disabled={busy}>
              {busy ? "…" : mode === "entrar" ? "Entrar" : "Criar conta"}
            </button>
            {err && (
              <span className="text-sm" style={{ color: "var(--bad)" }}>
                {err}
              </span>
            )}
            {info && (
              <span className="text-sm" style={{ color: "var(--good)" }}>
                {info}
              </span>
            )}
          </form>

          <button
            type="button"
            className="mt-3 text-sm"
            style={{ color: "var(--focus)" }}
            onClick={() => {
              setMode((m) => (m === "entrar" ? "criar" : "entrar"));
              setErr("");
              setInfo("");
            }}
          >
            {mode === "entrar" ? "Primeira vez? Criar conta" : "Já tenho conta — Entrar"}
          </button>
        </div>
        <p className="mt-4 text-center text-xs" style={{ color: "var(--ink-faint)" }}>
          Participante não faz login — use o link do evento.
        </p>
      </div>
    </div>
  );
}
