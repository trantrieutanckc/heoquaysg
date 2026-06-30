"use client"

import Link from "next/link"
import { User } from "next-auth"
import { signOut } from "next-auth/react"
import { LayoutDashboard, LogOut, Settings, User as UserIcon } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserAvatar } from "@/components/user-avatar"

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">
  role?: string
}

const lineClass = "absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] bg-primary w-0 group-hover:w-full transition-[width] duration-500"
const itemClass = "relative cursor-pointer group flex items-center gap-2.5"

export function UserAccountNav({ user, role }: UserAccountNavProps) {
  const isDashboardUser = role === "ADMIN" || role === "EDITOR"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <UserAvatar
          user={{ name: user.name || null, image: user.image || null }}
          className="h-8 w-8 ring-2 ring-transparent hover:ring-primary/40 transition-all"
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted/50">
          <UserAvatar
            user={{ name: user.name || null, image: user.image || null }}
            className="h-9 w-9 shrink-0"
          />
          <div className="flex flex-col min-w-0">
            {user.name && <p className="text-sm font-semibold truncate">{user.name}</p>}
            {user.email && <p className="text-xs text-muted-foreground truncate">{user.email}</p>}
            {role && (
              <span className="mt-0.5 inline-block w-fit rounded-full bg-primary/10 text-primary text-[10px] font-semibold px-1.5 py-px">
                {role}
              </span>
            )}
          </div>
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem asChild>
            <Link href="/profile" className={itemClass}>
              <UserIcon className="h-4 w-4 text-muted-foreground" />
              Tài khoản
              <span className={lineClass} />
            </Link>
          </DropdownMenuItem>

          {isDashboardUser && (
            <>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className={itemClass}>
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                  <span className={lineClass} />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings" className={itemClass}>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Cài đặt
                  <span className={lineClass} />
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </div>

        <DropdownMenuSeparator className="my-0" />

        <div className="p-1">
          <DropdownMenuItem
            className="relative cursor-pointer group flex items-center gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10"
            onSelect={(event) => {
              event.preventDefault()
              signOut({ callbackUrl: `${window.location.origin}/` })
            }}
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất
            <span className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] bg-destructive w-0 group-hover:w-full transition-[width] duration-500" />
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
