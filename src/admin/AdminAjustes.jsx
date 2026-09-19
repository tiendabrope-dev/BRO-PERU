const SUBMODULOS = [
  {
    id: 'ticker',
    icono: 'TX',
    titulo: 'Promociones',
    descripcion:
      'Modificar el roll promocional.',
  },
  {
    id: 'secciones',
    icono: 'SC',
    titulo: 'Secciones',
    descripcion:
      'Carruseles destacados del Home.',
  },
  {
    id: 'marcaDeAguaRetro',
    icono: '®',
    titulo: 'Marca de agua',
    descripcion:
      'Aplicar la marca de agua a imágenes ya subidas.',
  },
  {
    id: 'ajustesContacto',
    icono: '☎',
    titulo: 'Datos de contacto',
    descripcion:
      'WhatsApp de pedidos y datos de Yape/Plin.',
  },
];

function AdminAjustes({
  onAbrirModulo,
}) {
  return (
    <section className="admin-ajustes">

      <style>
        {`
          .admin-ajustes {
            width: 100%;
            max-width: 720px;
          }

          .admin-ajustes-head > span {
            display: block;
            margin-bottom: 6px;
            color: var(--bro-verde);
            font-size: 10px;
            font-weight: 900;
            letter-spacing: .14em;
          }

          .admin-ajustes-head h2 {
            margin: 0 0 7px;
            color: var(--bro-texto);
            font-size: 30px;
          }

          .admin-ajustes-head p {
            margin: 0 0 24px;
            color: var(--bro-texto-tenue);
            font-size: 13px;
            line-height: 1.5;
          }

          .admin-ajustes-sub-lista {
            display: flex;
            flex-direction: column;
            border: 1px solid var(--bro-borde-fuerte);
            border-radius: 9px;
            background: var(--bro-panel);
            overflow: hidden;
          }

          .admin-ajustes-sub-fila {
            padding: 16px;
            display: grid;
            grid-template-columns: 40px 1fr 18px;
            gap: 14px;
            align-items: center;
            border: 0;
            border-bottom: 1px solid var(--bro-borde-fuerte);
            background: var(--bro-panel);
            cursor: pointer;
            text-align: left;
            font: inherit;
            width: 100%;
          }

          .admin-ajustes-sub-lista .admin-ajustes-sub-fila:last-child {
            border-bottom: 0;
          }

          .admin-ajustes-sub-fila:hover {
            background: var(--bro-hover);
          }

          .admin-ajustes-sub-icon {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: var(--bro-verde-palido);
            color: var(--bro-verde-fuerte);
            font-size: 13px;
            font-weight: 900;
          }

          .admin-ajustes-sub-texto {
            min-width: 0;
          }

          .admin-ajustes-sub-texto strong {
            display: block;
            color: var(--bro-texto);
            font-size: 14px;
          }

          .admin-ajustes-sub-texto span {
            display: block;
            margin-top: 3px;
            color: var(--bro-texto-tenue);
            font-size: 12px;
            line-height: 1.4;
          }

          .admin-ajustes-sub-flecha {
            color: var(--bro-texto-tenue-2);
            font-size: 16px;
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
          Selecciona una sección para administrarla.
        </p>
      </div>

      <div className="admin-ajustes-sub-lista">
        {SUBMODULOS.map((sub) => (
          <button
            key={sub.id}
            type="button"
            className="admin-ajustes-sub-fila"
            onClick={() =>
              onAbrirModulo?.(sub.id)
            }
          >
            <div className="admin-ajustes-sub-icon">
              {sub.icono}
            </div>

            <div className="admin-ajustes-sub-texto">
              <strong>{sub.titulo}</strong>
              <span>{sub.descripcion}</span>
            </div>

            <span className="admin-ajustes-sub-flecha">
              ›
            </span>
          </button>
        ))}
      </div>

    </section>
  );
}

export default AdminAjustes;
