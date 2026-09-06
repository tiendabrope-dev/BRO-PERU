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

import '../styles/reviews-clientes.css';

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

          if (interactivas) {
            return (
              <button
                type="button"
                key={estrella}
                className="bro-review-star-button"
                onClick={() =>
                  onCambiar(
                    estrella
                  )
                }
                aria-label={`${estrella} estrellas`}
              >
                {estrella <= valor
                  ? '★'
                  : '☆'}
              </button>
            );
          }

          return (
            <span
              key={estrella}
              className="bro-review-star"
            >
              {estrella <= valor
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
  productos = [],
  onVerProducto,
}) {
  const carruselRef =
    useRef(null);

  const [
    puedeAnterior,
    setPuedeAnterior,
  ] = useState(false);

  const [
    puedeSiguiente,
    setPuedeSiguiente,
  ] = useState(false);

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
            'cuadros' ||
          producto.categoria ===
            'cuadro'
      );
    }, [
      productos,
    ]);

  const reviewsVisibles =
    useMemo(() => {
      return reviews.slice(
        0,
        10
      );
    }, [
      reviews,
    ]);

  useEffect(() => {
    let montado = true;

    async function cargar() {
      try {
        setCargando(true);

        const resultado =
          await cargarReviewsAprobadas();

        if (!montado) {
          return;
        }

        setReviews(
          resultado || []
        );
      } catch (
        errorCarga
      ) {
        console.error(
          'No se pudieron cargar las reseñas:',
          errorCarga
        );
      } finally {
        if (montado) {
          setCargando(false);
        }
      }
    }

    cargar();

    return () => {
      montado = false;
    };
  }, []);

  useEffect(() => {
    const carrusel =
      carruselRef.current;

    if (!carrusel) {
      return;
    }

    function actualizarFlechas() {
      const margen = 4;

      setPuedeAnterior(
        carrusel.scrollLeft >
          margen
      );

      setPuedeSiguiente(
        carrusel.scrollLeft +
          carrusel.clientWidth <
          carrusel.scrollWidth -
            margen
      );
    }

    requestAnimationFrame(
      actualizarFlechas
    );

    window.addEventListener(
      'resize',
      actualizarFlechas
    );

    carrusel.addEventListener(
      'scroll',
      actualizarFlechas
    );

    return () => {
      window.removeEventListener(
        'resize',
        actualizarFlechas
      );

      carrusel.removeEventListener(
        'scroll',
        actualizarFlechas
      );
    };
  }, [
    reviewsVisibles.length,
    cargando,
  ]);

  useEffect(() => {
    const modalAbierto =
      Boolean(
        modalReview
      ) ||
      formularioAbierto;

    if (modalAbierto) {
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
        (ancho + 12),

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

  function nombreProducto(
    review
  ) {
    return (
      encontrarProducto(
        review
      )?.nombre ||
      'Producto BRO'
    );
  }

  function imagenProducto(
    producto
  ) {
    if (!producto) {
      return '';
    }

    return (
      producto.imagenes?.[0] ||
      producto.imagen ||
      ''
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
          name === 'foto'
            ? files?.[0] ||
              null
            : value,
      })
    );

    setError('');
  }

  function abrirFormulario() {
    setError('');
    setMensaje('');

    setFormularioAbierto(
      true
    );
  }

  function cerrarFormulario() {
    if (enviando) {
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

    if (enviando) {
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

    if (!producto) {
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

    try {
      setEnviando(true);

      setError('');
      setMensaje('');

      await enviarReviewBro({
        nombre,
        producto,

        rating:
          formulario.rating,

        comentario,

        foto:
          formulario.foto ||
          null,
      });

      setMensaje(
        '¡Gracias! Tu reseña fue enviada a BRO y será revisada antes de publicarse.'
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
          'No pudimos enviar tu reseña. Intenta nuevamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="bro-reviews-section">
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
        </div>

        {cargando && (
          <div className="bro-review-empty">
            Cargando reseñas...
          </div>
        )}

        {!cargando &&
          reviews.length ===
            0 && (
            <div className="bro-review-empty">
              Aún no tenemos
              reseñas publicadas.
              Sé uno de los
              primeros en compartir
              tu experiencia con BRO.
            </div>
          )}

        {!cargando &&
          reviews.length >
            0 && (
            <div className="bro-reviews-stage">

              {reviewsVisibles.length >
                5 && (
                <button
                  type="button"
                  className="bro-reviews-arrow bro-reviews-arrow-prev"
                  onClick={() =>
                    moverCarrusel(
                      -1
                    )
                  }
                  disabled={
                    !puedeAnterior
                  }
                  aria-label="Reseñas anteriores"
                >
                  ‹
                </button>
              )}

              <div
                ref={
                  carruselRef
                }
                className="bro-reviews-carousel"
              >
                {reviewsVisibles.map(
                  (review) => {
                    const conFoto =
                      Boolean(
                        review.fotoUrl
                      );

                    return (
                      <button
                        type="button"
                        key={
                          review.id
                        }
                        className={`bro-review-card ${
                          conFoto
                            ? 'con-foto'
                            : 'sin-foto'
                        }`}
                        onClick={() =>
                          setModalReview(
                            review
                          )
                        }
                      >
                        {conFoto ? (
                          <>
                            <img
                              src={
                                review.fotoUrl
                              }
                              alt={`Reseña de ${review.nombre}`}
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
                                  nombreProducto(
                                    review
                                  )
                                }
                              </span>

                              <Estrellas
                                valor={
                                  review.rating
                                }
                              />
                            </span>
                          </>
                        ) : (
                          <span className="bro-review-text-card">
                            <span className="bro-review-text-quote">
                              “
                            </span>

                            <span className="bro-review-text-comment">
                              {
                                review.comentario
                              }
                            </span>

                            <span className="bro-review-text-bottom">
                              <span>
                                <strong>
                                  {
                                    review.nombre
                                  }
                                </strong>

                                <small>
                                  {
                                    nombreProducto(
                                      review
                                    )
                                  }
                                </small>
                              </span>

                              <Estrellas
                                valor={
                                  review.rating
                                }
                              />
                            </span>
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>

              {reviewsVisibles.length >
                5 && (
                <button
                  type="button"
                  className="bro-reviews-arrow bro-reviews-arrow-next"
                  onClick={() =>
                    moverCarrusel(
                      1
                    )
                  }
                  disabled={
                    !puedeSiguiente
                  }
                  aria-label="Reseñas siguientes"
                >
                  ›
                </button>
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
            onClick={
              abrirFormulario
            }
          >
            PUBLICAR TU RESEÑA
          </button>
        </div>

      </div>

      {modalReview &&
        (() => {
          const producto =
            encontrarProducto(
              modalReview
            );

          const conFoto =
            Boolean(
              modalReview.fotoUrl
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
                className={`bro-review-modal ${
                  conFoto
                    ? ''
                    : 'bro-review-modal-sin-foto'
                }`}
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

                <div
                  className={`bro-review-detail-grid ${
                    conFoto
                      ? ''
                      : 'sin-foto'
                  }`}
                >
                  {conFoto && (
                    <div className="bro-review-detail-photo">
                      <img
                        src={
                          modalReview.fotoUrl
                        }
                        alt={`Reseña de ${modalReview.nombre}`}
                      />
                    </div>
                  )}

                  <div className="bro-review-detail-copy">
                    <div className="bro-review-detail-top">
                      <h3 className="bro-review-detail-name">
                        {
                          modalReview.nombre
                        }
                      </h3>
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

                    {modalReview.fecha && (
                      <span className="bro-review-date">
                        {
                          modalReview.fecha
                        }
                      </span>
                    )}

                    {producto && (
                      <div className="bro-review-product-box">
                        {imagenProducto(
                          producto
                        ) && (
                          <img
                            src={
                              imagenProducto(
                                producto
                              )
                            }
                            alt={
                              producto.nombre
                            }
                          />
                        )}

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

                              onVerProducto?.(
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
              PUBLICAR TU RESEÑA
            </h3>

            <p className="bro-review-form-intro">
              Comparte tu
              experiencia. Puedes
              agregar una foto de tu
              cuadro si deseas.
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
                    Selecciona tu cuadro
                  </option>

                  {cuadros.map(
                    (producto) => (
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
                  <span className="bro-review-optional">
                    OPCIONAL
                  </span>
                </label>

                <input
                  id="review-foto"
                  name="foto"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={
                    actualizarCampo
                  }
                />

                <small className="bro-review-file-help">
                  Puedes enviar tu
                  reseña sin fotografía.
                </small>
              </div>

              <p className="bro-review-form-note">
                Tu reseña no se
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
                    : 'ENVIAR RESEÑA'}
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
