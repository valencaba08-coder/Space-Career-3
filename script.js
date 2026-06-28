document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Database of Information
    const dataBank = {
        contexto: {
            title: "CONTEXTO HISTÓRICO: GUERRA FRÍA",
            content: "Durante 1970, el mundo atravesaba la <strong>Guerra Fría</strong> y la sociedad estadounidense estaba profundamente fracturada por la <strong>Guerra de Vietnam</strong>. Además, ocurrían eventos significativos como el auge del Boeing 747, la creación de Greenpeace y protestas sociales.",
            type: "info"
        },
        luna: {
            title: "OBJETIVO: LA LUNA (FRA MAURO)",
            content: "Tras los éxitos de Apolo 11 y 12, el espacio pasó de ser el principal campo de batalla de la Guerra Fría a sufrir una pérdida de interés público. La gente pensaba: <em>\"Ya ganamos, ya fuimos, ¿para qué seguimos gastando millones en esto?\"</em> La NASA enfrentaba recortes presupuestarios severos.",
            type: "info"
        },
        mision: {
            title: "LA MISIÓN APOLO 13",
            content: "La tripulación estaba compuesta por: <strong>James Lovell, John \"Jack\" Swigert y Fred Haise</strong>. Su objetivo era explorar la región lunar Fra Mauro. Volaban en el Módulo de Mando Odyssey y el Módulo Lunar Aquarius.",
            type: "info"
        },
        lanzamiento: {
            title: "EL LANZAMIENTO",
            content: "El cohete Saturno V fue lanzado el <strong>11 de abril de 1970</strong> desde el Centro Espacial Kennedy. A pesar de un apagado prematuro del motor central de la segunda etapa, la nave alcanzó la órbita de aparcamiento y se dirigió hacia la Luna.",
            type: "info"
        },
        explosion: {
            title: "LA CRISIS: EXPLOSIÓN",
            content: "Dos días después del lanzamiento, a 320,000 kilómetros de la Tierra, una chispa inofensiva en un cable defectuoso provocó la <strong>explosión de un tanque de oxígeno (Tanque 2)</strong> en el módulo de servicio.<br><br><strong>\"Houston, we've had a problem here.\"</strong>",
            type: "warning"
        },
        danos: {
            title: "EVALUACIÓN DE DAÑOS",
            content: "La nave perdía oxígeno y energía rápidamente. El alunizaje fue cancelado. Los astronautas tuvieron que apagar el Módulo de Mando Odyssey para conservar la poca energía restante y trasladarse al Módulo Lunar Aquarius (diseñado para 2 personas por 2 días) usándolo como bote salvavidas para 3 hombres durante 4 días.",
            type: "warning"
        },
        control: {
            title: "CONTROL DE MISIÓN: ESTRATEGIAS",
            content: "En la Tierra, los ingenieros trabajaron contra reloj para diseñar soluciones improvisadas, como un adaptador (el famoso 'buzón') usando cinta americana, cartón y bolsas de plástico para hacer compatibles los filtros cuadrados de CO2 del Odyssey con el sistema redondo del Aquarius.",
            type: "info"
        },
        reentrada: {
            title: "REENTRADA Y SPLASHDOWN",
            content: "Orbitaron la Luna usando su atracción gravitatoria para impulsarse de regreso a la Tierra. A pesar del frío extremo y la deshidratación, lograron reencender el Odyssey. Amerizaron a salvo en el Océano Pacífico el <strong>17 de abril de 1970</strong>.",
            type: "info"
        },
        consecuencias: {
            title: "IMPACTO Y CONSECUENCIAS",
            content: "<strong>Rediseño y Protocolos:</strong> Nació el concepto en gestión de crisis: <em>\"El fracaso no es una opción\"</em>. El drama unió a millones de personas, rompiendo barreras ideológicas en plena Guerra Fría. Esto sentó las bases para la misión conjunta Apolo-Soyuz de 1975.",
            type: "info"
        },
        fuente: {
            title: "RECURSOS: FUENTE HISTÓRICA",
            content: "Amerizaje del Apolo 13.<br>Muestra al comandante Lovell, Haise y Swigert en la balsa de recuperación. A pesar de la catastrófica explosión, lograron volver a casa gracias a la resiliencia humana y el trabajo en equipo.<br><br><img src='file:///C:/Users/andyd/.gemini/antigravity-ide/brain/d15119cd-bc3a-4457-80b3-c04edf5c0641/apollo_13_splashdown_1782433053623.png' alt='Amerizaje'>",
            type: "info"
        }
    };

    // 2. Audio System
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    let audioCtx;

    const initAudio = () => {
        if (!audioCtx) audioCtx = new AudioContext();
        if (audioCtx.state === 'suspended') audioCtx.resume();
    };

    const playTone = (freq, type, dur, vol) => {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(vol, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    };

    const soundClick = () => playTone(800, 'square', 0.1, 0.05); // High beep
    const soundWarning = () => playTone(300, 'sawtooth', 0.4, 0.1); // Low buzz
    const soundType = () => playTone(1200 + Math.random()*400, 'sine', 0.05, 0.02); // Typewriter click
    const soundHover = () => playTone(1500, 'sine', 0.02, 0.01); // Quick hover scan beep
    const soundTakeoff = () => playTone(100, 'sawtooth', 2.0, 0.2); // Long low rumble

    // 3. UI Elements
    const dataPanel = document.getElementById('dataPanel');
    const panelTitle = document.getElementById('panelTitle');
    const panelContent = document.getElementById('panelContent');
    const closeBtn = document.getElementById('closePanel');
    const interactables = document.querySelectorAll('[data-target]');
    
    let typeWriterInterval;

    // Typewriter effect function
    const typeWriter = (textHTML, element) => {
        clearInterval(typeWriterInterval);
        element.innerHTML = "";
        
        // We need to handle HTML tags, so we'll just insert the HTML but reveal it character by character?
        // A simple hack for HTML is to insert it all but hide it, or just use innerHTML directly for simplicity if it contains tags, 
        // but since we want the effect, we'll do a simple text reveal. Since we have HTML, let's just do a block reveal or fast char reveal.
        
        // Fast approach: just dump HTML but play sounds to simulate decoding.
        element.innerHTML = textHTML;
        element.style.opacity = 0;
        
        let opacity = 0;
        typeWriterInterval = setInterval(() => {
            opacity += 0.1;
            element.style.opacity = opacity;
            soundType();
            if(opacity >= 1) {
                clearInterval(typeWriterInterval);
            }
        }, 30);
    };

    // 4. Event Listeners
    interactables.forEach(el => {
        el.addEventListener('click', (e) => {
            initAudio();
            const target = el.getAttribute('data-target');
            const data = dataBank[target];
            
            if(data) {
                if(data.type === 'warning') {
                    soundWarning();
                    dataPanel.classList.add('warning-style');
                } else {
                    soundClick();
                    dataPanel.classList.remove('warning-style');
                }
                
                panelTitle.innerText = data.title;
                dataPanel.classList.add('active');
                
                // Highlight active nav
                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                if(el.classList.contains('nav-item')) {
                    el.classList.add('active');
                }
                
                typeWriter(data.content, panelContent);
            }
        });
    });

    closeBtn.addEventListener('click', () => {
        initAudio();
        soundClick();
        dataPanel.classList.remove('active');
        clearInterval(typeWriterInterval);
    });

    // Hover effects
    const addHoverSound = (selector) => {
        document.querySelectorAll(selector).forEach(el => {
            el.addEventListener('mouseenter', () => {
                initAudio();
                soundHover();
            });
        });
    };
    
    addHoverSound('.nav-item');
    addHoverSound('.node-group');
    addHoverSound('.recursos-btn');
    addHoverSound('.btn-intro');

    // Intro Screen Logic
    const btnIniciar = document.getElementById('btn-iniciar-mision');
    const introScreen = document.getElementById('intro-screen');
    
    if(btnIniciar && introScreen) {
        btnIniciar.addEventListener('click', () => {
            initAudio();
            soundTakeoff();
            // Start fade out
            introScreen.style.opacity = '0';
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 1500); // Wait for transition to end
        });
    }

    // Initialize audio on first global click
    document.body.addEventListener('click', initAudio, { once: true });
});
