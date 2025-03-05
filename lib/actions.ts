"use server"

import type { TimeEntry, UserProfile } from "./types"

// Mock database
const users: UserProfile[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "employee",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "employee",
    department: "Marketing",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert.johnson@example.com",
    role: "employee",
    department: "Finance",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily.davis@example.com",
    role: "manager",
    department: "Engineering",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    role: "employee",
    department: "Human Resources",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

let timeEntries: TimeEntry[] = [
  {
    id: "1",
    userId: "1",
    clockInTime: new Date(new Date().setHours(9, 0, 0, 0)).toISOString(),
    clockOutTime: null,
  },
  {
    id: "2",
    userId: "2",
    clockInTime: new Date(new Date().setHours(8, 30, 0, 0)).toISOString(),
    clockOutTime: new Date(new Date().setHours(12, 0, 0, 0)).toISOString(),
  },
  {
    id: "3",
    userId: "3",
    clockInTime: new Date(new Date().setHours(9, 15, 0, 0)).toISOString(),
    clockOutTime: new Date(new Date().setHours(17, 30, 0, 0)).toISOString(),
  },
  {
    id: "4",
    userId: "1",
    clockInTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    clockOutTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
  {
    id: "5",
    userId: "2",
    clockInTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    clockOutTime: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
  },
]

// User actions
export async function getAllUsers(): Promise<UserProfile[]> {
  return users
}

export async function getUserById(userId: string): Promise<UserProfile | null> {
  return users.find((user) => user.id === userId) || null
}

// Time entry actions
export async function getAllTimeEntries(): Promise<TimeEntry[]> {
  return timeEntries.sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime())
}

export async function getTimeEntries(userId: string): Promise<TimeEntry[]> {
  return timeEntries
    .filter((entry) => entry.userId === userId)
    .sort((a, b) => new Date(b.clockInTime).getTime() - new Date(a.clockInTime).getTime())
}

export async function clockIn(userId: string): Promise<TimeEntry> {
  const newEntry: TimeEntry = {
    id: (timeEntries.length + 1).toString(),
    userId,
    clockInTime: new Date().toISOString(),
    clockOutTime: null,
  }

  timeEntries = [newEntry, ...timeEntries]
  return newEntry
}

export async function clockOut(userId: string, entryId: string): Promise<TimeEntry> {
  const entryIndex = timeEntries.findIndex((entry) => entry.id === entryId && entry.userId === userId)

  if (entryIndex !== -1) {
    const updatedEntry = {
      ...timeEntries[entryIndex],
      clockOutTime: new Date().toISOString(),
    }

    timeEntries[entryIndex] = updatedEntry
    return updatedEntry
  }

  throw new Error("Entry not found")
}

