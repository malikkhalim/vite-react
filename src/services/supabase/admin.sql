-- Admin settings table
create table public.admin_settings (
  id integer primary key default 1,
  cargo_fees jsonb not null,
  pickup_service jsonb not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint single_row check (id = 1)
);

-- Insert default settings
insert into public.admin_settings (cargo_fees, pickup_service) values (
  '{
    "awbFee": 25,
    "screeningFeePerKg": 0.15,
    "handlingFeePerKg": 0.25,
    "cargoChargePerKg": 2.5
  }',
  '{
    "baseWeight": 45,
    "basePrice": 80,
    "additionalPricePerKg": 2
  }'
);

-- Admin users table
create table public.admin_users (
  id uuid primary key references auth.users,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin policies
create policy "Only admins can access settings"
  on public.admin_settings for all
  using (
    exists (
      select 1 from public.admin_users
      where id = auth.uid()
    )
  );

-- Function to check if user is admin
create function public.is_admin(user_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.admin_users
    where id = user_id
  );
end;
$$ language plpgsql security definer;