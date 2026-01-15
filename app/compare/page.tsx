import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { CardSelector } from './CardSelector'
import { ComparisonTable } from './ComparisonTable'

interface SearchParams {
  cards?: string
}

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Get selected card IDs from URL
  const selectedIds = params.cards?.split(',').filter(Boolean) || []

  // Fetch all cards for the selector
  const { data: allCards } = await supabase
    .from('crypto_cards')
    .select('id, name, issuer, reward_token, image_url')
    .eq('is_active', true)
    .order('name')

  // Fetch selected cards with full details
  let selectedCards: any[] = []
  if (selectedIds.length > 0) {
    const { data } = await supabase
      .from('crypto_cards')
      .select('*')
      .in('id', selectedIds)
      .eq('is_active', true)

    // Maintain order from URL
    if (data) {
      selectedCards = selectedIds
        .map(id => data.find(card => card.id === id))
        .filter(Boolean)
    }
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold text-white">
            Enzo
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/cards" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cards
            </Link>
            <Link href="/compare" className="text-sm text-lime-400 font-medium">
              Compare
            </Link>
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Compare Cards</h1>
          <p className="text-gray-400 mt-2">
            Select up to 4 cards to compare side-by-side
          </p>
        </div>

        {/* Card Selector */}
        <CardSelector
          allCards={allCards || []}
          selectedIds={selectedIds}
        />

        {/* Comparison Content */}
        {selectedCards.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-white mb-2">No cards selected</h3>
            <p className="text-gray-500 mb-6">
              Use the selector above to add cards for comparison
            </p>
            <Link
              href="/cards"
              className="inline-block px-6 py-3 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium transition-colors"
            >
              Browse Cards
            </Link>
          </div>
        ) : selectedCards.length === 1 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 mb-4">Add at least one more card to compare</p>
            <div className="inline-block bg-gray-900 border border-gray-800 rounded-xl p-6">
              <p className="text-white font-medium">{selectedCards[0].name}</p>
              <p className="text-gray-500 text-sm">{selectedCards[0].issuer}</p>
            </div>
          </div>
        ) : (
          <ComparisonTable cards={selectedCards} />
        )}
      </main>
    </div>
  )
}
