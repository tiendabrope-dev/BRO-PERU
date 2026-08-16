function RatingStars({
  rating = 0,
  count = 0,
}) {
  const estrellasLlenas = Math.max(
    0,
    Math.min(
      5,
      Math.round(rating)
    )
  );

  return (
    <div
      className="bro-rating"
      aria-label={`${rating} de 5 estrellas, ${count} calificaciones`}
    >
      <div className="bro-rating-stars">
        {Array.from({
          length: 5,
        }).map((_, index) => {
          const llena =
            index < estrellasLlenas;

          return (
            <span
              key={index}
              className={
                llena
                  ? 'bro-star filled'
                  : 'bro-star empty'
              }
            >
              {llena ? '★' : '☆'}
            </span>
          );
        })}
      </div>

      <span className="bro-rating-count">
        ({count})
      </span>
    </div>
  );
}

function ProductCard({
  producto,
  onVerProducto,
}) {
  // Función para determinar la clase exacta según el texto del badge
  const obtenerClaseBadge = (textoBadge) => {
    if (!textoBadge) return '';
    const t = textoBadge.toLowerCase();
    if (t.includes('personalizable')) return 'badge-personalizable';
    if (t.includes('vendido')) return 'badge-vendido';
    if (t.includes('tendencia')) return 'badge-tendencia';
    return '';
  };

  return (
    <article className="product-card bro-product-card">
      <button
        type="button"
        className="bro-product-image-button"
        onClick={() =>
          onVerProducto(producto)
        }
        aria-label={`Ver ${producto.nombre}`}
      >
        <div className="product-image bro-product-image">
          <img
            src={producto.imagen}
            alt={producto.nombre}
            loading="lazy"
          />

          {producto.badge && (
            <span className={`sale-badge bro-product-badge ${obtenerClaseBadge(producto.badge)}`}>
              {producto.badge}
            </span>
          )}
        </div>
      </button>

      <div className="product-info bro-product-info">
        <button
          type="button"
          className="bro-product-name-button"
          onClick={() =>
            onVerProducto(producto)
          }
        >
          <h3>
            {producto.nombre}
          </h3>
        </button>

        <RatingStars
          rating={producto.rating}
          count={producto.ratingCount}
        />

        <div className="price-row bro-price">
          <span>
            Desde S/{' '}
            {producto.precioDesde.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          className="product-add-button bro-view-product-button"
          onClick={() =>
            onVerProducto(producto)
          }
        >
          VER PRODUCTO
        </button>
      </div>
    </article>
  );
}

export default ProductCard;