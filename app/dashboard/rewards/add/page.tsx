'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CardMini } from '@/components/CryptoCard'

interface UserCard {
  id: string
  nickname: string | null
  crypto_cards: {
    id: string
    name: string
    issuer: string
    reward_token: string
    image_url?: string
  }
}

interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export default function AddRewardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [userCards, setUserCards] = useState<UserCard[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedCardId, setSelectedCardId] = useState('')
  const [amount, setAmount] = useState('')
  const [token, setToken] = useState('')
  const [usdValue, setUsdValue] = useState('')
  const [category, setCategory] = useState('General')
  const [description, setDescription] = useState('')
  const [earnedAt, setEarnedAt] = useState(new Date().toISOString().split('T')[0])

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // Load user's cards
      const { data: cards } = await supabase
        .from('user_cards')
        .select(`
          id,
          nickname,
          crypto_cards (
            id,
            name,
            issuer,
            reward_token,
            image_url
          )
        `)
        .eq('user_id', user.id)

      // Load categories
      const { data: cats } = await supabase
        .from('spending_categories')
        .select('*')
        .order('name')

      setUserCards(cards || [])
      setCategories(cats || [])
      setLoading(false)
    }
    loadData()
  }, [supabase, router])

  // Auto-fill token when card is selected
  useEffect(() => {
    if (selectedCardId) {
      const card = userCards.find(c => c.id === selectedCardId)
      if (card) {
        setToken(card.crypto_cards.reward_token)
      }
    }
  }, [selectedCardId, userCards])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCardId || !amount || !token) {
      setError('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { error } = await supabase.from('user_rewards').insert({
      user_id: user.id,
      user_card_id: selectedCardId,
      amount: parseFloat(amount),
      token,
      usd_value_at_earn: usdValue ? parseFloat(usdValue) : null,
      category,
      description: description || null,
      earned_at: new Date(earnedAt).toISOString(),
    })

    if (error) {
      setError(error.message)
      setSaving(false)
    } else {
      router.push('/dashboard/rewards')
      router.refresh()
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12 text-gray-500">Loading...</div>
      </div>
    )
  }

  if (userCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-12 bg-white border border-gray-200 rounded-xl">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No cards in your portfolio</h2>
          <p className="text-gray-500 mb-4">Add a card first to start tracking rewards</p>
          <Link
            href="/dashboard/my-cards/add"
            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg"
          >
            Add a Card
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard/rewards" className="text-gray-500 hover:text-emerald-600 text-sm">
          ← Back to Rewards
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Log Reward</h1>
        <p className="text-gray-500 mt-1">Record crypto rewards earned from your cards</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Selection */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Card</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {userCards.map((card) => (
              <button
                key={card.id}
                type="button"
                onClick={() => setSelectedCardId(card.id)}
                className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                  selectedCardId === card.id
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <CardMini card={card.crypto_cards} />
                <div className="mt-2">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {card.nickname || card.crypto_cards.name}
                  </p>
                  <p className="text-xs text-gray-500">{card.crypto_cards.issuer}</p>
                </div>
                {selectedCardId === card.id && (
                  <div className="absolute top-4 right-4 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Reward Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Reward Details</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="any"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token *
                </label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                  placeholder="BTC, ETH, CRO..."
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  USD Value (optional)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={usdValue}
                  onChange={(e) => setUsdValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500 mt-1">Value at time of earning</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Earned
                </label>
                <input
                  type="date"
                  value={earnedAt}
                  onChange={(e) => setEarnedAt(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
                {categories.length === 0 && <option value="General">General</option>}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g., Grocery shopping at Whole Foods"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!selectedCardId || !amount || !token || saving}
            className="flex-1 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-300 text-white font-medium rounded-lg transition-colors"
          >
            {saving ? 'Saving...' : 'Log Reward'}
          </button>
          <Link
            href="/dashboard/rewards"
            className="px-6 py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
