import { supabase } from './supabase';

/*
  BRO PERÚ
  NOTIFICACIONES PUSH (PEDIDOS) - LADO ADMIN

  Este archivo se encarga de:
  1. Registrar el service worker (public/sw.js).
  2. Pedir permiso de notificaciones al navegador del admin.
  3. Suscribir el navegador a notificaciones push.
  4. Guardar esa suscripción en Supabase (bro_push_subscriptions)
     para que el servidor sepa a quién avisarle cuando entre
     un pedido nuevo.

  Etapa 1 solamente: aquí no se envía ningún push todavía.
  El envío real (cuando entra un pedido) es la Etapa 2,
  que vive del lado de Supabase (Edge Function + Database Webhook).
*/

const VAPID_PUBLIC_KEY =
  import.meta.env.VITE_VAPID_PUBLIC_KEY;

function convertirLlaveVapid(llaveBase64) {
  const relleno =
    '='.repeat(
      (4 - (llaveBase64.length % 4)) % 4
    );

  const base64 = (
    llaveBase64 + relleno
  )
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const cadenaCruda =
    window.atob(base64);

  const bytes =
    new Uint8Array(
      cadenaCruda.length
    );

  for (let i = 0; i < cadenaCruda.length; i++) {
    bytes[i] = cadenaCruda.charCodeAt(i);
  }

  return bytes;
}

export async function activarNotificacionesPush(userId) {
  if (!userId) {
    return;
  }

  if (
    !('serviceWorker' in navigator) ||
    !('PushManager' in window)
  ) {
    console.warn(
      'Este navegador no soporta notificaciones push.'
    );

    return;
  }

  if (!VAPID_PUBLIC_KEY) {
    console.warn(
      'Falta configurar VITE_VAPID_PUBLIC_KEY para activar notificaciones push.'
    );

    return;
  }

  try {
    const registro =
      await navigator.serviceWorker.register('/sw.js');

    let permiso = Notification.permission;

    if (permiso === 'default') {
      permiso = await Notification.requestPermission();
    }

    if (permiso !== 'granted') {
      return;
    }

    let suscripcion =
      await registro.pushManager.getSubscription();

    if (!suscripcion) {
      suscripcion =
        await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            convertirLlaveVapid(VAPID_PUBLIC_KEY),
        });
    }

    const suscripcionJSON =
      suscripcion.toJSON();

    const { error } =
      await supabase
        .from('bro_push_subscriptions')
        .upsert(
          {
            user_id: userId,
            endpoint: suscripcionJSON.endpoint,
            p256dh: suscripcionJSON.keys?.p256dh,
            auth: suscripcionJSON.keys?.auth,
          },
          {
            onConflict: 'endpoint',
          }
        );

    if (error) {
      console.error(
        'Error guardando suscripción push:',
        error
      );
    }
  } catch (error) {
    console.error(
      'Error activando notificaciones push:',
      error
    );
  }
}
