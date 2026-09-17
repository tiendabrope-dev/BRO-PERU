import { supabase } from './supabase';

const SELECT_CUPON = `
  id,
  codigo,
  monto_descuento,
  tipo_uso,
  activo,
  creado_en,
  actualizado_en
`;

const TIPOS_USO_VALIDOS = [
  'ilimitado',
  'un_uso_por_cliente',
  'un_solo_uso_total',
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

function validarTipoUso(tipoUso) {
  if (!TIPOS_USO_VALIDOS.includes(tipoUso)) {
    throw new Error('Tipo de uso inválido.');
  }

  return tipoUso;
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
  tipo_uso,
}) {
  const codigoLimpio = validarCodigo(codigo);
  const montoLimpio = validarMonto(monto_descuento);
  const tipoUsoLimpio = validarTipoUso(tipo_uso);

  const { data, error } = await supabase
    .from('bro_cupones')
    .insert({
      codigo: codigoLimpio,
      monto_descuento: montoLimpio,
      tipo_uso: tipoUsoLimpio,
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
  { codigo, monto_descuento, tipo_uso, activo }
) {
  if (!id) {
    throw new Error('Cupón inválido.');
  }

  const codigoLimpio = validarCodigo(codigo);
  const montoLimpio = validarMonto(monto_descuento);
  const tipoUsoLimpio = validarTipoUso(tipo_uso);

  const { data, error } = await supabase
    .from('bro_cupones')
    .update({
      codigo: codigoLimpio,
      monto_descuento: montoLimpio,
      tipo_uso: tipoUsoLimpio,
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
