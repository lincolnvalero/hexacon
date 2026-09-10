# HANDOFF — Hexacon

## Estado (2026-09-10)
App **completo e testado localmente**. Falta só o deploy.

- Repo: `hexacon/` (git, 3 commits). `npm run build` passa.
- Supabase: projeto **hexacon** `putnnvvsxrulzipebacf` (org `hugiaemznmubwxrtpjsq`, sa-east-1).
  Migrações 0001 e 0002 aplicadas. RLS validada por REST.
- Fluxo do participante testado no navegador ponta a ponta (intro → 60 perguntas → resultado → insert OK).
- **Deploy é NETLIFY** (não Vercel). `netlify.toml` + `public/_redirects` já configurados.
- **Não usar o conector MCP do Supabase** — o Lincoln pediu para operar direto no painel dele
  (org `hugiaemznmubwxrtpjsq`, aberto no Chrome). A parte de banco já está pronta, então não
  há mais nada a fazer no Supabase via ferramenta — só a config de Auth (abaixo), que é no painel.

## Falta fazer (Lincoln)
1. **Deploy Netlify** — CLI (`netlify login` → `netlify init` → `netlify env:set ...` → `netlify deploy --build --prod`)
   ou conectar o repo no painel (build `npm run build`, publish `dist`).
   Env vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (valores no README / `.env.example`).
2. **Supabase Auth** (painel, org `hugiaemznmubwxrtpjsq` → projeto hexacon → Authentication → URL Configuration):
   Site URL = URL da Netlify; Redirect URLs += `<url>/painel` e `http://localhost:5173/painel`.
3. Primeiro login (magic link em lincolnvalero@hotmail.com) → criar evento → testar QR na turma.

## NotebookLM MCP
Conectado nesta máquina, mas `get_health` → `authenticated: false` (login Google nunca completou).
Pendente e independente do Hexacon. Rodar `setup_auth` de novo quando for mexer nas melhorias.

## Possíveis próximos passos
- Trocar itens por IPIP-HEXACO (domínio público) — estrutura já comporta (`src/lib/hexaco.ts`).
- Code-splitting do bundle (490 kB).
- Slides: variar layouts; exportar deck em PDF.
- Dashboard: linha do tempo de respostas, comparar turmas.

## Arquivos-chave
- `src/lib/hexaco.ts` — fatores, banco de itens (60/100/200), pontuação.
- `src/lib/supabase.ts` + `src/lib/auth.tsx` — cliente e sessão.
- `src/views/Responder.tsx` + `src/components/ResultView.tsx` — participante.
- `src/views/{Dashboard,Turma,ResponderPicker,Slides}.tsx` — área do palestrante.
- `supabase/migrations/` — schema + RLS.
- `netlify.toml`, `public/_redirects` — deploy.
