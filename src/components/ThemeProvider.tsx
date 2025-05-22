"use client";

import { useThemeStore } from "@/stores/themeStore";
import { useEffect } from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { isDarkMode } = useThemeStore();

  useEffect(() => {
    // Apply dark mode class to root html element
    if (typeof window !== "undefined") {
      const root = window.document.documentElement;

      if (isDarkMode) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [isDarkMode]);

  return <>{children}</>;
}
