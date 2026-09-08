export function ThemeToggle() {
  function toggle() {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "dark" ? "light" : cur === "light" ? "dark" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("hexacon_theme", next);
    } catch {
      /* ignore */
    }
  }
  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      title="Tema"
      className="grid h-9 w-9 place-items-center rounded-lg border"
      style={{ borderColor: "var(--line)", color: "var(--ink-soft)" }}
    >
      ◐
    </button>
  );
}
