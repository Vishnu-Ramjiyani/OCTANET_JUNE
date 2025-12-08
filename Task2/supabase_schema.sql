-- Create Tasks Table
create table public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  status text check (status in ('todo', 'in_progress', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high')) default 'medium',
  tag_color text,
  due_date timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.tasks enable row level security;

-- Create Policy for ALL operations (Select, Insert, Update, Delete)
create policy "Users can manage their own tasks"
on public.tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
