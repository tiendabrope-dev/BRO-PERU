import {
  useMemo,
  useState,
} from 'react';

import './admin-estadisticas-ventas.css';

const OPCIONES_PERIODO = [
  {
    id: 'dia',
    etiqueta: 'Por día',
    cantidadBuckets: 14,
  },
  {
    id: 'semana',
    etiqueta: 'Por semana',
    cantidadBuckets: 8,
  },
  {
    id: 'mes',
    etiqueta: 'Por mes',
    cantidadBuckets: 6,
  },
];

const NOMBRES_MES_CORTO = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
];

function inicioDeSemana(
  fecha
) {
  const copia = new Date(
    fecha
  );

  const diaJs =
    copia.getDay();

  const diferencia =
    diaJs === 0
      ? -6
      : 1 - diaJs;

  copia.setDate(
    copia.getDate() +
      diferencia
  );

  copia.setHours(
    0,
    0,
    0,
    0
  );

  return copia;
}

function formatearSoles(
  valor
) {
  return (
    'S/ ' +
    Math.round(
      valor
    ).toLocaleString(
      'es-PE'
    )
  );
}

function pedidoCuentaComoIngreso(
  pedido
) {
  return (
    pedido.estado_pago ===
      'pagado' &&
    pedido.estado_pedido !==
      'cancelado'
  );
}

function agruparPorDia(
  pedidos,
  cantidadDias
) {
  const hoy = new Date();

  hoy.setHours(
    0,
    0,
    0,
    0
  );

  const buckets = [];

  for (
    let i =
      cantidadDias - 1;
    i >= 0;
    i -= 1
  ) {
    const fecha = new Date(
      hoy
    );

    fecha.setDate(
      fecha.getDate() - i
    );

    buckets.push({
      clave:
        fecha.toDateString(),
      etiqueta:
        String(
          fecha.getDate()
        ).padStart(
          2,
          '0'
        ) +
        '/' +
        String(
          fecha.getMonth() +
            1
        ).padStart(
          2,
          '0'
        ),
      valor: 0,
    });
  }

  const indicePorClave =
    new Map(
      buckets.map(
        (b, i) => [
          b.clave,
          i,
        ]
      )
    );

  for (const pedido of pedidos) {
    if (
      !pedido.creado_en ||
      !pedidoCuentaComoIngreso(
        pedido
      )
    ) {
      continue;
    }

    const fecha = new Date(
      pedido.creado_en
    );

    const clave =
      fecha.toDateString();

    const indice =
      indicePorClave.get(
        clave
      );

    if (indice !== undefined) {
      buckets[
        indice
      ].valor +=
        Number(
          pedido.total
        ) || 0;
    }
  }

  return buckets;
}

function agruparPorSemana(
  pedidos,
  cantidadSemanas
) {
  const inicioActual =
    inicioDeSemana(
      new Date()
    );

  const buckets = [];

  for (
    let i =
      cantidadSemanas - 1;
    i >= 0;
    i -= 1
  ) {
    const inicio = new Date(
      inicioActual
    );

    inicio.setDate(
      inicio.getDate() -
        i * 7
    );

    buckets.push({
      clave:
        inicio.toDateString(),
      etiqueta:
        String(
          inicio.getDate()
        ).padStart(
          2,
          '0'
        ) +
        '/' +
        String(
          inicio.getMonth() +
            1
        ).padStart(
          2,
          '0'
        ),
      valor: 0,
    });
  }

  const indicePorClave =
    new Map(
      buckets.map(
        (b, i) => [
          b.clave,
          i,
        ]
      )
    );

  for (const pedido of pedidos) {
    if (
      !pedido.creado_en ||
      !pedidoCuentaComoIngreso(
        pedido
      )
    ) {
      continue;
    }

    const inicioSemanaPedido =
      inicioDeSemana(
        new Date(
          pedido.creado_en
        )
      );

    const clave =
      inicioSemanaPedido.toDateString();

    const indice =
      indicePorClave.get(
        clave
      );

    if (indice !== undefined) {
      buckets[
        indice
      ].valor +=
        Number(
          pedido.total
        ) || 0;
    }
  }

  return buckets;
}

