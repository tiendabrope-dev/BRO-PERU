import {
  useEffect,
  useRef,
  useState,
} from 'react';

import { MODULOS } from './AdminDashboard';

function IconoRejilla() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="19"
      height="19"
      aria-hidden="true"
    >
      <circle cx="5" cy="5" r="2.1" fill="currentColor" />
      <circle cx="12" cy="5" r="2.1" fill="currentColor" />
      <circle cx="19" cy="5" r="2.1" fill="currentColor" />

      <circle cx="5" cy="12" r="2.1" fill="currentColor" />
      <circle cx="12" cy="12" r="2.1" fill="currentColor" />
      <circle cx="19" cy="12" r="2.1" fill="currentColor" />

      <circle cx="5" cy="19" r="2.1" fill="currentColor" />
      <circle cx="12" cy="19" r="2.1" fill="currentColor" />
      <circle cx="19" cy="19" r="2.1" fill="currentColor" />
    </svg>
  );
}

function AdminMenuRapido({
  onAbrirModulo,
}) {
  const [
    abierto,
    setAbierto,
  ] = useState(false);

  const contenedorRef =
    useRef(null);

  useEffect(() => {
    if (!abierto) {
      return undefined;
    }

    function alHacerClicFuera(
      evento
    ) {
      if (
        contenedorRef.current &&
        !contenedorRef.current.contains(
          evento.target
        )
      ) {
        setAbierto(
          false
        );
      }
    }

    document.addEventListener(
      'mousedown',
      alHacerClicFuera
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        alHacerClicFuera
      );
    };
  }, [
    abierto,
  ]);

  function seleccionar(
    idModulo
  ) {
    setAbierto(
      false
    );

    onAbrirModulo(
      idModulo
    );
  }

  return (
    <div
      className="bro-admin-menu-rapido"
      ref={
        contenedorRef
      }
    >

      <button
        type="button"
        className="bro-admin-menu-boton"
        onClick={() =>
          setAbierto(
            (actual) =>
              !actual
          )
        }
        aria-label="Abrir menú de módulos"
        aria-expanded={
          abierto
        }
      >
        <IconoRejilla />
      </button>

      {abierto && (
        <div className="bro-admin-menu-lista">

          {MODULOS.map(
            (modulo) => (
              <button
                key={
                  modulo.id
                }
                type="button"
                className="bro-admin-menu-item"
                onClick={() =>
                  seleccionar(
                    modulo.id
                  )
                }
              >
                <span
                  className={`bro-admin-menu-icono admin-module-icon-${modulo.id}`}
                >
                  {
                    modulo.icono
                  }
                </span>

                {
                  modulo.titulo
                }
              </button>
            )
          )}

          <div className="bro-admin-menu-separador" />

          <button
            type="button"
            className="bro-admin-menu-item"
            onClick={() =>
              seleccionar(
                'modulos'
              )
            }
          >
            <span className="bro-admin-menu-icono bro-admin-menu-icono-todos">
              ⊞
            </span>

            Módulos
          </button>

        </div>
      )}

    </div>
  );
}

export default AdminMenuRapido;
