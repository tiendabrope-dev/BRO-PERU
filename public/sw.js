/*
  BRO PERÚ
  SERVICE WORKER - NOTIFICACIONES PUSH (PEDIDOS)

  Este archivo corre en segundo plano, aparte del sitio.
  Su único trabajo es escuchar cuando llega una notificación
  push desde el servidor y mostrarla, aunque el panel admin
  esté cerrado.
*/

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let datos = {};

  try {
    datos = event.data ? event.data.json() : {};
  } catch (error) {
    datos = {
      title: 'BRO Perú',
      body: event.data ? event.data.text() : 'Tienes una notificación nueva.',
    };
  }

  const titulo = datos.title || 'Nuevo pedido en BRO';

  const opciones = {
    body: datos.body || 'Entró un pedido nuevo en la tienda.',
    icon: '/bro-b-favicon-192.png',
    badge: '/bro-b-favicon-192.png',
    data: {
      url: datos.url || '/cuenta/inicio/pedidos',
    },
  };

  event.waitUntil(
    self.registration.showNotification(titulo, opciones)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlDestino =
    (event.notification.data && event.notification.data.url) ||
    '/cuenta/inicio/pedidos';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((listaClientes) => {
        for (const cliente of listaClientes) {
          if (cliente.url.includes(urlDestino) && 'focus' in cliente) {
            return cliente.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(urlDestino);
        }
      })
  );
});
