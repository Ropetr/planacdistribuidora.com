'use strict';

// ===== PLANAC - JS GLOBAL OTIMIZADO =====
// Menu functions (toggleMenu, closeMenuOnClickOutside, toggleDropdown)
// estão inline no base.njk para prevenir FOUC - não duplicar aqui

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
    const msg = `*Solicitação de Orçamento - ${productName}*

*Nome:* ${f.nome.value}
*E-mail:* ${f.email.value}
*Telefone:* ${f.telefone.value}
*Cidade:* ${f.cidade.value}
*Tipo:* ${f.tipo?.value || 'Não especificado'}

*Detalhes:*
${f.mensagem.value}`;
    window.open(`https://wa.me/5543984182582?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
}

// Smooth scroll com event delegation (1 listener em vez de N)
function initSmoothScroll() {
    document.addEventListener('click', function(e) {
        const a = e.target.closest('a[href^="#"]');
        if (!a) return;
        const href = a.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.pushState(null, null, href);
            }
        }
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

// Tracking de eventos para GTM/GA4 - Profissional
function trackEvent(action, category, label, value) {
    if (typeof dataLayer !== 'undefined') {
        dataLayer.push({
            'event': action,
            'event_category': category,
            'event_label': label,
            'event_value': value || undefined
        });
    }
}

// Rastreamento automático de cliques em WhatsApp
function initWhatsAppTracking() {
    document.querySelectorAll('a[href*="whatsapp"], a[href*="wa.me"]').forEach(function(el) {
        el.addEventListener('click', function() {
            trackEvent('whatsapp_click', 'contato', this.textContent.trim() || 'WhatsApp');
        }, { passive: true });
    });
}

// Rastreamento automático de cliques em telefone
function initPhoneTracking() {
    document.querySelectorAll('a[href^="tel:"]').forEach(function(el) {
        el.addEventListener('click', function() {
            trackEvent('phone_click', 'contato', this.href.replace('tel:', ''));
        }, { passive: true });
    });
}

// Rastreamento de scroll com throttle (max 1x a cada 200ms)
function initScrollTracking() {
    var scrollThresholds = [25, 50, 75, 100];
    var scrollFired = {};
    var ticking = false;

    window.addEventListener('scroll', function() {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function() {
            var scrollPercent = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
            scrollThresholds.forEach(function(threshold) {
                if (scrollPercent >= threshold && !scrollFired[threshold]) {
                    scrollFired[threshold] = true;
                    trackEvent('scroll_depth', 'engajamento', threshold + '%', threshold);
                }
            });
            ticking = false;
        });
    }, { passive: true });
}

// Rastreamento de cliques em redes sociais
function initSocialTracking() {
    document.querySelectorAll('a[href*="instagram.com"], a[href*="facebook.com"]').forEach(function(el) {
        el.addEventListener('click', function() {
            var platform = this.href.includes('instagram') ? 'instagram' : 'facebook';
            trackEvent('social_click', 'redes_sociais', platform);
        }, { passive: true });
    });
}

// Rastreamento de cliques em CTAs
function initCTATracking() {
    document.querySelectorAll('.btn-hero, .btn-header, .btn-orcamento, [data-action]').forEach(function(el) {
        el.addEventListener('click', function() {
            var action = this.dataset.action || 'cta_click';
            var label = this.textContent.trim() || 'CTA';
            trackEvent(action, 'conversao', label);
        }, { passive: true });
    });
}

// Rastreamento de visualização de localização (Google Maps)
function initMapsTracking() {
    document.querySelectorAll('a[href*="maps"], a[href*="goo.gl/maps"]').forEach(function(el) {
        el.addEventListener('click', function() {
            trackEvent('maps_click', 'contato', 'google_maps');
        }, { passive: true });
    });
}

// Upload de projeto com notificação por email (centralizado)
async function handleProjectSubmit(event, productName) {
    event.preventDefault();
    var btn = document.getElementById('btnSubmit');
    var status = document.getElementById('uploadStatus');
    var arquivo = document.getElementById('arquivo').files[0];
    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var telefone = document.getElementById('telefone').value;
    var cidade = document.getElementById('cidade').value;
    var tipo = document.getElementById('tipo').value;
    var mensagem = document.getElementById('mensagem').value;
    var arquivoInfo = '';
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    status.style.display = 'block';
    status.style.background = '#e3f2fd';
    status.style.color = '#1976d2';
    status.textContent = arquivo ? 'Enviando arquivo e notificação...' : 'Enviando notificação...';
    try {
        var formData = new FormData();
        formData.append('nome', nome);
        formData.append('email', email);
        formData.append('telefone', telefone);
        formData.append('cidade', cidade);
        formData.append('tipo', tipo);
        formData.append('mensagem', mensagem);
        if (arquivo) formData.append('arquivo', arquivo);
        var response = await fetch('https://planac-upload.planacacabamentos.workers.dev', { method: 'POST', body: formData });
        var result = await response.json();
        if (result.success) {
            if (arquivo && result.arquivo) {
                arquivoInfo = '\n\n📎 *Arquivo anexado:* ' + arquivo.name + '\n📦 Tamanho: ' + (arquivo.size / 1024 / 1024).toFixed(2) + ' MB\n🔗 Ref: ' + result.arquivo;
            }
            status.style.background = '#e8f5e9';
            status.style.color = '#2e7d32';
            status.textContent = result.emailEnviado ? '✅ Enviado! Email de notificação enviado para Planac.' : '✅ Enviado!';
        } else {
            throw new Error(result.error || 'Erro no envio');
        }
    } catch (error) {
        status.style.background = '#ffebee';
        status.style.color = '#c62828';
        status.textContent = '❌ Erro: ' + error.message;
        btn.disabled = false;
        btn.textContent = 'Enviar Projeto';
        return;
    }
    var msg = '*Novo Projeto para Cotação*\n\n' +
        '📦 *Produto:* ' + productName + '\n' +
        '👤 *Nome:* ' + nome + '\n' +
        '📧 *E-mail:* ' + email + '\n' +
        '📱 *Telefone:* ' + telefone + '\n' +
        '🏙️ *Cidade:* ' + cidade + '\n' +
        '🏗️ *Tipo:* ' + tipo + '\n\n' +
        '💬 *Detalhes:*\n' + mensagem + arquivoInfo;
    window.open('https://wa.me/5543984182582?text=' + encodeURIComponent(msg), '_blank');
    setTimeout(function() {
        btn.disabled = false;
        btn.textContent = 'Enviar Projeto';
        status.style.display = 'none';
        document.getElementById('formProjeto').reset();
    }, 3000);
}

// Inicialização quando DOM estiver pronto - críticos primeiro
document.addEventListener('DOMContentLoaded', function() {
    initCarousel();
    initPhoneMask();
    initSmoothScroll();
    initLazyBackgrounds();

    // Defer tracking para não bloquear thread principal
    var deferInit = window.requestIdleCallback || function(cb) { setTimeout(cb, 100); };
    deferInit(function() {
        initWhatsAppTracking();
        initPhoneTracking();
        initScrollTracking();
        initSocialTracking();
        initCTATracking();
        initMapsTracking();
    });
}, { once: true });

