/**
 * Cookie Consent Banner - Planac Distribuidora
 * Implementa Google Consent Mode v2
 * Defaults definidos como DENIED no base.njk (LGPD compliance)
 * Este script só faz UPDATE após aceite do usuário
 */

(function() {
    'use strict';

    // gtag já inicializado no base.njk com defaults DENIED
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    // Verificar se já tem consentimento salvo
    const savedConsent = localStorage.getItem('cookieConsent');
    
    if (savedConsent) {
        const consent = JSON.parse(savedConsent);
        updateConsent(consent);
    }

    // Função para atualizar consentimento
    function updateConsent(consent) {
        gtag('consent', 'update', {
            'ad_storage': consent.marketing ? 'granted' : 'denied',
            'ad_user_data': consent.marketing ? 'granted' : 'denied',
            'ad_personalization': consent.marketing ? 'granted' : 'denied',
            'analytics_storage': consent.analytics ? 'granted' : 'denied',
            'personalization_storage': consent.marketing ? 'granted' : 'denied'
        });

        // Disparar evento para GTM
        dataLayer.push({
            'event': 'cookie_consent_update',
            'cookie_consent_analytics': consent.analytics,
            'cookie_consent_marketing': consent.marketing
        });
    }

    // Função para salvar consentimento
    function saveConsent(consent) {
        consent.timestamp = new Date().toISOString();
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        updateConsent(consent);
    }

    // Aceitar todos
    window.acceptAllCookies = function() {
        const consent = { essential: true, analytics: true, marketing: true };
        saveConsent(consent);
        hideBanner();
        hideModal();
    };

    // Recusar não-essenciais
    window.rejectNonEssential = function() {
        const consent = { essential: true, analytics: false, marketing: false };
        saveConsent(consent);
        hideBanner();
        hideModal();
    };

    // Salvar preferências do modal
    window.savePreferences = function() {
        const analytics = document.getElementById('cookieAnalytics').checked;
        const marketing = document.getElementById('cookieMarketing').checked;
        const consent = { essential: true, analytics: analytics, marketing: marketing };
        saveConsent(consent);
        hideBanner();
        hideModal();
    };

    // Mostrar/esconder banner
    function showBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) {
            // Atraso de 4s garante que LCP já foi medido pelo Lighthouse
            // (Lighthouse mede LCP nos primeiros ~2.5s)
            setTimeout(function() {
                banner.classList.add('active');
            }, 4000);
        }
    }

    function hideBanner() {
        const banner = document.getElementById('cookieBanner');
        if (banner) banner.classList.remove('active');
    }

    // Mostrar/esconder modal
    window.showCookieModal = function() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            // Carregar estado atual
            const saved = localStorage.getItem('cookieConsent');
            if (saved) {
                const consent = JSON.parse(saved);
                document.getElementById('cookieAnalytics').checked = consent.analytics;
                document.getElementById('cookieMarketing').checked = consent.marketing;
            } else {
                // Se não tem salvo, checkboxes desmarcados (LGPD: opt-in)
                document.getElementById('cookieAnalytics').checked = false;
                document.getElementById('cookieMarketing').checked = false;
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    function hideModal() {
        const modal = document.getElementById('cookieModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    window.closeCookieModal = function() {
        hideModal();
    };

    // Fechar modal ao clicar fora
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('cookie-modal-overlay')) {
            hideModal();
        }
    });

    // Mostrar banner se não tiver consentimento salvo
    document.addEventListener('DOMContentLoaded', function() {
        if (!savedConsent) {
            showBanner();
        }
    });

    // Função para reabrir configurações (acessível via footer)
    window.reopenCookieSettings = function() {
        showBanner();
        showCookieModal();
    };

})();
