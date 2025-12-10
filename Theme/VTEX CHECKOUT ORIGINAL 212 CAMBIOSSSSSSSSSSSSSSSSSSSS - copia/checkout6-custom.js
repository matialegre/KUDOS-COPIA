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

/* --- SCRIPT REFACTORIZACIÓN RESUMEN COMPRA (ESTRATEGIA SEGURA) --- */
$(document).ready(function() {
    
    function setupCheckoutProxyButtons() {
        var $sidebar = $('.summary-template-holder .summary-totalizers tbody').length 
            ? $('.summary-template-holder .summary-totalizers') 
            : $('.summary-template-holder');

        // 1. CREAR BOTÓN "FINALIZAR COMPRA" (PROXY)
        // Buscamos el botón original (el que controla VTEX)
        var $originalBtn = $('.vtex-omnishipping-1-x-submitPaymentButton button, #btn-go-to-payment, .submit-payment-button .submit').first();
        
        // Solo si existe el original y no hemos creado ya el proxy
        if ($originalBtn.length && $('#custom-finish-payment-btn').length === 0) {
            
            var $proxyBtn = $('<button id="custom-finish-payment-btn">FINALIZAR COMPRA</button>');
            
            $proxyBtn.css({
                'background-color': '#000',
                'color': '#fff',
                'width': '100%',
                'height': '48px',
                'border': 'none',
                'border-radius': '4px',
                'font-weight': '700',
                'font-size': '14px',
                'text-transform': 'uppercase',
                'cursor': 'pointer',
                'margin-top': '16px',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'letter-spacing': '0.5px'
            });

            // Al hacer clic en el proxy, clickeamos el original
            $proxyBtn.on('click', function(e) {
                e.preventDefault();
                if (!$originalBtn.prop('disabled')) {
                    $originalBtn.click();
                }
            });

            // Insertar en el sidebar (al final)
            $sidebar.append($proxyBtn);
        }

        // Sincronizar estado disabled/texto del proxy con el original (opcional pero bueno para UX)
        if ($originalBtn.length && $('#custom-finish-payment-btn').length) {
             var $proxy = $('#custom-finish-payment-btn');
             if ($originalBtn.prop('disabled')) {
                 $proxy.css('opacity', '0.5').prop('disabled', true);
             } else {
                 $proxy.css('opacity', '1').prop('disabled', false);
             }
        }

        // 2. CREAR BOTÓN "VOLVER AL CARRITO"
        // Verificamos si ya existe nuestro botón custom
        if ($('#custom-back-to-cart-btn').length === 0) {
            var $backBtn = $('<a id="custom-back-to-cart-btn" href="/checkout/#/cart">VOLVER AL CARRITO</a>');
            
            $backBtn.css({
                'background-color': '#F5F5F5',
                'color': '#434343',
                'width': '100%',
                'height': '48px',
                'border': '1px solid #E0E0E0',
                'border-radius': '4px',
                'font-weight': '700',
                'font-size': '14px',
                'text-transform': 'uppercase',
                'cursor': 'pointer',
                'margin-top': '12px',
                'display': 'flex',
                'align-items': 'center',
                'justify-content': 'center',
                'text-decoration': 'none',
                'box-sizing': 'border-box',
                'letter-spacing': '0.5px'
            });

            // Insertar después del botón de finalizar
            $sidebar.append($backBtn);
        }

        // 3. OCULTAR ELEMENTOS ORIGINALES DUPLICADOS
        // Ocultamos el link viejo de "Volver a carrito" que viene por defecto
        $('.summary-template-holder a[href*="/cart"]').not('#custom-back-to-cart-btn').hide();
        
        // 4. FORZAR ESTILOS DE IMÁGENES Y TEXTOS
        $('.summary-template-holder img').each(function() {
            if ($(this).width() < 70) { // Solo si son las chicas
                $(this).css({
                    'width': '72px',
                    'height': '72px',
                    'max-width': '72px',
                    'min-width': '72px',
                    'object-fit': 'cover',
                    'border-radius': '4px'
                });
            }
        });
        
        // Fondo blanco al panel de productos
        $('.summary-template-holder .cart, .summary-template-holder .summary-cart-template-holder').css({
             'background': '#fff',
             'padding': '16px',
             'border-radius': '4px',
             'box-shadow': '0 1px 3px rgba(0,0,0,0.08)',
             'margin-bottom': '16px'
        });
    }

    // Ejecutar en intervalos cortos para reaccionar a cambios de VTEX
    setInterval(setupCheckoutProxyButtons, 500);
});