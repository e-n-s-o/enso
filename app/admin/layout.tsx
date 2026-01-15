import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { isAdminEmail } from '@/lib/constants'
import Link from 'next/link'

export default async function AdminLayout({
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

  // Redirect to home if not admin
  if (!isAdminEmail(user.email)) {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Admin Header */}
      <header className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="text-xl font-bold text-white">
              Enzo Admin
            </Link>
            <nav className="flex items-center gap-4">
              <Link
                href="/admin"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <Link
                href="/admin/cards"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cards
              </Link>
              <Link
                href="/admin/cards/new"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Add Card
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user.email}</span>
            <Link
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}
