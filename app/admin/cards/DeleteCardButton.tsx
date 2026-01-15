'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export function DeleteCardButton({ cardId, cardName }: { cardId: string; cardName: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${cardName}"?`)) {
      return
    }

    setDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('crypto_cards')
      .delete()
      .eq('id', cardId)

    if (error) {
      alert('Failed to delete card: ' + error.message)
      setDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm text-red-400 hover:text-red-300 disabled:text-red-800"
    >
      {deleting ? 'Deleting...' : 'Delete'}
    </button>
  )
}
