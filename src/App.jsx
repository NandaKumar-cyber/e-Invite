import { useState, useEffect, useRef } from 'react';
import './App.css';
import coupleImg from './assets/couple.jpeg';
import music from './assets/minnale.mp3';


function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPreloaderHidden, setIsPreloaderHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const musicRef = useRef(null);
  const sectionRefs = useRef([]);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.2 });

    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Countdown Timer
  useEffect(() => {
    const weddingDate = new Date('May 29, 2026 06:00:00').getTime();
    
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0'),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0'),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0'),
        seconds: Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleEnvelopeClick = () => {
    setIsEnvelopeOpen(true);
    
    // Play music when user opens the envelope
    if (!isPlaying) {
      musicRef.current.play();
      setIsPlaying(true);
    }
    
    setTimeout(() => {
      setIsPreloaderHidden(true);
      document.body.style.overflow = 'auto';
      window.scrollTo(0, 0); // Force scroll to top of first page
    }, 1200);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      musicRef.current.pause();
    } else {
      musicRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div className="app-container">
      <div className="bg-fixed"></div>
      <div className="bg-couple"></div>
      <div className="overlay"></div>

      {/* Envelope Preloader */}
      <div className={`envelope-container ${isPreloaderHidden ? 'opened' : ''}`}>
        <div className={`envelope ${isEnvelopeOpen ? 'open' : ''}`} onClick={handleEnvelopeClick}>
          <div className="flap flap-left"></div>
          <div className="flap flap-right"></div>
          <div className="flap flap-bottom"></div>
          <div className="flap flap-top"></div>
          
          <div className="wax-seal">
            <span className="seal-text">S & V</span>
          </div>
          <div className="letter">
            <p className="script-font" style={{ fontSize: '1.8rem', marginBottom: '5px', color: '#000' }}>Our Wedding</p>
            <h2 className="accent-font" style={{ color: '#000', fontSize: '1.4rem' }}>Senthil & Vaishnavi Devi</h2>
  
          </div>
        </div>
        <p className="tap-prompt">Tap the seal to open</p>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <section className="section reveal" ref={el => sectionRefs.current[0] = el}>
          <div className="glass-card">
            <img src={coupleImg} alt="Senthil Raj & Vaishnavi Devi" className="couple-img" />
            <h1 className="gold-gradient-text" style={{ fontSize: '3.5rem', margin: '10px 0' }}>Senthil Raj & Vaishnavi Devi</h1>
            <p style={{ maxWidth: '600px', margin: '0 auto 30px', fontStyle: 'italic', opacity: 0.9 }}>
              "We joyfully invite you to share in our happiness as we exchange wedding vows and begin our new life together."
            </p>
          </div>
        </section>

        <section className="section reveal" ref={el => sectionRefs.current[1] = el}>
          <div className="glass-card">
            <h2 className="script-font">The Ceremony</h2>
            <p style={{ marginBottom: '20px' }}>Join us as we embark on our new journey together.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '40px', margin: '30px 0' }}>
              <div>
                <h3 className="gold-gradient-text" style={{ fontSize: '1.8rem' }}>RECEPTION</h3>
                <p>May 28, 2026 | Thursday</p>
                <p>07:00 PM - 09:00 PM</p>
              </div>
              <div>
                <h3 className="gold-gradient-text" style={{ fontSize: '1.8rem' }}>MUHURTHAM</h3>
                <p>May 29, 2026 | Friday</p>
                <p>06:00 AM - 07:30 AM</p>
              </div>
            </div>

            <div style={{ margin: '30px 0' }}>
              <h3 className="gold-gradient-text" style={{ fontSize: '1.8rem' }}>WHERE</h3>
              <p>Sri Bharathi Mahal</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-sub)' }}>Tirupatur main road, Mathur, Tamil Nadu.</p>
            </div>

            <a href="https://maps.app.goo.gl/1oReEx5wWHJdvm6N6" target="_blank" rel="noopener noreferrer" className="btn">View on Maps</a>

            <div className="event-footer" style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div className="countdown">
                {Object.entries(countdown).map(([label, value]) => (
                  <div key={label} className="countdown-item">
                    <span className="countdown-val">{value}</span>
                    <span className="countdown-label">{label}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => window.open("https://www.google.com/calendar/render?action=TEMPLATE&text=Senthil+%26+Vaishnavi+Devi+Wedding&dates=20260528T133000Z/20260529T053000Z&details=Reception:+May+28,+7-9+PM%0AWedding:+May+29,+6+AM+onwards.%0A%0AWe+joyfully+invite+you+to+share+in+our+happiness.&location=9CVC%2BM3%2C+Dharmapuri+-+Tirupattur+Rd%2C+Mathur%2C+Tamil+Nadu+635203&sf=true&output=xml", '_blank')}
                className="btn calendar-btn"
              >
                MARK THE MOMENT
              </button>
            </div>
          </div>
        </section>


        <footer className="footer-small ">
          <p>Made with ❤️ for Senthil & Vaishnavi</p>
        </footer>
      </main>

      {/* Floating Icons */}
      <div className="floating-controls">
        <a href="https://maps.app.goo.gl/1oReEx5wWHJdvm6N6" 
           target="_blank" 
           rel="noopener noreferrer" 
           className="control-btn map-btn" 
           title="View Location">
          <i className="fas fa-location-dot"></i>
        </a>
        <div className={`control-btn music-btn ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
        </div>
      </div>

      <audio ref={musicRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
