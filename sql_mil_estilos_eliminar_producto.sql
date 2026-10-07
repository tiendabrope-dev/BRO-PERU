-- ============================================================
-- MIL ESTILOS — permisos para poder eliminar un producto
-- (y que se borre también todo su historial de movimientos).
-- Ejecutar completo en el SQL Editor de Supabase.
-- No toca ninguna tabla de BRO.
-- ============================================================

-- Faltaba el permiso para borrar productos (antes solo se podía
-- leer, crear y actualizar).
create policy "Mil Estilos admins eliminan productos"
  on mil_estilos_productos for delete
  using (es_admin_mil_estilos());

-- Y el permiso para borrar sus movimientos de stock (el historial).
-- La tabla ya estaba configurada para borrarse en cascada al borrar
-- el producto, pero sin esta policy esa cascada quedaba bloqueada.
create policy "Mil Estilos admins eliminan movimientos"
  on mil_estilos_movimientos_stock for delete
  using (es_admin_mil_estilos());
