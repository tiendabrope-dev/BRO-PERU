import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import './App.css';
import './styles/bro-ui.css';

import {
  DELIVERY,
  categorias,
  mensajesSuperiores,
  productos,
} from './data/catalogo';

import { crearPedidoBro } from './lib/pedidos';
import { abrirWhatsAppBro } from './lib/whatsapp';

import Header from './components/Header';
import Carrito from './components/Carrito';
import Checkout from './components/Checkout';
import Footer from './components/Footer';

import Home from './pages/Home';
import MiPedido from './pages/MiPedido';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import Afiliados from './pages/Afiliados';
import Producto from './pages/Producto';

function App() {
  const [
    pagina,
    setPagina,
  ] = useState('inicio');

  const [
    productoSeleccionado,
    setProductoSeleccionado,
  ] = useState(null);

  function irPagina(nombrePagina) {
    setPagina(nombrePagina);

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  function irInicio() {
    setProductoSeleccionado(null);

    irPagina('inicio');
  }

  function irMiPedido() {
    setProductoSeleccionado(null);

    irPagina('pedido');
  }

  function irPreguntas() {
    setProductoSeleccionado(null);

    irPagina('preguntas');
  }

  function irAfiliados() {
    setProductoSeleccionado(null);

    irPagina('afiliados');
  }

  function irCategoria(tipoCategoria) {
    setPagina('inicio');

    setProductoSeleccionado(null);

    setTimeout(() => {
      const seccion =
        document.getElementById(
          'categorias'
        );

      if (seccion) {
        seccion.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      console.log(
        'Categoría seleccionada:',
        tipoCategoria
      );
    }, 80);
  }

  function irContacto() {
    setPagina('inicio');

    setProductoSeleccionado(null);

    setTimeout(() => {
      const contacto =
        document.getElementById(
          'contacto'
        );

      if (contacto) {
        contacto.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 80);
  }

  function verProducto(producto) {
    setProductoSeleccionado(
      producto
    );

    setPagina('producto');

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  const [
    headerVisible,
    setHeaderVisible,
  ] = useState(true);

  const lastScrollY =
    useRef(0);

  useEffect(() => {
    function detectarScroll() {
      const actual = window.scrollY;

      // Si estás cerca de la parte superior, muestra el header
      if (actual < 80) {
        setHeaderVisible(true);
      } 
      // Si haces scroll hacia arriba, aparece inmediatamente sin importar dónde estés
      else if (actual < lastScrollY.current) {
        setHeaderVisible(true);
      } 
      // Si haces scroll hacia abajo, se oculta
      else if (actual > lastScrollY.current) {
        setHeaderVisible(false);
      }

      lastScrollY.current = actual;
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

  const [
    mensajeSuperior,
    setMensajeSuperior,
  ] = useState(0);

  function mensajeAnterior() {
    setMensajeSuperior(
      (actual) =>
        actual === 0
          ? mensajesSuperiores.length - 1
          : actual - 1
    );
  }

  function mensajeSiguiente() {
    setMensajeSuperior(
      (actual) =>
        actual ===
        mensajesSuperiores.length - 1
          ? 0
          : actual + 1
    );
  }

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
        ? JSON.parse(guardado)
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
      JSON.stringify(carrito)
    );
  }, [carrito]);

  const cantidadTotal =
    useMemo(() => {
      return carrito.reduce(
        (total, item) =>
          total +
          item.cantidad,
        0
      );
    }, [carrito]);

  const subtotal =
    useMemo(() => {
      return carrito.reduce(
        (total, item) =>
          total +
          Number(
            item.precio || 0
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

    setCarrito((actual) => {
      const existente =
        actual.find(
          (item) =>
            (
              item.idCarrito ||
              item.id
            ) === idCarrito
        );

      if (existente) {
        return actual.map(
          (item) =>
            (
              item.idCarrito ||
              item.id
            ) === idCarrito
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
    });

    setCarritoAbierto(true);
  }

  function aumentarCantidad(id) {
    setCarrito((actual) =>
      actual.map(
        (item) =>
          (
            item.idCarrito ||
            item.id
          ) === id
            ? {
                ...item,
                cantidad:
                  item.cantidad + 1,
              }
            : item
      )
    );
  }

  function disminuirCantidad(id) {
    setCarrito((actual) =>
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
                    item.cantidad - 1,
                }
              : item
        )
        .filter(
          (item) =>
            item.cantidad > 0
        )
    );
  }

  function eliminarProducto(id) {
    setCarrito((actual) =>
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
    formulario.servicio ===
    'domicilio'
      ? DELIVERY
      : 0;

  const total =
    subtotal +
    costoDelivery;

  function abrirCheckout() {
    if (
      carrito.length === 0
    ) {
      return;
    }

    setErrorCheckout('');

    setCarritoAbierto(false);

    setCheckoutAbierto(true);
  }

  function cerrarCheckout() {
    if (
      guardandoPedido
    ) {
      return;
    }

    setCheckoutAbierto(false);

    setErrorCheckout('');
  }

  function volverAlCarrito() {
    if (
      guardandoPedido
    ) {
      return;
    }

    setCheckoutAbierto(false);

    setCarritoAbierto(true);

    setErrorCheckout('');
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
        [name]: value,
      })
    );

    setErrorCheckout('');
  }

  function validarCheckout() {
    if (
      !formulario.nombre.trim()
    ) {
      return 'Ingresa tu nombre completo.';
    }

    if (
      !/^\d{8}$/.test(
        formulario.dni.trim()
      )
    ) {
      return 'Ingresa un DNI válido de 8 dígitos.';
    }

    if (
      !/^\d{9}$/.test(
        formulario.telefono.trim()
      )
    ) {
      return 'Ingresa un número de teléfono válido de 9 dígitos.';
    }

    if (
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
      !formulario.metodoPago
    ) {
      return 'Selecciona un método de pago.';
    }

    if (
      carrito.length === 0
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

    setErrorCheckout('');

    setGuardandoPedido(true);

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

      alert(
        `¡PEDIDO CREADO CORRECTAMENTE!\n\n` +
          `PEDIDO: ${codigo}\n` +
          `TOTAL: S/ ${totalServidor}\n\n` +
          `Ahora te enviaremos a WhatsApp para que envíes el pedido a BRO PERU.`
      );

      abrirWhatsAppBro({
        pedido,
        formulario,
        carrito,
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

      setCheckoutAbierto(false);
    } catch (
      errorPedido
    ) {
      console.error(
        errorPedido
      );

      setErrorCheckout(
        errorPedido.message ||
          'No se pudo crear el pedido. Intenta nuevamente.'
      );
    } finally {
      setGuardandoPedido(false);
    }
  }

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
        onAbrirCarrito={() =>
          setCarritoAbierto(
            true
          )
        }
      />

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
              irInicio
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

      <div className="bro-currency">
        <div className="bro-peru-flag">
          <span />
          <span />
          <span />
        </div>

        <span>
          PEN
        </span>
      </div>

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
    </div>
  );
}

export default App;