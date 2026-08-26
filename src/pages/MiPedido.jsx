import { useState } from 'react';
import { supabase } from '../lib/supabase';

function formatearDinero(valor) {
  return `S/ ${Number(valor || 0).toFixed(2)}`;
}

function formatearFecha(fecha) {
  if (!fecha) {
    return '';
  }

  return new Intl.DateTimeFormat(
    'es-PE',
    {
      timeZone: 'America/Lima',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  ).format(
    new Date(fecha)
  );
}

function textoEstadoPedido(estado) {
  const estados = {
    nuevo:
      'PEDIDO RECIBIDO',

    confirmado:
      'PEDIDO CONFIRMADO',

    preparacion:
      'EN PREPARACIÓN',

    en_preparacion:
      'EN PREPARACIÓN',

    listo:
      'LISTO PARA ENTREGA',

    enviado:
      'EN CAMINO',

    entregado:
      'ENTREGADO',

    cancelado:
      'CANCELADO',
  };

  return (
    estados[estado] ||
    String(
      estado ||
      'Sin información'
    )
      .replace(
        /_/g,
        ' '
      )
      .toUpperCase()
  );
}

function textoEstadoPago(estado) {
  const estados = {
    no_pagado:
      'NO PAGADO',

    pagado:
      'PAGADO',

    pendiente:
      'PENDIENTE',

    rechazado:
      'RECHAZADO',
  };

  return (
    estados[estado] ||
    String(
      estado ||
      'Sin información'
    )
      .replace(
        /_/g,
        ' '
      )
      .toUpperCase()
  );
}

function textoMetodoPago(metodo) {
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
    metodo ||
    'Sin información'
  );
}

function textoServicio(servicio) {
  if (
    servicio ===
    'domicilio'
  ) {
    return 'Domicilio';
  }

  if (
    servicio ===
    'contraentrega'
  ) {
    return 'Contraentrega';
  }

  return (
    servicio ||
    'Sin información'
  );
}

