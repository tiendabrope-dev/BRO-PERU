import {
  useEffect,
  useState,
} from 'react';

import {
  actualizarAjustesAdmin,
  obtenerAjustesAdmin,
} from '../lib/adminAjustes';

function AdminAjustes() {
  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    guardando,
    setGuardando,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    formulario,
    setFormulario,
  ] = useState({
    whatsappPedidos: '',
    yapePlinNumero: '',
    yapePlinTitular: '',
  });

  async function cargarAjustes() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerAjustesAdmin();

      setFormulario({
        whatsappPedidos:
          datos?.whatsapp_pedidos ||
          '',

        yapePlinNumero:
          datos?.yape_plin_numero ||
          '',

        yapePlinTitular:
          datos?.yape_plin_titular ||
          '',
      });
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar los ajustes.'
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarAjustes();
  }, []);

  function cambiarCampo(
    evento
  ) {
    const {
      name,
      value,
    } = evento.target;

    setFormulario(
      (actual) => ({
        ...actual,

        [name]:
          value,
      })
    );

    setError('');
    setMensaje('');
  }

  async function guardar(
    evento
  ) {
    evento.preventDefault();

    if (guardando) {
      return;
    }

    setGuardando(true);
    setError('');
    setMensaje('');

    try {
      const actualizado =
        await actualizarAjustesAdmin(
          formulario
        );

      setFormulario({
        whatsappPedidos:
          actualizado.whatsapp_pedidos,

        yapePlinNumero:
          actualizado.yape_plin_numero,

        yapePlinTitular:
          actualizado.yape_plin_titular,
      });

      setMensaje(
        'Ajustes guardados correctamente.'
      );
    } catch (
      errorGuardar
    ) {
      setError(
        errorGuardar.message ||
          'No se pudieron guardar los ajustes.'
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="admin-ajustes">

      <style>
        {`
          .admin-ajustes {
            width: 100%;
            max-width: 560px;
          }

          .admin-ajustes-head > span {
            display: block;
            margin-bottom: 6px;
            color: #2d5a3d;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-ajustes-head h2 {
            margin: 0 0 7px;
            color: #111;
            font-size: 30px;
          }

          .admin-ajustes-head p {
            margin: 0 0 24px;
            color: #767676;
            font-size: 13px;
            line-height: 1.5;
          }

          .admin-ajustes-form {
            display: grid;
            gap: 16px;
            padding: 20px;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
          }

          .admin-ajustes-field {
            display: grid;
            gap: 6px;
          }

          .admin-ajustes-field span {
            color: #555;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .06em;
          }

          .admin-ajustes-field input {
            height: 42px;
            padding: 0 12px;
            box-sizing: border-box;
            border: 1px solid #d8d2ca;
            border-radius: 6px;
            outline: none;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 13px;
          }

          .admin-ajustes-field input:focus {
            border-color: #2d5a3d;
            box-shadow:
              0 0 0 3px
              rgba(45, 90, 61, .08);
          }

          .admin-ajustes-field small {
            color: #999;
            font-size: 10.5px;
            line-height: 1.4;
          }

          .admin-ajustes-guardar {
            min-height: 44px;
            margin-top: 4px;
            padding: 0 18px;
            border: 1px solid #2d5a3d;
            border-radius: 6px;
            background: #2d5a3d;
            color: #fff;
            cursor: pointer;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-ajustes-guardar:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-ajustes-error,
          .admin-ajustes-ok {
            margin-bottom: 16px;
            padding: 11px 13px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-ajustes-error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-ajustes-ok {
            background: #e8f0ea;
            color: #2d5a3d;
          }

          .admin-ajustes-status {
            padding: 32px 20px;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
            color: #777;
            text-align: center;
            font-size: 12px;
          }
        `}
      </style>

      <div className="admin-ajustes-head">
        <span>
          TIENDA
        </span>

        <h2>
          Ajustes
        </h2>

        <p>
          Datos de contacto y pago usados en toda la tienda:
          WhatsApp de pedidos y Yape/Plin. Al guardar aquí
          se actualizan en un solo lugar (footer, checkout
          y mensaje de WhatsApp).
        </p>
      </div>

      {error && (
        <div className="admin-ajustes-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-ajustes-ok">
          {mensaje}
        </div>
      )}

      {cargando ? (
        <div className="admin-ajustes-status">
          Cargando ajustes...
        </div>
      ) : (
        <form
          className="admin-ajustes-form"
          onSubmit={guardar}
        >

          <label className="admin-ajustes-field">
            <span>
              WHATSAPP DE PEDIDOS
            </span>

            <input
              type="text"
              name="whatsappPedidos"
              value={
                formulario.whatsappPedidos
              }
              onChange={
                cambiarCampo
              }
              inputMode="numeric"
              placeholder="51931330058"
              disabled={
                guardando
              }
            />

            <small>
              Con código de país, solo números
              (ej. 51931330058). Es el número donde
              llegan los pedidos por WhatsApp.
            </small>
          </label>

          <label className="admin-ajustes-field">
            <span>
              NÚMERO YAPE / PLIN
            </span>

            <input
              type="text"
              name="yapePlinNumero"
              value={
                formulario.yapePlinNumero
              }
              onChange={
                cambiarCampo
              }
              inputMode="numeric"
              placeholder="926555219"
              disabled={
                guardando
              }
            />

            <small>
              Solo números, sin espacios. Se muestra
              en el checkout y en el mensaje de WhatsApp.
            </small>
          </label>

          <label className="admin-ajustes-field">
            <span>
              TITULAR YAPE / PLIN
            </span>

            <input
              type="text"
              name="yapePlinTitular"
              value={
                formulario.yapePlinTitular
              }
              onChange={
                cambiarCampo
              }
              maxLength="80"
              placeholder="DIEGO LOP* VAL*"
              disabled={
                guardando
              }
            />
          </label>

          <button
            type="submit"
            className="admin-ajustes-guardar"
            disabled={
              guardando
            }
          >
            {guardando
              ? 'GUARDANDO...'
              : 'GUARDAR AJUSTES'}
          </button>

        </form>
      )}

    </section>
  );
}

export default AdminAjustes;