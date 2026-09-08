import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth";
import { Login } from "./views/Login";
import { Responder } from "./views/Responder";
import { Dashboard } from "./views/Dashboard";
import { Turma } from "./views/Turma";
import { Slides } from "./views/Slides";
import { ResponderPicker } from "./views/ResponderPicker";

function Loading() {
  return (
    <div className="grid min-h-screen place-items-center">
      <span className="mono text-sm" style={{ color: "var(--ink-faint)" }}>
        carregando…
      </span>
    </div>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  const { session, loading } = useAuth();
  if (loading) return <Loading />;
  if (!session) return <Navigate to="/entrar" replace />;
  return children;
}

function Home() {
  const { session, loading } = useAuth();
  if (loading) return <Loading />;
  return <Navigate to={session ? "/painel" : "/entrar"} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/entrar" element={<Login />} />
        {/* participante — link público do evento, sem login e sem sidebar */}
        <Route path="/e/:slug" element={<Responder />} />
        {/* área do palestrante */}
        <Route path="/painel" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/turma/:id" element={<RequireAuth><Turma /></RequireAuth>} />
        <Route path="/apresentar" element={<RequireAuth><Slides /></RequireAuth>} />
        <Route path="/apresentar/:id" element={<RequireAuth><Slides /></RequireAuth>} />
        <Route path="/responder" element={<RequireAuth><ResponderPicker /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
