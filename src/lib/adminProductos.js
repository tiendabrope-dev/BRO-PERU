import { supabase } from './supabase';

const SELECT_PRODUCTO = `
  producto_id,
  slug,
  nombre,
  categoria,
  activo,
  imagen_url,
  cantidad_resenas,
  promedio_resenas_base,
  creado_en,
  actualizado_en
`;

export function generarSlugProducto(
  nombre = ''
) {
  return String(nombre)
    .normalize('NFD')
    .replace(
      /[\u0300-\u036f]/g,
      ''
    )
    .toLowerCase()
    .trim()
    .replace(
      /[^a-z0-9]+/g,
      '-'
    )
    .replace(
      /^-+|-+$/g,
      ''
    );
}

export function generarIdProducto() {
  if (
    typeof crypto !==
      'undefined' &&
    typeof crypto.randomUUID ===
      'function'
  ) {
    return crypto.randomUUID();
  }

  return (
    `bro-${Date.now()}-` +
    Math.random()
      .toString(36)
      .slice(2, 10)
  );
}

function normalizarCantidadResenas(
  cantidad
) {
  return Math.max(
    0,
    Number.parseInt(
      cantidad,
      10
    ) || 0
  );
}

function normalizarPromedioBase(
  promedio,
  cantidadResenas
) {
  const cantidad =
    normalizarCantidadResenas(
      cantidadResenas
    );

  /*
    Si no existen reseñas base,
    el promedio histórico no participa
    en ningún cálculo.
  */
  if (cantidad === 0) {
    return null;
  }

  const texto =
    String(
      promedio ?? ''
    )
      .trim()
      .replace(',', '.');

  if (!texto) {
    throw new Error(
      'Ingresa el promedio base de reseñas.'
    );
  }

  const numero =
    Number(texto);

  if (
    !Number.isFinite(numero) ||
    numero < 0 ||
    numero > 5
  ) {
    throw new Error(
      'El promedio base debe estar entre 0 y 5.'
    );
  }

  return Math.round(
    numero * 100
  ) / 100;
}

export async function obtenerProductosAdmin() {
  const { data, error } =
    await supabase
      .from('bro_productos')
      .select(
        SELECT_PRODUCTO
      )
      .order('nombre', {
        ascending: true,
      });

  if (error) {
    console.error(
      'Error cargando productos:',
      error
    );

    throw new Error(
      'No se pudieron cargar los productos.'
    );
  }

  return data || [];
}

export async function cambiarEstadoProductoAdmin(
  productoId,
  activo
) {
  const { data, error } =
    await supabase
      .from('bro_productos')
      .update({
        activo:
          Boolean(activo),

        actualizado_en:
          new Date()
            .toISOString(),
      })
      .eq(
        'producto_id',
        String(productoId)
      )
      .select(
        SELECT_PRODUCTO
      )
      .single();

  if (error) {
    console.error(
      'Error actualizando producto:',
      error
    );

    throw new Error(
      'No se pudo actualizar el producto.'
    );
  }

  return data;
}

function obtenerExtensionArchivo(
  archivo
) {
  const nombre =
    String(
      archivo?.name || ''
    );

  const partes =
    nombre.split('.');

  if (
    partes.length > 1
  ) {
    return partes
      .pop()
      .toLowerCase();
  }

  const tipo =
    String(
      archivo?.type || ''
    );

  if (
    tipo === 'image/png'
  ) {
    return 'png';
  }

  if (
    tipo === 'image/webp'
  ) {
    return 'webp';
  }

  if (
    tipo === 'image/avif'
  ) {
    return 'avif';
  }

  return 'jpg';
}

export async function subirImagenProductoAdmin(
  archivo,
  productoId
) {
  if (!archivo) {
    throw new Error(
      'Selecciona una imagen.'
    );
  }

  if (!productoId) {
    throw new Error(
      'No se pudo identificar el producto.'
    );
  }

  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
  ];

  if (
    !tiposPermitidos.includes(
      archivo.type
    )
  ) {
    throw new Error(
      'La imagen debe ser JPG, PNG, WEBP o AVIF.'
    );
  }

  const limite =
    10 * 1024 * 1024;

  if (
    archivo.size > limite
  ) {
    throw new Error(
      'La imagen no puede superar los 10 MB.'
    );
  }

  const extension =
    obtenerExtensionArchivo(
      archivo
    );

  const ruta =
    `cuadros/${productoId}/` +
    `${Date.now()}.${extension}`;

  const {
    error: errorSubida,
  } = await supabase.storage
    .from('bro-productos')
    .upload(
      ruta,
      archivo,
      {
        cacheControl:
          '3600',

        upsert: false,
      }
    );

  if (errorSubida) {
    console.error(
      'Error subiendo imagen:',
      errorSubida
    );

    throw new Error(
      'No se pudo subir la imagen.'
    );
  }

  const {
    data: datosPublicos,
  } = supabase.storage
    .from('bro-productos')
    .getPublicUrl(
      ruta
    );

  const url =
    datosPublicos
      ?.publicUrl;

  if (!url) {
    throw new Error(
      'No se pudo obtener la URL de la imagen.'
    );
  }

  return url;
}

