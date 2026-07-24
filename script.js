// Remover splash screen após animação
window.addEventListener('load', () => {
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen) {
            splashScreen.style.pointerEvents = 'none';
        }
    }, 3000);
});

// Gerar números flutuantes aleatórios (estilo Mason numbers de COD)
function createFloatingNumber() {
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    const floatingNum = document.createElement('div');
    floatingNum.className = 'floating-number';
    floatingNum.textContent = randomNumber;
    
    // Posição aleatória na tela
    const randomX = Math.random() * (window.innerWidth - 50);
    const randomY = window.innerHeight + 50;
    
    floatingNum.style.left = randomX + 'px';
    floatingNum.style.top = randomY + 'px';
    
    // Duração aleatória para variação
    const duration = 4 + Math.random() * 4;
    floatingNum.style.animationDuration = duration + 's';
    
    document.body.appendChild(floatingNum);
    
    // Remover elemento após animação
    setTimeout(() => {
        floatingNum.remove();
    }, duration * 1000);
}

// Criar números flotuantes continuamente
setInterval(() => {
    if (Math.random() > 0.4) {
        createFloatingNumber();
    }
}, 800);

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
const fixedNumber = document.querySelector('.fixed-number');
if (fixedNumber) {
    fixedNumber.addEventListener('mouseenter', function() {
        this.style.fontSize = '1.5rem';
    });
    fixedNumber.addEventListener('mouseleave', function() {
        this.style.fontSize = '1.2rem';
    });
}
