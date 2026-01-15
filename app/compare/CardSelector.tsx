'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Card {
  id: string
  name: string
  issuer: string
  reward_token: string
  image_url?: string
}

interface CardSelectorProps {
  allCards: Card[]
  selectedIds: string[]
}

export function CardSelector({ allCards, selectedIds }: CardSelectorProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedCards = allCards.filter(card => selectedIds.includes(card.id))
  const availableCards = allCards.filter(card => !selectedIds.includes(card.id))

  const filteredCards = availableCards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.issuer.toLowerCase().includes(search.toLowerCase()) ||
    card.reward_token.toLowerCase().includes(search.toLowerCase())
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addCard = (cardId: string) => {
    if (selectedIds.length >= 4) {
      alert('You can compare up to 4 cards at a time')
      return
    }
    const newIds = [...selectedIds, cardId]
    router.push(`/compare?cards=${newIds.join(',')}`)
    setIsOpen(false)
    setSearch('')
  }

  const removeCard = (cardId: string) => {
    const newIds = selectedIds.filter(id => id !== cardId)
    if (newIds.length === 0) {
      router.push('/compare')
    } else {
      router.push(`/compare?cards=${newIds.join(',')}`)
    }
  }

  const clearAll = () => {
    router.push('/compare')
  }

  return (
    <div className="mb-8">
      {/* Selected Cards */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {selectedCards.map((card) => (
          <div
            key={card.id}
            className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2"
          >
            {card.image_url ? (
              <img src={card.image_url} alt="" className="w-8 h-5 object-cover rounded" />
            ) : (
              <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-[8px] text-lime-400">{card.reward_token}</span>
              </div>
            )}
            <span className="text-sm text-white">{card.name}</span>
            <button
              onClick={() => removeCard(card.id)}
              className="ml-1 text-gray-500 hover:text-red-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}

        {/* Add Card Button */}
        {selectedIds.length < 4 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-dashed border-gray-700 hover:border-lime-500 rounded-lg text-gray-400 hover:text-lime-400 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm">Add Card</span>
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div className="absolute top-full left-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden">
                {/* Search */}
                <div className="p-3 border-b border-gray-800">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search cards..."
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500"
                    autoFocus
                  />
                </div>

                {/* Card List */}
                <div className="max-h-64 overflow-y-auto">
                  {filteredCards.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No cards found
                    </div>
                  ) : (
                    filteredCards.map((card) => (
                      <button
                        key={card.id}
                        onClick={() => addCard(card.id)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors text-left"
                      >
                        {card.image_url ? (
                          <img src={card.image_url} alt="" className="w-10 h-6 object-cover rounded" />
                        ) : (
                          <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center">
                            <span className="text-[10px] text-lime-400">{card.reward_token}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{card.name}</p>
                          <p className="text-xs text-gray-500">{card.issuer}</p>
                        </div>
                        <span className="text-xs text-lime-400">{card.reward_token}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Clear All */}
        {selectedIds.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Selection Status */}
      <p className="text-sm text-gray-500">
        {selectedIds.length}/4 cards selected
      </p>
    </div>
  )
}
