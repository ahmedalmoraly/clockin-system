"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useGoogleSheetsContext } from "@/app/providers"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { updateAccessToken } = useGoogleSheetsContext()

  useEffect(() => {
    const fetchTokens = async () => {
      const code = searchParams.get("code")
      console.log("AuthCallback: Received code:", code)
      if (code) {
        try {
          console.log("Fetching tokens")
          const response = await fetch(`/api/auth/callback?code=${code}`)
          const { tokens } = await response.json()
          console.log("Received tokens:", tokens)

          // Store the entire tokens object
          localStorage.setItem("googleTokens", JSON.stringify(tokens))
          console.log("Tokens saved to localStorage")

          // Update the access token in the context
          updateAccessToken(tokens.access_token)
          console.log("Access token updated in context")

          router.push("/")
        } catch (error) {
          console.error("Error fetching tokens:", error)
        }
      } else {
        console.error("No code received in callback")
      }
    }

    fetchTokens()
  }, [router, searchParams, updateAccessToken])

  return <div>Authenticating...</div>
}

