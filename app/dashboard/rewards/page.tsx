import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteRewardButton } from './DeleteRewardButton'
import { getTokenPrices } from '@/lib/coingecko'
import { CardMini } from '@/components/CryptoCard'

export default async function RewardsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's rewards with card details
  const { data: rewards, error } = await supabase
    .from('user_rewards')
    .select(`
      id,
      amount,
      token,
      usd_value_at_earn,
      category,
      description,
      earned_at,
      user_cards (
        nickname,
        crypto_cards (
          name,
          issuer,
          image_url
        )
      )
    `)
    .eq('user_id', user?.id)
    .order('earned_at', { ascending: false })

  // Calculate totals by token
  const tokenTotals: Record<string, { amount: number; usdValueAtEarn: number }> = {}
  let totalUsdValueAtEarn = 0

  rewards?.forEach((reward: any) => {
    if (!tokenTotals[reward.token]) {
      tokenTotals[reward.token] = { amount: 0, usdValueAtEarn: 0 }
    }
    tokenTotals[reward.token].amount += reward.amount
    if (reward.usd_value_at_earn) {
      tokenTotals[reward.token].usdValueAtEarn += reward.usd_value_at_earn
      totalUsdValueAtEarn += reward.usd_value_at_earn
    }
  })

  // Fetch current prices for all tokens
  const tokenSymbols = Object.keys(tokenTotals)
  const prices = await getTokenPrices(tokenSymbols)

  // Calculate current total value
  let currentTotalValue = 0
  Object.entries(tokenTotals).forEach(([token, data]) => {
    if (prices[token]) {
      currentTotalValue += data.amount * prices[token].priceUsd
    }
  })

  const profitLoss = currentTotalValue - totalUsdValueAtEarn
  const profitLossPercent = totalUsdValueAtEarn > 0 ? (profitLoss / totalUsdValueAtEarn) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rewards Tracker</h1>
          <p className="text-gray-500 mt-1">Track your crypto rewards across all cards</p>
        </div>
        <Link
          href="/dashboard/rewards/add"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
        >
          + Log Reward
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Current Value</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${currentTotalValue.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">Live prices</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Value at Earn</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            ${totalUsdValueAtEarn.toFixed(2)}
          </p>
          <p className="text-xs text-gray-400 mt-1">When earned</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Profit/Loss</p>
          <p className={`text-3xl font-bold mt-2 ${profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {profitLoss >= 0 ? '+' : ''}{profitLoss.toFixed(2)}
          </p>
          <p className={`text-xs mt-1 ${profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
            {profitLossPercent >= 0 ? '+' : ''}{profitLossPercent.toFixed(1)}%
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500">Total Entries</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{rewards?.length || 0}</p>
          <p className="text-xs text-gray-400 mt-1">{Object.keys(tokenTotals).length} tokens</p>
        </div>
      </div>

      {/* Token Breakdown */}
      {Object.keys(tokenTotals).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rewards by Token</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(tokenTotals).map(([token, data]) => {
              const price = prices[token]
              const currentValue = price ? data.amount * price.priceUsd : 0
              const tokenProfitLoss = price ? currentValue - data.usdValueAtEarn : 0

              return (
                <div key={token} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">{token}</p>
                      <p className="text-lg font-bold text-gray-900">{data.amount.toFixed(6)}</p>
                    </div>
                    {price && (
                      <div className="text-right">
                        <p className="text-sm text-gray-500">${price.priceUsd.toFixed(4)}</p>
                        <p className={`text-xs ${price.change24h >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {price.change24h >= 0 ? '+' : ''}{price.change24h.toFixed(2)}%
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Current value</span>
                    <span className="font-medium text-gray-900">${currentValue.toFixed(2)}</span>
                  </div>
                  {data.usdValueAtEarn > 0 && (
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-500">P/L</span>
                      <span className={`font-medium ${tokenProfitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {tokenProfitLoss >= 0 ? '+' : ''}${tokenProfitLoss.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Rewards List */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Error loading rewards: {error.message}
          <p className="text-sm mt-2">Make sure you&apos;ve created the user_rewards table.</p>
        </div>
      )}

      {!error && (!rewards || rewards.length === 0) && (
        <div className="text-center py-16 bg-white border border-gray-200 rounded-xl">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No rewards logged yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start tracking your crypto rewards by logging your first entry.
          </p>
          <Link
            href="/dashboard/rewards/add"
            className="inline-block px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium transition-colors"
          >
            Log Your First Reward
          </Link>
        </div>
      )}

      {rewards && rewards.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rewards</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {rewards.map((reward: any) => {
              const price = prices[reward.token]
              const currentValue = price ? reward.amount * price.priceUsd : null

              return (
                <div key={reward.id} className="px-6 py-4 flex items-center gap-4">
                  {reward.user_cards?.crypto_cards ? (
                    <div className="w-16 flex-shrink-0">
                      <CardMini card={reward.user_cards.crypto_cards} />
                    </div>
                  ) : (
                    <div className="w-16 h-10 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0">
                      <span className="text-xs text-emerald-600 font-medium">{reward.token}</span>
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">
                      +{reward.amount} {reward.token}
                    </p>
                    <p className="text-sm text-gray-500">
                      {reward.user_cards?.nickname || reward.user_cards?.crypto_cards?.name}
                      {reward.category && ` • ${reward.category}`}
                    </p>
                    {reward.description && (
                      <p className="text-xs text-gray-400 truncate">{reward.description}</p>
                    )}
                  </div>

                  <div className="text-right">
                    {currentValue !== null && (
                      <p className="font-medium text-emerald-600">${currentValue.toFixed(2)}</p>
                    )}
                    {reward.usd_value_at_earn && (
                      <p className="text-xs text-gray-400">
                        Earned: ${reward.usd_value_at_earn.toFixed(2)}
                      </p>
                    )}
                    <p className="text-xs text-gray-400">
                      {new Date(reward.earned_at).toLocaleDateString()}
                    </p>
                  </div>

                  <DeleteRewardButton rewardId={reward.id} />
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
