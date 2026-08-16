import { useState } from 'react';

function MiPedido() {
  const [consultaPedido, setConsultaPedido] = useState({
    nombre: '',
    dni: '',
    pedido: '',
  });

  const [errorConsulta, setErrorConsulta] = useState('');

  function actualizarConsulta(evento) {
    const { name, value } = evento.target;
    setConsultaPedido((actual) => ({
      ...actual,
      [name]: value,
    }));
    setErrorConsulta('');
  }

  function consultarPedido(evento) {
    evento.preventDefault();

    const nombre = consultaPedido.nombre.trim();
    const dni = consultaPedido.dni.trim();
    const pedido = consultaPedido.pedido.trim();

    if (!nombre) {
      setErrorConsulta('Ingresa tu nombre completo.');
      return;
    }

    if (!/^\d{8}$/.test(dni)) {
      setErrorConsulta('Ingresa un DNI válido de 8 dígitos.');
      return;
    }

    if (!pedido) {
      setErrorConsulta('Ingresa tu número de pedido.');
      return;
    }

    const mensaje =
      `Hola BRO PERU 👋\n\n` +
      `Quiero consultar el estado de mi pedido.\n\n` +
      `Nombre: ${nombre}\n` +
      `DNI: ${dni}\n` +
      `Número de pedido: ${pedido}\n\n` +
      `¿Me podrían ayudar con el estado de mi pedido?`;

    const url = `https://web.whatsapp.com/send?phone=51931330058&text=${encodeURIComponent(
      mensaje
    )}`;

    window.open(url, '_blank', 'noopener,noreferrer');
  }

  return (
    <main style={{
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#fbf9f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      {/* Botón Volver */}
      <button
        onClick={() => window.location.href = '/'}
        style={{
          position: 'absolute',
          top: '40px',
          left: '6vw',
          background: 'transparent',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: '#2d5a3d',
          fontWeight: '700',
          fontSize: '13px',
          cursor: 'pointer',
          letterSpacing: '0.1em',
          zIndex: 20,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        VOLVER
      </button>

      {/* Tarjeta central */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '620px',
        padding: '50px 60px',
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: '16px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.06)',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>
        {/* Ícono de caja superior */}
        <div style={{ width: '64px', height: '64px', margin: '0 auto 22px', background: '#eaf0ec', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
        </div>

        <h1 style={{ margin: '0 0 8px', fontFamily: 'Syne, sans-serif', fontSize: '32px', fontWeight: '800', letterSpacing: '-0.03em', color: '#2d5a3d', textTransform: 'uppercase' }}>
          RASTREA TU PEDIDO
        </h1>
        <p style={{ margin: '0 0 32px', fontFamily: 'DM Sans, sans-serif', fontSize: '15px', color: '#666666' }}>
          Consulta el estado de tu pedido BRO PERU.
        </p>

        <form onSubmit={consultarPedido} style={{ display: 'grid', gap: '22px', textAlign: 'left' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {/* Campo Nombre */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#111111' }}>NOMBRE COMPLETO</span>
              <div style={{ position: 'relative', width: '100%' }}>
                <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#2d5a3d', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <input
                  type="text"
                  name="nombre"
                  value={consultaPedido.nombre}
                  onChange={actualizarConsulta}
                  placeholder="Tu nombre"
                  style={{ width: '100%', height: '52px', padding: '0 16px 0 44px', border: '1px solid #cccccc', borderRadius: '6px', background: '#ffffff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Campo DNI */}
            <div style={{ display: 'grid', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#111111' }}>DNI</span>
              <div style={{ position: 'relative', width: '100%' }}>
                <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#2d5a3d', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="6" width="18" height="12" rx="2" />
                  <circle cx="8" cy="12" r="2" />
                  <line x1="13" y1="11" x2="19" y2="11" />
                  <line x1="13" y1="14" x2="19" y2="14" />
                </svg>
                <input
                  type="text"
                  name="dni"
                  maxLength={8}
                  inputMode="numeric"
                  value={consultaPedido.dni}
                  onChange={actualizarConsulta}
                  placeholder="Tu DNI"
                  style={{ width: '100%', height: '52px', padding: '0 16px 0 44px', border: '1px solid #cccccc', borderRadius: '6px', background: '#ffffff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>
          </div>

          {/* Campo Número de Pedido */}
          <div style={{ display: 'grid', gap: '8px' }}>
            <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: '700', letterSpacing: '0.12em', color: '#111111' }}>NÚMERO DE PEDIDO</span>
            <div style={{ position: 'relative', width: '100%' }}>
              <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '18px', height: '18px', color: '#2d5a3d', pointerEvents: 'none' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                <path d="M9 14h6"></path>
                <path d="M9 18h6"></path>
                <path d="M9 10h6"></path>
              </svg>
              <input
                type="text"
                name="pedido"
                value={consultaPedido.pedido}
                onChange={actualizarConsulta}
                placeholder="Número de pedido"
                style={{ width: '100%', height: '52px', padding: '0 16px 0 44px', border: '1px solid #cccccc', borderRadius: '6px', background: '#ffffff', fontFamily: 'DM Sans, sans-serif', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <span style={{ fontSize: '12px', color: '#888', marginTop: '2px', fontWeight: '400' }}>Ejemplo: BRO-2025-000123</span>
          </div>

          {errorConsulta && (
            <div style={{ padding: '13px 15px', borderRadius: '6px', background: '#fff1f1', color: '#b52525', fontFamily: 'DM Sans, sans-serif', fontSize: '13px', textAlign: 'center' }}>
              {errorConsulta}
            </div>
          )}

          {/* Botón Consultar */}
          <button
            type="submit"
            style={{
              width: '100%',
              height: '52px',
              marginTop: '4px',
              border: '0',
              borderRadius: '6px',
              background: '#2d5a3d',
              color: '#ffffff',
              cursor: 'pointer',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '0.13em',
              transition: 'background 0.2s ease, transform 0.2s ease'
            }}
          >
            CONSULTAR PEDIDO
          </button>

          {/* Footer con Camión */}
          <div style={{ position: 'relative', marginTop: '24px', textAlign: 'center' }}>
            <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '1px', background: '#eaeaea', zIndex: 0 }}></div>
            <span style={{ position: 'relative', display: 'inline-block', padding: '0 15px', background: '#fff', zIndex: 1 }}>
               <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d5a3d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                 <rect x="1" y="3" width="15" height="13"></rect>
                 <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                 <circle cx="5.5" cy="18.5" r="2.5"></circle>
                 <circle cx="18.5" cy="18.5" r="2.5"></circle>
               </svg>
            </span>
          </div>
          <p style={{ margin: '14px 0 0', fontSize: '13px', color: '#555', lineHeight: '1.6', textAlign: 'center', fontWeight: '500' }}>
            Realizamos envíos coordinados a todo el mundo.<br/>Tu pedido, nuestra prioridad.
          </p>

        </form>
      </div>
    </main>
  );
}

export default MiPedido;