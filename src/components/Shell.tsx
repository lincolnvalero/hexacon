import { type ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ThemeToggle } from "./ThemeToggle";

const dots = [0, 1, 2, 3, 4, 5];

/** Casca do palestrante: sidebar com os três menus. */
export function Shell({ children }: { children: ReactNode }) {
  const nav = useNavigate();
  const linkCls = ({ isActive }: { isActive: boolean }) =>
    "block rounded-lg px-3 py-2 text-sm font-medium transition-colors " + (isActive ? "text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]");
  const linkStyle = ({ isActive }: { isActive: boolean }) =>
    isActive ? { background: "var(--surface)", border: "1px solid var(--line)" } : { border: "1px solid transparent" };

  return (
    <div className="mx-auto flex min-h-screen max-w-[1200px] flex-col md:flex-row">
      <aside
        className="flex flex-col gap-1 border-b p-3 md:w-56 md:border-b-0 md:border-r"
        style={{ borderColor: "var(--line-soft)" }}
      >
        <div className="mb-3 flex items-center gap-2 px-1">
          <span className="grid grid-cols-3 gap-[2px]" aria-hidden="true">
            {dots.map((i) => (
              <span
                key={i}
                className="h-1 w-1 rounded-[1px]"
                style={{ background: [0, 3].includes(i) ? "var(--brand)" : i === 1 ? "var(--ac-h)" : i === 2 ? "var(--ac-x)" : "var(--ac-a)" }}
              />
            ))}
          </span>
          <span className="font-display text-[1.05rem] font-extrabold tracking-tight">Hexacon</span>
          <span className="ml-auto md:hidden">
            <ThemeToggle />
          </span>
        </div>
        <NavLink to="/painel" className={linkCls} style={linkStyle}>
          Dashboard
        </NavLink>
        <NavLink to="/responder" className={linkCls} style={linkStyle}>
          Página de resposta
        </NavLink>
        <NavLink to="/apresentar" className={linkCls} style={linkStyle}>
          Slides
        </NavLink>
        <div className="mt-auto hidden flex-col gap-2 pt-4 md:flex">
          <ThemeToggle />
          <button
            className="rounded-lg border px-3 py-2 text-left text-sm"
            style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
            onClick={async () => {
              await supabase.auth.signOut();
              nav("/entrar");
            }}
          >
            Sair
          </button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
