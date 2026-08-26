import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import ProductCard from './ProductCard';

function BestSellers({
  productos,
  onVerProducto,
  onVerTodosCuadros,
}) {
  const carruselRef =
    useRef(null);

  const [
    puedeAnterior,
    setPuedeAnterior,
  ] = useState(false);

  const [
    puedeSiguiente,
    setPuedeSiguiente,
  ] = useState(false);

  const cuadros =
    useMemo(() => {
      return productos
        .filter(
          (producto) =>
            producto.categoria ===
            'cuadros'
        )
        .slice(0, 10);
    }, [productos]);

  function actualizarFlechas() {
    const carrusel =
      carruselRef.current;

    if (!carrusel) {
      return;
    }

    const margen = 4;

    setPuedeAnterior(
      carrusel.scrollLeft >
        margen
    );

    setPuedeSiguiente(
      carrusel.scrollLeft +
        carrusel.clientWidth <
        carrusel.scrollWidth -
          margen
    );
  }

  useEffect(() => {
    const carrusel =
      carruselRef.current;

    if (!carrusel) {
      return;
    }

    const actualizar = () => {
      actualizarFlechas();
    };

    requestAnimationFrame(
      actualizar
    );

    window.addEventListener(
      'resize',
      actualizar
    );

    return () => {
      window.removeEventListener(
        'resize',
        actualizar
      );
    };
  }, [cuadros.length]);

  function moverCarrusel(
    direccion
  ) {
    const carrusel =
      carruselRef.current;

    if (!carrusel) {
      return;
    }

    const primeraTarjeta =
      carrusel.querySelector(
        '.bro-product-card'
      );

    if (!primeraTarjeta) {
      return;
    }

    const estilos =
      window.getComputedStyle(
        carrusel
      );

    const gap =
      parseFloat(
        estilos.columnGap ||
          estilos.gap
      ) || 24;

    const anchoTarjeta =
      primeraTarjeta
        .getBoundingClientRect()
        .width;

    carrusel.scrollBy({
      left:
        direccion *
        (anchoTarjeta + gap),

      behavior:
        'smooth',
    });
  }

  return (
    <section
      className="bro-best-sellers bro-best-sellers-v2"
      id="productos"
    >
      <style>
        {`
          .bro-best-sellers-v2 {
            padding:
              90px 28px
              105px;

            overflow:
              hidden;
          }

          .bro-best-container-v2 {
            width:
              100%;

            max-width:
              1400px;

            margin:
              0 auto;
          }

          .bro-best-top-v2 {
            display:
              flex;

            align-items:
              flex-end;

            justify-content:
              space-between;

            gap:
              30px;

            width:
              100%;

            margin-bottom:
              42px;
          }

          /*
            IMPORTANTE:
            anulamos estilos antiguos
            para que el título empiece
            exactamente a la izquierda.
          */

          .bro-best-sellers-v2
          .bro-best-heading {
            width:
              auto !important;

            max-width:
              none !important;

            margin:
              0 !important;

            margin-left:
              0 !important;

            margin-right:
              0 !important;

            padding:
              0 !important;

            text-align:
              left !important;

            align-self:
              flex-start;

            transform:
              none !important;
          }

          .bro-best-sellers-v2
          .bro-best-small {
            margin-left:
              0 !important;

            padding-left:
              0 !important;

            text-align:
              left !important;
          }

          .bro-best-sellers-v2
          .bro-best-heading h2 {
            margin-left:
              0 !important;

            padding-left:
              0 !important;

            text-align:
              left !important;

            transform:
              none !important;
          }

          /* ========================
             FLECHAS
          ======================== */

          .bro-carousel-arrows-v2 {
            display:
              flex;

            align-items:
              center;

            gap:
              10px;

            margin-left:
              auto;
          }

          .bro-carousel-arrow-v2 {
            width:
              46px;

            height:
              46px;

            border:
              1px solid
              rgba(17,17,17,0.22);

            border-radius:
              50%;

            background:
              transparent;

            color:
              #111111;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            cursor:
              pointer;

            font-size:
              21px;

            transition:
              background 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease,
              opacity 0.2s ease;
          }

          .bro-carousel-arrow-v2:hover:not(:disabled) {
            background:
              #111111;

            color:
              #ffffff;

            border-color:
              #111111;
          }

          .bro-carousel-arrow-v2:disabled {
            opacity:
              0.25;

            cursor:
              default;
          }

          /* ========================
             CARRUSEL
          ======================== */

          .bro-carousel-window-v2 {
            display:
              flex;

            gap:
              24px;

            width:
              100%;

            overflow-x:
              auto;

            overflow-y:
              hidden;

            scroll-behavior:
              smooth;

            scroll-snap-type:
              x mandatory;

            scrollbar-width:
              none;

            -ms-overflow-style:
              none;

            padding-bottom:
              6px;
          }

          .bro-carousel-window-v2::-webkit-scrollbar {
            display:
              none;
          }

          .bro-carousel-window-v2
          > .bro-product-card {
            flex:
              0 0
              calc(
                (100% - 72px)
                / 4
              );

            width:
              auto !important;

            max-width:
              none !important;

            min-width:
              0;

            margin:
              0 !important;

            scroll-snap-align:
              start;

            background:
              transparent !important;

            border:
              none !important;

            box-shadow:
              none !important;
          }

          /* ========================
             TARJETAS
          ======================== */

          .bro-best-sellers-v2
          .bro-product-image-button {
            display:
              block;

            width:
              100%;

            padding:
              0;

            border:
              0;

            background:
              transparent;

            cursor:
              pointer;
          }

          .bro-best-sellers-v2
          .bro-product-image {
            width:
              100%;

            aspect-ratio:
              4 / 5;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            overflow:
              hidden;

            background:
              transparent !important;
          }

          .bro-best-sellers-v2
          .bro-product-image img {
            width:
              100%;

            height:
              100%;

            object-fit:
              contain;

            display:
              block;

            transition:
              transform
              0.3s ease;
          }

          .bro-best-sellers-v2
          .bro-product-image-button:hover
          img {
            transform:
              scale(1.025);
          }

          .bro-best-sellers-v2
          .bro-product-info {
            padding:
              18px 2px 0 !important;

            background:
              transparent !important;
          }

          .bro-best-sellers-v2
          .bro-product-name-button {
            border:
              0;

            padding:
              0;

            margin:
              0;

            background:
              transparent;

            text-align:
              left;

            cursor:
              pointer;
          }

          .bro-best-sellers-v2
          .bro-product-name-button
          h3 {
            margin:
              0 0 9px;

            color:
              #111111;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              14px;

            font-weight:
              700;

            line-height:
              1.35;
          }

          .bro-best-sellers-v2
          .bro-price {
            margin-top:
              9px;
          }

          /* ========================
             BOTÓN ÚNICO
          ======================== */

          .bro-carousel-bottom-v2 {
            display:
              flex;

            justify-content:
              center;

            margin-top:
              52px;
          }

          .bro-view-all-v2 {
            min-width:
              260px;

            height:
              52px;

            padding:
              0 30px;

            border:
              1px solid
              #111111;

            border-radius:
              5px;

            background:
              #111111;

            color:
              #ffffff;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              12px;

            font-weight:
              700;

            letter-spacing:
              0.12em;

            cursor:
              pointer;

            transition:
              background 0.2s ease,
              color 0.2s ease;
          }

          .bro-view-all-v2:hover {
            background:
              #2D5A3D;

            border-color:
              #2D5A3D;
          }

          /* ========================
             TABLET
          ======================== */

          @media (
            max-width: 900px
          ) {
            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                calc(
                  (100% - 22px)
                  / 2
                );
            }
          }

          /* ========================
             CELULAR
          ======================== */

          @media (
            max-width: 600px
          ) {
            .bro-best-sellers-v2 {
              padding:
                70px 18px
                80px;
            }

            .bro-best-top-v2 {
              align-items:
                center;

              margin-bottom:
                30px;
            }

            .bro-carousel-arrow-v2 {
              width:
                42px;

              height:
                42px;
            }

            .bro-carousel-window-v2 {
              gap:
                16px;
            }

            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                100%;
            }

            .bro-carousel-bottom-v2 {
              margin-top:
                38px;
            }

            .bro-view-all-v2 {
              width:
                100%;
            }
          }
        `}
      </style>

      <div className="bro-best-container-v2">
        <div className="bro-best-top-v2">
          <div className="bro-best-heading">
            <p className="bro-best-small">
              LOS MÁS
            </p>

            <h2>
              VENDIDOS
            </h2>
          </div>

          <div className="bro-carousel-arrows-v2">
            <button
              type="button"
              className="bro-carousel-arrow-v2"
              onClick={() =>
                moverCarrusel(-1)
              }
              disabled={
                !puedeAnterior
              }
              aria-label="Ver cuadros anteriores"
            >
              ←
            </button>

            <button
              type="button"
              className="bro-carousel-arrow-v2"
              onClick={() =>
                moverCarrusel(1)
              }
              disabled={
                !puedeSiguiente
              }
              aria-label="Ver siguientes cuadros"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={carruselRef}
          className="bro-carousel-window-v2"
          onScroll={
            actualizarFlechas
          }
        >
          {cuadros.map(
            (producto) => (
              <ProductCard
                key={producto.id}
                producto={
                  producto
                }
                onVerProducto={
                  onVerProducto
                }
              />
            )
          )}
        </div>

        <div className="bro-carousel-bottom-v2">
          <button
            type="button"
            className="bro-view-all-v2"
            onClick={
              onVerTodosCuadros
            }
          >
            VER TODOS LOS CUADROS
          </button>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;