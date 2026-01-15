import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-[var(--foreground)]">Enzo</h1>
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-[var(--foreground)]"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center space-y-6">
          <h2 className="text-4xl font-bold text-[var(--foreground)]">
            Welcome to Enzo
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            {user
              ? `You're logged in as ${user.email}`
              : 'Get started by creating an account or logging in.'}
          </p>
          {!user && (
            <div className="flex gap-4 justify-center">
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 font-medium text-[var(--foreground)]"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

async function LogoutButton() {
  return (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        className="text-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 text-[var(--foreground)]"
      >
        Logout
      </button>
    </form>
  )
}
