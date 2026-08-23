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
    imagen: heroCuadro, // Muestra el cuadro del Porsche que ya armaste
    badge: 'MÁS VENDIDO',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',
    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },
  {
    id: 3,
    slug: 'case-porsche-911',
    nombre: 'Case Porsche 911 GT3 RS',
    precioDesde: 15,
    imagen: heroCase, // Usamos la imagen del case que ya está lista
    badge: 'TENDENCIA',
    rating: 0,
    ratingCount: 0,
    categoria: 'cases',
    tamanos: [],
    marcos: [],
  },
  {
    id: 4,
    slug: 'polo-porsche-911',
    nombre: 'Polo Porsche 911 GT3 RS',
    precioDesde: 15,
    imagen: heroPolo, // Usamos la imagen del polo que ya está lista
    badge: 'NUEVO',
    rating: 0,
    ratingCount: 0,
    categoria: 'polos',
    tamanos: [],
    marcos: [],
  },
  {
    id: 5,
    slug: 'bmw-m3-competition',
    nombre: 'BMW M3 Competition',
    precioDesde: 15,
    imagen: heroCuadro, // Temporalmente usa heroCuadro hasta que subas su render
    badge: '',
    rating: 0,
    ratingCount: 0,
    categoria: 'cuadros',
    tamanos: tamanosCuadro,
    marcos: marcosCuadro,
  },
  {
    id: 6,
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
    id: 7,
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
    id: 8,
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
];