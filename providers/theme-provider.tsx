"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

// /api/test {"crimeDataUrl":"https://firebasestorage.googleapis.com/v0/b/binsr-484d7.appspot.com/o/crime-data_crime-data_crimestat.csv?alt=media&token=21120ded-08ae-464c-a9ca-4f88b3ad491f"}