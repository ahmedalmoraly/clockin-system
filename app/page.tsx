import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { GoogleAuthButton } from "@/components/google-auth-button"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-primary">Alnoor Pre-K</span>
            <span>Time Tracker</span>
          </div>
          <GoogleAuthButton />
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to Alnoor Pre-K TimeTracker</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Easy time tracking for our team. Choose your role to get started.
          </p>
          <div className="grid gap-6">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>Employee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Clock in, clock out, and view your hours.</p>
                <Link href="/quick-signin">
                  <Button className="w-full">Employee Access</Button>
                </Link>
              </CardContent>
            </Card>
            <div className="text-center">
              <Link href="/login" className="text-sm text-muted-foreground hover:underline">
                Admin Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-4">
        <div className="container flex justify-between items-center">
          <div className="text-sm text-muted-foreground pl-4">© 2024 Alnoor Pre-K. All rights reserved.</div>
          <div className="text-sm text-muted-foreground pr-4">TimeTracker v1.0</div>
        </div>
      </footer>
    </div>
  )
}

