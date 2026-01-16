import Link from 'next/link'

interface CryptoCardProps {
  card: {
    id: string
    name: string
    issuer: string
    card_tier?: string
    annual_fee: number
    rewards_rate: { default: number }
    reward_token: string
    staking_required: number
    benefits: string[]
    image_url?: string
    description?: string
  }
}

export function CryptoCard({ card }: CryptoCardProps) {
  return (
    <Link href={`/cards/${card.id}`}>
      <div className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-emerald-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
        {/* Card Image or Gradient */}
        <div className="h-40 bg-gradient-to-br from-emerald-50 to-teal-50 relative overflow-hidden">
          {card.image_url ? (
            <img
              src={card.image_url}
              alt={card.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-lg border border-emerald-500/30 flex items-center justify-center">
                <span className="text-emerald-600 font-bold text-lg">{card.reward_token}</span>
              </div>
            </div>
          )}

          {/* Reward Token Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
            <span className="text-xs font-medium text-emerald-600">{card.reward_token}</span>
          </div>
        </div>

        {/* Card Info */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {card.name}
            </h3>
            <p className="text-sm text-gray-500">{card.issuer}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Rewards</p>
              <p className="text-sm font-semibold text-gray-900">{card.rewards_rate?.default || 0}%</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-500">Annual Fee</p>
              <p className="text-sm font-semibold text-gray-900">
                {card.annual_fee === 0 ? 'Free' : `$${card.annual_fee}`}
              </p>
            </div>
          </div>

          {/* Benefits Preview */}
          {card.benefits && card.benefits.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.benefits.slice(0, 2).map((benefit, i) => (
                <span
                  key={i}
                  className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                >
                  {benefit}
                </span>
              ))}
              {card.benefits.length > 2 && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                  +{card.benefits.length - 2} more
                </span>
              )}
            </div>
          )}

          {/* Staking Badge */}
          {card.staking_required > 0 && (
            <p className="text-xs text-gray-500">
              Requires ${card.staking_required.toLocaleString()} staking
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

export function CryptoCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="space-y-2">
          <div className="h-5 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-gray-100 rounded-lg" />
          <div className="h-12 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
