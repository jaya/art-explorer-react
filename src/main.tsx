import "@/styles/globals.css"; // Substituindo o antigo index.css
import { QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { queryClient } from "./lib/reactQuery";
import { initializeTheme } from "./stores/themeStore";

// Inicializa o tema baseado na preferência salva
try {
  initializeTheme();
} catch (error) {
  console.error("Failed to initialize theme:", error);
  // Mesmo que initializeTheme falhe (ex: localStorage inacessível no SSR ou em um ambiente restrito),
  // o store Zustand tentará aplicar o tema padrão (baseado em prefers-color-scheme)
  // quando for usado pela primeira vez. O importante é não deixar essa falha quebrar o app.
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  document.body.innerHTML = `
    <div style="color: red; font-family: sans-serif; padding: 20px; text-align: center;">
      <h1>Erro Crítico</h1>
      <p>O elemento raiz (root) não foi encontrado no HTML.</p>
      <p>Verifique se o arquivo <code>index.html</code> contém <code>&lt;div id="root"&gt;&lt;/div&gt;</code>.</p>
      <p>A aplicação não pode ser iniciada.</p>
    </div>
  `;
  throw new Error(
    'Failed to find the root element. Ensure your index.html has <div id="root"></div>.'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>
);
