import React, {
  useEffect,
  useState,
} from 'react';

import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero({
  onVerTodosCuadros,
}) {
  const totalSegments = 12;

  const [
    currentStepCase,
    setCurrentStepCase,
  ] = useState(0);

  const [
    isFillingCase,
    setIsFillingCase,
  ] = useState(true);

  const [
    currentStepPolo,
    setCurrentStepPolo,
  ] = useState(0);

  const [
    isFillingPolo,
    setIsFillingPolo,
  ] = useState(true);

  // Lógica independiente para la barra del Case
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepCase((prev) => {
        if (isFillingCase) {
          if (prev + 1 > totalSegments) {
            setTimeout(
              () => setIsFillingCase(false),
              800
            );

            return totalSegments;
          }

          return prev + 1;
        }

        if (prev - 1 < 0) {
          setIsFillingCase(true);
          return 0;
        }

        return prev - 1;
      });
    }, 140);

    return () => clearInterval(interval);
  }, [isFillingCase]);

  // Lógica independiente para la barra del Polo
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepPolo((prev) => {
        if (isFillingPolo) {
          if (prev + 1 > totalSegments) {
            setTimeout(
              () => setIsFillingPolo(false),
              800
            );

            return totalSegments;
          }

          return prev + 1;
        }

        if (prev - 1 < 0) {
          setIsFillingPolo(true);
          return 0;
        }

        return prev - 1;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isFillingPolo]);

  function abrirCuadrosConTeclado(
    evento
  ) {
    if (
      evento.key === 'Enter' ||
      evento.key === ' '
    ) {
      evento.preventDefault();

      onVerTodosCuadros?.();
    }
  }

  return (
    <section
      className="bro-hero"
      style={{
        padding: '190px 20px 60px',
        textAlign: 'center',
      }}
    >
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@600;700&display=swap');

          .hero-image-hover {
            transition:
              transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1),
              filter 0.4s ease;

            cursor: pointer;
          }

          .hero-image-hover:hover {
            transform:
              translateY(-10px)
              scale(1.02);

            filter:
              drop-shadow(
                0 18px 22px
                rgba(0, 0, 0, 0.22)
              );
          }

          /* ==========================
             MINI BARRAS
             PRÓXIMAMENTE
          ========================== */

          .pixel-loader-small {
            width: 156px;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 7px;
          }

          .pixel-loader-label {
            font-family:
              'DM Sans',
              sans-serif;

            font-size: 10px;
            font-weight: 700;
            letter-spacing: 0.17em;
            text-transform: uppercase;
            color: #555;
            line-height: 1;
          }

          .pixel-bar-box-small {
            width: 100%;
            height: 14px;
            background: #ffffff;
            border: 1.5px solid #111111;
            border-radius: 3px;
            padding: 2px;
            box-sizing: border-box;
          }

          .pixel-segments-small {
            width: 100%;
            height: 100%;
            display: grid;
            grid-template-columns: repeat(12, 1fr);
            gap: 1.3px;
          }

          .pixel-segments-small .seg {
            background: transparent;
            border-radius: 1px;
            transition: background 0.08s ease;
          }

          .pixel-segments-small .seg.active {
            background: #111111;
          }

          /* ==========================
             RESPONSIVE
          ========================== */

          @media (max-width: 900px) {
            .bro-hero-products {
              gap: 28px !important;
            }
          }

          @media (max-width: 700px) {
            .bro-hero {
              padding-top: 190px !important;
            }

            .bro-hero-item-side {
              width: 260px !important;
            }

            .bro-hero-item-center {
              width: 290px !important;
            }

            .bro-hero-side-image {
              height: 275px !important;
            }

            .bro-hero-center-image {
              height: 325px !important;
            }
          }
        `}
      </style>

      {/* TÍTULOS */}
      <div
        className="bro-hero-copy"
        style={{
          marginBottom: '50px',
        }}
      >
        <p
          style={{
            fontSize: '14px',
            fontWeight: '700',
            letterSpacing: '0.3em',
            color: '#555',
            marginBottom: '10px',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          TU IDEA
        </p>

        <h1
          style={{
            fontSize: 'clamp(32px, 5vw, 54px)',
            fontWeight: '800',
            margin: '0',
            color: '#111',
            fontFamily: "'Syne', sans-serif",
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
          }}
        >
          NUESTRA CREACIÓN
        </h1>
      </div>

      {/* CONTENEDOR PRINCIPAL */}
      <div
        className="bro-hero-products"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          gap: '40px',
          flexWrap: 'wrap',
          maxWidth: '1250px',
          margin: '0 auto',
        }}
      >
        {/* CASE */}
        <div
          className="bro-hero-item-side"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '320px',
          }}
        >
          <img
            src={heroCase}
            alt="Case BRO"
            className="hero-image-hover bro-hero-side-image"
            style={{
              height: '310px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '26px',
            }}
          />

          <div className="pixel-loader-small">
            <span className="pixel-loader-label">
              Próximamente
            </span>

            <div className="pixel-bar-box-small">
              <div className="pixel-segments-small">
                {Array.from({
                  length: totalSegments,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`seg ${
                      index < currentStepCase
                        ? 'active'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CUADRO CENTRAL */}
        <div
          className="bro-hero-item-center"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '360px',
          }}
        >
          <img
            src={heroCuadro}
            alt="Ver todos los cuadros BRO"
            className="hero-image-hover bro-hero-center-image"
            role="button"
            tabIndex={0}
            onClick={
              onVerTodosCuadros
            }
            onKeyDown={
              abrirCuadrosConTeclado
            }
            style={{
              height: '365px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </div>

        {/* POLO */}
        <div
          className="bro-hero-item-side"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '320px',
          }}
        >
          <img
            src={heroPolo}
            alt="Polo BRO"
            className="hero-image-hover bro-hero-side-image"
            style={{
              height: '310px',
              width: 'auto',
              objectFit: 'contain',
              marginBottom: '26px',
            }}
          />

          <div className="pixel-loader-small">
            <span className="pixel-loader-label">
              Próximamente
            </span>

            <div className="pixel-bar-box-small">
              <div className="pixel-segments-small">
                {Array.from({
                  length: totalSegments,
                }).map((_, index) => (
                  <div
                    key={index}
                    className={`seg ${
                      index < currentStepPolo
                        ? 'active'
                        : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
