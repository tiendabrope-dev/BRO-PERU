// supabase/functions/enviar-push-pedido/index.ts
//
// BRO PERÚ - NOTIFICACIONES PUSH (PEDIDOS) - ETAPA 2
//
// Esta función corre en los servidores de Supabase (no en el
// sitio ni en tu compu). Se dispara automáticamente cada vez
// que se crea una fila nueva en la tabla "pedidos" (vía un
// Database Webhook configurado en el Dashboard de Supabase).
//
// Su trabajo: buscar todas las suscripciones push guardadas
// (bro_push_subscriptions) y enviarles el aviso.

import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const VAPID_PUBLIC_KEY = Deno.env.get("VAPID_PUBLIC_KEY")!;
const VAPID_PRIVATE_KEY = Deno.env.get("VAPID_PRIVATE_KEY")!;

webpush.setVapidDetails(
  "mailto:contacto@brotienda.com",
  VAPID_PUBLIC_KEY,
  VAPID_PRIVATE_KEY
);

Deno.serve(async (req) => {
  try {
    const payload = await req.json();
    const pedido = payload.record;

    if (!pedido) {
      return new Response(
        JSON.stringify({ error: "Sin registro de pedido en el webhook." }),
        { status: 400 }
      );
    }

    const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

    const { data: suscripciones, error } = await supabase
      .from("bro_push_subscriptions")
      .select("id, endpoint, p256dh, auth");

    if (error) {
      console.error("Error leyendo suscripciones:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const totalTexto = pedido.total ? `S/ ${pedido.total}` : "";
    const codigo = pedido.codigo_pedido || pedido.numero_pedido || "";

    const mensaje = JSON.stringify({
      title: "Nuevo pedido en BRO",
      body: `Pedido ${codigo} ${totalTexto}`.trim(),
      url: "/cuenta/inicio/pedidos",
    });

    const listaSuscripciones = suscripciones || [];

    const resultados = await Promise.allSettled(
      listaSuscripciones.map((s) =>
        webpush.sendNotification(
          {
            endpoint: s.endpoint,
            keys: { p256dh: s.p256dh, auth: s.auth },
          },
          mensaje
        )
      )
    );

    // Si una suscripción ya no es válida (el navegador la
    // canceló, cambió de compu, etc.), Supabase nos devuelve
    // 404/410 - aprovechamos para borrarla sola.
    const idsVencidos = [];

    resultados.forEach((resultado, indice) => {
      if (
        resultado.status === "rejected" &&
        (resultado.reason?.statusCode === 410 ||
          resultado.reason?.statusCode === 404)
      ) {
        idsVencidos.push(listaSuscripciones[indice].id);
      }
    });

    if (idsVencidos.length > 0) {
      await supabase
        .from("bro_push_subscriptions")
        .delete()
        .in("id", idsVencidos);
    }

    return new Response(
      JSON.stringify({
        enviados: resultados.length,
        vencidos_eliminados: idsVencidos.length,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error en enviar-push-pedido:", error);

    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
    });
  }
});
