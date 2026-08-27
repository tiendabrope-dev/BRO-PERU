import {
  useMemo,
  useState,
} from 'react';

import ProductCard from '../components/ProductCard';

function TodosCuadros({
  productos,
  onVerProducto,
  onVolver,
}) {
  const [
    orden,
    setOrden,
  ] = useState(
    'destacados'
  );

  const cuadros =
    useMemo(() => {
      return productos.filter(
        (producto) =>
          producto.categoria ===
          'cuadros'
      );
    }, [productos]);

  const cuadrosOrdenados =
    useMemo(() => {
      const lista = [
        ...cuadros,
      ];

      const obtenerPrecio =
        (producto) =>
          Number(
            producto.precioDesde ??
              producto.precio ??
              0
          );

      if (
        orden ===
        'nombre'
      ) {
        return lista.sort(
          (a, b) =>
            String(
              a.nombre || ''
            ).localeCompare(
              String(
                b.nombre || ''
              ),
              'es'
            )
        );
      }

      if (
        orden ===
        'precio-menor'
      ) {
        return lista.sort(
          (a, b) =>
            obtenerPrecio(a) -
            obtenerPrecio(b)
        );
      }

      if (
        orden ===
        'precio-mayor'
      ) {
        return lista.sort(
          (a, b) =>
            obtenerPrecio(b) -
            obtenerPrecio(a)
        );
      }

      return lista;
    }, [
      cuadros,
      orden,
    ]);

  const personalizado =
    useMemo(() => {
      return (
        cuadros.find(
          (producto) =>
            String(
              producto.nombre ||
                ''
            )
              .toLowerCase()
              .includes(
                'personaliz'
              )
        ) ||
        cuadros[0] ||
        null
      );
    }, [cuadros]);

  return (
    <main className="bro-catalogo-cuadros">
      <style>
        {`
          .bro-catalogo-cuadros {
            min-height: 100vh;
            padding: 155px 28px 78px;
            background: #F4F1EC;
          }

          .bro-catalogo-container {
            width: 100%;
            max-width: 1320px;
            margin: 0 auto;
          }

          .bro-catalogo-back {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 34px;
            padding: 0;
            border: 0;
            background: transparent;
            color: #2D5A3D;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.1em;
            cursor: pointer;
            transition: opacity 0.2s ease;
          }

          .bro-catalogo-back:hover {
            opacity: 0.65;
          }

          .bro-catalogo-heading {
            display: flex;
            align-items: flex-end;
            justify-content: space-between;
            gap: 30px;
            margin-bottom: 28px;
          }

          .bro-catalogo-eyebrow {
            margin: 0 0 7px;
            color: #2D5A3D;
            font-family: 'DM Sans', sans-serif;
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 0.15em;
          }

          .bro-catalogo-title {
            margin: 0;
            color: #111111;
            font-family: 'Syne', sans-serif;
            font-size: clamp(34px, 4vw, 54px);
            font-weight: 800;
            line-height: 0.95;
            letter-spacing: -0.045em;
          }

          .bro-catalogo-subtitle {
            max-width: 410px;
            margin: 12px 0 0;
            color: #767676;
            font-family: 'DM Sans', sans-serif;
            font-size: 12.5px;
            line-height: 1.5;
          }

          .bro-catalogo-count {
            margin: 0 0 4px;
            color: #767676;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px;
            font-weight: 600;
            letter-spacing: 0.05em;
          }

          .bro-catalogo-toolbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 38px;
            padding: 15px 0;
            border-top: 1px solid rgba(17,17,17,0.12);
            border-bottom: 1px solid rgba(17,17,17,0.12);
          }

          .bro-catalogo-toolbar-title {
            margin: 0;
            color: #111111;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px;
            font-weight: 700;
            letter-spacing: 0.1em;
          }

          .bro-catalogo-sort {
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .bro-catalogo-sort-label {
            color: #767676;
            font-family: 'DM Sans', sans-serif;
            font-size: 9.5px;
            font-weight: 600;
            letter-spacing: 0.08em;
          }

          .bro-catalogo-sort-select {
            padding: 7px 28px 7px 10px;
            border: 1px solid rgba(17,17,17,0.16);
            border-radius: 0;
            outline: none;
            background: transparent;
            color: #111111;
            font-family: 'DM Sans', sans-serif;
            font-size: 10.5px;
            cursor: pointer;
          }

          .bro-catalogo-grid {
            display: grid;
            grid-template-columns: repeat(4, 190px);
            justify-content: center;
            column-gap: 48px;
            row-gap: 54px;
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
          }

          .bro-catalogo-cuadros .bro-product-card {
            width: 190px !important;
            max-width: 190px !important;
            margin: 0 !important;
            justify-self: center;
            background: transparent !important;
            border: 0 !important;
            box-shadow: none !important;

            /*
              La tarjeta completa NUNCA se mueve.
              Solo se eleva el cuadro.
            */
            transform:
              none !important;

            transition:
              none !important;
          }

          .bro-catalogo-cuadros .bro-product-card:hover {
            transform:
              none !important;

            box-shadow:
              none !important;
          }

          .bro-catalogo-cuadros .bro-product-image-button {
            display: block;
            width: 180px !important;
            max-width: 180px !important;
            margin: 0 auto;
            padding: 0;
            border: 0;
            background: transparent;
            cursor: pointer;
          }

          .bro-catalogo-cuadros .bro-product-image {
            width: 180px !important;
            height: 225px !important;
            aspect-ratio: auto !important;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto;
            background: transparent !important;
            overflow: visible;

            /*
              El contenedor no lleva sombra.
              La sombra se aplica directamente al póster,
              como en la referencia de WallPoster.
            */
            box-shadow:
              none !important;

            transition:
              transform 0.3s ease;
          }

          .bro-catalogo-cuadros .bro-product-image img {
            width: 100% !important;
            height: 100% !important;
            display: block;
            object-fit: contain !important;

            /*
              SOMBRA PREDETERMINADA TIPO WALLPOSTER:
              siempre visible, desplazada hacia abajo
              y a la derecha del cuadro físico.
            */
            filter:
              drop-shadow(
                7px
                9px
                4px
                rgba(17, 17, 17, 0.34)
              );

            transition:
              filter 0.3s ease;
          }

          /*
            Comportamiento tipo WallPoster:
            al pasar por CUALQUIER parte del producto,
            solo el cuadro se eleva.
            El texto, estrellas y precio permanecen quietos.
          */
          .bro-catalogo-cuadros
          .bro-product-card:hover
          .bro-product-image {
            transform:
              translateY(-6px);

            box-shadow:
              none !important;
          }

          .bro-catalogo-cuadros
          .bro-product-image-button:hover
          img,
          .bro-catalogo-cuadros
          .bro-product-card:hover
          .bro-product-image
          img {
            transform:
              none !important;
          }

          .bro-catalogo-cuadros
          .bro-product-card:hover
          .bro-product-info {
            transform:
              none !important;
          }

          /*
            Las burbujas PERSONALIZABLE, MÁS VENDIDO,
            TENDENCIA, ICÓNICO, NUEVO, etc. se mantienen
            en el Home, pero se ocultan SOLO aquí.
          */
          .bro-catalogo-cuadros .sale-badge {
            display: none !important;
          }

          .bro-catalogo-cuadros .bro-product-info {
            width: 180px !important;
            margin: 0 auto !important;
            padding: 9px 0 0 !important;
            background: transparent !important;

            display:
              flex;

            flex-direction:
              column;

            gap:
              0 !important;
          }

          .bro-catalogo-cuadros .bro-product-name-button {
            width: 100%;
            border: 0;
            padding: 0;
            margin: 0;
            background: transparent;
            text-align: left;
            cursor: pointer;
          }

          .bro-catalogo-cuadros .bro-product-name-button h3 {
            margin:
              0 0 3px;

            color:
              #111111;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              11.5px;

            font-weight:
              600;

            line-height:
              1.3;

            text-decoration:
              none;

            text-decoration-thickness:
              1px;

            text-underline-offset:
              2px;
          }

          /*
            Al hacer hover sobre el producto,
            SOLO el título/modelo se subraya.
            No se mueve.
          */
          .bro-catalogo-cuadros
          .bro-product-card:hover
          .bro-product-name-button
          h3,
          .bro-catalogo-cuadros
          .bro-product-name-button:hover
          h3 {
            text-decoration:
              underline;
          }

          /*
            Compactamos la zona de estrellas.
            Incluye variantes de clase para que el
            override funcione aunque ProductCard
            use el nombre global actual.
          */
          .bro-catalogo-cuadros
          .bro-product-info
          .rating,
          .bro-catalogo-cuadros
          .bro-product-info
          .product-rating,
          .bro-catalogo-cuadros
          .bro-product-info
          .bro-product-rating,
          .bro-catalogo-cuadros
          .bro-product-info
          .bro-rating {
            margin:
              0 0 1px !important;

            padding:
              0 !important;
          }

          /*
            Si la fila de estrellas es un hijo directo
            con otra clase, también eliminamos su
            separación vertical sin tocar nombre/precio.
          */
          .bro-catalogo-cuadros
          .bro-product-info
          > :not(.bro-product-name-button):not(.bro-price) {
            margin-top:
              0 !important;

            margin-bottom:
              1px !important;
          }

          .bro-catalogo-cuadros .bro-price {
            margin:
              1px 0 0 !important;

            font-size:
              11.5px;

            font-weight:
              700 !important;

            color:
              #111111;
          }

          .bro-catalogo-cuadros .bro-price * {
            font-weight: 700 !important;
          }

          .bro-catalogo-custom {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 34px;
            width: 100%;
            max-width: 1000px;
            min-height: 150px;
            margin: 72px auto 0;
            padding: 28px 34px;
            background: #2D5A3D;
            color: #ffffff;
            border: 1px solid rgba(255,255,255,0.10);
            box-sizing: border-box;
          }

          .bro-catalogo-custom > div {
            min-width: 0;
            max-width: 620px;
          }

          .bro-catalogo-custom-eyebrow {
            margin: 0 0 8px;
            color: #D4C4A8 !important;
            font-family: 'DM Sans', sans-serif;
            font-size: 8.5px;
            font-weight: 700;
            line-height: 1;
            letter-spacing: 0.16em;
            text-transform: uppercase;
          }

          .bro-catalogo-custom-title {
            margin: 0 !important;
            color: #ffffff !important;
            font-family: 'Syne', sans-serif !important;
            font-size: clamp(22px, 2.2vw, 30px) !important;
            font-weight: 800 !important;
            line-height: 1.02 !important;
            letter-spacing: -0.035em !important;
            text-transform: none !important;
            text-decoration: none !important;
            transform: none !important;
            filter: none !important;
            opacity: 1 !important;
          }

          .bro-catalogo-custom-text {
            max-width: 500px;
            margin: 9px 0 0;
            color: #b9b9b9 !important;
            font-family: 'DM Sans', sans-serif;
            font-size: 11.5px;
            line-height: 1.45;
          }

          .bro-catalogo-custom-button {
            flex: 0 0 auto;
            min-width: 205px;
            height: 44px;
            padding: 0 22px;
            border: 1px solid #ffffff;
            background: #ffffff;
            color: #111111;
            font-family: 'DM Sans', sans-serif;
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: 0.09em;
            cursor: pointer;
            transition:
              background 0.2s ease,
              color 0.2s ease,
              border-color 0.2s ease;
          }

          .bro-catalogo-custom-button:hover {
            background: #111111;
            border-color: #111111;
            color: #ffffff;
          }

          @media (max-width: 1000px) {
            .bro-catalogo-grid {
              grid-template-columns: repeat(3, 185px);
              column-gap: 34px;
              max-width: 650px;
            }

            .bro-catalogo-cuadros .bro-product-card {
              width: 185px !important;
              max-width: 185px !important;
            }

            .bro-catalogo-cuadros .bro-product-image-button,
            .bro-catalogo-cuadros .bro-product-info {
              width: 175px !important;
              max-width: 175px !important;
            }

            .bro-catalogo-cuadros .bro-product-image {
              width: 175px !important;
              height: 219px !important;
            }

            .bro-catalogo-custom {
              max-width: 650px;
            }
          }

          @media (max-width: 760px) {
            .bro-catalogo-cuadros {
              padding: 140px 18px 60px;
            }

            .bro-catalogo-heading {
              align-items: flex-start;
              flex-direction: column;
              gap: 16px;
            }

            .bro-catalogo-title {
              font-size: clamp(34px, 11vw, 46px);
            }

            .bro-catalogo-toolbar {
              align-items: flex-start;
              flex-direction: column;
            }

            .bro-catalogo-sort {
              width: 100%;
              justify-content: space-between;
            }

            .bro-catalogo-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              column-gap: 14px;
              row-gap: 38px;
              max-width: 390px;
            }

            .bro-catalogo-cuadros .bro-product-card {
              width: 100% !important;
              max-width: 170px !important;
            }

            .bro-catalogo-cuadros .bro-product-image-button,
            .bro-catalogo-cuadros .bro-product-info {
              width: 100% !important;
              max-width: 160px !important;
            }

            .bro-catalogo-cuadros .bro-product-image {
              width: 160px !important;
              max-width: 160px !important;
              height: 200px !important;
            }

            .bro-catalogo-custom {
              align-items: flex-start;
              flex-direction: column;
              gap: 22px;
              min-height: 0;
              margin-top: 55px;
              padding: 26px 22px;
            }

            .bro-catalogo-custom-title {
              font-size: 24px !important;
            }
          }

          @media (max-width: 430px) {
            .bro-catalogo-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              max-width: 350px;
            }

            .bro-catalogo-cuadros .bro-product-card {
              max-width: 158px !important;
            }

            .bro-catalogo-cuadros .bro-product-image-button,
            .bro-catalogo-cuadros .bro-product-info {
              max-width: 148px !important;
            }

            .bro-catalogo-cuadros .bro-product-image {
              width: 148px !important;
              max-width: 148px !important;
              height: 185px !important;
            }

            .bro-catalogo-custom-button {
              width: 100%;
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
              CUADROS
            </h1>

            <p className="bro-catalogo-subtitle">
              Diseños automotrices
              para darle personalidad
              a tu espacio.
            </p>
          </div>

          <p className="bro-catalogo-count">
            {cuadros.length}{' '}
            {cuadros.length === 1
              ? 'DISEÑO'
              : 'DISEÑOS'}
          </p>
        </div>

        <div className="bro-catalogo-toolbar">
          <p className="bro-catalogo-toolbar-title">
            TODOS LOS CUADROS
          </p>

          <div className="bro-catalogo-sort">
            <span className="bro-catalogo-sort-label">
              ORDENAR
            </span>

            <select
              className="bro-catalogo-sort-select"
              value={orden}
              onChange={(evento) =>
                setOrden(
                  evento.target.value
                )
              }
            >
              <option value="destacados">
                Destacados
              </option>

              <option value="nombre">
                Nombre A-Z
              </option>

              <option value="precio-menor">
                Precio: menor a mayor
              </option>

              <option value="precio-mayor">
                Precio: mayor a menor
              </option>
            </select>
          </div>
        </div>

        <div className="bro-catalogo-grid">
          {cuadrosOrdenados.map(
            (producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onVerProducto={
                  onVerProducto
                }
              />
            )
          )}
        </div>

        {personalizado && (
          <section className="bro-catalogo-custom">
            <div>
              <p className="bro-catalogo-custom-eyebrow">
                HECHO PARA TI
              </p>

              <h2 className="bro-catalogo-custom-title">
                ¿NO ENCUENTRAS
                TU AUTO?
              </h2>

              <p className="bro-catalogo-custom-text">
                Creamos un cuadro
                personalizado con
                tu propio vehículo.
              </p>
            </div>

            <button
              type="button"
              className="bro-catalogo-custom-button"
              onClick={() =>
                onVerProducto(
                  personalizado
                )
              }
            >
              PERSONALIZA TU CUADRO
            </button>
          </section>
        )}
      </div>
    </main>
  );
}

export default TodosCuadros;
