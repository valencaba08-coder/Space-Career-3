document.addEventListener('DOMContentLoaded', () => {
    // 1. Generate Starry Background
    const generateStars = () => {
        const createStarLayer = (id, count, sizeClass) => {
            const container = document.getElementById(id);
            for (let i = 0; i < count; i++) {
                const star = document.createElement('div');
                star.style.position = 'absolute';
                star.style.left = `${Math.random() * 100}vw`;
                star.style.top = `${Math.random() * 100}vh`;
                star.style.backgroundColor = '#FFF';
                star.style.borderRadius = '50%';
                
                // Random opacity
                star.style.opacity = Math.random() * 0.8 + 0.2;
                
                // Different sizes
                let size = 1;
                if (sizeClass === 'medium') size = 2;
                if (sizeClass === 'large') size = 3;
                
                star.style.width = `${size}px`;
                star.style.height = `${size}px`;
                
                container.appendChild(star);
            }
        };

        createStarLayer('stars', 100, 'small');
        createStarLayer('stars2', 50, 'medium');
        createStarLayer('stars3', 20, 'large');
    };
    
    generateStars();

    // 2. Navbar Scroll Effect & Active Link Highlight
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('.section-scroll');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active link highlight
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // 3. Section Fade-In Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // 4. Rocket Parallax & Movement
    const rocketContainer = document.getElementById('rocket-container');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const scrollFraction = scrolled / maxScroll;
        
        // Move rocket vertically down as we scroll, but keep it mostly central
        // We'll let CSS handle the fixed position, and JS handle rotation and slight offsets
        
        // Calculate rotation based on scroll position to simulate maneuvering
        let rotation = 0;
        
        if (scrollFraction < 0.2) {
            rotation = scrollFraction * 200; // Launch phase
        } else if (scrollFraction < 0.5) {
            rotation = 40 + Math.sin(scrollFraction * Math.PI * 4) * 15; // Orbiting/Turbulence
        } else if (scrollFraction < 0.8) {
            rotation = 90; // Traveling horizontally to moon
        } else {
            rotation = 135 + (scrollFraction - 0.8) * 100; // Returning/Re-entry
        }
        
        rocketContainer.style.transform = `translateY(-50%) rotate(${rotation}deg)`;
        
        // Parallax stars
        document.getElementById('stars').style.transform = `translateY(${scrolled * -0.1}px)`;
        document.getElementById('stars2').style.transform = `translateY(${scrolled * -0.2}px)`;
        document.getElementById('stars3').style.transform = `translateY(${scrolled * -0.3}px)`;
    });

    // 4.5 Celestial Bodies Interactive Parallax
    const celestialBodies = document.querySelectorAll('.celestial-body');
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = (window.innerWidth / 2 - e.pageX) * 0.05;
        mouseY = (window.innerHeight / 2 - e.pageY) * 0.05;
    });

    let time = 0;
    const animateBodies = () => {
        time += 0.02; // Velocidad de flotación
        const scrolled = window.scrollY;
        
        celestialBodies.forEach((body, index) => {
            const speed = 0.1 + (index * 0.05); // diferentes velocidades de parallax
            const floatY = Math.sin(time + index) * 15; // amplitud de flotación
            
            let baseRotate = 0;
            if (body.classList.contains('cold-war-satellite')) {
                baseRotate = 20 + Math.cos(time * 1.5) * 10;
            }
            
            // Eliminamos el "- scrolled * speed" para evitar que invadan otras secciones
            body.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed + floatY}px) rotate(${baseRotate}deg)`;
        });
        
        requestAnimationFrame(animateBodies);
    };
    animateBodies();

    // 5. Sound Effects (Web Audio API)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    const initAudio = () => {
        if (!audioCtx) {
            audioCtx = new AudioContext();
        }
    };

    const playTone = (frequency, type, duration, vol) => {
        if (!audioCtx) return;
        
        // Resume context if suspended (browser autoplay policy)
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, audioCtx.currentTime);
        
        gainNode.gain.setValueAtTime(vol, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + duration);
    };

    const playHoverSound = () => playTone(300, 'sine', 0.1, 0.05); // Soft low beep
    const playClickSound = () => playTone(2525, 'sine', 0.15, 0.1); // NASA Quindar tone approx
    
    const playTakeoffSound = () => {
        if (!audioCtx) return;
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 1.5);
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.2);
        gain.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 1.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.5);
    };

    // Attach sound events to interactive elements (links and buttons)
    const interactiveElements = document.querySelectorAll('a:not(.hero .btn), .btn:not(.hero .btn)');
    const heroBtn = document.querySelector('.hero .btn');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            initAudio(); 
            playHoverSound();
        });
        
        el.addEventListener('click', () => {
            initAudio();
            playClickSound();
        });
    });
    
    if(heroBtn) {
        heroBtn.addEventListener('mouseenter', () => {
            initAudio(); 
            playHoverSound();
        });
        heroBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Evitamos comportamiento por defecto por si falla
            initAudio();
            playTakeoffSound();
            // Hacemos scroll suave a #contexto mediante JS para mayor seguridad
            const contextSection = document.getElementById('contexto');
            if(contextSection) {
                contextSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Initialize audio context on first interaction anywhere on the page
    document.body.addEventListener('click', initAudio, { once: true });
    document.body.addEventListener('touchstart', initAudio, { once: true });
});
