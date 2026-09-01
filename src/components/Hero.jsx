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

  /* =========================
     BARRA CASE
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepCase((prev) => {
        if (isFillingCase) {
          if (
            prev + 1 >
            totalSegments
          ) {
            setTimeout(() => {
              setIsFillingCase(false);
            }, 800);

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

    return () => {
      clearInterval(interval);
    };
  }, [
    isFillingCase,
  ]);

  /* =========================
     BARRA POLO
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepPolo((prev) => {
        if (isFillingPolo) {
          if (
            prev + 1 >
            totalSegments
          ) {
            setTimeout(() => {
              setIsFillingPolo(false);
            }, 800);

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

    return () => {
      clearInterval(interval);
    };
  }, [
    isFillingPolo,
  ]);

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

  function PixelLoader({
    currentStep,
  }) {
    return (
      <div className="pixel-loader-small">
        <span className="pixel-loader-label">
          PRÓXIMAMENTE
        </span>

        <div className="pixel-bar-box-small">
          <div className="pixel-segments-small">
            {Array.from({
              length: totalSegments,
            }).map(
              (_, index) => (
                <div
                  key={index}
                  className={`seg ${
                    index <
                    currentStep
                      ? 'active'
                      : ''
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="bro-hero">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@600;700&display=swap');

          /* =====================================================
             HERO DESKTOP
          ===================================================== */

          .bro-hero {
            padding:
              190px 20px
              60px;

            box-sizing:
              border-box;

            text-align:
              center;

            background:
              #F4F1EC;
          }

          /* =====================================================
             TÍTULO DESKTOP
          ===================================================== */

          .bro-hero-copy {
            margin-bottom:
              50px;

            text-align:
              center;
          }

          .bro-hero-copy > p {
            margin:
              0 0 10px;

            color:
              #555555;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              14px;

            font-weight:
              700;

            letter-spacing:
              0.3em;
          }

          .bro-hero-copy > h1 {
            margin:
              0;

            color:
              #111111;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              clamp(
                32px,
                5vw,
                54px
              );

            font-weight:
              800;

            line-height:
              0.95;

            letter-spacing:
              -0.03em;

            text-align:
              center;

            text-transform:
              uppercase;
          }

          /* =====================================================
             PRODUCTOS DESKTOP
          ===================================================== */

          .bro-hero-products {
            width:
              100%;

            max-width:
              1250px;

            margin:
              0 auto;

            display:
              flex;

            align-items:
              flex-end;

            justify-content:
              center;

            gap:
              40px;

            flex-wrap:
              wrap;
          }

          .bro-hero-item-side {
            width:
              320px;

            display:
              flex;

            flex-direction:
              column;

            align-items:
              center;
          }

          .bro-hero-item-center {
            width:
              360px;

            display:
              flex;

            flex-direction:
              column;

            align-items:
              center;
          }

          .bro-hero-side-image {
            width:
              auto;

            height:
              310px;

            margin:
              0 0 26px;

            object-fit:
              contain;
          }

          .bro-hero-center-image {
            width:
              auto;

            height:
              365px;

            margin:
              0;

            object-fit:
              contain;
          }

          /* =====================================================
             HOVER
          ===================================================== */

          .hero-image-hover {
            transition:
              transform
                0.4s
                cubic-bezier(
                  0.165,
                  0.84,
                  0.44,
                  1
                ),
              filter
                0.4s
                ease;
          }

          .bro-hero-center-image {
            cursor:
              pointer;
          }

          @media (hover: hover) {
            .hero-image-hover:hover {
              transform:
                translateY(
                  -10px
                )
                scale(
                  1.02
                );

              filter:
                drop-shadow(
                  0 18px
                  22px
                  rgba(
                    0,
                    0,
                    0,
                    0.22
                  )
                );
            }
          }

          /* =====================================================
             PRÓXIMAMENTE DESKTOP
          ===================================================== */

          .pixel-loader-small {
            width:
              156px;

            display:
              flex;

            flex-direction:
              column;

            align-items:
              center;

            gap:
              7px;
          }

          .pixel-loader-label {
            color:
              #555555;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              10px;

            font-weight:
              700;

            line-height:
              1;

            letter-spacing:
              0.17em;

            text-transform:
              uppercase;

            white-space:
              nowrap;
          }

          .pixel-bar-box-small {
            width:
              100%;

            height:
              14px;

            padding:
              2px;

            box-sizing:
              border-box;

            background:
              #ffffff;

            border:
              1.5px
              solid
              #111111;

            border-radius:
              3px;
          }

          .pixel-segments-small {
            width:
              100%;

            height:
              100%;

            display:
              grid;

            grid-template-columns:
              repeat(
                12,
                1fr
              );

            gap:
              1.3px;
          }

          .pixel-segments-small
          .seg {
            background:
              transparent;

            border-radius:
              1px;

            transition:
              background
              0.08s
              ease;
          }

          .pixel-segments-small
          .seg.active {
            background:
              #111111;
          }

          /* =====================================================
             TABLET
          ===================================================== */

          @media (
            max-width: 900px
          ) and (
            min-width: 701px
          ) {
            .bro-hero-products {
              gap:
                28px;
            }
          }

          /* =====================================================
             MÓVIL
          ===================================================== */

          @media (
            max-width: 700px
          ) {

            /* =============================================
               HERO GENERAL
            ============================================= */

            .bro-hero {
              position:
                relative;

              width:
                100%;

              min-height:
                0 !important;

              padding:
                138px
                6px
                28px
                !important;

              box-sizing:
                border-box;

              background:
                #F4F1EC
                !important;

              overflow:
                hidden
                !important;
            }

            /* =============================================
               TÍTULO
            ============================================= */

            .bro-hero
            .bro-hero-copy {
              position:
                relative
                !important;

              left:
                0
                !important;

              width:
                100%
                !important;

              max-width:
                100%
                !important;

              margin:
                0 auto
                38px
                !important;

              padding:
                0 10px
                !important;

              box-sizing:
                border-box
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                center
                !important;

              text-align:
                center
                !important;
            }

            .bro-hero
            .bro-hero-copy
            > p {
              width:
                100%
                !important;

              margin:
                0 auto
                10px
                !important;

              color:
                #111111
                !important;

              font-size:
                12px
                !important;

              text-align:
                center
                !important;
            }

            .bro-hero
            .bro-hero-copy
            > h1 {
              position:
                static
                !important;

              left:
                auto
                !important;

              right:
                auto
                !important;

              width:
                100%
                !important;

              max-width:
                330px
                !important;

              margin:
                0 auto
                !important;

              padding:
                0
                !important;

              color:
                #111111
                !important;

              font-size:
                clamp(
                  31px,
                  9.6vw,
                  42px
                )
                !important;

              line-height:
                0.92
                !important;

              letter-spacing:
                -0.045em
                !important;

              text-align:
                center
                !important;

              transform:
                none
                !important;
            }

            /* =============================================
               PRODUCTOS

               IMPORTANTE:
               100% relativo al ancho útil
               del Hero, no al viewport.
            ============================================= */

            .bro-hero
            .bro-hero-products {
              position:
                relative
                !important;

              left:
                0
                !important;

              right:
                auto
                !important;

              width:
                min(
                  390px,
                  100%
                )
                !important;

              height:
                194px
                !important;

              max-width:
                none
                !important;

              margin:
                0 auto
                !important;

              padding:
                0
                !important;

              box-sizing:
                border-box
                !important;

              display:
                block
                !important;
            }

            /* =============================================
               CUADRO CENTRAL
            ============================================= */

            .bro-hero
            .bro-hero-item-center {
              position:
                absolute
                !important;

              left:
                50%
                !important;

              bottom:
                0
                !important;

              width:
                auto
                !important;

              max-width:
                none
                !important;

              margin:
                0
                !important;

              padding:
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                center
                !important;

              justify-content:
                flex-end
                !important;

              transform:
                translateX(
                  -50%
                )
                !important;
            }

            .bro-hero
            .bro-hero-center-image {
              width:
                auto
                !important;

              max-width:
                none
                !important;

              height:
                194px
                !important;

              margin:
                0
                !important;

              padding:
                0
                !important;

              object-fit:
                contain
                !important;

              transform:
                none
                !important;

              filter:
                drop-shadow(
                  0 10px
                  10px
                  rgba(
                    0,
                    0,
                    0,
                    0.17
                  )
                )
                !important;
            }

            /* =============================================
               LATERALES
            ============================================= */

            .bro-hero
            .bro-hero-item-side {
              position:
                absolute
                !important;

              bottom:
                0
                !important;

              width:
                auto
                !important;

              max-width:
                none
                !important;

              margin:
                0
                !important;

              padding:
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                center
                !important;

              justify-content:
                flex-end
                !important;
            }

            .bro-hero
            .bro-hero-item-side:first-child {
              right:
                calc(
                  50%
                  + 82px
                )
                !important;

              left:
                auto
                !important;
            }

            .bro-hero
            .bro-hero-item-side:last-child {
              left:
                calc(
                  50%
                  + 82px
                )
                !important;

              right:
                auto
                !important;
            }

            /* =============================================
               CASE + POLO
            ============================================= */

            .bro-hero
            .bro-hero-side-image,
            .bro-hero
            .bro-hero-item-side:first-child
            .bro-hero-side-image,
            .bro-hero
            .bro-hero-item-side:last-child
            .bro-hero-side-image {
              width:
                auto
                !important;

              max-width:
                none
                !important;

              height:
                165px
                !important;

              margin:
                0
                !important;

              padding:
                0
                !important;

              object-fit:
                contain
                !important;

              transform:
                none
                !important;

              transform-origin:
                center bottom
                !important;

              filter:
                drop-shadow(
                  0 9px
                  9px
                  rgba(
                    0,
                    0,
                    0,
                    0.16
                  )
                )
                !important;
            }

            /* =============================================
               PRÓXIMAMENTE
            ============================================= */

            .bro-hero
            .pixel-loader-small {
              position:
                static
                !important;

              width:
                60px
                !important;

              margin:
                3px auto
                0
                !important;

              padding:
                0
                !important;

              display:
                flex
                !important;

              flex-direction:
                column
                !important;

              align-items:
                center
                !important;

              justify-content:
                flex-start
                !important;

              gap:
                2px
                !important;
            }

            .bro-hero
            .pixel-loader-label {
              margin:
                0
                !important;

              padding:
                0
                !important;

              color:
                #555555
                !important;

              font-family:
                'DM Sans',
                sans-serif
                !important;

              font-size:
                5.3px
                !important;

              font-weight:
                700
                !important;

              line-height:
                1
                !important;

              letter-spacing:
                0.09em
                !important;

              white-space:
                nowrap
                !important;
            }

            .bro-hero
            .pixel-bar-box-small {
              width:
                58px
                !important;

              height:
                6px
                !important;

              margin:
                0
                !important;

              padding:
                1px
                !important;

              box-sizing:
                border-box
                !important;

              background:
                #ffffff
                !important;

              border:
                1px
                solid
                #111111
                !important;

              border-radius:
                1px
                !important;
            }

            .bro-hero
            .pixel-segments-small {
              width:
                100%
                !important;

              height:
                100%
                !important;

              display:
                grid
                !important;

              grid-template-columns:
                repeat(
                  12,
                  1fr
                )
                !important;

              gap:
                0.5px
                !important;
            }

            .bro-hero
            .pixel-segments-small
            .seg {
              border-radius:
                0
                !important;
            }

            .bro-hero
            .pixel-segments-small
            .seg.active {
              background:
                #111111
                !important;
            }
          }
        `}
      </style>

      {/* TÍTULOS */}
      <div className="bro-hero-copy">
        <p>
          TU IDEA
        </p>

        <h1>
          NUESTRA CREACIÓN
        </h1>
      </div>

      {/* PRODUCTOS */}
      <div className="bro-hero-products">

        {/* CASE */}
        <div className="bro-hero-item-side">
          <img
            src={heroCase}
            alt="Case BRO"
            className="hero-image-hover bro-hero-side-image"
          />

          <PixelLoader
            currentStep={
              currentStepCase
            }
          />
        </div>

        {/* CUADRO CENTRAL */}
        <div className="bro-hero-item-center">
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
          />
        </div>

        {/* POLO */}
        <div className="bro-hero-item-side">
          <img
            src={heroPolo}
            alt="Polo BRO"
            className="hero-image-hover bro-hero-side-image"
          />

          <PixelLoader
            currentStep={
              currentStepPolo
            }
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;