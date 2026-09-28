import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/*
  Exportar pedidos — admin.

  Excel: se genera como CSV (separador ";", con BOM UTF-8)
  en vez de un .xlsx real. Esto evita depender de la librería
  "xlsx" (SheetJS), que hoy tiene vulnerabilidades conocidas
  sin parche disponible. Un .csv se abre directo con Excel
  y cumple el mismo objetivo sin ese riesgo.
*/

const TEXTOS_ESTADO_PEDIDO = {
  nuevo: 'Nuevo',
  confirmado: 'Confirmado',
  preparando: 'Preparando',
  enviado: 'Enviado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};

const TEXTOS_SERVICIO = {
  domicilio: 'Domicilio',
  contraentrega: 'Contraentrega',
  digital: 'Digital',
};

function formatearFecha(fecha) {
  if (!fecha) {
    return '';
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(fecha));
}

function textoEstadoPedido(estado) {
  return TEXTOS_ESTADO_PEDIDO[estado] || estado || '';
}

function textoServicio(tipo) {
  return TEXTOS_SERVICIO[tipo] || tipo || '';
}

function nombreArchivo(extension) {
  const ahora = new Date();

  const fecha = ahora
    .toISOString()
    .slice(0, 10);

  return `pedidos-bro-${fecha}.${extension}`;
}

function descargarArchivo(contenido, nombre, tipoMime) {
  const blob = new Blob([contenido], {
    type: tipoMime,
  });

  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);

  URL.revokeObjectURL(url);
}

const COLUMNAS = [
  { titulo: 'Código', obtener: (p) => p.codigo_pedido },
  { titulo: 'Fecha', obtener: (p) => formatearFecha(p.creado_en) },
  { titulo: 'Cliente', obtener: (p) => p.nombre_completo },
  { titulo: 'DNI', obtener: (p) => p.dni },
  { titulo: 'Teléfono', obtener: (p) => p.telefono },
  { titulo: 'Entrega', obtener: (p) => textoServicio(p.tipo_servicio) },
  { titulo: 'Distrito', obtener: (p) => p.distrito || '' },
  { titulo: 'Método de pago', obtener: (p) => p.metodo_pago || '' },
  {
    titulo: 'Estado pago',
    obtener: (p) => (p.estado_pago === 'pagado' ? 'Pagado' : 'No pagado'),
  },
  { titulo: 'Estado pedido', obtener: (p) => textoEstadoPedido(p.estado_pedido) },
  { titulo: 'Subtotal', obtener: (p) => Number(p.subtotal || 0).toFixed(2) },
  { titulo: 'Delivery', obtener: (p) => Number(p.delivery || 0).toFixed(2) },
  { titulo: 'Cupón', obtener: (p) => p.cupon_codigo || '' },
  { titulo: 'Descuento', obtener: (p) => Number(p.descuento || 0).toFixed(2) },
  { titulo: 'Total', obtener: (p) => Number(p.total || 0).toFixed(2) },
];

function escaparCampoCSV(valor) {
  const texto = String(valor ?? '');

  if (/[";\n]/.test(texto)) {
    return `"${texto.replace(/"/g, '""')}"`;
  }

  return texto;
}

export function exportarPedidosExcel(pedidos) {
  const encabezado = COLUMNAS.map((columna) => columna.titulo).join(';');

  const filas = pedidos.map((pedido) =>
    COLUMNAS.map((columna) =>
      escaparCampoCSV(columna.obtener(pedido))
    ).join(';')
  );

  const contenido = [encabezado, ...filas].join('\r\n');

  const BOM = '﻿';

  descargarArchivo(
    BOM + contenido,
    nombreArchivo('csv'),
    'text/csv;charset=utf-8;'
  );
}

export function exportarPedidosPDF(pedidos) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'pt',
  });

  doc.setFontSize(14);
  doc.text('Pedidos BRO Perú', 40, 40);

  doc.setFontSize(9);
  doc.text(
    `Generado: ${formatearFecha(new Date().toISOString())} — ${
      pedidos.length
    } pedido(s)`,
    40,
    56
  );

  const columnasPdf = COLUMNAS.filter(
    (columna) => columna.titulo !== 'DNI'
  );

  autoTable(doc, {
    startY: 70,
    head: [columnasPdf.map((columna) => columna.titulo)],
    body: pedidos.map((pedido) =>
      columnasPdf.map((columna) => columna.obtener(pedido))
    ),
    styles: {
      fontSize: 7,
      cellPadding: 4,
    },
    headStyles: {
      fillColor: [45, 90, 61],
    },
  });

  doc.save(nombreArchivo('pdf'));
}
