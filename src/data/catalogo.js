import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

import cuadroPersonalizado from '../assets/productos/cuadro-personalizado.png';
import ferrari250Gto from '../assets/productos/ferrari-250-gto.png';
import ferrari458Italia from '../assets/productos/ferrari-458-italia.png';
import ferrariEnzo from '../assets/productos/ferrari-enzo.png';
import ferrariF40 from '../assets/productos/ferrari-f40.png';
import ferrariLaferrari from '../assets/productos/ferrari-laferrari.png';
import ferrariTestarossa from '../assets/productos/ferrari-testarossa.png';
import guiaTamanosBro from '../assets/productos/guia-tamanos-bro.png';

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

    slug:
      'cuadro-personalizado',

    nombre:
      'Cuadro personalizado',

    precioDesde:
      15,

    imagen:
      cuadroPersonalizado,

    imagenes: [
      cuadroPersonalizado,
      guiaTamanosBro,
    ],

    badge:
      'PERSONALIZABLE',

    rating:
      5,

    ratingCount:
      4,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 2,

    slug:
      'porsche-911-gt3-rs',

    nombre:
      'Porsche 911 GT3 RS',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      'MÁS VENDIDO',

    rating:
      5,

    ratingCount:
      16,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 3,

    slug:
      'porsche-collection',

    nombre:
      'Porsche - Collection',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      5,

    ratingCount:
      6,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 4,

    slug:
      'bmw-m5-asco-tuning',

    nombre:
      'Bmw - M5 Asco Tuning',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      'TENDENCIA',

    rating:
      5,

    ratingCount:
      8,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 5,

    slug:
      'mercedes-amg-gt-black-series',

    nombre:
      'Mercedes - AMG GT Black Series',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      5,

    ratingCount:
      4,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 6,

    slug:
      'nissan-gtr-r34',

    nombre:
      'Nissan GT-R R34',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      5,

    ratingCount:
      12,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 7,

    slug:
      'toyota-supra-mk4',

    nombre:
      'Toyota Supra MK4',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      'ICÓNICO',

    rating:
      5,

    ratingCount:
      19,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 8,

    slug:
      'mazda-rx7-fd',

    nombre:
      'Mazda RX-7 FD',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      5,

    ratingCount:
      10,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 9,

    slug:
      'bmw-m3-competition',

    nombre:
      'BMW M3 Competition',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      5,

    ratingCount:
      14,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 10,

    slug:
      'lamborghini-huracan',

    nombre:
      'Lamborghini Huracán',

    precioDesde:
      15,

    imagen:
      heroCuadro,

    imagenes: [
      heroCuadro,
      guiaTamanosBro,
    ],

    badge:
      'NUEVO',

    rating:
      5,

    ratingCount:
      7,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 11,

    slug:
      'ferrari-250-gto',

    nombre:
      'Ferrari 250 GTO',

    precioDesde:
      15,

    imagen:
      ferrari250Gto,

    imagenes: [
      ferrari250Gto,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 12,

    slug:
      'ferrari-458-italia',

    nombre:
      'Ferrari 458 Italia',

    precioDesde:
      15,

    imagen:
      ferrari458Italia,

    imagenes: [
      ferrari458Italia,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 13,

    slug:
      'ferrari-enzo',

    nombre:
      'Ferrari Enzo',

    precioDesde:
      15,

    imagen:
      ferrariEnzo,

    imagenes: [
      ferrariEnzo,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 14,

    slug:
      'ferrari-f40',

    nombre:
      'Ferrari F40',

    precioDesde:
      15,

    imagen:
      ferrariF40,

    imagenes: [
      ferrariF40,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 15,

    slug:
      'ferrari-laferrari',

    nombre:
      'Ferrari LaFerrari',

    precioDesde:
      15,

    imagen:
      ferrariLaferrari,

    imagenes: [
      ferrariLaferrari,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },

  {
    id: 16,

    slug:
      'ferrari-testarossa',

    nombre:
      'Ferrari Testarossa',

    precioDesde:
      15,

    imagen:
      ferrariTestarossa,

    imagenes: [
      ferrariTestarossa,
      guiaTamanosBro,
    ],

    badge:
      '',

    rating:
      0,

    ratingCount:
      0,

    categoria:
      'cuadros',

    tamanos:
      tamanosCuadro,

    marcos:
      marcosCuadro,
  },
];