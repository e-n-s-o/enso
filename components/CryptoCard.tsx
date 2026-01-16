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
    card_network?: string
  }
}

// Card color configurations based on actual physical card appearances
export interface CardStyle {
  bg: string
  text: string
  accent?: string
  gradient?: boolean
}

// Crypto.com cards - color by tier
const cryptoComTiers: Record<string, CardStyle> = {
  'Midnight Blue': { bg: 'bg-[#1a2d5a]', text: 'text-white' },
  'Ruby': { bg: 'bg-gradient-to-br from-[#c41e3a] to-[#8b0000]', text: 'text-white', gradient: true },
  'Ruby Steel': { bg: 'bg-gradient-to-br from-[#c41e3a] to-[#8b0000]', text: 'text-white', gradient: true },
  'Jade Green': { bg: 'bg-gradient-to-br from-[#00a86b] to-[#004d40]', text: 'text-white', gradient: true },
  'Royal Indigo': { bg: 'bg-gradient-to-br from-[#4b0082] to-[#2e0854]', text: 'text-white', gradient: true },
  'Icy White': { bg: 'bg-gradient-to-br from-[#f5f5f5] to-[#e0e0e0]', text: 'text-gray-800', gradient: true },
  'Frosted Rose Gold': { bg: 'bg-gradient-to-br from-[#e8c4b8] to-[#b76e79]', text: 'text-gray-800', gradient: true },
  'Rose Gold': { bg: 'bg-gradient-to-br from-[#e8c4b8] to-[#b76e79]', text: 'text-gray-800', gradient: true },
  'Obsidian': { bg: 'bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d]', text: 'text-white', gradient: true },
}

// Gemini cards - color by reward token or name
const geminiVariants: Record<string, CardStyle> = {
  'BTC': { bg: 'bg-gradient-to-br from-[#f7931a] to-[#c47a15]', text: 'text-white', gradient: true }, // Bitcoin Orange
  'XRP': { bg: 'bg-gradient-to-br from-[#23292f] to-[#3a4a5c]', text: 'text-white', gradient: true }, // XRP Blue-gray
  'SOL': { bg: 'bg-gradient-to-br from-[#14f195] via-[#9945ff] to-[#7c3aed]', text: 'text-white', gradient: true }, // Solana gradient
  'ETH': { bg: 'bg-gradient-to-br from-[#627eea] to-[#3c3c3d]', text: 'text-white', gradient: true }, // Ethereum
  'default': { bg: 'bg-gradient-to-br from-[#00dcfa] to-[#7c3aed]', text: 'text-white', gradient: true }, // Default teal-purple
}

// Issuer-based colors for other cards
const issuerStyles: Record<string, CardStyle> = {
  'Coinbase': { bg: 'bg-[#0052ff]', text: 'text-white' }, // Coinbase blue
  'Binance': { bg: 'bg-gradient-to-br from-[#1e2026] to-[#0b0e11]', text: 'text-[#f0b90b]', accent: '#f0b90b', gradient: true }, // Black with gold
  'Nexo': { bg: 'bg-gradient-to-br from-[#1a2d5a] to-[#0d1b33]', text: 'text-white', gradient: true }, // Dark navy
  'BlockFi': { bg: 'bg-gradient-to-br from-[#1a1a1a] to-[#000000]', text: 'text-white', gradient: true }, // Black metal
  'Plutus': { bg: 'bg-gradient-to-br from-[#7c3aed] to-[#4c1d95]', text: 'text-white', gradient: true }, // Purple
  'Wirex': { bg: 'bg-gradient-to-br from-[#00b4d8] to-[#0077b6]', text: 'text-white', gradient: true }, // Blue teal
  'Bybit': { bg: 'bg-gradient-to-br from-[#1e2329] to-[#0d1117]', text: 'text-white', accent: '#f7a600', gradient: true }, // Dark with yellow
  'Fold': { bg: 'bg-gradient-to-br from-[#f97316] to-[#ea580c]', text: 'text-white', gradient: true }, // Bitcoin orange
  'BitPay': { bg: 'bg-gradient-to-br from-[#1a3a5c] to-[#0f2440]', text: 'text-white', gradient: true }, // Navy blue
  'Swipe': { bg: 'bg-gradient-to-br from-[#f7931a] to-[#ff6b00]', text: 'text-white', gradient: true }, // Orange
  'default': { bg: 'bg-gradient-to-br from-[#374151] to-[#1f2937]', text: 'text-white', gradient: true },
}

export function getCardStyle(card: { issuer: string; card_tier?: string; reward_token: string; name: string }): CardStyle {
  // Crypto.com - check tier first
  if (card.issuer === 'Crypto.com' && card.card_tier) {
    const tierStyle = cryptoComTiers[card.card_tier]
    if (tierStyle) return tierStyle
  }

  // Gemini - check reward token or name for variant
  if (card.issuer === 'Gemini') {
    // Check if card name contains variant info
    if (card.name.toLowerCase().includes('bitcoin') || card.reward_token === 'BTC') {
      return geminiVariants['BTC']
    }
    if (card.name.toLowerCase().includes('xrp') || card.reward_token === 'XRP') {
      return geminiVariants['XRP']
    }
    if (card.name.toLowerCase().includes('solana') || card.reward_token === 'SOL') {
      return geminiVariants['SOL']
    }
    if (card.reward_token === 'ETH') {
      return geminiVariants['ETH']
    }
    return geminiVariants['default']
  }

  // Other issuers
  return issuerStyles[card.issuer] || issuerStyles.default
}

