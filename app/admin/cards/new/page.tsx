'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCardPage() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    card_tier: '',
    annual_fee: 0,
    reward_token: '',
    default_rewards_rate: 1,
    staking_required: 0,
    image_url: '',
    website_url: '',
    description: '',
    benefits: '',
    is_active: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    // Parse benefits as JSON array
    let benefitsArray: string[] = []
    if (formData.benefits.trim()) {
      benefitsArray = formData.benefits.split('\n').filter(b => b.trim())
    }

    const { error } = await supabase.from('crypto_cards').insert({
      name: formData.name,
      issuer: formData.issuer,
      card_tier: formData.card_tier || null,
      annual_fee: formData.annual_fee,
      reward_token: formData.reward_token,
      rewards_rate: { default: formData.default_rewards_rate },
      staking_required: formData.staking_required,
      image_url: formData.image_url || null,
      website_url: formData.website_url || null,
      description: formData.description || null,
      benefits: benefitsArray,
      is_active: formData.is_active,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/admin/cards')
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/cards" className="text-gray-400 hover:text-white text-sm">
          ← Back to Cards
        </Link>
        <h1 className="text-2xl font-bold text-white mt-2">Add New Card</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Card Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., Crypto.com Visa"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Issuer *
              </label>
              <input
                type="text"
                required
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., Crypto.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Card Tier
              </label>
              <input
                type="text"
                value={formData.card_tier}
                onChange={(e) => setFormData({ ...formData, card_tier: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., Ruby Steel, Jade Green"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Reward Token *
              </label>
              <input
                type="text"
                required
                value={formData.reward_token}
                onChange={(e) => setFormData({ ...formData, reward_token: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="e.g., CRO, BTC, ETH"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Brief description of the card..."
            />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
            Rewards & Fees
          </h2>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Default Rewards Rate (%)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={formData.default_rewards_rate}
                onChange={(e) => setFormData({ ...formData, default_rewards_rate: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Annual Fee ($)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.annual_fee}
                onChange={(e) => setFormData({ ...formData, annual_fee: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Staking Required ($)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                value={formData.staking_required}
                onChange={(e) => setFormData({ ...formData, staking_required: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-4">
          <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
            Benefits & Links
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Benefits (one per line)
            </label>
            <textarea
              value={formData.benefits}
              onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
              placeholder="Free Spotify&#10;Free Netflix&#10;Airport Lounge Access"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Card Image URL
              </label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Website URL
              </label>
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-lime-500 focus:ring-lime-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-400">
              Card is active and visible to users
            </label>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-800 text-white rounded-lg font-medium transition-colors"
          >
            {loading ? 'Adding Card...' : 'Add Card'}
          </button>
          <Link
            href="/admin/cards"
            className="px-6 py-2 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 rounded-lg font-medium transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
