import type { UserProfile } from "@/lib/types"

interface NavUserProps {
  user: UserProfile
}

export function NavUser({ user }: NavUserProps) {
  return (
    <div className="flex items-center gap-2 p-2">
      <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="h-8 w-8 rounded-full" />
      <div className="truncate">
        <p className="text-sm font-medium">{user.name}</p>
        <p className="text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  )
}