function agruparPorMes(
  pedidos,
  cantidadMeses
) {
  const hoy = new Date();

  const buckets = [];

  for (
    let i =
      cantidadMeses - 1;
    i >= 0;
    i -= 1
  ) {
    const fecha = new Date(
      hoy.getFullYear(),
      hoy.getMonth() - i,
      1
    );

    buckets.push({
      clave:
        fecha.getFullYear() +
        '-' +
        fecha.getMonth(),
      etiqueta:
        NOMBRES_MES_CORTO[
          fecha.getMonth()
        ],
      valor: 0,
    });
  }

  const indicePorClave =
    new Map(
      buckets.map(
        (b, i) => [
          b.clave,
          i,
        ]
      )
    );

  for (const pedido of pedidos) {
    if (
      !pedido.creado_en ||
      !pedidoCuentaComoIngreso(
        pedido
      )
    ) {
      continue;
    }

    const fecha = new Date(
      pedido.creado_en
    );

    const clave =
      fecha.getFullYear() +
      '-' +
      fecha.getMonth();

    const indice =
      indicePorClave.get(
        clave
      );

    if (indice !== undefined) {
      buckets[
        indice
      ].valor +=
        Number(
          pedido.total
        ) || 0;
    }
  }

  return buckets;
}

function agrupar(
  pedidos,
  periodo,
  cantidadBuckets
) {
  if (periodo === 'semana') {
    return agruparPorSemana(
      pedidos,
      cantidadBuckets
    );
  }

  if (periodo === 'mes') {
    return agruparPorMes(
      pedidos,
      cantidadBuckets
    );
  }

  return agruparPorDia(
    pedidos,
    cantidadBuckets
  );
}

function AdminEstadisticasVentas({
  pedidos,
  cargando,
}) {
  const [
    periodo,
    setPeriodo,
  ] = useState('dia');

  const opcionActual =
    OPCIONES_PERIODO.find(
      (o) =>
        o.id === periodo
    ) ||
    OPCIONES_PERIODO[0];

  const buckets = useMemo(
    () =>
      agrupar(
        pedidos || [],
        periodo,
        opcionActual.cantidadBuckets
      ),
    [
      pedidos,
      periodo,
      opcionActual.cantidadBuckets,
    ]
  );

  const valorMaximo = useMemo(
    () =>
      Math.max(
        1,
        ...buckets.map(
          (b) => b.valor
        )
      ),
    [
      buckets,
    ]
  );

  const totalPeriodo = useMemo(
    () =>
      buckets.reduce(
        (suma, b) =>
          suma + b.valor,
        0
      ),
    [
      buckets,
    ]
  );

  return (
    <div className="admin-estadisticas-ventas">

      <div className="admin-estadisticas-heading">
        <div>
          <strong>
            Ingresos
          </strong>

          <span>
            {cargando
              ? 'Cargando...'
              : formatearSoles(
                  totalPeriodo
                )}
          </span>
        </div>

        <div className="admin-estadisticas-selector">
          {OPCIONES_PERIODO.map(
            (opcion) => (
              <button
                key={
                  opcion.id
                }
                type="button"
                className={
                  opcion.id ===
                  periodo
                    ? 'activo'
                    : ''
                }
                onClick={() =>
                  setPeriodo(
                    opcion.id
                  )
                }
              >
                {
                  opcion.etiqueta
                }
              </button>
            )
          )}
        </div>
      </div>

      <div className="admin-estadisticas-grafico">
        {buckets.map(
          (bucket) => {
            const alturaPorcentaje =
              Math.max(
                3,
                (bucket.valor /
                  valorMaximo) *
                  100
              );

            return (
              <div
                key={
                  bucket.clave
                }
                className="admin-estadisticas-barra-columna"
              >
                <div className="admin-estadisticas-barra-riel">
                  <div
                    className="admin-estadisticas-barra"
                    style={{
                      height: `${alturaPorcentaje}%`,
                    }}
                    title={formatearSoles(
                      bucket.valor
                    )}
                  />
                </div>

                <span>
                  {
                    bucket.etiqueta
                  }
                </span>
              </div>
            );
          }
        )}
      </div>

    </div>
  );
}

export default AdminEstadisticasVentas;
