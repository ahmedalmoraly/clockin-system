"use server"

import { google } from "googleapis"
import { oauth2Client } from "@/lib/google-auth"
import type { TimeEntry, Employee, MonthlyReport } from "@/lib/types"

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID

export async function fetchSheetData(range: string, accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: "v4", auth: oauth2Client })

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range,
  })

  return response.data.values
}

export async function appendSheetData(range: string, values: any[][], accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: "v4", auth: oauth2Client })

  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  })
}

export async function updateSheetData(range: string, values: any[][], accessToken: string) {
  oauth2Client.setCredentials({ access_token: accessToken })
  const sheets = google.sheets({ version: "v4", auth: oauth2Client })

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  })
}

export async function getTimeEntries(accessToken: string): Promise<TimeEntry[]> {
  const data = await fetchSheetData("Timetracker", accessToken)
  return data.slice(1).map((row: string[]) => ({
    id: row[0],
    userId: row[1],
    userName: row[2],
    date: row[3],
    clockInTime: row[4],
    clockOutTime: row[5] || null,
  }))
}

export async function getEmployees(accessToken: string): Promise<Employee[]> {
  const data = await fetchSheetData("Employees", accessToken)
  return data.slice(1).map((row: string[]) => ({
    id: row[0],
    name: row[1],
    email: row[2],
    department: row[3],
  }))
}

export async function addTimeEntry(entry: TimeEntry, accessToken: string): Promise<void> {
  try {
    console.log("Adding time entry:", entry)
    oauth2Client.setCredentials({ access_token: accessToken })
    const sheets = google.sheets({ version: "v4", auth: oauth2Client })

    const data = await fetchSheetData("Timetracker", accessToken)
    const rowIndex = data.findIndex((row: string[]) => row[0] === entry.id)

    if (rowIndex === -1) {
      // If the entry doesn't exist, append a new row
      console.log("Appending new row")
      await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: "Timetracker",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[entry.id, entry.userId, entry.userName, entry.date, entry.clockInTime, entry.clockOutTime]],
        },
      })
    } else {
      // If the entry exists, update the existing row
      console.log("Updating existing row")
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `Timetracker!A${rowIndex + 1}:F${rowIndex + 1}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[entry.id, entry.userId, entry.userName, entry.date, entry.clockInTime, entry.clockOutTime]],
        },
      })
    }
    console.log("Time entry added/updated successfully")
  } catch (error) {
    console.error("Error in addTimeEntry:", error)
    throw new Error("Failed to add time entry: " + (error as Error).message)
  }
}

export async function clockIn(employee: Employee, accessToken: string): Promise<TimeEntry> {
  try {
    console.log("Clocking in employee:", employee)
    const now = new Date()
    const newEntry: TimeEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId: employee.id,
      userName: employee.name,
      date: now.toISOString().split("T")[0],
      clockInTime: now.toISOString(),
      clockOutTime: null,
    }
    await addTimeEntry(newEntry, accessToken)
    console.log("Clock-in successful")
    return newEntry
  } catch (error) {
    console.error("Error in clockIn:", error)
    throw new Error("Failed to clock in: " + (error as Error).message)
  }
}

export async function generateMonthlyReport(
  year: number,
  month: number,
  accessToken: string,
): Promise<MonthlyReport[]> {
  const timeEntries = await getTimeEntries(accessToken)
  // Implement the report generation logic here
  // This is a placeholder implementation
  return []
}

