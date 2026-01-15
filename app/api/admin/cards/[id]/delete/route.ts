import { createClient } from '@/lib/supabase/server'
import { isAdminEmail } from '@/lib/constants'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()

  // Check if user is admin
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Delete the card
  await supabase.from('crypto_cards').delete().eq('id', id)

  return NextResponse.redirect(new URL('/admin/cards', request.url))
}