function MiPedido() {
  const [
    consultaPedido,
    setConsultaPedido,
  ] = useState({
    nombre: '',
    dni: '',
    pedido: '',
  });

  const [
    errorConsulta,
    setErrorConsulta,
  ] = useState('');

  const [
    consultando,
    setConsultando,
  ] = useState(false);

  const [
    pedidoEncontrado,
    setPedidoEncontrado,
  ] = useState(null);

  function actualizarConsulta(
    evento
  ) {
    const {
      name,
      value,
    } = evento.target;

    let nuevoValor =
      value;

    if (
      name === 'dni'
    ) {
      nuevoValor =
        value
          .replace(
            /\D/g,
            ''
          )
          .slice(
            0,
            8
          );
    }

    if (
      name === 'pedido'
    ) {
      nuevoValor =
        value.toUpperCase();
    }

    setConsultaPedido(
      (actual) => ({
        ...actual,

        [name]:
          nuevoValor,
      })
    );

    setErrorConsulta('');

    setPedidoEncontrado(
      null
    );
  }

  async function consultarPedido(
    evento
  ) {
    evento.preventDefault();

    const nombre =
      consultaPedido.nombre.trim();

    const dni =
      consultaPedido.dni.trim();

    const pedido =
      consultaPedido.pedido
        .trim()
        .toUpperCase();

    if (!nombre) {
      setErrorConsulta(
        'Ingresa tu nombre completo.'
      );

      return;
    }

    if (
      !/^\d{8}$/.test(
        dni
      )
    ) {
      setErrorConsulta(
        'Ingresa un DNI válido de 8 dígitos.'
      );

      return;
    }

    if (!pedido) {
      setErrorConsulta(
        'Ingresa tu número de pedido.'
      );

      return;
    }

    if (
      !/^BP-\d+$/i.test(
        pedido
      )
    ) {
      setErrorConsulta(
        'Ingresa un código de pedido válido. Ejemplo: BP-1000516.'
      );

      return;
    }

    setConsultando(true);

    setErrorConsulta('');

    setPedidoEncontrado(
      null
    );

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        'consultar_pedido_bro',
        {
          p_codigo_pedido:
            pedido,

          p_dni:
            dni,

          p_nombre_completo:
            nombre,
        }
      );

      if (error) {
        console.error(
          'Error consultando pedido:',
          error
        );

        throw error;
      }

      if (
        !data ||
        data.length === 0
      ) {
        setErrorConsulta(
          'No encontramos un pedido con esos datos. Verifica tu nombre, DNI y número de pedido.'
        );

        return;
      }

      setPedidoEncontrado(
        data[0]
      );
    } catch (error) {
      console.error(
        error
      );

      setErrorConsulta(
        'No pudimos consultar tu pedido en este momento. Inténtalo nuevamente.'
      );
    } finally {
      setConsultando(false);
    }
  }

  const items =
    Array.isArray(
      pedidoEncontrado?.items
    )
      ? pedidoEncontrado.items
      : [];

  return (
    <main
      style={{
        position:
          'relative',

        width:
          '100vw',

        minHeight:
          '100vh',

        backgroundColor:
          '#F4F1EC',

        display:
          'flex',

        alignItems:
          'flex-start',

        justifyContent:
          'center',

        padding:
          '90px 20px',

        overflow:
          'hidden',

        boxSizing:
          'border-box',
      }}
    >
      {/* BOTÓN VOLVER */}

      <button
        type="button"
        onClick={() =>
          window.location.href =
            '/'
        }
        style={{
          position:
            'absolute',

          top:
            '40px',

          left:
            '6vw',

          background:
            'transparent',

          border:
            'none',

          display:
            'flex',

          alignItems:
            'center',

          gap:
            '8px',

          color:
            '#2D5A3D',

          fontWeight:
            '700',

          fontSize:
            '13px',

          cursor:
            'pointer',

          letterSpacing:
            '0.1em',

          zIndex:
            20,
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line
            x1="19"
            y1="12"
            x2="5"
            y2="12"
          />

          <polyline
            points="12 19 5 12 12 5"
          />
        </svg>

        VOLVER
      </button>

      {/* CONTENIDO */}

      <div
        style={{
          position:
            'relative',

          zIndex:
            10,

          width:
            '100%',

          maxWidth:
            '720px',

          boxSizing:
            'border-box',
        }}
      >
        {/* TARJETA CONSULTA */}

        <div
          style={{
            width:
              '100%',

            padding:
              '50px 60px',

            background:
              '#ffffff',

            border:
              '1px solid rgba(0, 0, 0, 0.08)',

            borderRadius:
              '16px',

            boxShadow:
              '0 20px 50px rgba(0, 0, 0, 0.06)',

            textAlign:
              'center',

            boxSizing:
              'border-box',
          }}
        >
          {/* ICONO */}

          <div
            style={{
              width:
                '64px',

              height:
                '64px',

              margin:
                '0 auto 22px',

              background:
                '#E8F0EA',

              borderRadius:
                '50%',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >
            <svg
              width="30"
              height="30"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2D5A3D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"
              />

              <polyline
                points="3.27 6.96 12 12.01 20.73 6.96"
              />

              <line
                x1="12"
                y1="22.08"
                x2="12"
                y2="12"
              />
            </svg>
          </div>

          <h1
            style={{
              margin:
                '0 0 8px',

              fontFamily:
                'Syne, sans-serif',

              fontSize:
                '32px',

              fontWeight:
                '800',

              letterSpacing:
                '-0.03em',

              color:
                '#2D5A3D',

              textTransform:
                'uppercase',
            }}
          >
            RASTREA TU PEDIDO
          </h1>

          <p
            style={{
              margin:
                '0 0 32px',

              fontFamily:
                'DM Sans, sans-serif',

              fontSize:
                '15px',

              color:
                '#666666',
            }}
          >
            Consulta el estado de tu pedido BRO.
          </p>

          <form
            onSubmit={
              consultarPedido
            }
            style={{
              display:
                'grid',

              gap:
                '22px',

              textAlign:
                'left',
            }}
          >
            <div
              style={{
                display:
                  'grid',

                gridTemplateColumns:
                  'repeat(auto-fit, minmax(210px, 1fr))',

                gap:
                  '16px',
              }}
            >
              {/* NOMBRE */}

              <div
                style={{
                  display:
                    'grid',

                  gap:
                    '8px',
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'DM Sans, sans-serif',

                    fontSize:
                      '11px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.12em',

                    color:
                      '#111111',
                  }}
                >
                  NOMBRE COMPLETO
                </span>

                <div
                  style={{
                    position:
                      'relative',

                    width:
                      '100%',
                  }}
                >
                  <svg
                    style={{
                      position:
                        'absolute',

                      left:
                        '14px',

                      top:
                        '50%',

                      transform:
                        'translateY(-50%)',

                      width:
                        '18px',

                      height:
                        '18px',

                      color:
                        '#2D5A3D',

                      pointerEvents:
                        'none',
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path
                      d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"
                    />

                    <circle
                      cx="12"
                      cy="7"
                      r="4"
                    />
                  </svg>

                  <input
                    type="text"
                    name="nombre"
                    value={
                      consultaPedido.nombre
                    }
                    onChange={
                      actualizarConsulta
                    }
                    placeholder="Tu nombre"
                    autoComplete="name"
                    disabled={
                      consultando
                    }
                    style={{
                      width:
                        '100%',

                      height:
                        '52px',

                      padding:
                        '0 16px 0 44px',

                      border:
                        '1px solid #cccccc',

                      borderRadius:
                        '6px',

                      background:
                        '#ffffff',

                      fontFamily:
                        'DM Sans, sans-serif',

                      fontSize:
                        '14px',

                      outline:
                        'none',

                      boxSizing:
                        'border-box',
                    }}
                  />
                </div>
              </div>

              {/* DNI */}

              <div
                style={{
                  display:
                    'grid',

                  gap:
                    '8px',
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'DM Sans, sans-serif',

                    fontSize:
                      '11px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.12em',

                    color:
                      '#111111',
                  }}
                >
                  DNI
                </span>

                <div
                  style={{
                    position:
                      'relative',

                    width:
                      '100%',
                  }}
                >
                  <svg
                    style={{
                      position:
                        'absolute',

                      left:
                        '14px',

                      top:
                        '50%',

                      transform:
                        'translateY(-50%)',

                      width:
                        '18px',

                      height:
                        '18px',

                      color:
                        '#2D5A3D',

                      pointerEvents:
                        'none',
                    }}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect
                      x="3"
                      y="6"
                      width="18"
                      height="12"
                      rx="2"
                    />

                    <circle
                      cx="8"
                      cy="12"
                      r="2"
                    />

                    <line
                      x1="13"
                      y1="11"
                      x2="19"
                      y2="11"
                    />

                    <line
                      x1="13"
                      y1="14"
                      x2="19"
                      y2="14"
                    />
                  </svg>

                  <input
                    type="text"
                    name="dni"
                    maxLength={8}
                    inputMode="numeric"
                    value={
                      consultaPedido.dni
                    }
                    onChange={
                      actualizarConsulta
                    }
                    placeholder="Tu DNI"
                    disabled={
                      consultando
                    }
                    style={{
                      width:
                        '100%',

                      height:
                        '52px',

                      padding:
                        '0 16px 0 44px',

                      border:
                        '1px solid #cccccc',

                      borderRadius:
                        '6px',

                      background:
                        '#ffffff',

                      fontFamily:
                        'DM Sans, sans-serif',

                      fontSize:
                        '14px',

                      outline:
                        'none',

                      boxSizing:
                        'border-box',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* NÚMERO PEDIDO */}

            <div
              style={{
                display:
                  'grid',

                gap:
                  '8px',
              }}
            >
              <span
                style={{
                  fontFamily:
                    'DM Sans, sans-serif',

                  fontSize:
                    '11px',

                  fontWeight:
                    '700',

                  letterSpacing:
                    '0.12em',

                  color:
                    '#111111',
                }}
              >
                NÚMERO DE PEDIDO
              </span>

              <div
                style={{
                  position:
                    'relative',

                  width:
                    '100%',
                }}
              >
                <svg
                  style={{
                    position:
                      'absolute',

                    left:
                      '14px',

                    top:
                      '50%',

                    transform:
                      'translateY(-50%)',

                    width:
                      '18px',

                    height:
                      '18px',

                    color:
                      '#2D5A3D',

                    pointerEvents:
                      'none',
                  }}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
                  />

                  <rect
                    x="8"
                    y="2"
                    width="8"
                    height="4"
                    rx="1"
                    ry="1"
                  />

                  <path
                    d="M9 14h6"
                  />

                  <path
                    d="M9 18h6"
                  />

                  <path
                    d="M9 10h6"
                  />
                </svg>

                <input
                  type="text"
                  name="pedido"
                  value={
                    consultaPedido.pedido
                  }
                  onChange={
                    actualizarConsulta
                  }
                  placeholder="BP-1000516"
                  disabled={
                    consultando
                  }
                  style={{
                    width:
                      '100%',

                    height:
                      '52px',

                    padding:
                      '0 16px 0 44px',

                    border:
                      '1px solid #cccccc',

                    borderRadius:
                      '6px',

                    background:
                      '#ffffff',

                    fontFamily:
                      'DM Sans, sans-serif',

                    fontSize:
                      '14px',

                    outline:
                      'none',

                    boxSizing:
                      'border-box',

                    textTransform:
                      'uppercase',
                  }}
                />
              </div>

              <span
                style={{
                  fontSize:
                    '12px',

                  color:
                    '#888888',

                  marginTop:
                    '2px',

                  fontWeight:
                    '400',
                }}
              >
                Ejemplo: BP-1000516
              </span>
            </div>

            {/* ERROR */}

            {errorConsulta && (
              <div
                style={{
                  padding:
                    '13px 15px',

                  borderRadius:
                    '6px',

                  background:
                    '#fff1f1',

                  color:
                    '#b52525',

                  fontFamily:
                    'DM Sans, sans-serif',

                  fontSize:
                    '13px',

                  textAlign:
                    'center',
                }}
              >
                {errorConsulta}
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              disabled={
                consultando
              }
              style={{
                width:
                  '100%',

                height:
                  '52px',

                marginTop:
                  '4px',

                border:
                  '0',

                borderRadius:
                  '6px',

                background:
                  consultando
                    ? '#767676'
                    : '#2D5A3D',

                color:
                  '#ffffff',

                cursor:
                  consultando
                    ? 'wait'
                    : 'pointer',

                fontFamily:
                  'DM Sans, sans-serif',

                fontSize:
                  '13px',

                fontWeight:
                  '700',

                letterSpacing:
                  '0.13em',

                transition:
                  'background 0.2s ease',
              }}
            >
              {consultando
                ? 'CONSULTANDO...'
                : 'CONSULTAR PEDIDO'}
            </button>

            {/* FOOTER */}

            <div
              style={{
                position:
                  'relative',

                marginTop:
                  '24px',

                textAlign:
                  'center',
              }}
            >
              <div
                style={{
                  position:
                    'absolute',

                  top:
                    '12px',

                  left:
                    '0',

                  right:
                    '0',

                  height:
                    '1px',

                  background:
                    '#eaeaea',

                  zIndex:
                    0,
                }}
              />

              <span
                style={{
                  position:
                    'relative',

                  display:
                    'inline-block',

                  padding:
                    '0 15px',

                  background:
                    '#ffffff',

                  zIndex:
                    1,
                }}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#2D5A3D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect
                    x="1"
                    y="3"
                    width="15"
                    height="13"
                  />

                  <polygon
                    points="16 8 20 8 23 11 23 16 16 16 16 8"
                  />

                  <circle
                    cx="5.5"
                    cy="18.5"
                    r="2.5"
                  />

                  <circle
                    cx="18.5"
                    cy="18.5"
                    r="2.5"
                  />
                </svg>
              </span>
            </div>

            <p
              style={{
                margin:
                  '14px 0 0',

                fontSize:
                  '13px',

                color:
                  '#555555',

                lineHeight:
                  '1.6',

                textAlign:
                  'center',

                fontWeight:
                  '500',
              }}
            >
              Realizamos envíos coordinados a todo el Perú.
              <br />
              Tu pedido, nuestra prioridad.
            </p>
          </form>
        </div>

        {/* =========================
            RESULTADO DEL PEDIDO
        ========================= */}

        {pedidoEncontrado && (
          <div
            style={{
              marginTop:
                '24px',

              padding:
                '32px',

              background:
                '#ffffff',

              border:
                '1px solid rgba(0,0,0,0.08)',

              borderRadius:
                '16px',

              boxShadow:
                '0 20px 50px rgba(0,0,0,0.05)',

              boxSizing:
                'border-box',

              fontFamily:
                'DM Sans, sans-serif',
            }}
          >
            <div
              style={{
                display:
                  'flex',

                justifyContent:
                  'space-between',

                alignItems:
                  'flex-start',

                gap:
                  '20px',

                flexWrap:
                  'wrap',

                marginBottom:
                  '25px',
              }}
            >
              <div>
                <span
                  style={{
                    display:
                      'block',

                    fontSize:
                      '11px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.12em',

                    color:
                      '#767676',

                    marginBottom:
                      '7px',
                  }}
                >
                  PEDIDO
                </span>

                <h2
                  style={{
                    margin:
                      0,

                    fontFamily:
                      'Syne, sans-serif',

                    fontSize:
                      '28px',

                    color:
                      '#111111',
                  }}
                >
                  {
                    pedidoEncontrado.codigo_pedido
                  }
                </h2>

                <p
                  style={{
                    margin:
                      '5px 0 0',

                    color:
                      '#767676',

                    fontSize:
                      '13px',
                  }}
                >
                  {formatearFecha(
                    pedidoEncontrado.creado_en
                  )}
                </p>
              </div>

              <div
                style={{
                  padding:
                    '9px 14px',

                  borderRadius:
                    '999px',

                  background:
                    '#E8F0EA',

                  color:
                    '#2D5A3D',

                  fontSize:
                    '12px',

                  fontWeight:
                    '800',

                  letterSpacing:
                    '0.06em',
                }}
              >
                {textoEstadoPedido(
                  pedidoEncontrado.estado_pedido
                )}
              </div>
            </div>

            {/* DATOS GENERALES */}

            <div
              style={{
                display:
                  'grid',

                gridTemplateColumns:
                  'repeat(auto-fit, minmax(140px, 1fr))',

                gap:
                  '12px',

                marginBottom:
                  '28px',
              }}
            >
              <div
                style={{
                  padding:
                    '15px',

                  background:
                    '#F4F1EC',

                  borderRadius:
                    '8px',
                }}
              >
                <span
                  style={{
                    display:
                      'block',

                    color:
                      '#767676',

                    fontSize:
                      '10px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.08em',

                    marginBottom:
                      '5px',
                  }}
                >
                  SERVICIO
                </span>

                <strong>
                  {textoServicio(
                    pedidoEncontrado.tipo_servicio
                  )}
                </strong>
              </div>

              <div
                style={{
                  padding:
                    '15px',

                  background:
                    '#F4F1EC',

                  borderRadius:
                    '8px',
                }}
              >
                <span
                  style={{
                    display:
                      'block',

                    color:
                      '#767676',

                    fontSize:
                      '10px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.08em',

                    marginBottom:
                      '5px',
                  }}
                >
                  PAGO
                </span>

                <strong>
                  {textoMetodoPago(
                    pedidoEncontrado.metodo_pago
                  )}
                </strong>
              </div>

              <div
                style={{
                  padding:
                    '15px',

                  background:
                    '#F4F1EC',

                  borderRadius:
                    '8px',
                }}
              >
                <span
                  style={{
                    display:
                      'block',

                    color:
                      '#767676',

                    fontSize:
                      '10px',

                    fontWeight:
                      '700',

                    letterSpacing:
                      '0.08em',

                    marginBottom:
                      '5px',
                  }}
                >
                  ESTADO DEL PAGO
                </span>

                <strong>
                  {textoEstadoPago(
                    pedidoEncontrado.estado_pago
                  )}
                </strong>
              </div>
            </div>

            {/* PRODUCTOS */}

            <div
              style={{
                borderTop:
                  '1px solid #EBEBEB',

                paddingTop:
                  '24px',
              }}
            >
              <h3
                style={{
                  margin:
                    '0 0 16px',

                  fontFamily:
                    'Syne, sans-serif',

                  fontSize:
                    '16px',

                  color:
                    '#111111',
                }}
              >
                PRODUCTOS
              </h3>

              <div
                style={{
                  display:
                    'grid',

                  gap:
                    '12px',
                }}
              >
                {items.map(
                  (
                    item,
                    index
                  ) => (
                    <div
                      key={
                        item.id ||
                        index
                      }
                      style={{
                        display:
                          'grid',

                        gridTemplateColumns:
                          '1fr auto',

                        gap:
                          '15px',

                        alignItems:
                          'center',

                        padding:
                          '14px 0',

                        borderBottom:
                          '1px solid #EBEBEB',
                      }}
                    >
                      <div>
                        <strong
                          style={{
                            display:
                              'block',

                            color:
                              '#111111',

                            fontSize:
                              '14px',
                          }}
                        >
                          {
                            item.nombre_producto
                          }
                        </strong>

                        {item.variante_texto && (
                          <span
                            style={{
                              display:
                                'block',

                              color:
                                '#2D5A3D',

                              fontSize:
                                '12px',

                              fontWeight:
                                '700',

                              marginTop:
                                '4px',
                            }}
                          >
                            {
                              item.variante_texto
                            }
                          </span>
                        )}

                        <span
                          style={{
                            display:
                              'block',

                            color:
                              '#767676',

                            fontSize:
                              '12px',

                            marginTop:
                              '4px',
                          }}
                        >
                          {item.cantidad}
                          {' × '}
                          {formatearDinero(
                            item.precio_unitario
                          )}
                        </span>
                      </div>

                      <strong
                        style={{
                          color:
                            '#111111',
                        }}
                      >
                        {formatearDinero(
                          item.total_linea
                        )}
                      </strong>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* TOTALES */}

            <div
              style={{
                marginTop:
                  '20px',

                display:
                  'grid',

                gap:
                  '9px',
              }}
            >
              <div
                style={{
                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  gap:
                    '20px',

                  fontSize:
                    '13px',

                  color:
                    '#767676',
                }}
              >
                <span>
                  Subtotal
                </span>

                <strong>
                  {formatearDinero(
                    pedidoEncontrado.subtotal
                  )}
                </strong>
              </div>

              <div
                style={{
                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  gap:
                    '20px',

                  fontSize:
                    '13px',

                  color:
                    '#767676',
                }}
              >
                <span>
                  Delivery
                </span>

                <strong>
                  {formatearDinero(
                    pedidoEncontrado.delivery
                  )}
                </strong>
              </div>

              <div
                style={{
                  display:
                    'flex',

                  justifyContent:
                    'space-between',

                  alignItems:
                    'center',

                  gap:
                    '20px',

                  marginTop:
                    '7px',

                  paddingTop:
                    '15px',

                  borderTop:
                    '2px solid #111111',
                }}
              >
                <span
                  style={{
                    fontFamily:
                      'Syne, sans-serif',

                    fontWeight:
                      '800',

                    fontSize:
                      '15px',
                  }}
                >
                  TOTAL
                </span>

                <strong
                  style={{
                    fontFamily:
                      'Syne, sans-serif',

                    fontSize:
                      '22px',

                    color:
                      '#2D5A3D',
                  }}
                >
                  {formatearDinero(
                    pedidoEncontrado.total
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MiPedido;