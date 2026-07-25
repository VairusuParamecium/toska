// Remover splash screen após animação
window.addEventListener('load', () => {
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            splashScreen.style.pointerEvents = 'none';
        }
    }, 3000);
});

// Gerar números flutuantes aleatórios com mudança contínua (estilo Mason numbers de COD)
function createFloatingNumber() {
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    
    // Posição aleatória na tela (em toda a altura)
    const randomX = Math.random() * (window.innerWidth - 50);
    const randomY = Math.random() * window.innerHeight - 100;
    
    floatingNum.style.left = randomX + 'px';
    floatingNum.style.top = randomY + 'px';
    
    // Duração aleatória para variação
    const duration = 3 + Math.random() * 3;
    floatingNum.style.animationDuration = duration + 's';
    
    // Iniciar com número aleatório
    let currentNumber = Math.floor(Math.random() * 10);
    floatingNum.textContent = currentNumber;
    
    document.body.appendChild(floatingNum);
    
    // Mudar números continuamente enquanto está na tela
    let changeCount = 0;
    const changeInterval = setInterval(() => {
        currentNumber = Math.floor(Math.random() * 10);
        floatingNum.textContent = currentNumber;
        changeCount++;
        
        // Parar de mudar perto do final
        if (changeCount > Math.floor(duration * 10)) {
            clearInterval(changeInterval);
        }
    }, 100); // Muda a cada 100ms
    
    // Remover elemento após animação
    setTimeout(() => {
        clearInterval(changeInterval);
        floatingNum.remove();
    }, duration * 1000);
}

// Criar números flotuantes com mais frequência
setInterval(() => {
    if (Math.random() > 0.25) { // Antes era 0.4, agora 0.25 = mais frequente
        createFloatingNumber();
    }
}, 500); // Antes era 800ms, agora 500ms = mais frequente

// Smooth scroll para links de navegação
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Efeito de animação ao fazer scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(section);
});

// Hover effect no número fixo
const fixedNumbers = document.querySelectorAll('.fixed-number, .fixed-number-memory');
fixedNumbers.forEach(fixedNumber => {
    if (fixedNumber) {
        fixedNumber.addEventListener('mouseenter', function() {
            this.style.fontSize = '1.5rem';
        });
        fixedNumber.addEventListener('mouseleave', function() {
            this.style.fontSize = '1.2rem';
        });
    }
});
