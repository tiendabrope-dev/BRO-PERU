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
import AdminSuscriptores from './AdminSuscriptores';
import AdminPromociones from './AdminPromociones';
import AdminSecciones from './AdminSecciones';
import AdminAjustes from './AdminAjustes';

import './admin.css';
import './admin-pedido-detalle.css';

const CLAVE_RECARGA =
  'bro-cuenta-recarga';

const RUTAS_MODULOS = {
  dashboard:
    '/cuenta/inicio',

  pedidos:
    '/cuenta/inicio/pedidos',

  precios:
    '/cuenta/inicio/precios',

  productos:
    '/cuenta/inicio/productos',

  resenas:
    '/cuenta/inicio/resenas',

  suscriptores:
    '/cuenta/inicio/suscriptores',

  ticker:
    '/cuenta/inicio/promociones',

  secciones:
    '/cuenta/inicio/secciones',

  ajustes:
    '/cuenta/inicio/ajustes',
};

function resolverRutaCuenta(
  pathname
) {
  const ruta =
    pathname.replace(
      /\/+$/,
      ''
    ) || '/';

  if (
    ruta ===
    '/cuenta'
  ) {
    return {
      modulo:
        'acceso',

      pedidoId:
        null,

      valida:
        true,
    };
  }

  if (
    ruta ===
    '/cuenta/inicio'
  ) {
    return {
      modulo:
        'dashboard',

      pedidoId:
        null,

      valida:
        true,
    };
  }

  if (
    ruta ===
    '/cuenta/inicio/pedidos'
  ) {
    return {
      modulo:
        'pedidos',

      pedidoId:
        null,

      valida:
        true,
    };
  }

  if (
    ruta.startsWith(
      '/cuenta/inicio/pedidos/'
    )
  ) {
    const valor =
      ruta.slice(
        '/cuenta/inicio/pedidos/'
          .length
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
        modulo:
          'pedidos',

        pedidoId,

        valida:
          true,
      };
    }
  }

  const rutas = {
    '/cuenta/inicio/precios':
      'precios',

    '/cuenta/inicio/productos':
      'productos',

    '/cuenta/inicio/resenas':
      'resenas',

    '/cuenta/inicio/suscriptores':
      'suscriptores',

    '/cuenta/inicio/promociones':
      'ticker',

    '/cuenta/inicio/secciones':
      'secciones',

    '/cuenta/inicio/ajustes':
      'ajustes',
  };

  if (
    rutas[ruta]
  ) {
    return {
      modulo:
        rutas[ruta],

      pedidoId:
        null,

      valida:
        true,
    };
  }

  return {
    modulo:
      'dashboard',

    pedidoId:
      null,

    valida:
      false,
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
    function prepararRecarga() {
      const ruta =
        window.location.pathname;

      if (
        ruta.startsWith(
          '/cuenta/inicio/'
        )
      ) {
        sessionStorage.setItem(
          CLAVE_RECARGA,
          '1'
        );
      } else {
        sessionStorage.removeItem(
          CLAVE_RECARGA
        );
      }
    }

    window.addEventListener(
      'beforeunload',
      prepararRecarga
    );

    return () => {
      window.removeEventListener(
        'beforeunload',
        prepararRecarga
      );
    };
  }, []);

  useEffect(() => {
    let activo = true;

    async function revisarAcceso() {
      try {
        const actual =
          await obtenerUsuarioActual();

        if (!activo) {
          return;
        }

        if (!actual) {
          return;
        }

        const esAdmin =
          await verificarAdmin(
            actual.id
          );

        if (!activo) {
          return;
        }

        if (!esAdmin) {
          await cerrarSesionAdmin();

          return;
        }

        setUsuario(
          actual
        );

        const fueRecarga =
          sessionStorage.getItem(
            CLAVE_RECARGA
          ) === '1';

        sessionStorage.removeItem(
          CLAVE_RECARGA
        );

        if (fueRecarga) {
          navigate(
            '/cuenta/inicio',
            {
              replace:
                true,
            }
          );

          return;
        }

        if (
          window.location.pathname ===
          '/cuenta'
        ) {
          navigate(
            '/cuenta/inicio',
            {
              replace:
                true,
            }
          );
        }
      } finally {
        if (activo) {
          setCargando(
            false
          );
        }
      }
    }

    revisarAcceso();

    return () => {
      activo = false;
    };
  }, [
    navigate,
  ]);

  useEffect(() => {
    if (
      cargando ||
      usuario
    ) {
      return;
    }

    if (
      location.pathname !==
      '/cuenta'
    ) {
      navigate(
        '/cuenta',
        {
          replace:
            true,
        }
      );
    }
  }, [
    cargando,
    usuario,
    location.pathname,
    navigate,
  ]);

  useEffect(() => {
    if (
      cargando ||
      !usuario
    ) {
      return;
    }

    if (
      !rutaCuenta.valida
    ) {
      navigate(
        '/cuenta/inicio',
        {
          replace:
            true,
        }
      );
    }
  }, [
    cargando,
    usuario,
    rutaCuenta.valida,
    navigate,
  ]);

  function accesoCorrecto(
    usuarioAutenticado
  ) {
    sessionStorage.removeItem(
      CLAVE_RECARGA
    );

    setUsuario(
      usuarioAutenticado
    );

    navigate(
      '/cuenta/inicio',
      {
        replace:
          true,
      }
    );
  }

  async function salir() {
    sessionStorage.removeItem(
      CLAVE_RECARGA
    );

    await cerrarSesionAdmin();

    setUsuario(null);

    navigate(
      '/',
      {
        replace:
          true,
      }
    );
  }

  function volverDashboard() {
    navigate(
      '/cuenta/inicio'
    );
  }

  function abrirModulo(
    nombreModulo
  ) {
    const destino =
      RUTAS_MODULOS[
        nombreModulo
      ] ||
      '/cuenta/inicio';

    navigate(
      destino
    );
  }

  function abrirPedido(
    id
  ) {
    if (!id) {
      return;
    }

    navigate(
      '/cuenta/inicio/pedidos/' +
        encodeURIComponent(
          id
        )
    );
  }

  function renderModulo() {
    if (
      modulo ===
      'precios'
    ) {
      return (
        <AdminPrecios />
      );
    }

    if (
      modulo ===
      'productos'
    ) {
      return (
        <AdminProductos />
      );
    }

    if (
      modulo ===
      'resenas'
    ) {
      return (
        <AdminResenas />
      );
    }

    if (
      modulo ===
      'suscriptores'
    ) {
      return (
        <AdminSuscriptores />
      );
    }

    if (
      modulo ===
      'ticker'
    ) {
      return (
        <AdminPromociones />
      );
    }

    if (
      modulo ===
      'secciones'
    ) {
      return (
        <AdminSecciones />
      );
    }

    if (
      modulo ===
      'pedidos'
    ) {
      if (pedidoId) {
        return (
          <AdminPedidoDetalle
            pedidoId={
              pedidoId
            }
            onVolver={() =>
              navigate(
                '/cuenta/inicio/pedidos'
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
      modulo ===
      'ajustes'
    ) {
      return (
        <AdminAjustes />
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