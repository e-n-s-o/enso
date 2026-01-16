-- User Cards table - stores cards that users have added to their portfolio
-- Run this in Supabase SQL Editor

-- Create user_cards table
create table user_cards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  card_id uuid references crypto_cards(id) on delete cascade not null,
  nickname text,
  is_primary boolean default false,
  notes text,
  added_at timestamp with time zone default now(),

  -- Ensure a user can't add the same card twice
  unique(user_id, card_id)
);

-- Enable RLS
alter table user_cards enable row level security;

-- Users can only see their own cards
create policy "Users can view own cards"
  on user_cards for select
  using (auth.uid() = user_id);

-- Users can insert their own cards
create policy "Users can add cards"
  on user_cards for insert
  with check (auth.uid() = user_id);

-- Users can update their own cards
create policy "Users can update own cards"
  on user_cards for update
  using (auth.uid() = user_id);

-- Users can delete their own cards
create policy "Users can delete own cards"
  on user_cards for delete
  using (auth.uid() = user_id);

-- Create index for faster lookups
create index user_cards_user_id_idx on user_cards(user_id);
create index user_cards_card_id_idx on user_cards(card_id);

-- Verify creation
select 'user_cards table created successfully' as status;
