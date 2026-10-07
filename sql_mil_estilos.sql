-- ============================================================
-- MIL ESTILOS — panel admin independiente (venta de pulseras)
-- Ejecutar completo en el SQL Editor de Supabase.
-- No toca ninguna tabla de BRO.
-- ============================================================

-- 1) Autorización (quién puede entrar al panel de Mil Estilos)
create table if not exists mil_estilos_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  creado_en timestamptz not null default now()
);

alter table mil_estilos_admins enable row level security;

create or replace function es_admin_mil_estilos()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from mil_estilos_admins
    where user_id = auth.uid()
  );
$$;

create policy "Mil Estilos admins se ven a si mismos"
  on mil_estilos_admins for select
  using (es_admin_mil_estilos());

-- 2) Productos (cada pulsera, con su foto)
create table if not exists mil_estilos_productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  imagen_url text,
  precio numeric(10,2) not null default 0 check (precio >= 0),
  stock_actual numeric(10,2) not null default 0 check (stock_actual >= 0),
  activo boolean not null default true,
  creado_en timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

alter table mil_estilos_productos enable row level security;

create policy "Mil Estilos admins leen productos"
  on mil_estilos_productos for select
  using (es_admin_mil_estilos());

create policy "Mil Estilos admins crean productos"
  on mil_estilos_productos for insert
  with check (es_admin_mil_estilos());

create policy "Mil Estilos admins actualizan productos"
  on mil_estilos_productos for update
  using (es_admin_mil_estilos())
  with check (es_admin_mil_estilos());

-- 3) Historial de movimientos de stock
--    cantidad: positiva = entra stock, negativa = sale stock.
--    tipo: 'entrada' | 'venta_manual' | 'venta_pedido' | 'ajuste'
create table if not exists mil_estilos_movimientos_stock (
  id uuid primary key default gen_random_uuid(),
  producto_id uuid not null references mil_estilos_productos(id) on delete cascade,
  tipo text not null check (tipo in ('entrada', 'venta_manual', 'venta_pedido', 'ajuste')),
  cantidad numeric(10,2) not null check (cantidad <> 0),
  pedido_id uuid,
  nota text,
  creado_en timestamptz not null default now(),
  creado_por uuid references auth.users(id)
);

alter table mil_estilos_movimientos_stock enable row level security;

create policy "Mil Estilos admins leen movimientos"
  on mil_estilos_movimientos_stock for select
  using (es_admin_mil_estilos());

create policy "Mil Estilos admins crean movimientos"
  on mil_estilos_movimientos_stock for insert
  with check (es_admin_mil_estilos());

-- Trigger: cada movimiento actualiza el stock_actual del producto.
-- Bloquea el movimiento si dejaría el stock en negativo.
create or replace function mil_estilos_aplicar_movimiento_stock()
returns trigger
language plpgsql
security definer
as $$
declare
  stock_resultante numeric(10,2);
begin
  select stock_actual + new.cantidad
    into stock_resultante
    from mil_estilos_productos
    where id = new.producto_id
    for update;

  if stock_resultante is null then
    raise exception 'Producto no encontrado.';
  end if;

  if stock_resultante < 0 then
    raise exception 'Stock insuficiente para este movimiento.';
  end if;

  update mil_estilos_productos
    set stock_actual = stock_resultante,
        actualizado_en = now()
    where id = new.producto_id;

  return new;
end;
$$;

drop trigger if exists trg_mil_estilos_movimiento_stock on mil_estilos_movimientos_stock;

create trigger trg_mil_estilos_movimiento_stock
  after insert on mil_estilos_movimientos_stock
  for each row
  execute function mil_estilos_aplicar_movimiento_stock();

-- 4) Pedidos (los crea ella misma, uso 100% interno)
create table if not exists mil_estilos_pedidos (
  id uuid primary key default gen_random_uuid(),
  codigo_pedido text not null unique,
  cliente_nombre text,
  cliente_telefono text,
  estado_pedido text not null default 'pendiente'
    check (estado_pedido in ('pendiente', 'facturado', 'cancelado')),
  pagado boolean not null default false,
  metodo_pago text,
  subtotal numeric(10,2) not null default 0,
  total numeric(10,2) not null default 0,
  creado_en timestamptz not null default now(),
  facturado_en timestamptz
);

