import {
  useEffect,
  useRef,
  useState,
} from 'react';

import BuscadorProductos from './BuscadorProductos';

import {
  obtenerPromocionesPublicas,
} from '../lib/promociones';

function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="7.3"
        r="3.4"
      />

      <path d="M5.5 19C6.5 15.7 8.7 14 12 14C15.3 14 17.5 15.7 18.5 19" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M3 4H5.2L7.4 14H18.4L20 7H6.3" />

      <circle
        cx="9"
        cy="18.3"
        r="1.4"
      />

      <circle
        cx="17"
        cy="18.3"
        r="1.4"
      />
    </svg>
  );
}

function MenuIcon({
  abierto,
}) {
  return (
    <span
      className={
        abierto
          ? 'bro-mobile-menu-icon open'
          : 'bro-mobile-menu-icon'
      }
      aria-hidden="true"
    >
      <span />
      <span />
      <span />
    </span>
  );
}

function Header({
  mensajesSuperiores,
  cantidadTotal,
  productos,
  onVerProducto,
  onInicio,
  onCategoria,
  onMiPedido,
  onPreguntas,
  onContacto,
  onAfiliados,
  onAdmin,
  onAbrirCarrito,
}) {
  const [
    mensajesTopbar,
    setMensajesTopbar,
  ] = useState(
    Array.isArray(
      mensajesSuperiores
    )
      ? mensajesSuperiores
      : []
  );

  const [
    mensajeTopbar,
    setMensajeTopbar,
  ] = useState(0);

  const [
    menuCategorias,
    setMenuCategorias,
  ] = useState(false);

  const [
    menuMovil,
    setMenuMovil,
  ] = useState(false);

  const [
    isVisible,
    setIsVisible,
  ] = useState(true);

  const lastScrollY =
    useRef(0);

  useEffect(() => {
    let activo = true;

    async function cargarPromociones() {
      try {
        const datos =
          await obtenerPromocionesPublicas();

        if (!activo) {
          return;
        }

        const textos =
          (datos || [])
            .map(
              (item) =>
                String(
                  item.texto ||
                    ''
                ).trim()
            )
            .filter(
              Boolean
            );

        setMensajesTopbar(
          textos
        );

        setMensajeTopbar(
          0
        );
      } catch (
        errorCarga
      ) {
        console.error(
          'No se pudieron cargar las promociones públicas:',
          errorCarga
        );

        if (!activo) {
          return;
        }

        setMensajesTopbar(
          Array.isArray(
            mensajesSuperiores
          )
            ? mensajesSuperiores
            : []
        );

        setMensajeTopbar(
          0
        );
      }
    }

    cargarPromociones();

    function recargarPromociones() {
      cargarPromociones();
    }

    window.addEventListener(
      'bro-promociones-actualizadas',
      recargarPromociones
    );

    return () => {
      activo = false;

      window.removeEventListener(
        'bro-promociones-actualizadas',
        recargarPromociones
      );
    };
  }, [
    mensajesSuperiores,
  ]);

  useEffect(() => {
    if (
      mensajesTopbar.length <=
      1
    ) {
      return undefined;
    }

    const intervalo =
      window.setInterval(
        () => {
          setMensajeTopbar(
            (actual) =>
              (
                actual +
                1
              ) %
              mensajesTopbar.length
          );
        },
        5000
      );

    return () => {
      window.clearInterval(
        intervalo
      );
    };
  }, [
    mensajesTopbar.length,
  ]);

  useEffect(() => {
    function handleScroll() {
      const actual =
        window.scrollY;

      if (
        actual <=
        40
      ) {
        setIsVisible(
          true
        );
      } else if (
        actual <
        lastScrollY.current
      ) {
        setIsVisible(
          true
        );
      } else if (
        actual >
        lastScrollY.current &&
        actual >
        80
      ) {
        setIsVisible(
          false
        );

        setMenuCategorias(
          false
        );

        setMenuMovil(
          false
        );
      }

      lastScrollY.current =
        actual;
    }

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive:
          true,
      }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll
      );
    };
  }, []);

  function mensajeAnteriorTopbar() {
    if (
      mensajesTopbar.length ===
      0
    ) {
      return;
    }

    setMensajeTopbar(
      (actual) =>
        (
          actual -
          1 +
          mensajesTopbar.length
        ) %
        mensajesTopbar.length
    );
  }

  function mensajeSiguienteTopbar() {
    if (
      mensajesTopbar.length ===
      0
    ) {
      return;
    }

    setMensajeTopbar(
      (actual) =>
        (
          actual +
          1
        ) %
        mensajesTopbar.length
    );
  }

  function abrirCategoria(
    tipoCategoria
  ) {
    setMenuCategorias(
      false
    );

    setMenuMovil(
      false
    );

    onCategoria(
      tipoCategoria
    );
  }

  function navegar(
    accion
  ) {
    setMenuCategorias(
      false
    );

    setMenuMovil(
      false
    );

    accion?.();
  }

  return (
    <div
      style={{
        position:
          'fixed',

        top:
          0,

        left:
          0,

        width:
          '100%',

        zIndex:
          2000,

        transform:
          isVisible
            ? 'translateY(0)'
            : 'translateY(-100%)',

        transition:
          'transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1)',
      }}
    >

      {mensajesTopbar.length >
        0 && (
        <div className="bro-topbar">

          <button
            type="button"
            onClick={
              mensajeAnteriorTopbar
            }
            aria-label="Mensaje anterior"
          >
            ‹
          </button>

          <div className="bro-topbar-message">
            {
              mensajesTopbar[
                mensajeTopbar
              ]
            }
          </div>

          <button
            type="button"
            onClick={
              mensajeSiguienteTopbar
            }
            aria-label="Mensaje siguiente"
          >
            ›
          </button>

        </div>
      )}

      <header className="bro-main-header">

        <div className="bro-header-top">

          <button
            type="button"
            className="bro-mobile-menu-button"
            onClick={() =>
              setMenuMovil(
                (actual) =>
                  !actual
              )
            }
            aria-label={
              menuMovil
                ? 'Cerrar menú'
                : 'Abrir menú'
            }
            aria-expanded={
              menuMovil
            }
          >
            <MenuIcon
              abierto={
                menuMovil
              }
            />
          </button>

          <button
            type="button"
            className="bro-logo"
            onClick={() =>
              navegar(
                onInicio
              )
            }
            aria-label="Ir al inicio"
          >
            BR<span>O</span>
          </button>

          <div className="bro-header-center-space" />

          <div className="bro-header-actions">

            <BuscadorProductos
              productos={
                productos
              }
              onVerProducto={
                onVerProducto
              }
            />

            <button
              type="button"
              className="bro-icon-button bro-user-button"
              onClick={() =>
                onAdmin?.()
              }
              aria-label="Usuario"
            >
              <UserIcon />
            </button>

            <button
              type="button"
              className="bro-cart-new"
              onClick={() => {
                setMenuMovil(
                  false
                );

                onAbrirCarrito();
              }}
              aria-label="Abrir carrito"
            >
              <CartIcon />

              <strong>
                Carrito
              </strong>

              <span>
                {cantidadTotal}
              </span>
            </button>

          </div>

        </div>

        <nav className="bro-nav-row">

          <button
            type="button"
            className="bro-nav-link"
            onClick={
              onInicio
            }
          >
            Inicio
          </button>

          <div className="bro-category-dropdown">

            <button
              type="button"
              className="bro-nav-dropdown-button"
              onClick={() =>
                setMenuCategorias(
                  (actual) =>
                    !actual
                )
              }
            >
              Comprar por categoría

              <span className="bro-chevron">
                ⌄
              </span>
            </button>

            {menuCategorias && (
              <div className="bro-dropdown-menu">

                <button
                  type="button"
                  onClick={() =>
                    abrirCategoria(
                      'cuadro'
                    )
                  }
                >
                  Cuadros
                </button>

                <button
                  type="button"
                  onClick={() =>
                    abrirCategoria(
                      'case'
                    )
                  }
                >
                  Cases
                </button>

                <button
                  type="button"
                  onClick={() =>
                    abrirCategoria(
                      'polo'
                    )
                  }
                >
                  Polos
                </button>

                <button
                  type="button"
                  onClick={() =>
                    abrirCategoria(
                      'wallpaper'
                    )
                  }
                >
                  Wallpapers
                </button>

              </div>
            )}

          </div>

          <button
            type="button"
            className="bro-nav-link"
            onClick={
              onMiPedido
            }
          >
            Mi pedido
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={
              onPreguntas
            }
          >
            Preguntas frecuentes
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={
              onContacto
            }
          >
            Contacto
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={
              onAfiliados
            }
          >
            Programa de afiliados
          </button>

        </nav>

        {menuMovil && (
          <div className="bro-mobile-menu">

            <button
              type="button"
              onClick={() =>
                navegar(
                  onInicio
                )
              }
            >
              INICIO
            </button>

            <div className="bro-mobile-menu-label">
              COMPRAR
            </div>

            <div className="bro-mobile-category-grid">

              <button
                type="button"
                onClick={() =>
                  abrirCategoria(
                    'cuadro'
                  )
                }
              >
                CUADROS
              </button>

              <button
                type="button"
                onClick={() =>
                  abrirCategoria(
                    'case'
                  )
                }
              >
                CASES
              </button>

              <button
                type="button"
                onClick={() =>
                  abrirCategoria(
                    'polo'
                  )
                }
              >
                POLOS
              </button>

              <button
                type="button"
                onClick={() =>
                  abrirCategoria(
                    'wallpaper'
                  )
                }
              >
                WALLPAPERS
              </button>

            </div>

            <button
              type="button"
              onClick={() =>
                navegar(
                  onMiPedido
                )
              }
            >
              MI PEDIDO
            </button>

            <button
              type="button"
              onClick={() =>
                navegar(
                  onPreguntas
                )
              }
            >
              PREGUNTAS FRECUENTES
            </button>

            <button
              type="button"
              onClick={() =>
                navegar(
                  onContacto
                )
              }
            >
              CONTACTO
            </button>

            <button
              type="button"
              onClick={() =>
                navegar(
                  onAfiliados
                )
              }
            >
              PROGRAMA DE AFILIADOS
            </button>

          </div>
        )}

      </header>

    </div>
  );
}

export default Header;