import { useMemo } from 'react';

import './admin-calendario-pedidos.css';

const NOMBRES_MES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

const DIAS_SEMANA = [
  'L',
  'M',
  'M',
  'J',
  'V',
  'S',
  'D',
];

function contarPedidosPorDia(
  pedidos,
  anio,
  mes
) {
  const conteo = {};

  for (const pedido of pedidos) {
    if (!pedido.creado_en) {
      continue;
    }

    const fecha = new Date(
      pedido.creado_en
    );

    if (
      fecha.getFullYear() ===
        anio &&
      fecha.getMonth() ===
        mes
    ) {
      const dia =
        fecha.getDate();

      conteo[dia] =
        (conteo[dia] || 0) +
        1;
    }
  }

  return conteo;
}

function AdminCalendarioPedidos({
  pedidos,
  cargando,
}) {
  const hoy = useMemo(
    () => new Date(),
    []
  );

  const anio =
    hoy.getFullYear();

  const mes = hoy.getMonth();

  const diaHoy =
    hoy.getDate();

  const conteoPorDia =
    useMemo(
      () =>
        contarPedidosPorDia(
          pedidos || [],
          anio,
          mes
        ),
      [
        pedidos,
        anio,
        mes,
      ]
    );

  const primerDiaSemana =
    useMemo(() => {
      /*
        getDay() da 0 = domingo, 1 = lunes...
        Queremos que la semana empiece en lunes,
        así que convertimos domingo (0) a 6.
      */
      const diaJs = new Date(
        anio,
        mes,
        1
      ).getDay();

      return diaJs === 0
        ? 6
        : diaJs - 1;
    }, [
      anio,
      mes,
    ]);

    const diasEnMes =
    useMemo(
      () =>
        new Date(
          anio,
          mes + 1,
          0
        ).getDate(),
      [
        anio,
        mes,
      ]
    );

  const celdas = useMemo(() => {
    const lista = [];

    for (
      let i = 0;
      i < primerDiaSemana;
      i += 1
    ) {
      lista.push(null);
    }

    for (
      let dia = 1;
      dia <= diasEnMes;
      dia += 1
    ) {
      lista.push(dia);
    }

    return lista;
  }, [
    primerDiaSemana,
    diasEnMes,
  ]);

  const totalMes = useMemo(
    () =>
      Object.values(
        conteoPorDia
      ).reduce(
        (suma, valor) =>
          suma + valor,
        0
      ),
    [
      conteoPorDia,
    ]
  );

  return (
    <div className="admin-calendario">

      <div className="admin-calendario-heading">
        <strong>
          {
            NOMBRES_MES[
              mes
            ]
          }{' '}
          {anio}
        </strong>

        <span>
          {cargando
            ? 'Cargando...'
            : `${totalMes} pedido${totalMes === 1 ? '' : 's'} este mes`}
        </span>
      </div>

      <div className="admin-calendario-dias-semana">
        {DIAS_SEMANA.map(
          (dia, indice) => (
            <span
              key={
                dia + indice
              }
            >
              {dia}
            </span>
          )
        )}
      </div>

      <div className="admin-calendario-grid">
        {celdas.map(
          (dia, indice) => {
            if (dia === null) {
              return (
                <div
                  key={`vacio-${indice}`}
                  className="admin-calendario-celda admin-calendario-celda-vacia"
                />
              );
            }

            const cantidad =
              conteoPorDia[
                dia
              ] || 0;

            const esHoy =
              dia === diaHoy;

            return (
              <div
                key={dia}
                className={`admin-calendario-celda${esHoy ? ' admin-calendario-celda-hoy' : ''}`}
              >
                <span className="admin-calendario-numero">
                  {dia}
                </span>

                {cantidad > 0 && (
                  <span className="admin-calendario-badge">
                    {cantidad}
                  </span>
                )}
              </div>
            );
          }
        )}
      </div>

    </div>
  );
}

export default AdminCalendarioPedidos;
