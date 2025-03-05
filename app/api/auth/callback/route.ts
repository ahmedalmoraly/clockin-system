import { type NextRequest, NextResponse } from "next/server"
import { getTokens } from "@/lib/google-auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No code provided" }, { status: 400 })
  }

  try {
    const tokens = await getTokens(code)
    // In a real application, you'd want to securely store these tokens
    // For now, we'll just send them back to the client
    return NextResponse.json({ tokens })
  } catch (error) {
    console.error("Error getting tokens:", error)
    return NextResponse.json({ error: "Failed to get tokens" }, { status: 500 })
  }
}

