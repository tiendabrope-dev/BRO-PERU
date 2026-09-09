import {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';

import {
  actualizarSeccionAdmin,
  crearSeccionAdmin,
  eliminarSeccionAdmin,
  obtenerSeccionesAdmin,
} from '../lib/adminSecciones';

/*
  Colores solo visuales para
  distinguir secciones en la lista.

  No se guardan en Supabase,
  se asignan por posición.
*/
const COLORES_SECCION = [
  '#2D5A3D',
  '#4A8C60',
  '#D4C4A8',
  '#A89880',
  '#355477',
  '#8B4365',
  '#65458A',
  '#9B5C00',
  '#767676',
  '#E84040',
];

function colorDeSeccion(
  indice
) {
  return COLORES_SECCION[
    indice %
      COLORES_SECCION.length
  ];
}

function FilaSeccion({
  seccion,
  color,
  ocupado,
  esPrincipal,
  onCambiarNombre,
  onGuardarNombre,
  onToggleActivo,
  onEliminar,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: seccion.id,
  });

  const estilo = {
    transform:
      CSS.Transform.toString(
        transform
      ),

    transition,

    opacity:
      isDragging
        ? 0.6
        : 1,
  };

  return (
    <article
      ref={
        setNodeRef
      }
      style={
        estilo
      }
      className="admin-seccion-fila"
    >

      <button
        type="button"
        className="admin-seccion-arrastrar"
        aria-label="Arrastrar para reordenar"
        {...attributes}
        {...listeners}
      >
        ⠿⠿
      </button>

      <span
        className="admin-seccion-punto"
        style={{
          background:
            color,
        }}
      />

      <div className="admin-seccion-info">

        <input
          type="text"
          className="admin-seccion-nombre"
          value={
            seccion.nombre
          }
          maxLength="60"
          aria-label="Nombre de la sección"
          disabled={
            ocupado
          }
          onChange={(
            evento
          ) =>
            onCambiarNombre(
              seccion.id,
              evento.target.value
            )
          }
          onBlur={() =>
            onGuardarNombre(
              seccion
            )
          }
          onKeyDown={(
            evento
          ) => {
            if (
              evento.key ===
              'Enter'
            ) {
              evento.target.blur();
            }
          }}
        />

        <span className="admin-seccion-slug">
          {
            seccion.slug
          }
        </span>

      </div>

      {esPrincipal && (
        <span className="admin-seccion-principal">
          🏠 EN EL HOME
        </span>
      )}

      <button
        type="button"
        className={`admin-seccion-switch ${
          seccion.activo
            ? 'on'
            : ''
        }`}
        disabled={
          ocupado
        }
        onClick={() =>
          onToggleActivo(
            seccion
          )
        }
        aria-label={
          seccion.activo
            ? `Desactivar ${seccion.nombre}`
            : `Activar ${seccion.nombre}`
        }
      >
        <span />
      </button>

      <button
        type="button"
        className="admin-seccion-eliminar"
        disabled={
          ocupado
        }
        onClick={() =>
          onEliminar(
            seccion
          )
        }
        aria-label={`Eliminar ${seccion.nombre}`}
      >
        ELIMINAR
      </button>

    </article>
  );
}

