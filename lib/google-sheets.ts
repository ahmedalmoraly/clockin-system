"use client"

import { useCallback } from "react"
import { format, parseISO, startOfDay, endOfMonth } from "date-fns"
import type { TimeEntry, MonthlyReport, Employee } from "./types"
import { getTimeEntries, getEmployees, addTimeEntry, generateMonthlyReport } from "@/app/actions/google-sheets"

export function useGoogleSheets(accessToken: string | null, updateAccessToken: (token: string) => void) {
  const getAllTimeEntries = useCallback(async (): Promise<TimeEntry[]> => {
    if (!accessToken) {
      console.error("getAllTimeEntries: Not authenticated")
      throw new Error("Not authenticated")
    }
    return getTimeEntries(accessToken)
  }, [accessToken])

  const getLastTimeEntry = useCallback(
    async (userId: string): Promise<TimeEntry | null> => {
      if (!accessToken) {
        console.error("getLastTimeEntry: Not authenticated")
        throw new Error("Not authenticated")
      }
      const entries = await getTimeEntries(accessToken)
      const userEntries = entries.filter((entry) => entry.userId === userId)
      if (userEntries.length === 0) return null
      return userEntries.sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime())[0]
    },
    [accessToken],
  )

  const addNewTimeEntry = useCallback(
    async (entry: TimeEntry): Promise<void> => {
      if (!accessToken) {
        console.error("addNewTimeEntry: Not authenticated")
        throw new Error("Not authenticated")
      }
      await addTimeEntry(entry, accessToken)
    },
    [accessToken],
  )

  const getUniqueEmployees = useCallback(async (): Promise<Employee[]> => {
    if (!accessToken) {
      console.error("getUniqueEmployees: Not authenticated")
      throw new Error("Not authenticated")
    }
    return getEmployees(accessToken)
  }, [accessToken])

  const generateReport = useCallback(
    async (year: number, month: number): Promise<MonthlyReport[]> => {
      if (!accessToken) {
        console.error("generateReport: Not authenticated")
        throw new Error("Not authenticated")
      }
      return generateMonthlyReport(year, month, accessToken)
    },
    [accessToken],
  )

  const clockIn = useCallback(
    async (employee: Employee): Promise<void> => {
      if (!accessToken) {
        console.error("clockIn: Not authenticated")
        throw new Error("Not authenticated")
      }
      const now = new Date()
      const newEntry: TimeEntry = {
        id: Math.random().toString(36).substr(2, 9),
        userId: employee.id,
        userName: employee.name,
        date: format(now, "yyyy-MM-dd"),
        clockInTime: format(now, "hh:mm:ss aa"),
        clockOutTime: null,
      }
      try {
        await addTimeEntry(newEntry, accessToken)
      } catch (error) {
        console.error("Error in clockIn:", error)
        throw new Error("Failed to clock in: " + (error as Error).message)
      }
    },
    [accessToken],
  )

  const clockOut = useCallback(
    async (userId: string): Promise<void> => {
      if (!accessToken) {
        console.error("clockOut: Not authenticated")
        throw new Error("Not authenticated")
      }
      const entries = await getTimeEntries(accessToken)
      const lastEntry = entries
        .filter((entry) => entry.userId === userId && !entry.clockOutTime)
        .sort(
          (a, b) => new Date(b.date + "T" + b.clockInTime).getTime() - new Date(a.date + "T" + a.clockInTime).getTime(),
        )[0]

      if (lastEntry) {
        const now = new Date()
        const updatedEntry: TimeEntry = {
          ...lastEntry,
          clockOutTime: format(now, "hh:mm:ss aa"),
        }
        await addTimeEntry(updatedEntry, accessToken)
      } else {
        console.error("No open time entry found for clock-out")
        throw new Error("No open time entry found for clock-out")
      }
    },
    [accessToken],
  )

  const getTimeEntriesForUser = useCallback(
    async (userId: string): Promise<TimeEntry[]> => {
      if (!accessToken) {
        console.error("getTimeEntriesForUser: Not authenticated")
        throw new Error("Not authenticated")
      }
      const allEntries = await getTimeEntries(accessToken)
      const today = new Date()
      return allEntries
        .filter(
          (entry) =>
            entry.userId === userId &&
            parseISO(entry.date) >= startOfDay(today) &&
            parseISO(entry.date) <= endOfMonth(today),
        )
        .sort(
          (a, b) => new Date(b.date + "T" + b.clockInTime).getTime() - new Date(a.date + "T" + a.clockInTime).getTime(),
        )
    },
    [accessToken],
  )

  return {
    accessToken,
    updateAccessToken,
    getTimeEntriesForUser,
    getAllTimeEntries,
    getLastTimeEntry,
    clockIn,
    clockOut,
    getUniqueEmployees,
    generateMonthlyReport: generateReport,
  }
}

