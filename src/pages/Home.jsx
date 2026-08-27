import Hero from '../components/Hero';
import Categorias from '../components/Categorias';
import BestSellers from '../components/BestSellers';
import ReviewsClientes from '../components/ReviewsClientes';

function Home({
  categorias,
  productos,
  onCategoria,
  onVerProducto,
  onVerTodosCuadros,
}) {
  return (
    <main>
      <Hero />

      <div className="launch-ticker">
        <div className="launch-ticker-track">
          {Array.from({
            length: 8,
          }).map(
            (_, index) => (
              <div
                className="launch-ticker-group"
                key={index}
              >
                <span className="launch-ticker-text">
                  DESCUENTOS DE APERTURA · PRODUCTOS DESDE S/ 7
                </span>

                <span className="launch-ticker-dot">
                  •
                </span>
              </div>
            )
          )}
        </div>
      </div>

      <Categorias
        categorias={categorias}
        onCategoria={onCategoria}
      />

      <BestSellers
        productos={productos}
        onVerProducto={
          onVerProducto
        }
        onVerTodosCuadros={
          onVerTodosCuadros
        }
      />

      <ReviewsClientes
        productos={productos}
        onVerProducto={
          onVerProducto
        }
      />

      <style>
        {`
          /* ========================================
             BENEFICIOS BRO
             Más compacto para zoom 100%

             Se mantienen las fuentes originales.
          ======================================== */

          .benefits {
            padding:
              24px 42px !important;

            min-height:
              0 !important;

            height:
              auto !important;

            box-sizing:
              border-box;
          }

          .benefits > div {
            min-height:
              92px !important;

            padding:
              10px 18px !important;

            justify-content:
              center !important;

            box-sizing:
              border-box;
          }

          /* ICONOS */

          .benefits svg {
            width:
              19px !important;

            height:
              19px !important;
          }

          .benefits > div > div {
            margin-bottom:
              6px !important;
          }

          /* TÍTULOS
             Misma tipografía */

          .benefits strong {
            margin:
              0 !important;

            font-size:
              11px !important;

            line-height:
              1.15 !important;

            letter-spacing:
              0.07em !important;
          }

          /* DESCRIPCIONES
             Misma tipografía */

          .benefits p {
            margin:
              7px 0 0 !important;

            font-size:
              11px !important;

            line-height:
              1.25 !important;
          }

          /* ========================================
             TABLET
          ======================================== */

          @media (
            max-width: 900px
          ) {
            .benefits {
              padding:
                22px 20px !important;
            }

            .benefits > div {
              min-height:
                88px !important;

              padding:
                10px 12px !important;
            }

            .benefits svg {
              width:
                18px !important;

              height:
                18px !important;
            }

            .benefits strong {
              font-size:
                10.5px !important;
            }

            .benefits p {
              font-size:
                10.5px !important;
            }
          }

          /* ========================================
             CELULAR
          ======================================== */

          @media (
            max-width: 600px
          ) {
            .benefits {
              padding:
                18px 12px !important;
            }

            .benefits > div {
              min-height:
                82px !important;

              padding:
                9px 8px !important;
            }

            .benefits svg {
              width:
                18px !important;

              height:
                18px !important;
            }

            .benefits > div > div {
              margin-bottom:
                5px !important;
            }

            .benefits strong {
              font-size:
                10px !important;
            }

            .benefits p {
              margin-top:
                6px !important;

              font-size:
                10px !important;
            }
          }
        `}
      </style>

      <section className="benefits">
        {/* ENTREGAS RÁPIDAS */}

        <div
          style={{
            display:
              'flex',

            flexDirection:
              'column',

            alignItems:
              'center',

            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '6px',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d5a3d"
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
          </div>

          <strong>
            ENTREGAS RÁPIDAS
          </strong>

          <p>
            Envíos coordinados en Perú.
          </p>
        </div>

        {/* DISEÑOS BRO */}

        <div
          style={{
            display:
              'flex',

            flexDirection:
              'column',

            alignItems:
              'center',

            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '6px',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d5a3d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"
              />
            </svg>
          </div>

          <strong>
            DISEÑOS BRO
          </strong>

          <p>
            Colecciones automotrices.
          </p>
        </div>

        {/* COMPRA SEGURA */}

        <div
          style={{
            display:
              'flex',

            flexDirection:
              'column',

            alignItems:
              'center',

            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '6px',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d5a3d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
            </svg>
          </div>

          <strong>
            COMPRA SEGURA
          </strong>

          <p>
            Compra con tranquilidad.
          </p>
        </div>

        {/* PERSONALIZABLE */}

        <div
          style={{
            display:
              'flex',

            flexDirection:
              'column',

            alignItems:
              'center',

            textAlign:
              'center',
          }}
        >
          <div
            style={{
              marginBottom:
                '6px',

              display:
                'flex',

              alignItems:
                'center',

              justifyContent:
                'center',
            }}
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#2d5a3d"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path
                d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"
              />
            </svg>
          </div>

          <strong>
            PERSONALIZABLE
          </strong>

          <p>
            Creamos diseños con tu auto.
          </p>
        </div>
      </section>
    </main>
  );
}

export default Home;