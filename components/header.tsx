import type React from "react"
import Link from "next/link"

interface HeaderProps {
  title?: string
  children?: React.ReactNode
}

export function Header({ title, children }: HeaderProps) {
  return (
    <header className="border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between py-2 px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Link href="/">
              <span className="text-primary">Alnoor Pre-K</span>
              <span>TimeTracker</span>
            </Link>
          </div>
        </div>
        {title && <h1 className="text-lg font-semibold">{title}</h1>}
        {children}
      </div>
    </header>
  )
}

