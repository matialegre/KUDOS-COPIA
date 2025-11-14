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

// Calcular y mostrar descuentos en productos
isElementLoaded('.cart-items tbody').then(() => {
  const updateDiscounts = () => {
    const productItems = document.querySelectorAll('.product-item');
    
    productItems.forEach(item => {
      const oldPrice = item.querySelector('.old-product-price');
      const newPrice = item.querySelector('.new-product-price');
      const priceContainer = item.querySelector('.product-price');
      
      if (oldPrice && newPrice && priceContainer) {
        const oldValue = parseFloat(oldPrice.textContent.replace(/[^0-9,]/g, '').replace(',', '.'));
        const newValue = parseFloat(newPrice.textContent.replace(/[^0-9,]/g, '').replace(',', '.'));
        
        if (oldValue > newValue) {
          const discount = Math.round(((oldValue - newValue) / oldValue) * 100);
          if (discount > 0) {
            priceContainer.removeAttribute('data-discount');
          } else {
            priceContainer.removeAttribute('data-discount');
          }
        } else {
          priceContainer.removeAttribute('data-discount');
        }
      }
    });
  };
  
  updateDiscounts();
  
  // Observer para detectar cambios en el carrito
  const observer = new MutationObserver(updateDiscounts);
  observer.observe(document.querySelector('.cart-items tbody'), { 
    childList: true, 
    subtree: true 
  });
});

// Agregar precio sin impuestos nacionales
isElementLoaded('.quantity-price .total-selling-price').then(() => {
  const addTaxFreePrice = () => {
    const totalPrices = document.querySelectorAll('.quantity-price');
    
    totalPrices.forEach(priceCell => {
      const totalPrice = priceCell.querySelector('.total-selling-price');
      
      if (totalPrice && !priceCell.querySelector('.price-without-tax')) {
        const priceText = totalPrice.textContent.replace(/[^0-9,.]/g, '');
        const priceValue = parseFloat(priceText.replace(/\./g, '').replace(',', '.'));
        
        if (!isNaN(priceValue)) {
          const priceWithoutTax = priceValue / 1.21; // Asumiendo 21% de IVA
          
          const taxFreeElement = document.createElement('div');
          taxFreeElement.className = 'price-without-tax';
          taxFreeElement.textContent = `P. SIN IMP.: $${priceWithoutTax.toFixed(3).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
          
          priceCell.appendChild(taxFreeElement);
        }
      }
    });
  };
  
  addTaxFreePrice();
  
  // Observer para detectar cambios
  const observer = new MutationObserver(addTaxFreePrice);
  const cartItems = document.querySelector('.cart-items tbody');
  if (cartItems) {
    observer.observe(cartItems, { 
      childList: true, 
      subtree: true 
    });
  }
});

// Agregar opciones de envío/retiro
isElementLoaded('.summary-totalizers .accordion-body').then((accordionBody) => {
  
  // Crear el contenedor de opciones de envío si no existe
  if (!document.querySelector('.shipping-options')) {
    const shippingOptions = document.createElement('div');
    shippingOptions.className = 'shipping-options';
    shippingOptions.innerHTML = `
      <div class="shipping-option" onclick="window.location.href='#/shipping'">
        <img src="https://mundooutdoorar.vtexassets.com/arquivos/retirocompras.png" alt="Retiro">
        <div class="shipping-option-content">
          <div class="option-title">Retiro</div>
          <div class="option-subtitle">(Por una sucursal)</div>
          <div class="option-action">Seleccioná sucursal</div>
        </div>
      </div>
      <div class="shipping-option" onclick="window.location.href='#/shipping'">
        <img src="https://mundooutdoorar.vtexassets.com/arquivos/camioncompras.png" alt="Envío">
        <div class="shipping-option-content">
          <div class="option-title">Envío</div>
          <div class="option-subtitle">(A domicilio)</div>
          <div class="option-action">Insertar dirección</div>
        </div>
      </div>
    `;
    
    // Insertar antes del accordion-body
    accordionBody.parentNode.insertBefore(shippingOptions, accordionBody);
  }
});

isElementLoaded('.custom201PaymentGroupPaymentGroup .payment-description').then((selector) => {
  
  selector.innerHTML = selector.innerHTML.replaceAll('&lt;br&gt;', '<br/>');

  window.addEventListener('hashchange', function () {

    let textoPago2 = document.querySelector('.custom201PaymentGroupPaymentGroup .payment-description');
    textoPago2.innerHTML = textoPago2.innerHTML.replaceAll('&lt;br&gt;', '<br/>');
    
  });

});

// Reemplazar enlace del primer logo del footer por WhatsApp
isElementLoaded('.main-footer .footer .container a').then((footerLink) => {
  if (footerLink) {
    footerLink.href = 'https://wa.me/5492914662724';
    footerLink.target = '_blank';
    footerLink.rel = 'noopener noreferrer';
  }
});