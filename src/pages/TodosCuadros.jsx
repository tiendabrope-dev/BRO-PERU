import {
  useMemo,
} from 'react';

import ProductCard from '../components/ProductCard';

function TodosCuadros({
  productos,
  onVerProducto,
  onVolver,
}) {
  const cuadros =
    useMemo(() => {
      return productos.filter(
        (producto) =>
          producto.categoria ===
          'cuadros'
      );
    }, [productos]);

  return (
    <main className="bro-catalogo-cuadros">
      <style>
        {`
          .bro-catalogo-cuadros {
            min-height:
              100vh;

            padding:
              220px 28px
              110px;

            background:
              #F4F1EC;
          }

          .bro-catalogo-container {
            width:
              100%;

            max-width:
              1400px;

            margin:
              0 auto;
          }

          .bro-catalogo-back {
            display:
              inline-flex;

            align-items:
              center;

            gap:
              8px;

            margin-bottom:
              40px;

            padding:
              0;

            border:
              0;

            background:
              transparent;

            color:
              #2D5A3D;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              12px;

            font-weight:
              700;

            letter-spacing:
              0.1em;

            cursor:
              pointer;
          }

          .bro-catalogo-heading {
            display:
              flex;

            align-items:
              flex-end;

            justify-content:
              space-between;

            gap:
              30px;

            margin-bottom:
              55px;

            padding-bottom:
              28px;

            border-bottom:
              1px solid
              rgba(17,17,17,0.12);
          }

          .bro-catalogo-eyebrow {
            margin:
              0 0 7px;

            color:
              #2D5A3D;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              11px;

            font-weight:
              700;

            letter-spacing:
              0.14em;
          }

          .bro-catalogo-title {
            margin:
              0;

            color:
              #111111;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              clamp(
                38px,
                6vw,
                74px
              );

            font-weight:
              800;

            line-height:
              0.95;

            letter-spacing:
              -0.04em;
          }

          .bro-catalogo-count {
            margin:
              0;

            color:
              #767676;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              13px;

            font-weight:
              600;
          }

          .bro-catalogo-grid {
            display:
              grid;

            grid-template-columns:
              repeat(
                4,
                minmax(
                  0,
                  1fr
                )
              );

            gap:
              55px 26px;
          }

          .bro-catalogo-cuadros
          .bro-product-card {
            width:
              100% !important;

            max-width:
              none !important;

            margin:
              0 !important;

            background:
              transparent !important;

            border:
              0 !important;

            box-shadow:
              none !important;
          }

          .bro-catalogo-cuadros
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

          .bro-catalogo-cuadros
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

            background:
              transparent !important;

            overflow:
              hidden;
          }

          .bro-catalogo-cuadros
          .bro-product-image img {
            width:
              100%;

            height:
              100%;

            display:
              block;

            object-fit:
              contain;

            transition:
              transform
              0.3s ease;
          }

          .bro-catalogo-cuadros
          .bro-product-image-button:hover
          img {
            transform:
              scale(1.025);
          }

          .bro-catalogo-cuadros
          .bro-product-info {
            padding:
              18px 2px 0 !important;

            background:
              transparent !important;
          }

          .bro-catalogo-cuadros
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

          .bro-catalogo-cuadros
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

          .bro-catalogo-cuadros
          .bro-price {
            margin-top:
              9px;
          }

          @media (
            max-width: 1000px
          ) {
            .bro-catalogo-grid {
              grid-template-columns:
                repeat(
                  3,
                  minmax(
                    0,
                    1fr
                  )
                );
            }
          }

          @media (
            max-width: 760px
          ) {
            .bro-catalogo-cuadros {
              padding:
                190px 18px
                80px;
            }

            .bro-catalogo-heading {
              align-items:
                flex-start;

              flex-direction:
                column;

              margin-bottom:
                38px;
            }

            .bro-catalogo-grid {
              grid-template-columns:
                repeat(
                  2,
                  minmax(
                    0,
                    1fr
                  )
                );

              gap:
                40px 14px;
            }
          }

          @media (
            max-width: 430px
          ) {
            .bro-catalogo-grid {
              grid-template-columns:
                1fr;
            }
          }
        `}
      </style>

      <div className="bro-catalogo-container">
        <button
          type="button"
          className="bro-catalogo-back"
          onClick={
            onVolver
          }
        >
          ← VOLVER AL INICIO
        </button>

        <div className="bro-catalogo-heading">
          <div>
            <p className="bro-catalogo-eyebrow">
              COLECCIÓN BRO
            </p>

            <h1 className="bro-catalogo-title">
              TODOS LOS
              <br />
              CUADROS.
            </h1>
          </div>

          <p className="bro-catalogo-count">
            {cuadros.length}{' '}
            {cuadros.length === 1
              ? 'DISEÑO'
              : 'DISEÑOS'}
          </p>
        </div>

        <div className="bro-catalogo-grid">
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
      </div>
    </main>
  );
}

export default TodosCuadros;