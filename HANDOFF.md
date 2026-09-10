# HANDOFF — Hexacon

## Estado (2026-09-10) — NO AR
**Deployado e funcionando:** https://hexacon-app.netlify.app

- Repo: `hexacon/` (git). `npm run build` passa.
- Netlify: site `hexacon-app` (id `42373385-db2a-493e-84c2-8bb5028e7f79`, team `lincolnvalero`/Intelligence360,
  conta Netlify `lincoln.valero1@gmail.com`). Deploy feito pelo conector Netlify MCP. Env vars
  `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` configuradas no site. `netlify.toml` + `public/_redirects`.
- Supabase: projeto **hexacon** `putnnvvsxrulzipebacf` (org `hugiaemznmubwxrtpjsq`, sa-east-1).
  Migrações 0001/0002 aplicadas, RLS validada. Conexão testada da produção (query anon OK).
- **Não usar o conector MCP do Supabase** — Lincoln opera direto no painel dele.

## Falta fazer (Lincoln — no painel do Supabase, aberto no Chrome)
**Supabase Auth** (projeto hexacon → Authentication → URL Configuration):
- **Site URL:** `https://hexacon-app.netlify.app`
- **Redirect URLs:** adicionar `https://hexacon-app.netlify.app/**` e `http://localhost:5173/**`

Sem isso o magic link não redireciona para `/painel` no domínio de produção.

Depois: abrir o magic link no e-mail → criar um evento no Dashboard → testar o QR com a turma.

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
