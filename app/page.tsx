import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { isAdminEmail } from '@/lib/constants'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get featured cards
  const { data: featuredCards } = await supabase
    .from('crypto_cards')
    .select('id, name, issuer, reward_token, rewards_rate, annual_fee, image_url')
    .eq('is_active', true)
    .limit(3)

  const isAdmin = isAdminEmail(user?.email)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
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
            {user ? (
              <>
                {isAdmin && (
                  <Link href="/admin" className="text-sm text-emerald-600 hover:text-emerald-700 transition-colors">
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center space-y-6">
          <h1 className="text-5xl font-bold text-gray-900 leading-tight">
            Find the Best <span className="text-emerald-500">Crypto Card</span>
            <br />for Your Spending
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Compare crypto credit and debit cards, track your rewards, and maximize your crypto cashback.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link
              href="/cards"
              className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/25"
            >
              Browse Cards
            </Link>
            <Link
              href="/compare"
              className="px-8 py-4 border border-gray-300 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 rounded-lg font-medium transition-colors"
            >
              Compare Cards
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Compare Cards</h3>
            <p className="text-gray-600">
              Compare crypto cards side-by-side to find the perfect fit for your spending habits.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Rewards</h3>
            <p className="text-gray-600">
              Monitor your crypto rewards across all your cards in one unified dashboard.
            </p>
          </div>

          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Insights</h3>
            <p className="text-gray-600">
              Get personalized recommendations to maximize your crypto cashback.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Cards Section */}
      {featuredCards && featuredCards.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Featured Cards</h2>
            <Link href="/cards" className="text-emerald-500 hover:text-emerald-600 text-sm font-medium">
              View all cards →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCards.map((card) => (
              <Link key={card.id} href={`/cards/${card.id}`}>
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300">
                  <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
                    {card.image_url ? (
                      <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">{card.reward_token}</span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900">{card.name}</h3>
                    <p className="text-sm text-gray-500">{card.issuer}</p>
                    <div className="flex justify-between mt-3 text-sm">
                      <span className="text-gray-500">
                        {card.annual_fee === 0 ? 'No annual fee' : `$${card.annual_fee}/yr`}
                      </span>
                      <span className="text-emerald-600 font-medium">{card.rewards_rate?.default}% back</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p className="text-gray-500 text-sm">
              © 2025 Enzo. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/cards" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                Cards
              </Link>
              <Link href="/compare" className="text-sm text-gray-500 hover:text-emerald-600 transition-colors">
                Compare
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
