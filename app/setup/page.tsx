import { GoogleSheetsSetup } from "@/components/google-sheets-setup"

export default function SetupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-primary">SimpleTime</span>
            <span>Tracker</span>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Setup Your Time Tracker</h1>
          <GoogleSheetsSetup />
        </div>
      </main>
    </div>
  )
}

