import heroCuadro from '../assets/hero/hero-cuadro.png';
import heroCase from '../assets/hero/hero-case.png';
import heroPolo from '../assets/hero/hero-polo.png';

function Hero() {
  return (
    <section className="bro-hero" style={{ padding: '35px 20px 45px', textAlign: 'center' }}>
      <div className="bro-hero-copy" style={{ marginBottom: '25px' }}>
        <p style={{ fontSize: '13px', fontWeight: '600', letterSpacing: '0.25em', color: '#555', marginBottom: '6px' }}>
          TU IDEA
        </p>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0', color: '#111' }}>
          NUESTRA CREACIÓN
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '35px', flexWrap: 'wrap', maxWidth: '900px', margin: '0 auto' }}>
        
        {/* Case */}
        <div style={{ width: '130px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCase}
            alt="Case BRO"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Cuadro (Reducido para nivelar con los demás) */}
        <div style={{ width: '180px', display: 'flex', justifyContent: 'center' }}>
          <img
            src={heroCuadro}
            alt="Cuadro BRO"
            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
          />
        </div>

        {/* Polo */}
        <div style={{ width: '170px', display: 'flex', justifyContent: 'center' }}>
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