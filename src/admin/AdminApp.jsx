import {
  useEffect,
  useState,
} from 'react';

import {
  cerrarSesionAdmin,
  obtenerUsuarioActual,
  verificarAdmin,
} from '../lib/admin';

import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';
import AdminPrecios from './AdminPrecios';
import AdminPedidos from './AdminPedidos';
import AdminPedidoDetalle from './AdminPedidoDetalle';
import AdminProductos from './AdminProductos';

import './admin.css';
import './admin-pedido-detalle.css';

function AdminApp() {
  const [usuario, setUsuario] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [modulo, setModulo] =
    useState('dashboard');

  const [
    pedidoSeleccionado,
    setPedidoSeleccionado,
  ] = useState(null);

  useEffect(() => {
    async function revisarAcceso() {
      try {
        const actual =
          await obtenerUsuarioActual();

        if (!actual) {
          return;
        }

        const esAdmin =
          await verificarAdmin(
            actual.id
          );

        if (!esAdmin) {
          await cerrarSesionAdmin();
          return;
        }

        setUsuario(actual);
      } finally {
        setCargando(false);
      }
    }

    revisarAcceso();
  }, []);

  async function salir() {
    await cerrarSesionAdmin();

    setUsuario(null);
    setModulo('dashboard');
    setPedidoSeleccionado(null);
  }

  function volverDashboard() {
    setModulo('dashboard');
    setPedidoSeleccionado(null);
  }

  function abrirModulo(
    nombreModulo
  ) {
    setPedidoSeleccionado(null);
    setModulo(nombreModulo);
  }

  function renderModulo() {
    if (modulo === 'precios') {
      return <AdminPrecios />;
    }

    if (modulo === 'productos') {
      return <AdminProductos />;
    }

    if (modulo === 'pedidos') {
      if (pedidoSeleccionado) {
        return (
          <AdminPedidoDetalle
            pedidoId={
              pedidoSeleccionado
            }
            onVolver={() =>
              setPedidoSeleccionado(
                null
              )
            }
          />
        );
      }

      return (
        <AdminPedidos
          onAbrirPedido={
            setPedidoSeleccionado
          }
        />
      );
    }

    return (
      <section className="admin-module-placeholder">
        <h2>
          {modulo.toUpperCase()}
        </h2>

        <p>
          Este módulo se implementará
          próximamente.
        </p>
      </section>
    );
  }

  if (cargando) {
    return (
      <main className="bro-admin-loading">
        Cargando panel...
      </main>
    );
  }

  if (!usuario) {
    return (
      <AdminLogin
        onAccesoCorrecto={
          setUsuario
        }
      />
    );
  }

  return (
    <main className="bro-admin">
      <header className="bro-admin-header">
        <button
          type="button"
          className="bro-admin-home"
          onClick={
            volverDashboard
          }
        >
          BRO ADMIN
        </button>

        <button
          type="button"
          onClick={salir}
        >
          CERRAR SESIÓN
        </button>
      </header>

      <div className="bro-admin-content">
        {modulo ===
        'dashboard' ? (
          <AdminDashboard
            onAbrirModulo={
              abrirModulo
            }
          />
        ) : (
          <>
            {!pedidoSeleccionado && (
              <button
                type="button"
                className="admin-module-back"
                onClick={
                  volverDashboard
                }
              >
                ← VOLVER AL PANEL
              </button>
            )}

            {renderModulo()}
          </>
        )}
      </div>
    </main>
  );
}

export default AdminApp;