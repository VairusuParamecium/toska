// ===== SISTEMA DE MEMÓRIA E POP-UPS =====

// Detectar qual página está sendo acessada
function getCurrentMemory() {
    const url = window.location.pathname;
    if (url.includes('memory1')) return 1;
    if (url.includes('memory2')) return 2;
    if (url.includes('memory3')) return 3;
    return 0;
}

const currentMemory = getCurrentMemory();

// ===== REVEAL DE PARÁGRAFOS AO SCROLL =====
document.addEventListener('DOMContentLoaded', () => {
    // Remover splash após 3 segundos
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            splashScreen.style.pointerEvents = 'none';
        }
    }, 3000);

    // Observer para reveal de parágrafos
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal-on-scroll').forEach(paragraph => {
        observer.observe(paragraph);
    });
});

// ===== POP-UP DE PERGUNTA =====
const popup = document.getElementById('memoryPopup');
const trigger = document.getElementById('memoryTrigger');
const closeBtn = document.getElementById('popupClose');
const submitBtn = document.getElementById('submitAnswer');
const answerInput = document.getElementById('answerInput');

// Abrir pop-up ao clicar no número fixo
if (trigger) {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        popup.classList.add('active');
        answerInput.focus();
    });
}

// Fechar pop-up ao clicar no X
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        resetPopup();
    });
}

// Validar resposta
if (submitBtn) {
    submitBtn.addEventListener('click', () => {
        const answer = answerInput.value.trim().toLowerCase();
        
        if (answer === 'interligado') {
            onCorrectAnswer();
        } else {
            onWrongAnswer();
        }
    });
}

// Validar ao pressionar Enter
if (answerInput) {
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitBtn.click();
        }
    });
}

// ===== FUNÇÃO: RESPOSTA CORRETA =====
function onCorrectAnswer() {
    // Salvar que respondeu corretamente
    localStorage.setItem(`memory${currentMemory}_solved`, 'true');
    
    // Reproduzir som de ruído
    playNoiseSound();
    
    // Efeito de números explodindo
    createNumberBurst();
    
    // Fechar pop-up após animação
    setTimeout(() => {
        popup.classList.remove('active');
        // Aguardar animação de nuvem
        setTimeout(() => {
            window.location.href = 'index_toska.html';
        }, 1000);
    }, 1500);
}

// ===== FUNÇÃO: RESPOSTA INCORRETA =====
function onWrongAnswer() {
    // Dar feedback visual
    answerInput.style.animation = 'shake 0.5s ease-in-out';
    
    setTimeout(() => {
        answerInput.style.animation = '';
    }, 500);
    
    // Limpar input
    answerInput.value = '';
    answerInput.focus();
    
    // Fechar pop-up após 2 segundos e voltar
    setTimeout(() => {
        resetPopup();
        // Voltar para página inicial
        window.location.href = 'index_toska.html';
    }, 2000);
}

// ===== FUNÇÃO: RESETAR POP-UP =====
function resetPopup() {
    popup.classList.remove('active');
    answerInput.value = '';
}

// ===== GERAR SOM DE RUÍDO =====
function playNoiseSound() {
    // Usar Web Audio API para gerar ruído branco
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Duração do som
    const duration = 0.5; // 500ms
    const now = audioContext.currentTime;
    
    // Criar buffer de ruído
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Preencher buffer com ruído aleatório
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    // Criar fonte
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    // Criar volume envelope (fade in/out)
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    // Conectar e reproduzir
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(now);
    source.stop(now + duration);
}

// ===== EFEITO DE NÚMEROS EXPLODINDO =====
function createNumberBurst() {
    const popupRect = document.querySelector('.popup-content').getBoundingClientRect();
    const centerX = popupRect.left + popupRect.width / 2;
    const centerY = popupRect.top + popupRect.height / 2;
    
    // Criar múltiplos números
    for (let i = 0; i < 12; i++) {
        const number = document.createElement('div');
        number.className = 'number-burst';
        number.textContent = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        // Ângulo aleatório para dispersão
        const angle = (Math.PI * 2 * i) / 12;
        const distance = 150;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        number.style.setProperty('--tx', tx + 'px');
        number.style.setProperty('--ty', ty + 'px');
        number.style.left = centerX + 'px';
        number.style.top = centerY + 'px';
        
        document.body.appendChild(number);
        
        // Remover após animação
        setTimeout(() => {
            number.remove();
        }, 1000);
    }
}

// ===== ANIMAÇÃO DE SHAKE PARA INPUT =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// ===== VERIFICAR SE TODAS AS RESPOSTAS FORAM RESPONDIDAS =====
function checkAllMemoriesSolved() {
    const solved1 = localStorage.getItem('memory1_solved') === 'true';
    const solved2 = localStorage.getItem('memory2_solved') === 'true';
    const solved3 = localStorage.getItem('memory3_solved') === 'true';
    
    return solved1 && solved2 && solved3;
}

// ===== LIMPAR RESPOSTAS (para resetar) =====
function clearAllMemories() {
    localStorage.removeItem('memory1_solved');
    localStorage.removeItem('memory2_solved');
    localStorage.removeItem('memory3_solved');
}
