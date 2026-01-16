'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CardMini } from '@/components/CryptoCard'

interface Card {
  id: string
  name: string
  issuer: string
  reward_token: string
  card_tier?: string
  rewards_rate: { default: number }
  image_url?: string
}

export default function AddCardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [cards, setCards] = useState<Card[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [nickname, setNickname] = useState('')
  const [notes, setNotes] = useState('')
  const [isPrimary, setIsPrimary] = useState(false)

  useEffect(() => {
    async function loadCards() {
      const { data } = await supabase
        .from('crypto_cards')
        .select('id, name, issuer, reward_token, rewards_rate, image_url')
        .eq('is_active', true)
        .order('name')

      setCards(data || [])
      setLoading(false)
    }
    loadCards()
  }, [supabase])

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.issuer.toLowerCase().includes(search.toLowerCase())
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCard) {
      setError('Please select a card')
      return
    }

    setSaving(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('user_cards').insert({
      user_id: user.id,
      card_id: selectedCard.id,
      nickname: nickname || null,
      notes: notes || null,
      is_primary: isPrimary,
    })

    if (error) {
      if (error.code === '23505') {
        setError('You have already added this card to your portfolio')
      } else {
        setError(error.message)
      }
      setSaving(false)
    } else {
      router.push('/dashboard/my-cards')
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/my-cards" className="text-gray-500 hover:text-emerald-600 text-sm">
          ← Back to My Cards
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Add Card to Portfolio</h1>
        <p className="text-gray-500 mt-1">Select a card and add custom details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Selection */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Card</h2>

          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 mb-4"
          />

          {/* Card Grid */}
          {loading ? (
            <div className="text-center py-8 text-gray-500">Loading cards...</div>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {filteredCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setSelectedCard(card)}
                  className={`relative p-2 rounded-xl border-2 transition-all text-left ${
                    selectedCard?.id === card.id
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <CardMini card={card} />
                  <div className="mt-2">
                    <p className="text-sm font-medium text-gray-900 truncate">{card.name}</p>
                    <p className="text-xs text-gray-500">{card.issuer}</p>
                  </div>
                  {selectedCard?.id === card.id && (
                    <div className="absolute top-3 right-3 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {filteredCards.length === 0 && !loading && (
            <p className="text-center text-gray-500 py-4">No cards found</p>
          )}
        </div>

        {/* Card Details */}
        {selectedCard && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Card Details</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nickname (optional)
                </label>
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={`e.g., My ${selectedCard.name}`}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Give your card a custom name</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about this card..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isPrimary"
                  checked={isPrimary}
                  onChange={(e) => setIsPrimary(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500"
                />
                <label htmlFor="isPrimary" className="text-sm text-gray-700">
                  Set as primary card
                </label>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!selectedCard || saving}
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? 'Adding...' : 'Add to My Cards'}
          </button>
          <Link
            href="/dashboard/my-cards"
            className="px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
