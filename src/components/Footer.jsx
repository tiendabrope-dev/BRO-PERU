function Footer({
  onCategoria,
  onPreguntas,
  onMiPedido,
  onContacto,
}) {
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

  function abrirWhatsApp() {
    window.open(
      'https://web.whatsapp.com/send?phone=51931330058&text=Hola%20BRO%20PERU',
      '_blank',
      'noopener,noreferrer'
    );
  }

  return (
    <footer
      className="footer bro-footer-v2"
      id="contacto"
      style={{
        padding: '32px 6% 24px',
      }}
    >
      <style>
        {`
          /* ==================================================
             FOOTER BRO
             Estos estilos adicionales actúan principalmente
             sobre la versión móvil.

             El escritorio conserva la composición existente.
          ================================================== */

          .bro-footer-v2
          .bro-footer-socials {
            margin-top:
              10px;

            display:
              flex;

            gap:
              8px;

            align-items:
              center;

            justify-content:
              flex-start;

            font-size:
              12px;

            color:
              #999999;
          }

          .bro-footer-v2
          .bro-footer-social-link {
            padding:
              0;

            border:
              0;

            background:
              transparent;

            color:
              #ffffff;

            font:
              inherit;

            font-weight:
              600;

            cursor:
              pointer;
          }

          .bro-footer-v2
          .bro-footer-social-link.whatsapp {
            color:
              #cccccc;

            font-weight:
              400;
          }

          .bro-footer-v2
          .bro-footer-payment {
            display:
              flex;

            flex-direction:
              column;

            gap:
              3px;

            color:
              #cccccc;

            font-size:
              11.5px;
          }

          .bro-footer-v2
          .bro-footer-payment-label {
            color:
              #888888;

            font-size:
              10.5px;
          }

          .bro-footer-v2
          .bro-footer-payment-methods {
            color:
              #ffffff;

            font-size:
              11.5px;

            letter-spacing:
              0.04em;
          }

          /* ==================================================
             MÓVIL
          ================================================== */

          @media (
            max-width:
              700px
          ) {

            /* ===============================================
               FOOTER GENERAL
            =============================================== */

            .bro-footer-v2 {
              padding:
                44px
                22px
                24px
                !important;

              box-sizing:
                border-box;
            }

            /* ===============================================
               GRID PRINCIPAL
            =============================================== */

            .bro-footer-v2
            .footer-main {
              width:
                100%
                !important;

              max-width:
                none
                !important;

              margin:
                0
                !important;

              padding:
                0 0
                36px
                !important;

              display:
                grid
                !important;

              grid-template-columns:
                minmax(0, 1fr)
                minmax(0, 1fr)
                !important;

              column-gap:
                28px
                !important;

              row-gap:
                0
                !important;

              align-items:
                start
                !important;

              text-align:
                left
                !important;
            }

            /* ===============================================
               MARCA

               Ocupa las dos columnas y queda centrada.
            =============================================== */

            .bro-footer-v2
            .footer-brand {
              grid-column:
                1 / -1
                !important;

              width:
                100%
                !important;

              margin:
                0 0
                38px
                !important;

              padding:
                0 0
                30px
                !important;

              border-bottom:
                1px solid
                #252525;

              box-sizing:
                border-box;

              text-align:
                center
                !important;
            }

            .bro-footer-v2
            .footer-brand
            .footer-logo {
              margin:
                0 auto
                14px
                !important;

              font-size:
                34px
                !important;

              line-height:
                1
                !important;

              text-align:
                center
                !important;
            }

            .bro-footer-v2
            .footer-brand
            > p {
              margin:
                0
                !important;

              color:
                #9a9a9a
                !important;

              font-size:
                12.5px
                !important;

              line-height:
                1.55
                !important;

              text-align:
                center
                !important;
            }

            /* ===============================================
               REDES
            =============================================== */

            .bro-footer-v2
            .bro-footer-socials {
              width:
                100%;

              margin:
                17px auto
                0;

              display:
                flex;

              align-items:
                center;

              justify-content:
                center
                !important;

              flex-wrap:
                wrap;

              gap:
                7px;

              font-size:
                12px;
            }

            /* ===============================================
               COMPRAR + AYUDA

               Dos columnas iguales y ordenadas.
            =============================================== */

            .bro-footer-v2
            .footer-column {
              width:
                100%
                !important;

              min-width:
                0;

              margin:
                0
                !important;

              padding:
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                flex-start
                !important;

              gap:
                0
                !important;

              text-align:
                left
                !important;
            }

            .bro-footer-v2
            .footer-column
            h4 {
              min-height:
                32px;

              margin:
                0 0
                13px
                !important;

              font-size:
                11px
                !important;

              line-height:
                1.25;

              letter-spacing:
                0.11em
                !important;
            }

            .bro-footer-v2
            .footer-column
            button {
              width:
                100%
                !important;

              min-height:
                34px;

              margin:
                0
                !important;

              padding:
                6px 0
                !important;

              color:
                #8f8f8f
                !important;

              font-size:
                12px
                !important;

              line-height:
                1.4
                !important;

              text-align:
                left
                !important;
            }

            /* ===============================================
               NEWSLETTER

               Nueva sección independiente debajo
               de las dos columnas.
            =============================================== */

            .bro-footer-v2
            .newsletter {
              grid-column:
                1 / -1
                !important;

              width:
                100%
                !important;

              margin:
                38px 0
                0
                !important;

              padding:
                32px 0
                0
                !important;

              border-top:
                1px solid
                #252525;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                stretch
                !important;

              gap:
                0
                !important;

              text-align:
                left
                !important;
            }

            .bro-footer-v2
            .newsletter
            h4 {
              margin:
                0 0
                11px
                !important;

              font-size:
                11px
                !important;

              letter-spacing:
                0.11em
                !important;
            }

            .bro-footer-v2
            .newsletter
            > p {
              width:
                100%
                !important;

              max-width:
                none
                !important;

              margin:
                0 0
                24px
                !important;

              color:
                #999999
                !important;

              font-size:
                12px
                !important;

              line-height:
                1.45
                !important;
            }

            /* ===============================================
               CAMPO DE CORREO
            =============================================== */

            .bro-footer-v2
            .newsletter-form {
              width:
                100%
                !important;

              height:
                44px;

              margin:
                0 0
                24px
                !important;

              display:
                flex
                !important;

              align-items:
                center
                !important;

              border-bottom:
                1px solid
                #454545;

              box-sizing:
                border-box;
            }

            .bro-footer-v2
            .newsletter-form
            input {
              flex:
                1;

              width:
                auto
                !important;

              height:
                100%;

              margin:
                0;

              padding:
                0
                !important;

              border:
                0;

              outline:
                0;

              background:
                transparent;

              color:
                #ffffff;

              font-size:
                12.5px
                !important;
            }

            .bro-footer-v2
            .newsletter-form
            input::placeholder {
              color:
                #767676;
            }

            .bro-footer-v2
            .newsletter-form
            button {
              flex:
                0 0
                42px;

              width:
                42px;

              height:
                42px;

              margin:
                0;

              padding:
                0;

              border:
                0;

              background:
                transparent;

              color:
                #ffffff;

              font-size:
                18px;

              cursor:
                pointer;
            }

            /* ===============================================
               PAGOS
            =============================================== */

            .bro-footer-v2
            .bro-footer-payment {
              width:
                100%;

              gap:
                8px;
            }

            .bro-footer-v2
            .bro-footer-payment-label {
              color:
                #777777;

              font-size:
                10px;

              font-weight:
                500;

              letter-spacing:
                0.03em;

              text-transform:
                uppercase;
            }

            .bro-footer-v2
            .bro-footer-payment-methods {
              max-width:
                100%;

              color:
                #ffffff;

              font-size:
                11.5px;

              font-weight:
                700;

              line-height:
                1.6;

              letter-spacing:
                0.025em;
            }

            /* ===============================================
               PARTE FINAL

               Ya no se divide en dos extremos.
            =============================================== */

            .bro-footer-v2
            .footer-bottom {
              width:
                100%
                !important;

              max-width:
                none
                !important;

              margin:
                0
                !important;

              padding:
                24px 0
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                flex-start
                !important;

              justify-content:
                flex-start
                !important;

              gap:
                8px
                !important;

              border-top:
                1px solid
                #2c2c2c
                !important;

              color:
                #686868
                !important;

              font-size:
                10px
                !important;

              line-height:
                1.6;

              letter-spacing:
                0.065em
                !important;

              text-align:
                left
                !important;
            }

            .bro-footer-v2
            .bro-footer-copyright,
            .bro-footer-v2
            .bro-footer-slogan {
              width:
                100%;
            }

            .bro-footer-v2
            .bro-footer-slogan {
              color:
                #777777;
            }
          }
        `}
      </style>

      <div
        className="footer-main"
        style={{
          display: 'grid',

          gridTemplateColumns:
            '1.2fr 1fr 1fr 1.2fr',

          gap: '24px',

          maxWidth: '1200px',

          margin: '0 auto',

          alignItems: 'start',

          justifyContent:
            'start',

          textAlign: 'left',
        }}
      >
        {/* ========================================
            MARCA
        ======================================== */}

        <div
          className="footer-brand"
          style={{
            textAlign: 'left',
          }}
        >
          <div
            className="brand footer-logo"
            style={{
              fontSize: '30px',

              lineHeight: '1',

              marginBottom: '8px',

              textAlign: 'left',
            }}
          >
            BR<span>O</span>
          </div>

          <p
            style={{
              margin: 0,

              fontSize: '12.5px',

              lineHeight: '1.4',

              color: '#aaa',

              textAlign: 'left',
            }}
          >
            Regalos para hombres.
            <br />
            Hecho en Perú.
          </p>

          <div className="bro-footer-socials">
            <button
              type="button"
              className="bro-footer-social-link"
              onClick={
                abrirInstagram
              }
            >
              Instagram
            </button>

            <span>·</span>

            <button
              type="button"
              className="bro-footer-social-link"
              onClick={
                abrirTikTok
              }
            >
              TikTok
            </button>

            <span>·</span>

            <button
              type="button"
              className="bro-footer-social-link whatsapp"
              onClick={
                abrirWhatsApp
              }
            >
              WhatsApp
            </button>
          </div>
        </div>

        {/* ========================================
            COMPRAR
        ======================================== */}

        <div
          className="footer-column"
          style={{
            textAlign: 'left',
          }}
        >
          <h4
            style={{
              margin:
                '0 0 10px',

              fontSize:
                '12px',

              letterSpacing:
                '0.08em',
            }}
          >
            COMPRAR
          </h4>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              onCategoria(
                'cuadro'
              )
            }
          >
            Cuadros
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              onCategoria(
                'case'
              )
            }
          >
            Cases
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              onCategoria(
                'polo'
              )
            }
          >
            Polos
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              onCategoria(
                'wallpaper'
              )
            }
          >
            Wallpapers
          </button>
        </div>

        {/* ========================================
            AYUDA Y LEGAL
        ======================================== */}

        <div
          className="footer-column"
          style={{
            textAlign: 'left',
          }}
        >
          <h4
            style={{
              margin:
                '0 0 10px',

              fontSize:
                '12px',

              letterSpacing:
                '0.08em',
            }}
          >
            AYUDA Y LEGAL
          </h4>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={
              onPreguntas
            }
          >
            Preguntas frecuentes
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={
              onMiPedido
            }
          >
            Mi pedido
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={
              onContacto
            }
          >
            Contacto
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              alert(
                'Sección de Políticas de Privacidad'
              )
            }
          >
            Políticas de Privacidad
          </button>

          <button
            type="button"
            style={{
              fontSize:
                '12.5px',

              padding:
                '3px 0',

              display:
                'block',

              textAlign:
                'left',

              background:
                'transparent',

              border:
                'none',

              color:
                '#888',

              cursor:
                'pointer',
            }}
            onClick={() =>
              alert(
                'Sección de Cambios y Devoluciones'
              )
            }
          >
            Cambios y Devoluciones
          </button>
        </div>

        {/* ========================================
            NEWSLETTER
        ======================================== */}

        <div
          className="newsletter"
          style={{
            textAlign:
              'left',
          }}
        >
          <h4
            style={{
              margin:
                '0 0 10px',

              fontSize:
                '12px',

              letterSpacing:
                '0.08em',
            }}
          >
            ÚNETE A BRO
          </h4>

          <p
            style={{
              margin:
                '0 0 9px',

              fontSize:
                '12.5px',

              lineHeight:
                '1.35',

              color:
                '#aaa',
            }}
          >
            Recibe nuevos diseños
            y promociones exclusivas.
          </p>

          <div
            className="newsletter-form"
            style={{
              marginBottom:
                '9px',

              display:
                'flex',

              alignItems:
                'center',
            }}
          >
            <input
              type="email"
              placeholder="Tu correo"
              style={{
                fontSize:
                  '12.5px',

                width:
                  '100%',
              }}
            />

            <button
              type="button"
              aria-label="Enviar correo"
            >
              →
            </button>
          </div>

          <div className="bro-footer-payment">
            <span className="bro-footer-payment-label">
              Pagos seguros:
            </span>

            <strong className="bro-footer-payment-methods">
              YAPE · PLIN · EFECTIVO · PAGO CONTRAENTREGA
            </strong>
          </div>
        </div>
      </div>

      {/* ========================================
          PARTE INFERIOR
      ======================================== */}

      <div
        className="footer-bottom"
        style={{
          maxWidth:
            '1200px',

          margin:
            '20px auto 0',

          paddingTop:
            '14px',

          fontSize:
            '11.5px',

          display:
            'flex',

          justifyContent:
            'space-between',

          alignItems:
            'center',
        }}
      >
        <span className="bro-footer-copyright">
          © 2026 BRO PERU · Todos los derechos reservados.
        </span>

        <span className="bro-footer-slogan">
          Porque él se lo merece.
        </span>
      </div>
    </footer>
  );
}

export default Footer;