import React, { useState, useEffect } from 'react';
import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  const totalSegments = 16;
  const [currentStep, setCurrentStep] = useState(0);
  const [isFilling, setIsFilling] = useState(true);

  // Lógica interactiva de carga y descarga en bucle
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prevStep) => {
        if (isFilling) {
          if (prevStep + 1 > totalSegments) {
            setTimeout(() => setIsFilling(false), 800);
            return totalSegments;
          }
          return prevStep + 1;
        } else {
          if (prevStep - 1 < 0) {
            setIsFilling(true);
            return 0;
          }
          return prevStep - 1;
        }
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isFilling]);

  const percent = Math.round((currentStep / totalSegments) * 100);
  const statusText = percent === 100 ? "READY!" : (isFilling ? "Loading..." : "Resetting...");

  return (
    <section className="bro-hero" style={{ padding: '220px 20px 60px', textAlign: 'center' }}>
      
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

          /* --- BARRA SEGMENTADA INTERACTIVA --- */
          .pixel-loader-container {
            max-width: 340px;
            margin: 60px auto 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
          }

          .pixel-loader-title {
            font-family: 'DM Sans', sans-serif;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            color: #111;
          }

          .pixel-bar-box {
            width: 100%;
            height: 24px;
            background: #ffffff;
            border: 2px solid #111111;
            border-radius: 4px;
            padding: 3px;
            box-sizing: border-box;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          .pixel-segments {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(16, 1fr);
            gap: 2px;
          }

          .pixel-segments .seg {
            background: transparent;
            border-radius: 1px;
            transition: background 0.08s ease;
          }

          .pixel-segments .seg.active {
            background: #111111;
          }
        `}
      </style>

      {/* Títulos */}
      <div className="bro-hero-copy" style={{ marginBottom: '50px' }}>
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

      {/* Contenedor de las 3 imágenes (Case, Cuadro, Polo) */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '50px', flexWrap: 'wrap', maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Case */}
        <div style={{ width: '240px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Cuadro */}
        <div style={{ width: '350px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Polo */}
        <div style={{ width: '290px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroPolo}
            alt="Polo BRO"
            className="hero-image-hover"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

      </div>

      {/* Barra segmentada interactiva ubicada debajo de los productos */}
      <div className="pixel-loader-container">
        <span className="pixel-loader-title">{statusText} {percent}%</span>
        <div className="pixel-bar-box">
          <div className="pixel-segments">
            {Array.from({ length: totalSegments }).map((_, index) => (
              <div 
                key={index} 
                className={`seg ${index < currentStep ? 'active' : ''}`} 
              />
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;