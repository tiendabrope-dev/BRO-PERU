-- ============================================================
-- MIL ESTILOS — guarda el color de cada producto dentro del pedido
-- (así queda registrado en la nota de venta y el resumen).
-- Ejecutar completo en el SQL Editor de Supabase.
-- No toca ninguna tabla de BRO.
-- ============================================================

alter table mil_estilos_pedido_items
  add column if not exists color text;
