// ===== SISTEMA DE PUZZLE =====

const PUZZLE_PIECES = 7;
const SNAP_DISTANCE = 50; // Distância para snap automático

let puzzlePieces = [];
let completedPieces = new Set();

// Dimensões da imagem original
const IMG_WIDTH = 300;
const IMG_HEIGHT = 400;

// Posições dos 7 pedaços (calculadas para dividir a imagem)
const PIECE_CONFIGS = [
    // Linha 1
    { x: 0, y: 0, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 0 },
    { x: IMG_WIDTH / 2, y: 0, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 1 },
    
    // Linha 2
    { x: 0, y: IMG_HEIGHT / 3, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 2 },
    { x: IMG_WIDTH / 2, y: IMG_HEIGHT / 3, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 3 },
    
    // Linha 3
    { x: 0, y: (IMG_HEIGHT * 2) / 3, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 4 },
    { x: IMG_WIDTH / 2, y: (IMG_HEIGHT * 2) / 3, w: IMG_WIDTH / 2, h: IMG_HEIGHT / 3, index: 5 },
    
    // Último pedaço (maior)
    { x: 0, y: 0, w: IMG_WIDTH, h: IMG_HEIGHT, index: 6, isFull: true }
];

class PuzzlePiece {
    constructor(config) {
        this.config = config;
        this.element = document.createElement('div');
        this.element.className = 'puzzle-piece';
        this.element.dataset.pieceId = config.index;
        
        // Posição aleatória inicial
        this.currentX = Math.random() * (window.innerWidth - 150);
        this.currentY = Math.random() * (window.innerHeight - 200) + 100;
        
        // Imagem de fundo
        this.element.style.backgroundImage = 'url("caveira.png")';
        this.element.style.backgroundSize = `${IMG_WIDTH}px ${IMG_HEIGHT}px`;
        this.element.style.backgroundPosition = `-${config.x}px -${config.y}px`;
        this.element.style.width = `${config.w}px`;
        this.element.style.height = `${config.h}px`;
        this.element.style.left = `${this.currentX}px`;
        this.element.style.top = `${this.currentY}px`;
        
        this.isDragging = false;
        this.dragOffsetX = 0;
        this.dragOffsetY = 0;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        this.element.addEventListener('mousedown', (e) => this.startDrag(e));
        this.element.addEventListener('touchstart', (e) => this.startDrag(e));
    }
    
    startDrag(e) {
        this.isDragging = true;
        const rect = this.element.getBoundingClientRect();
        const clientX = e.clientX || e.touches[0].clientX;
        const clientY = e.clientY || e.touches[0].clientY;
        
        this.dragOffsetX = clientX - rect.left;
        this.dragOffsetY = clientY - rect.top;
        
        this.element.style.zIndex = 1000;
        
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('touchmove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.endDrag());
        document.addEventListener('touchend', () => this.endDrag());
    }
    
    drag(e) {
        if (!this.isDragging) return;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        if (!clientX || !clientY) return;
        
        this.currentX = clientX - this.dragOffsetX;
        this.currentY = clientY - this.dragOffsetY;
        
        this.element.style.left = `${this.currentX}px`;
        this.element.style.top = `${this.currentY}px`;
    }
    
    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        
        // Verificar snap com outros pedaços próximos
        this.checkSnap();
    }
    
    checkSnap() {
        // Calcular centro deste pedaço
        const thisCenterX = this.currentX + this.config.w / 2;
        const thisCenterY = this.currentY + this.config.h / 2;
        
        // Procurar por pedaços próximos
        puzzlePieces.forEach(otherPiece => {
            if (otherPiece.config.index === this.config.index) return;
            if (completedPieces.has(otherPiece.config.index)) return;
            
            const otherCenterX = otherPiece.currentX + otherPiece.config.w / 2;
            const otherCenterY = otherPiece.currentY + otherPiece.config.h / 2;
            
            const distX = Math.abs(thisCenterX - otherCenterX);
            const distY = Math.abs(thisCenterY - otherCenterY);
            const distance = Math.sqrt(distX * distX + distY * distY);
            
            if (distance < SNAP_DISTANCE) {
                this.snapTo(otherPiece);
            }
        });
    }
    
