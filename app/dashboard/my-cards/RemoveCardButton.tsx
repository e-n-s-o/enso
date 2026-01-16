'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function RemoveCardButton({ userCardId, cardName }: { userCardId: string; cardName: string }) {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    if (!confirm(`Remove "${cardName}" from your cards?`)) {
      return
    }

    setRemoving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('user_cards')
      .delete()
      .eq('id', userCardId)

    if (error) {
      alert('Failed to remove card: ' + error.message)
      setRemoving(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleRemove}
      disabled={removing}
      className="text-sm text-red-400 hover:text-red-300 disabled:text-red-800"
    >
      {removing ? 'Removing...' : 'Remove'}
    </button>
  )
}
