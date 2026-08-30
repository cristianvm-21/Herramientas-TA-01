-- Modelo de datos inicial para Online Store.
-- Las credenciales se administran exclusivamente en auth.users (Supabase Auth).

create type public.user_role as enum ('customer', 'admin');
create type public.order_status as enum ('pending', 'shipped', 'delivered');

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  role public.user_role not null default 'customer',
  first_name text,
  last_name text,
  dni text unique,
  department text,
  province text,
  district text,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  status public.order_status not null default 'pending',
  total numeric(12, 2) not null check (total >= 0),
  shipping_name text not null,
  shipping_department text not null,
  shipping_province text not null,
  shipping_district text not null,
  shipping_address text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id integer not null check (product_id > 0),
  product_name text not null,
  product_image text not null,
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  subtotal numeric(12, 2) not null check (subtotal = unit_price * quantity),
  created_at timestamptz not null default now()
);

create index orders_user_id_idx on public.orders (user_id);
create index orders_status_idx on public.orders (status);
create index order_items_order_id_idx on public.order_items (order_id);

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create trigger orders_set_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'customer');
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create function public.is_admin()
returns boolean
language sql
stable
security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
  );
$$;

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.orders from anon, authenticated;
revoke all on table public.order_items from anon, authenticated;
revoke all on function public.is_admin() from public;

grant select on public.profiles to authenticated;
grant update (first_name, last_name, dni, department, province, district, address) on public.profiles to authenticated;
grant select, insert on public.orders to authenticated;
grant update (status) on public.orders to authenticated;
grant select, insert on public.order_items to authenticated;
grant execute on function public.is_admin() to authenticated;

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Customers can view their own profile"
on public.profiles for select to authenticated
using ((select auth.uid()) = id);

create policy "Admins can view every profile"
on public.profiles for select to authenticated
using ((select public.is_admin()));

create policy "Customers can update their own profile"
on public.profiles for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

create policy "Customers can view their own orders"
on public.orders for select to authenticated
using ((select auth.uid()) = user_id);

create policy "Customers can create their own orders"
on public.orders for insert to authenticated
with check ((select auth.uid()) = user_id);

create policy "Admins can view every order"
on public.orders for select to authenticated
using ((select public.is_admin()));

create policy "Admins can update order status"
on public.orders for update to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

create policy "Customers can view items from their own orders"
on public.order_items for select to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "Customers can create items for their own orders"
on public.order_items for insert to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.user_id = (select auth.uid())
  )
);

create policy "Admins can view every order item"
on public.order_items for select to authenticated
using ((select public.is_admin()));
