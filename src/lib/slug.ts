const alfabeto = "abcdefghjkmnpqrstuvwxyz23456789";

export function slugFrom(titulo: string): string {
  const base = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 28);
  let rand = "";
  for (let i = 0; i < 4; i++) rand += alfabeto[Math.floor(Math.random() * alfabeto.length)];
  return `${base || "evento"}-${rand}`;
}
