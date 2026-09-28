import {
  useEffect,
  useState,
} from 'react';

import { useNavigate } from 'react-router-dom';

import {
  AJUSTES_POR_DEFECTO,
  obtenerAjustesPublicos,
} from '../lib/ajustes';

/*
  Página tipo "Beacons" / link-in-bio, standalone
  (sin Header ni Footer del sitio), pensada para
  poner en la bio de Instagram/TikTok.

  Ruta: /links

  Pedido por Diego (24 sep 2026). Contenido definido
  por él: Tienda BRO, WhatsApp, Instagram y TikTok.
  Diseño: identidad visual de BRO (no una landing
  genérica aparte).
*/

function LinksBro() {
  const navigate =
    useNavigate();

  const [
    ajustes,
    setAjustes,
  ] = useState(
    AJUSTES_POR_DEFECTO
  );

  useEffect(() => {
    let activo = true;

    async function cargarAjustes() {
      const datos =
        await obtenerAjustesPublicos();

      if (activo) {
        setAjustes(
          datos
        );
      }
    }

    cargarAjustes();

    return () => {
      activo = false;
    };
  }, []);

  function irATienda() {
    navigate('/');
  }

  function abrirWhatsApp() {
    const telefono =
      ajustes.whatsappPedidos;

    const mensaje =
      encodeURIComponent(
        'Hola BRO PERU'
      );

    const agente =
      navigator.userAgent ||
      navigator.vendor ||
      window.opera ||
      '';

    const esAndroid =
      /android/i.test(
        agente
      );

    const esIOS =
      /iPad|iPhone|iPod/.test(
        agente
      ) &&
      !window.MSStream;

    if (esAndroid) {
      window.location.href =
        `intent://send?phone=${telefono}&text=${mensaje}#Intent;scheme=whatsapp;package=com.whatsapp;end`;

      return;
    }

    if (esIOS) {
      window.location.href =
        `whatsapp://send?phone=${telefono}&text=${mensaje}`;

      return;
    }

    window.open(
      `https://web.whatsapp.com/send?phone=${telefono}&text=${mensaje}`,
      '_blank',
      'noopener,noreferrer'
    );
  }

  function abrirInstagram() {
    window.open(
      'https://www.instagram.com/tiendabro.pe?igsh=MTRiNmliY3YyMmpjbw==',
      '_blank',
      'noopener,noreferrer'
    );
  }

  function abrirTikTok() {
    window.open(
      'https://www.tiktok.com/@tiendabro.pe?_r=1&_t=ZS-98vGAPlOdmx',
      '_blank',
      'noopener,noreferrer'
    );
  }

  const enlaces = [
    {
      etiqueta:
        'IR A LA TIENDA',
      descripcion:
        'Todos los cuadros y regalos BRO',
      onClick:
        irATienda,
      destacado: true,
    },
    {
      etiqueta:
        'ESCRÍBENOS POR WHATSAPP',
      descripcion:
        'Pedidos y consultas',
      onClick:
        abrirWhatsApp,
    },
    {
      etiqueta:
        'INSTAGRAM',
      descripcion:
        '@tiendabro.pe',
      onClick:
        abrirInstagram,
    },
    {
      etiqueta:
        'TIKTOK',
      descripcion:
        '@tiendabro.pe',
      onClick:
        abrirTikTok,
    },
  ];

  return (
    <main className="bro-links-page">
      <style>
        {`
          .bro-links-page {
            min-height: 100vh;
            width: 100%;
            box-sizing: border-box;
            padding: 64px 24px 48px;
            background: #F4F1EC;
            display: flex;
            justify-content: center;
          }

          .bro-links-wrap {
            width: 100%;
            max-width: 420px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .bro-links-logo {
            margin: 0 0 6px;
            font-family: 'Black Ops One', sans-serif;
            font-size: 42px;
            line-height: 1;
            letter-spacing: -0.05em;
            color: #111111;
          }

          .bro-links-logo span {
            color: #2D5A3D;
          }

          .bro-links-slogan {
            margin: 0 0 36px;
            font-family: 'DM Sans', sans-serif;
            font-size: 12.5px;
            font-weight: 600;
            letter-spacing: 0.04em;
            color: #767676;
            text-align: center;
          }

          .bro-links-lista {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .bro-links-boton {
            width: 100%;
            box-sizing: border-box;
            padding: 16px 20px;
            border: 1px solid rgba(17,17,17,0.14);
            border-radius: 10px;
            background: #ffffff;
            color: #111111;
            text-align: left;
            cursor: pointer;
            transition: transform 0.15s ease, border-color 0.15s ease, background 0.15s ease;
          }

          .bro-links-boton:hover {
            transform: translateY(-1px);
            border-color: #2D5A3D;
          }

          .bro-links-boton.destacado {
            background: #111111;
            border-color: #111111;
          }

          .bro-links-boton.destacado:hover {
            background: #2D5A3D;
            border-color: #2D5A3D;
          }

          .bro-links-boton-etiqueta {
            display: block;
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 800;
            letter-spacing: 0.06em;
          }

          .bro-links-boton.destacado .bro-links-boton-etiqueta {
            color: #ffffff;
          }

          .bro-links-boton-descripcion {
            display: block;
            margin-top: 3px;
            font-family: 'DM Sans', sans-serif;
            font-size: 11.5px;
            color: #8a8a8a;
          }

          .bro-links-boton.destacado .bro-links-boton-descripcion {
            color: #cfcfcf;
          }

          .bro-links-footer {
            margin-top: 40px;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px;
            letter-spacing: 0.04em;
            color: #a5a5a5;
            text-align: center;
          }
        `}
      </style>

      <div className="bro-links-wrap">
        <h1 className="bro-links-logo">
          BR<span>O</span>
        </h1>

        <p className="bro-links-slogan">
          PORQUE ÉL SE LO MERECE.
        </p>

        <div className="bro-links-lista">
          {enlaces.map(
            (enlace) => (
              <button
                key={
                  enlace.etiqueta
                }
                type="button"
                className={
                  enlace.destacado
                    ? 'bro-links-boton destacado'
                    : 'bro-links-boton'
                }
                onClick={
                  enlace.onClick
                }
              >
                <span className="bro-links-boton-etiqueta">
                  {
                    enlace.etiqueta
                  }
                </span>

                <span className="bro-links-boton-descripcion">
                  {
                    enlace.descripcion
                  }
                </span>
              </button>
            )
          )}
        </div>

        <p className="bro-links-footer">
          © 2026 BRO PERÚ
        </p>
      </div>
    </main>
  );
}

export default LinksBro;
