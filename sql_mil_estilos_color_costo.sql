-- ============================================================
-- MIL ESTILOS — agrega color y precio costo (datos internos)
-- Ejecutar completo en el SQL Editor de Supabase.
-- No toca ninguna tabla de BRO.
-- ============================================================

alter table mil_estilos_productos
  add column if not exists color text,
  add column if not exists precio_costo numeric(10,2);
