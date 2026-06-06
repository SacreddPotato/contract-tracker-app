-- Add optional employee contact/detail fields.
-- Existing rows are compatible because all columns are nullable.

alter table public.employees
    add column if not exists phone_number text null,
    add column if not exists nationality text null,
    add column if not exists email text null;
