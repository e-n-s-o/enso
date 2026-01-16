'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function DeleteRewardButton({ rewardId }: { rewardId: string }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this reward entry?')) return

    setDeleting(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('user_rewards')
      .delete()
      .eq('id', rewardId)

    if (error) {
      alert('Failed to delete: ' + error.message)
      setDeleting(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
      title="Delete"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </button>
  )
}
