import { useState, useEffect, useRef } from "react";
import "./App.css";
import coupleImg from "./assets/coupleHD4.png";
import music from "./assets/audio.mp3";

function App() {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPreloaderHidden, setIsPreloaderHidden] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });
  const musicRef = useRef(null);
  const sectionRefs = useRef([]);
  const wasPlayingBeforeHidden = useRef(false);

  // Intersection Observer for reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Countdown Timer
  useEffect(() => {
    const weddingDate = new Date("September 17, 2026 07:30:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate - now;

      if (distance < 0) {
        clearInterval(interval);
        return;
      }

      setCountdown({
        days: Math.floor(distance / (1000 * 60 * 60 * 24))
          .toString()
          .padStart(2, "0"),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
          .toString()
          .padStart(2, "0"),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
          .toString()
          .padStart(2, "0"),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
          .toString()
          .padStart(2, "0"),
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
      document.body.style.overflow = "auto";
      window.scrollTo(0, 0); // Force scroll to top of first page
    }, 1200);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      musicRef.current.pause();
      setIsPlaying(false);
      return;
    }

    if (document.visibilityState === "visible") {
      musicRef.current.play();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const handleVisibilityChange = () => {
      const audio = musicRef.current;
      if (!audio) return;

      if (document.hidden) {
        wasPlayingBeforeHidden.current = !audio.paused;
        audio.pause();
        setIsPlaying(false);
        return;
      }

      if (wasPlayingBeforeHidden.current) {
        const playPromise = audio.play();
        if (playPromise) {
          playPromise.catch(() => {});
        }
        setIsPlaying(true);
      }
    };

    const handleWindowFocus = () => {
      if (wasPlayingBeforeHidden.current && document.visibilityState === "visible") {
        const playPromise = musicRef.current?.play();
        if (playPromise) {
          playPromise.catch(() => {});
        }
        setIsPlaying(true);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleVisibilityChange);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleVisibilityChange);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = "hidden";
  }, []);

  // Use lazy state initialization to generate random values once without triggering purity errors
  const [petalsData] = useState(() =>
    [...Array(10)].map(() => ({
      left: `${Math.random() * 100}%`,
      duration: `${Math.random() * 7 + 8}s`,
      delay: `${Math.random() * 10}s`,
      opacity: Math.random() * 0.3 + 0.1,
    }))
  );

  const [confettiData] = useState(() =>
    [...Array(30)].map(() => ({
      tx: `${(Math.random() - 0.5) * 800}px`,
      ty: `${(Math.random() - 0.5) * 800}px`,
      tr: `${Math.random() * 720}deg`,
      delay: `${Math.random() * 0.2}s`,
    }))
  );

  return (
    <div className="app-container">
      <div className="bg-fixed"></div>
      <div className="bg-ganesh"></div>
      <div className="bg-couple"></div>
      <div className="overlay"></div>

      {/* Falling Petals */}
      {petalsData.map((data, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: data.left,
            animationDuration: data.duration,
            animationDelay: data.delay,
            opacity: data.opacity,
          }}
        >
          🌸
        </div>
      ))}

      {/* Envelope Preloader */}
      <div
        className={`envelope-container ${isPreloaderHidden ? "opened" : ""}`}
      >
        <div
          className={`envelope ${isEnvelopeOpen ? "open" : ""}`}
          onClick={handleEnvelopeClick}
        >
          <div className="flap flap-left"></div>
          <div className="flap flap-right"></div>
          <div className="flap flap-bottom"></div>
          <div className="flap flap-top"></div>

          <div className="wax-seal">
            {/* <span className="seal-text">Naveen & Laila</span>
             */}
            <span>Naveen</span>

            <span className="amp">&</span>
            <span>Laila</span>

          </div>
          <div className="letter">
            <p
              className="script-font"
              style={{ fontSize: "1.8rem", marginBottom: "5px", color: "#000" }}
            >
              Our Wedding
            </p>
            {/* <h2 className="accent-font" style={{ color: '#000', fontSize: '1.4rem' }}>Senthil & Vaishnavi Devi</h2> */}
          </div>
        </div>
        <p className="tap-prompt">Tap the seal to open</p>
      </div>

      {/* Confetti Burst */}
      {isPreloaderHidden &&
        confettiData.map((data, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: "50%",
              top: "50%",
              backgroundColor:
                i % 2 === 0 ? "var(--gold-primary)" : "var(--bg-secondary)",
              "--tx": data.tx,
              "--ty": data.ty,
              "--tr": data.tr,
              animationDelay: data.delay,
            }}
          ></div>
        ))}

      {/* Main Content */}
      <main className="main-content">
        <section
          className="section reveal"
          ref={(el) => (sectionRefs.current[0] = el)}
        >
          <div className="glass-card">
            <p className="script-font">Save the Date</p>
            <h1 className="couple-name gold-gradient-text">
              <span>Naveen</span>

              <span className="amp">&</span>
              <span>Laila</span>

            </h1>

            <div className="hero-bottom-grid">
              <div
                className={`floating-couple-photo ${isPreloaderHidden ? "visible" : ""}`}
              >
                <img src={coupleImg} alt="Senthil & Vaishnavi" />
              </div>

              <div className="invite-text-container">
                <p className="invite-text">
                  "With hearts full of love and grace, we request the honour of
                  your presence as we celebrate the union of hearts and the
                  beginning of our forever."
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section reveal"
          ref={(el) => (sectionRefs.current[1] = el)}
        >
          <div className="glass-card">
            <h2 className="script-font">The Ceremony</h2>
            <p style={{ marginBottom: "20px" }}>
              Join us as we embark on our new journey together.
            </p>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "40px",
                margin: "30px 0",
              }}
            >
              {/* <div>
                <h3
                  className="gold-gradient-text"
                  style={{ fontSize: "1.8rem" }}
                >
                  RECEPTION
                </h3>
                <p>May 28, 2026 | Thursday</p>
                <p>07:00 PM - 09:00 PM</p>
              </div> */}
              <div>
                <h3
                  className="gold-gradient-text"
                  style={{ fontSize: "1.8rem" }}
                >
                  MUHURTHAM
                </h3>
                <p>September 17, 2026 | Friday</p>
                <p>07:30 AM - 09:00 AM</p>
              </div>
            </div>

            <div style={{ margin: "30px 0" }}>
              <h3 className="gold-gradient-text" style={{ fontSize: "1.8rem" }}>
                WHERE
              </h3>
              <p>Sri Meenatchi Thirumana Mandapam</p>
              <p style={{ fontSize: "0.9rem", color: "var(--text-sub)" }}>
                Matlampatti, Dharmapuri, Tamil Nadu.
              </p>
            </div>

            <a
              href="https://www.google.com/maps/@12.2270836,78.1936056,3a,75y,214.96h,90t/data=!3m7!1e1!3m5!1scqUKyOqkdsrMnXt5ZZEe1g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DcqUKyOqkdsrMnXt5ZZEe1g%26yaw%3D214.96144!7i13312!8i6656?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              View on Maps
            </a>

            <div
              className="event-footer"
              style={{
                marginTop: "30px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <div className="countdown">
                {Object.entries(countdown).map(([label, value]) => (
                  <div key={label} className="countdown-item">
                    <span className="countdown-val">{value}</span>
                    <span className="countdown-label">{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() =>
                  window.open(
                    "https://www.google.com/calendar/render?action=TEMPLATE&text=Naveen+%26+Laila+Wedding&dates=20260917T020000Z/20260917T033000Z&details=Wedding:+September+17,+7:30+AM+to+9:00+AM.%0A%0AWe+joyfully+invite+you+to+share+in+our+happiness.&sf=true&output=xml",
                    "_blank"
                  )
                }
                className="btn calendar-btn"

              >

                MARK THE MOMENT </button>

            </div>
          </div>
        </section>

        <footer className="footer-small ">
          <p>Made with ❤️ for Naveen & Laila</p>
        </footer>
      </main>

      {/* Floating Icons */}
      <div className="floating-controls">
        <a
          href="https://www.google.com/maps/@12.2270836,78.1936056,3a,75y,214.96h,90t/data=!3m7!1e1!3m5!1scqUKyOqkdsrMnXt5ZZEe1g!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DcqUKyOqkdsrMnXt5ZZEe1g%26yaw%3D214.96144!7i13312!8i6656?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
          className="control-btn map-btn"
          title="View Location"
        >
          <i className="fas fa-location-dot"></i>
        </a>
        <div
          className={`control-btn music-btn ${isPlaying ? "playing" : ""}`}
          onClick={toggleMusic}
        >
          <i className={`fas ${isPlaying ? "fa-pause" : "fa-music"}`}></i>
        </div>
      </div>

      <audio ref={musicRef} loop>
        <source src={music} type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default App;
