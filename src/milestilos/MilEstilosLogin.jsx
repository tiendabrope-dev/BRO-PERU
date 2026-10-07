import { useState } from 'react';
import { iniciarSesionMilEstilos, verificarAdminMilEstilos, cerrarSesionMilEstilos } from '../lib/milEstilos';
import './mil-estilos.css';

function MilEstilosLogin({ onIngreso }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  async function manejarEnvio(evento) {
    evento.preventDefault();
    setError('');
    setCargando(true);

    try {
      const usuarioAutenticado = await iniciarSesionMilEstilos(usuario, password);
      const esAdmin = await verificarAdminMilEstilos(usuarioAutenticado.id);

      if (!esAdmin) {
        await cerrarSesionMilEstilos();
        throw new Error('Este usuario no tiene acceso a este panel.');
      }

      onIngreso(usuarioAutenticado);
    } catch (errorIngreso) {
      setError(errorIngreso.message || 'No se pudo iniciar sesión.');
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="me-pantalla-login">
      <form className="me-tarjeta-login" onSubmit={manejarEnvio}>
        <h1 className="me-titulo-login">Panel</h1>

        <label className="me-etiqueta">
          Usuario
          <input
            className="me-input"
            type="text"
            value={usuario}
            onChange={(evento) => setUsuario(evento.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label className="me-etiqueta">
          Contraseña
          <input
            className="me-input"
            type="password"
            value={password}
            onChange={(evento) => setPassword(evento.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        {error ? <p className="me-error">{error}</p> : null}

        <button className="me-boton me-boton-primario" type="submit" disabled={cargando}>
          {cargando ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
    </div>
  );
}

export default MilEstilosLogin;
