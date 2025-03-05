"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useGoogleSheets } from "@/lib/google-sheets"

const GoogleSheetsContext = createContext<ReturnType<typeof useGoogleSheets> | null>(null)

export function GoogleSheetsProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    const tokens = localStorage.getItem("googleTokens")
    if (tokens && tokens !== "undefined") {
      const parsedTokens = JSON.parse(tokens)
      setAccessToken(parsedTokens.access_token)
    }
  }, [])

  const updateAccessToken = useCallback((token: string) => {
    setAccessToken(token)
    const tokens = JSON.parse(localStorage.getItem("googleTokens") || "{}")
    tokens.access_token = token
    localStorage.setItem("googleTokens", JSON.stringify(tokens))
  }, [])

  const googleSheetsValue = useGoogleSheets(accessToken, updateAccessToken)

  return <GoogleSheetsContext.Provider value={googleSheetsValue}>{children}</GoogleSheetsContext.Provider>
}

export function useGoogleSheetsContext() {
  const context = useContext(GoogleSheetsContext)
  if (!context) {
    throw new Error("useGoogleSheetsContext must be used within a GoogleSheetsProvider")
  }
  return context
}

