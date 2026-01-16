'use client'

import Link from 'next/link'

interface Card {
  id: string
  name: string
  issuer: string
  card_tier?: string
  annual_fee: number
  rewards_rate: { default: number; [key: string]: number }
  reward_token: string
  staking_required: number
  benefits: string[]
  image_url?: string
  website_url?: string
  description?: string
}

interface ComparisonTableProps {
  cards: Card[]
}

export function ComparisonTable({ cards }: ComparisonTableProps) {
  // Find the best values for highlighting
  const bestReward = Math.max(...cards.map(c => c.rewards_rate?.default || 0))
  const lowestFee = Math.min(...cards.map(c => c.annual_fee))
  const lowestStake = Math.min(...cards.map(c => c.staking_required))
  const mostBenefits = Math.max(...cards.map(c => c.benefits?.length || 0))

  return (
    <div className="space-y-6">
      {/* Card Headers */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}>
        {cards.map((card) => (
          <div key={card.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            {/* Card Image */}
            <div className="h-32 bg-gradient-to-br from-emerald-50 to-teal-50 relative">
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-600 font-bold">{card.reward_token}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Card Info */}
            <div className="p-4 text-center">
              <Link href={`/cards/${card.id}`} className="hover:text-emerald-600 transition-colors">
                <h3 className="font-semibold text-gray-900">{card.name}</h3>
              </Link>
              <p className="text-sm text-gray-500">{card.issuer}</p>
              {card.card_tier && (
                <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                  {card.card_tier}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full">
          <tbody className="divide-y divide-gray-100">
            {/* Rewards Rate */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700 w-40">
                Rewards Rate
              </td>
              {cards.map((card) => {
                const isBest = (card.rewards_rate?.default || 0) === bestReward
                return (
                  <td key={card.id} className="px-4 py-4 text-center">
                    <span className={`text-lg font-bold ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {card.rewards_rate?.default || 0}%
                    </span>
                    {isBest && cards.length > 1 && (
                      <span className="block text-xs text-emerald-600 mt-1">Best</span>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* Reward Token */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700">
                Reward Token
              </td>
              {cards.map((card) => (
                <td key={card.id} className="px-4 py-4 text-center">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                    {card.reward_token}
                  </span>
                </td>
              ))}
            </tr>

            {/* Annual Fee */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700">
                Annual Fee
              </td>
              {cards.map((card) => {
                const isBest = card.annual_fee === lowestFee
                return (
                  <td key={card.id} className="px-4 py-4 text-center">
                    <span className={`text-lg font-bold ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
                    </span>
                    {isBest && lowestFee === 0 && cards.length > 1 && (
                      <span className="block text-xs text-emerald-600 mt-1">No fee</span>
                    )}
                  </td>
                )
              })}
            </tr>

            {/* Staking Required */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700">
                Staking Required
              </td>
              {cards.map((card) => {
                const isBest = card.staking_required === lowestStake
                return (
                  <td key={card.id} className="px-4 py-4 text-center">
                    <span className={`font-medium ${isBest && lowestStake === 0 ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {card.staking_required === 0 ? 'None' : `$${card.staking_required.toLocaleString()}`}
                    </span>
                  </td>
                )
              })}
            </tr>

            {/* Benefits Count */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700">
                Benefits
              </td>
              {cards.map((card) => {
                const count = card.benefits?.length || 0
                const isBest = count === mostBenefits && count > 0
                return (
                  <td key={card.id} className="px-4 py-4 text-center">
                    <span className={`font-medium ${isBest ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {count} {count === 1 ? 'benefit' : 'benefits'}
                    </span>
                  </td>
                )
              })}
            </tr>

            {/* Benefits List */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700 align-top">
                Benefits List
              </td>
              {cards.map((card) => (
                <td key={card.id} className="px-4 py-4 align-top">
                  {card.benefits && card.benefits.length > 0 ? (
                    <ul className="space-y-2">
                      {card.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <svg className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-gray-500 text-sm">No benefits listed</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Description */}
            <tr>
              <td className="px-4 py-4 bg-gray-50 font-medium text-gray-700 align-top">
                Description
              </td>
              {cards.map((card) => (
                <td key={card.id} className="px-4 py-4 align-top">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {card.description || 'No description available'}
                  </p>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Action Buttons */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cards.length}, 1fr)` }}>
        {cards.map((card) => (
          <div key={card.id} className="flex flex-col gap-2">
            {card.website_url && (
              <a
                href={card.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white text-center font-medium rounded-lg transition-colors shadow-lg shadow-emerald-500/25"
              >
                Apply Now
              </a>
            )}
            <Link
              href={`/cards/${card.id}`}
              className="block w-full py-3 px-4 border border-gray-300 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 text-center font-medium rounded-lg transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Share Link */}
      <div className="text-center pt-4">
        <ShareButton />
      </div>
    </div>
  )
}

function ShareButton() {
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
      Share this comparison
    </button>
  )
}
