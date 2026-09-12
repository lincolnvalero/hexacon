/**
 * Monta a URL pública de um evento, respeitando o "base path" do deploy
 * (raiz em Netlify/Vercel, "/hexacon/" no build do GitHub Pages).
 * NUNCA use `window.location.origin` sozinho para isto — em subcaminho
 * (GitHub Pages) o link ficaria sem o "/hexacon" e daria 404.
 */
export function eventLink(slug: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, ""); // "" na raiz, "/hexacon" no Pages
  return `${window.location.origin}${base}/e/${slug}`;
}
