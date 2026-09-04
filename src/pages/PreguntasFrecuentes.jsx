import { useState } from 'react';

import '../styles/preguntas-frecuentes.css';

function PreguntasFrecuentes() {
  const [
    preguntaAbierta,
    setPreguntaAbierta,
  ] = useState(null);

  const preguntas = [
    {
      pregunta:
        '¿Qué es BRO?',
      respuesta:
        'BRO es una tienda de regalos pensados especialmente para hombres. Queremos ayudarte a encontrar ese regalo que realmente conecte con él, ya sea para una fecha especial, una celebración o simplemente porque se lo merece.',
    },
    {
      pregunta:
        '¿Qué puedo regalar en BRO?',
      respuesta:
        'Nuestro producto principal son los cuadros decorativos, especialmente diseños relacionados con autos y estilos que conectan con los gustos de muchos hombres. Poco a poco iremos incorporando nuevas opciones de regalo como Cases, Polos y otros productos pensados para ellos.',
    },
    {
      pregunta:
        '¿Por qué los cuadros son el producto principal de BRO?',
      respuesta:
        'Porque buscamos regalos que no sean solo bonitos, sino también personales. Un cuadro puede representar el auto que sueña tener, una pasión, un recuerdo o algo que realmente identifica a la persona que lo recibe.',
    },
    {
      pregunta:
        '¿Puedo pedir un cuadro personalizado?',
      respuesta:
        'Sí. Si quieres regalar algo todavía más especial, puedes solicitar un cuadro personalizado. Puedes enviarnos una imagen o referencia y coordinaremos contigo los detalles necesarios para preparar tu diseño.',
    },
    {
      pregunta:
        '¿Qué tamaños de cuadros tienen?',
      respuesta:
        'Actualmente nuestros cuadros están disponibles en tamaños A4, A3 y A2. También puedes elegir tu cuadro sin marco o agregar marco según el estilo que prefieras para tu regalo.',
    },
    {
      pregunta:
        '¿Cómo puedo elegir el regalo correcto?',
      respuesta:
        'Piensa en aquello que le apasiona: su auto favorito, su estilo, sus hobbies o algo que siempre haya querido. BRO está pensado justamente para hacer más fácil encontrar un regalo que se sienta hecho para él.',
    },
    {
      pregunta:
        '¿Realizan envíos?',
      respuesta:
        'Sí. BRO realiza envíos coordinados dentro del Perú. Durante el proceso de compra podrás ver las opciones disponibles y, cuando corresponda, el costo de delivery.',
    },
    {
      pregunta:
        '¿Qué métodos de pago aceptan?',
      respuesta:
        'Puedes pagar mediante Yape, Plin, transferencia bancaria y, cuando el tipo de entrega lo permita, también en efectivo.',
    },
    {
      pregunta:
        '¿Cómo puedo consultar mi pedido?',
      respuesta:
        'Ingresa a la sección Mi Pedido y coloca tu nombre, documento y código de pedido BRO. Allí podrás consultar el estado de tu compra, los productos solicitados, el estado del pago y el total de tu pedido.',
    },
    {
      pregunta:
        '¿BRO tendrá más productos para regalar?',
      respuesta:
        'Sí. Los cuadros son nuestro punto de partida, pero BRO está creciendo como una tienda especializada en regalos para hombres. Poco a poco iremos incorporando nuevas categorías para que encuentres cada vez más opciones pensadas para él.',
    },
  ];

  function alternarPregunta(
    index
  ) {
    setPreguntaAbierta(
      (actual) =>
        actual === index
          ? null
          : index
    );
  }

  return (
    <main className="bro-faq-page">
      <div className="bro-faq-wrap">

        <div className="bro-faq-header">
          <p className="bro-faq-eyebrow">
            TE AYUDAMOS
          </p>

          <h1 className="bro-faq-title">
            PREGUNTAS
            <br />
            FRECUENTES.
          </h1>

          <p className="bro-faq-intro">
            Todo lo que necesitas
            saber antes y después
            de elegir tu regalo
            en BRO.
          </p>
        </div>

        <div className="bro-faq-box">
          {preguntas.map(
            (
              {
                pregunta,
                respuesta,
              },
              index
            ) => {
              const abierta =
                preguntaAbierta ===
                index;

              return (
                <div
                  key={pregunta}
                  className={`bro-faq-item ${
                    abierta
                      ? 'is-open'
                      : ''
                  }`}
                >
                  <button
                    type="button"
                    className="bro-faq-question"
                    onClick={() =>
                      alternarPregunta(
                        index
                      )
                    }
                    aria-expanded={
                      abierta
                    }
                  >
                    <span>
                      {pregunta}
                    </span>

                    <span
                      className="bro-faq-arrow"
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </button>

                  <div className="bro-faq-answer">
                    <div className="bro-faq-answer-inner">
                      <p>
                        {respuesta}
                      </p>
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

      </div>
    </main>
  );
}

export default PreguntasFrecuentes;