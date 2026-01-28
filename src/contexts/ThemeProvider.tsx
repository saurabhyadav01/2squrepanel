"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * Theme Provider using next-themes
 * 
 * Provides theme switching functionality with system preference detection.
 * Uses shadcn/ui's theme system with proper dark mode support.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange={false}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

