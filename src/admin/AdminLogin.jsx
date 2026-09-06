import {
  useState,
} from 'react';

import {
  cerrarSesionAdmin,
  guardarUsuarioRecordado,
  iniciarSesionAdmin,
  obtenerUsuarioRecordado,
  olvidarUsuarioRecordado,
  verificarAdmin,
} from '../lib/admin';

function AdminLogin({
  onAccesoCorrecto,
}) {
  const usuarioRecordadoInicial =
    obtenerUsuarioRecordado();

  const [
    usuario,
    setUsuario,
  ] = useState(
    usuarioRecordadoInicial
  );

  const [
    password,
    setPassword,
  ] = useState('');

  const [
    recordarme,
    setRecordarme,
  ] = useState(
    Boolean(
      usuarioRecordadoInicial
    )
  );

  const [
    error,
    setError,
  ] = useState('');

  const [
    cargando,
    setCargando,
  ] = useState(false);

  async function handleSubmit(
    event
  ) {
    event.preventDefault();

    if (cargando) {
      return;
    }

    const usuarioLimpio =
      usuario.trim();

    if (!usuarioLimpio) {
      setError(
        'Ingresa tu usuario.'
      );

      return;
    }

    if (!password) {
      setError(
        'Ingresa tu contraseña.'
      );

      return;
    }

    setError('');
    setCargando(true);

    try {
      const usuarioAutenticado =
        await iniciarSesionAdmin(
          usuarioLimpio,
          password
        );

      const tieneAcceso =
        await verificarAdmin(
          usuarioAutenticado.id
        );

      if (!tieneAcceso) {
        await cerrarSesionAdmin();

        throw new Error(
          'No tienes acceso disponible con esta cuenta.'
        );
      }

      if (recordarme) {
        guardarUsuarioRecordado(
          usuarioLimpio
        );
      } else {
        olvidarUsuarioRecordado();
      }

      onAccesoCorrecto(
        usuarioAutenticado
      );
    } catch (
      errorLogin
    ) {
      setError(
        errorLogin.message ||
          'No se pudo iniciar sesión. Verifica tus datos.'
      );
    } finally {
      setCargando(false);
    }
  }

  return (
    <main className="bro-admin-login">

      <section className="bro-access-shell">

        <div className="bro-access-brand">

          <div
            className="bro-access-logo"
            aria-label="BRO"
          >
            <span>B</span>

            <span>R</span>

            <span className="bro-access-logo-o">
              O
            </span>
          </div>

          <p>
            Porque él se lo merece.
          </p>

        </div>

        <form
          className="bro-admin-login-card"
          onSubmit={
            handleSubmit
          }
        >
          <div className="bro-access-card-heading">

            <h1>
              Ingresa a tu cuenta
            </h1>

            <p>
              Accede a tu espacio BRO
            </p>

          </div>

          <label>
            <span>
              USUARIO
            </span>

            <input
              type="text"
              name="username"
              value={
                usuario
              }
              onChange={(
                event
              ) => {
                setUsuario(
                  event.target.value
                );

                setError('');
              }}
              placeholder="usuario"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck="false"
              required
            />
          </label>

          <label>
            <span>
              CONTRASEÑA
            </span>

            <input
              type="password"
              name="password"
              value={
                password
              }
              onChange={(
                event
              ) => {
                setPassword(
                  event.target.value
                );

                setError('');
              }}
              placeholder="contraseña"
              autoComplete="current-password"
              required
            />
          </label>

          <label className="bro-access-remember">
            <input
              type="checkbox"
              checked={
                recordarme
              }
              onChange={(
                event
              ) =>
                setRecordarme(
                  event.target.checked
                )
              }
            />

            <span className="bro-access-remember-box" />

            <span className="bro-access-remember-copy">
              <strong>
                RECORDARME
              </strong>

              <small>
                Recordar usuario en este equipo
              </small>
            </span>
          </label>

          {error && (
            <div className="bro-admin-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bro-access-submit"
            disabled={
              cargando
            }
          >
            {cargando
              ? 'INGRESANDO...'
              : 'INGRESAR'}
          </button>

        </form>

        <div className="bro-access-footer">
          <span>
            Powered by
          </span>

          <strong>
            BRO Engineering
          </strong>
        </div>

      </section>

    </main>
  );
}

export default AdminLogin;