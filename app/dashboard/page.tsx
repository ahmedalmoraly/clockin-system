"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { format, parseISO, differenceInSeconds, startOfMonth, endOfMonth, isWithinInterval } from "date-fns"
import { Clock, LogOut, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { useGoogleSheetsContext } from "@/app/providers"
import type { Employee, TimeEntry } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function Dashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [employee, setEmployee] = useState<Employee | null>(null)
  const router = useRouter()

  const { clockIn, clockOut, getTimeEntriesForUser, accessToken } = useGoogleSheetsContext()
  const { toast } = useToast()

  useEffect(() => {
    if (!accessToken) {
      console.error("No access token available")
      router.push("/")
      return
    }

    const storedUser = localStorage.getItem("currentUser")
    if (!storedUser) {
      router.push("/quick-signin")
      return
    }
    setEmployee(JSON.parse(storedUser))

    const fetchTimeEntries = async () => {
      if (employee) {
        const entries = await getTimeEntriesForUser(employee.id)
        const currentMonth = new Date()
        const filteredEntries = entries.filter((entry) =>
          isWithinInterval(parseISO(entry.date), {
            start: startOfMonth(currentMonth),
            end: endOfMonth(currentMonth),
          }),
        )
        setTimeEntries(
          filteredEntries.sort(
            (a, b) =>
              new Date(b.date + "T" + b.clockInTime).getTime() - new Date(a.date + "T" + a.clockInTime).getTime(),
          ),
        )
      }
    }

    fetchTimeEntries()
  }, [getTimeEntriesForUser, router, employee, accessToken])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClockIn = async () => {
    if (!employee) return
    setIsLoading(true)
    try {
      await clockIn(employee)
      const entries = await getTimeEntriesForUser(employee.id)
      setTimeEntries(entries)
      toast({
        title: "Clock In Successful",
        description: "You have successfully clocked in.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error clocking in:", error)
      toast({
        title: "Clock In Failed",
        description: "Failed to clock in. Please try again or contact support.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClockOut = async () => {
    if (!employee) return
    setIsLoading(true)
    try {
      await clockOut(employee.id)
      const entries = await getTimeEntriesForUser(employee.id)
      setTimeEntries(entries)
    } catch (error) {
      console.error("Error clocking out:", error)
      alert("Failed to clock out. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const isCurrentlyClockedIn = timeEntries.length > 0 && !timeEntries[0].clockOutTime

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="Employee Dashboard">
        <Link href="/">
          <Button variant="outline" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
        </Link>
      </Header>
      <main className="flex-1 container py-6">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Welcome, {employee?.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center gap-6">
                <div className="text-center">
                  <p className="text-muted-foreground">{format(currentTime, "EEEE, MMMM d, yyyy")}</p>
                  <p className="text-2xl font-mono mt-2">{format(currentTime, "h:mm:ss aa")}</p>
                </div>

                <div className="w-full max-w-xs bg-muted rounded-lg p-6 text-center">
                  <div className="mb-4">
                    <p className="text-sm font-medium">Current Status</p>
                    <p className={`text-lg font-bold ${isCurrentlyClockedIn ? "text-green-500" : "text-yellow-500"}`}>
                      {isCurrentlyClockedIn ? "Clocked In" : "Clocked Out"}
                    </p>
                  </div>

                  <Button
                    onClick={isCurrentlyClockedIn ? handleClockOut : handleClockIn}
                    className={`w-full ${isCurrentlyClockedIn ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Clock className="h-4 w-4 mr-2" />
                        {isCurrentlyClockedIn ? "Clock Out" : "Clock In"}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Month's Time Entries</CardTitle>
            </CardHeader>
            <CardContent>
              {timeEntries.length > 0 ? (
                <ul className="space-y-2">
                  {timeEntries.map((entry, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>
                        {format(parseISO(entry.date), "MMM d")} - {format(parseISO(entry.clockInTime), "h:mm aa")} -{" "}
                        {entry.clockOutTime ? format(parseISO(entry.clockOutTime), "h:mm aa") : "In Progress"}
                      </span>
                      <span className="text-muted-foreground">
                        {entry.clockOutTime
                          ? formatDuration(
                              differenceInSeconds(parseISO(entry.clockOutTime), parseISO(entry.clockInTime)),
                            )
                          : ""}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-muted-foreground">No time entries for this month.</p>
              )}
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return `${hours}h ${minutes}m`
}

