import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import '../styles/buscador-productos.css';

function SearchIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="11"
        cy="11"
        r="6.2"
      />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function BuscadorProductos({
  productos = [],
  onVerProducto,
}) {
  const [abierto, setAbierto] =
    useState(false);

  const [busqueda, setBusqueda] =
    useState('');

  const inputRef =
    useRef(null);

  function normalizar(texto = '') {
    return String(texto)
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .toLowerCase()
      .trim();
  }

  const resultados =
    useMemo(() => {
      const termino =
        normalizar(busqueda);

      if (!termino) {
        return [];
      }

      return productos
        .filter((producto) => {
          const nombre =
            normalizar(
              producto?.nombre ||
                producto?.titulo ||
                ''
            );

          const slug =
            normalizar(
              producto?.slug ||
                ''
            );

          return (
            nombre.includes(
              termino
            ) ||
            slug.includes(
              termino
            )
          );
        })
        .slice(0, 8);
    }, [
      busqueda,
      productos,
    ]);

  useEffect(() => {
    if (!abierto) {
      return undefined;
    }

    const overflowAnterior =
      document.body.style
        .overflow;

    document.body.style.overflow =
      'hidden';

    const timer =
      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 50);

    function manejarTecla(
      event
    ) {
      if (
        event.key ===
        'Escape'
      ) {
        setAbierto(false);
      }
    }

    window.addEventListener(
      'keydown',
      manejarTecla
    );

    return () => {
      window.clearTimeout(
        timer
      );

      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        'keydown',
        manejarTecla
      );
    };
  }, [abierto]);

  function abrirBuscador() {
    setBusqueda('');
    setAbierto(true);
  }

  function cerrarBuscador() {
    setAbierto(false);
    setBusqueda('');
  }

  function seleccionarProducto(
    producto
  ) {
    cerrarBuscador();

    onVerProducto?.(
      producto
    );
  }

  return (
    <>
      <button
        type="button"
        className="bro-icon-button bro-search-button"
        aria-label="Buscar productos"
        onClick={
          abrirBuscador
        }
      >
        <SearchIcon />
      </button>

      {abierto && (
        <div
          className="bro-search-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Buscar productos"
          onMouseDown={
            cerrarBuscador
          }
        >
          <div
            className="bro-search-panel"
            onMouseDown={(
              event
            ) =>
              event.stopPropagation()
            }
          >
            <div className="bro-search-top">
              <div>
                <span className="bro-search-eyebrow">
                  ENCUENTRA SU REGALO
                </span>

                <h2>
                  ¿QUÉ ESTÁS
                  BUSCANDO?
                </h2>
              </div>

              <button
                type="button"
                className="bro-search-close"
                onClick={
                  cerrarBuscador
                }
                aria-label="Cerrar buscador"
              >
                ×
              </button>
            </div>

            <div className="bro-search-input-wrap">
              <SearchIcon />

              <input
                ref={inputRef}
                type="search"
                value={busqueda}
                onChange={(
                  event
                ) =>
                  setBusqueda(
                    event.target
                      .value
                  )
                }
                placeholder="Busca Porsche, BMW, Ferrari..."
                autoComplete="off"
              />
            </div>

            <div className="bro-search-results">
              {!busqueda.trim() && (
                <p className="bro-search-hint">
                  Escribe el nombre
                  del producto que
                  quieres encontrar.
                </p>
              )}

              {busqueda.trim() &&
                resultados.length ===
                  0 && (
                  <div className="bro-search-empty">
                    <strong>
                      No encontramos
                      resultados
                    </strong>

                    <span>
                      Prueba con otro
                      nombre o modelo.
                    </span>
                  </div>
                )}

              {resultados.map(
                (producto) => (
                  <button
                    key={
                      producto.id ||
                      producto.slug
                    }
                    type="button"
                    className="bro-search-result"
                    onClick={() =>
                      seleccionarProducto(
                        producto
                      )
                    }
                  >
                    <span className="bro-search-result-name">
                      {producto.nombre ||
                        producto.titulo}
                    </span>

                    <span className="bro-search-result-arrow">
                      →
                    </span>
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BuscadorProductos;