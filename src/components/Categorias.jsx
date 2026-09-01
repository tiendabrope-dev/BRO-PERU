function Categorias({
  categorias,
  onCategoria,
}) {
  return (
    <section
      className="bro-category-strip"
      id="categorias"
    >
      <style>
        {`
          /* ========================================
             CATEGORÍAS BRO
          ======================================== */

          .bro-category-strip
          .bro-category-circle {
            position:
              relative;

            transform:
              scale(0.70);

            transform-origin:
              center center;

            border:
              1px solid
              #9d9d9d;

            border-radius:
              50%;

            background:
              #ffffff;

            padding:
              5px;

            box-sizing:
              border-box;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            overflow:
              hidden;

            transition:
              transform
                0.25s
                ease,
              border-color
                0.25s
                ease;
          }

          /* Aro interior */

          .bro-category-strip
          .bro-category-circle::after {
            content:
              '';

            position:
              absolute;

            inset:
              4px;

            border:
              1px solid
              rgba(
                17,
                17,
                17,
                0.14
              );

            border-radius:
              50%;

            pointer-events:
              none;
          }

          /* ========================================
             IMÁGENES
          ======================================== */

          .bro-category-strip
          .bro-category-circle img {
            display:
              block;

            width:
              82%
              !important;

            height:
              82%
              !important;

            max-width:
              82%
              !important;

            max-height:
              82%
              !important;

            object-fit:
              contain
              !important;

            object-position:
              center center;

            margin:
              auto;

            border-radius:
              0;

            position:
              relative;

            z-index:
              1;
          }

          /* ========================================
             TEXTO
          ======================================== */

          .bro-category-strip
          .bro-category-name {
            display:
              block;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              12.5px;

            font-weight:
              600;

            line-height:
              1;

            letter-spacing:
              0;

            color:
              #111111;

            margin-top:
              -25px;
          }

          /* ========================================
             HOVER DESKTOP
          ======================================== */

          @media (
            hover: hover
          ) and (
            pointer: fine
          ) {
            .bro-category-strip
            .bro-category-item:hover
            .bro-category-circle {
              transform:
                scale(
                  0.73
                );

              border-color:
                #111111;
            }
          }

          /* ========================================
             MÓVIL
          ======================================== */

          @media (
            max-width: 600px
          ) {

            /* ===============================
               FRANJA GENERAL
            =============================== */

            .bro-category-strip {
              width:
                100%
                !important;

              padding:
                28px 8px
                30px
                !important;

              box-sizing:
                border-box
                !important;

              overflow:
                hidden
                !important;
            }

            /* ===============================
               LOS 4 ELEMENTOS

               Una sola línea.
               Más juntos.
               Todo centrado.
            =============================== */

            .bro-category-strip
            .bro-category-list {
              width:
                100%
                !important;

              max-width:
                350px
                !important;

              margin:
                0 auto
                !important;

              padding:
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                row
                !important;

              flex-wrap:
                nowrap
                !important;

              align-items:
                flex-start
                !important;

              justify-content:
                center
                !important;

              gap:
                0
                !important;
            }

            /* ===============================
               CADA CATEGORÍA

               Usamos cuatro espacios iguales.
               Así el conjunto queda simétrico.
            =============================== */

            .bro-category-strip
            .bro-category-item {
              width:
                25%
                !important;

              max-width:
                86px
                !important;

              min-width:
                0
                !important;

              flex:
                0 1 86px
                !important;

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
                center
                !important;

              justify-content:
                flex-start
                !important;

              background:
                transparent
                !important;

              border:
                0
                !important;
            }

            /* ===============================
               CÍRCULOS

               Más grandes que antes,
               pero ya no usamos scale().
            =============================== */

            .bro-category-strip
            .bro-category-circle {
              width:
                clamp(
                  68px,
                  21vw,
                  78px
                )
                !important;

              height:
                clamp(
                  68px,
                  21vw,
                  78px
                )
                !important;

              min-width:
                0
                !important;

              min-height:
                0
                !important;

              margin:
                0 auto
                !important;

              padding:
                5px
                !important;

              transform:
                none
                !important;

              flex:
                0 0 auto
                !important;
            }

            /* ARO INTERIOR */

            .bro-category-strip
            .bro-category-circle::after {
              inset:
                4px;
            }

            /* ===============================
               IMAGEN INTERIOR
            =============================== */

            .bro-category-strip
            .bro-category-circle img {
              width:
                82%
                !important;

              height:
                82%
                !important;

              max-width:
                82%
                !important;

              max-height:
                82%
                !important;

              object-fit:
                contain
                !important;

              object-position:
                center center
                !important;

              margin:
                auto
                !important;
            }

            /* ===============================
               NOMBRE
            =============================== */

            .bro-category-strip
            .bro-category-name {
              width:
                100%
                !important;

              margin:
                8px 0 0
                !important;

              padding:
                0
                !important;

              color:
                #111111
                !important;

              font-family:
                'DM Sans',
                sans-serif
                !important;

              font-size:
                10.5px
                !important;

              font-weight:
                600
                !important;

              line-height:
                1.1
                !important;

              letter-spacing:
                0
                !important;

              text-align:
                center
                !important;

              white-space:
                nowrap
                !important;
            }

            /* ===============================
               SIN EFECTO HOVER EN MÓVIL
            =============================== */

            .bro-category-strip
            .bro-category-item:hover
            .bro-category-circle {
              transform:
                none
                !important;
            }
          }
        `}
      </style>

      <div className="bro-category-list">
        {categorias.map(
          (categoria) => (
            <button
              type="button"
              className={`bro-category-item ${categoria.tipo}`}
              key={categoria.id}
              onClick={() =>
                onCategoria(
                  categoria.tipo
                )
              }
            >
              <div className="bro-category-circle">
                <img
                  src={
                    categoria.imagen
                  }
                  alt={
                    categoria.nombre
                  }
                />
              </div>

              <span className="bro-category-name">
                {
                  categoria.nombre
                }
              </span>
            </button>
          )
        )}
      </div>
    </section>
  );
}

export default Categorias;