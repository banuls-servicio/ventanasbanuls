/**
 * Google Analytics 4 (GA4) & GDPR/RGPD Cookie Consent Manager
 * Fully compliant with Spanish AEPD, LSSI-CE and Google Consent Mode v2 (DMA 2024)
 * 
 * Instructions:
 * Replace 'G-XXXXXXXXXX' below with your Google Analytics 4 Measurement ID
 * (e.g. G-ABC123XYZ) obtained from your Google Analytics Admin panel.
 */

const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // <- Reemplaza por tu ID de medición GA4 cuando lo crees

// 1. Google Consent Mode v2 - Default State (DENIED by default until user gives explicit consent)
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}

gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});

gtag('js', new Date());
gtag('config', GA_MEASUREMENT_ID, {
  'anonymize_ip': true,
  'cookie_flags': 'SameSite=None;Secure'
});

// 2. Load Google tag script asynchronously
(function() {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
})();

// 3. GDPR Cookie Consent Banner Lifecycle
document.addEventListener('DOMContentLoaded', () => {
  initCookieConsent();
  initAnalyticsLeadTracking();
});

function initCookieConsent() {
  const CONSENT_KEY = 'banuls_cookie_consent_v2';
  const currentConsent = localStorage.getItem(CONSENT_KEY);

  // If user previously accepted, grant analytics
  if (currentConsent === 'granted') {
    applyConsent('granted', false);
    return;
  } else if (currentConsent === 'denied') {
    applyConsent('denied', false);
    return;
  }

  // If no choice made yet, create and show banner
  showCookieBanner();

  // Attach listener to any footer link or button to re-open settings
  document.querySelectorAll('.open-cookie-settings, a[href="#cookies-config"]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showCookieBanner();
    });
  });
}

function showCookieBanner() {
  let banner = document.getElementById('cookie-consent-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-banner-title">
        <span>🍪</span> Configuración de Privacidad y Cookies
      </div>
      <p class="cookie-banner-text">
        Utilizamos cookies técnicas necesarias para el funcionamiento del sitio web y, de forma opcional, cookies analíticas de Google Analytics 4 para analizar el tráfico y mejorar tu experiencia. Puedes aceptarlas todas, rechazarlas o consultar nuestra <a href="politica-cookies.html">Política de Cookies</a>.
      </p>
      <div class="cookie-banner-actions">
        <button type="button" class="btn-cookie-accept" id="btn-accept-cookies">Aceptar todas</button>
        <button type="button" class="btn-cookie-reject" id="btn-reject-cookies">Solo necesarias</button>
        <a href="politica-cookies.html" class="cookie-link-more" style="font-size: 0.78rem; color: #94A3B8; text-decoration: underline; margin-left: auto;">Más información</a>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('btn-accept-cookies').addEventListener('click', () => {
      applyConsent('granted', true);
    });

    document.getElementById('btn-reject-cookies').addEventListener('click', () => {
      applyConsent('denied', true);
    });
  }

  banner.style.display = 'block';
}

function applyConsent(status, saveToStorage) {
  const CONSENT_KEY = 'banuls_cookie_consent_v2';
  if (saveToStorage) {
    localStorage.setItem(CONSENT_KEY, status);
  }

  if (status === 'granted') {
    gtag('consent', 'update', {
      'analytics_storage': 'granted'
    });
    // Send standard page_view event now that analytics are permitted
    gtag('event', 'page_view');
  } else {
    gtag('consent', 'update', {
      'analytics_storage': 'denied'
    });
  }

  const banner = document.getElementById('cookie-consent-banner');
  if (banner) {
    banner.style.display = 'none';
  }
}

// 4. Automated Conversion / Lead Tracking for GA4
function initAnalyticsLeadTracking() {
  // Track WhatsApp button clicks
  document.querySelectorAll('a[href*="wa.me"], a[href*="whatsapp"]').forEach(waBtn => {
    waBtn.addEventListener('click', () => {
      gtag('event', 'generate_lead', {
        'event_category': 'Contact',
        'event_label': 'WhatsApp Click',
        'method': 'WhatsApp'
      });
    });
  });

  // Track Direct Phone Call clicks
  document.querySelectorAll('a[href*="tel:"]').forEach(telBtn => {
    telBtn.addEventListener('click', () => {
      gtag('event', 'contact', {
        'event_category': 'Phone Call',
        'event_label': 'Direct Call 601281313'
      });
    });
  });

  // Track Quote form submissions
  const quoteForm = document.getElementById('quick-quote-form');
  if (quoteForm) {
    quoteForm.addEventListener('submit', () => {
      gtag('event', 'generate_lead', {
        'event_category': 'Form',
        'event_label': 'Presupuesto Solicitado Ventanas',
        'method': 'Web Quote Form'
      });
    });
  }
}
