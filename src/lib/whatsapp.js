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

  return new Intl.DateTimeFormat(
    'es-PE',
    {
      timeZone:
        'America/Lima',

      day:
        '2-digit',

      month:
        '2-digit',

      year:
        'numeric',
    }
  ).format(fechaPedido);
}

function formatearHora(fecha) {
  const fechaPedido = fecha
    ? new Date(fecha)
    : new Date();

  return new Intl.DateTimeFormat(
    'es-PE',
    {
      timeZone:
        'America/Lima',

      hour:
        '2-digit',

      minute:
        '2-digit',

      hour12:
        true,
    }
  ).format(fechaPedido);
}

function textoServicio(
  servicio
) {
  return servicio ===
    'domicilio'
    ? 'Domicilio'
    : 'Contraentrega';
}

function textoMetodoPago(
  metodo
) {
  const metodos = {
    yape:
      'Yape',

    plin:
      'Plin',

    transferencia:
      'Transferencia bancaria',

    efectivo:
      'Efectivo',
  };

  return (
    metodos[metodo] ||
    metodo
  );
}

function esDispositivoMovil() {
  if (
    typeof window ===
      'undefined' ||
    typeof navigator ===
      'undefined'
  ) {
    return false;
  }

  const agente =
    navigator.userAgent ||
    '';

  const porAgente =
    /Android|iPhone|iPad|iPod|Mobile/i.test(
      agente
    );

  const porPantalla =
    window.matchMedia?.(
      '(max-width: 760px)'
    )?.matches;

  return Boolean(
    porAgente ||
    porPantalla
  );
}

function crearListadoProductos(
  carrito
) {
  return carrito
    .map((item) => {
      const cantidad =
        Number(
          item.cantidad
        );

      const precio =
        Number(
          item.precio
        );

      const totalLinea =
        cantidad *
        precio;

      const variante =
        item.varianteTexto
          ? `\n   ${item.varianteTexto}`
          : '';

      return (
        `🛒 *X${cantidad} ${item.nombre.toUpperCase()}*` +
        ` — *${formatearDinero(
          totalLinea
        )}*` +
        variante
      );
    })
    .join('\n');
}

function crearDatosPago(
  metodoPago
) {
  if (
    metodoPago ===
      'yape' ||
    metodoPago ===
      'plin'
  ) {
    return [
      `📲 *YAPE / PLIN: ${NUMERO_PAGO}*`,
      `Titular: ${TITULAR_PAGO}`,
    ];
  }

  if (
    metodoPago ===
    'transferencia'
  ) {
    return [
      '🏦 *TRANSFERENCIA BANCARIA*',
      'Te enviaremos los datos bancarios por WhatsApp para realizar el pago.',
    ];
  }

  if (
    metodoPago ===
    'efectivo'
  ) {
    return [
      '💵 *PAGO EN EFECTIVO*',
      'El pago se realizará al momento de la entrega.',
    ];
  }

  return [];
}

export function crearMensajeWhatsAppBro({
  pedido,
  formulario,
  carrito,
}) {
  const codigoPedido =
    pedido.codigo_pedido ||
    '';

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

  const datosPago =
    crearDatosPago(
      formulario.metodoPago
    );

  return [
    '👋 *Vengo de la página BRO PERÚ*',

    '',

    `🗒️ *PEDIDO: ${codigoPedido}*`,

    `🗓️ ${fecha}   ⏰ ${hora}`,

    '',

    `🚚 *Tipo de servicio: ${textoServicio(
      formulario.servicio
    )}*`,

    '',

    '👤 *DATOS DEL CLIENTE*',

    `Nombre: ${formulario.nombre.trim()}`,

    `Teléfono: ${formulario.telefono.trim()}`,

    `Documento: ${formulario.dni.trim()}`,

    datosEntrega ||
      null,

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

    ...datosPago,

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

  const movil =
    esDispositivoMovil();

  /*
    MÓVIL

    wa.me funciona como enlace universal
    de WhatsApp.

    Si WhatsApp está instalado,
    Android/iOS pueden entregar el enlace
    directamente a la aplicación.
  */
  if (movil) {
    const urlMovil =
      `https://wa.me/${WHATSAPP_PEDIDOS}` +
      `?text=${texto}`;

    /*
      Si por alguna razón App.jsx hubiera
      creado una pestaña auxiliar, la
      cerramos. En móvil no la queremos.
    */
    if (
      ventanaWhatsApp &&
      !ventanaWhatsApp.closed
    ) {
      ventanaWhatsApp.close();
    }

    window.location.assign(
      urlMovil
    );

    return;
  }

  /*
    ESCRITORIO

    Aquí sí utilizamos WhatsApp Web.
  */
  const urlEscritorio =
    `https://web.whatsapp.com/send` +
    `?phone=${WHATSAPP_PEDIDOS}` +
    `&text=${texto}`;

  /*
    App.jsx abre previamente esta pestaña
    para evitar que Chrome bloquee el popup
    después de esperar la respuesta de
    Supabase.
  */
  if (
    ventanaWhatsApp &&
    !ventanaWhatsApp.closed
  ) {
    ventanaWhatsApp.location.href =
      urlEscritorio;

    return;
  }

  window.location.assign(
    urlEscritorio
  );
}