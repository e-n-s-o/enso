import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RemoveCardButton } from './RemoveCardButton'
import { CardVisual } from '@/components/CryptoCard'

export default async function MyCardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: userCards, error } = await supabase
    .from('user_cards')
    .select(`
      id,
      nickname,
      is_primary,
      notes,
      added_at,
      crypto_cards (
        id,
        name,
        issuer,
        card_tier,
        reward_token,
        rewards_rate,
        annual_fee,
        benefits,
        image_url
      )
    `)
    .eq('user_id', user?.id)
    .order('added_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Cards</h1>
          <p className="text-gray-600 mt-1">Manage your crypto card portfolio</p>
        </div>
        <Link
          href="/cards"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/25"
        >
          + Add Card
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Error loading cards: {error.message}
          <p className="text-sm mt-2">Make sure you&apos;ve created the user_cards table in Supabase.</p>
        </div>
      )}

      {!error && (!userCards || userCards.length === 0) && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No cards in your portfolio</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by browsing our crypto cards and adding the ones you own or are interested in.
          </p>
          <Link
            href="/cards"
            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-emerald-500/25"
          >
            Browse Cards
          </Link>
        </div>
      )}

      {userCards && userCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCards.map((userCard: any) => (
            <div
              key={userCard.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
            >
              {/* Card Visual */}
              <div className="p-4 bg-gray-50 relative">
                <Link href={`/cards/${userCard.crypto_cards.id}`}>
                  <CardVisual card={userCard.crypto_cards} size="small" />
                </Link>
                {userCard.is_primary && (
                  <span className="absolute top-6 right-6 px-2 py-1 bg-emerald-500 text-white text-xs font-medium rounded shadow">
                    Primary
                  </span>
                )}
              </div>

              {/* Card Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {userCard.nickname || userCard.crypto_cards.name}
                    </h3>
                    <p className="text-sm text-gray-500">{userCard.crypto_cards.issuer}</p>
                  </div>
                  <span className="text-emerald-600 font-bold">
                    {userCard.crypto_cards.rewards_rate?.default}%
                  </span>
                </div>

                {userCard.nickname && (
                  <p className="text-xs text-gray-500 mb-2">
                    {userCard.crypto_cards.name}
                  </p>
                )}

                {userCard.notes && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{userCard.notes}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <Link
                    href={`/cards/${userCard.crypto_cards.id}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700"
                  >
                    View Details
                  </Link>
                  <RemoveCardButton userCardId={userCard.id} cardName={userCard.crypto_cards.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
