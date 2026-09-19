import { useEffect, useMemo, useRef, useState } from 'react';

import { obtenerPedidosAdmin } from '../lib/adminPedidos';
import { MODULOS } from './AdminDashboard';

import './admin-command-palette.css';

const ACCIONES_ESTATICAS = [
  {
    id: 'accion-panel',
    tipo: 'accion',
    titulo: 'Panel principal',
    subtitulo: 'Volver al inicio del admin',
    destino: 'dashboard',
  },
  {
    id: 'accion-modulos',
    tipo: 'accion',
    titulo: 'Ver todos los módulos',
    subtitulo: 'Cuadrícula completa',
    destino: 'modulos',
  },
];

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/*
  Paleta de comandos (Ctrl/Cmd+K). El estado de abierto/cerrado
  lo controla AdminApp (para poder abrirla también desde el
  botón del header, no solo con el atajo de teclado). Este
  componente solo maneja su propio texto de búsqueda, el índice
  resaltado con las flechas, y la carga (una sola vez, la
  primera vez que se abre) de los pedidos recientes para poder
  buscarlos por número, código, nombre o DNI.
*/
function AdminCommandPalette({
  abierto,
  onCerrar,
  onAbrirModulo,
  onAbrirPedido,
  onCerrarSesion,
}) {
  const [consulta, setConsulta] = useState('');
  const [indiceActivo, setIndiceActivo] = useState(0);
  const [pedidos, setPedidos] = useState([]);
  const [pedidosCargados, setPedidosCargados] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!abierto) {
      return;
    }

    setConsulta('');
    setIndiceActivo(0);

    const foco = setTimeout(() => {
      inputRef.current?.focus();
    }, 10);

    if (!pedidosCargados) {
      obtenerPedidosAdmin()
        .then((datos) => {
          setPedidos(datos);
          setPedidosCargados(true);
        })
        .catch((error) => {
          console.error(
            'No se pudieron cargar los pedidos para la paleta de comandos:',
            error
          );
        });
    }

    return () => clearTimeout(foco);
  }, [abierto, pedidosCargados]);

  const itemsModulos = useMemo(
    () =>
      MODULOS.map((modulo) => ({
        id: `modulo-${modulo.id}`,
        tipo: 'modulo',
        titulo: modulo.titulo,
        subtitulo: modulo.descripcion,
        destino: modulo.id,
      })),
    []
  );

  const itemsAccion = useMemo(
    () => [
      ...ACCIONES_ESTATICAS,
      {
        id: 'accion-salir',
        tipo: 'accion',
        titulo: 'Cerrar sesión',
        subtitulo: 'Salir del panel admin',
      },
    ],
    []
  );

  const itemsPedidos = useMemo(() => {
    const texto = normalizar(consulta);

    if (texto.length < 2) {
      return [];
    }

    return pedidos
      .filter((pedido) => {
        const campos = [
          pedido.numero_pedido,
          pedido.codigo_pedido,
          pedido.nombre_completo,
          pedido.dni,
        ]
          .map(normalizar)
          .join(' ');

        return campos.includes(texto);
      })
      .slice(0, 6)
      .map((pedido) => ({
        id: `pedido-${pedido.id}`,
        tipo: 'pedido',
        titulo: pedido.nombre_completo || 'Pedido sin nombre',
        subtitulo: `#${
          pedido.numero_pedido || pedido.codigo_pedido || '—'
        } · ${pedido.estado_pedido || ''}`,
        pedidoId: pedido.id,
      }));
  }, [consulta, pedidos]);

  const resultados = useMemo(() => {
    const texto = normalizar(consulta);
    const base = [...itemsModulos, ...itemsAccion];

    const filtrados = !texto
      ? base
      : base.filter((item) =>
          normalizar(`${item.titulo} ${item.subtitulo || ''}`).includes(
            texto
          )
        );

    return [...itemsPedidos, ...filtrados];
  }, [consulta, itemsModulos, itemsAccion, itemsPedidos]);

  useEffect(() => {
    setIndiceActivo(0);
  }, [consulta]);

  function seleccionar(item) {
    if (!item) {
      return;
    }

    onCerrar();

    if (item.tipo === 'pedido') {
      onAbrirPedido(item.pedidoId);
      return;
    }

    if (item.id === 'accion-salir') {
      onCerrarSesion();
      return;
    }

    onAbrirModulo(item.destino);
  }

  function alPresionarTecla(evento) {
    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      setIndiceActivo((actual) =>
        Math.min(actual + 1, resultados.length - 1)
      );
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      setIndiceActivo((actual) => Math.max(actual - 1, 0));
    } else if (evento.key === 'Enter') {
      evento.preventDefault();
      seleccionar(resultados[indiceActivo]);
    } else if (evento.key === 'Escape') {
      evento.preventDefault();
      onCerrar();
    }
  }

  if (!abierto) {
    return null;
  }

  return (
    <div
      className="admin-cmdk-overlay"
      onClick={onCerrar}
    >
      <div
        className="admin-cmdk-caja"
        onClick={(evento) => evento.stopPropagation()}
      >
        <input
          ref={inputRef}
          type="text"
          className="admin-cmdk-input"
          placeholder="Busca un módulo, un pedido o una acción..."
          value={consulta}
          onChange={(evento) => setConsulta(evento.target.value)}
          onKeyDown={alPresionarTecla}
        />

        <div className="admin-cmdk-lista">
          {resultados.length === 0 ? (
            <div className="admin-cmdk-vacio">Sin resultados.</div>
          ) : (
            resultados.map((item, indice) => (
              <button
                key={item.id}
                type="button"
                className={`admin-cmdk-item${
                  indice === indiceActivo ? ' activo' : ''
                }`}
                onMouseEnter={() => setIndiceActivo(indice)}
                onClick={() => seleccionar(item)}
              >
                <span
                  className={`admin-cmdk-tipo admin-cmdk-tipo-${item.tipo}`}
                >
                  {item.tipo === 'pedido'
                    ? 'PEDIDO'
                    : item.tipo === 'accion'
                    ? 'ACCIÓN'
                    : 'MÓDULO'}
                </span>

                <span className="admin-cmdk-texto">
                  <strong>{item.titulo}</strong>
                  {item.subtitulo && <small>{item.subtitulo}</small>}
                </span>
              </button>
            ))
          )}
        </div>

        <div className="admin-cmdk-pie">
          <span>↑↓ navegar</span>
          <span>↵ abrir</span>
          <span>esc cerrar</span>
        </div>
      </div>
    </div>
  );
}

export default AdminCommandPalette;
