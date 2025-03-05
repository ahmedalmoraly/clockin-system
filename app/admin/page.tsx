"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, parseISO } from "date-fns"
import { Download, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Header } from "@/components/header"
import { useGoogleSheets } from "@/lib/google-sheets"
import type { TimeEntry } from "@/lib/types"

export default function AdminDashboard() {
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const { getAllTimeEntries } = useGoogleSheets()

  // Fetch all time entries
  useEffect(() => {
    const fetchTimeEntries = async () => {
      try {
        const entries = await getAllTimeEntries()
        setTimeEntries(entries)
      } catch (error) {
        console.error("Error fetching time entries:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTimeEntries()
  }, [getAllTimeEntries])

  // Filter time entries based on search query
  const filteredEntries = timeEntries.filter((entry) =>
    entry.userName?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Calculate duration between clock in and clock out
  const calculateDuration = (clockIn: string, clockOut: string | null) => {
    if (!clockOut) return "In Progress"

    const start = parseISO(clockIn)
    const end = parseISO(clockOut)
    const diff = end.getTime() - start.getTime()

    const hours = Math.floor(diff / 3600000)
    const minutes = Math.floor((diff % 3600000) / 60000)

    return `${hours}h ${minutes}m`
  }

  // Get unique employees from time entries
  const getUniqueEmployees = () => {
    const uniqueNames = new Set(timeEntries.map((entry) => entry.userName))
    return uniqueNames.size
  }

  // Get currently clocked in employees
  const getCurrentlyClockedIn = () => {
    return timeEntries.filter((entry) => !entry.clockOutTime).length
  }

  // Export time entries to CSV
  const exportToCSV = () => {
    const headers = ["Employee", "Clock In", "Clock Out", "Duration"]

    const csvData = filteredEntries.map((entry) => {
      const clockIn = entry.clockInTime ? format(parseISO(entry.clockInTime), "yyyy-MM-dd HH:mm:ss") : ""
      const clockOut = entry.clockOutTime ? format(parseISO(entry.clockOutTime), "yyyy-MM-dd HH:mm:ss") : ""
      const duration = calculateDuration(entry.clockInTime, entry.clockOutTime)

      return [entry.userName || "", clockIn, clockOut, duration]
    })

    const csvContent = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `time-entries-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading time entries...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack title="Admin Dashboard" />
      <main className="flex-1 container py-6">
        <div className="grid gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <p className="text-muted-foreground">View and manage employee time entries</p>
            </div>
            <div className="flex gap-4">
              <Link href="/admin/monthly-report">
                <Button variant="outline">Monthly Report</Button>
              </Link>
              <Button onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export to CSV
              </Button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getUniqueEmployees()}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Currently Clocked In</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getCurrentlyClockedIn()}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>View all employee clock in/out records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by employee name..."
                  className="max-w-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Clock In</TableHead>
                      <TableHead>Clock Out</TableHead>
                      <TableHead>Duration</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredEntries.length > 0 ? (
                      filteredEntries.map((entry, index) => {
                        const clockInDate = parseISO(entry.clockInTime)

                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{entry.userName}</TableCell>
                            <TableCell>{format(clockInDate, "MMM d, yyyy")}</TableCell>
                            <TableCell>{format(clockInDate, "h:mm a")}</TableCell>
                            <TableCell>
                              {entry.clockOutTime ? format(parseISO(entry.clockOutTime), "h:mm a") : "—"}
                            </TableCell>
                            <TableCell>{calculateDuration(entry.clockInTime, entry.clockOutTime)}</TableCell>
                          </TableRow>
                        )
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          No time entries found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

