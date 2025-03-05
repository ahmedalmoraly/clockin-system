"use client"

import type * as React from "react"
import { createContext, useContext, useState } from "react"
import { cn } from "@/lib/utils"

const SidebarContext = createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: true,
  setIsOpen: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="flex min-h-screen">{children}</div>
    </SidebarContext.Provider>
  )
}

export function Sidebar({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useContext(SidebarContext)

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-16",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4", className)} {...props} />
}

export function SidebarContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex-1 overflow-auto px-4", className)} {...props} />
}

export function SidebarFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-4 py-4", className)} {...props} />
}

export function SidebarMenu({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid gap-1", className)} {...props} />
}

export function SidebarMenuItem({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />
}

export function SidebarMenuButton({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen } = useContext(SidebarContext)

  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isOpen ? "justify-start" : "justify-center",
        className,
      )}
      {...props}
    />
  )
}

export function SidebarSeparator({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("my-4 h-px bg-border", className)} {...props} />
}

export function SidebarTrigger({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { isOpen, setIsOpen } = useContext(SidebarContext)

  return (
    <button className={cn("p-2 hover:bg-accent rounded-md", className)} onClick={() => setIsOpen(!isOpen)} {...props}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-4 w-4"
      >
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <line x1="9" x2="15" y1="3" y2="3" />
        <line x1="9" x2="15" y1="21" y2="21" />
        <line x1="3" x2="3" y1="9" y2="15" />
        <line x1="21" x2="21" y1="9" y2="15" />
      </svg>
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

export function SidebarInset({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { isOpen } = useContext(SidebarContext)

  return (
    <div
      className={cn("flex flex-1 flex-col transition-all duration-300", isOpen ? "ml-64" : "ml-16", className)}
      {...props}
    />
  )
}

export function SidebarRail() {
  const { isOpen, setIsOpen } = useContext(SidebarContext)

  return (
    <div
      className="absolute right-0 top-0 h-full w-1 cursor-ew-resize bg-border opacity-0 transition-opacity hover:opacity-100"
      onMouseDown={(e) => {
        e.preventDefault()
        const startX = e.clientX
        const sidebarWidth = isOpen ? 256 : 64

        const onMouseMove = (e: MouseEvent) => {
          const newWidth = sidebarWidth + e.clientX - startX
          setIsOpen(newWidth > 128)
        }

        const onMouseUp = () => {
          document.removeEventListener("mousemove", onMouseMove)
          document.removeEventListener("mouseup", onMouseUp)
        }

        document.addEventListener("mousemove", onMouseMove)
        document.addEventListener("mouseup", onMouseUp)
      }}
    />
  )
}

