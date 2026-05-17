"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "system" | "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "system",
  resolvedTheme: "dark",
  setTheme: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Read stored preference on mount
  useEffect(() => {
    const stored = localStorage.getItem("alwyn-dev-theme") as Theme | null;
    if (stored && ["system", "light", "dark"].includes(stored)) {
      setThemeState(stored);
    }
  }, []);

  // Apply dark/light class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;

    const applyDark = (isDark: boolean) => {
      root.classList.toggle("dark", isDark);
      setResolvedTheme(isDark ? "dark" : "light");
    };

    if (theme === "dark") {
      applyDark(true);
      return;
    }

    if (theme === "light") {
      applyDark(false);
      return;
    }

    // system — follow prefers-color-scheme
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    applyDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => applyDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [theme]);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("alwyn-dev-theme", next);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/** Inline script injected into <head> to prevent flash of wrong theme. */
export const themeScript = `(function(){
  var t=localStorage.getItem('alwyn-dev-theme')||'system';
  var dark=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark',dark);
})();`;
