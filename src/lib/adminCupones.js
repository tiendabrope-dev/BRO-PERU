import { supabase } from './supabase';

const SELECT_CUPON = `
  id,
  codigo,
  monto_descuento,
  tipo_descuento,
  porcentaje_descuento,
  tipo_uso,
  categoria,
  activo,
  creado_en,
  actualizado_en
`;

const TIPOS_USO_VALIDOS = [
  'ilimitado',
  'un_uso_por_cliente',
  'un_solo_uso_total',
];

const CATEGORIAS_VALIDAS = [
  'general',
  'trabajador',
  'influencer',
];

const TIPOS_DESCUENTO_VALIDOS = [
  'monto',
  'porcentaje',
];

function limpiarCodigo(codigo) {
  return String(codigo || '')
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');
}

function validarCodigo(codigo) {
  const limpio = limpiarCodigo(codigo);

  if (!limpio) {
    throw new Error('El código no puede estar vacío.');
  }

  if (limpio.length > 30) {
    throw new Error('El código no puede superar los 30 caracteres.');
  }

  if (!/^[A-Z0-9_-]+$/.test(limpio)) {
    throw new Error(
      'El código solo puede tener letras, números, guiones y guion bajo.'
    );
  }

  return limpio;
}

function validarMonto(monto) {
  const numero = Number(monto);

  if (!Number.isFinite(numero) || numero <= 0) {
    throw new Error('El monto de descuento debe ser mayor a 0.');
  }

  return Math.round(numero * 100) / 100;
}

function validarTipoDescuento(tipoDescuento) {
  const valor = tipoDescuento || 'monto';

  if (!TIPOS_DESCUENTO_VALIDOS.includes(valor)) {
    throw new Error('Tipo de descuento inválido.');
  }

  return valor;
}

function validarPorcentaje(porcentaje) {
  const numero = Number(porcentaje);

  if (!Number.isFinite(numero) || numero <= 0 || numero > 100) {
    throw new Error('El porcentaje debe estar entre 0 y 100.');
  }

  return Math.round(numero * 100) / 100;
}

function validarTipoUso(tipoUso) {
  if (!TIPOS_USO_VALIDOS.includes(tipoUso)) {
    throw new Error('Tipo de uso inválido.');
  }

  return tipoUso;
}

function validarCategoria(categoria) {
  if (!CATEGORIAS_VALIDAS.includes(categoria)) {
    throw new Error('Categoría de cupón inválida.');
  }

  return categoria;
}

function notificarCambio() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new Event('bro-cupones-actualizados'));
}

export async function obtenerCuponesAdmin() {
  const { data, error } = await supabase
    .from('bro_cupones')
    .select(SELECT_CUPON)
    .order('creado_en', { ascending: false });

  if (error) {
    console.error('Error cargando cupones:', error);

    throw new Error('No se pudieron cargar los cupones.');
  }

  return data || [];
}

export async function crearCuponAdmin({
  codigo,
  monto_descuento,
  tipo_descuento,
  porcentaje_descuento,
  tipo_uso,
  categoria,
}) {
  const codigoLimpio = validarCodigo(codigo);
  const tipoDescuentoLimpio = validarTipoDescuento(tipo_descuento);

  const montoLimpio =
    tipoDescuentoLimpio === 'monto'
      ? validarMonto(monto_descuento)
      : 0;

  const porcentajeLimpio =
    tipoDescuentoLimpio === 'porcentaje'
      ? validarPorcentaje(porcentaje_descuento)
      : null;

  const tipoUsoLimpio = validarTipoUso(tipo_uso);
  const categoriaLimpia = validarCategoria(categoria || 'general');

  const { data, error } = await supabase
    .from('bro_cupones')
    .insert({
      codigo: codigoLimpio,
      monto_descuento: montoLimpio,
      tipo_descuento: tipoDescuentoLimpio,
      porcentaje_descuento: porcentajeLimpio,
      tipo_uso: tipoUsoLimpio,
      categoria: categoriaLimpia,
      activo: true,
    })
    .select(SELECT_CUPON)
    .single();

  if (error) {
    console.error('Error creando cupón:', error);

    if (error.code === '23505') {
      throw new Error('Ya existe un cupón con ese código.');
    }

    throw new Error('No se pudo crear el cupón.');
  }

  notificarCambio();

  return data;
}

export async function actualizarCuponAdmin(
  id,
  {
    codigo,
    monto_descuento,
    tipo_descuento,
    porcentaje_descuento,
    tipo_uso,
    categoria,
    activo,
  }
) {
  if (!id) {
    throw new Error('Cupón inválido.');
  }

  const codigoLimpio = validarCodigo(codigo);
  const tipoDescuentoLimpio = validarTipoDescuento(tipo_descuento);

  const montoLimpio =
    tipoDescuentoLimpio === 'monto'
      ? validarMonto(monto_descuento)
      : 0;

  const porcentajeLimpio =
    tipoDescuentoLimpio === 'porcentaje'
      ? validarPorcentaje(porcentaje_descuento)
      : null;

  const tipoUsoLimpio = validarTipoUso(tipo_uso);
  const categoriaLimpia = validarCategoria(categoria || 'general');

  const { data, error } = await supabase
    .from('bro_cupones')
    .update({
      codigo: codigoLimpio,
      monto_descuento: montoLimpio,
      tipo_descuento: tipoDescuentoLimpio,
      porcentaje_descuento: porcentajeLimpio,
      tipo_uso: tipoUsoLimpio,
      categoria: categoriaLimpia,
      activo: Boolean(activo),
      actualizado_en: new Date().toISOString(),
    })
    .eq('id', id)
    .select(SELECT_CUPON)
    .single();

  if (error) {
    console.error('Error actualizando cupón:', error);

    if (error.code === '23505') {
      throw new Error('Ya existe un cupón con ese código.');
    }

    throw new Error('No se pudo guardar el cupón.');
  }

  notificarCambio();

  return data;
}

export async function obtenerMetricasCuponesAdmin() {
  const { data, error } = await supabase
    .from('vista_metricas_cupones')
    .select(
      `
      cupon_id,
      codigo,
      categoria,
      tipo_uso,
      activo,
      monto_descuento,
      creado_en,
      veces_usado,
      soles_descontados,
      ventas_generadas,
      ultimo_uso
    `
    )
    .order('veces_usado', { ascending: false });

  if (error) {
    console.error('Error cargando métricas de cupones:', error);

    throw new Error('No se pudieron cargar las métricas de cupones.');
  }

  return data || [];
}

export async function eliminarCuponAdmin(id) {
  if (!id) {
    throw new Error('Cupón inválido.');
  }

  const { error } = await supabase
    .from('bro_cupones')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error eliminando cupón:', error);

    throw new Error('No se pudo eliminar el cupón.');
  }

  notificarCambio();

  return true;
}
