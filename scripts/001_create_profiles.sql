-- Create profiles table linked to Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default '',
  email text not null default '',
  role text not null default 'STUDENT' check (role in ('STUDENT', 'TEACHER', 'ADMIN')),
  department text not null default '',
  semester integer,
  created_at timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

-- Users can insert their own profile (trigger handles this)
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- Users can update their own profile
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Allow all authenticated users to read any profile (needed for admin views)
create policy "profiles_select_authenticated" on public.profiles
  for select using (auth.role() = 'authenticated');
