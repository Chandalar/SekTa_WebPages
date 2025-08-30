import { createContext, useContext, useMemo } from "react";

const ThemeCtx = createContext({});

export function ThemeProvider({ children }) {
  const value = useMemo(() => ({
    colors: { brand: "#6b5bd7", accent: "#f2a24a" },
  }), []);
  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useTheme() {
  return useContext(ThemeCtx);
}