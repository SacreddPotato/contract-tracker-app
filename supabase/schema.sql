create extension if not exists "pgcrypto";

create table if not exists public.employees (
    id uuid primary key default gen_random_uuid(),
    owner_id uuid not null references auth.users(id) on delete cascade,
    name text not null check (length(btrim(name)) > 0),
    contract_start_date date not null,
    contract_end_date date not null,
    iqama_start_date date null,
    iqama_end_date date null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index if not exists employees_owner_contract_end_date_index
    on public.employees (owner_id, contract_end_date);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

create or replace function public.prevent_employee_owner_change()
returns trigger
language plpgsql
as $$
begin
    if new.owner_id is distinct from old.owner_id then
        raise exception 'employee owner_id cannot be changed';
    end if;

    return new;
end;
$$;

drop trigger if exists employees_set_updated_at on public.employees;

create trigger employees_set_updated_at
    before update on public.employees
    for each row
    execute function public.set_updated_at();

drop trigger if exists employees_prevent_owner_change on public.employees;

create trigger employees_prevent_owner_change
    before update on public.employees
    for each row
    execute function public.prevent_employee_owner_change();

alter table public.employees enable row level security;

drop policy if exists "Employees are selectable by owner" on public.employees;
create policy "Employees are selectable by owner"
    on public.employees
    for select
    to authenticated
    using (owner_id = auth.uid());

drop policy if exists "Employees are insertable by owner" on public.employees;
create policy "Employees are insertable by owner"
    on public.employees
    for insert
    to authenticated
    with check (owner_id = auth.uid());

drop policy if exists "Employees are updatable by owner" on public.employees;
create policy "Employees are updatable by owner"
    on public.employees
    for update
    to authenticated
    using (owner_id = auth.uid())
    with check (owner_id = auth.uid());

drop policy if exists "Employees are deletable by owner" on public.employees;
create policy "Employees are deletable by owner"
    on public.employees
    for delete
    to authenticated
    using (owner_id = auth.uid());
