"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function GoogleSheetsSetup() {
  const [sheetUrl, setSheetUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsConnecting(true)

    // Simulate connection to Google Sheets
    setTimeout(() => {
      setIsConnecting(false)
      setIsConnected(true)
    }, 2000)
  }

  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Google Sheet Connected</CardTitle>
          <CardDescription>Your time tracking sheet is ready to use</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-green-50 text-green-700 p-4 rounded-md">
            <p className="font-medium">Successfully connected to:</p>
            <p className="text-sm mt-1 break-all">{sheetUrl}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => setIsConnected(false)}>
            Disconnect
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Google Sheet</CardTitle>
        <CardDescription>Link your Google Sheet to store time entries</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect}>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="sheet-url">Google Sheet URL</Label>
              <Input
                id="sheet-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">The sheet must be shared with edit access</p>
            </div>
            <Button type="submit" className="w-full" disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                  Connecting...
                </>
              ) : (
                "Connect Sheet"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

