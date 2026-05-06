import { useState, useEffect, useRef } from 'react';
import './App.css';
import coupleImg from './assets/couple.png';
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
    const weddingDate = new Date('May 25, 2026 10:00:00').getTime();
    
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
            <p className="script-font" style={{ fontSize: '2rem', marginBottom: '10px' }}>Our Wedding</p>
            <h2 className="accent-font">Senthil & Vaishnavi</h2>
          </div>
        </div>
        <p className="tap-prompt">Tap the seal to open</p>
      </div>

      {/* Main Content */}
      <main className="main-content">
        <section className="section" ref={el => sectionRefs.current[0] = el}>
          <div className="glass-card">
            <img src={coupleImg} alt="Senthil Raj & Vaishnavi Devi" className="couple-img" />
            <p className="script-font">Save the Date</p>
            <h1 className="gold-gradient-text" style={{ fontSize: '3.5rem', margin: '10px 0' }}>Senthil Raj & Vaishnavi Devi</h1>
            <p style={{ fontSize: '1.2rem', letterSpacing: '2px' }}>WE ARE GETTING MARRIED</p>
            
            <div className="countdown">
              {Object.entries(countdown).map(([label, value]) => (
                <div key={label} className="countdown-item">
                  <span className="countdown-val">{value}</span>
                  <span className="countdown-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" ref={el => sectionRefs.current[1] = el}>
          <div className="glass-card">
            <h2 className="script-font">The Ceremony</h2>
            <p style={{ marginBottom: '20px' }}>Join us as we embark on our new journey together.</p>
            
            <div style={{ margin: '30px 0' }}>
              <h3 className="gold-gradient-text" style={{ fontSize: '1.8rem' }}>WHEN</h3>
              <p>May 25, 2026 | 10:00 AM</p>
            </div>

            <div style={{ margin: '30px 0' }}>
              <h3 className="gold-gradient-text" style={{ fontSize: '1.8rem' }}>WHERE</h3>
              <p>Grand Palace Mahal, Chennai</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>No. 123, Wedding Street, City Center</p>
            </div>

            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn">View on Maps</a>
          </div>
        </section>


        <footer style={{ marginTop: '100px', paddingBottom: '50px', color: 'var(--text-muted)' }}>
          <p>Made with ❤️ for Senthil Raj & Vaishnavi Devi</p>
        </footer>
      </main>

      {/* Music Toggle */}
      <div className={`music-toggle ${isPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
        <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-music'}`}></i>
      </div>
      <audio ref={musicRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
