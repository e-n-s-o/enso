import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { isAdminEmail } from '@/lib/constants'

interface NavbarProps {
  activePage?: 'home' | 'cards' | 'compare' | 'dashboard'
}

export async function Navbar({ activePage }: NavbarProps) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAdmin = isAdminEmail(user?.email)

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-gray-900">
          Enzo
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/cards"
            className={`text-sm transition-colors ${
              activePage === 'cards'
                ? 'text-emerald-600 font-medium'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            Cards
          </Link>
          <Link
            href="/compare"
            className={`text-sm transition-colors ${
              activePage === 'compare'
                ? 'text-emerald-600 font-medium'
                : 'text-gray-600 hover:text-emerald-600'
            }`}
          >
            Compare
          </Link>
          {user ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/dashboard"
                className={`text-sm transition-colors ${
                  activePage === 'dashboard'
                    ? 'text-emerald-600 font-medium'
                    : 'text-gray-600 hover:text-emerald-600'
                }`}
              >
                Dashboard
              </Link>
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="text-sm px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
