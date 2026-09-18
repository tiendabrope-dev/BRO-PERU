const TEXTO_MARCA_AGUA = 'BRO';

const FUENTE_MARCA_AGUA =
  "'Black Ops One', sans-serif";

/*
  Las fotos de producto se suben en resolución de
  impresión (varios miles de píxeles de ancho), pero en
  la web nunca se muestran a más de unos cientos de
  píxeles. Subir el archivo completo a ese tamaño hace
  que la tienda cargue lento. MAX_DIMENSION limita el
  lado más largo de la imagen que se sube a la web —
  de sobra para verse nítida incluso en pantallas de
  alta densidad, muy por debajo del archivo de impresión
  original (que nunca se toca: esto solo afecta la copia
  que sale del panel admin hacia la web).
*/
const MAX_DIMENSION = 1400;

const CALIDAD_JPEG = 0.88;

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

function calcularDimensionesWeb(
  anchoOriginal,
  altoOriginal
) {
  const ladoMasLargo =
    Math.max(
      anchoOriginal,
      altoOriginal
    );

  /*
    Solo achica, nunca agranda una imagen
    que ya venga más chica que el límite.
  */
  const escala =
    Math.min(
      1,
      MAX_DIMENSION /
        ladoMasLargo
    );

  return {
    ancho: Math.max(
      1,
      Math.round(
        anchoOriginal *
          escala
      )
    ),

    alto: Math.max(
      1,
      Math.round(
        altoOriginal *
          escala
      )
    ),
  };
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
      20,
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

/*
  Toma el archivo de imagen original seleccionado (o
  descargado, en el caso de la herramienta retroactiva)
  y devuelve un nuevo archivo JPEG, redimensionado a un
  tamaño razonable para la web (ver MAX_DIMENSION) y con
  el texto "BRO" horneado en diagonal sobre la imagen (no
  es un overlay CSS: queda parte del archivo).

  Se exporta siempre como JPEG: son fotos de producto (no
  necesitan transparencia) y JPEG comprime muchísimo mejor
  que PNG para este tipo de contenido — el PNG que salía
  del <canvas> antes pesaba varias veces más que el
  original, empeorando el problema de carga lenta en vez
  de solucionarlo.
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

  const anchoOriginal =
    imagen.naturalWidth ||
    imagen.width;

  const altoOriginal =
    imagen.naturalHeight ||
    imagen.height;

  const {
    ancho,
    alto,
  } = calcularDimensionesWeb(
    anchoOriginal,
    altoOriginal
  );

  const canvas =
    document.createElement(
      'canvas'
    );

  canvas.width = ancho;
  canvas.height = alto;

  const contexto =
    canvas.getContext(
      '2d'
    );

  if (!contexto) {
    throw new Error(
      'Tu navegador no soporta el procesamiento de imágenes necesario para la marca de agua.'
    );
  }

  /*
    Fondo blanco antes de dibujar: JPEG no soporta
    transparencia, así que si el original tuviera
    canal alfa, evitamos que se vea negro.
  */
  contexto.fillStyle =
    '#ffffff';

  contexto.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

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

  const blob =
    await canvasABlob(
      canvas,
      'image/jpeg',
      CALIDAD_JPEG
    );

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
    `${nombreBase}.jpg`,
    {
      type: 'image/jpeg',
      lastModified:
        Date.now(),
    }
  );
}
