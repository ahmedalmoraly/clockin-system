"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Header } from "@/components/header"
import { useToast } from "@/components/ui/use-toast"
import { useGoogleSheets } from "@/lib/google-sheets"
import type { MonthlyReport } from "@/lib/types"

export default function MonthlyReportPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [report, setReport] = useState<MonthlyReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)

  const { generateMonthlyReport } = useGoogleSheets()
  const { toast } = useToast()

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true)
      try {
        const data = await generateMonthlyReport(year, month)
        setReport(data)
      } catch (error) {
        console.error("Error fetching report:", error)
        toast({
          title: "Error",
          description: "Failed to fetch the monthly report. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchReport()
  }, [year, month, generateMonthlyReport, toast])

  const handleExport = () => {
    if (report.length === 0) {
      toast({
        title: "No Data",
        description: "There is no data to export for the selected month.",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      const csvContent = [
        ["Employee", "Total Hours"],
        ...report.map((entry) => [entry.userName, entry.totalHours.toString()]),
      ]
        .map((row) => row.join(","))
        .join("\n")

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", `monthly_report_${year}_${format(new Date(year, month - 1), "MMM")}.csv`)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export Successful",
        description: "The CSV file has been downloaded successfully.",
        variant: "default",
      })
    } catch (error) {
      console.error("Error exporting CSV:", error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting the CSV. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header showBack title="Monthly Report" />
      <main className="flex-1 container py-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Monthly Report</CardTitle>
            <div className="flex items-center gap-4">
              <Select value={year.toString()} onValueChange={(value) => setYear(Number(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(5)].map((_, i) => (
                    <SelectItem key={i} value={(new Date().getFullYear() - i).toString()}>
                      {new Date().getFullYear() - i}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={month.toString()} onValueChange={(value) => setMonth(Number(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent>
                  {[...Array(12)].map((_, i) => (
                    <SelectItem key={i} value={(i + 1).toString()}>
                      {format(new Date(2024, i, 1), "MMMM")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleExport} disabled={isLoading || isExporting || report.length === 0}>
                {isExporting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-background border-t-transparent rounded-full" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : report.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead className="text-right">Total Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.map((entry) => (
                    <TableRow key={entry.userName}>
                      <TableCell>{entry.userName}</TableCell>
                      <TableCell className="text-right">{entry.totalHours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-muted-foreground">No data available for the selected month.</div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

