// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// Music Logic
const music = document.getElementById('bg-music');
const musicToggle = document.getElementById('music-toggle');
let isPlaying = false;

const toggleMusic = () => {
    if (isPlaying) {
        music.pause();
        musicToggle.classList.remove('playing');
    } else {
        music.play();
        musicToggle.classList.add('playing');
    }
    isPlaying = !isPlaying;
};

musicToggle.addEventListener('click', toggleMusic);

// Envelope Interaction
const envelopeWrapper = document.getElementById('envelope-wrapper');
const mainEnvelope = document.getElementById('main-envelope');

mainEnvelope.addEventListener('click', () => {
    mainEnvelope.classList.add('open');
    
    // Play music when user clicks to open
    if (!isPlaying) toggleMusic();

    // Wait for animation to finish then hide preloader
    setTimeout(() => {
        envelopeWrapper.classList.add('opened');
        document.body.style.overflow = 'auto'; // Re-enable scroll
    }, 1200);
});

// Disable scroll initially
document.body.style.overflow = 'hidden';

// Countdown Timer
const weddingDate = new Date('May 25, 2026 10:00:00').getTime();

const updateCountdown = () => {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById('timer').innerHTML = "<h3>Happily Married!</h3>";
    }
};

const timerInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Form Handling
const rsvpForm = document.getElementById('rsvp-form');
rsvpForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = rsvpForm.querySelector('button');
    const originalText = btn.innerText;
    
    btn.innerText = 'Sending...';
    btn.disabled = true;

    // Simulate API call
    setTimeout(() => {
        btn.innerText = 'Thank You!';
        rsvpForm.reset();
        
        setTimeout(() => {
            btn.innerText = originalText;
            btn.disabled = false;
        }, 3000);
    }, 1500);
});
