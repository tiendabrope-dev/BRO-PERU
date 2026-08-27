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
            position: relative;

            transform: scale(0.70);
            transform-origin: center center;

            border: 1px solid #9d9d9d;
            border-radius: 50%;

            background: #ffffff;

            padding: 5px;

            box-sizing: border-box;

            display: flex;
            align-items: center;
            justify-content: center;

            overflow: hidden;

            transition:
              transform 0.25s ease,
              border-color 0.25s ease;
          }

          /* Aro interior */
          .bro-category-strip
          .bro-category-circle::after {
            content: '';

            position: absolute;

            inset: 4px;

            border: 1px solid rgba(
              17,
              17,
              17,
              0.14
            );

            border-radius: 50%;

            pointer-events: none;
          }

          /* ========================================
             IMÁGENES
             
             Las reducimos dentro del círculo
             para que ninguna quede cortada.
          ======================================== */

          .bro-category-strip
          .bro-category-circle img {
            display: block;

            width: 82% !important;
            height: 82% !important;

            max-width: 82% !important;
            max-height: 82% !important;

            object-fit: contain !important;
            object-position: center center;

            margin: auto;

            border-radius: 0;

            position: relative;
            z-index: 1;
          }

          /* ========================================
             TEXTO
          ======================================== */

          .bro-category-strip
          .bro-category-name {
            display: block;

            font-family:
              'DM Sans',
              sans-serif;

            font-size: 12.5px;

            font-weight: 600;

            line-height: 1;

            letter-spacing: 0;

            color: #111111;

            margin-top: -25px;
          }

          /* ========================================
             HOVER
          ======================================== */

          @media (hover: hover) and (pointer: fine) {
            .bro-category-strip
            .bro-category-item:hover
            .bro-category-circle {
              transform: scale(0.73);
              border-color: #111111;
            }
          }

          /* ========================================
             MÓVIL
          ======================================== */

          @media (max-width: 600px) {
            .bro-category-strip
            .bro-category-circle {
              transform: scale(0.76);
            }

            .bro-category-strip
            .bro-category-circle img {
              width: 80% !important;
              height: 80% !important;

              max-width: 80% !important;
              max-height: 80% !important;
            }

            .bro-category-strip
            .bro-category-name {
              font-size: 11px;
              margin-top: -18px;
            }

            .bro-category-strip
            .bro-category-item:hover
            .bro-category-circle {
              transform: scale(0.76);
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
                  src={categoria.imagen}
                  alt={categoria.nombre}
                />
              </div>

              <span className="bro-category-name">
                {categoria.nombre}
              </span>
            </button>
          )
        )}
      </div>
    </section>
  );
}

export default Categorias;