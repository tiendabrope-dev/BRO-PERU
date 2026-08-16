import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import ProductCard from './ProductCard';

function BestSellers({
  productos,
  onVerProducto,
}) {
  const [
    indiceProductos,
    setIndiceProductos,
  ] = useState(0);

  const [
    cantidadVisible,
    setCantidadVisible,
  ] = useState(3);

  useEffect(() => {
    function calcularVisibles() {
      if (
        window.innerWidth <= 650
      ) {
        setCantidadVisible(1);
      } else if (
        window.innerWidth <= 950
      ) {
        setCantidadVisible(2);
      } else {
        setCantidadVisible(3);
      }
    }

    calcularVisibles();

    window.addEventListener(
      'resize',
      calcularVisibles
    );

    return () => {
      window.removeEventListener(
        'resize',
        calcularVisibles
      );
    };
  }, []);

  const productosVisibles =
    useMemo(() => {
      return Array.from({
        length: cantidadVisible,
      }).map((_, offset) => {
        const posicion =
          (
            indiceProductos +
            offset
          ) %
          productos.length;

        return productos[posicion];
      });
    }, [
      indiceProductos,
      cantidadVisible,
      productos,
    ]);

  function productoAnterior() {
    setIndiceProductos(
      (actual) =>
        actual === 0
          ? productos.length - 1
          : actual - 1
    );
  }

  function productoSiguiente() {
    setIndiceProductos(
      (actual) =>
        (
          actual + 1
        ) %
        productos.length
    );
  }

  return (
    <section
      className="bro-best-sellers"
      id="productos"
    >
      <div className="bro-best-heading">
        <p className="bro-best-small">
          LOS MÁS
        </p>

        <h2>
          VENDIDOS
        </h2>
      </div>

      <div className="bro-carousel">
        <div className="bro-carousel-content">
          <button
            type="button"
            className="bro-carousel-arrow"
            onClick={productoAnterior}
            aria-label="Producto anterior"
          >
            ‹
          </button>

          <div className="bro-carousel-products">
            {productosVisibles.map(
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

          <button
            type="button"
            className="bro-carousel-arrow"
            onClick={productoSiguiente}
            aria-label="Producto siguiente"
          >
            ›
          </button>
        </div>

        <div className="bro-carousel-bottom">
          <div className="bro-carousel-counter">
            <button
              type="button"
              className="bro-mini-arrow"
              onClick={productoAnterior}
              aria-label="Producto anterior"
            >
              ‹
            </button>

            <span>
              {indiceProductos + 1}
              {' / '}
              {productos.length}
            </span>

            <button
              type="button"
              className="bro-mini-arrow"
              onClick={productoSiguiente}
              aria-label="Producto siguiente"
            >
              ›
            </button>
          </div>

          <button
            type="button"
            className="bro-view-all"
          >
            VER TODOS LOS CUADROS
          </button>
        </div>
      </div>
    </section>
  );
}

export default BestSellers;