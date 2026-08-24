import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  return (
    <section className="bro-hero" style={{ padding: '40px 20px', textAlign: 'center' }}>
      <div className="bro-hero-copy" style={{ marginBottom: '30px' }}>
        <p style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '0.2em', color: '#555', marginBottom: '8px' }}>
          TU IDEA
        </p>
        <h1 style={{ fontSize: '36px', fontWeight: '800', margin: '0', color: '#111' }}>
          NUESTRA CREACIÓN
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '30px', flexWrap: 'wrap', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Case */}
        <div style={{ width: '150px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Cuadro */}
        <div style={{ width: '220px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Polo */}
        <div style={{ width: '190px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroPolo}
            alt="Polo BRO"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;