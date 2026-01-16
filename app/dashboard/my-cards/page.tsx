import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { RemoveCardButton } from './RemoveCardButton'

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
          <h1 className="text-2xl font-bold text-white">My Cards</h1>
          <p className="text-gray-400 mt-1">Manage your crypto card portfolio</p>
        </div>
        <Link
          href="/cards"
          className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium transition-colors"
        >
          + Add Card
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
          Error loading cards: {error.message}
          <p className="text-sm mt-2">Make sure you&apos;ve created the user_cards table in Supabase.</p>
        </div>
      )}

      {!error && (!userCards || userCards.length === 0) && (
        <div className="text-center py-16 bg-gray-900 border border-gray-800 rounded-xl">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-white mb-2">No cards in your portfolio</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start by browsing our crypto cards and adding the ones you own or are interested in.
          </p>
          <Link
            href="/cards"
            className="inline-block px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium transition-colors"
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
              className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors"
            >
              {/* Card Image */}
              <div className="h-32 bg-gradient-to-br from-gray-800 to-gray-900 relative">
                {userCard.crypto_cards.image_url ? (
                  <img
                    src={userCard.crypto_cards.image_url}
                    alt={userCard.crypto_cards.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-16 bg-gradient-to-br from-lime-500/20 to-emerald-500/20 rounded-lg border border-lime-500/30 flex items-center justify-center">
                      <span className="text-lime-500 font-bold">{userCard.crypto_cards.reward_token}</span>
                    </div>
                  </div>
                )}
                {userCard.is_primary && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-lime-500 text-black text-xs font-medium rounded">
                    Primary
                  </span>
                )}
              </div>

              {/* Card Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-white">
                      {userCard.nickname || userCard.crypto_cards.name}
                    </h3>
                    <p className="text-sm text-gray-500">{userCard.crypto_cards.issuer}</p>
                  </div>
                  <span className="text-lime-400 font-bold">
                    {userCard.crypto_cards.rewards_rate?.default}%
                  </span>
                </div>

                {userCard.nickname && (
                  <p className="text-xs text-gray-500 mb-2">
                    {userCard.crypto_cards.name}
                  </p>
                )}

                {userCard.notes && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{userCard.notes}</p>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                  <Link
                    href={`/cards/${userCard.crypto_cards.id}`}
                    className="text-sm text-lime-400 hover:text-lime-300"
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
