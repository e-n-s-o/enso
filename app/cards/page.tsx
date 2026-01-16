import { createClient } from '@/lib/supabase/server'
import { CryptoCard } from '@/components/CryptoCard'
import { Navbar } from '@/components/Navbar'
import { CardsFilter } from './CardsFilter'

interface SearchParams {
  search?: string
  issuer?: string
  token?: string
  sort?: string
}

export default async function CardsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Build query
  let query = supabase
    .from('crypto_cards')
    .select('*')
    .eq('is_active', true)

  // Apply filters
  if (params.issuer) {
    query = query.eq('issuer', params.issuer)
  }

  if (params.token) {
    query = query.eq('reward_token', params.token)
  }

  if (params.search) {
    query = query.or(`name.ilike.%${params.search}%,issuer.ilike.%${params.search}%`)
  }

  // Apply sorting
  switch (params.sort) {
    case 'rewards':
      query = query.order('rewards_rate->default', { ascending: false })
      break
    case 'fee-low':
      query = query.order('annual_fee', { ascending: true })
      break
    case 'fee-high':
      query = query.order('annual_fee', { ascending: false })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data: cards, error } = await query

  // Get unique issuers and tokens for filters
  const { data: allCards } = await supabase
    .from('crypto_cards')
    .select('issuer, reward_token')
    .eq('is_active', true)

  const issuers = [...new Set(allCards?.map(c => c.issuer) || [])]
  const tokens = [...new Set(allCards?.map(c => c.reward_token) || [])]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="cards" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Explore Cards</h1>
        </div>

        {/* Filters */}
        <CardsFilter
          issuers={issuers}
          tokens={tokens}
          currentFilters={params}
        />

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
            Error loading cards: {error.message}
          </div>
        )}

        {/* Empty State */}
        {!error && (!cards || cards.length === 0) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No cards found</h3>
            <p className="text-gray-500">
              {params.search || params.issuer || params.token
                ? 'Try adjusting your filters'
                : 'Check back soon for new crypto cards'}
            </p>
          </div>
        )}

        {/* Cards Grid */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cards.map((card) => (
              <CryptoCard key={card.id} card={card} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
