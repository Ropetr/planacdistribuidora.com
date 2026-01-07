// ===== PLANAC - JS GLOBAL OTIMIZADO =====
// Otimizado para Core Web Vitals (INP, LCP, CLS)

// Toggle mobile menu com melhor acessibilidade
function toggleMenu() {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    const isActive = menu.classList.toggle('active');
    
    // Atualizar ARIA
    hamburger.setAttribute('aria-expanded', isActive);
    menu.setAttribute('aria-hidden', !isActive);
    
    // Fechar menu ao clicar fora
    if (isActive) {
        document.addEventListener('click', closeMenuOnClickOutside);
    } else {
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

function closeMenuOnClickOutside(e) {
    const menu = document.getElementById('mobileMenu');
    const hamburger = document.querySelector('.hamburger');
    if (!menu.contains(e.target) && !hamburger.contains(e.target)) {
        menu.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        menu.setAttribute('aria-hidden', 'true');
        document.removeEventListener('click', closeMenuOnClickOutside);
    }
}

// Hero Carousel otimizado com requestAnimationFrame
let currentSlide = 0;
let slides = [];
let dots = [];
let autoSlideInterval = null;

function initCarousel() {
    slides = document.querySelectorAll('.hero-slide');
    dots = document.querySelectorAll('.hero-dot');
    
    if (slides.length > 0) {
        // Iniciar auto-rotação
        startAutoSlide();
        
        // Pausar ao hover/focus para melhor UX
        const carousel = document.querySelector('.hero-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', stopAutoSlide);
            carousel.addEventListener('mouseleave', startAutoSlide);
            carousel.addEventListener('focusin', stopAutoSlide);
            carousel.addEventListener('focusout', startAutoSlide);
        }
        
        // Suporte a teclado para dots
        dots.forEach((dot, index) => {
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    goToSlide(index);
                }
            });
        });
    }
}

function goToSlide(index) {
    if (slides.length === 0) return;
    
    // Usar requestAnimationFrame para transições suaves
    requestAnimationFrame(() => {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        dots[currentSlide].setAttribute('aria-selected', 'false');
        dots[currentSlide].setAttribute('tabindex', '-1');
        
        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;
        
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
        dots[currentSlide].setAttribute('aria-selected', 'true');
        dots[currentSlide].setAttribute('tabindex', '0');
    });
}

function nextSlide() {
    goToSlide(currentSlide + 1);
}

function startAutoSlide() {
    if (!autoSlideInterval && slides.length > 1) {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }
}

function stopAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
    }
}

// Phone mask otimizado com debounce
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function initPhoneMask() {
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', debounce(function(e) {
            let v = e.target.value.replace(/\D/g, '');
            if (v.length > 11) v = v.slice(0, 11);
            if (v.length > 10) v = v.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
            else if (v.length > 6) v = v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
            else if (v.length > 2) v = v.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
            else v = v.replace(/^(\d*)/, '($1');
            e.target.value = v;
        }, 50));
    }
}

// Form submission otimizado
function handleSubmit(e, productName) {
    e.preventDefault();
    const f = e.target;
    const msg = `*Solicitação de Orçamento - ${productName}*\n\n*Nome:* ${f.nome.value}\n*E-mail:* ${f.email.value}\n*Telefone:* ${f.telefone.value}\n*Cidade:* ${f.cidade.value}\n*Tipo:* ${f.tipo?.value || 'Não especificado'}\n\n*Detalhes:*\n${f.mensagem.value}`;
    window.open(`https://api.whatsapp.com/send/?phone=5543984182582&text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

// Smooth scroll otimizado com passive listeners
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Atualizar URL sem recarregar
                    history.pushState(null, null, href);
                }
            }
        }, { passive: false });
    });
}

// Lazy loading para imagens de background
function initLazyBackgrounds() {
    if ('IntersectionObserver' in window) {
        const lazyBackgrounds = document.querySelectorAll('.product-image[data-bg]');
        const backgroundObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bg = entry.target.dataset.bg;
                    entry.target.style.backgroundImage = `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)),url('${bg}')`;
                    backgroundObserver.unobserve(entry.target);
                }
            });
        }, { rootMargin: '100px' });
        
        lazyBackgrounds.forEach(bg => backgroundObserver.observe(bg));
    }
}

// Tracking de eventos para GTM/GA4
function trackEvent(action, category, label) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': 'custom_event',
            'event_action': action,
            'event_category': category,
            'event_label': label
        });
    }
}

// Inicialização quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initPhoneMask();
    initSmoothScroll();
    initLazyBackgrounds();
    
    // Track clicks em CTAs
    document.querySelectorAll('[data-action]').forEach(el => {
        el.addEventListener('click', function() {
            trackEvent(this.dataset.action, this.dataset.page || 'unknown', this.dataset.device || 'unknown');
        }, { passive: true });
    });
}, { once: true });

// Preload de próximas páginas ao hover (melhora navegação)
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        document.querySelectorAll('a[href$=".html"]').forEach(link => {
            link.addEventListener('mouseenter', function() {
                const href = this.getAttribute('href');
                if (href && !document.querySelector(`link[href="${href}"]`)) {
                    const preload = document.createElement('link');
                    preload.rel = 'prefetch';
                    preload.href = href;
                    document.head.appendChild(preload);
                }
            }, { passive: true, once: true });
        });
    }
}, { once: true });
