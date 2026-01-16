import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/Navbar'
import { AddToMyCards } from '@/components/AddToMyCards'
import { CardVisual, CardMini } from '@/components/CryptoCard'

export default async function CardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: card, error } = await supabase
    .from('crypto_cards')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error || !card) {
    notFound()
  }

  // Get related cards (same issuer or token)
  const { data: relatedCards } = await supabase
    .from('crypto_cards')
    .select('id, name, issuer, reward_token, rewards_rate, annual_fee, image_url')
    .eq('is_active', true)
    .neq('id', id)
    .or(`issuer.eq.${card.issuer},reward_token.eq.${card.reward_token}`)
    .limit(3)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="cards" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm">
            <li>
              <Link href="/cards" className="text-gray-500 hover:text-emerald-600 transition-colors">
                Cards
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700">{card.name}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Header */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
              {/* Card Visual */}
              <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center">
                <div className="w-full max-w-md">
                  <CardVisual card={card} size="large" />
                </div>
              </div>

              {/* Card Info */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{card.name}</h1>
                    <p className="text-gray-600">{card.issuer}</p>
                    {card.card_tier && (
                      <span className="inline-block mt-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                        {card.card_tier}
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Reward Token</p>
                    <p className="text-xl font-bold text-emerald-600">{card.reward_token}</p>
                  </div>
                </div>

                {card.description && (
                  <p className="text-gray-600 leading-relaxed">{card.description}</p>
                )}
              </div>
            </div>

            {/* Benefits Section */}
            {card.benefits && card.benefits.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Benefits</h2>
                <ul className="space-y-3">
                  {card.benefits.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Stats */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Rewards Rate</span>
                  <span className="text-gray-900 font-semibold">{card.rewards_rate?.default || 0}%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-600">Annual Fee</span>
                  <span className="text-gray-900 font-semibold">
                    {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
                  </span>
                </div>
                {card.staking_required > 0 && (
                  <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                    <span className="text-gray-600">Staking Required</span>
                    <span className="text-gray-900 font-semibold">${card.staking_required.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Reward Token</span>
                  <span className="text-emerald-600 font-semibold">{card.reward_token}</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-3">
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
              <AddToMyCards cardId={card.id} cardName={card.name} />
              <Link
                href={`/compare?cards=${card.id}`}
                className="block w-full py-3 px-4 border border-gray-300 hover:border-emerald-500 hover:text-emerald-600 text-gray-700 text-center font-medium rounded-lg transition-colors"
              >
                Compare with Others
              </Link>
            </div>

            {/* Related Cards */}
            {relatedCards && relatedCards.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Related Cards</h2>
                <div className="space-y-3">
                  {relatedCards.map((relatedCard) => (
                    <Link
                      key={relatedCard.id}
                      href={`/cards/${relatedCard.id}`}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="w-20 flex-shrink-0">
                        <CardMini card={relatedCard} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{relatedCard.name}</p>
                        <p className="text-xs text-gray-500">{relatedCard.issuer}</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-600">{relatedCard.rewards_rate?.default}%</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
