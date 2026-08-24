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
        <div className="bro-hero-product bro-hero-case" style={{ textAlign: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            style={{ width: '160px', height: 'auto', objectFit: 'contain', display: 'inline-block' }}
          />
        </div>

        <div className="bro-hero-product bro-hero-frame" style={{ textAlign: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            style={{ width: '250px', height: 'auto', objectFit: 'contain', display: 'inline-block' }}
          />
        </div>

        <div className="bro-hero-product bro-hero-shirt" style={{ textAlign: 'center' }}>
          <img
            src={heroPolo}
            alt="Polo BRO"
            style={{ width: '210px', height: 'auto', objectFit: 'contain', display: 'inline-block' }}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;