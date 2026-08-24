import React from 'react';
import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  return (
    <section className="bro-hero" style={{ padding: '220px 20px 80px', textAlign: 'center' }}>
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@600;700&display=swap');

          .hero-image-hover {
            transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.4s ease;
            cursor: pointer;
          }
          .hero-image-hover:hover {
            transform: translateY(-12px) scale(1.02);
            filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25));
          }

          .bro-product-card:hover {
            transform: translateY(-8px) !important;
          }
          .bro-product-card:hover .bro-product-image {
            box-shadow: 0 15px 35px rgba(0,0,0,0.18) !important;
          }
        `}
      </style>

      {/* Título separado con un margen inferior más generoso (70px) */}
      <div className="bro-hero-copy" style={{ marginBottom: '70px' }}>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          letterSpacing: '0.3em', 
          color: '#555', 
          marginBottom: '10px',
          fontFamily: "'DM Sans', sans-serif"
        }}>
          TU IDEA
        </p>
        
        <h1 style={{ 
          fontSize: 'clamp(32px, 5vw, 54px)', 
          fontWeight: '800', 
          margin: '0', 
          color: '#111',
          fontFamily: "'Syne', sans-serif",
          letterSpacing: '-0.03em',
          textTransform: 'uppercase'
        }}>
          NUESTRA CREACIÓN
        </h1>
      </div>

      {/* Contenedores con tamaños aumentados para darles mayor presencia */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Case (Aumentado) */}
        <div style={{ width: '240px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Cuadro (El principal, más grande al centro) */}
        <div style={{ width: '350px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Polo (Aumentado) */}
        <div style={{ width: '290px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroPolo}
            alt="Polo BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;