import { useEffect, useState } from 'react';
import {
  obtenerUsuarioActualMilEstilos,
  verificarAdminMilEstilos,
  cerrarSesionMilEstilos,
} from '../lib/milEstilos';
import MilEstilosLogin from './MilEstilosLogin';
import MilEstilosDashboard from './MilEstilosDashboard';
import MilEstilosStock from './MilEstilosStock';
import MilEstilosConfiguracion from './MilEstilosConfiguracion';
import MilEstilosPedidos from './MilEstilosPedidos';
import './mil-estilos.css';

const MODULOS = [
  { clave: 'dashboard', etiqueta: 'Dashboard' },
  { clave: 'stock', etiqueta: 'Stock' },
  { clave: 'pedidos', etiqueta: 'Pedidos' },
  { clave: 'configuracion', etiqueta: 'Configuración' },
];

function MilEstilosApp() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [moduloActivo, setModuloActivo] = useState('dashboard');

  useEffect(() => {
    let activo = true;

    async function verificarSesion() {
      const actual = await obtenerUsuarioActualMilEstilos();

      if (!actual) {
        if (activo) setCargando(false);
        return;
      }

      const esAdmin = await verificarAdminMilEstilos(actual.id);

      if (!esAdmin) {
        await cerrarSesionMilEstilos();
        if (activo) {
          setUsuario(null);
          setCargando(false);
        }
        return;
      }

      if (activo) {
        setUsuario(actual);
        setCargando(false);
      }
    }

    verificarSesion();

    return () => {
      activo = false;
    };
  }, []);

  async function manejarSalida() {
    await cerrarSesionMilEstilos();
    setUsuario(null);
  }

  if (cargando) {
    return <div className="me-pantalla-carga">Cargando...</div>;
  }

  if (!usuario) {
    return <MilEstilosLogin onIngreso={setUsuario} />;
  }

  return (
    <div className="me-layout">
      <header className="me-barra-superior no-imprimir">
        <span className="me-marca">Panel</span>
        <nav className="me-nav">
          {MODULOS.map((modulo) => (
            <button
              key={modulo.clave}
              type="button"
              className={`me-nav-boton ${moduloActivo === modulo.clave ? 'me-nav-boton-activo' : ''}`}
              onClick={() => setModuloActivo(modulo.clave)}
            >
              {modulo.etiqueta}
            </button>
          ))}
        </nav>
        <button className="me-boton me-boton-salir" type="button" onClick={manejarSalida}>
          Salir
        </button>
      </header>

      <main className="me-contenido">
        {moduloActivo === 'dashboard' ? <MilEstilosDashboard /> : null}
        {moduloActivo === 'stock' ? <MilEstilosStock /> : null}
        {moduloActivo === 'pedidos' ? <MilEstilosPedidos /> : null}
        {moduloActivo === 'configuracion' ? <MilEstilosConfiguracion /> : null}
      </main>

      <footer className="me-pie-pagina no-imprimir">
        Powered by BRO Engineering
      </footer>
    </div>
  );
}

export default MilEstilosApp;
