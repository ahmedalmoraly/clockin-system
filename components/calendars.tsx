"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

interface CalendarGroup {
  name: string
  items: string[]
}

interface CalendarsProps {
  calendars: CalendarGroup[]
}

export function Calendars({ calendars }: CalendarsProps) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    Object.fromEntries(calendars.map((group) => [group.name, true])),
  )

  const toggleGroup = (groupName: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [groupName]: !prev[groupName],
    }))
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Calendars</h3>
      <div className="space-y-2">
        {calendars.map((group) => (
          <div key={group.name} className="space-y-1">
            <button
              onClick={() => toggleGroup(group.name)}
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-sm font-medium hover:bg-accent"
            >
              <span>{group.name}</span>
              {expandedGroups[group.name] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {expandedGroups[group.name] && (
              <div className="ml-2 space-y-1">
                {group.items.map((item) => (
                  <div key={item} className="flex items-center space-x-2 rounded-md px-2 py-1 hover:bg-accent">
                    <Checkbox id={item} />
                    <label
                      htmlFor={item}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

