import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get card count
  const { count: cardCount } = await supabase
    .from('crypto_cards')
    .select('*', { count: 'exact', head: true })

  // Get user count
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage your crypto cards and users</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400">Total Cards</p>
          <p className="text-3xl font-bold text-white mt-2">{cardCount ?? 0}</p>
          <Link
            href="/admin/cards"
            className="text-sm text-lime-500 hover:text-lime-400 mt-4 inline-block"
          >
            View all cards →
          </Link>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400">Total Users</p>
          <p className="text-3xl font-bold text-white mt-2">{userCount ?? 0}</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <p className="text-sm text-gray-400">Quick Actions</p>
          <div className="mt-4 space-y-2">
            <Link
              href="/admin/cards/new"
              className="block text-sm text-lime-500 hover:text-lime-400"
            >
              + Add New Card
            </Link>
          </div>
        </div>
      </div>

      {/* Setup Instructions */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Database Setup Required</h2>
        <p className="text-gray-400 mb-4">
          If you haven&apos;t already, create the <code className="text-lime-500">crypto_cards</code> table in Supabase:
        </p>
        <pre className="bg-gray-950 p-4 rounded-lg overflow-x-auto text-sm text-gray-300">
{`-- Run this in Supabase SQL Editor

create table crypto_cards (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  issuer text not null,
  card_tier text,
  annual_fee decimal default 0,
  rewards_rate jsonb default '{"default": 1}'::jsonb,
  reward_token text not null,
  staking_required decimal default 0,
  benefits jsonb default '[]'::jsonb,
  image_url text,
  website_url text,
  description text,
  is_active boolean default true,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table crypto_cards enable row level security;

-- Allow public read access
create policy "Public can view active cards"
  on crypto_cards for select
  using (is_active = true);

-- Allow authenticated users to manage (for admin)
create policy "Authenticated users can manage cards"
  on crypto_cards for all
  using (auth.role() = 'authenticated');`}
        </pre>
      </div>
    </div>
  )
}