function AdminSecciones() {
  const [
    secciones,
    setSecciones,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    creando,
    setCreando,
  ] = useState(false);

  const [
    guardando,
    setGuardando,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    nuevoNombre,
    setNuevoNombre,
  ] = useState('');

  const activas =
    useMemo(
      () =>
        secciones.filter(
          (item) =>
            item.activo
        ).length,
      [
        secciones,
      ]
    );

  /*
    La sección "principal" es la
    primera ACTIVA (por orden).

    Es la única que hoy alimenta
    el carrusel del Home.
  */
  const seccionPrincipalId =
    useMemo(
      () =>
        secciones.find(
          (item) =>
            item.activo
        )?.id ||
        null,
      [
        secciones,
      ]
    );

  const sensores =
    useSensors(
      useSensor(
        PointerSensor,
        {
          activationConstraint:
            {
              distance: 6,
            },
        }
      ),
      useSensor(
        TouchSensor,
        {
          activationConstraint:
            {
              delay: 150,
              tolerance: 5,
            },
        }
      ),
      useSensor(
        KeyboardSensor,
        {
          coordinateGetter:
            sortableKeyboardCoordinates,
        }
      )
    );

  async function cargarSecciones() {
    setCargando(true);
    setError('');

    try {
      const datos =
        await obtenerSeccionesAdmin();

      setSecciones(
        datos
      );
    } catch (
      errorCarga
    ) {
      setError(
        errorCarga.message ||
          'No se pudieron cargar las secciones.'
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarSecciones();
  }, []);

  function cambiarNombreLocal(
    id,
    valor
  ) {
    setSecciones(
      (actuales) =>
        actuales.map(
          (item) =>
            item.id ===
            id
              ? {
                  ...item,

                  nombre:
                    valor,
                }
              : item
        )
    );

    setError('');
    setMensaje('');
  }

  async function guardarNombre(
    seccion
  ) {
    const nombreLimpio =
      seccion.nombre.trim();

    if (!nombreLimpio) {
      setError(
        'El nombre no puede quedar vacío.'
      );

      return;
    }

    setGuardando(
      seccion.id
    );

    setError('');

    try {
      const actualizada =
        await actualizarSeccionAdmin(
          seccion.id,
          {
            nombre:
              nombreLimpio,

            orden:
              seccion.orden,

            activo:
              seccion.activo,
          }
        );

      setSecciones(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id ===
              actualizada.id
                ? actualizada
                : item
          )
      );
    } catch (
      errorGuardar
    ) {
      setError(
        errorGuardar.message ||
          'No se pudo guardar la sección.'
      );
    } finally {
      setGuardando('');
    }
  }

  async function alternarActivo(
    seccion
  ) {
    setGuardando(
      seccion.id
    );

    setError('');
    setMensaje('');

    try {
      const actualizada =
        await actualizarSeccionAdmin(
          seccion.id,
          {
            nombre:
              seccion.nombre,

            orden:
              seccion.orden,

            activo:
              !seccion.activo,
          }
        );

      setSecciones(
        (actuales) =>
          actuales.map(
            (item) =>
              item.id ===
              actualizada.id
                ? actualizada
                : item
          )
      );
    } catch (
      errorCambio
    ) {
      setError(
        errorCambio.message ||
          'No se pudo actualizar la sección.'
      );
    } finally {
      setGuardando('');
    }
  }

  async function eliminar(
    seccion
  ) {
    const confirmar =
      window.confirm(
        `¿Eliminar la sección "${seccion.nombre}"? Los productos dejarán de mostrarse en su carrusel.`
      );

    if (!confirmar) {
      return;
    }

    setGuardando(
      seccion.id
    );

    setError('');
    setMensaje('');

    try {
      await eliminarSeccionAdmin(
        seccion.id
      );

      setSecciones(
        (actuales) =>
          actuales.filter(
            (item) =>
              item.id !==
              seccion.id
          )
      );

      setMensaje(
        'Sección eliminada.'
      );
    } catch (
      errorEliminar
    ) {
      setError(
        errorEliminar.message ||
          'No se pudo eliminar la sección.'
      );
    } finally {
      setGuardando('');
    }
  }

  async function crear() {
    const nombre =
      nuevoNombre.trim();

    if (!nombre) {
      setError(
        'Escribe el nombre de la sección.'
      );

      return;
    }

    const mayorOrden =
      secciones.reduce(
        (
          mayor,
          item
        ) =>
          Math.max(
            mayor,
            Number(
              item.orden ||
                0
            )
          ),
        0
      );

    setCreando(true);

    setError('');
    setMensaje('');

    try {
      const creada =
        await crearSeccionAdmin({
          nombre,

          orden:
            mayorOrden +
            10,
        });

      setSecciones(
        (actuales) => [
          ...actuales,
          creada,
        ]
      );

      setNuevoNombre('');

      setMensaje(
        'Sección creada correctamente.'
      );
    } catch (
      errorCrear
    ) {
      setError(
        errorCrear.message ||
          'No se pudo crear la sección.'
      );
    } finally {
      setCreando(false);
    }
  }

  async function manejarDragEnd(
    evento
  ) {
    const {
      active,
      over,
    } = evento;

    if (
      !over ||
      active.id ===
        over.id
    ) {
      return;
    }

    const indiceOrigen =
      secciones.findIndex(
        (item) =>
          item.id ===
          active.id
      );

    const indiceDestino =
      secciones.findIndex(
        (item) =>
          item.id ===
          over.id
      );

    if (
      indiceOrigen ===
        -1 ||
      indiceDestino ===
        -1
    ) {
      return;
    }

    const reordenadas =
      arrayMove(
        secciones,
        indiceOrigen,
        indiceDestino
      ).map(
        (
          seccion,
          indice
        ) => ({
          ...seccion,

          orden:
            indice * 10,
        })
      );

    setSecciones(
      reordenadas
    );

    setError('');
    setMensaje('');

    try {
      await Promise.all(
        reordenadas.map(
          (seccion) =>
            actualizarSeccionAdmin(
              seccion.id,
              {
                nombre:
                  seccion.nombre,

                orden:
                  seccion.orden,

                activo:
                  seccion.activo,
              }
            )
        )
      );
    } catch (
      errorOrden
    ) {
      setError(
        errorOrden.message ||
          'No se pudo guardar el nuevo orden.'
      );

      cargarSecciones();
    }
  }

  return (
    <section className="admin-secciones">

      <style>
        {`
          .admin-secciones {
            width: 100%;
          }

          .admin-secciones-head {
            margin-bottom: 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 18px;
          }

          .admin-secciones-head-text > span {
            display: block;
            margin-bottom: 6px;
            color: #2d5a3d;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-secciones-head h2 {
            margin: 0 0 7px;
            color: #111;
            font-size: 30px;
          }

          .admin-secciones-head p {
            margin: 0;
            color: #767676;
            font-size: 13px;
          }

          .admin-secciones-refresh {
            min-height: 39px;
            padding: 0 15px;
            border: 1px solid #d8d2ca;
            border-radius: 7px;
            background: #fff;
            color: #111;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-secciones-resumen {
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-secciones-resumen span {
            padding: 7px 10px;
            border-radius: 999px;
            background: #e8f0ea;
            color: #2d5a3d;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-secciones-nueva {
            padding: 15px;
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            border: 1px dashed #d8d2ca;
            border-radius: 9px;
            background: #fff;
          }

          .admin-secciones-nueva input {
            flex: 1;
            min-width: 0;
            height: 42px;
            padding: 0 12px;
            box-sizing: border-box;
            border: 1px solid #d8d2ca;
            border-radius: 6px;
            outline: none;
            background: #fff;
            color: #111;
            font: inherit;
            font-size: 12px;
          }

          .admin-secciones-nueva input:focus {
            border-color: #2d5a3d;
            box-shadow:
              0 0 0 3px
              rgba(45, 90, 61, .08);
          }

          .admin-secciones-nueva button {
            min-width: 100px;
            min-height: 42px;
            padding: 0 14px;
            border: 1px solid #2d5a3d;
            border-radius: 6px;
            background: #2d5a3d;
            color: #fff;
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .06em;
          }

          .admin-secciones-nueva button:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-secciones-lista {
            display: grid;
            gap: 10px;
          }

          .admin-seccion-fila {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px 14px;
            border: 1px solid #e2dcd4;
            border-radius: 10px;
            background: #fff;
          }

          .admin-seccion-arrastrar {
            border: none;
            background: transparent;
            padding: 4px;
            color: #cfc7ba;
            font-size: 15px;
            letter-spacing: -2px;
            line-height: 1;
            cursor: grab;
            touch-action: none;
          }

          .admin-seccion-arrastrar:active {
            cursor: grabbing;
          }

          .admin-seccion-punto {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            flex-shrink: 0;
          }

          .admin-seccion-info {
            flex: 1;
            min-width: 0;
            display: grid;
            gap: 2px;
          }

          .admin-seccion-nombre {
            width: 100%;
            border: 1px solid transparent;
            background: transparent;
            border-radius: 6px;
            padding: 5px 7px;
            outline: none;
            font: inherit;
            font-size: 14px;
            font-weight: 700;
            color: #111;
          }

          .admin-seccion-nombre:focus {
            border-color: #2d5a3d;
            background: #fff;
            box-shadow:
              0 0 0 3px
              rgba(45, 90, 61, .08);
          }

          .admin-seccion-nombre:disabled {
            opacity: .6;
          }

          .admin-seccion-slug {
            padding: 0 7px;
            font-family: monospace;
            font-size: 11px;
            color: #9a9a9a;
          }

          .admin-seccion-principal {
            flex-shrink: 0;
            padding: 5px 9px;
            border-radius: 999px;
            background: #e8f0ea;
            color: #2d5a3d;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .04em;
            white-space: nowrap;
          }

          .admin-seccion-switch {
            width: 40px;
            height: 23px;
            flex-shrink: 0;
            position: relative;
            border: none;
            border-radius: 20px;
            background: #ebe6de;
            cursor: pointer;
            padding: 0;
          }

          .admin-seccion-switch:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-seccion-switch.on {
            background: #2d5a3d;
          }

          .admin-seccion-switch span {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 19px;
            height: 19px;
            border-radius: 50%;
            background: #fff;
            transition: left .15s ease;
          }

          .admin-seccion-switch.on span {
            left: 19px;
          }

          .admin-seccion-eliminar {
            flex-shrink: 0;
            min-height: 32px;
            padding: 0 12px;
            border: 1px solid #f0d8d8;
            border-radius: 6px;
            background: #fff;
            color: #b42318;
            cursor: pointer;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: .05em;
          }

          .admin-seccion-eliminar:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-secciones-error,
          .admin-secciones-ok {
            margin-bottom: 14px;
            padding: 11px 13px;
            border-radius: 7px;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-secciones-error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-secciones-ok {
            background: #e8f0ea;
            color: #2d5a3d;
          }

          .admin-secciones-status {
            padding: 32px 20px;
            border: 1px solid #e2dcd4;
            border-radius: 9px;
            background: #fff;
            color: #777;
            text-align: center;
            font-size: 12px;
          }

          @media (
            max-width:
            620px
          ) {
            .admin-secciones-head {
              flex-direction: column;
            }

            .admin-secciones-refresh {
              width: 100%;
            }

            .admin-secciones-nueva {
              flex-direction: column;
            }

            .admin-secciones-nueva button {
              width: 100%;
            }

            .admin-seccion-fila {
              flex-wrap: wrap;
              row-gap: 8px;
            }

            .admin-seccion-info {
              flex-basis: calc(100% - 58px);
            }

            .admin-seccion-switch {
              margin-left: auto;
            }
          }
        `}
      </style>

      <div className="admin-secciones-head">

        <div className="admin-secciones-head-text">
          <span>
            TIENDA
          </span>

          <h2>
            Secciones
          </h2>

          <p>
            Arrastra para ordenar los carruseles del Home. El interruptor activa o desactiva cada sección.
          </p>
        </div>

        <button
          type="button"
          className="admin-secciones-refresh"
          onClick={
            cargarSecciones
          }
          disabled={
            cargando
          }
        >
          ACTUALIZAR
        </button>

      </div>

      <div className="admin-secciones-resumen">

        <span>
          {activas} ACTIVAS
        </span>

        <span>
          {secciones.length} TOTAL
        </span>

      </div>

      {error && (
        <div className="admin-secciones-error">
          {error}
        </div>
      )}

      {mensaje && (
        <div className="admin-secciones-ok">
          {mensaje}
        </div>
      )}

      <div className="admin-secciones-nueva">

        <input
          type="text"
          value={
            nuevoNombre
          }
          maxLength="60"
          placeholder="+ Nueva sección... (ej. Cuadros VIP)"
          onChange={(
            evento
          ) => {
            setNuevoNombre(
              evento.target.value
            );

            setError('');
            setMensaje('');
          }}
          onKeyDown={(
            evento
          ) => {
            if (
              evento.key ===
              'Enter'
            ) {
              crear();
            }
          }}
        />

        <button
          type="button"
          disabled={
            creando
          }
          onClick={
            crear
          }
        >
          {creando
            ? 'AÑADIENDO...'
            : 'AÑADIR'}
        </button>

      </div>

      {cargando ? (
        <div className="admin-secciones-status">
          Cargando secciones...
        </div>
      ) : secciones.length ===
        0 ? (
        <div className="admin-secciones-status">
          No hay secciones registradas.
        </div>
      ) : (
        <DndContext
          sensors={
            sensores
          }
          collisionDetection={
            closestCenter
          }
          onDragEnd={
            manejarDragEnd
          }
        >
          <SortableContext
            items={secciones.map(
              (item) =>
                item.id
            )}
            strategy={
              verticalListSortingStrategy
            }
          >
            <div className="admin-secciones-lista">

              {secciones.map(
                (
                  seccion,
                  indice
                ) => (
                  <FilaSeccion
                    key={
                      seccion.id
                    }
                    seccion={
                      seccion
                    }
                    color={colorDeSeccion(
                      indice
                    )}
                    ocupado={
                      guardando ===
                      seccion.id
                    }
                    esPrincipal={
                      seccion.id ===
                      seccionPrincipalId
                    }
                    onCambiarNombre={
                      cambiarNombreLocal
                    }
                    onGuardarNombre={
                      guardarNombre
                    }
                    onToggleActivo={
                      alternarActivo
                    }
                    onEliminar={
                      eliminar
                    }
                  />
                )
              )}

            </div>
          </SortableContext>
        </DndContext>
      )}

    </section>
  );
}

export default AdminSecciones;
