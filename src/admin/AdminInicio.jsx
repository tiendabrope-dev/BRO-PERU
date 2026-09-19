import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  calcularResumenMes,
  formatearSoles,
  obtenerPedidosParaEstadisticasAdmin,
} from '../lib/estadisticas';

import AdminCalendarioPedidos from './AdminCalendarioPedidos';
import AdminEstadisticasVentas from './AdminEstadisticasVentas';

import './admin-inicio.css';

function obtenerFechaTexto() {
  const fecha = new Date();

  const texto = fecha.toLocaleDateString(
    'es-PE',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }
  );

  return texto;
}

function AdminInicio({
  onAbrirModulo,
}) {
  const [
    pedidos,
    setPedidos,
  ] = useState([]);

  const [
    cargandoPedidos,
    setCargandoPedidos,
  ] = useState(true);

  useEffect(() => {
    let activo = true;

    async function cargar() {
      try {
        const datos =
          await obtenerPedidosParaEstadisticasAdmin();

        if (activo) {
          setPedidos(
            datos
          );
        }
      } catch (
        errorCarga
      ) {
        console.error(
          'No se pudieron cargar las estadísticas del panel:',
          errorCarga
        );
      } finally {
        if (activo) {
          setCargandoPedidos(
            false
          );
        }
      }
    }

    cargar();

    return () => {
      activo = false;
    };
  }, []);

  const resumen = useMemo(
    () =>
      calcularResumenMes(
        pedidos
      ),
    [
      pedidos,
    ]
  );

  return (
    <section className="admin-inicio">

      <div className="admin-inicio-heading">
        <span>
          PANEL BRO PERÚ
        </span>

        <h1>
          Bienvenido, Diego
        </h1>

        <p>
          {obtenerFechaTexto()}
        </p>
      </div>

      <div className="admin-inicio-resumen">

        <div className="admin-inicio-resumen-item admin-inicio-resumen-item-negro">
          <div className="admin-inicio-resumen-icono">
            PD
          </div>

          <div className="admin-inicio-resumen-texto">
            <span>
              Pedidos este mes
            </span>

            <strong>
              {cargandoPedidos
                ? '—'
                : resumen.pedidosMes}
            </strong>
          </div>
        </div>

        <div className="admin-inicio-resumen-item admin-inicio-resumen-item-verde">
          <div className="admin-inicio-resumen-icono">
            S/
          </div>

          <div className="admin-inicio-resumen-texto">
            <span>
              Ingresos este mes
            </span>

            <strong>
              {cargandoPedidos
                ? '—'
                : formatearSoles(
                    resumen.ingresosMes
                  )}
            </strong>
          </div>
        </div>

        <div className="admin-inicio-resumen-item admin-inicio-resumen-item-alerta">
          <div className="admin-inicio-resumen-icono">
            !
          </div>

          <div className="admin-inicio-resumen-texto">
            <span>
              Pedidos por atender
            </span>

            <strong>
              {cargandoPedidos
                ? '—'
                : resumen.pendientes}
            </strong>
          </div>
        </div>

      </div>

      <div className="admin-inicio-stats">

        <AdminCalendarioPedidos
          pedidos={
            pedidos
          }
          cargando={
            cargandoPedidos
          }
        />

        <AdminEstadisticasVentas
          pedidos={
            pedidos
          }
          cargando={
            cargandoPedidos
          }
        />

      </div>

      <div className="admin-inicio-pie">

        <button
          type="button"
          className="admin-inicio-ver-modulos"
          onClick={() =>
            onAbrirModulo(
              'modulos'
            )
          }
        >
          Ver todos los módulos →
        </button>

      </div>

      <p className="admin-inicio-powered">
        Powered by{' '}
        <strong>
          Bro Engineering
        </strong>
      </p>

    </section>
  );
}

export default AdminInicio;
