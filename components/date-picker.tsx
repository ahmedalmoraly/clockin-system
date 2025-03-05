"use client"

import { useState } from "react"
import { addMonths, format, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

export function DatePicker() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())

  const handlePreviousMonth = () => {
    setCalendarMonth(subMonths(calendarMonth, 1))
  }

  const handleNextMonth = () => {
    setCalendarMonth(addMonths(calendarMonth, 1))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <h3 className="text-sm font-medium">{format(calendarMonth, "MMMM yyyy")}</h3>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
      <Calendar mode="single" selected={date} onSelect={setDate} month={calendarMonth} className="rounded-md border" />
    </div>
  )
}

