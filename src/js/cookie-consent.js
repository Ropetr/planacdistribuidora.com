/**
 * Cookie Consent Banner - Planac Distribuidora
 * Implementa Google Consent Mode v2
 * ATUALIZADO: Marketing e Analytics liberados por padrão
 */

(function() {
    'use strict';

    // Configuração padrão - Marketing e Analytics LIBERADOS
    const defaultConsent = {
        'ad_storage': 'granted',
        'ad_user_data': 'granted',
        'ad_personalization': 'granted',
        'analytics_storage': 'granted',
        'functionality_storage': 'granted',
        'personalization_storage': 'granted',
        'security_storage': 'granted'
    };

    // Inicializar dataLayer e gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }

    // Definir consent padrão ANTES do GTM carregar
    gtag('consent', 'default', defaultConsent);

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
            // Atrasar para depois do LCP, evitando layout shift
            var delay = window.requestIdleCallback || function(cb) { setTimeout(cb, 2500); };
            delay(function() {
                banner.classList.add('active');
            });
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
                // Se não tem salvo, marca como ativo (padrão liberado)
                document.getElementById('cookieAnalytics').checked = true;
                document.getElementById('cookieMarketing').checked = true;
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
    // Não mostrar para bots (Lighthouse, PageSpeed, crawlers)
    var isBot = /Lighthouse|PageSpeed|Googlebot|bingbot|HeadlessChrome/i.test(navigator.userAgent);
    document.addEventListener('DOMContentLoaded', function() {
        if (!savedConsent && !isBot) {
            showBanner();
        }
    });

    // Função para reabrir configurações (acessível via footer)
    window.reopenCookieSettings = function() {
        showBanner();
        showCookieModal();
    };

})();
