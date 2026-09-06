import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

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
import AdminResenas from './AdminResenas';

import './admin.css';
import './admin-pedido-detalle.css';

const RUTAS_MODULOS = {
  dashboard: '/cuenta/inicio',
  pedidos: '/cuenta/pedidos',
  precios: '/cuenta/precios',
  productos: '/cuenta/productos',
  resenas: '/cuenta/resenas',
  ticker: '/cuenta/promociones',
  ajustes: '/cuenta/ajustes',
};

function resolverRutaCuenta(
  pathname
) {
  const ruta =
    pathname.replace(
      /\/+$/,
      ''
    ) || '/';

  if (ruta === '/cuenta') {
    return {
      modulo: 'acceso',
      pedidoId: null,
      valida: true,
    };
  }

  if (
    ruta === '/cuenta/inicio'
  ) {
    return {
      modulo: 'dashboard',
      pedidoId: null,
      valida: true,
    };
  }

  if (
    ruta === '/cuenta/pedidos'
  ) {
    return {
      modulo: 'pedidos',
      pedidoId: null,
      valida: true,
    };
  }

  if (
    ruta.startsWith(
      '/cuenta/pedidos/'
    )
  ) {
    const valor =
      ruta.slice(
        '/cuenta/pedidos/'.length
      );

    let pedidoId = '';

    try {
      pedidoId =
        decodeURIComponent(
          valor
        );
    } catch {
      pedidoId = '';
    }

    if (pedidoId) {
      return {
        modulo: 'pedidos',
        pedidoId,
        valida: true,
      };
    }
  }

  const rutasSimples = {
    '/cuenta/precios':
      'precios',

    '/cuenta/productos':
      'productos',

    '/cuenta/resenas':
      'resenas',

    '/cuenta/promociones':
      'ticker',

    '/cuenta/ajustes':
      'ajustes',
  };

  if (
    rutasSimples[ruta]
  ) {
    return {
      modulo:
        rutasSimples[ruta],

      pedidoId: null,
      valida: true,
    };
  }

  return {
    modulo: 'dashboard',
    pedidoId: null,
    valida: false,
  };
}

function AdminApp() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const [
    usuario,
    setUsuario,
  ] = useState(null);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const rutaCuenta =
    useMemo(
      () =>
        resolverRutaCuenta(
          location.pathname
        ),
      [
        location.pathname,
      ]
    );

  const {
    modulo,
    pedidoId,
  } = rutaCuenta;

  useEffect(() => {
    let montado = true;

    async function revisarAcceso() {
      try {
        const actual =
          await obtenerUsuarioActual();

        if (
          !montado ||
          !actual
        ) {
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

        if (montado) {
          setUsuario(
            actual
          );
        }
      } finally {
        if (montado) {
          setCargando(
            false
          );
        }
      }
    }

    revisarAcceso();

    return () => {
      montado = false;
    };
  }, []);

  useEffect(() => {
    if (
      cargando ||
      !usuario
    ) {
      return;
    }

    if (
      location.pathname ===
        '/cuenta' ||
      !rutaCuenta.valida
    ) {
      navigate(
        '/cuenta/inicio',
        {
          replace: true,
        }
      );
    }
  }, [
    cargando,
    usuario,
    location.pathname,
    rutaCuenta.valida,
    navigate,
  ]);

  async function salir() {
    await cerrarSesionAdmin();

    setUsuario(null);

    navigate(
      '/',
      {
        replace: true,
      }
    );
  }

  function accesoCorrecto(
    usuarioAutenticado
  ) {
    setUsuario(
      usuarioAutenticado
    );

    if (
      location.pathname ===
        '/cuenta' ||
      !rutaCuenta.valida
    ) {
      navigate(
        '/cuenta/inicio',
        {
          replace: true,
        }
      );
    }
  }

  function volverDashboard() {
    navigate(
      '/cuenta/inicio'
    );
  }

  function abrirModulo(
    nombreModulo
  ) {
    navigate(
      RUTAS_MODULOS[
        nombreModulo
      ] ||
        '/cuenta/inicio'
    );
  }

  function abrirPedido(
    id
  ) {
    if (!id) {
      return;
    }

    navigate(
      '/cuenta/pedidos/' +
        encodeURIComponent(
          id
        )
    );
  }

  function renderModulo() {
    if (
      modulo === 'precios'
    ) {
      return (
        <AdminPrecios />
      );
    }

    if (
      modulo === 'productos'
    ) {
      return (
        <AdminProductos />
      );
    }

    if (
      modulo === 'resenas'
    ) {
      return (
        <AdminResenas />
      );
    }

    if (
      modulo === 'pedidos'
    ) {
      if (pedidoId) {
        return (
          <AdminPedidoDetalle
            pedidoId={
              pedidoId
            }
            onVolver={() =>
              navigate(
                '/cuenta/pedidos'
              )
            }
          />
        );
      }

      return (
        <AdminPedidos
          onAbrirPedido={
            abrirPedido
          }
        />
      );
    }

    if (
      modulo === 'ticker' ||
      modulo === 'ajustes'
    ) {
      return (
        <section className="admin-module-placeholder">
          <h2>
            {modulo ===
            'ticker'
              ? 'PROMOCIONES'
              : 'AJUSTES'}
          </h2>

          <p>
            Este módulo se implementará
            próximamente.
          </p>
        </section>
      );
    }

    return (
      <AdminDashboard
        onAbrirModulo={
          abrirModulo
        }
      />
    );
  }

  if (cargando) {
    return (
      <main className="bro-admin-loading">
        Cargando...
      </main>
    );
  }

  if (!usuario) {
    return (
      <AdminLogin
        onAccesoCorrecto={
          accesoCorrecto
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
          BRO
        </button>

        <button
          type="button"
          onClick={
            salir
          }
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
            {!pedidoId && (
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
