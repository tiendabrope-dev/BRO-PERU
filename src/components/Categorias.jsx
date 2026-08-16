function Categorias({
  categorias,
  onCategoria,
}) {
  return (
    <section
      className="bro-category-strip"
      id="categorias"
    >
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