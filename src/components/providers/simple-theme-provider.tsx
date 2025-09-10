"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function SimpleThemeProvider({
  children,
  defaultTheme = "dark",
}: {
  children: React.ReactNode
  defaultTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const savedTheme = localStorage.getItem("fitspark-theme") as Theme
      if (savedTheme && (savedTheme === "dark" || savedTheme === "light")) {
        setTheme(savedTheme)
      }
    } catch (error) {
      console.warn("Failed to read theme from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("fitspark-theme", theme)
        const root = document.documentElement
        root.classList.remove("light", "dark")
        root.classList.add(theme)
      } catch (error) {
        console.warn("Failed to save theme to localStorage:", error)
      }
    }
  }, [theme, mounted])

  // Always provide the context, even when not mounted
  const contextValue = React.useMemo(() => ({
    theme,
    setTheme
  }), [theme])

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      <div className={defaultTheme}>
        {children}
      </div>
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a SimpleThemeProvider")
  }
  return context
}