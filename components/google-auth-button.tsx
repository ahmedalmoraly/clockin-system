"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useGoogleSheetsContext } from "@/app/providers"

export function GoogleAuthButton() {
  const { accessToken, updateAccessToken } = useGoogleSheetsContext()

  useEffect(() => {
    const tokens = localStorage.getItem("googleTokens")
    if (tokens && tokens !== "undefined") {
      const parsedTokens = JSON.parse(tokens)
      updateAccessToken(parsedTokens.access_token)
    }
  }, [updateAccessToken])

  const handleAuth = async () => {
    try {
      console.log("Starting auth flow")
      const response = await fetch("/api/auth/login")
      const { authUrl } = await response.json()
      console.log("Redirecting to auth URL:", authUrl)
      window.location.href = authUrl
    } catch (error) {
      console.error("Error starting auth flow:", error)
    }
  }

  const handleSignOut = () => {
    console.log("Signing out")
    localStorage.removeItem("googleTokens")
    updateAccessToken("")
  }

  return (
    <Button onClick={accessToken ? handleSignOut : handleAuth}>
      {accessToken ? "Sign Out of Google" : "Sign In with Google"}
    </Button>
  )
}