    snapTo(otherPiece) {
        // Tocar som estático
        playStaticSound();
        
        // Alinhar este pedaço ao outro
        this.currentX = otherPiece.currentX;
        this.currentY = otherPiece.currentY;
        
        this.element.style.left = `${this.currentX}px`;
        this.element.style.top = `${this.currentY}px`;
        
        // Marcar como completo
        completedPieces.add(this.config.index);
        this.element.classList.add('snapped');
        
        // Verificar se puzzle está completo
        checkPuzzleCompletion();
    }
}

// ===== FUNÇÕES DO PUZZLE =====

function initPuzzle() {
    const wrapper = document.getElementById('puzzleWrapper');
    
    // Excluir o último pedaço (6) que é a imagem completa
    for (let i = 0; i < PUZZLE_PIECES - 1; i++) {
        const config = PIECE_CONFIGS[i];
        const piece = new PuzzlePiece(config);
        puzzlePieces.push(piece);
        wrapper.appendChild(piece.element);
    }
}

function checkPuzzleCompletion() {
    // Verificar se todos os 6 primeiros pedaços foram ligados
    if (completedPieces.size === PUZZLE_PIECES - 1) {
        completePuzzle();
    }
}

function completePuzzle() {
    // Fade out do container do puzzle
    const container = document.getElementById('puzzleContainer');
    container.style.animation = 'fadeOut 1s ease-out forwards';
    
    setTimeout(() => {
        container.style.display = 'none';
        revealContent();
    }, 1000);
}

function revealContent() {
    const content = document.getElementById('memoryContent');
    content.style.display = 'block';
    
    // Iniciar animações de typing
    setTimeout(() => {
        animateTypingParagraphs();
    }, 300);
}

// ===== SOM ESTÁTICO =====

function playStaticSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    const duration = 0.15; // 150ms
    const now = audioContext.currentTime;
    
    // Criar buffer de ruído
    const bufferSize = audioContext.sampleRate * duration;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);
    
    // Preencher com ruído aleatório
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    // Criar fonte e ganho
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    
    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);
    
    source.connect(gainNode);
    gainNode.connect(audioContext.destination);
    source.start(now);
    source.stop(now + duration);
}

// ===== ANIMAÇÕES DE DIGITAÇÃO =====

function animateTypingParagraphs() {
    const paragraphs = document.querySelectorAll('.typing-paragraph');
    
    // Observer para iniciar animação ao scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('typed')) {
                animateTyping(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    paragraphs.forEach(para => observer.observe(para));
}

function animateTyping(paragraph) {
    const textElement = paragraph.querySelector('.typing-text');
    const text = textElement.innerText;
    textElement.innerText = '';
    
    paragraph.classList.add('typed');
    
    // Animação de entrada
    if (paragraph.dataset.direction === 'right') {
        paragraph.style.animation = 'slideInFromRight 0.8s ease-out';
    } else {
        paragraph.style.animation = 'slideInFromLeft 0.8s ease-out';
    }
    
    // Digitação
    let index = 0;
    const speed = 30; // ms por caractere
    
    function typeCharacter() {
        if (index < text.length) {
            textElement.innerText += text[index];
            index++;
            setTimeout(typeCharacter, speed);
        }
    }
    
    // Iniciar depois da animação de slide
    setTimeout(typeCharacter, 800);
}

// ===== INICIALIZAR =====

document.addEventListener('DOMContentLoaded', () => {
    // Remover splash
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            splashScreen.style.pointerEvents = 'none';
        }
    }, 3000);
    
    // Inicializar puzzle
    initPuzzle();
    
    // Setup do número fixo para pop-up
    const trigger = document.getElementById('memoryTrigger');
    if (trigger) {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const popup = document.getElementById('memoryPopup');
            popup.classList.add('active');
            document.getElementById('answerInput').focus();
        });
    }
    
    // Setup do número fixo para texto
    const triggerText = document.getElementById('memoryTriggerText');
    if (triggerText) {
        triggerText.addEventListener('click', (e) => {
            e.preventDefault();
            const popup = document.getElementById('memoryPopup');
            popup.classList.add('active');
            document.getElementById('answerInput').focus();
        });
    }
});
