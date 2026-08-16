import React, { useState } from 'react';
import '../styles/producto.css';

export default function Producto({ producto, onVolver, onAgregarAlCarrito }) {
  const [tamano, setTamano] = useState('A3');
  const [marco, setMarco] = useState('Sin marco');
  const [cantidad, setCantidad] = useState(1);

  if (!producto) return null;

  // Lógica temporal de precios (cualquier tamaño sin marco = S/15, con marco = S/30)
  const precioUnitario = marco === 'Con marco' ? 30 : 15;
  const precioTotal = precioUnitario * cantidad;

  const esPersonalizado = producto.slug === 'cuadro-personalizado';

  const handleAgregar = () => {
    // Generar variante de texto y id único para el carrito
    const varianteTexto = `${tamano} · ${marco}`;
    const idCarrito = `${producto.id}-${tamano}-${marco}`;
    
    // Usamos exactamente el prop que envía App.jsx
    onAgregarAlCarrito({
      ...producto,
      idCarrito,
      varianteTexto,
      precio: precioUnitario,
      cantidad
    });
  };

  return (
    <div className="producto-page">
      {/* Usamos directamente onVolver desde App.jsx */}
      <button className="producto-volver" onClick={onVolver}>
        ← Volver
      </button>

      <div className="producto-container">
        {/* Columna Izquierda: Imagen */}
        <div className="producto-galeria">
          <div className="producto-imagen-principal">
            <img src={producto.imagen} alt={producto.nombre} />
          </div>
        </div>

        {/* Columna Derecha: Información */}
        <div className="producto-info">
          {producto.badge && <div className="producto-badge">{producto.badge}</div>}
          <div className="producto-categoria">{producto.categoria || 'Cuadros'}</div>
          
          <h1 className="producto-nombre">{producto.nombre}</h1>
          <div className="producto-rating">☆☆☆☆☆ (0)</div>
          
          <div className="producto-precio">S/ {precioUnitario}.00</div>

          {esPersonalizado && (
            <div className="nota-personalizada">
              DISEÑO PERSONALIZADO: Tras el pedido nos contactaremos para pedirte la foto de tu auto.
            </div>
          )}

          <div className="producto-opciones">
            <div className="opcion-grupo">
              <label>Tamaño:</label>
              <div className="selector-botones">
                {['A4', 'A3', 'A2'].map((t) => (
                  <button 
                    key={t}
                    className={`btn-selector ${tamano === t ? 'activo' : ''}`}
                    onClick={() => setTamano(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="opcion-grupo">
              <label>Marco:</label>
              <div className="selector-botones">
                {['Sin marco', 'Con marco'].map((m) => (
                  <button 
                    key={m}
                    className={`btn-selector ${marco === m ? 'activo' : ''}`}
                    onClick={() => setMarco(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="opcion-grupo">
              <label>Cantidad:</label>
              <div className="selector-cantidad">
                <button onClick={() => setCantidad(Math.max(1, cantidad - 1))}>-</button>
                <span>{cantidad}</span>
                <button onClick={() => setCantidad(cantidad + 1)}>+</button>
              </div>
            </div>
          </div>

          <button className="btn-agregar-carrito" onClick={handleAgregar}>
            AGREGAR AL CARRITO • S/ {precioTotal}.00
          </button>
        </div>
      </div>
    </div>
  );
}