export async function crearProductoAdmin({
  productoId,
  nombre,
  slug,
  imagenUrl,
  cantidadResenas = 0,
  promedioResenasBase = null,
  activo = true,
}) {
  const nombreLimpio =
    String(nombre || '')
      .trim();

  const slugLimpio =
    generarSlugProducto(
      slug ||
      nombreLimpio
    );

  if (!nombreLimpio) {
    throw new Error(
      'Ingresa el nombre del producto.'
    );
  }

  if (!slugLimpio) {
    throw new Error(
      'No se pudo generar el slug.'
    );
  }

  if (!imagenUrl) {
    throw new Error(
      'Selecciona una imagen para el producto.'
    );
  }

  const productoIdFinal =
    productoId ||
    generarIdProducto();

  const resenas =
    normalizarCantidadResenas(
      cantidadResenas
    );

  const promedioBase =
    normalizarPromedioBase(
      promedioResenasBase,
      resenas
    );

  const ahora =
    new Date()
      .toISOString();

  const { data, error } =
    await supabase
      .from('bro_productos')
      .insert({
        producto_id:
          productoIdFinal,

        nombre:
          nombreLimpio,

        slug:
          slugLimpio,

        categoria:
          'cuadro',

        activo:
          Boolean(activo),

        imagen_url:
          imagenUrl,

        /*
          IMPORTANTE:
          cantidad_resenas sigue siendo
          únicamente la base histórica.
        */
        cantidad_resenas:
          resenas,

        promedio_resenas_base:
          promedioBase,

        creado_en:
          ahora,

        actualizado_en:
          ahora,
      })
      .select(
        SELECT_PRODUCTO
      )
      .single();

  if (error) {
    console.error(
      'Error creando producto:',
      error
    );

    if (
      error.code ===
      '23505'
    ) {
      throw new Error(
        'Ya existe un producto con ese nombre o slug.'
      );
    }

    throw new Error(
      'No se pudo crear el producto.'
    );
  }

  return data;
}

export async function actualizarProductoAdmin(
  productoId,
  {
    nombre,
    slug,
    imagenUrl,
    cantidadResenas = 0,
    promedioResenasBase = null,
    activo = true,
  }
) {
  const nombreLimpio =
    String(nombre || '')
      .trim();

  const slugLimpio =
    generarSlugProducto(
      slug ||
      nombreLimpio
    );

  if (!productoId) {
    throw new Error(
      'Producto inválido.'
    );
  }

  if (!nombreLimpio) {
    throw new Error(
      'Ingresa el nombre del producto.'
    );
  }

  if (!slugLimpio) {
    throw new Error(
      'No se pudo generar el slug.'
    );
  }

  const resenas =
    normalizarCantidadResenas(
      cantidadResenas
    );

  const promedioBase =
    normalizarPromedioBase(
      promedioResenasBase,
      resenas
    );

  const cambios = {
    nombre:
      nombreLimpio,

    slug:
      slugLimpio,

    categoria:
      'cuadro',

    activo:
      Boolean(activo),

    /*
      Siempre conserva el significado
      de reseñas base / históricas.
    */
    cantidad_resenas:
      resenas,

    promedio_resenas_base:
      promedioBase,

    actualizado_en:
      new Date()
        .toISOString(),
  };

  if (imagenUrl) {
    cambios.imagen_url =
      imagenUrl;
  }

  const { data, error } =
    await supabase
      .from('bro_productos')
      .update(
        cambios
      )
      .eq(
        'producto_id',
        String(productoId)
      )
      .select(
        SELECT_PRODUCTO
      )
      .single();

  if (error) {
    console.error(
      'Error editando producto:',
      error
    );

    if (
      error.code ===
      '23505'
    ) {
      throw new Error(
        'Ya existe otro producto con ese slug.'
      );
    }

    throw new Error(
      'No se pudo guardar el producto.'
    );
  }

  return data;
}
