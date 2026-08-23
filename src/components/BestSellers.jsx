import ProductCard from './ProductCard';

function BestSellers({
  productos,
  onVerProducto,
}) {
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
        <div className="bro-carousel-content" style={{ display: 'block' }}>
          <div className="bro-carousel-products">
            {productos.map(
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
        </div>

        <div className="bro-carousel-bottom">
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