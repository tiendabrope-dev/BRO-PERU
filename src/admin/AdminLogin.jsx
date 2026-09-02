import {
  useState,
} from 'react';

import {
  cerrarSesionAdmin,
  iniciarSesionAdmin,
  verificarAdmin,
} from '../lib/admin';

function AdminLogin({
  onAccesoCorrecto,
}) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [error, setError] =
    useState('');

  const [cargando, setCargando] =
    useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    if (cargando) {
      return;
    }

    setError('');
    setCargando(true);

    try {
      const usuario =
        await iniciarSesionAdmin(
          email,
          password
        );

      const esAdmin =
        await verificarAdmin(
          usuario.id
        );

      if (!esAdmin) {
        await cerrarSesionAdmin();

        throw new Error(
          'Este usuario no tiene acceso al panel.'
        );
      }

      onAccesoCorrecto(usuario);
    } catch (errorLogin) {
      setError(
        errorLogin.message ||
          'No se pudo iniciar sesión.'
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="bro-admin-login">
      <form
        className="bro-admin-login-card"
        onSubmit={handleSubmit}
      >
        <div className="bro-admin-brand">
          BRO
        </div>

        <h1>
          PANEL ADMIN
        </h1>

        <p>
          Acceso privado
        </p>

        <label>
          Correo
          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            autoComplete="email"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            autoComplete="current-password"
            required
          />
        </label>

        {error && (
          <div className="bro-admin-error">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={cargando}
        >
          {cargando
            ? 'INGRESANDO...'
            : 'INGRESAR'}
        </button>
      </form>
    </main>
  );
}

export default AdminLogin;