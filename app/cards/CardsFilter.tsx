'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

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
  const [search, setSearch] = useState(currentFilters.search || '')

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilter('search', search)
  }

  const clearFilters = () => {
    setSearch('')
    startTransition(() => {
      router.push('/cards')
    })
  }

  const hasFilters = currentFilters.search || currentFilters.issuer || currentFilters.token || currentFilters.sort

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards..."
            className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-lime-600 hover:bg-lime-700 disabled:bg-lime-800 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </form>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Issuer Filter */}
        <select
          value={currentFilters.issuer || ''}
          onChange={(e) => updateFilter('issuer', e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="">All Issuers</option>
          {issuers.map((issuer) => (
            <option key={issuer} value={issuer}>
              {issuer}
            </option>
          ))}
        </select>

        {/* Token Filter */}
        <select
          value={currentFilters.token || ''}
          onChange={(e) => updateFilter('token', e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="">All Tokens</option>
          {tokens.map((token) => (
            <option key={token} value={token}>
              {token}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={currentFilters.sort || ''}
          onChange={(e) => updateFilter('sort', e.target.value)}
          className="px-3 py-2 bg-gray-900 border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
        >
          <option value="">Sort: Newest</option>
          <option value="rewards">Highest Rewards</option>
          <option value="fee-low">Lowest Fee</option>
          <option value="fee-high">Highest Fee</option>
        </select>

        {/* Clear Filters */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}

        {/* Loading Indicator */}
        {isPending && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Loading...
          </div>
        )}
      </div>
    </div>
  )
}
