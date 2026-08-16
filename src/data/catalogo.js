import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

export const DELIVERY = 15;

export const mensajesSuperiores = [
  'ENVÍOS A TODO EL PERÚ',
  'PRODUCTOS DESDE S/ 7',
  'COMPRA SEGURA',
];

export const categorias = [
  {
    id: 1,
    nombre: 'CUADROS',
    tipo: 'cuadro',
    imagen: heroCuadro,
  },
  {
    id: 2,
    nombre: 'CASES',
    tipo: 'case',
    imagen: heroCase,
  },
  {
    id: 3,
    nombre: 'POLOS',
    tipo: 'polo',
    imagen: heroPolo,
  },
  {
    id: 4,
    nombre: 'WALLPAPERS',
    tipo: 'wallpaper',
    imagen: heroCuadro,
  },
];

/* =========================================================
   OPCIONES TEMPORALES DE CUADROS

   Por ahora:
   - cualquier tamaño = S/ 15
   - marco = + S/ 15

   Luego cambiaremos estos montos por los precios reales.
========================================================= */

const tamanosCuadro = [
  {
    id: 'a4',
    nombre: 'A4',
    precio: 15,
  },
  {
    id: 'a3',
    nombre: 'A3',
    precio: 15,
  },
  {
    id: 'a2',
    nombre: 'A2',
    precio: 15,
  },
];

const marcosCuadro = [
  {
    id: 'sin-marco',
    nombre: 'Sin marco',
    adicional: 0,
  },
  {
    id: 'con-marco',
    nombre: 'Con marco',
    adicional: 15,
  },
];

export const productos = [
  {
    id: 1,
    slug: 'cuadro-personalizado',
    nombre: 'Cuadro personalizado',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: 'PERSONALIZABLE',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 2,
    slug: 'porsche-911-gt3-rs',
    nombre: 'Porsche 911 GT3 RS',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: 'MÁS VENDIDO',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 3,
    slug: 'bmw-m3-competition',
    nombre: 'BMW M3 Competition',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: 'TENDENCIA',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 4,
    slug: 'nissan-gtr-r34',
    nombre: 'Nissan GT-R R34',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 5,
    slug: 'toyota-supra-mk4',
    nombre: 'Toyota Supra MK4',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 6,
    slug: 'lamborghini-huracan',
    nombre: 'Lamborghini Huracán',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 7,
    slug: 'mercedes-amg',
    nombre: 'Mercedes AMG',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 8,
    slug: 'audi-rs',
    nombre: 'Audi RS',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 9,
    slug: 'ford-mustang-gt',
    nombre: 'Ford Mustang GT',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },

  {
    id: 10,
    slug: 'porsche-collection',
    nombre: 'Porsche Collection',
    precioDesde: 15,
    imagen: heroCuadro,
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',

    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },
];