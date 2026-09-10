# Hexacon

**No ar:** https://hexacon-app.netlify.app

Sistema da palestra **Hexacon** — a metodologia HEXACO aplicada a comunicação e
relações, na forma de "seis controles num celular".

Três áreas, num sidebar (área do palestrante, com login):

| Menu | Rota | O que é |
|---|---|---|
| **Dashboard** | `/painel`, `/turma/:id` | cadastra eventos e mostra as estatísticas de cada turma |
| **Página de resposta** | `/responder` | pega o link/QR público de cada evento |
| **Slides** | `/apresentar/:id?` | o deck da palestra (setas do teclado, `⛶` tela cheia) |

O **participante** abre o link público do evento (`/e/:slug`) — **sem login** —
responde, vê o resultado completo (seis faders + luz e sombra + guia de comunicação)
e baixa o PDF (botão → diálogo de impressão do navegador → "Salvar como PDF").

## Stack

- **Front:** Vite + React + TypeScript + Tailwind. SPA estática.
- **Back:** Supabase (Postgres + PostgREST + RLS). O navegador fala direto com o
  Supabase pela *anon key* — o acesso é todo controlado por RLS.
- **Deploy:** Netlify (estático). `netlify.toml` + `public/_redirects` fazem o rewrite de SPA.
- Sem servidor próprio. Free tier em tudo.

## Rodar local

```bash
npm install
cp .env.example .env       # as chaves já vêm preenchidas (projeto "hexacon")
npm run dev
```

## Banco de dados (Supabase)

Projeto: **hexacon** (`putnnvvsxrulzipebacf`, região `sa-east-1`).
As migrações estão em `supabase/migrations/` e **já foram aplicadas**:

- `0001_init.sql` — tabelas `profiles`, `events`, `responses` + RLS + trigger de perfil.
- `0002_tighten_security_definer.sql` — endurece as funções.

### Regras de acesso (RLS) — resumo

- `events`: o participante (anon) só enxerga eventos **abertos** pelo `slug`; o dono
  vê todos os seus e é o único que cria/edita/fecha.
- `responses`: **qualquer pessoa** insere uma resposta, **só** se o evento estiver
  aberto. **Só o dono do evento lê** as respostas. O participante nunca lê respostas
  — nem a própria (o resultado é calculado no navegador).

Testado por REST com a anon key: leitura de evento aberto ✓, evento fechado invisível ✓,
insert em evento aberto ✓, insert em evento fechado bloqueado (401) ✓, leitura de
respostas pelo anon retorna vazio ✓.

## Configurar o Auth (uma vez, no painel do Supabase)

O login do palestrante é **magic link**. No painel do projeto → **Authentication →
URL Configuration**:

1. **Site URL:** a URL de produção da Netlify (ex.: `https://hexacon.netlify.app`).
2. **Redirect URLs:** adicione `https://SEU-DOMINIO/painel` e `http://localhost:5173/painel`.

(Email padrão do Supabase serve para começar; para volume, plugar um SMTP.)

## Deploy na Netlify

`netlify.toml` já traz o build (`npm run build` → `dist`) e o rewrite de SPA
(`public/_redirects` também, como reforço).

**Opção A — CLI:**

```bash
npm i -g netlify-cli      # se ainda não tiver
netlify login
netlify init              # cria/liga o site (ou: netlify link)
netlify env:set VITE_SUPABASE_URL https://putnnvvsxrulzipebacf.supabase.co
netlify env:set VITE_SUPABASE_ANON_KEY sb_publishable_0KfQfI9EYGtKbaxS2YswJw_fBbBNTKa
netlify deploy --build --prod
```

**Opção B — Git:** conecte o repositório no painel da Netlify. Build command
`npm run build`, publish directory `dist`. Adicione as duas variáveis em
**Site settings → Environment variables**:

| Nome | Valor |
|---|---|
| `VITE_SUPABASE_URL` | `https://putnnvvsxrulzipebacf.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_0KfQfI9EYGtKbaxS2YswJw_fBbBNTKa` |

Depois do primeiro deploy, volte ao Supabase e ponha a URL da Netlify em Site URL /
Redirect URLs (passo acima).

## Sobre os itens do teste

Os itens (`src/lib/hexaco.ts`) são de **redação própria**, montados sobre a
**estrutura oficial do HEXACO**: 6 fatores × 4 facetas + a escala interpessoal
Altruísmo, escala Likert 1–5, chave de reversão padrão (item reverso pontua `6 − x`),
faceta → fator pela média.

**Não são o HEXACO-PI-R** (Lee & Ashton). O inventário oficial só pode ser usado em
pesquisa acadêmica sem fins lucrativos e é proibido em app público (hexaco.org). Para
um instrumento externamente validado e livre, o caminho é integrar os itens de
domínio público do **IPIP-HEXACO** (ipip.ori.org) — a estrutura de dados aqui já
comporta a troca.

Versões: **60** (~10 min, sem Altruísmo) · **100** (~20 min, +Altruísmo) ·
**200** (~30 min, +Altruísmo). As faixas "abaixo / meio-termo / acima" usam médias
normativas aproximadas do HEXACO-PI-R como âncora (desvio ~0,6).

## LGPD / privacidade

- Nome e ministério do participante são **opcionais**; a tela avisa que ficam
  visíveis para o palestrante no painel da turma.
- Nada é lido de volta pelo participante. Só o dono do evento vê as respostas.
- As respostas cruas (jsonb 1–5) são guardadas para permitir reprocessar os itens
  depois — sem PII adicional.
