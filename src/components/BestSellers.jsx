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
      ) || 12;

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
          /* ========================================
             SECCIÓN
          ======================================== */

          .bro-best-sellers-v2 {
            padding:
              70px 28px
              82px;

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

          /* ========================================
             ENCABEZADO
          ======================================== */

          .bro-best-top-v2 {
            width:
              100%;

            margin-bottom:
              32px;
          }

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

            transform:
              none !important;
          }

          .bro-best-sellers-v2
          .bro-best-small {
            margin-left:
              0 !important;

            margin-bottom:
              7px !important;

            padding-left:
              0 !important;

            text-align:
              left !important;

            font-size:
              12px !important;

            letter-spacing:
              0.18em !important;
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

            font-size:
              clamp(
                34px,
                3.4vw,
                46px
              ) !important;

            line-height:
              0.95 !important;
          }

          /* ========================================
             ZONA DEL CARRUSEL
          ======================================== */

          .bro-carousel-stage-v2 {
            width:
              100%;

            max-width:
              1140px;

            margin:
              0 auto;

            position:
              relative;
          }

          .bro-carousel-window-v2 {
            display:
              flex;

            gap:
              12px;

            width:
              100%;

            max-width:
              1036px;

            margin:
              0 auto;

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

          /*
            4 PRODUCTOS VISIBLES.

            4 tarjetas +
            3 espacios de 12px.
          */

          .bro-carousel-window-v2
          > .bro-product-card {
            flex:
              0 0
              calc(
                (100% - 36px)
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

          /* ========================================
             FLECHAS AL COSTADO
          ======================================== */

          .bro-carousel-arrow-v2 {
            position:
              absolute;

            top:
              39%;

            transform:
              translateY(-50%);

            z-index:
              5;

            width:
              40px;

            height:
              40px;

            border:
              1px solid
              rgba(
                17,
                17,
                17,
                0.22
              );

            border-radius:
              50%;

            background:
              #f4f1ec;

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
              18px;

            transition:
              background 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease,
              opacity 0.2s ease;
          }

          .bro-carousel-arrow-prev-v2 {
            left:
              0;
          }

          .bro-carousel-arrow-next-v2 {
            right:
              0;
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
              0.22;

            cursor:
              default;
          }

          /* ========================================
             IMAGEN DEL PRODUCTO

             Aumentamos el porcentaje porque
             la columna ahora es más estrecha.

             Así mantenemos prácticamente
             el mismo tamaño visual del cuadro.
          ======================================== */

          .bro-best-sellers-v2
          .bro-product-image-button {
            display:
              block;

            width:
              94%;

            margin:
              0 auto;

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

          /* ========================================
             INFORMACIÓN
          ======================================== */

          .bro-best-sellers-v2
          .bro-product-info {
            width:
              94%;

            margin:
              0 auto;

            padding:
              11px 2px 0 !important;

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
              0 0 6px;

            color:
              #111111;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              12.5px;

            font-weight:
              700;

            line-height:
              1.3;
          }

          .bro-best-sellers-v2
          .bro-price {
            margin-top:
              6px;

            font-size:
              14px;
          }

          /* ========================================
             BOTÓN VER TODOS
          ======================================== */

          .bro-carousel-bottom-v2 {
            display:
              flex;

            justify-content:
              center;

            margin-top:
              38px;
          }

          .bro-view-all-v2 {
            min-width:
              240px;

            height:
              46px;

            padding:
              0 26px;

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
              10.5px;

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

          /* ========================================
             TABLET
          ======================================== */

          @media (
            max-width: 900px
          ) {
            .bro-carousel-stage-v2 {
              max-width:
                100%;
            }

            .bro-carousel-window-v2 {
              width:
                calc(100% - 100px);

              max-width:
                none;

              gap:
                16px;
            }

            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                calc(
                  (100% - 16px)
                  / 2
                );
            }

            .bro-carousel-arrow-prev-v2 {
              left:
                6px;
            }

            .bro-carousel-arrow-next-v2 {
              right:
                6px;
            }

            .bro-best-sellers-v2
            .bro-product-image-button {
              width:
                90%;
            }

            .bro-best-sellers-v2
            .bro-product-info {
              width:
                90%;
            }
          }

          /* ========================================
             CELULAR
          ======================================== */

          @media (
            max-width: 600px
          ) {
            .bro-best-sellers-v2 {
              padding:
                58px 14px
                68px;
            }

            .bro-best-top-v2 {
              margin-bottom:
                24px;
            }

            .bro-best-sellers-v2
            .bro-best-heading h2 {
              font-size:
                32px !important;
            }

            .bro-carousel-stage-v2 {
              max-width:
                100%;
            }

            .bro-carousel-window-v2 {
              width:
                calc(100% - 82px);

              max-width:
                none;

              gap:
                14px;
            }

            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                100%;
            }

            .bro-carousel-arrow-v2 {
              width:
                34px;

              height:
                34px;

              font-size:
                16px;

              top:
                40%;
            }

            .bro-carousel-arrow-prev-v2 {
              left:
                2px;
            }

            .bro-carousel-arrow-next-v2 {
              right:
                2px;
            }

            .bro-best-sellers-v2
            .bro-product-image-button {
              width:
                82%;
            }

            .bro-best-sellers-v2
            .bro-product-info {
              width:
                82%;
            }

            .bro-carousel-bottom-v2 {
              margin-top:
                30px;
            }

            .bro-view-all-v2 {
              width:
                100%;
            }
          }
        `}
      </style>

      <div className="bro-best-container-v2">

        {/* TÍTULO */}
        <div className="bro-best-top-v2">
          <div className="bro-best-heading">
            <p className="bro-best-small">
              LOS MÁS
            </p>

            <h2>
              VENDIDOS
            </h2>
          </div>
        </div>

        {/* CARRUSEL + FLECHAS */}
        <div className="bro-carousel-stage-v2">

          <button
            type="button"
            className="bro-carousel-arrow-v2 bro-carousel-arrow-prev-v2"
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

          <button
            type="button"
            className="bro-carousel-arrow-v2 bro-carousel-arrow-next-v2"
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

        {/* BOTÓN */}
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