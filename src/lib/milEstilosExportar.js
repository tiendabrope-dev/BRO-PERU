// ExcelJS se carga solo cuando realmente se exporta (no en cada
// carga de la página), para no engordar el resto del sitio.
async function cargarExcelJS() {
  const modulo = await import('exceljs');
  return modulo.default || modulo;
}

function descargarArchivo(buffer, nombreArchivo, tipoMime) {
  const blob = new Blob([buffer], { type: tipoMime });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  document.body.appendChild(enlace);
  enlace.click();
  document.body.removeChild(enlace);
  URL.revokeObjectURL(url);
}

async function obtenerImagenComoBase64(url) {
  try {
    const respuesta = await fetch(url);

    if (!respuesta.ok) {
      return null;
    }

    const blob = await respuesta.blob();
    const tipo = blob.type.includes('png') ? 'png' : 'jpeg';

    const base64 = await new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onloadend = () => resolve(lector.result.split(',')[1]);
      lector.onerror = reject;
      lector.readAsDataURL(blob);
    });

    return { base64, tipo };
  } catch {
    return null;
  }
}

// Exporta el stock completo a Excel, con una miniatura de cada
// producto en la primera columna.
export async function exportarStockAExcel(productos) {
  const ExcelJS = await cargarExcelJS();
  const libro = new ExcelJS.Workbook();
  const hoja = libro.addWorksheet('Stock');

  hoja.columns = [
    { header: 'Foto', key: 'foto', width: 12 },
    { header: 'Producto', key: 'nombre', width: 30 },
    { header: 'Precio (S/)', key: 'precio', width: 14 },
    { header: 'Stock actual', key: 'stock', width: 14 },
    { header: 'Activo', key: 'activo', width: 10 },
  ];

  hoja.getRow(1).font = { bold: true };

  for (let indice = 0; indice < productos.length; indice += 1) {
    const producto = productos[indice];
    const numeroFila = indice + 2;

    hoja.addRow({
      foto: '',
      nombre: producto.nombre,
      precio: Number(producto.precio),
      stock: Number(producto.stock_actual),
      activo: producto.activo ? 'Sí' : 'No',
    });

    hoja.getRow(numeroFila).height = 48;

    if (producto.imagen_url) {
      const imagen = await obtenerImagenComoBase64(producto.imagen_url);

      if (imagen) {
        const idImagen = libro.addImage({
          base64: `data:image/${imagen.tipo};base64,${imagen.base64}`,
          extension: imagen.tipo,
        });

        hoja.addImage(idImagen, {
          tl: { col: 0.1, row: numeroFila - 1 + 0.1 },
          ext: { width: 48, height: 48 },
        });
      }
    }
  }

  const buffer = await libro.xlsx.writeBuffer();
  const fecha = new Date().toISOString().slice(0, 10);
  descargarArchivo(
    buffer,
    `mil-estilos-stock-${fecha}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}

// Exporta un resumen detallado de ventas (pedidos facturados) a Excel.
export async function exportarResumenVentasAExcel(pedidos) {
  const ExcelJS = await cargarExcelJS();
  const libro = new ExcelJS.Workbook();

  const hojaResumen = libro.addWorksheet('Resumen de pedidos');

  hojaResumen.columns = [
    { header: 'Código', key: 'codigo', width: 18 },
    { header: 'Fecha', key: 'fecha', width: 14 },
    { header: 'Cliente', key: 'cliente', width: 24 },
    { header: 'Estado', key: 'estado', width: 14 },
    { header: 'Pagado', key: 'pagado', width: 10 },
    { header: 'Método de pago', key: 'metodo', width: 16 },
    { header: 'Total (S/)', key: 'total', width: 14 },
  ];

  hojaResumen.getRow(1).font = { bold: true };

  pedidos.forEach((pedido) => {
    hojaResumen.addRow({
      codigo: pedido.codigo_pedido,
      fecha: new Date(pedido.creado_en).toLocaleDateString('es-PE'),
      cliente: pedido.cliente_nombre || '',
      estado: pedido.estado_pedido,
      pagado: pedido.pagado ? 'Sí' : 'No',
      metodo: pedido.metodo_pago || '',
      total: Number(pedido.total),
    });
  });

  const totalGeneral = pedidos
    .filter((p) => p.estado_pedido === 'facturado')
    .reduce((acumulado, p) => acumulado + Number(p.total), 0);

  hojaResumen.addRow({});
  const filaTotal = hojaResumen.addRow({ cliente: 'Total facturado', total: totalGeneral });
  filaTotal.font = { bold: true };

  const hojaDetalle = libro.addWorksheet('Detalle por producto');

  hojaDetalle.columns = [
    { header: 'Código de pedido', key: 'codigo', width: 18 },
    { header: 'Producto', key: 'producto', width: 28 },
    { header: 'Cantidad', key: 'cantidad', width: 12 },
    { header: 'Precio unitario (S/)', key: 'precio', width: 18 },
    { header: 'Subtotal (S/)', key: 'subtotal', width: 16 },
  ];

  hojaDetalle.getRow(1).font = { bold: true };

  pedidos.forEach((pedido) => {
    const items = pedido.mil_estilos_pedido_items || [];
    items.forEach((item) => {
      hojaDetalle.addRow({
        codigo: pedido.codigo_pedido,
        producto: item.nombre_producto,
        cantidad: Number(item.cantidad),
        precio: Number(item.precio_unitario),
        subtotal: Number(item.total_linea),
      });
    });
  });

  const buffer = await libro.xlsx.writeBuffer();
  const fecha = new Date().toISOString().slice(0, 10);
  descargarArchivo(
    buffer,
    `mil-estilos-ventas-${fecha}.xlsx`,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
}
