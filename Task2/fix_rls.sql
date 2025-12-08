-- 1. Drop potentially conflicting policies to ensure a clean slate
drop policy if exists "Users can manage their own tasks" on public.tasks;
drop policy if exists "Users can select their own tasks" on public.tasks;
drop policy if exists "Users can insert their own tasks" on public.tasks;
drop policy if exists "Users can update their own tasks" on public.tasks;
drop policy if exists "Users can delete their own tasks" on public.tasks;

-- 2. Enable RLS (idempotent)
alter table public.tasks enable row level security;

-- 3. Create the comprehensive policy for ALL operations
create policy "Users can manage their own tasks"
on public.tasks
for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Optional: Add trigger to auto-update 'updated_at' feature
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

drop trigger if exists update_tasks_updated_at on public.tasks;

create trigger update_tasks_updated_at
before update on public.tasks
for each row
execute function update_updated_at_column();
