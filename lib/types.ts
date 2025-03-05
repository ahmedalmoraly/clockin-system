export interface TimeEntry {
  id: string
  userId: string
  userName: string
  date: string // Format: "YYYY-MM-DD"
  clockInTime: string // Format: "HH:mm:ss"
  clockOutTime: string | null // Format: "HH:mm:ss" or null
}

export interface Employee {
  id: string
  name: string
  email: string
  department: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  department: string
  avatar: string
}

export interface MonthlyReport {
  userName: string
  totalHours: number
}

