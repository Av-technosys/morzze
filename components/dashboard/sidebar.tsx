"use client"
import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut as nextAuthSignOut } from "next-auth/react"
import {
  IconLayoutDashboard,
  IconUser,
  IconShoppingBag,
  IconAddressBook,
  IconHeart,
  IconStar,
  IconLogout,
  IconChevronRight,
  IconMenu2,
} from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { getProfile } from "@/helper/user/action"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ContactLink } from "@/components/ContactLink"

const navItems = [
  { title: "Dashboard", icon: IconLayoutDashboard, href: "/dashboard" },
  { title: "Profile Settings", icon: IconUser, href: "/dashboard/profile" },
  { title: "My Orders", icon: IconShoppingBag, href: "/dashboard/order" },
  { title: "Address Book", icon: IconAddressBook, href: "/dashboard/address" },
  { title: "Wishlist", icon: IconHeart, href: "/dashboard/wishlist" },
  { title: "Reviews & Ratings", icon: IconStar, href: "/dashboard/review-rating" },
  // { title: "Notifications", icon: IconBell, href: "/dashboard/notification" },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const [loggingOut, setLoggingOut] = React.useState(false)
  const [open, setOpen] = React.useState(false)

  const [user, setUser] = React.useState<{
    fullName: string
    email: string
  } | null>(null)

  React.useEffect(() => {
    getProfile()
      .then((data) => {
        setUser({
          fullName: data.fullName ?? "",
          email: data.email ?? "",
        })
      })
      .catch(() => {
        setUser(null)
      })
  }, [])

  const handleLogout = async () => {
    if (loggingOut) return

    setLoggingOut(true)

    const toastId = toast.loading("Signing out...")

    try {
      await nextAuthSignOut({
        redirect: false,
        callbackUrl: "/sign-in",
      })

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => undefined)

      toast.success("Signed out successfully", { id: toastId })
      setOpen(false)
      router.replace("/sign-in")
      router.refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign out"

      toast.error(message, {
        id: toastId,
      })
    } finally {
      setLoggingOut(false)
    }
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#141414]">
      {/* Profile */}
      <div className="rounded-xl p-6 text-center border border-zinc-900 shadow-sm">
        <div className="w-14 h-14 bg-zinc-800 rounded-full mx-auto mb-3 flex items-center justify-center border border-zinc-700/50">
          <IconUser className="text-[#FFB800]" size={28} />
        </div>

        {user ? (
          <>
            <h3 className="text-white font-medium text-sm">
              {user.fullName || "User"}
            </h3>

            <ContactLink
              type="email"
              value={user.email}
              className="block text-zinc-500 text-[11px] mt-0.5"
            />
          </>
        ) : (
          <>
            <div className="h-4 w-24 bg-zinc-800 rounded mx-auto animate-pulse" />
            <div className="h-3 w-36 bg-zinc-800 rounded mx-auto mt-1.5 animate-pulse" />
          </>
        )}
      </div>

      {/* Navigation */}
      <nav className=" mt-4">
        <div className="rounded-xl border border-zinc-900 overflow-hidden space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <Link
                key={item.title}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "w-full flex items-center justify-between px-4 md:py-2.5 py-3.5 transition-all group border-b border-zinc-900/50 last:border-0",
                  isActive
                    ? "bg-[#FFB800]/10 text-[#FFB800]"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon
                    size={19}
                    className={cn(
                      "transition-colors",
                      isActive
                        ? "text-[#FFB800]"
                        : "text-zinc-500 group-hover:text-zinc-300"
                    )}
                  />

                  <span className="text-[13px] font-medium">
                    {item.title}
                  </span>
                </div>

                <IconChevronRight
                  size={14}
                  className={cn(
                    "opacity-30 transition-transform group-hover:translate-x-0.5",
                    isActive && "opacity-100"
                  )}
                />
              </Link>
            )
          })}
        </div>

        {/* Logout */}
        <div className="pt-4 border-t border-zinc-900 mt-4">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/5 rounded-lg transition-all group disabled:opacity-50"
          >
            <IconLogout
              size={19}
              className="group-hover:-translate-x-1 transition-transform"
            />

            <span className="text-[13px] font-medium">
              {loggingOut ? "Signing Out..." : "Sign Out"}
            </span>
          </button>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="lg:hidden p-4 border-b border-zinc-900 bg-[#141414]">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <button className="flex items-center gap-2 text-white">
              <IconMenu2 size={24} />
              <span className="text-sm font-medium">Menu</span>
            </button>
          </SheetTrigger>

          <SheetContent
            side="left"
            className="w-[300px] border-zinc-900 bg-[#141414] p-4"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col gap-4 p-4 sticky top-0 border-r border-zinc-900 bg-[#141414]">
        <SidebarContent />
      </aside>
    </>
  )
}
