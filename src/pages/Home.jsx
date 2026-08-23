import Hero from '../components/Hero';
import Categorias from '../components/Categorias';
import BestSellers from '../components/BestSellers';

import heroCuadro from '../assets/hero/hero-cuadro.jpg';

function Home({
  categorias,
  productos,
  onCategoria,
  onVerProducto,
}) {
  function abrirPersonalizado() {
    const productoPersonalizado =
      productos.find(
        (producto) =>
          producto.slug ===
          'cuadro-personalizado'
      );

    if (
      productoPersonalizado &&
      onVerProducto
    ) {
      onVerProducto(
        productoPersonalizado
      );
    }
  }

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
      />

      <section
        className="custom-section"
        id="personalizados"
      >
        <div className="custom-image">
          <img
            src={heroCuadro}
            alt="Cuadro personalizado"
          />
        </div>

        <div className="custom-copy">
          <p className="eyebrow dark">
            HECHO PARA TI
          </p>

          <h2>
            TU AUTO.
            <br />
            TU CUADRO.
          </h2>

          <p className="custom-description">
            Envíanos fotos de tu auto
            y creamos un diseño
            personalizado para ti.
          </p>

          <div className="steps">
            <div>
              <span>
                01
              </span>

              <p>
                Envíanos tus fotos
              </p>
            </div>

            <div>
              <span>
                02
              </span>

              <p>
                Creamos el diseño
              </p>
            </div>

            <div>
              <span>
                03
              </span>

              <p>
                Recibe tu cuadro
              </p>
            </div>
          </div>

          <button
            type="button"
            className="button button-green"
            onClick={
              abrirPersonalizado
            }
          >
            PERSONALIZAR MI AUTO
          </button>
        </div>
      </section>

      <section className="benefits">
        {/* 1. ENTREGAS RÁPIDAS (Camión) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
          <strong>
            ENTREGAS RÁPIDAS
          </strong>
          <p>
            Envíos coordinados en Perú.
          </p>
        </div>

        {/* 2. DISEÑOS BRO (Polo) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H5v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V10h1.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
            </svg>
          </div>
          <strong>
            DISEÑOS BRO
          </strong>
          <p>
            Colecciones automotrices.
          </p>
        </div>

        {/* 3. COMPRA SEGURA (Escudo) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <strong>
            COMPRA SEGURA
          </strong>
          <p>
            Compra con tranquilidad.
          </p>
        </div>

        {/* 4. PERSONALIZABLE (Lápiz / Diseño Recto) */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
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