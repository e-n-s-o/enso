import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { isAdminEmail } from '@/lib/constants'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Redirect to login if not authenticated
  if (!user) {
    redirect('/login')
  }

  const isAdmin = isAdminEmail(user.email)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-gray-900">
            Enzo
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/cards" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
              Cards
            </Link>
            <Link href="/compare" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
              Compare
            </Link>
            <Link href="/dashboard" className="text-sm text-emerald-600 font-medium">
              Dashboard
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-sm text-gray-600 hover:text-emerald-600 transition-colors">
                Admin
              </Link>
            )}
            <span className="text-sm text-gray-500">{user.email}</span>
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-sm px-4 py-2 border border-gray-300 text-gray-600 hover:text-gray-900 hover:border-gray-400 rounded-lg transition-colors"
              >
                Logout
              </button>
            </form>
          </nav>
        </div>
      </header>

      {/* Dashboard Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-6">
            <Link
              href="/dashboard"
              className="py-4 text-sm font-medium text-gray-600 hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-500 transition-colors"
            >
              Overview
            </Link>
            <Link
              href="/dashboard/my-cards"
              className="py-4 text-sm font-medium text-gray-600 hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-500 transition-colors"
            >
              My Cards
            </Link>
            <Link
              href="/dashboard/rewards"
              className="py-4 text-sm font-medium text-gray-600 hover:text-emerald-600 border-b-2 border-transparent hover:border-emerald-500 transition-colors"
            >
              Rewards
            </Link>
          </nav>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
