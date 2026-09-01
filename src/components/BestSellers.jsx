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

    function reiniciarCarrusel() {
      carrusel.scrollTo({
        left: 0,
        behavior: 'auto',
      });

      actualizarFlechas();
    }

    requestAnimationFrame(
      reiniciarCarrusel
    );

    window.addEventListener(
      'resize',
      reiniciarCarrusel
    );

    return () => {
      window.removeEventListener(
        'resize',
        reiniciarCarrusel
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
      ) || 14;

    const anchoTarjeta =
      primeraTarjeta
        .getBoundingClientRect()
        .width;

    carrusel.scrollBy({
      left:
        direccion *
        (
          anchoTarjeta +
          gap
        ),

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
          /* ==========================================
             MÁS VENDIDOS
             DESKTOP
          ========================================== */

          .bro-best-sellers-v2 {
            padding:
              70px 28px
              82px;

            overflow:
              hidden;
          }

          .bro-best-sellers-v2
          .bro-best-container-v2 {
            width:
              100%;

            max-width:
              1400px;

            margin:
              0 auto;
          }

          /* ==========================================
             ENCABEZADO
          ========================================== */

          .bro-best-sellers-v2
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

            padding:
              0 !important;

            text-align:
              left !important;

            transform:
              none !important;
          }

          .bro-best-sellers-v2
          .bro-best-small {
            margin:
              0 0 7px
              !important;

            padding:
              0 !important;

            color:
              #111111;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              12px !important;

            font-weight:
              700;

            line-height:
              1;

            letter-spacing:
              0.18em !important;

            text-align:
              left !important;
          }

          .bro-best-sellers-v2
          .bro-best-heading h2 {
            margin:
              0 !important;

            padding:
              0 !important;

            color:
              #111111;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              clamp(
                34px,
                3.4vw,
                46px
              )
              !important;

            font-weight:
              800;

            line-height:
              0.95
              !important;

            letter-spacing:
              -0.045em;

            text-align:
              left !important;

            transform:
              none !important;
          }

          /* ==========================================
             ESCENARIO DEL CARRUSEL
          ========================================== */

          .bro-best-sellers-v2
          .bro-carousel-stage-v2 {
            position:
              relative;

            width:
              100%;

            max-width:
              1140px;

            margin:
              0 auto;
          }

          /* ==========================================
             CARRUSEL DESKTOP
          ========================================== */

          .bro-best-sellers-v2
          .bro-carousel-window-v2 {
            display:
              flex;

            width:
              100%;

            max-width:
              1036px;

            margin:
              0 auto;

            padding:
              0 0 6px;

            box-sizing:
              border-box;

            gap:
              12px;

            overflow-x:
              auto;

            overflow-y:
              hidden;

            scroll-behavior:
              smooth;

            scroll-snap-type:
              x mandatory;

            scroll-padding-left:
              0;

            scrollbar-width:
              none;

            -ms-overflow-style:
              none;
          }

          .bro-best-sellers-v2
          .bro-carousel-window-v2::-webkit-scrollbar {
            display:
              none;
          }

          .bro-best-sellers-v2
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

            padding:
              0 !important;

            scroll-snap-align:
              start;

            background:
              transparent !important;

            border:
              0 !important;

            box-shadow:
              none !important;
          }

          /* ==========================================
             IMAGEN DESKTOP
          ========================================== */

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
              transparent
              !important;
          }

          .bro-best-sellers-v2
          .bro-product-image img {
            display:
              block;

            width:
              100%;

            height:
              100%;

            object-fit:
              contain;

            transition:
              transform
              0.3s ease;
          }

          @media (
            hover: hover
          ) {
            .bro-best-sellers-v2
            .bro-product-image-button:hover
            img {
              transform:
                scale(
                  1.025
                );
            }
          }

          /* ==========================================
             INFORMACIÓN PRODUCTO
          ========================================== */

          .bro-best-sellers-v2
          .bro-product-info {
            width:
              94%;

            margin:
              0 auto;

            padding:
              11px 2px 0
              !important;

            box-sizing:
              border-box;

            background:
              transparent
              !important;
          }

          .bro-best-sellers-v2
          .bro-product-name-button {
            margin:
              0;

            padding:
              0;

            border:
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

          /* ==========================================
             FLECHAS DESKTOP
          ========================================== */

          .bro-best-sellers-v2
          .bro-carousel-arrow-v2 {
            position:
              absolute;

            top:
              39%;

            z-index:
              5;

            width:
              40px;

            height:
              40px;

            padding:
              0;

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

            font-size:
              18px;

            cursor:
              pointer;

            transform:
              translateY(
                -50%
              );

            transition:
              background
                0.2s ease,
              color
                0.2s ease,
              opacity
                0.2s ease;
          }

          .bro-best-sellers-v2
          .bro-carousel-arrow-prev-v2 {
            left:
              0;
          }

          .bro-best-sellers-v2
          .bro-carousel-arrow-next-v2 {
            right:
              0;
          }

          .bro-best-sellers-v2
          .bro-carousel-arrow-v2:hover:not(:disabled) {
            background:
              #111111;

            color:
              #ffffff;
          }

          .bro-best-sellers-v2
          .bro-carousel-arrow-v2:disabled {
            opacity:
              0.2;

            cursor:
              default;
          }

          /* ==========================================
             BOTÓN VER TODOS
          ========================================== */

          .bro-best-sellers-v2
          .bro-carousel-bottom-v2 {
            display:
              flex;

            justify-content:
              center;

            margin-top:
              38px;
          }

          .bro-best-sellers-v2
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
          }

          .bro-best-sellers-v2
          .bro-view-all-v2:hover {
            background:
              #2D5A3D;

            border-color:
              #2D5A3D;
          }

          /* ==========================================
             TABLET
          ========================================== */

          @media (
            max-width:
              900px
          ) and (
            min-width:
              601px
          ) {

            .bro-best-sellers-v2
            .bro-carousel-stage-v2 {
              max-width:
                100%;
            }

            .bro-best-sellers-v2
            .bro-carousel-window-v2 {
              width:
                calc(
                  100% - 100px
                )
                !important;

              max-width:
                none;

              gap:
                16px;
            }

            .bro-best-sellers-v2
            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                calc(
                  (100% - 16px)
                  / 2
                )
                !important;
            }

            .bro-best-sellers-v2
            .bro-product-image-button,
            .bro-best-sellers-v2
            .bro-product-info {
              width:
                90%;
            }
          }

          /* ==========================================
             CELULAR
          ========================================== */

          @media (
            max-width:
              600px
          ) {

            /*
              Margen general:
              18px desde el borde.
            */

            .bro-best-sellers-v2 {
              padding:
                52px 18px
                62px
                !important;
            }

            .bro-best-sellers-v2
            .bro-best-top-v2 {
              margin-bottom:
                25px
                !important;
            }

            .bro-best-sellers-v2
            .bro-best-small {
              font-size:
                11px
                !important;
            }

            .bro-best-sellers-v2
            .bro-best-heading h2 {
              font-size:
                36px
                !important;

              line-height:
                0.95
                !important;

              letter-spacing:
                -0.045em
                !important;
            }

            /* ======================================
               STAGE

               100% del espacio interior.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-stage-v2 {
              position:
                relative;

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
                0
                !important;
            }

            /* ======================================
               TRACK

               ESTE ES EL CAMBIO PRINCIPAL.

               Empieza exactamente en x = 0
               dentro de la sección.

               Se extiende 18px a la derecha para
               producir el efecto de carrusel
               abierto.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-window-v2 {
              position:
                relative;

              left:
                0
                !important;

              width:
                calc(
                  100% + 18px
                )
                !important;

              max-width:
                none
                !important;

              margin:
                0 -18px
                0 0
                !important;

              padding:
                0 18px
                6px 0
                !important;

              box-sizing:
                border-box
                !important;

              display:
                flex
                !important;

              justify-content:
                flex-start
                !important;

              gap:
                14px
                !important;

              overflow-x:
                auto
                !important;

              overflow-y:
                hidden
                !important;

              scroll-behavior:
                smooth;

              scroll-snap-type:
                x mandatory;

              scroll-padding-left:
                0
                !important;

              scrollbar-width:
                none;
            }

            /* ======================================
               TARJETAS

               No usamos 68% porque App.css
               estaba forzándolo.

               Usamos un ancho real controlado.
               En 360px ≈ 166px.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-window-v2
            > .bro-product-card {
              flex:
                0 0
                clamp(
                  160px,
                  46vw,
                  175px
                )
                !important;

              width:
                clamp(
                  160px,
                  46vw,
                  175px
                )
                !important;

              max-width:
                none
                !important;

              min-width:
                0
                !important;

              margin:
                0
                !important;

              padding:
                0
                !important;

              scroll-snap-align:
                start;

              scroll-snap-stop:
                always;
            }

            /* ======================================
               IMAGEN

               Conservamos el tamaño compacto,
               PERO YA NO SE CENTRA DENTRO
               DE LA TARJETA.

               Su borde izquierdo coincide
               con el inicio del carrusel.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-window-v2
            .bro-product-card
            .bro-product-image-button {
              width:
                82%
                !important;

              max-width:
                none
                !important;

              margin:
                0 auto 0 0
                !important;

              padding:
                0
                !important;
            }

            /* ======================================
               INFORMACIÓN

               Exactamente alineada con
               el cuadro.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-window-v2
            .bro-product-card
            .bro-product-info {
              width:
                82%
                !important;

              max-width:
                none
                !important;

              margin:
                0 auto 0 0
                !important;

              padding:
                12px 0 0
                !important;

              box-sizing:
                border-box
                !important;
            }

            .bro-best-sellers-v2
            .bro-product-name-button
            h3 {
              min-height:
                0
                !important;

              font-size:
                13px
                !important;
            }

            .bro-best-sellers-v2
            .bro-price {
              font-size:
                15px
                !important;
            }

            /* ======================================
               FLECHAS

               Dejamos únicamente la flecha
               disponible.

               La izquierda desaparece cuando
               estamos al inicio.
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-arrow-v2 {
              width:
                34px
                !important;

              height:
                34px
                !important;

              font-size:
                16px
                !important;

              top:
                40%;
            }

            .bro-best-sellers-v2
            .bro-carousel-arrow-prev-v2 {
              left:
                0
                !important;
            }

            .bro-best-sellers-v2
            .bro-carousel-arrow-next-v2 {
              right:
                0
                !important;
            }

            .bro-best-sellers-v2
            .bro-carousel-arrow-v2:disabled {
              opacity:
                0
                !important;

              pointer-events:
                none
                !important;
            }

            /* ======================================
               BOTÓN
            ====================================== */

            .bro-best-sellers-v2
            .bro-carousel-bottom-v2 {
              margin-top:
                32px
                !important;
            }

            .bro-best-sellers-v2
            .bro-view-all-v2 {
              width:
                min(
                  250px,
                  100%
                )
                !important;

              min-width:
                0
                !important;

              height:
                48px
                !important;

              border-radius:
                24px
                !important;
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

        {/* CARRUSEL */}
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
            ref={
              carruselRef
            }
            className="bro-carousel-window-v2"
            onScroll={
              actualizarFlechas
            }
          >
            {cuadros.map(
              (producto) => (
                <ProductCard
                  key={
                    producto.id
                  }
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

        {/* VER TODOS */}
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