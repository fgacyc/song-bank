import React, {
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import {
  ThemeContext,
  type Theme,
  type ThemeContextType,
} from "../hooks/useTheme";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export const ThemeProvider = ({
  children,
  defaultTheme = "light",
  storageKey = "theme",
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  const availableThemes: Theme[] = useMemo(() => ["light", "dark"], []);

  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme;
    if (savedTheme && availableThemes.includes(savedTheme)) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setThemeState(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
    setMounted(true);
  }, [storageKey, availableThemes]);

  useEffect(() => {
    if (mounted) {
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem(storageKey, theme);
    }
  }, [theme, mounted, storageKey]);

  const setTheme = useCallback(
    (newTheme: Theme) => {
      if (availableThemes.includes(newTheme)) {
        setThemeState(newTheme);
      }
    },
    [availableThemes],
  );

  const toggleTheme = useCallback(() => {
    const currentIndex = availableThemes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % availableThemes.length;
    setTheme(availableThemes[nextIndex]!);
  }, [theme, availableThemes, setTheme]);

  const value: ThemeContextType = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      availableThemes,
    }),
    [theme, availableThemes, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
