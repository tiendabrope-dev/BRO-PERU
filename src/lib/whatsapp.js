const WHATSAPP_PEDIDOS = '51931330058';

const NUMERO_PAGO = '926555219';

const TITULAR_PAGO = 'DIEGO LOP* VAL*';

function formatearDinero(valor) {
  return `S/ ${Number(valor).toFixed(2)}`;
}

function formatearFecha(fecha) {
  const fechaPedido = fecha
    ? new Date(fecha)
    : new Date();

  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fechaPedido);
}

function formatearHora(fecha) {
  const fechaPedido = fecha
    ? new Date(fecha)
    : new Date();

  return new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(fechaPedido);
}

function textoServicio(servicio) {
  return servicio === 'domicilio'
    ? 'Domicilio'
    : 'Contraentrega';
}

function textoMetodoPago(metodo) {
  const metodos = {
    yape: 'Yape',
    plin: 'Plin',
    transferencia: 'Transferencia',
    tarjetas: 'Tarjetas',
    efectivo: 'Efectivo',
  };

  return metodos[metodo] || metodo;
}

function crearListadoProductos(carrito) {
  return carrito
    .map((item) => {
      const cantidad =
        Number(item.cantidad);

      const precio =
        Number(item.precio);

      const totalLinea =
        cantidad * precio;

      const variante =
        item.varianteTexto
          ? `\n   ${item.varianteTexto}`
          : '';

      return (
        `🛒 *X${cantidad} ${item.nombre.toUpperCase()}*` +
        ` — *${formatearDinero(totalLinea)}*` +
        variante
      );
    })
    .join('\n');
}

export function crearMensajeWhatsAppBro({
  pedido,
  formulario,
  carrito,
}) {
  const codigoPedido =
    pedido.codigo_pedido || '';

  const fecha =
    formatearFecha(
      pedido.creado_en
    );

  const hora =
    formatearHora(
      pedido.creado_en
    );

  const subtotal =
    Number(
      pedido.subtotal
    );

  const delivery =
    Number(
      pedido.delivery
    );

  const total =
    Number(
      pedido.total
    );

  const productos =
    crearListadoProductos(
      carrito
    );

  const datosEntrega =
    formulario.servicio ===
    'domicilio'
      ? [
          `Dirección: ${formulario.direccion.trim()}`,

          `Distrito: ${formulario.distrito.trim()}`,

          formulario.referencia.trim()
            ? `Referencia: ${formulario.referencia.trim()}`
            : null,
        ]
          .filter(Boolean)
          .join('\n')
      : '';

  return [
    '👋 *Vengo de la página BRO PERU*',

    '',

    `🗒️ *PEDIDO: ${codigoPedido}*`,

    `🗓️ ${fecha}   ⏰ ${hora}`,

    '',

    `🚛 *Tipo de servicio: ${textoServicio(
      formulario.servicio
    )}*`,

    '',

    '👤 *DATOS DEL CLIENTE*',

    `Nombre: ${formulario.nombre.trim()}`,

    `Teléfono: ${formulario.telefono.trim()}`,

    `DNI: ${formulario.dni.trim()}`,

    datosEntrega || null,

    '',

    '📋 *PRODUCTOS*',

    productos,

    '',

    '💰 *RESUMEN*',

    `Subtotal: ${formatearDinero(
      subtotal
    )}`,

    `Entrega: ${formatearDinero(
      delivery
    )}`,

    `*TOTAL: ${formatearDinero(
      total
    )}*`,

    '',

    '💳 *PAGO*',

    'Estado del pago: *NO PAGADO*',

    `Método: *${textoMetodoPago(
      formulario.metodoPago
    )}*`,

    `*Total a pagar: ${formatearDinero(
      total
    )}*`,

    '',

    `📲 *YAPE / PLIN: ${NUMERO_PAGO}*`,

    `Titular: ${TITULAR_PAGO}`,

    '',

    '☝️ *ENVÍANOS ESTE MENSAJE AHORA.*',

    'En cuanto lo recibamos estaremos atendiendo tu pedido. ✅',
  ]
    .filter(
      (linea) =>
        linea !== null
    )
    .join('\n');
}

export function abrirWhatsAppBro({
  pedido,
  formulario,
  carrito,
  ventanaWhatsApp = null,
}) {
  const mensaje =
    crearMensajeWhatsAppBro({
      pedido,
      formulario,
      carrito,
    });

  const texto =
    encodeURIComponent(
      mensaje
    );

  const url =
    `https://web.whatsapp.com/send` +
    `?phone=${WHATSAPP_PEDIDOS}` +
    `&text=${texto}`;

  /*
    Si App.jsx ya abrió una pestaña
    en el momento exacto en que el
    usuario presionó CONFIRMAR PEDIDO,
    reutilizamos esa pestaña.

    De esta forma Chrome no bloquea
    WhatsApp como popup.
  */
  if (
    ventanaWhatsApp &&
    !ventanaWhatsApp.closed
  ) {
    ventanaWhatsApp.location.href =
      url;

    return;
  }

  /*
    Si por alguna razón Chrome no
    permitió crear una pestaña nueva,
    abrimos WhatsApp en la pestaña
    actual para que el cliente nunca
    se quede detenido.
  */
  window.location.href =
    url;
}