import React, { useState } from 'react';
import heroCuadro from '../assets/hero/hero-cuadro.png'; // Asegúrate de que apunte bien a tu imagen

function Producto() {
  const [size, setSize] = useState('A4');
  const [frame, setFrame] = useState('Sin marco');
  const [wallpaper, setWallpaper] = useState(null);
  const [quantity, setQuantity] = useState(1);

  // Lógica de bloqueo mutuo
  const handleSizeSelect = (selectedSize) => {
    setSize(selectedSize);
    setWallpaper(null); 
    if (!frame) setFrame('Sin marco');
  };

  const handleFrameSelect = (selectedFrame) => {
    setFrame(selectedFrame);
    setWallpaper(null); 
    if (!size) setSize('A4');
  };

  const handleWallpaperSelect = (selectedWallpaper) => {
    setWallpaper(selectedWallpaper);
    setSize(null);  
    setFrame(null); 
  };

  const handleQuantity = (type) => {
    if (type === 'minus' && quantity > 1) {
      setQuantity(quantity - 1);
    } else if (type === 'plus') {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="bro-product-page" style={{ maxWidth: '1250px', margin: '40px auto', padding: '0 20px', display: 'flex', gap: '50px', flexWrap: 'wrap', fontFamily: "'DM Sans', sans-serif" }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@500;600;700&display=swap');

          .bro-btn-option {
            padding: 10px 22px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'DM Sans', sans-serif;
            border: 1px solid #d1d1d1;
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.2s ease;
            background-color: #ffffff;
            color: #111111;
          }

          .bro-btn-option.active {
            background-color: #111111;
            color: #ffffff;
            border-color: #111111;
          }

          .bro-section-label {
            display: block;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.08em;
            margin-bottom: 10px;
            color: #111;
            text-transform: uppercase;
          }
        `}
      </style>

      {/* --- COLUMNA IZQUIERDA: IMAGEN DEL CUADRO --- */}
      <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ width: '100%', border: '2px solid #111', backgroundColor: '#fcfcfc', padding: '30px', display: 'flex', justifyContent: 'center' }}>
          <img 
            src={heroCuadro} 
            alt="Cuadro Personalizado Porsche" 
            style={{ width: '100%', maxWidth: '450px', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>

      {/* --- COLUMNA DERECHA: DETALLES Y OPCIONES --- */}
      <div style={{ flex: '1 1 450px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{ 
            backgroundColor: '#111', color: '#fff', padding: '5px 14px', borderRadius: '20px', 
            fontSize: '11px', fontWeight: '700', letterSpacing: '0.05em' 
          }}>
            PERSONALIZABLE
          </span>
          <p style={{ color: '#4a7a5e', fontWeight: '700', fontSize: '13px', letterSpacing: '0.1em', marginTop: '15px' }}>
            CUADROS
          </p>
        </div>

        <h1 style={{ 
          fontFamily: "'Syne', sans-serif", fontSize: '42px', fontWeight: '800', 
          lineHeight: '1.1', textTransform: 'uppercase', margin: '0 0 10px 0', color: '#111' 
        }}>
          CUADRO<br/>PERSONALIZADO
        </h1>

        <div style={{ color: '#b5b5b5', fontSize: '16px', marginBottom: '10px' }}>
          ☆☆☆☆☆ <span style={{ fontSize: '13px', color: '#888' }}>(0)</span>
        </div>

        <p style={{ fontSize: '26px', fontWeight: '700', margin: '0 0 20px 0', color: '#111' }}>
          S/ 30.00
        </p>

        <div style={{ 
          backgroundColor: '#e54b4b', color: '#fff', padding: '16px 20px', borderRadius: '6px', 
          textAlign: 'center', fontWeight: '700', fontSize: '13px', lineHeight: '1.4', marginBottom: '30px' 
        }}>
          DISEÑO PERSONALIZADO: TRAS EL PEDIDO NOS<br/>CONTACTAREMOS PARA PEDIRTE LA FOTO DE TU AUTO.
        </div>

        {/* --- OPCIONES --- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* TAMAÑO */}
          <div>
            <label className="bro-section-label">TAMAÑO:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['A4', 'A3', 'A2'].map((t) => (
                <button 
                  key={t} type="button" 
                  className={`bro-btn-option ${size === t ? 'active' : ''}`}
                  onClick={() => handleSizeSelect(t)}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* MARCO */}
          <div>
            <label className="bro-section-label">MARCO:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Sin marco', 'Con marco'].map((m) => (
                <button 
                  key={m} type="button" 
                  className={`bro-btn-option ${frame === m ? 'active' : ''}`}
                  onClick={() => handleFrameSelect(m)}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* WALLPAPER */}
          <div>
            <label className="bro-section-label">WALLPAPER:</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Celular', 'Laptop'].map((w) => (
                <button 
                  key={w} type="button" 
                  className={`bro-btn-option ${wallpaper === w ? 'active' : ''}`}
                  onClick={() => handleWallpaperSelect(w)}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* CANTIDAD */}
          <div>
            <label className="bro-section-label">CANTIDAD:</label>
            <div style={{ 
              display: 'flex', alignItems: 'center', border: '1px solid #d1d1d1', 
              borderRadius: '6px', width: 'fit-content', overflow: 'hidden' 
            }}>
              <button onClick={() => handleQuantity('minus')} style={{ border: 'none', background: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>-</button>
              <span style={{ padding: '10px 12px', fontWeight: '600', minWidth: '30px', textAlign: 'center' }}>{quantity}</span>
              <button onClick={() => handleQuantity('plus')} style={{ border: 'none', background: 'none', padding: '10px 16px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}>+</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Producto;