import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CardMini } from '@/components/CryptoCard'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's cards count
  const { count: cardsCount } = await supabase
    .from('user_cards')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user?.id)

  // Get user's cards with details
  const { data: userCards } = await supabase
    .from('user_cards')
    .select(`
      id,
      nickname,
      is_primary,
      added_at,
      crypto_cards (
        id,
        name,
        issuer,
        reward_token,
        rewards_rate,
        image_url
      )
    `)
    .eq('user_id', user?.id)
    .order('added_at', { ascending: false })
    .limit(3)

  // Get total cards available
  const { count: totalCards } = await supabase
    .from('crypto_cards')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
        </h1>
        <p className="text-gray-600 mt-2">
          Track your crypto cards and rewards in one place
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">My Cards</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{cardsCount ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <Link href="/dashboard/my-cards" className="text-sm text-emerald-600 hover:text-emerald-700 mt-4 inline-block">
            View all →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rewards</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">$0.00</p>
            </div>
            <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <Link href="/dashboard/rewards" className="text-sm text-teal-600 hover:text-teal-700 mt-4 inline-block">
            Track rewards →
          </Link>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Cards Available</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{totalCards ?? 0}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
          <Link href="/cards" className="text-sm text-cyan-600 hover:text-cyan-700 mt-4 inline-block">
            Browse cards →
          </Link>
        </div>
      </div>

      {/* My Cards Preview */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">My Cards</h2>
          <Link href="/dashboard/my-cards" className="text-sm text-emerald-600 hover:text-emerald-700">
            View all →
          </Link>
        </div>

        {!userCards || userCards.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-gray-900 font-medium mb-2">No cards yet</h3>
            <p className="text-gray-500 mb-4">Add crypto cards to track your rewards</p>
            <Link
              href="/cards"
              className="inline-block px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
            >
              Browse Cards
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {userCards.map((userCard: any) => (
              <Link
                key={userCard.id}
                href={`/cards/${userCard.crypto_cards.id}`}
                className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <div className="w-20 flex-shrink-0">
                  <CardMini card={userCard.crypto_cards} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 font-medium truncate">
                    {userCard.nickname || userCard.crypto_cards.name}
                  </p>
                  <p className="text-sm text-gray-500">{userCard.crypto_cards.issuer}</p>
                </div>
                <span className="text-emerald-600 font-semibold">
                  {userCard.crypto_cards.rewards_rate?.default}%
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link
          href="/cards"
          className="flex items-center gap-4 p-6 bg-white border border-gray-200 hover:border-emerald-500 rounded-xl transition-colors shadow-sm"
        >
          <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-900 font-medium">Add a Card</h3>
            <p className="text-sm text-gray-500">Browse and add crypto cards to your portfolio</p>
          </div>
        </Link>

        <Link
          href="/compare"
          className="flex items-center gap-4 p-6 bg-white border border-gray-200 hover:border-teal-500 rounded-xl transition-colors shadow-sm"
        >
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-gray-900 font-medium">Compare Cards</h3>
            <p className="text-sm text-gray-500">Compare crypto cards side by side</p>
          </div>
        </Link>
      </div>
    </div>
  )
}
