import { useEffect, useState } from 'react';

import {
  aplicarMarcaDeAguaRetroactivaAdmin,
  imagenYaTieneMarcaDeAguaRetro,
  obtenerProductosAdmin,
} from '../lib/adminProductos';

function estadoInicialPara(producto) {
  if (!producto.imagen_url) {
    return 'sin-imagen';
  }

  if (imagenYaTieneMarcaDeAguaRetro(producto.imagen_url)) {
    return 'omitida';
  }

  return 'pendiente';
}

function AdminMarcaDeAguaRetro() {
  const [productos, setProductos] = useState([]);
  const [estados, setEstados] = useState({});
  const [errores, setErrores] = useState({});
  const [cargando, setCargando] = useState(true);
  const [procesandoTodo, setProcesandoTodo] = useState(false);
  const [error, setError] = useState('');

  async function cargar() {
    setCargando(true);
    setError('');

    try {
      const datos = await obtenerProductosAdmin();

      setProductos(datos);

      const nuevosEstados = {};

      datos.forEach((producto) => {
        nuevosEstados[producto.producto_id] = estadoInicialPara(producto);
      });

      setEstados(nuevosEstados);
      setErrores({});
    } catch (errorCarga) {
      setError(errorCarga.message || 'No se pudieron cargar los productos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function procesarUno(producto) {
    const id = producto.producto_id;

    setEstados((actuales) => ({ ...actuales, [id]: 'procesando' }));

    setErrores((actuales) => {
      const copia = { ...actuales };
      delete copia[id];
      return copia;
    });

    try {
      const resultado = await aplicarMarcaDeAguaRetroactivaAdmin(producto);

      setProductos((actuales) =>
        actuales.map((item) =>
          item.producto_id === id ? { ...item, imagen_url: resultado.url } : item
        )
      );

      setEstados((actuales) => ({
        ...actuales,
        [id]: resultado.yaProcesada ? 'omitida' : 'listo',
      }));
    } catch (errorProceso) {
      setEstados((actuales) => ({ ...actuales, [id]: 'error' }));

      setErrores((actuales) => ({
        ...actuales,
        [id]: errorProceso.message || 'No se pudo procesar esta imagen.',
      }));
    }
  }

  async function procesarTodasLasPendientes() {
    setProcesandoTodo(true);

    const pendientes = productos.filter(
      (producto) => estados[producto.producto_id] === 'pendiente'
    );

    for (const producto of pendientes) {
      await procesarUno(producto);
    }

    setProcesandoTodo(false);
  }

  const pendientes = productos.filter(
    (producto) => estados[producto.producto_id] === 'pendiente'
  ).length;

  const listas = productos.filter(
    (producto) => estados[producto.producto_id] === 'listo'
  ).length;

  const omitidas = productos.filter(
    (producto) => estados[producto.producto_id] === 'omitida'
  ).length;

  return (
    <section className="admin-marca-retro">
      <style>
        {`
          .admin-marca-retro {
            width: 100%;
          }

          .admin-marca-retro-head {
            margin-bottom: 18px;
          }

          .admin-marca-retro-head span {
            display: block;
            margin-bottom: 6px;
            color: var(--bro-verde);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-marca-retro-head h2 {
            margin: 0 0 7px;
            color: var(--bro-texto);
            font-size: 30px;
          }

          .admin-marca-retro-head p {
            margin: 0;
            color: var(--bro-texto-tenue);
            font-size: 13px;
            max-width: 640px;
            line-height: 1.6;
          }

          .admin-marca-retro-aviso {
            margin: 14px 0 18px;
            padding: 12px 14px;
            border: 1px solid var(--bro-ambar);
            border-radius: 8px;
            background: var(--bro-ambar-palido);
            color: var(--bro-ambar);
            font-size: 12px;
            line-height: 1.6;
          }

          .admin-marca-retro-resumen {
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-marca-retro-resumen span {
            padding: 7px 10px;
            border-radius: 999px;
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .08em;
          }

          .admin-marca-retro-error {
            margin-bottom: 14px;
            padding: 11px 13px;
            border-radius: 7px;
            background: #fff0f0;
            color: #b42318;
            font-size: 11px;
            font-weight: 700;
          }

          .admin-marca-retro-acciones {
            margin-bottom: 18px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }

          .admin-marca-retro-acciones button {
            min-height: 42px;
            padding: 0 16px;
            border: 1px solid var(--bro-verde);
            border-radius: 6px;
            background: var(--bro-verde);
            color: #fff;
            cursor: pointer;
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .06em;
          }

          .admin-marca-retro-acciones button.secundario {
            border-color: var(--bro-borde-fuerte);
            background: var(--bro-panel);
            color: var(--bro-texto);
          }

          .admin-marca-retro-acciones button:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-marca-retro-lista {
            display: grid;
            gap: 10px;
          }

          .admin-marca-retro-card {
            padding: 12px;
            display: grid;
            grid-template-columns: 56px 1fr auto auto;
            gap: 12px;
            align-items: center;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
          }

          .admin-marca-retro-card img {
            width: 56px;
            height: 56px;
            object-fit: cover;
            border-radius: 6px;
            border: 1px solid var(--bro-borde-fuerte);
          }

          .admin-marca-retro-nombre {
            min-width: 0;
          }

          .admin-marca-retro-nombre strong {
            display: block;
            color: var(--bro-texto);
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .admin-marca-retro-nombre small {
            display: block;
            margin-top: 3px;
            color: #b42318;
            font-size: 10px;
          }

          .admin-marca-retro-estado {
            padding: 6px 10px;
            border-radius: 999px;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .06em;
            white-space: nowrap;
          }

          .admin-marca-retro-estado.pendiente {
            background: var(--bro-hover-fuerte);
            color: var(--bro-texto-tenue);
          }

          .admin-marca-retro-estado.procesando {
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
          }

          .admin-marca-retro-estado.listo {
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
          }

          .admin-marca-retro-estado.omitida {
            background: var(--bro-hover-fuerte);
            color: var(--bro-texto-tenue);
          }

          .admin-marca-retro-estado.error {
            background: #fff0f0;
            color: #b42318;
          }

          .admin-marca-retro-estado.sin-imagen {
            background: var(--bro-hover-fuerte);
            color: var(--bro-texto-tenue);
          }

          .admin-marca-retro-card button {
            min-height: 34px;
            padding: 0 12px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 6px;
            background: var(--bro-panel);
            color: var(--bro-texto);
            cursor: pointer;
            font-size: 9px;
            font-weight: 900;
            letter-spacing: .05em;
          }

          .admin-marca-retro-card button:disabled {
            opacity: .55;
            cursor: wait;
          }

          .admin-marca-retro-status {
            padding: 32px 20px;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
            color: var(--bro-texto-tenue);
            text-align: center;
            font-size: 12px;
          }

          @media (max-width: 760px) {
            .admin-marca-retro-card {
              grid-template-columns: 44px 1fr;
              grid-template-areas:
                "foto nombre"
                "estado estado"
                "accion accion";
            }

            .admin-marca-retro-card img {
              grid-area: foto;
              width: 44px;
              height: 44px;
            }

            .admin-marca-retro-nombre {
              grid-area: nombre;
            }

            .admin-marca-retro-estado {
              grid-area: estado;
              justify-self: start;
            }

            .admin-marca-retro-card button {
              grid-area: accion;
              width: 100%;
            }
          }
        `}
      </style>

      <div className="admin-marca-retro-head">
        <span>TIENDA</span>

        <h2>Marca de agua — imágenes existentes</h2>

        <p>
          Herramienta de uso único: aplica la marca de agua "BRO" a las
          imágenes de producto que ya estaban subidas antes de la Etapa 5A.
          Cada imagen procesada queda marcada para que nunca se vuelva a
          procesar por accidente, aunque abras esta página más de una vez.
        </p>
      </div>

      <div className="admin-marca-retro-aviso">
        Esta página no aparece en el menú a propósito — es una herramienta
        interna de mantenimiento. Puedes volver a entrar a esta URL cuando
        quieras, pero solo tiene efecto sobre las imágenes que todavía
        estén "PENDIENTE".
      </div>

      {error && <div className="admin-marca-retro-error">{error}</div>}

      <div className="admin-marca-retro-resumen">
        <span>{pendientes} PENDIENTES</span>
        <span>{listas} LISTAS AHORA</span>
        <span>{omitidas} YA PROCESADAS ANTES</span>
        <span>{productos.length} TOTAL</span>
      </div>

      <div className="admin-marca-retro-acciones">
        <button
          type="button"
          onClick={procesarTodasLasPendientes}
          disabled={cargando || procesandoTodo || pendientes === 0}
        >
          {procesandoTodo
            ? 'PROCESANDO...'
            : `APLICAR MARCA DE AGUA A LAS ${pendientes} PENDIENTES`}
        </button>

        <button
          type="button"
          className="secundario"
          onClick={cargar}
          disabled={cargando || procesandoTodo}
        >
          ACTUALIZAR LISTA
        </button>
      </div>

      {cargando ? (
        <div className="admin-marca-retro-status">Cargando productos...</div>
      ) : productos.length === 0 ? (
        <div className="admin-marca-retro-status">No hay productos registrados.</div>
      ) : (
        <div className="admin-marca-retro-lista">
          {productos.map((producto) => {
            const id = producto.producto_id;
            const estado = estados[id] || 'pendiente';
            const puedeReintentar = estado === 'error';
            const puedeProcesar = estado === 'pendiente' || puedeReintentar;

            return (
              <article key={id} className="admin-marca-retro-card">
                {producto.imagen_url ? (
                  <img src={producto.imagen_url} alt={producto.nombre} />
                ) : (
                  <div />
                )}

                <div className="admin-marca-retro-nombre">
                  <strong>{producto.nombre}</strong>

                  {errores[id] && <small>{errores[id]}</small>}
                </div>

                <span className={`admin-marca-retro-estado ${estado}`}>
                  {estado.toUpperCase()}
                </span>

                {puedeProcesar && (
                  <button
                    type="button"
                    onClick={() => procesarUno(producto)}
                    disabled={estado === 'procesando' || procesandoTodo}
                  >
                    {puedeReintentar ? 'REINTENTAR' : 'PROCESAR'}
                  </button>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default AdminMarcaDeAguaRetro;
