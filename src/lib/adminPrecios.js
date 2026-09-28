import { supabase } from './supabase';

export const CATEGORIAS_PRECIO_VALIDAS = [
  'cuadros',
  'productos',
  'ropa',
  'entrega',
];

function validarCategoriaPrecio(categoria) {
  const valor = String(
    categoria || ''
  ).toLowerCase();

  return CATEGORIAS_PRECIO_VALIDAS.includes(
    valor
  )
    ? valor
    : 'cuadros';
}

function normalizarClave(clave) {
  return String(clave || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export async function obtenerPreciosAdmin() {
  const { data, error } =
    await supabase
      .from('bro_precios')
      .select(
        'clave,nombre,categoria,precio,activo'
      )
      .order('categoria')
      .order('clave');

  if (error) {
    throw new Error(
      'No se pudieron cargar los precios.'
    );
  }

  return data || [];
}

export async function actualizarPrecioAdmin(
  clave,
  precio
) {
  const nuevoPrecio =
    Number(precio);

  if (
    !Number.isFinite(nuevoPrecio) ||
    nuevoPrecio < 0
  ) {
    throw new Error(
      'Ingresa un precio válido.'
    );
  }

  const { data, error } =
    await supabase
      .from('bro_precios')
      .update({
        precio: nuevoPrecio,
      })
      .eq('clave', clave)
      .select(
        'clave,nombre,categoria,precio,activo'
      )
      .single();

  if (error) {
    console.error(error);

    throw new Error(
      'No se pudo guardar el precio.'
    );
  }

  return data;
}

export async function crearPrecioAdmin({
  clave,
  nombre,
  categoria,
  precio,
}) {
  const claveNormalizada =
    normalizarClave(clave);

  const nombreLimpio = String(
    nombre || ''
  ).trim();

  const nuevoPrecio =
    Number(precio);

  if (!claveNormalizada) {
    throw new Error(
      'Ingresa una clave válida para el precio.'
    );
  }

  if (!nombreLimpio) {
    throw new Error(
      'Ingresa un nombre para el precio.'
    );
  }

  if (
    !Number.isFinite(nuevoPrecio) ||
    nuevoPrecio < 0
  ) {
    throw new Error(
      'Ingresa un precio válido.'
    );
  }

  const { data, error } =
    await supabase
      .from('bro_precios')
      .insert({
        clave: claveNormalizada,
        nombre: nombreLimpio,
        categoria:
          validarCategoriaPrecio(
            categoria
          ),
        precio: nuevoPrecio,
        activo: true,
      })
      .select(
        'clave,nombre,categoria,precio,activo'
      )
      .single();

  if (error) {
    console.error(error);

    if (error.code === '23505') {
      throw new Error(
        'Ya existe un precio con esa clave.'
      );
    }

    throw new Error(
      'No se pudo crear el precio.'
    );
  }

  return data;
}