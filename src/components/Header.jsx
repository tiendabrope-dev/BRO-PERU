import {
  useState,
} from 'react';

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

function Header({
  mensajesSuperiores,
  mensajeSuperior,
  onMensajeAnterior,
  onMensajeSiguiente,
  headerVisible,
  cantidadTotal,
  onInicio,
  onCategoria,
  onMiPedido,
  onPreguntas,
  onContacto,
  onAfiliados,
  onAbrirCarrito,
}) {
  const [
    menuCategorias,
    setMenuCategorias,
  ] = useState(false);

  function abrirCategoria() {
    setMenuCategorias(false);
    onCategoria();
  }

  return (
    <>
      <div className="bro-topbar">
        <button
          type="button"
          onClick={onMensajeAnterior}
          aria-label="Mensaje anterior"
        >
          ‹
        </button>

        <div className="bro-topbar-message">
          {
            mensajesSuperiores[
              mensajeSuperior
            ]
          }
        </div>

        <button
          type="button"
          onClick={onMensajeSiguiente}
          aria-label="Mensaje siguiente"
        >
          ›
        </button>
      </div>

      <header
        className={
          `bro-main-header ${
            headerVisible
              ? 'visible'
              : 'hidden'
          }`
        }
      >
        <div className="bro-header-top">
          <button
            type="button"
            className="bro-logo"
            onClick={onInicio}
            aria-label="Ir al inicio"
          >
            BR<span>O</span>
          </button>

          <div className="bro-header-center-space" />

          <div className="bro-header-actions">
            <button
              type="button"
              className="bro-icon-button"
              aria-label="Buscar"
            >
              <SearchIcon />
            </button>

            <button
              type="button"
              className="bro-icon-button"
              aria-label="Usuario"
            >
              <UserIcon />
            </button>

            <button
              type="button"
              className="bro-cart-new"
              onClick={onAbrirCarrito}
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
            onClick={onInicio}
          >
            Inicio
          </button>

          <div className="bro-category-dropdown">
            <button
              type="button"
              className="bro-nav-dropdown-button"
              onClick={() =>
                setMenuCategorias(
                  (actual) => !actual
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
                  onClick={abrirCategoria}
                >
                  Cuadros
                </button>

                <button
                  type="button"
                  onClick={abrirCategoria}
                >
                  Cases
                </button>

                <button
                  type="button"
                  onClick={abrirCategoria}
                >
                  Polos
                </button>

                <button
                  type="button"
                  onClick={abrirCategoria}
                >
                  Wallpapers
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            className="bro-nav-link"
            onClick={onMiPedido}
          >
            Mi pedido
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={onPreguntas}
          >
            Preguntas frecuentes
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={onContacto}
          >
            Contacto
          </button>

          <button
            type="button"
            className="bro-nav-link"
            onClick={onAfiliados}
          >
            Programa de afiliados
          </button>
        </nav>
      </header>
    </>
  );
}

export default Header;