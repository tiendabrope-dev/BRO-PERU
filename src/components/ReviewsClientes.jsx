import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  cargarReviewsAprobadas,
  enviarReviewBro,
} from '../lib/reviews';

function Estrellas({
  valor,
  interactivas = false,
  onCambiar,
}) {
  return (
    <div className="bro-review-stars">
      {Array.from({
        length: 5,
      }).map(
        (_, index) => {
          const estrella =
            index + 1;

          if (
            interactivas
          ) {
            return (
              <button
                type="button"
                key={
                  estrella
                }
                className="bro-review-star-button"
                onClick={() =>
                  onCambiar(
                    estrella
                  )
                }
                aria-label={`${estrella} estrellas`}
              >
                {estrella <=
                valor
                  ? '★'
                  : '☆'}
              </button>
            );
          }

          return (
            <span
              key={
                estrella
              }
              className="bro-review-star"
            >
              {estrella <=
              valor
                ? '★'
                : '☆'}
            </span>
          );
        }
      )}
    </div>
  );
}

function ReviewsClientes({
  productos,
  onVerProducto,
}) {
  const carruselRef =
    useRef(null);

  const [
    reviews,
    setReviews,
  ] = useState([]);

  const [
    cargando,
    setCargando,
  ] = useState(true);

  const [
    modalReview,
    setModalReview,
  ] = useState(null);

  const [
    formularioAbierto,
    setFormularioAbierto,
  ] = useState(false);

  const [
    enviando,
    setEnviando,
  ] = useState(false);

  const [
    mensaje,
    setMensaje,
  ] = useState('');

  const [
    error,
    setError,
  ] = useState('');

  const [
    formulario,
    setFormulario,
  ] = useState({
    nombre: '',
    productoId: '',
    rating: 5,
    comentario: '',
    foto: null,
  });

  const cuadros =
    useMemo(() => {
      return productos.filter(
        (producto) =>
          producto.categoria ===
          'cuadros'
      );
    }, [productos]);

  useEffect(() => {
    async function cargar() {
      try {
        setCargando(
          true
        );

        const resultado =
          await cargarReviewsAprobadas();

        setReviews(
          resultado
        );
      } catch (
        errorCarga
      ) {
        console.error(
          errorCarga
        );
      } finally {
        setCargando(
          false
        );
      }
    }

    cargar();
  }, []);

  useEffect(() => {
    const modalAbierto =
      Boolean(
        modalReview
      ) ||
      formularioAbierto;

    if (
      modalAbierto
    ) {
      document.body.style.overflow =
        'hidden';
    }

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [
    modalReview,
    formularioAbierto,
  ]);

  function moverCarrusel(
    direccion
  ) {
    const carrusel =
      carruselRef.current;

    if (!carrusel) {
      return;
    }

    const tarjeta =
      carrusel.querySelector(
        '.bro-review-card'
      );

    if (!tarjeta) {
      return;
    }

    const ancho =
      tarjeta
        .getBoundingClientRect()
        .width;

    carrusel.scrollBy({
      left:
        direccion *
        (ancho + 14),

      behavior:
        'smooth',
    });
  }

  function encontrarProducto(
    review
  ) {
    return productos.find(
      (producto) =>
        String(
          producto.id
        ) ===
        String(
          review.producto_id
        )
    );
  }

  function actualizarCampo(
    evento
  ) {
    const {
      name,
      value,
      files,
    } =
      evento.target;

    setFormulario(
      (actual) => ({
        ...actual,

        [name]:
          name ===
          'foto'
            ? files?.[0] ||
              null
            : value,
      })
    );

    setError('');
  }

  function cerrarFormulario() {
    if (
      enviando
    ) {
      return;
    }

    setFormularioAbierto(
      false
    );

    setError('');
    setMensaje('');
  }

  async function enviar(
    evento
  ) {
    evento.preventDefault();

    if (
      enviando
    ) {
      return;
    }

    const nombre =
      formulario.nombre.trim();

    const comentario =
      formulario.comentario.trim();

    const producto =
      cuadros.find(
        (item) =>
          String(
            item.id
          ) ===
          String(
            formulario.productoId
          )
      );

    if (
      nombre.length < 2
    ) {
      setError(
        'Ingresa tu nombre.'
      );

      return;
    }

    if (
      !producto
    ) {
      setError(
        'Selecciona el producto que estás calificando.'
      );

      return;
    }

    if (
      comentario.length < 5
    ) {
      setError(
        'Cuéntanos brevemente tu experiencia.'
      );

      return;
    }

    if (
      !formulario.foto
    ) {
      setError(
        'Agrega una foto de tu cuadro.'
      );

      return;
    }

    try {
      setEnviando(
        true
      );

      setError('');
      setMensaje('');

      await enviarReviewBro({
        nombre,
        producto,
        rating:
          formulario.rating,
        comentario,
        foto:
          formulario.foto,
      });

      setMensaje(
        '¡Gracias! Tu review fue enviada a BRO y será revisada antes de publicarse.'
      );

      setFormulario({
        nombre: '',
        productoId: '',
        rating: 5,
        comentario: '',
        foto: null,
      });
    } catch (
      errorEnvio
    ) {
      console.error(
        errorEnvio
      );

      setError(
        errorEnvio.message ||
          'No pudimos enviar tu review. Intenta nuevamente.'
      );
    } finally {
      setEnviando(
        false
      );
    }
  }

  return (
    <section className="bro-reviews-section">
      <style>
        {`
          .bro-reviews-section {
            padding:
              90px 28px
              100px;

            background:
              #ffffff;

            color:
              #111111;

            overflow:
              hidden;
          }

          .bro-reviews-container {
            width:
              100%;

            max-width:
              1400px;

            margin:
              0 auto;
          }

          .bro-reviews-header {
            display:
              flex;

            align-items:
              flex-end;

            justify-content:
              space-between;

            gap:
              30px;

            margin-bottom:
              38px;
          }

          .bro-reviews-eyebrow {
            margin:
              0 0 5px;

            color:
              #2D5A3D;

            font-family:
              'DM Sans',
              sans-serif;

            font-size:
              11px;

            font-weight:
              700;

            letter-spacing:
              0.16em;
          }

          .bro-reviews-title {
            margin:
              0;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              clamp(
                34px,
                4.5vw,
                64px
              );

            line-height:
              0.95;

            font-weight:
              800;

            letter-spacing:
              -0.045em;
          }

          .bro-reviews-arrows {
            display:
              flex;

            gap:
              10px;
          }

          .bro-reviews-arrow {
            width:
              46px;

            height:
              46px;

            border:
              1px solid
              #d4d4d4;

            border-radius:
              50%;

            background:
              #ffffff;

            color:
              #111111;

            font-size:
              21px;

            cursor:
              pointer;
          }

          .bro-reviews-carousel {
            display:
              flex;

            gap:
              14px;

            overflow-x:
              auto;

            scroll-behavior:
              smooth;

            scroll-snap-type:
              x mandatory;

            scrollbar-width:
              none;

            padding-bottom:
              4px;
          }

          .bro-reviews-carousel::-webkit-scrollbar {
            display:
              none;
          }

          .bro-review-card {
            position:
              relative;

            flex:
              0 0
              calc(
                (100% - 56px)
                / 5
              );

            aspect-ratio:
              1 / 1.04;

            padding:
              0;

            border:
              0;

            border-radius:
              18px;

            overflow:
              hidden;

            background:
              #eeeeee;

            cursor:
              pointer;

            scroll-snap-align:
              start;

            text-align:
              left;
          }

          .bro-review-card img {
            width:
              100%;

            height:
              100%;

            object-fit:
              cover;

            display:
              block;

            transition:
              transform
              0.3s ease;
          }

          .bro-review-card:hover img {
            transform:
              scale(1.025);
          }

          .bro-review-card::after {
            content:
              '';

            position:
              absolute;

            inset:
              40% 0 0;

            background:
              linear-gradient(
                to bottom,
                transparent,
                rgba(
                  0,
                  0,
                  0,
                  0.82
                )
              );
          }

          .bro-review-card-info {
            position:
              absolute;

            z-index:
              2;

            left:
              16px;

            right:
              16px;

            bottom:
              15px;

            color:
              #ffffff;
          }

          .bro-review-card-name {
            display:
              block;

            margin-bottom:
              3px;

            font-size:
              16px;

            font-weight:
              700;
          }

          .bro-review-card-product {
            display:
              block;

            margin-bottom:
              5px;

            font-size:
              10px;

            font-weight:
              600;

            line-height:
              1.2;

            opacity:
              0.82;
          }

          .bro-review-stars {
            display:
              flex;

            align-items:
              center;

            gap:
              1px;
          }

          .bro-review-star {
            color:
              #F7B500;

            font-size:
              17px;
          }

          .bro-review-empty {
            width:
              100%;

            padding:
              50px 20px;

            border:
              1px dashed
              #d7d3cc;

            border-radius:
              14px;

            text-align:
              center;

            color:
              #767676;
          }

          .bro-reviews-cta {
            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            flex-direction:
              column;

            gap:
              13px;

            margin-top:
              42px;

            text-align:
              center;
          }

          .bro-reviews-cta p {
            margin:
              0;

            color:
              #767676;

            font-size:
              13px;
          }

          .bro-review-publish {
            min-width:
              240px;

            min-height:
              50px;

            padding:
              0 24px;

            border:
              1px solid
              #111111;

            border-radius:
              5px;

            background:
              #111111;

            color:
              white;

            font-size:
              11px;

            font-weight:
              700;

            letter-spacing:
              0.12em;

            cursor:
              pointer;
          }

          .bro-review-publish:hover {
            background:
              #2D5A3D;

            border-color:
              #2D5A3D;
          }

          /* ==========================
             MODALES
          ========================== */

          .bro-review-overlay {
            position:
              fixed;

            z-index:
              99999;

            inset:
              0;

            display:
              flex;

            align-items:
              center;

            justify-content:
              center;

            padding:
              24px;

            background:
              rgba(
                17,
                17,
                17,
                0.68
              );
          }

          .bro-review-modal {
            position:
              relative;

            width:
              min(
                1080px,
                100%
              );

            max-height:
              calc(
                100vh -
                48px
              );

            overflow:
              auto;

            border-radius:
              12px;

            background:
              #ffffff;
          }

          .bro-review-close {
            position:
              absolute;

            z-index:
              5;

            top:
              16px;

            right:
              16px;

            width:
              42px;

            height:
              42px;

            border:
              0;

            border-radius:
              50%;

            background:
              rgba(
                17,
                17,
                17,
                0.88
              );

            color:
              #ffffff;

            font-size:
              22px;

            cursor:
              pointer;
          }

          .bro-review-detail-grid {
            display:
              grid;

            grid-template-columns:
              1.08fr 0.92fr;

            min-height:
              590px;
          }

          .bro-review-detail-photo {
            min-height:
              590px;

            background:
              #eeeeee;
          }

          .bro-review-detail-photo img {
            width:
              100%;

            height:
              100%;

            min-height:
              590px;

            object-fit:
              cover;

            display:
              block;
          }

          .bro-review-detail-copy {
            display:
              flex;

            flex-direction:
              column;

            padding:
              46px 38px
              32px;
          }

          .bro-review-detail-top {
            display:
              flex;

            align-items:
              center;

            justify-content:
              space-between;

            gap:
              15px;
          }

          .bro-review-detail-name {
            margin:
              0;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              21px;

            font-weight:
              700;
          }

          .bro-review-verified {
            font-size:
              12px;

            font-weight:
              700;

            color:
              #2D5A3D;
          }

          .bro-review-detail-copy
          .bro-review-stars {
            margin-top:
              13px;
          }

          .bro-review-comment {
            margin:
              30px 0;

            font-size:
              16px;

            line-height:
              1.65;

            color:
              #333333;
          }

          .bro-review-product-box {
            display:
              flex;

            align-items:
              center;

            gap:
              16px;

            margin-top:
              auto;

            padding-top:
              24px;

            border-top:
              1px solid
              #e1e1e1;
          }

          .bro-review-product-box img {
            width:
              66px;

            height:
              82px;

            object-fit:
              contain;

            border:
              1px solid
              #e7e7e7;
          }

          .bro-review-product-copy {
            flex:
              1;
          }

          .bro-review-product-copy strong {
            display:
              block;

            margin-bottom:
              8px;

            font-size:
              14px;
          }

          .bro-review-view-product {
            min-height:
              40px;

            padding:
              0 18px;

            border:
              0;

            border-radius:
              6px;

            background:
              #f1f1f1;

            color:
              #111111;

            font-weight:
              700;

            cursor:
              pointer;
          }

          /* ==========================
             FORMULARIO
          ========================== */

          .bro-review-form-modal {
            width:
              min(
                650px,
                100%
              );

            padding:
              44px 40px
              40px;
          }

          .bro-review-form-eyebrow {
            margin:
              0 0 6px;

            color:
              #2D5A3D;

            font-size:
              11px;

            font-weight:
              700;

            letter-spacing:
              0.14em;
          }

          .bro-review-form-title {
            margin:
              0 0 10px;

            font-family:
              'Syne',
              sans-serif;

            font-size:
              34px;

            font-weight:
              800;
          }

          .bro-review-form-intro {
            margin:
              0 0 28px;

            color:
              #767676;

            line-height:
              1.5;
          }

          .bro-review-form {
            display:
              grid;

            gap:
              19px;
          }

          .bro-review-field {
            display:
              grid;

            gap:
              7px;
          }

          .bro-review-field label {
            font-size:
              11px;

            font-weight:
              700;

            letter-spacing:
              0.08em;
          }

          .bro-review-field input,
          .bro-review-field select,
          .bro-review-field textarea {
            width:
              100%;

            min-height:
              48px;

            padding:
              12px 13px;

            border:
              1px solid
              #cccccc;

            border-radius:
              5px;

            background:
              #ffffff;

            color:
              #111111;

            font:
              inherit;

            box-sizing:
              border-box;
          }

          .bro-review-field textarea {
            min-height:
              120px;

            resize:
              vertical;
          }

          .bro-review-rating-select {
            display:
              flex;

            gap:
              5px;
          }

          .bro-review-star-button {
            padding:
              0;

            border:
              0;

            background:
              transparent;

            color:
              #F7B500;

            font-size:
              30px;

            cursor:
              pointer;
          }

          .bro-review-form-note {
            margin:
              0;

            color:
              #767676;

            font-size:
              11px;

            line-height:
              1.45;
          }

          .bro-review-error {
            padding:
              11px 13px;

            border-radius:
              5px;

            background:
              #fdeaea;

            color:
              #a32626;

            font-size:
              13px;
          }

          .bro-review-success {
            padding:
              13px;

            border-radius:
              5px;

            background:
              #E8F0EA;

            color:
              #2D5A3D;

            font-size:
              13px;

            line-height:
              1.45;
          }

          .bro-review-submit {
            min-height:
              50px;

            border:
              0;

            border-radius:
              5px;

            background:
              #2D5A3D;

            color:
              #ffffff;

            font-weight:
              700;

            letter-spacing:
              0.08em;

            cursor:
              pointer;
          }

          .bro-review-submit:disabled {
            opacity:
              0.55;

            cursor:
              wait;
          }

          @media (
            max-width: 1000px
          ) {
            .bro-review-card {
              flex:
                0 0
                calc(
                  (100% - 28px)
                  / 3
                );
            }
          }

          @media (
            max-width: 700px
          ) {
            .bro-reviews-section {
              padding:
                70px 18px
                80px;
            }

            .bro-reviews-header {
              align-items:
                center;
            }

            .bro-reviews-arrows {
              gap:
                6px;
            }

            .bro-reviews-arrow {
              width:
                40px;

              height:
                40px;
            }

            .bro-review-card {
              flex:
                0 0
                82%;
            }

            .bro-review-overlay {
              padding:
                12px;
            }

            .bro-review-detail-grid {
              grid-template-columns:
                1fr;
            }

            .bro-review-detail-photo,
            .bro-review-detail-photo img {
              min-height:
                360px;

              max-height:
                420px;
            }

            .bro-review-detail-copy {
              padding:
                28px 22px;
            }

            .bro-review-form-modal {
              padding:
                36px 20px
                25px;
            }

            .bro-review-form-title {
              font-size:
                28px;
            }
          }
        `}
      </style>

      <div className="bro-reviews-container">
        <div className="bro-reviews-header">
          <div>
            <p className="bro-reviews-eyebrow">
              CLIENTES BRO
            </p>

            <h2 className="bro-reviews-title">
              ASÍ QUEDARON
              <br />
              SUS CUADROS.
            </h2>
          </div>

          {reviews.length >
            1 && (
            <div className="bro-reviews-arrows">
              <button
                type="button"
                className="bro-reviews-arrow"
                onClick={() =>
                  moverCarrusel(
                    -1
                  )
                }
                aria-label="Reviews anteriores"
              >
                ←
              </button>

              <button
                type="button"
                className="bro-reviews-arrow"
                onClick={() =>
                  moverCarrusel(
                    1
                  )
                }
                aria-label="Reviews siguientes"
              >
                →
              </button>
            </div>
          )}
        </div>

        {cargando && (
          <div className="bro-review-empty">
            Cargando reviews...
          </div>
        )}

        {!cargando &&
          reviews.length ===
            0 && (
            <div className="bro-review-empty">
              Aún no tenemos
              reviews publicadas.
              Sé uno de los
              primeros en compartir
              tu cuadro BRO.
            </div>
          )}

        {!cargando &&
          reviews.length >
            0 && (
            <div
              ref={
                carruselRef
              }
              className="bro-reviews-carousel"
            >
              {reviews.map(
                (
                  review
                ) => (
                  <button
                    type="button"
                    key={
                      review.id
                    }
                    className="bro-review-card"
                    onClick={() =>
                      setModalReview(
                        review
                      )
                    }
                  >
                    <img
                      src={
                        review.fotoUrl
                      }
                      alt={`Review de ${review.nombre}`}
                      loading="lazy"
                    />

                    <span className="bro-review-card-info">
                      <span className="bro-review-card-name">
                        {
                          review.nombre
                        }
                      </span>

                      <span className="bro-review-card-product">
                        {
                          review.producto_nombre
                        }
                      </span>

                      <Estrellas
                        valor={
                          review.rating
                        }
                      />
                    </span>
                  </button>
                )
              )}
            </div>
          )}

        <div className="bro-reviews-cta">
          <p>
            ¿Ya recibiste tu
            cuadro? Cuéntanos
            cómo quedó.
          </p>

          <button
            type="button"
            className="bro-review-publish"
            onClick={() =>
              setFormularioAbierto(
                true
              )
            }
          >
            PUBLICAR TU REVIEW
          </button>
        </div>
      </div>

      {modalReview &&
        (() => {
          const producto =
            encontrarProducto(
              modalReview
            );

          return (
            <div
              className="bro-review-overlay"
              role="presentation"
              onMouseDown={(
                evento
              ) => {
                if (
                  evento.target ===
                  evento.currentTarget
                ) {
                  setModalReview(
                    null
                  );
                }
              }}
            >
              <div
                className="bro-review-modal"
                role="dialog"
                aria-modal="true"
              >
                <button
                  type="button"
                  className="bro-review-close"
                  onClick={() =>
                    setModalReview(
                      null
                    )
                  }
                  aria-label="Cerrar"
                >
                  ×
                </button>

                <div className="bro-review-detail-grid">
                  <div className="bro-review-detail-photo">
                    <img
                      src={
                        modalReview.fotoUrl
                      }
                      alt={`Review de ${modalReview.nombre}`}
                    />
                  </div>

                  <div className="bro-review-detail-copy">
                    <div className="bro-review-detail-top">
                      <h3 className="bro-review-detail-name">
                        {
                          modalReview.nombre
                        }
                      </h3>

                      {modalReview.verificada && (
                        <span className="bro-review-verified">
                          ● COMPRA
                          VERIFICADA
                        </span>
                      )}
                    </div>

                    <Estrellas
                      valor={
                        modalReview.rating
                      }
                    />

                    <p className="bro-review-comment">
                      {
                        modalReview.comentario
                      }
                    </p>

                    {producto && (
                      <div className="bro-review-product-box">
                        <img
                          src={
                            producto.imagen
                          }
                          alt={
                            producto.nombre
                          }
                        />

                        <div className="bro-review-product-copy">
                          <strong>
                            {
                              producto.nombre
                            }
                          </strong>

                          <button
                            type="button"
                            className="bro-review-view-product"
                            onClick={() => {
                              setModalReview(
                                null
                              );

                              onVerProducto(
                                producto
                              );
                            }}
                          >
                            VER PRODUCTO
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {formularioAbierto && (
        <div
          className="bro-review-overlay"
          role="presentation"
          onMouseDown={(
            evento
          ) => {
            if (
              evento.target ===
              evento.currentTarget
            ) {
              cerrarFormulario();
            }
          }}
        >
          <div
            className="bro-review-modal bro-review-form-modal"
            role="dialog"
            aria-modal="true"
          >
            <button
              type="button"
              className="bro-review-close"
              onClick={
                cerrarFormulario
              }
              aria-label="Cerrar"
            >
              ×
            </button>

            <p className="bro-review-form-eyebrow">
              COMUNIDAD BRO
            </p>

            <h3 className="bro-review-form-title">
              PUBLICAR TU REVIEW
            </h3>

            <p className="bro-review-form-intro">
              Comparte tu
              experiencia y una
              foto de cómo quedó
              tu cuadro.
            </p>

            <form
              className="bro-review-form"
              onSubmit={
                enviar
              }
            >
              <div className="bro-review-field">
                <label htmlFor="review-nombre">
                  NOMBRE
                </label>

                <input
                  id="review-nombre"
                  name="nombre"
                  value={
                    formulario.nombre
                  }
                  onChange={
                    actualizarCampo
                  }
                  maxLength="80"
                  placeholder="Tu nombre"
                />
              </div>

              <div className="bro-review-field">
                <label htmlFor="review-producto">
                  PRODUCTO
                </label>

                <select
                  id="review-producto"
                  name="productoId"
                  value={
                    formulario.productoId
                  }
                  onChange={
                    actualizarCampo
                  }
                >
                  <option value="">
                    Selecciona tu
                    cuadro
                  </option>

                  {cuadros.map(
                    (
                      producto
                    ) => (
                      <option
                        key={
                          producto.id
                        }
                        value={
                          producto.id
                        }
                      >
                        {
                          producto.nombre
                        }
                      </option>
                    )
                  )}
                </select>
              </div>

              <div className="bro-review-field">
                <label>
                  PUNTUACIÓN
                </label>

                <div className="bro-review-rating-select">
                  <Estrellas
                    valor={
                      formulario.rating
                    }
                    interactivas
                    onCambiar={(
                      valor
                    ) =>
                      setFormulario(
                        (
                          actual
                        ) => ({
                          ...actual,

                          rating:
                            valor,
                        })
                      )
                    }
                  />
                </div>
              </div>

              <div className="bro-review-field">
                <label htmlFor="review-comentario">
                  TU EXPERIENCIA
                </label>

                <textarea
                  id="review-comentario"
                  name="comentario"
                  value={
                    formulario.comentario
                  }
                  onChange={
                    actualizarCampo
                  }
                  maxLength="1200"
                  placeholder="Cuéntanos qué te pareció..."
                />
              </div>

              <div className="bro-review-field">
                <label htmlFor="review-foto">
                  FOTO DE TU CUADRO
                </label>

                <input
                  id="review-foto"
                  name="foto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={
                    actualizarCampo
                  }
                />
              </div>

              <p className="bro-review-form-note">
                Tu review no se
                publicará
                automáticamente.
                BRO la revisará
                antes de mostrarla
                en la tienda.
              </p>

              {error && (
                <div className="bro-review-error">
                  {error}
                </div>
              )}

              {mensaje && (
                <div className="bro-review-success">
                  {mensaje}
                </div>
              )}

              {!mensaje && (
                <button
                  type="submit"
                  className="bro-review-submit"
                  disabled={
                    enviando
                  }
                >
                  {enviando
                    ? 'ENVIANDO...'
                    : 'ENVIAR REVIEW'}
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default ReviewsClientes;