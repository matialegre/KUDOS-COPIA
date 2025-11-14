// DEVICE FINGERPRINT //

function createUUID () {
  let d = new Date().getTime();
  const format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  
  return format.replace(/[xy]/g, (c) => {
    const r = (d + Math.random()*16)%16 | 0;
    d = Math.floor(d/16);
    return c === 'x' ? r : (r&0x3|0x8).toString(16);
  });
}

function addDeviceFingerPrint() {
  if (!window.vtex || window.vtex.deviceFingerprint) return;

  const ORG_ID = "k8vif92e";
  const MERCHANT_ID = "decidir_agregador";
  const sessionId = createUUID();

  window.vtex.deviceFingerprint = sessionId;

  const script = document.createElement("script");

  script.type = "text/javascript";
  script.src = `https://h.online-metrix.net/fp/tags.js?org_id=${ORG_ID}&session_id=${MERCHANT_ID}${sessionId}`;

  document.head.appendChild(script);

  const noScript = document.createElement("noscript");
  const iframe = document.createElement("iframe");

  iframe.style = "width: 100px; height: 100px; border: 0; position: absolute; top: -5000px;";
  iframe.src = `https://h.online-metrix.net/fp/tags.js?org_id=${ORG_ID}&session_id=${MERCHANT_ID}${sessionId}`;

  noScript.appendChild(iframe);

  document.body.appendChild(noScript);
}

const isElementLoaded = async selector => {
  while (document.querySelector(selector) === null) {
    await new Promise(resolve => requestAnimationFrame(resolve));
  }
  return document.querySelector(selector);
};

const BRAND_LOGO_URL = 'https://mundooutdoorar.vtexassets.com/arquivos/logo_izq_arriba.png';
const HEADER_BG = '#090a10';

function applyHeaderBranding(header) {
  if (!header) return;

  header.classList.add('header--dark');
  header.style.backgroundColor = HEADER_BG;
  header.style.color = '#ffffff';

  const container = header.querySelector('.container');
  if (container) {
    container.style.background = 'transparent';
    container.style.alignItems = 'center';
  }

  header.querySelectorAll('a, span, p, svg').forEach(el => {
    if ('style' in el) {
      el.style.color = '#ffffff';
      el.style.fill = '#ffffff';
    }
  });
}

function swapCheckoutLogos(root = document) {
  const logos = root.querySelectorAll('.logoCheckout img, img.logoCheckout, .header-logo img');

  logos.forEach(logo => {
    logo.src = BRAND_LOGO_URL;
    logo.alt = 'Mundo Outdoor';
    logo.removeAttribute('srcset');
    logo.removeAttribute('data-src');
    if ('currentSrc' in logo) {
      logo.currentSrc = BRAND_LOGO_URL;
    }
    logo.style.objectFit = 'contain';
    logo.style.height = '40px';
    logo.style.width = 'auto';
  });
}

window.addEventListener('DOMContentLoaded', () => {
  addDeviceFingerPrint();

  isElementLoaded('.header').then(header => {
    // Top bar removido por solicitud del usuario

    applyHeaderBranding(header);
    swapCheckoutLogos(header);

    const observer = new MutationObserver(() => {
      applyHeaderBranding(header);
      swapCheckoutLogos(header);
    });

    observer.observe(header, { childList: true, subtree: true });
  });

  swapCheckoutLogos();
});
// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
isElementLoaded('.custom201PaymentGroupPaymentGroup .payment-description').then((selector) => {
  
  selector.innerHTML = selector.innerHTML.replaceAll('&lt;br&gt;', '<br/>');

  window.addEventListener('hashchange', function () {

    let textoPago2 = document.querySelector('.custom201PaymentGroupPaymentGroup .payment-description');
    textoPago2.innerHTML = textoPago2.innerHTML.replaceAll('&lt;br&gt;', '<br/>');
    
  });

});
