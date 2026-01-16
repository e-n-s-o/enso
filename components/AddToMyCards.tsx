'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

interface AddToMyCardsProps {
  cardId: string
  cardName: string
}

export function AddToMyCards({ cardId, cardName }: AddToMyCardsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isAdded, setIsAdded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkStatus() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const { data } = await supabase
          .from('user_cards')
          .select('id')
          .eq('user_id', user.id)
          .eq('card_id', cardId)
          .single()

        setIsAdded(!!data)
      }
      setLoading(false)
    }

    checkStatus()
  }, [cardId, supabase])

  const handleAdd = async () => {
    if (!user) {
      router.push('/login')
      return
    }

    setSaving(true)

    const { error } = await supabase
      .from('user_cards')
      .insert({
        user_id: user.id,
        card_id: cardId,
      })

    if (error) {
      if (error.code === '23505') {
        // Already exists
        setIsAdded(true)
      } else {
        alert('Failed to add card: ' + error.message)
      }
    } else {
      setIsAdded(true)
    }
    setSaving(false)
  }

  const handleRemove = async () => {
    if (!user) return

    setSaving(true)

    const { error } = await supabase
      .from('user_cards')
      .delete()
      .eq('user_id', user.id)
      .eq('card_id', cardId)

    if (error) {
      alert('Failed to remove card: ' + error.message)
    } else {
      setIsAdded(false)
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <button
        disabled
        className="w-full py-3 px-4 border border-gray-200 text-gray-400 rounded-lg font-medium"
      >
        Loading...
      </button>
    )
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/login')}
        className="w-full py-3 px-4 border border-gray-300 hover:border-emerald-500 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add to My Cards
      </button>
    )
  }

  if (isAdded) {
    return (
      <button
        onClick={handleRemove}
        disabled={saving}
        className="w-full py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
      >
        {saving ? (
          'Removing...'
        ) : (
          <>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Added to My Cards
          </>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleAdd}
      disabled={saving}
      className="w-full py-3 px-4 border border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
    >
      {saving ? (
        'Adding...'
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add to My Cards
        </>
      )}
    </button>
  )
}
