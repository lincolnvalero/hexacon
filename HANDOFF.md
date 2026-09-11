# HANDOFF — Hexacon

## Estado (2026-09-11) — NO AR, falta 1 toggle no Supabase
**https://hexacon-app.netlify.app** — deployado (Netlify MCP), banco pronto e testado.

- Login trocado de **magic link para e-mail + senha** (uma tela, sem ida ao e-mail).
  `src/views/Login.tsx`. Commit `10e4923`.
- Motivo da troca: o magic link caía numa conta sem redirect configurado (Site URL ainda
  `localhost:3000`) **e** o Supabase free tier tem limite baixo de e-mails de auth — o
  primeiro login de cada pessoa vira e-mail de "confirme seu cadastro", não "link de login",
  e trava fácil. E-mail+senha elimina o problema por completo.
- Apaguei a conta zumbi criada pelo magic link antes da troca (`lincolnvalero@hotmail.com`,
  sem senha, 0 eventos/respostas) para o Lincoln recriar limpo pelo botão "Criar conta".

## Falta 1 coisa (Lincoln, no painel do Supabase)
**Authentication → Providers → Email → desmarcar "Confirm email"** (salvar). Sem isso, toda
conta nova ainda tenta mandar e-mail de confirmação (rate-limited, sem necessidade num app
interno de 1 usuário). Depois disso:

1. Abrir `https://hexacon-app.netlify.app/entrar`
2. "Primeira vez? Criar conta" → e-mail + senha → entra direto no Dashboard (sem e-mail nenhum)
3. Criar o primeiro evento → pegar o QR/link em "Página de resposta" → testar com alguém

Opcional: **Netlify → Project configuration → General → "Powered by Netlify badge" → off**
(pedido do Lincoln; não há tool no conector para isso, é só no painel).

## Por que a arquitetura está correta
O que foi pedido: login → gestão da palestra + respostas dos testes + link diferente por
evento + slides. Isso está tudo construído e testado:
- `/painel` — Dashboard: lista eventos, cria evento, stats por turma
- `/turma/:id` — média dos 6 controles, distribuição, recorte por ministério, CSV
- `/responder` — link/QR por evento (cada evento tem `slug` próprio)
- `/apresentar/:id` — slides, com o QR do evento no fim
- `/e/:slug` — participante, sem login, resultado completo + PDF
RLS testada por REST (evento aberto/fechado, insert anônimo, leitura restrita ao dono).
O que travou foi só o e-mail de autenticação — não a estrutura.

## NotebookLM MCP
Conectado (ferramentas disponíveis via `mcp__notebooklm__*`), mas `get_health` →
`authenticated: false` — login Google nunca completou. Pendente, independente do Hexacon.

## Próximos passos possíveis
- Trocar itens por IPIP-HEXACO (domínio público) — estrutura já comporta (`src/lib/hexaco.ts`).
- Code-splitting do bundle (~490 kB).
- Slides: variar layouts; exportar deck em PDF.
- Renomear o site Netlify (`hexacon-app` → algo mais definitivo) e/ou domínio próprio.

## Arquivos-chave
- `src/lib/hexaco.ts` — fatores, banco de itens (60/100/200), pontuação.
- `src/lib/supabase.ts` + `src/lib/auth.tsx` — cliente e sessão.
- `src/views/Login.tsx` — e-mail + senha.
- `src/views/Responder.tsx` + `src/components/ResultView.tsx` — participante.
- `src/views/{Dashboard,Turma,ResponderPicker,Slides}.tsx` — área do palestrante.
- `supabase/migrations/` — schema + RLS.
- `netlify.toml`, `public/_redirects` — deploy.
