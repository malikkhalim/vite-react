-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Set up storage for user avatars
insert into storage.buckets (id, name) values ('avatars', 'avatars');

-- Create custom types
create type booking_status as enum ('pending', 'confirmed', 'cancelled', 'completed');
create type booking_type as enum ('flight', 'cargo');
create type cargo_type as enum ('general', 'pharma', 'perishable', 'dangerous', 'special');
create type payment_status as enum ('pending', 'completed', 'failed', 'refunded');

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade,
  first_name text,
  last_name text,
  phone text,
  address text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Trigger to create profile on user signup
create function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Bookings table (parent table for both flight and cargo bookings)
create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users,
  booking_type booking_type not null,
  reference_number text unique not null,
  status booking_status default 'pending',
  total_amount decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Flight bookings
create table public.flight_bookings (
  id uuid primary key references public.bookings,
  flight_number text not null,
  from_airport text not null,
  to_airport text not null,
  departure_date timestamp with time zone not null,
  arrival_date timestamp with time zone not null,
  class text not null,
  passengers jsonb not null,
  baggage_allowance integer not null
);

-- Cargo bookings
create table public.cargo_bookings (
  id uuid primary key references public.bookings,
  from_airport text not null,
  to_airport text not null,
  shipping_date timestamp with time zone not null,
  cargo_type cargo_type not null,
  total_weight decimal(10,2) not null,
  total_volume decimal(10,2) not null,
  special_instructions text,
  dangerous_goods boolean default false,
  needs_pickup boolean default false
);

-- Cargo packages (child table for cargo bookings)
create table public.cargo_packages (
  id uuid default uuid_generate_v4() primary key,
  cargo_booking_id uuid references public.cargo_bookings,
  package_type text not null,
  quantity integer not null,
  weight decimal(10,2) not null,
  length decimal(10,2) not null,
  width decimal(10,2) not null,
  height decimal(10,2) not null,
  description text
);

-- Contact details for cargo bookings
create table public.cargo_contacts (
  id uuid default uuid_generate_v4() primary key,
  cargo_booking_id uuid references public.cargo_bookings,
  contact_type text not null, -- 'shipper' or 'consignee'
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  address text not null,
  tin text
);

-- Payments
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings,
  amount decimal(10,2) not null,
  payment_method text not null,
  status payment_status default 'pending',
  transaction_id text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.profiles enable row level security;
alter table public.bookings enable row level security;
alter table public.flight_bookings enable row level security;
alter table public.cargo_bookings enable row level security;
alter table public.cargo_packages enable row level security;
alter table public.cargo_contacts enable row level security;
alter table public.payments enable row level security;

-- Profiles policy
create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Bookings policies
create policy "Users can view own bookings"
  on public.bookings for select
  using ( auth.uid() = user_id );

create policy "Users can create bookings"
  on public.bookings for insert
  with check ( auth.uid() = user_id );

-- Similar policies for other tables...

-- Functions for common operations
create function public.get_user_bookings(user_uuid uuid)
returns table (
  id uuid,
  reference_number text,
  booking_type booking_type,
  status booking_status,
  total_amount decimal,
  from_airport text,
  to_airport text,
  departure_date timestamp with time zone,
  created_at timestamp with time zone
) as $$
begin
  return query
  select 
    b.id,
    b.reference_number,
    b.booking_type,
    b.status,
    b.total_amount,
    coalesce(fb.from_airport, cb.from_airport) as from_airport,
    coalesce(fb.to_airport, cb.to_airport) as to_airport,
    coalesce(fb.departure_date, cb.shipping_date) as departure_date,
    b.created_at
  from bookings b
  left join flight_bookings fb on b.id = fb.id
  left join cargo_bookings cb on b.id = cb.id
  where b.user_id = user_uuid
  order by b.created_at desc;
end;
$$ language plpgsql security definer;