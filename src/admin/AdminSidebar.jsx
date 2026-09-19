import { MODULOS } from './AdminDashboard';

import './admin-sidebar.css';

const ITEM_DASHBOARD = {
  id: 'dashboard',
  icono: 'DB',
  titulo: 'Dashboard',
};

/*
  Reusa la misma lista MODULOS que ya usaba la rejilla
  de tarjetas (AdminDashboard.jsx) — un solo lugar define
  los módulos disponibles. "Ajustes" se separa para ponerlo
  en su propia sección ("Sistema") en vez de mezclarlo
  con los módulos de tienda.
*/
const MODULOS_TIENDA = MODULOS.filter(
  (modulo) => modulo.id !== 'ajustes'
);

const ITEM_AJUSTES = MODULOS.find(
  (modulo) => modulo.id === 'ajustes'
);

/*
  Sidebar de navegación del admin. Un mismo componente
  sirve tanto para la versión fija de escritorio como
  para el panel deslizante de celular (AdminApp.jsx lo
  renderiza dos veces según el tamaño de pantalla) — la
  diferencia la maneja el CSS, no este componente.

  onNavegar es opcional: AdminApp lo usa solo en la
  versión móvil, para cerrar el panel deslizante después
  de elegir un módulo o cerrar sesión.
*/
function AdminSidebar({
  activo,
  onAbrirModulo,
  onCerrarSesion,
  onNavegar,
  tema,
  onCambiarTema,
}) {
  function ir(idModulo) {
    onAbrirModulo(idModulo);
    onNavegar?.();
  }

  function cerrarSesion() {
    onCerrarSesion();
    onNavegar?.();
  }

  return (
    <aside className="bro-sidebar">
      <button
        type="button"
        className="bro-sidebar-logo"
        onClick={() => ir('dashboard')}
      >
        BR<span>O</span>
      </button>

      <div className="bro-sidebar-etiqueta">Panel</div>

      <nav className="bro-sidebar-nav">
        <button
          type="button"
          className={`bro-sidebar-item${
            activo === ITEM_DASHBOARD.id ? ' activo' : ''
          }`}
          onClick={() => ir(ITEM_DASHBOARD.id)}
        >
          <span className="bro-sidebar-icono">
            {ITEM_DASHBOARD.icono}
          </span>
          {ITEM_DASHBOARD.titulo}
        </button>
      </nav>

      <div className="bro-sidebar-etiqueta">Tienda</div>

      <nav className="bro-sidebar-nav">
        {MODULOS_TIENDA.map((modulo) => (
          <button
            key={modulo.id}
            type="button"
            className={`bro-sidebar-item${
              activo === modulo.id ? ' activo' : ''
            }`}
            onClick={() => ir(modulo.id)}
          >
            <span
              className={`bro-sidebar-icono admin-module-icon-${modulo.id}`}
            >
              {modulo.icono}
            </span>
            {modulo.titulo}
          </button>
        ))}
      </nav>

      {ITEM_AJUSTES && (
        <>
          <div className="bro-sidebar-etiqueta">Sistema</div>

          <nav className="bro-sidebar-nav">
            <button
              type="button"
              className={`bro-sidebar-item${
                activo === ITEM_AJUSTES.id ? ' activo' : ''
              }`}
              onClick={() => ir(ITEM_AJUSTES.id)}
            >
              <span className="bro-sidebar-icono admin-module-icon-ajustes">
                {ITEM_AJUSTES.icono}
              </span>
              {ITEM_AJUSTES.titulo}
            </button>
          </nav>
        </>
      )}

      <div className="bro-sidebar-footer">
        {onCambiarTema && (
          <button
            type="button"
            className="bro-sidebar-tema"
            onClick={onCambiarTema}
          >
            {tema === 'oscuro' ? (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4.5"
                  fill="currentColor"
                />

                <g stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <line x1="12" y1="1.5" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22.5" />
                  <line x1="1.5" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22.5" y2="12" />
                  <line x1="4.6" y1="4.6" x2="6.3" y2="6.3" />
                  <line x1="17.7" y1="17.7" x2="19.4" y2="19.4" />
                  <line x1="4.6" y1="19.4" x2="6.3" y2="17.7" />
                  <line x1="17.7" y1="6.3" x2="19.4" y2="4.6" />
                </g>
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <path
                  d="M20.5 14.7A8.5 8.5 0 1 1 9.3 3.5a7 7 0 0 0 11.2 11.2Z"
                  fill="currentColor"
                />
              </svg>
            )}
            {tema === 'oscuro' ? 'MODO CLARO' : 'MODO OSCURO'}
          </button>
        )}

        <button
          type="button"
          className="bro-sidebar-salir"
          onClick={cerrarSesion}
        >
          CERRAR SESIÓN
        </button>

        <span>Powered by Bro Engineering</span>
      </div>
    </aside>
  );
}

export default AdminSidebar;
