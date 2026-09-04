import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

import './App.css';
import './styles/bro-ui.css';

import {
  categorias,
  mensajesSuperiores,
  productos as productosCatalogo,
} from './data/catalogo';
import useProductosPublicos from './hooks/useProductosPublicos';
import usePreciosPublicos from './hooks/usePreciosPublicos';
import { sincronizarPreciosCarrito } from './lib/preciosCarrito';

import {
  crearPedidoBro,
} from './lib/pedidos';

import {
  abrirWhatsAppBro,
} from './lib/whatsapp';

import Header from './components/Header';
import Carrito from './components/Carrito';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

import Home from './pages/Home';
import MiPedido from './pages/MiPedido';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import Afiliados from './pages/Afiliados';
import Producto from './pages/Producto';
import TodosCuadros from './pages/TodosCuadros';
import AdminApp from './admin/AdminApp';

function App() {
  const productos =
    useProductosPublicos(
      productosCatalogo
    );

  const { precios } =
    usePreciosPublicos();

  const navigate =
    useNavigate();

  const location =
    useLocation();

  /*
    ==================================
    RUTAS REALES DE BRO
    ==================================
  */

  const rutaActual =
    useMemo(() => {
      const pathname =
        location.pathname.replace(
          /\/+$/,
          ''
        ) || '/';

      if (
        pathname === '/'
      ) {
        return {
          pagina: 'inicio',
          producto: null,
          valida: true,
        };
      }

      if (
        pathname ===
        '/cuadros'
      ) {
        return {
          pagina: 'cuadros',
          producto: null,
          valida: true,
        };
      }

      if (
        pathname ===
        '/mi-pedido'
      ) {
        return {
          pagina: 'pedido',
          producto: null,
          valida: true,
        };
      }

      if (
        pathname ===
        '/preguntas-frecuentes'
      ) {
        return {
          pagina:
            'preguntas',
          producto: null,
          valida: true,
        };
      }

      if (
        pathname ===
        '/afiliados'
      ) {
        return {
          pagina:
            'afiliados',
          producto: null,
          valida: true,
        };
      }

      if (
        pathname === '/admin' ||
        pathname.startsWith('/admin/')
      ) {
        return {
          pagina: 'admin',
          producto: null,
          valida: true,
        };
      }
      if (
        pathname.startsWith(
          '/producto/'
        )
      ) {
        let slug = '';

        try {
          slug =
            decodeURIComponent(
              pathname.slice(
                '/producto/'.length
              )
            );
        } catch {
          slug = '';
        }

        const producto =
          productos.find(
            (item) =>
              item.slug === slug
          ) || null;

        if (producto) {
          return {
            pagina:
              'producto',

            producto,

            valida: true,
          };
        }
      }

      return {
        pagina: 'inicio',
        producto: null,
        valida: false,
      };
    }, [
      location.pathname,
    productos,
    ]);

  const pagina =
    rutaActual.pagina;

  const productoSeleccionado =
    rutaActual.producto;

  /*
    Si alguien escribe una URL
    que no existe, vuelve al Home.
  */
  useEffect(() => {
    if (
      !rutaActual.valida
    ) {
      navigate(
        '/',
        {
          replace: true,
        }
      );
    }
  }, [
    rutaActual.valida,
    navigate,
  ]);

  /*
    Cada nueva página empieza arriba.
  */
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'auto',
    });
  }, [
    location.pathname,
  ]);

  function obtenerRuta(
    nombrePagina
  ) {
    const rutas = {
      inicio:
        '/',

      cuadros:
        '/cuadros',

      pedido:
        '/mi-pedido',

      preguntas:
        '/preguntas-frecuentes',

      afiliados:
        '/afiliados',
    };

    return (
      rutas[nombrePagina] ||
      '/'
    );
  }

  function irPagina(
    nombrePagina
  ) {
    const destino =
      obtenerRuta(
        nombrePagina
      );

    if (
      location.pathname !==
      destino
    ) {
      navigate(
        destino,
        {
          state: {
            broInternal:
              true,
          },
        }
      );
    }

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /*
    Flecha visible de BRO.

    Si llegamos desde otra pantalla
    interna, volvemos realmente atrás.

    Si abrimos una URL directamente,
    usamos una ruta segura dentro de BRO.
  */
  function volverAtras() {
    if (
      location.state
        ?.broInternal
    ) {
      navigate(-1);
      return;
    }

    const destino =
      pagina ===
      'producto'
        ? '/cuadros'
        : '/';

    navigate(
      destino,
      {
        replace: true,
      }
    );
  }

  function irInicio() {
    irPagina(
      'inicio'
    );
  }

  function irMiPedido() {
    irPagina(
      'pedido'
    );
  }

  function irPreguntas() {
    irPagina(
      'preguntas'
    );
  }

  function irAfiliados() {
    irPagina(
      'afiliados'
    );
  }

  /*
    CATÁLOGO COMPLETO
    DE CUADROS
  */
  function irTodosCuadros() {
    irPagina(
      'cuadros'
    );
  }

  function irCategoria(
    tipoCategoria
  ) {
    if (
      tipoCategoria ===
        'cuadro' ||
      tipoCategoria ===
        'cuadros'
    ) {
      irTodosCuadros();
      return;
    }

    if (
      tipoCategoria ===
        'wallpaper' ||
      tipoCategoria ===
        'wallpapers'
    ) {
      irTodosCuadros();
      return;
    }

    irPagina(
      'inicio'
    );

    setTimeout(() => {
      const seccion =
        document.getElementById(
          'categorias'
        );

      if (seccion) {
        seccion.scrollIntoView({
          behavior:
            'smooth',

          block:
            'center',
        });
      }

      console.log(
        'Categoría seleccionada:',
        tipoCategoria
      );
    }, 80);
  }

  function irContacto() {
    irPagina(
      'inicio'
    );

    setTimeout(() => {
      const contacto =
        document.getElementById(
          'contacto'
        );

      if (contacto) {
        contacto.scrollIntoView({
          behavior:
            'smooth',

          block:
            'start',
        });
      }
    }, 80);
  }

  function verProducto(
    producto
  ) {
    if (
      !producto?.slug
    ) {
      return;
    }

    const destinoProducto =
      '/producto/' +
      encodeURIComponent(
        producto.slug
      );

    navigate(
      destinoProducto,
      {
        state: {
          broInternal:
            true,
        },
      }
    );

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  /*
    HEADER
  */

  const [
    headerVisible,
    setHeaderVisible,
  ] = useState(true);

  const lastScrollY =
    useRef(0);

  useEffect(() => {
    function detectarScroll() {
      const actual =
        window.scrollY;

      if (
        actual < 80
      ) {
        setHeaderVisible(
          true
        );
      } else if (
        actual <
        lastScrollY.current
      ) {
        setHeaderVisible(
          true
        );
      } else if (
        actual >
        lastScrollY.current
      ) {
        setHeaderVisible(
          false
        );
      }

      lastScrollY.current =
        actual;
    }

    window.addEventListener(
      'scroll',
      detectarScroll,
      {
        passive: true,
      }
    );

    return () => {
      window.removeEventListener(
        'scroll',
        detectarScroll
      );
    };
  }, []);

  /*
    MENSAJE SUPERIOR
  */

  const [
    mensajeSuperior,
    setMensajeSuperior,
  ] = useState(0);

  function mensajeAnterior() {
    setMensajeSuperior(
      (actual) =>
        actual === 0
          ? mensajesSuperiores.length -
            1
          : actual - 1
    );
  }

  function mensajeSiguiente() {
    setMensajeSuperior(
      (actual) =>
        actual ===
        mensajesSuperiores.length -
          1
          ? 0
          : actual + 1
    );
  }

  /*
    CARRITO
  */

  const [
    carrito,
    setCarrito,
  ] = useState(() => {
    try {
      const guardado =
        localStorage.getItem(
          'bro-carrito'
        );

      return guardado
        ? JSON.parse(
            guardado
          )
        : [];
    } catch {
      return [];
    }
  });

  const [
    carritoAbierto,
    setCarritoAbierto,
  ] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      'bro-carrito',
      JSON.stringify(
        carrito
      )
    );
  }, [carrito]);

  useEffect(() => {
    setCarrito(
      (actual) =>
        sincronizarPreciosCarrito(
          actual,
          precios
        )
    );
  }, [precios]);

  const cantidadTotal =
    useMemo(() => {
      return carrito.reduce(
        (
          total,
          item
        ) =>
          total +
          item.cantidad,
        0
      );
    }, [carrito]);

  const subtotal =
    useMemo(() => {
      return carrito.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.precio ||
              0
          ) *
            item.cantidad,
        0
      );
    }, [carrito]);

  function agregarAlCarrito(
    productoConfigurado
  ) {
    const idCarrito =
      productoConfigurado.idCarrito ||
      productoConfigurado.id;

    setCarrito(
      (actual) => {
        const existente =
          actual.find(
            (item) =>
              (
                item.idCarrito ||
                item.id
              ) ===
              idCarrito
          );

        if (existente) {
          return actual.map(
            (item) =>
              (
                item.idCarrito ||
                item.id
              ) ===
              idCarrito
                ? {
                    ...item,

                    cantidad:
                      item.cantidad +
                      (
                        productoConfigurado.cantidad ||
                        1
                      ),
                  }
                : item
          );
        }

        return [
          ...actual,

          {
            ...productoConfigurado,

            idCarrito,

            cantidad:
              productoConfigurado.cantidad ||
              1,
          },
        ];
      }
    );

    setCarritoAbierto(
      true
    );
  }

  function aumentarCantidad(
    id
  ) {
    setCarrito(
      (actual) =>
        actual.map(
          (item) =>
            (
              item.idCarrito ||
              item.id
            ) === id
              ? {
                  ...item,

                  cantidad:
                    item.cantidad +
                    1,
                }
              : item
        )
    );
  }

  function disminuirCantidad(
    id
  ) {
    setCarrito(
      (actual) =>
        actual
          .map(
            (item) =>
              (
                item.idCarrito ||
                item.id
              ) === id
                ? {
                    ...item,

                    cantidad:
                      item.cantidad -
                      1,
                  }
                : item
          )
          .filter(
            (item) =>
              item.cantidad >
              0
          )
    );
  }

  function eliminarProducto(
    id
  ) {
    setCarrito(
      (actual) =>
        actual.filter(
          (item) =>
            (
              item.idCarrito ||
              item.id
            ) !== id
        )
    );
  }

  function vaciarCarrito() {
    setCarrito([]);
  }

  /*
    CHECKOUT
  */

  const [
    checkoutAbierto,
    setCheckoutAbierto,
  ] = useState(false);

  const [
    errorCheckout,
    setErrorCheckout,
  ] = useState('');

  const [
    guardandoPedido,
    setGuardandoPedido,
  ] = useState(false);

  const [
    whatsappPendiente,
    setWhatsappPendiente,
  ] = useState(null);

  const esCarritoSoloDigital =
    carrito.length > 0 &&
    carrito.every(
      (item) =>
        item.tipo === 'digital' ||
        Boolean(item.wallpaperId)
    );

  const [
    formulario,
    setFormulario,
  ] = useState({
    nombre: '',
    dni: '',
    telefono: '',

    servicio:
      'contraentrega',

    direccion: '',
    distrito: '',
    referencia: '',

    metodoPago:
      'yape',
  });

  const costoDelivery =
    !esCarritoSoloDigital &&
    formulario.servicio ===
      'domicilio'
      ? Number(
          precios.delivery || 0
        )
      : 0;

  const total =
    subtotal +
    costoDelivery;

  function abrirCheckout() {
    if (
      carrito.length ===
      0
    ) {
      return;
    }

    setErrorCheckout(
      ''
    );

    setFormulario(
      (actual) => {
        if (esCarritoSoloDigital) {
          return {
            ...actual,

            servicio:
              'digital',

            direccion: '',
            distrito: '',
            referencia: '',

            metodoPago:
              actual.metodoPago ===
              'efectivo'
                ? 'yape'
                : actual.metodoPago,
          };
        }

        if (
          actual.servicio ===
          'digital'
        ) {
          return {
            ...actual,

            servicio:
              'contraentrega',
          };
        }

        return actual;
      }
    );

    setCarritoAbierto(
      false
    );

    setCheckoutAbierto(
      true
    );
  }

  function cerrarCheckout() {
    if (
      guardandoPedido
    ) {
      return;
    }

    setCheckoutAbierto(
      false
    );

    setErrorCheckout(
      ''
    );
  }

  function volverAlCarrito() {
    if (
      guardandoPedido
    ) {
      return;
    }

    setCheckoutAbierto(
      false
    );

    setCarritoAbierto(
      true
    );

    setErrorCheckout(
      ''
    );
  }

  function actualizarCampo(
    evento
  ) {
    const {
      name,
      value,
    } = evento.target;

    setFormulario(
      (actual) => ({
        ...actual,

        [name]:
          value,
      })
    );

    setErrorCheckout(
      ''
    );
  }

  function validarCheckout() {
    if (
      !formulario.nombre.trim()
    ) {
      return 'Ingresa tu nombre completo.';
    }

    if (
      !/^[A-Za-z0-9]{7,13}$/.test(
        formulario.dni.trim()
      )
    ) {
      return 'El documento debe tener entre 7 y 13 letras o números.';
    }

    const telefonoValidacion =
      formulario.telefono
        .trim()
        .replace(/[\s()-]/g, '');

    if (
      !/^\+?\d{7,13}$/.test(
        telefonoValidacion
      )
    ) {
      return 'El teléfono debe tener entre 7 y 13 dígitos y puede comenzar con +.';
    }

    if (
      !esCarritoSoloDigital &&
      ![
        'contraentrega',
        'domicilio',
      ].includes(
        formulario.servicio
      )
    ) {
      return 'Selecciona un tipo de servicio.';
    }

    if (
      !esCarritoSoloDigital &&
      formulario.servicio ===
      'domicilio'
    ) {
      if (
        !formulario.direccion.trim()
      ) {
        return 'Ingresa la dirección de entrega.';
      }

      if (
        !formulario.distrito.trim()
      ) {
        return 'Ingresa el distrito.';
      }
    }

    if (
      esCarritoSoloDigital &&
      formulario.metodoPago ===
      'efectivo'
    ) {
      return 'Selecciona Yape, Plin o transferencia para productos digitales.';
    }

    if (
      !formulario.metodoPago
    ) {
      return 'Selecciona un método de pago.';
    }

    if (
      carrito.length ===
      0
    ) {
      return 'Tu carrito está vacío.';
    }

    return '';
  }

  async function confirmarDatosPedido(
    evento
  ) {
    evento.preventDefault();

    if (
      guardandoPedido
    ) {
      return;
    }

    const error =
      validarCheckout();

    if (error) {
      setErrorCheckout(
        error
      );

      return;
    }

    setErrorCheckout(
      ''
    );

    /*
      WhatsApp debe abrir
      desde la acción directa
      del usuario.

      La pestaña se abre antes
      del await para evitar
      bloqueos del navegador.
    */

    const esMovilWhatsApp =
      /Android|iPhone|iPad|iPod|Mobile/i.test(
        navigator.userAgent
      ) ||
      window.matchMedia(
        '(max-width: 760px)'
      ).matches;

    const ventanaWhatsApp =
      null;

    if (
      ventanaWhatsApp
    ) {
      try {
        ventanaWhatsApp.document.title =
          'BRO PERU';

        ventanaWhatsApp.document.body.innerHTML =
          `
            <div
              style="
                min-height:100vh;
                margin:0;
                display:flex;
                align-items:center;
                justify-content:center;
                background:#f4f1ec;
                font-family:Arial,sans-serif;
                color:#111111;
              "
            >
              <div style="text-align:center;">
                <h2 style="margin-bottom:10px;">
                  BRO PERU
                </h2>

                <p>
                  Estamos creando tu pedido...
                </p>
              </div>
            </div>
          `;
      } catch {
        /*
          Continuamos aunque
          el navegador no permita
          modificar la pestaña.
        */
      }
    }

    setGuardandoPedido(
      true
    );

    try {
      const pedido =
        await crearPedidoBro({
          formulario,
          carrito,
        });

      const codigo =
        pedido.codigo_pedido ||
        'PEDIDO CREADO';

      const totalServidor =
        Number(
          pedido.total
        ).toFixed(2);


      setWhatsappPendiente({
        pedido,
        formulario: {
          ...formulario,
        },
        carrito:
          carrito.map(
            (item) => ({
              ...item,
            })
          ),
      });

      localStorage.removeItem(
        'bro-carrito'
      );

      setCarrito([]);

      setFormulario({
        nombre: '',
        dni: '',
        telefono: '',

        servicio:
          'contraentrega',

        direccion: '',
        distrito: '',
        referencia: '',

        metodoPago:
          'yape',
      });

      setCheckoutAbierto(
        false
      );
    } catch (
      errorPedido
    ) {
      console.error(
        errorPedido
      );

      if (
        ventanaWhatsApp &&
        !ventanaWhatsApp.closed
      ) {
        ventanaWhatsApp.close();
      }

      setErrorCheckout(
        errorPedido.message ||
          'No se pudo crear el pedido. Intenta nuevamente.'
      );
    } finally {
      setGuardandoPedido(
        false
      );
    }
  }

  /*
    BLOQUEO DE SCROLL
    CUANDO CARRITO O
    CHECKOUT ESTÁ ABIERTO
  */

  useEffect(() => {
    if (
      carritoAbierto ||
      checkoutAbierto
    ) {
      document.body.style.overflow =
        'hidden';
    } else {
      document.body.style.overflow =
        '';
    }

    return () => {
      document.body.style.overflow =
        '';
    };
  }, [
    carritoAbierto,
    checkoutAbierto,
  ]);

  if (pagina === 'admin') {
    return <AdminApp />;
  }

  return (
    <div className="site">
      <Header
        mensajesSuperiores={
          mensajesSuperiores
        }
        mensajeSuperior={
          mensajeSuperior
        }
        onMensajeAnterior={
          mensajeAnterior
        }
        onMensajeSiguiente={
          mensajeSiguiente
        }
        headerVisible={
          headerVisible
        }
        cantidadTotal={
          cantidadTotal
        }
        productos={
          productos
        }
        onVerProducto={
          verProducto
        }
        onInicio={
          irInicio
        }
        onCategoria={
          irCategoria
        }
        onMiPedido={
          irMiPedido
        }
        onPreguntas={
          irPreguntas
        }
        onContacto={
          irContacto
        }
        onAfiliados={
          irAfiliados
        }
        onAdmin={() => navigate('/admin')}
        onAbrirCarrito={() =>
          setCarritoAbierto(
            true
          )
        }
      />

      {pagina !==
        'inicio' &&
        pagina !==
          'cuadros' && (
        <button
          type="button"
          onClick={
            volverAtras
          }
          aria-label="Volver a la página anterior"
          title="Volver"
          style={{
            position:
              'fixed',

            top:
              '155px',

            left:
              '18px',

            width:
              '42px',

            height:
              '42px',

            padding:
              0,

            display:
              'grid',

            placeItems:
              'center',

            border:
              '1px solid #d8d3ca',

            borderRadius:
              '50%',

            background:
              '#ffffff',

            color:
              '#111111',

            fontSize:
              '22px',

            fontWeight:
              '700',

            lineHeight:
              1,

            cursor:
              'pointer',

            zIndex:
              1500,

            boxShadow:
              '0 4px 14px rgba(17,17,17,0.10)',
          }}
        >
          ←
        </button>
      )}

      {pagina ===
        'inicio' && (
        <Home
          categorias={
            categorias
          }
          productos={
            productos
          }
          onCategoria={
            irCategoria
          }
          onVerProducto={
            verProducto
          }
          onVerTodosCuadros={
            irTodosCuadros
          }
        />
      )}

      {pagina ===
        'cuadros' && (
        <TodosCuadros
          productos={
            productos
          }
          onVerProducto={
            verProducto
          }
          onVolver={
              volverAtras
            }
        />
      )}

      {pagina ===
        'producto' &&
        productoSeleccionado && (
          <Producto
            producto={
              productoSeleccionado
            }
            onVolver={
              volverAtras
            }
            onAgregarAlCarrito={
              agregarAlCarrito
            }
          />
        )}

      {pagina ===
        'pedido' && (
        <MiPedido />
      )}

      {pagina ===
        'preguntas' && (
        <PreguntasFrecuentes />
      )}

      {pagina ===
        'afiliados' && (
        <Afiliados />
      )}

      <Footer
        onCategoria={
          irCategoria
        }
        onPreguntas={
          irPreguntas
        }
        onMiPedido={
          irMiPedido
        }
        onContacto={
          irContacto
        }
      />

      <Carrito
        abierto={
          carritoAbierto
        }
        carrito={
          carrito
        }
        cantidadTotal={
          cantidadTotal
        }
        subtotal={
          subtotal
        }
        onCerrar={() =>
          setCarritoAbierto(
            false
          )
        }
        onAumentar={
          aumentarCantidad
        }
        onDisminuir={
          disminuirCantidad
        }
        onEliminar={
          eliminarProducto
        }
        onVaciar={
          vaciarCarrito
        }
        onCheckout={
          abrirCheckout
        }
      />

      <Checkout
        abierto={
          checkoutAbierto
        }
        esCarritoSoloDigital={
          esCarritoSoloDigital
        }
        carrito={
          carrito
        }
        subtotal={
          subtotal
        }
        costoDelivery={
          costoDelivery
        }
        total={
          total
        }
        formulario={
          formulario
        }
        errorCheckout={
          errorCheckout
        }
        guardandoPedido={
          guardandoPedido
        }
        onCerrar={
          cerrarCheckout
        }
        onVolverCarrito={
          volverAlCarrito
        }
        onActualizarCampo={
          actualizarCampo
        }
        onConfirmarPedido={
          confirmarDatosPedido
        }
      />

      {whatsappPendiente && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999,
            background:
              'rgba(17,17,17,.72)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background: '#F4F1EC',
              borderRadius: '18px',
              padding: '28px 22px',
              textAlign: 'center',
              boxShadow:
                '0 20px 60px rgba(0,0,0,.28)',
            }}
          >
            <div
              style={{
                fontSize: '34px',
                marginBottom: '8px',
              }}
            >
              ✓
            </div>

            <h2
              style={{
                margin:
                  '0 0 8px',
                color: '#111',
              }}
            >
              PEDIDO CREADO
            </h2>

            <p
              style={{
                margin:
                  '0 0 6px',
                color: '#555',
              }}
            >
              Tu pedido
            </p>

            <strong
              style={{
                display: 'block',
                marginBottom:
                  '22px',
                color: '#111',
                fontSize: '18px',
              }}
            >
              {
                whatsappPendiente
                  .pedido
                  .codigo_pedido
              }
            </strong>

            <button
              type="button"
              onClick={() => {
                const datosWhatsApp =
                  whatsappPendiente;

                setWhatsappPendiente(
                  null
                );

                abrirWhatsAppBro({
                  pedido:
                    datosWhatsApp
                      .pedido,

                  formulario:
                    datosWhatsApp
                      .formulario,

                  carrito:
                    datosWhatsApp
                      .carrito,
                });
              }}
              style={{
                width: '100%',
                minHeight: '54px',
                border: 'none',
                borderRadius: '12px',
                background:
                  '#2D5A3D',
                color: '#fff',
                fontWeight: 800,
                fontSize: '16px',
                cursor: 'pointer',
              }}
            >
              ABRIR WHATSAPP
            </button>

            <p
              style={{
                margin:
                  '14px 0 0',
                color: '#767676',
                fontSize: '12px',
                lineHeight: 1.4,
              }}
            >
              Envía el mensaje para
              terminar de coordinar
              tu pedido.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;