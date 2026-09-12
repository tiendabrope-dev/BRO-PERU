import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  registrarVisitaBro,
} from '../lib/visitas';

import '../styles/contador-visitas.css';

const DIGITOS_MINIMOS = 5;

const DURACION_GIRO_MS = 170;
const PAUSA_ENTRE_GIROS_MS = 60;
const MINIMO_GIROS = 6;

function calcularDigitos(
  numero
) {
  const texto = String(
    Math.max(
      0,
      Math.trunc(
        numero || 0
      )
    )
  );

  return texto
    .padStart(
      DIGITOS_MINIMOS,
      '0'
    )
    .split('')
    .map(
      (caracter) =>
        Number(
          caracter
        )
    );
}

function FichaDigito({
  valorFinal,
  activo,
  retraso,
}) {
  const [
    frente,
    setFrente,
  ] = useState(0);

  const [
    atras,
    setAtras,
  ] = useState(0);

  const [
    girando,
    setGirando,
  ] = useState(false);

  const [
    sinTransicion,
    setSinTransicion,
  ] = useState(false);

  useEffect(() => {
    if (!activo) {
      return undefined;
    }

    let cancelado = false;
    let temporizador;
    let valorMostrado = 0;
    let pasoActual = 0;

    /*
      Siempre da al menos MINIMO_GIROS
      vueltas antes de frenar en el
      dígito real, incluso si el
      dígito final es 0 — así todas
      las fichas se ven "girar" al
      entrar en pantalla, no solo
      las que cambian mucho.
    */
    let totalPasos = valorFinal;

    if (
      totalPasos < MINIMO_GIROS
    ) {
      totalPasos += 10;
    }

    function siguientePaso() {
      if (cancelado) {
        return;
      }

      if (
        pasoActual >=
        totalPasos
      ) {
        return;
      }

      const nuevoValor =
        (valorMostrado + 1) %
        10;

      pasoActual += 1;

      setAtras(
        nuevoValor
      );

      requestAnimationFrame(
        () => {
          if (
            !cancelado
          ) {
            setGirando(
              true
            );
          }
        }
      );

      temporizador =
        setTimeout(() => {
          setSinTransicion(
            true
          );

          setFrente(
            nuevoValor
          );

          setGirando(
            false
          );

          valorMostrado =
            nuevoValor;

          requestAnimationFrame(
            () => {
              if (
                cancelado
              ) {
                return;
              }

              setSinTransicion(
                false
              );

              temporizador =
                setTimeout(
                  siguientePaso,
                  PAUSA_ENTRE_GIROS_MS
                );
            }
          );
        }, DURACION_GIRO_MS);
    }

    temporizador = setTimeout(
      siguientePaso,
      retraso
    );

    return () => {
      cancelado = true;

      clearTimeout(
        temporizador
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activo,
    valorFinal,
  ]);

  return (
    <div className="bro-contador-ficha">
      <div className="bro-contador-anillado">
        <i></i>
        <i></i>
        <i></i>
      </div>

      <div className="bro-contador-visor">
        <div
          className={`bro-contador-carta ${
            girando
              ? 'girando'
              : ''
          } ${
            sinTransicion
              ? 'sin-transicion'
              : ''
          }`}
        >
          <div className="bro-contador-cara bro-contador-cara-frente">
            <span>
              {frente}
            </span>
          </div>

          <div className="bro-contador-cara bro-contador-cara-atras">
            <span>
              {atras}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContadorVisitas() {
  const contenedorRef =
    useRef(null);

  const yaRegistradoRef =
    useRef(false);

  const [
    totalVisitas,
    setTotalVisitas,
  ] = useState(null);

  const [
    enVista,
    setEnVista,
  ] = useState(false);

  useEffect(() => {
    const contenedor =
      contenedorRef.current;

    if (!contenedor) {
      return undefined;
    }

    if (
      typeof IntersectionObserver ===
      'undefined'
    ) {
      yaRegistradoRef.current = true;

      registrarVisitaBro().then(
        (total) => {
          if (
            total !== null
          ) {
            setTotalVisitas(
              total
            );
          }
        }
      );

      setEnVista(true);

      return undefined;
    }

    const observador =
      new IntersectionObserver(
        (entradas) => {
          entradas.forEach(
            (entrada) => {
              if (
                entrada.isIntersecting &&
                !yaRegistradoRef.current
              ) {
                yaRegistradoRef.current = true;

                registrarVisitaBro().then(
                  (total) => {
                    if (
                      total !== null
                    ) {
                      setTotalVisitas(
                        total
                      );
                    }
                  }
                );

                setEnVista(
                  true
                );

                observador.disconnect();
              }
            }
          );
        },
        {
          threshold: 0.4,
        }
      );

    observador.observe(
      contenedor
    );

    return () => {
      observador.disconnect();
    };
  }, []);

  const digitos =
    calcularDigitos(
      totalVisitas
    );

  const listo =
    enVista &&
    totalVisitas !== null;

  return (
    <div
      ref={contenedorRef}
      className="bro-contador-visitas"
    >
      <div className="bro-contador-fichas">
        {digitos.map(
          (digito, indice) => (
            <FichaDigito
              key={indice}
              valorFinal={digito}
              activo={listo}
              retraso={
                indice * 200
              }
            />
          )
        )}
      </div>

      <span className="bro-contador-etiqueta">
        PERSONAS HAN VISITADO BRO
      </span>
    </div>
  );
}

export default ContadorVisitas;
