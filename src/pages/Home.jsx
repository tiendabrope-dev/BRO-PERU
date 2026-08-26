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

      <section className="benefits">
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
                '12px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
            }}
          >
            <svg
              width="28"
              height="28"
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
                '12px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
            }}
          >
            <svg
              width="28"
              height="28"
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
                '12px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
            }}
          >
            <svg
              width="28"
              height="28"
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
                '12px',
              display:
                'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
            }}
          >
            <svg
              width="28"
              height="28"
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