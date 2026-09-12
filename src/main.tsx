import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

// tema salvo
try {
  const t = localStorage.getItem("hexacon_theme");
  if (t) document.documentElement.setAttribute("data-theme", t);
} catch {
  /* ignore */
}

// BASE_URL vem do "base" configurado no Vite (raiz normalmente; "/hexacon/" no build do GitHub Pages)
const basename = import.meta.env.BASE_URL.replace(/\/$/, "");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
