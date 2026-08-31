-- Impide retrocesos o saltos de estado incluso fuera de la interfaz administrativa.

create or replace function public.enforce_order_status_transition()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if (old.status = 'pending' and new.status = 'shipped')
    or (old.status = 'shipped' and new.status = 'delivered') then
    return new;
  end if;

  raise exception 'Invalid order status transition';
end;
$$;

drop trigger if exists orders_enforce_status_transition on public.orders;
create trigger orders_enforce_status_transition
before update of status on public.orders
for each row execute procedure public.enforce_order_status_transition();