export function CryptoCard({ card }: CryptoCardProps) {
  const style = getCardStyle(card)
  const network = card.card_network || 'Visa'

  return (
    <Link href={`/cards/${card.id}`}>
      <div className={`group relative aspect-[1.6/1] ${style.bg} rounded-2xl p-5 overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl cursor-pointer`}>
        {/* Metallic shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

        {/* Top row: Logo + Name + Add button */}
        <div className="relative flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            {/* Issuer icon circle */}
            <div className={`w-9 h-9 rounded-full ${style.text === 'text-gray-800' ? 'bg-black/10' : 'bg-white/20'} backdrop-blur-sm flex items-center justify-center`}>
              <span className={`text-xs font-bold ${style.text}`}>
                {card.issuer.charAt(0)}
              </span>
            </div>
            <span className={`font-semibold ${style.text}`}>{card.issuer}</span>
          </div>

          {/* Add button */}
          <div className={`w-8 h-8 rounded-full border ${style.text === 'text-gray-800' ? 'border-black/20' : 'border-white/30'} flex items-center justify-center opacity-60 group-hover:opacity-100 transition-all`}>
            <svg className={`w-4 h-4 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>

        {/* Card chip */}
        <div className="relative mb-8">
          <div className="w-11 h-8 rounded-[4px] bg-gradient-to-br from-[#d4af37] via-[#f5d779] to-[#d4af37] shadow-md overflow-hidden">
            {/* Chip pattern */}
            <div className="absolute inset-0 flex flex-col justify-center gap-[2px] px-1">
              <div className="h-[3px] bg-[#c9a227]/60 rounded-full" />
              <div className="h-[3px] bg-[#c9a227]/60 rounded-full" />
              <div className="h-[3px] bg-[#c9a227]/60 rounded-full" />
            </div>
            <div className="absolute left-[45%] top-0 bottom-0 w-[2px] bg-[#c9a227]/40" />
          </div>
        </div>

        {/* Card number + Contactless */}
        <div className="relative flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm tracking-[0.2em] ${style.text} opacity-70`}>••••</span>
              <span className={`text-sm tracking-wider font-medium ${style.text}`}>
                {card.id.slice(-4).toUpperCase()}
              </span>
            </div>
            <p className={`text-[10px] uppercase tracking-wider ${style.text} opacity-60 max-w-[140px] truncate`}>
              {card.name}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Contactless symbol */}
            <svg className={`w-5 h-5 ${style.text} opacity-50`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8.5 14.5c0-2.5 2-4 4-4" strokeLinecap="round" />
              <path d="M6 17c0-4.5 3.5-7 6.5-7" strokeLinecap="round" />
              <path d="M3.5 19.5c0-6.5 5-10 9.5-10" strokeLinecap="round" />
            </svg>

            {/* Network logo */}
            {network === 'Visa' ? (
              <span className={`text-lg font-bold italic ${style.text} tracking-wide`}>VISA</span>
            ) : (
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-[#eb001b]" />
                <div className="w-5 h-5 rounded-full bg-[#f79e1b] mix-blend-multiply" />
              </div>
            )}
          </div>
        </div>

        {/* Reward badge - shows on hover */}
        <div className={`absolute top-3 right-12 px-2.5 py-1 ${style.text === 'text-gray-800' ? 'bg-black/10' : 'bg-white/20'} backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity`}>
          <span className={`text-xs font-semibold ${style.text}`}>
            {card.rewards_rate?.default || 0}% {card.reward_token}
          </span>
        </div>

        {/* Card tier badge for Crypto.com */}
        {card.issuer === 'Crypto.com' && card.card_tier && (
          <div className={`absolute bottom-4 right-4 px-2 py-0.5 ${style.text === 'text-gray-800' ? 'bg-black/10' : 'bg-white/10'} rounded text-[9px] uppercase tracking-wider font-medium ${style.text} opacity-60`}>
            {card.card_tier}
          </div>
        )}
      </div>
    </Link>
  )
}

// Reusable card visual component (without Link wrapper)
export function CardVisual({ card, size = 'default' }: {
  card: {
    id: string
    name: string
    issuer: string
    card_tier?: string
    reward_token: string
    card_network?: string
  }
  size?: 'small' | 'default' | 'large'
}) {
  const style = getCardStyle(card)
  const network = card.card_network || 'Visa'

  const sizeClasses = {
    small: 'p-3',
    default: 'p-5',
    large: 'p-6',
  }

  const chipSizes = {
    small: 'w-8 h-6',
    default: 'w-11 h-8',
    large: 'w-14 h-10',
  }

  return (
    <div className={`relative aspect-[1.6/1] ${style.bg} rounded-2xl ${sizeClasses[size]} overflow-hidden`}>
      {/* Metallic shine effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

      {/* Top row: Logo + Name */}
      <div className="relative flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${style.text === 'text-gray-800' ? 'bg-black/10' : 'bg-white/20'} backdrop-blur-sm flex items-center justify-center`}>
            <span className={`text-xs font-bold ${style.text}`}>
              {card.issuer.charAt(0)}
            </span>
          </div>
          <span className={`font-semibold text-sm ${style.text}`}>{card.issuer}</span>
        </div>
      </div>

      {/* Card chip */}
      <div className="relative mb-6">
        <div className={`${chipSizes[size]} rounded-[4px] bg-gradient-to-br from-[#d4af37] via-[#f5d779] to-[#d4af37] shadow-md overflow-hidden`}>
          <div className="absolute inset-0 flex flex-col justify-center gap-[2px] px-1">
            <div className="h-[2px] bg-[#c9a227]/60 rounded-full" />
            <div className="h-[2px] bg-[#c9a227]/60 rounded-full" />
            <div className="h-[2px] bg-[#c9a227]/60 rounded-full" />
          </div>
          <div className="absolute left-[45%] top-0 bottom-0 w-[2px] bg-[#c9a227]/40" />
        </div>
      </div>

      {/* Card number + Network */}
      <div className="relative flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-sm tracking-[0.2em] ${style.text} opacity-70`}>••••</span>
            <span className={`text-sm tracking-wider font-medium ${style.text}`}>
              {card.id.slice(-4).toUpperCase()}
            </span>
          </div>
          <p className={`text-[10px] uppercase tracking-wider ${style.text} opacity-60 max-w-[120px] truncate`}>
            {card.name}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Contactless symbol */}
          <svg className={`w-4 h-4 ${style.text} opacity-50`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8.5 14.5c0-2.5 2-4 4-4" strokeLinecap="round" />
            <path d="M6 17c0-4.5 3.5-7 6.5-7" strokeLinecap="round" />
            <path d="M3.5 19.5c0-6.5 5-10 9.5-10" strokeLinecap="round" />
          </svg>

          {network === 'Visa' ? (
            <span className={`text-base font-bold italic ${style.text} tracking-wide`}>VISA</span>
          ) : (
            <div className="flex -space-x-1">
              <div className="w-4 h-4 rounded-full bg-[#eb001b]" />
              <div className="w-4 h-4 rounded-full bg-[#f79e1b] mix-blend-multiply" />
            </div>
          )}
        </div>
      </div>

      {/* Card tier badge */}
      {card.card_tier && (
        <div className={`absolute bottom-3 right-3 px-2 py-0.5 ${style.text === 'text-gray-800' ? 'bg-black/10' : 'bg-white/10'} rounded text-[8px] uppercase tracking-wider font-medium ${style.text} opacity-60`}>
          {card.card_tier}
        </div>
      )}
    </div>
  )
}

// Mini card for lists/grids
export function CardMini({ card }: {
  card: {
    id: string
    name: string
    issuer: string
    card_tier?: string
    reward_token: string
    card_network?: string
  }
}) {
  const style = getCardStyle(card)
  const network = card.card_network || 'Visa'

  return (
    <div className={`relative aspect-[1.6/1] ${style.bg} rounded-lg p-2.5 overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/30 pointer-events-none" />

      {/* Chip */}
      <div className="w-6 h-4 rounded-[2px] bg-gradient-to-br from-[#d4af37] via-[#f5d779] to-[#d4af37] mb-3" />

      {/* Bottom */}
      <div className="absolute bottom-2 left-2.5 right-2.5 flex justify-between items-end">
        <span className={`text-[8px] ${style.text} opacity-70 truncate max-w-[60%]`}>{card.issuer}</span>
        {network === 'Visa' ? (
          <span className={`text-[10px] font-bold italic ${style.text}`}>VISA</span>
        ) : (
          <div className="flex -space-x-0.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#eb001b]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#f79e1b]" />
          </div>
        )}
      </div>
    </div>
  )
}

export function CryptoCardSkeleton() {
  return (
    <div className="aspect-[1.6/1] bg-gray-200 rounded-2xl p-5 animate-pulse">
      {/* Top row */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gray-300" />
          <div className="w-20 h-4 bg-gray-300 rounded" />
        </div>
        <div className="w-8 h-8 rounded-full bg-gray-300" />
      </div>

      {/* Chip */}
      <div className="w-11 h-8 rounded bg-gray-300 mb-8" />

      {/* Bottom row */}
      <div className="flex items-end justify-between">
        <div>
          <div className="w-24 h-4 bg-gray-300 rounded mb-1" />
          <div className="w-16 h-3 bg-gray-300 rounded" />
        </div>
        <div className="w-12 h-6 bg-gray-300 rounded" />
      </div>
    </div>
  )
}
