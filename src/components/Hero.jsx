import React from 'react';
import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  return (
    <section className="bro-hero" style={{ padding: '180px 20px 60px', textAlign: 'center' }}>
      
      <style>
        {`
          /* Efecto hover para las 3 imágenes principales del Hero */
          .hero-image-hover {
            transition: transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), filter 0.4s ease;
            cursor: pointer;
          }
          .hero-image-hover:hover {
            transform: translateY(-12px) scale(1.02);
            filter: drop-shadow(0 20px 25px rgba(0,0,0,0.25));
          }
        `}
      </style>

      <div className="bro-hero-copy" style={{ marginBottom: '50px' }}>
        <p style={{ 
          fontSize: '14px', 
          fontWeight: '700', 
          letterSpacing: '0.3em', 
          color: '#555', 
          marginBottom: '10px',
          fontFamily: 'DM Sans, sans-serif'
        }}>
          TU IDEA
        </p>
        
        {/* Título principal con fuente fuerte, moderna y espaciado elegante */}
        <h1 style={{ 
          fontSize: 'clamp(32px, 5vw, 52px)', 
          fontWeight: '800', 
          margin: '0', 
          color: '#111',
          fontFamily: 'Syne, sans-serif',
          letterSpacing: '-0.03em',
          textTransform: 'uppercase'
        }}>
          NUESTRA CREACIÓN
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', flexWrap: 'wrap', maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Case */}
        <div style={{ width: '200px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Cuadro (El más grande, al centro) */}
        <div style={{ width: '300px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Polo */}
        <div style={{ width: '250px', display: 'flex', justifyContent: 'center' }}>
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