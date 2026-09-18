import './admin-dashboard.css';

export const MODULOS = [
  {
    id: 'pedidos',
    icono: 'PD',
    titulo: 'Pedidos',
    descripcion:
      'Gestionar pedidos y estados.',
    estado: 'urgente',
  },
  {
    id: 'precios',
    icono: 'S/',
    titulo: 'Precios',
    descripcion:
      'Modificar precios oficiales.',
    estado: 'urgente',
  },
  {
    id: 'productos',
    icono: 'PR',
    titulo: 'Productos',
    descripcion:
      'Administrar productos de BRO.',
    estado: 'urgente',
  },
  {
    id: 'resenas',
    icono: '★',
    titulo: 'Reseñas',
    descripcion:
      'Crear, aprobar y administrar opiniones.',
    estado: 'urgente',
  },
  {
    id: 'suscriptores',
    icono: 'EM',
    titulo: 'Suscriptores',
    descripcion:
      'Gestionar correos registrados en BRO.',
    estado: 'urgente',
  },
  {
    id: 'cupones',
    icono: '%',
    titulo: 'Cupones',
    descripcion:
      'Crear y administrar códigos de descuento.',
    estado: 'urgente',
  },
  {
    id: 'ajustes',
    icono: '⚙',
    titulo: 'Ajustes',
    descripcion:
      'Configuración general, promociones, secciones y más.',
    estado: 'completo',
  },
];

function obtenerEtiquetaEstado(
  estado
) {
  if (
    estado ===
    'urgente'
  ) {
    return 'PRIORIDAD';
  }

  if (
    estado ===
    'completo'
  ) {
    return 'LISTO';
  }

  return 'DESPUÉS';
}

function AdminDashboard({
  onAbrirModulo,
}) {
  return (
    <section className="admin-dashboard">

      <div className="admin-dashboard-heading">
        <span>
          ADMINISTRACIÓN
        </span>

        <h1>
          Panel de control
        </h1>

        <p>
          Selecciona un módulo para comenzar.
        </p>
      </div>

      <div className="admin-module-grid">
        {MODULOS.map(
          (modulo) => (
            <button
              key={
                modulo.id
              }
              type="button"
              className="admin-module-card"
              onClick={() =>
                onAbrirModulo(
                  modulo.id
                )
              }
            >
              <div
                className={`admin-module-icon admin-module-icon-${modulo.id}`}
              >
                {
                  modulo.icono
                }
              </div>

              <div className="admin-module-info">
                <strong>
                  {
                    modulo.titulo
                  }
                </strong>

                <span>
                  {
                    modulo.descripcion
                  }
                </span>
              </div>

              <div
                className={`admin-module-status ${modulo.estado}`}
              >
                {obtenerEtiquetaEstado(
                  modulo.estado
                )}
              </div>
            </button>
          )
        )}
      </div>

    </section>
  );
}

export default AdminDashboard;