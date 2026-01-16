import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { CryptoCard } from '@/components/CryptoCard'

export default async function Home() {
  const supabase = await createClient()

  // Get featured cards
  const { data: featuredCards } = await supabase
    .from('crypto_cards')
    .select('id, name, issuer, reward_token, rewards_rate, annual_fee, image_url, card_tier, card_network, staking_required, benefits')
    .eq('is_active', true)
    .limit(3)

  return (
    <div className="min-h-screen bg-white">
      <Navbar activePage="home" />

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
            {featuredCards.map((card: any) => (
              <CryptoCard key={card.id} card={card} />
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
