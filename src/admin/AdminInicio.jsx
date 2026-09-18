import {
  useEffect,
  useState,
} from 'react';

import { obtenerPedidosParaEstadisticasAdmin } from '../lib/estadisticas';

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

      <div className="admin-inicio-info">

        <div className="admin-inicio-info-item">
          <strong>
            Tienda
          </strong>

          <span>
            BRO Perú — brotienda.com
          </span>
        </div>

        <div className="admin-inicio-info-item">
          <strong>
            Navegación
          </strong>

          <span>
            Usa el ícono de la esquina superior izquierda para moverte rápido entre módulos.
          </span>
        </div>

      </div>

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

    </section>
  );
}

export default AdminInicio;
