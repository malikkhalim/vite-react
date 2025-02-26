/*
  # Add flight and cargo booking tables

  1. New Tables
    - flight_bookings: Stores flight booking details
    - cargo_bookings: Stores cargo booking details
    - cargo_packages: Stores package details for cargo bookings
    - cargo_contacts: Stores contact details for cargo bookings
  
  2. Security
    - Enable RLS on all new tables
    - Add policies for user access
*/

-- Create flight bookings table
CREATE TABLE IF NOT EXISTS public.flight_bookings (
  id uuid primary key references public.bookings,
  flight_number text not null,
  class text not null,
  passengers jsonb not null,
  baggage_allowance integer not null
);

-- Create cargo bookings table
CREATE TABLE IF NOT EXISTS public.cargo_bookings (
  id uuid primary key references public.bookings,
  cargo_type text not null check (cargo_type in ('general', 'pharma', 'perishable', 'dangerous', 'special')),
  total_weight decimal(10,2) not null,
  total_volume decimal(10,2) not null,
  special_instructions text,
  dangerous_goods boolean default false,
  needs_pickup boolean default false
);

-- Create cargo packages table
CREATE TABLE IF NOT EXISTS public.cargo_packages (
  id uuid default gen_random_uuid() primary key,
  cargo_booking_id uuid references public.cargo_bookings,
  package_type text not null,
  quantity integer not null,
  weight decimal(10,2) not null,
  length decimal(10,2) not null,
  width decimal(10,2) not null,
  height decimal(10,2) not null,
  description text
);

-- Create cargo contacts table
CREATE TABLE IF NOT EXISTS public.cargo_contacts (
  id uuid default gen_random_uuid() primary key,
  cargo_booking_id uuid references public.cargo_bookings,
  contact_type text not null check (contact_type in ('shipper', 'consignee')),
  company_name text not null,
  contact_person text not null,
  email text not null,
  phone text not null,
  address text not null,
  tin text
);

-- Enable RLS on new tables
ALTER TABLE public.flight_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cargo_contacts ENABLE ROW LEVEL SECURITY;

-- Flight bookings policies
CREATE POLICY "Users can view own flight bookings"
  ON public.flight_bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = flight_bookings.id
    AND b.user_id = auth.uid()
  ));

CREATE POLICY "Users can create flight bookings"
  ON public.flight_bookings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = flight_bookings.id
    AND b.user_id = auth.uid()
  ));

-- Cargo bookings policies
CREATE POLICY "Users can view own cargo bookings"
  ON public.cargo_bookings FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = cargo_bookings.id
    AND b.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cargo bookings"
  ON public.cargo_bookings FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = cargo_bookings.id
    AND b.user_id = auth.uid()
  ));

-- Cargo packages policies
CREATE POLICY "Users can view own cargo packages"
  ON public.cargo_packages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cargo_bookings cb
    JOIN public.bookings b ON b.id = cb.id
    WHERE cb.id = cargo_packages.cargo_booking_id
    AND b.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cargo packages"
  ON public.cargo_packages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cargo_bookings cb
    JOIN public.bookings b ON b.id = cb.id
    WHERE cb.id = cargo_packages.cargo_booking_id
    AND b.user_id = auth.uid()
  ));

-- Cargo contacts policies
CREATE POLICY "Users can view own cargo contacts"
  ON public.cargo_contacts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.cargo_bookings cb
    JOIN public.bookings b ON b.id = cb.id
    WHERE cb.id = cargo_contacts.cargo_booking_id
    AND b.user_id = auth.uid()
  ));

CREATE POLICY "Users can create cargo contacts"
  ON public.cargo_contacts FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.cargo_bookings cb
    JOIN public.bookings b ON b.id = cb.id
    WHERE cb.id = cargo_contacts.cargo_booking_id
    AND b.user_id = auth.uid()
  ));