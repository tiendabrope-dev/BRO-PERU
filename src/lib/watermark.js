const TEXTO_MARCA_AGUA = 'BRO';

const FUENTE_MARCA_AGUA =
  "'Black Ops One', sans-serif";

/*
  La tipografía de marca (Black Ops One) ya se carga
  globalmente vía Google Fonts en App.css. Antes de dibujar
  texto en un <canvas> con una fuente web hay que asegurarse
  de que ya esté cargada, si no el navegador dibuja con la
  fuente de respaldo.
*/
async function esperarFuenteCargada() {
  if (
    typeof document ===
      'undefined' ||
    !document.fonts
  ) {
    return;
  }

  try {
    await document.fonts.load(
      `700 40px ${FUENTE_MARCA_AGUA}`
    );

    await document.fonts
      .ready;
  } catch (error) {
    console.warn(
      'No se pudo confirmar la carga de la tipografía de la marca de agua:',
      error
    );
  }
}

function cargarImagenDesdeArchivo(
  archivo
) {
  return new Promise(
    (resolve, reject) => {
      const url =
        URL.createObjectURL(
          archivo
        );

      const imagen =
        new Image();

      imagen.onload =
        () => {
          URL.revokeObjectURL(
            url
          );

          resolve(
            imagen
          );
        };

      imagen.onerror =
        (error) => {
          URL.revokeObjectURL(
            url
          );

          reject(
            error
          );
        };

      imagen.src = url;
    }
  );
}

function dibujarMarcaDeAguaTileada(
  contexto,
  ancho,
  alto
) {
  /*
    Tamaño de letra proporcional a la imagen,
    para que se vea consistente en fotos
    pequeñas y grandes.
  */
  const tamanoFuente =
    Math.max(
      28,
      Math.round(
        Math.min(
          ancho,
          alto
        ) * 0.055
      )
    );

  const espacioX =
    tamanoFuente * 6;

  const espacioY =
    tamanoFuente * 4.5;

  /*
    Al rotar el patrón en diagonal, las esquinas
    de la imagen quedan sin cubrir si solo
    recorremos ancho x alto. Usamos la diagonal
    como tamaño del área a rellenar, centrada
    sobre la imagen, para que quede cubierta
    por completo incluso rotada.
  */
  const diagonal =
    Math.sqrt(
      ancho * ancho +
      alto * alto
    );

  contexto.save();

  contexto.translate(
    ancho / 2,
    alto / 2
  );

  contexto.rotate(
    (-30 * Math.PI) / 180
  );

  contexto.translate(
    -diagonal / 2,
    -diagonal / 2
  );

  contexto.font =
    `700 ${tamanoFuente}px ${FUENTE_MARCA_AGUA}`;

  contexto.textAlign =
    'center';

  contexto.textBaseline =
    'middle';

  contexto.fillStyle =
    'rgba(255, 255, 255, 0.20)';

  contexto.shadowColor =
    'rgba(0, 0, 0, 0.35)';

  contexto.shadowBlur = 3;

  for (
    let y = 0;
    y <= diagonal;
    y += espacioY
  ) {
    for (
      let x = 0;
      x <= diagonal;
      x += espacioX
    ) {
      contexto.fillText(
        TEXTO_MARCA_AGUA,
        x,
        y
      );
    }
  }

  contexto.restore();
}

function canvasABlob(
  canvas,
  tipo,
  calidad
) {
  return new Promise(
    (resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(
              blob
            );
          } else {
            reject(
              new Error(
                'No se pudo generar la imagen con marca de agua.'
              )
            );
          }
        },
        tipo,
        calidad
      );
    }
  );
}

const EXTENSIONES_POR_TIPO = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

/*
  Toma el archivo de imagen original seleccionado
  en el panel admin y devuelve un nuevo archivo
  con el texto "BRO" horneado en diagonal sobre
  la imagen (no es un overlay CSS: queda parte
  del archivo).

  AVIF: los navegadores no soportan de forma
  confiable codificar AVIF desde <canvas>. Si el
  original es AVIF, se exporta en WEBP en su lugar
  (buena calidad y compresión, amplio soporte).
*/
export async function aplicarMarcaDeAguaBro(
  archivo
) {
  if (
    typeof document ===
      'undefined' ||
    typeof HTMLCanvasElement ===
      'undefined'
  ) {
    return archivo;
  }

  await esperarFuenteCargada();

  const imagen =
    await cargarImagenDesdeArchivo(
      archivo
    );

  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.width =
    imagen.naturalWidth ||
    imagen.width;

  canvas.height =
    imagen.naturalHeight ||
    imagen.height;

  const contexto =
    canvas.getContext(
      '2d'
    );

  if (!contexto) {
    throw new Error(
      'Tu navegador no soporta el procesamiento de imágenes necesario para la marca de agua.'
    );
  }

  contexto.drawImage(
    imagen,
    0,
    0,
    canvas.width,
    canvas.height
  );

  dibujarMarcaDeAguaTileada(
    contexto,
    canvas.width,
    canvas.height
  );

  const tipoSalida =
    archivo.type ===
    'image/avif'
      ? 'image/webp'
      : archivo.type ||
        'image/jpeg';

  const calidad =
    tipoSalida ===
    'image/png'
      ? undefined
      : 0.92;

  const blob =
    await canvasABlob(
      canvas,
      tipoSalida,
      calidad
    );

  const extension =
    EXTENSIONES_POR_TIPO[
      tipoSalida
    ] || 'jpg';

  const nombreBase =
    String(
      archivo.name ||
        'imagen'
    ).replace(
      /\.[^.]+$/,
      ''
    );

  return new File(
    [blob],
    `${nombreBase}.${extension}`,
    {
      type: tipoSalida,
      lastModified:
        Date.now(),
    }
  );
}
