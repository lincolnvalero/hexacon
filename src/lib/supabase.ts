import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  // Fail loudly in dev; in prod Vercel env vars must be set.
  console.error("Faltam VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY (.env)");
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export type EventRow = {
  id: string;
  owner: string;
  slug: string;
  titulo: string;
  igreja: string | null;
  cidade: string | null;
  data_evento: string | null;
  versao_default: 60 | 100 | 200;
  aberto: boolean;
  criado_em: string;
};

export type ResponseRow = {
  id: string;
  event_id: string;
  nome: string | null;
  ministerio: string | null;
  versao: 60 | 100 | 200;
  h: number;
  e: number;
  x: number;
  a: number;
  c: number;
  o: number;
  altruismo: number | null;
  itens: Record<string, number> | null;
  criado_em: string;
};
