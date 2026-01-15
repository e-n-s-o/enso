import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteCardButton } from './DeleteCardButton'

export default async function AdminCardsPage() {
  const supabase = await createClient()

  const { data: cards, error } = await supabase
    .from('crypto_cards')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Crypto Cards</h1>
          <p className="text-gray-400 mt-1">Manage all crypto cards in the database</p>
        </div>
        <Link
          href="/admin/cards/new"
          className="px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium transition-colors"
        >
          + Add Card
        </Link>
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded-lg">
          Error loading cards: {error.message}
          <p className="text-sm mt-2">Make sure you&apos;ve created the crypto_cards table in Supabase.</p>
        </div>
      )}

      {!error && (!cards || cards.length === 0) && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center">
          <p className="text-gray-400">No cards yet. Add your first crypto card!</p>
          <Link
            href="/admin/cards/new"
            className="inline-block mt-4 px-4 py-2 bg-lime-600 hover:bg-lime-700 text-white rounded-lg font-medium transition-colors"
          >
            + Add Card
          </Link>
        </div>
      )}

      {cards && cards.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Card</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Issuer</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Reward Token</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Annual Fee</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {cards.map((card) => (
                <tr key={card.id} className="hover:bg-gray-800/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {card.image_url && (
                        <img
                          src={card.image_url}
                          alt={card.name}
                          className="w-10 h-6 object-cover rounded"
                        />
                      )}
                      <span className="text-white font-medium">{card.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{card.issuer}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 bg-lime-900/30 text-lime-400 rounded text-sm">
                      {card.reward_token}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-sm ${
                      card.is_active
                        ? 'bg-green-900/30 text-green-400'
                        : 'bg-red-900/30 text-red-400'
                    }`}>
                      {card.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/cards/${card.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </Link>
                      <span className="text-gray-600">|</span>
                      <DeleteCardButton cardId={card.id} cardName={card.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
