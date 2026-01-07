// ===== PLANAC - JS GLOBAL =====

// Toggle mobile menu
function toggleMenu() {
    document.getElementById('mobileMenu').classList.toggle('active');
}

// Hero Carousel
let currentSlide = 0;
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.hero-dot');

function goToSlide(index) {
    if (slides.length === 0) return;
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = index;
    if (currentSlide >= slides.length) currentSlide = 0;
    if (currentSlide < 0) currentSlide = slides.length - 1;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

// Auto rotate every 5 seconds
if (slides.length > 0) {
    setInterval(nextSlide, 5000);
}

// Phone mask
document.addEventListener('DOMContentLoaded', function() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            else v = v.replace(/^(\d*)/, '($1');
            e.target.value = v;
        });
    }
});

// Form submission
function handleSubmit(e, productName) {
    e.preventDefault();
    const f = e.target;
    const msg = `*Solicitação de Orçamento - ${productName}*\n\n*Nome:* ${f.nome.value}\n*E-mail:* ${f.email.value}\n*Telefone:* ${f.telefone.value}\n*Cidade:* ${f.cidade.value}\n*Tipo:* ${f.tipo.value || 'Não especificado'}\n\n*Detalhes:*\n${f.mensagem.value}`;
    window.open(`https://api.whatsapp.com/send/?phone=5543984182582&text=${encodeURIComponent(msg)}`, '_blank');
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