alter table mil_estilos_pedidos enable row level security;

create policy "Mil Estilos admins manejan pedidos"
  on mil_estilos_pedidos for all
  using (es_admin_mil_estilos())
  with check (es_admin_mil_estilos());

create table if not exists mil_estilos_pedido_items (
  id uuid primary key default gen_random_uuid(),
  pedido_id uuid not null references mil_estilos_pedidos(id) on delete cascade,
  producto_id uuid references mil_estilos_productos(id),
  nombre_producto text not null,
  cantidad numeric(10,2) not null check (cantidad > 0),
  precio_unitario numeric(10,2) not null,
  total_linea numeric(10,2) not null
);

alter table mil_estilos_pedido_items enable row level security;

create policy "Mil Estilos admins manejan items de pedido"
  on mil_estilos_pedido_items for all
  using (es_admin_mil_estilos())
  with check (es_admin_mil_estilos());

-- 5) Facturar un pedido: descuenta stock de cada item en un solo paso
--    y deja el historial (movimiento tipo 'venta_pedido').
--    Solo funciona una vez (si ya está facturado, no vuelve a descontar).
create or replace function mil_estilos_facturar_pedido(p_pedido_id uuid)
returns void
language plpgsql
security definer
as $$
declare
  v_estado text;
  v_item record;
begin
  if not es_admin_mil_estilos() then
    raise exception 'No autorizado.';
  end if;

  select estado_pedido into v_estado
    from mil_estilos_pedidos
    where id = p_pedido_id
    for update;

  if v_estado is null then
    raise exception 'Pedido no encontrado.';
  end if;

  if v_estado <> 'pendiente' then
    raise exception 'Este pedido ya fue facturado o está cancelado.';
  end if;

  for v_item in
    select producto_id, cantidad
      from mil_estilos_pedido_items
      where pedido_id = p_pedido_id
        and producto_id is not null
  loop
    insert into mil_estilos_movimientos_stock
      (producto_id, tipo, cantidad, pedido_id, nota)
    values
      (v_item.producto_id, 'venta_pedido', -v_item.cantidad, p_pedido_id, 'Pedido facturado');
  end loop;

  update mil_estilos_pedidos
    set estado_pedido = 'facturado',
        facturado_en = now()
    where id = p_pedido_id;
end;
$$;

-- 6) Bucket de imágenes de productos (separado del de BRO)
insert into storage.buckets (id, name, public)
values ('mil-estilos-productos', 'mil-estilos-productos', true)
on conflict (id) do nothing;

create policy "Mil Estilos imagenes lectura publica"
  on storage.objects for select
  using (bucket_id = 'mil-estilos-productos');

create policy "Mil Estilos admins suben imagenes"
  on storage.objects for insert
  with check (
    bucket_id = 'mil-estilos-productos'
    and es_admin_mil_estilos()
  );

create policy "Mil Estilos admins actualizan imagenes"
  on storage.objects for update
  using (
    bucket_id = 'mil-estilos-productos'
    and es_admin_mil_estilos()
  );

-- ============================================================
-- PASO MANUAL PENDIENTE (hazlo tú después de correr este SQL):
--
-- 1. Ve a Authentication > Users en Supabase y crea un usuario
--    nuevo (otro correo, distinto al admin de BRO) para la
--    persona que va a usar este panel.
-- 2. Copia su "User UID" y corre esto, reemplazando los valores:
--
--    insert into mil_estilos_admins (user_id, email)
--    values ('PEGA-AQUI-EL-UID', 'correo@ejemplo.com');
--
-- Sin ese paso, el login del panel de Mil Estilos no va a dejar
-- entrar a nadie, aunque la contraseña sea correcta.
-- ============================================================
