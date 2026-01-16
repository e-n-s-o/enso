// CoinGecko API integration for crypto prices

// Map common token symbols to CoinGecko IDs
const TOKEN_ID_MAP: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'CRO': 'crypto-com-chain',
  'BNB': 'binancecoin',
  'NEXO': 'nexo',
  'PLU': 'pluton',
  'WXT': 'wirex',
  'XLM': 'stellar',
  'DOGE': 'dogecoin',
  'USDC': 'usd-coin',
  'USDT': 'tether',
  'SOL': 'solana',
  'ADA': 'cardano',
  'DOT': 'polkadot',
  'MATIC': 'matic-network',
  'AVAX': 'avalanche-2',
  'LINK': 'chainlink',
  'UNI': 'uniswap',
  'ATOM': 'cosmos',
  'LTC': 'litecoin',
}

export function getTokenId(symbol: string): string | null {
  return TOKEN_ID_MAP[symbol.toUpperCase()] || null
}

export interface TokenPrice {
  symbol: string
  priceUsd: number
  priceBtc: number
  change24h: number
}

export async function getTokenPrices(symbols: string[]): Promise<Record<string, TokenPrice>> {
  const ids = symbols
    .map(s => TOKEN_ID_MAP[s.toUpperCase()])
    .filter(Boolean)

  if (ids.length === 0) {
    return {}
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=usd,btc&include_24hr_change=true`,
      { next: { revalidate: 300 } } // Cache for 5 minutes
    )

    if (!response.ok) {
      console.error('CoinGecko API error:', response.status)
      return {}
    }

    const data = await response.json()

    const prices: Record<string, TokenPrice> = {}

    for (const symbol of symbols) {
      const id = TOKEN_ID_MAP[symbol.toUpperCase()]
      if (id && data[id]) {
        prices[symbol.toUpperCase()] = {
          symbol: symbol.toUpperCase(),
          priceUsd: data[id].usd || 0,
          priceBtc: data[id].btc || 0,
          change24h: data[id].usd_24h_change || 0,
        }
      }
    }

    return prices
  } catch (error) {
    console.error('Failed to fetch token prices:', error)
    return {}
  }
}

export async function getTokenPrice(symbol: string): Promise<TokenPrice | null> {
  const prices = await getTokenPrices([symbol])
  return prices[symbol.toUpperCase()] || null
}

// Calculate current value of rewards
export function calculateCurrentValue(
  amount: number,
  currentPrice: number
): number {
  return amount * currentPrice
}
