import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  return (
    <section className="bro-hero">
      <div className="bro-hero-copy">
        <p className="bro-hero-eyebrow">
          TU IDEA
        </p>

        <h1>
          NUESTRA CREACIÓN
        </h1>
      </div>

      <div className="bro-hero-products">
        <div className="bro-hero-product bro-hero-case">
          <img
            src={heroCase}
            alt="Case BRO"
          />
        </div>

        <div className="bro-hero-product bro-hero-frame">
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
          />
        </div>

        <div className="bro-hero-product bro-hero-shirt">
          <img
            src={heroPolo}
            alt="Polo BRO"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;