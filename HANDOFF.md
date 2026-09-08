# HANDOFF — Hexacon

## Estado (2026-09-08)
App **completo e testado localmente**. Falta só o deploy (feito pelo Lincoln na Vercel).

- Repo: `hexacon/` (git iniciado, 1 commit). `npm run build` passa.
- Supabase: projeto **hexacon** `putnnvvsxrulzipebacf` (sa-east-1). Migrações 0001 e 0002 aplicadas.
- RLS validada por REST com a anon key (evento aberto/fechado, insert de resposta, leitura restrita).
- Fluxo do participante testado no navegador de ponta a ponta (intro → 60 perguntas → resultado → insert no banco OK).

## Falta fazer
1. **Deploy Vercel** (Lincoln): `vercel link` (time lincoln-s-acme) → `vercel --prod`.
   Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (valores no `.env.example` / README).
2. **Supabase Auth** (Lincoln, painel): Authentication → URL Configuration → Site URL = URL da Vercel;
   Redirect URLs += `<url>/painel` e `http://localhost:5173/painel`.
3. Primeiro login (magic link em lincolnvalero@hotmail.com) → criar um evento → testar QR na turma.

## Possíveis próximos passos
- Trocar itens por IPIP-HEXACO (domínio público) — estrutura de dados já comporta (`src/lib/hexaco.ts`).
- Code-splitting do bundle (490 kB; Supabase+qrcode pesam).
- Slides: variar mais os layouts; opção de exportar o deck em PDF.
- Dashboard: linha do tempo de respostas, comparar turmas.

## Arquivos-chave
- `src/lib/hexaco.ts` — fatores, banco de itens (60/100/200), pontuação.
- `src/lib/supabase.ts` + `src/lib/auth.tsx` — cliente e sessão.
- `src/views/Responder.tsx` + `src/components/ResultView.tsx` — participante.
- `src/views/{Dashboard,Turma,ResponderPicker,Slides}.tsx` — área do palestrante.
- `supabase/migrations/` — schema + RLS.
