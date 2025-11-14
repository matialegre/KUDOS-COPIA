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

window.addEventListener('DOMContentLoaded', () => {
  addDeviceFingerPrint();
});
// WARNING: THE USAGE OF CUSTOM SCRIPTS IS NOT SUPPORTED. VTEX IS NOT LIABLE FOR ANY DAMAGES THIS MAY CAUSE. THIS MAY BREAK YOUR STORE AND STOP SALES. IN CASE OF ERRORS, PLEASE DELETE THE CONTENT OF THIS SCRIPT.
  const isElementLoaded = async selector => {
  while ( document.querySelector(selector) === null) {
    await new Promise( resolve =>  requestAnimationFrame(resolve) )
  }
  return document.querySelector(selector);
};

isElementLoaded('.custom201PaymentGroupPaymentGroup .payment-description').then((selector) => {
  
  selector.innerHTML = selector.innerHTML.replaceAll('&lt;br&gt;', '<br/>');

  window.addEventListener('hashchange', function () {

    let textoPago2 = document.querySelector('.custom201PaymentGroupPaymentGroup .payment-description');
    textoPago2.innerHTML = textoPago2.innerHTML.replaceAll('&lt;br&gt;', '<br/>');
    
  });

});