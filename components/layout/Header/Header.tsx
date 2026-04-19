"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import LocationDetector from "@/components/search/LocationDetector"
import { useWishlist } from "@/contexts/WishlistContext"
import { useAuth } from "@/contexts/AuthContext"

const navItems = [
  { label: "Stays", href: "/hotels" },
  { label: "Tours", href: "/tours" },
  { label: "Contest", href: "/posts" },
  { label: "Car Rental", href: "#" },
  { label: "Activities", href: "#" },
]

const Header = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout, isHost } = useAuth()
  const [profileOpen, setProfileOpen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { wishlist } = useWishlist()
  
  const isActive = (href: string) => {
    if (href === "#") return false
    return pathname.startsWith(href)
  }

  const profileMenuItems = [
    { label: "My Profile", href: "/profile", icon: "profile" },
    { label: isHost ? "Host Dashboard" : "Host Your Property", href: "/host", icon: "property" },
    { label: "Post of User", href: "/posts", icon: "posts" },
    { label: "Wishlist", href: "/wishlist", icon: "wishlist" },
  ]

  const moreMenuItems = [
    { label: "My Bookings", href: "#", icon: "bookings" },
    { label: "Settings", href: "#", icon: "settings" },
    { label: "Support", href: "#", icon: "support" },
    { label: "Referral", href: "#", icon: "referral" },
  ]

  const svgIcon = (name: string) => {
    const icons: Record<string, React.ReactNode> = {
      profile: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      bookings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      property: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-3m0 0l7-4 7 4M5 9v10a1 1 0 001 1h3m10-11l2 3m-2-3V9m-5 11h3a1 1 0 001-1V9m-9 11a9 9 0 019-9m0 0a3 3 0 010 6m0 0a3 3 0 010-6m12 0a3 3 0 010 6m0 0a3 3 0 010-6" />
        </svg>
      ),
      posts: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      wishlist: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      support: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      referral: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    }
    return icons[name] || null
  }

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex items-center justify-between p-4">
        {/* Logo and Location */}
        <Link href="/" className="flex items-center gap-4 hover:opacity-80 transition">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-base font-bold text-white shadow-lg">
            GH
          </div>
          <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition">
            <LocationDetector />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`relative transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 ${
                  active
                    ? "text-sky-700"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                <span>{item.label}</span>
                <span
                  className={`absolute left-0 right-0 bottom-[-0.5rem] h-0.5 rounded-full transition-all duration-300 ${
                    active ? "bg-sky-600" : "bg-transparent"
                  }`}
                />
              </Link>
            )
          })}
        </nav>

        {/* Mobile Hamburger + Profile */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

        {/* Profile Dropdown */}
        <div 
          className="relative"
          onMouseEnter={() => setProfileOpen(true)}
          onMouseLeave={() => setProfileOpen(false)}
        >
          {/* Profile Button */}
          <button
            type="button"
            aria-expanded={profileOpen}
            onClick={() => setProfileOpen((open) => !open)}
            className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-slate-200 bg-white shadow-md transition-all hover:border-blue-500 hover:shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 group"
          >
            <svg className="w-6 h-6 text-slate-600 group-hover:text-blue-600 transition-colors group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          <div
            style={{ maxHeight: "min(42rem, calc(100dvh - 5rem))" }}
            className={`absolute right-0 top-full mt-2 w-72 rounded-2xl border border-slate-200/80 bg-white shadow-2xl transition-all duration-300 transform origin-top-right flex flex-col overflow-hidden z-50 ${
              profileOpen ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'
            }`}
          >
            {isAuthenticated ? (
              <div className="flex max-h-full min-h-0 flex-col">
                {/* Header - When Logged In */}
                <div className="px-5 py-4 border-b border-slate-200 bg-gradient-to-r from-blue-50 to-blue-100 flex-shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-blue-300">
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{user?.name || "User"}</p>
                      <p className="text-xs text-slate-600 truncate">{user?.email}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full border-4 border-blue-500 bg-white flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content Area */}
                <div className="dropdown-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                  {/* Main Menu Items */}
                  <div className="p-2 space-y-1">
                    {profileMenuItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 text-slate-700 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
                      >
                        <div className="text-slate-500 group-hover:text-blue-600">
                          {svgIcon(item.icon)}
                        </div>
                        <span>{item.label}</span>
                        
                        {/* Badge for Wishlist */}
                        {item.label === "Wishlist" && wishlist.length > 0 && (
                          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            {wishlist.length}
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-200" />

                  {/* More Options */}
                  {showMoreMenu ? (
                    <div className="p-2 space-y-1 bg-slate-50">
                      {moreMenuItems.map((item) => (
                        <Link
                          key={item.label}
                          href={item.href}
                          className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 text-slate-700 text-sm font-medium transition-all duration-200 hover:bg-blue-50 hover:text-blue-600 group"
                        >
                          <div className="text-slate-500 group-hover:text-blue-600">
                            {svgIcon(item.icon)}
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                      <button
                        onClick={() => setShowMoreMenu(false)}
                        className="flex items-center gap-2 w-full rounded-lg px-4 py-2 text-slate-600 text-xs font-semibold transition-all hover:bg-slate-200 justify-center mt-1"
                      >
                        Show Less ↑
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Show More Button */}
                      <div className="p-2">
                        <button
                          onClick={() => setShowMoreMenu(true)}
                          className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-slate-600 text-sm font-semibold bg-slate-50 hover:bg-slate-100 transition-all"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                          More Options
                        </button>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-200" />
                    </>
                  )}
                </div>

                {/* Logout Button - Fixed at bottom */}
                <div className="p-2 border-t border-slate-200 bg-white flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setShowMoreMenu(false)
                      router.push('/login')
                    }}
                    className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 text-red-600 text-sm font-medium transition-all hover:bg-red-50 group"
                  >
                    <div className="text-red-600">
                      {svgIcon("logout")}
                    </div>
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Not Logged In Message */}
                <div className="p-6 text-center bg-gradient-to-b from-blue-50 to-white">
                  <div className="text-5xl mb-3">✈️</div>
                  <p className="font-bold text-slate-900 mb-1">Ready to Explore?</p>
                  <p className="text-xs text-slate-600">Sign in to save favorites & tracks bookings</p>
                </div>

                {/* Quick Actions */}
                <div className="p-3 space-y-2">
                  {/* View Wishlist */}
                  <Link
                    href="/wishlist"
                    className="flex items-center gap-3 w-full rounded-lg px-4 py-2.5 text-slate-700 text-sm font-medium transition-all hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-300"
                  >
                    <div className="text-red-500">
                      {svgIcon("wishlist")}
                    </div>
                    <span className="flex-1">My Wishlist</span>
                    {wishlist.length > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {wishlist.length}
                      </span>
                    )}
                  </Link>

                  {/* Sign In Button */}
                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 transition-all hover:shadow-md hover:from-blue-700 hover:to-blue-800"
                  >
                    {svgIcon("profile")}
                    <span>Sign In</span>
                  </Link>

                  {/* Sign Up Link */}
                  <Link
                    href="/signup"
                    className="flex items-center justify-center gap-2 w-full rounded-lg px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 border border-blue-200 transition-all hover:bg-blue-100 hover:border-blue-300"
                  >
                    <span>📝</span>
                    <span>Create Account</span>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <nav className="container flex flex-col py-2">
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-3 text-sm font-medium transition border-l-2 ${
                    active
                      ? "text-sky-700 border-sky-600 bg-sky-50"
                      : "text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}

export default Header