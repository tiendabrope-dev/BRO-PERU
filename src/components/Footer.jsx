function Footer({
  onCategoria,
  onPreguntas,
  onMiPedido,
  onContacto,
}) {
  return (
    <footer
      className="footer"
      id="contacto"
      style={{ padding: '50px 6%' }}
    >
      <div 
        className="footer-main"
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr 1.2fr',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto',
          alignItems: 'start',
          justifyContent: 'start',
          textAlign: 'left'
        }}
      >
        <div className="footer-brand" style={{ textAlign: 'left' }}>
          <div 
            className="brand footer-logo"
            style={{ fontSize: '38px', lineHeight: '1', marginBottom: '12px', textAlign: 'left' }}
          >
            BR<span>O</span>
          </div>

          <p style={{ fontSize: '15px', lineHeight: '1.5', color: '#aaa', textAlign: 'left' }}>
            Regalos para hombres.
            <br />
            Hecho en Perú.
          </p>

          <div style={{ marginTop: '14px', display: 'flex', gap: '10px', fontSize: '14px', color: '#999', justifyContent: 'flex-start' }}>
            <span 
              style={{ cursor: 'pointer', color: '#fff', fontWeight: '600' }}
              onClick={() => window.open('https://www.instagram.com/tiendabro.pe?igsh=MTRiNmliY3YyMmpjbw==', '_blank', 'noopener,noreferrer')}
            >
              Instagram
            </span>
            <span>·</span>
            <span 
              style={{ cursor: 'pointer', color: '#fff', fontWeight: '600' }}
              onClick={() => window.open('https://www.tiktok.com/@tiendabro.pe?_r=1&_t=ZS-98vGAPlOdmx', '_blank', 'noopener,noreferrer')}
            >
              TikTok
            </span>
            <span>·</span>
            <span 
              style={{ cursor: 'pointer', color: '#ccc' }}
              onClick={() => window.open('https://web.whatsapp.com/send?phone=51931330058&text=Hola%20BRO%20PERU', '_blank', 'noopener,noreferrer')}
            >
              WhatsApp
            </span>
          </div>
        </div>

        <div className="footer-column" style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '14px' }}>
            COMPRAR
          </h4>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() =>
              onCategoria('cuadro')
            }
          >
            Cuadros
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() =>
              onCategoria('case')
            }
          >
            Cases
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() =>
              onCategoria('polo')
            }
          >
            Polos
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() =>
              onCategoria('wallpaper')
            }
          >
            Wallpapers
          </button>
        </div>

        <div className="footer-column" style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '14px' }}>
            AYUDA Y LEGAL
          </h4>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={onPreguntas}
          >
            Preguntas frecuentes
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={onMiPedido}
          >
            Mi pedido
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={onContacto}
          >
            Contacto
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() => alert('Sección de Políticas de Privacidad')}
          >
            Políticas de Privacidad
          </button>

          <button
            type="button"
            style={{ fontSize: '15px', padding: '4px 0', display: 'block', textAlign: 'left', background: 'transparent', border: 'none', color: '#888', cursor: 'pointer' }}
            onClick={() => alert('Sección de Cambios y Devoluciones')}
          >
            Cambios y Devoluciones
          </button>
        </div>

        <div className="newsletter" style={{ textAlign: 'left' }}>
          <h4 style={{ fontSize: '14px', letterSpacing: '0.08em', marginBottom: '14px' }}>
            ÚNETE A BRO
          </h4>

          <p style={{ fontSize: '15px', lineHeight: '1.4', color: '#aaa', marginBottom: '12px' }}>
            Recibe nuevos diseños
            y promociones exclusivas.
          </p>

          <div className="newsletter-form" style={{ marginBottom: '12px', display: 'flex', alignItems: 'center' }}>
            <input
              type="email"
              placeholder="Tu correo"
              style={{ fontSize: '15px', width: '100%' }}
            />

            <button
              type="button"
              aria-label="Enviar correo"
            >
              →
            </button>
          </div>

          <div style={{ fontSize: '13px', color: '#ccc', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '12px', color: '#888' }}>Pagos seguros:</span>
            <strong style={{ fontSize: '13px', color: '#fff', letterSpacing: '0.04em' }}>
              YAPE · PLIN · EFECTIVO · PAGO CONTRAENTREGA
            </strong>
          </div>
        </div>
      </div>

      <div 
        className="footer-bottom"
        style={{ maxWidth: '1200px', margin: '30px auto 0', fontSize: '13px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <span>
          © 2026 BRO PERU · Todos los derechos reservados.
        </span>

        <span>
          Porque él se lo merece.
        </span>
      </div>
    </footer>
  );
}

export default Footer;