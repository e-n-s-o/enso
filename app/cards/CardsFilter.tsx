'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useTransition } from 'react'

interface CardsFilterProps {
  issuers: string[]
  tokens: string[]
  currentFilters: {
    search?: string
    issuer?: string
    token?: string
    sort?: string
  }
}

export function CardsFilter({ issuers, tokens, currentFilters }: CardsFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    startTransition(() => {
      router.push(`/cards?${params.toString()}`)
    })
  }

  const hasFilters = currentFilters.issuer || currentFilters.token

  return (
    <div className="flex flex-wrap items-center gap-3 mb-8">
      {/* Issuer Filter */}
      <div className="relative">
        <select
          value={currentFilters.issuer || ''}
          onChange={(e) => updateFilter('issuer', e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">All Issuers</option>
          {issuers.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>
        {/* Globe icon */}
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
        {/* Chevron */}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Token Filter */}
      <div className="relative">
        <select
          value={currentFilters.token || ''}
          onChange={(e) => updateFilter('token', e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">Any Token</option>
          {tokens.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>
        {/* Card icon */}
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        {/* Chevron */}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Sort Filter */}
      <div className="relative">
        <select
          value={currentFilters.sort || ''}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-full text-sm text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer hover:border-gray-300 transition-colors"
        >
          <option value="">Newest First</option>
          <option value="rewards">Highest Rewards</option>
          <option value="fee-low">Lowest Fee</option>
          <option value="fee-high">Highest Fee</option>
        </select>
        {/* Sort icon */}
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
        </svg>
        {/* Chevron */}
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <button
          onClick={() => startTransition(() => router.push('/cards'))}
          className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          Clear
        </button>
      )}

      {/* Loading Indicator */}
      {isPending && (
        <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      )}
    </div>
  )
}
