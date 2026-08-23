import { useEffect, useState } from 'react';

function Header({
  cartCount,
  onOpenCart,
  onNavigate,
  categorias,
  onCategoriaSelect,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    function handleScroll() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 50) {
        // Arriba del todo: mostrar siempre
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        // Scrolleando hacia abajo: ocultar
        setIsVisible(false);
        setIsDropdownOpen(false);
      } else {
        // Scrolleando hacia arriba en cualquier parte: mostrar al instante
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <header className={`bro-main-header ${isVisible ? 'visible' : 'hidden'}`}>
      <div className="bro-header-top">
        <button
          type="button"
          className="bro-logo"
          onClick={() => onNavigate('home')}
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
            <svg viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <button
            type="button"
            className="bro-icon-button"
            aria-label="Mi cuenta"
          >
            <svg viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>

          <button
            type="button"
            className="bro-cart-new"
            onClick={onOpenCart}
          >
            <svg viewBox="0 0 24 24">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <strong>Carrito</strong>
            <span>{cartCount}</span>
          </button>
        </div>
      </div>

      <nav className="bro-nav-row">
        <button
          type="button"
          className="bro-nav-link"
          onClick={() => onNavigate('home')}
        >
          Inicio
        </button>

        <div className="bro-category-dropdown">
          <button
            type="button"
            className="bro-nav-dropdown-button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Comprar por categoría
            <span className="bro-chevron">▼</span>
          </button>

          {isDropdownOpen && (
            <div className="bro-dropdown-menu">
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onCategoriaSelect(cat.tipo);
                    setIsDropdownOpen(false);
                  }}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          className="bro-nav-link"
          onClick={() => onNavigate('mi-pedido')}
        >
          Mi pedido
        </button>

        <button
          type="button"
          className="bro-nav-link"
          onClick={() => onNavigate('preguntas')}
        >
          Preguntas frecuentes
        </button>

        <button
          type="button"
          className="bro-nav-link"
          onClick={() => onNavigate('contacto')}
        >
          Contacto
        </button>

        <button
          type="button"
          className="bro-nav-link"
          onClick={() => onNavigate('afiliados')}
        >
          Programa de afiliados
        </button>
      </nav>
    </header>
  );
}

export default Header;