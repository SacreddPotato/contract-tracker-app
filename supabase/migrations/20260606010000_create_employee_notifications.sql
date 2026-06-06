-- Store durable in-app notifications for contract deadline thresholds.
-- Notifications are unique per employee, interval, and contract end date so
-- catch-up syncs cannot create duplicates for the same contract period.

create table if not exists public.employee_notifications (
    id uuid primary key default gen_random_uuid(),
    owner_id text not null default '0',
    employee_id uuid not null references public.employees(id) on delete cascade,
    interval_days integer not null,
    contract_end_date date not null,
    employee_name_snapshot text not null,
    read_at timestamp with time zone null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint employee_notifications_interval_days_check check (interval_days in (90, 60, 30)),
    constraint employee_notifications_unique_contract_interval unique (employee_id, interval_days, contract_end_date)
);

create index if not exists employee_notifications_owner_id_idx
    on public.employee_notifications (owner_id, read_at, created_at desc);

create index if not exists employee_notifications_employee_id_idx
    on public.employee_notifications (employee_id);

alter table public.employee_notifications enable row level security;

drop policy if exists employee_notifications_shared_select on public.employee_notifications;
create policy employee_notifications_shared_select
    on public.employee_notifications
    for select
    to authenticated
    using (owner_id = '0');

drop policy if exists employee_notifications_shared_insert on public.employee_notifications;
create policy employee_notifications_shared_insert
    on public.employee_notifications
    for insert
    to authenticated
    with check (owner_id = '0');

drop policy if exists employee_notifications_shared_update on public.employee_notifications;
create policy employee_notifications_shared_update
    on public.employee_notifications
    for update
    to authenticated
    using (owner_id = '0')
    with check (owner_id = '0');

drop policy if exists employee_notifications_shared_delete on public.employee_notifications;
create policy employee_notifications_shared_delete
    on public.employee_notifications
    for delete
    to authenticated
    using (owner_id = '0');

create or replace function public.prevent_employee_notification_owner_change()
returns trigger
language plpgsql
as $$
begin
    if new.owner_id is distinct from old.owner_id then
        raise exception 'employee notification owner_id cannot be changed';
    end if;

    return new;
end;
$$;

drop trigger if exists prevent_employee_notification_owner_change
    on public.employee_notifications;

create trigger prevent_employee_notification_owner_change
    before update on public.employee_notifications
    for each row
    execute function public.prevent_employee_notification_owner_change();
