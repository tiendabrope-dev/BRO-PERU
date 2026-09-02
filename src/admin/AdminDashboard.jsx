import './admin-dashboard.css';

const MODULOS = [
  {
    id: 'pedidos',
    icono: 'PD',
    titulo: 'Pedidos',
    descripcion: 'Gestionar pedidos y estados.',
    estado: 'urgente',
  },
  {
    id: 'precios',
    icono: 'S/',
    titulo: 'Precios',
    descripcion: 'Modificar precios oficiales.',
    estado: 'urgente',
  },
  {
    id: 'productos',
    icono: 'PR',
    titulo: 'Productos',
    descripcion: 'Administrar productos de BRO.',
    estado: 'urgente',
  },
  {
    id: 'resenas',
    icono: '★',
    titulo: 'Reseñas',
    descripcion: 'Administrar opiniones.',
    estado: 'despues',
  },
  {
    id: 'ticker',
    icono: 'TX',
    titulo: 'Promociones',
    descripcion: 'Modificar el roll promocional.',
    estado: 'despues',
  },
  {
    id: 'ajustes',
    icono: '⚙',
    titulo: 'Ajustes',
    descripcion: 'Configuración general.',
    estado: 'despues',
  },
];

function AdminDashboard({
  onAbrirModulo,
}) {
  return (
    <section className="admin-dashboard">
      <div className="admin-dashboard-heading">
        <span>ADMINISTRACIÓN</span>

        <h1>
          Panel de control
        </h1>

        <p>
          Selecciona un módulo para comenzar.
        </p>
      </div>

      <div className="admin-module-grid">
        {MODULOS.map((modulo) => (
          <button
            key={modulo.id}
            type="button"
            className="admin-module-card"
            onClick={() =>
              onAbrirModulo(modulo.id)
            }
          >
            <div
              className={`admin-module-icon admin-module-icon-${modulo.id}`}
            >
              {modulo.icono}
            </div>

            <div className="admin-module-info">
              <strong>
                {modulo.titulo}
              </strong>

              <span>
                {modulo.descripcion}
              </span>
            </div>

            <div
              className={`admin-module-status ${modulo.estado}`}
            >
              {modulo.estado === 'urgente'
                ? 'PRIORIDAD'
                : 'DESPUÉS'}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default AdminDashboard;