-- Crea un pedido y todos sus productos como una única transacción.
-- Los precios y snapshots se verifican en la Server Action desde Fake Store API.

create or replace function public.create_order(
  p_total numeric,
  p_shipping_name text,
  p_shipping_department text,
  p_shipping_province text,
  p_shipping_district text,
  p_shipping_address text,
  p_items jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_order_id uuid;
  calculated_total numeric(12, 2);
begin
  if (select auth.uid()) is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_total is null or p_total < 0 then
    raise exception 'Invalid order total';
  end if;

  if p_shipping_name is null or btrim(p_shipping_name) = ''
    or p_shipping_department is null or btrim(p_shipping_department) = ''
    or p_shipping_province is null or btrim(p_shipping_province) = ''
    or p_shipping_district is null or btrim(p_shipping_district) = ''
    or p_shipping_address is null or btrim(p_shipping_address) = '' then
    raise exception 'Shipping information is incomplete';
  end if;

  if jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Order items are required';
  end if;

  if exists (
    select 1
    from pg_catalog.jsonb_to_recordset(p_items) as item(
      product_id integer,
      product_name text,
      product_image text,
      unit_price numeric,
      quantity integer,
      subtotal numeric
    )
    where item.product_id is null or item.product_id <= 0
      or item.product_name is null or btrim(item.product_name) = ''
      or item.product_image is null or btrim(item.product_image) = ''
      or item.unit_price is null or item.unit_price < 0
      or item.quantity is null or item.quantity <= 0
      or item.subtotal is null or item.subtotal <> item.unit_price * item.quantity
  ) then
    raise exception 'Invalid order items';
  end if;

  if exists (
    select item.product_id
    from pg_catalog.jsonb_to_recordset(p_items) as item(product_id integer)
    group by item.product_id
    having count(*) > 1
  ) then
    raise exception 'Repeated products are not allowed';
  end if;

  select coalesce(sum(item.subtotal), 0)
  into calculated_total
  from pg_catalog.jsonb_to_recordset(p_items) as item(subtotal numeric);

  if calculated_total <> p_total then
    raise exception 'Order total does not match items';
  end if;

  insert into public.orders (
    user_id,
    total,
    shipping_name,
    shipping_department,
    shipping_province,
    shipping_district,
    shipping_address
  )
  values (
    (select auth.uid()),
    p_total,
    p_shipping_name,
    p_shipping_department,
    p_shipping_province,
    p_shipping_district,
    p_shipping_address
  )
  returning id into new_order_id;

  insert into public.order_items (
    order_id,
    product_id,
    product_name,
    product_image,
    unit_price,
    quantity,
    subtotal
  )
  select
    new_order_id,
    item.product_id,
    item.product_name,
    item.product_image,
    item.unit_price,
    item.quantity,
    item.subtotal
  from pg_catalog.jsonb_to_recordset(p_items) as item(
    product_id integer,
    product_name text,
    product_image text,
    unit_price numeric,
    quantity integer,
    subtotal numeric
  );

  return new_order_id;
end;
$$;

revoke all on function public.create_order(numeric, text, text, text, text, text, jsonb) from public;
grant execute on function public.create_order(numeric, text, text, text, text, text, jsonb) to authenticated;

drop policy if exists "Customers can create their own orders" on public.orders;
drop policy if exists "Customers can create items for their own orders" on public.order_items;
revoke insert on table public.orders from authenticated;
revoke insert on table public.order_items from authenticated;
