import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// Verifica se a preferência do sistema é para tema escuro
const getDefaultTheme = () => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  return false;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: getDefaultTheme(),
      toggleTheme: () =>
        set((state) => {
          const newIsDarkMode = !state.isDarkMode;

          // Aplica a classe 'dark' no HTML para o tema escuro
          if (typeof window !== "undefined") {
            document.documentElement.classList.toggle("dark", newIsDarkMode);
          }

          return { isDarkMode: newIsDarkMode };
        }),
    }),
    {
      name: "art-explorer-theme", // nome do item no localStorage
    }
  )
);

// Função para inicializar o tema quando o app carrega
export const initializeTheme = () => {
  const { isDarkMode } = useThemeStore.getState();

  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", isDarkMode);
  }
};
