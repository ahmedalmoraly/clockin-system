import { OAuth2Client } from "google-auth-library"

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? "https://v0-employee-clockin-software.vercel.app/auth/callback"
    : "http://localhost:3000/auth/callback"

export const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)

export function getAuthUrl() {
  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/spreadsheets"],
  })
}

export async function getTokens(code: string) {
  const { tokens } = await oauth2Client.getToken(code)
  return tokens
}

