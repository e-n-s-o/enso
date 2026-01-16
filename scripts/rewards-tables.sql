-- Rewards tracking tables
-- Run this in Supabase SQL Editor

-- User Rewards table - tracks individual reward entries
create table user_rewards (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  user_card_id uuid references user_cards(id) on delete cascade not null,
  amount decimal not null,
  token text not null,
  usd_value_at_earn decimal,
  category text,
  description text,
  earned_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table user_rewards enable row level security;

-- Users can only see their own rewards
create policy "Users can view own rewards"
  on user_rewards for select
  using (auth.uid() = user_id);

-- Users can insert their own rewards
create policy "Users can add rewards"
  on user_rewards for insert
  with check (auth.uid() = user_id);

-- Users can update their own rewards
create policy "Users can update own rewards"
  on user_rewards for update
  using (auth.uid() = user_id);

-- Users can delete their own rewards
create policy "Users can delete own rewards"
  on user_rewards for delete
  using (auth.uid() = user_id);

-- Create indexes
create index user_rewards_user_id_idx on user_rewards(user_id);
create index user_rewards_user_card_id_idx on user_rewards(user_card_id);
create index user_rewards_earned_at_idx on user_rewards(earned_at);

-- Token prices cache table
create table token_prices (
  id uuid default gen_random_uuid() primary key,
  token_symbol text unique not null,
  price_usd decimal not null,
  price_btc decimal,
  updated_at timestamp with time zone default now()
);

-- Enable RLS (public read)
alter table token_prices enable row level security;

-- Anyone can read prices
create policy "Public can view prices"
  on token_prices for select
  using (true);

-- Only authenticated users can update (for edge functions)
create policy "Authenticated can update prices"
  on token_prices for all
  using (auth.role() = 'authenticated');

-- Spending categories
create table spending_categories (
  id uuid default gen_random_uuid() primary key,
  name text unique not null,
  icon text,
  color text
);

-- Enable RLS
alter table spending_categories enable row level security;

-- Public read
create policy "Public can view categories"
  on spending_categories for select
  using (true);

-- Insert default categories
insert into spending_categories (name, icon, color) values
  ('General', 'shopping-bag', 'gray'),
  ('Dining', 'utensils', 'orange'),
  ('Groceries', 'shopping-cart', 'green'),
  ('Travel', 'plane', 'blue'),
  ('Gas', 'fuel', 'yellow'),
  ('Entertainment', 'film', 'purple'),
  ('Online Shopping', 'globe', 'indigo'),
  ('Subscriptions', 'repeat', 'pink'),
  ('Other', 'more-horizontal', 'slate');

-- Verify creation
select 'Tables created successfully' as status;
