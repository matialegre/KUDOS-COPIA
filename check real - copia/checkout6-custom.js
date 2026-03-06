// =====================================================
// DIAGNÓSTICO INICIAL - Verificar que el JS se está cargando
// =====================================================
console.log('🔥 PAGO_CHECK =========================================');
console.log('🔥 PAGO_CHECK checkout6-custom.js CARGADO CORRECTAMENTE');
console.log('🔥 PAGO_CHECK Fecha y hora:', new Date().toLocaleString());
console.log('🔥 PAGO_CHECK URL actual:', window.location.href);
console.log('🔥 PAGO_CHECK =========================================');

// DEVICE FINGERPRINT //

function createUUID() {
  let d = new Date().getTime();
  const format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

  return format.replace(/[xy]/g, (c) => {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return c === 'x' ? r : (r & 0x3 | 0x8).toString(16);
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
  while (document.querySelector(selector) === null) {
    await new Promise(resolve => requestAnimationFrame(resolve))
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

// =====================================================
// MINI-CART: Mostrar descuento por producto usando API VTEX
// =====================================================
const addMiniCartDiscounts = () => {
  // Usar la API de VTEX para obtener los datos del carrito
  if (typeof vtexjs !== 'undefined' && vtexjs.checkout) {
    const orderForm = vtexjs.checkout.orderForm;
    if (!orderForm || !orderForm.items) return;

    const miniCart = document.querySelector('.cart-template.mini-cart, .mini-cart');
    if (!miniCart) return;

    const products = miniCart.querySelectorAll('.hproduct, .product-item, tr.product-item');

    products.forEach((product, index) => {
      const item = orderForm.items[index];
      if (!item) return;

      // Buscar contenedor de precio
      const priceContainer = product.querySelector('.price, .product-price, td.product-price');
      if (!priceContainer) return;

      // Si ya tiene el descuento, no agregar de nuevo
      if (priceContainer.querySelector('.product-discount-value')) return;

      // Calcular descuento del item
      const listPrice = item.listPrice / 100; // VTEX guarda en centavos
      const sellingPrice = item.sellingPrice / 100;
      const quantity = item.quantity;

      if (listPrice > sellingPrice) {
        const discountPerUnit = listPrice - sellingPrice;
        const totalDiscount = discountPerUnit * quantity;

        const discountElement = document.createElement('span');
        discountElement.className = 'product-discount-value';
        discountElement.style.cssText = 'display: block; color: #2ecc71; font-size: 11px; font-weight: 600; margin-top: 2px;';
        discountElement.textContent = `-$${totalDiscount.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
        priceContainer.appendChild(discountElement);
      }
    });
  }
};

// Ejecutar cuando VTEX esté listo
const initMiniCartDiscounts = () => {
  if (typeof vtexjs !== 'undefined' && vtexjs.checkout) {
    // Ejecutar cuando el orderForm esté listo
    $(window).on('orderFormUpdated.vtex', () => {
      setTimeout(addMiniCartDiscounts, 100);
    });

    // Ejecutar inicial
    setTimeout(addMiniCartDiscounts, 500);
    
    // Ejecutar también cuando se abre el mini-cart
    const checkMiniCart = setInterval(() => {
      const miniCart = document.querySelector('.cart-template.mini-cart');
      if (miniCart && miniCart.offsetParent !== null) {
        addMiniCartDiscounts();
      }
    }, 200);
  } else {
    // Reintentar si VTEX no está listo
    setTimeout(initMiniCartDiscounts, 500);
  }
};

// Iniciar
initMiniCartDiscounts();

// MINI-CART: Agregar botón FINALIZAR PAGO siempre visible
// =====================================================
const addFinalizarPagoButton = () => {
  // NO agregar botón custom en la página de pago - dejar que el usuario use el botón nativo de VTEX
  if (window.location.hash.includes('/payment')) {
    return;
  }
  
  const miniCart = document.querySelector('.cart-template.mini-cart .cart-fixed, .mini-cart .cart-fixed');
  if (!miniCart) return;

  // Si ya existe el botón custom, no agregar
  if (miniCart.querySelector('.custom-finalizar-pago')) return;

  // Buscar los totalizadores para insertar después
  const totalizers = miniCart.querySelector('.totalizers, .summary-totalizers, .cart-totalizers');

  // Buscar el botón VOLVER AL CARRITO
  const volverBtn = miniCart.querySelector('.link-cart, .link-choose-more-products-wrapper, .cart-links');

  // Crear el contenedor de botones
  const buttonsContainer = document.createElement('div');
  buttonsContainer.className = 'custom-finalizar-pago';
  buttonsContainer.style.cssText = 'padding: 16px 20px 20px; width: 100%; box-sizing: border-box; display: flex; flex-direction: column; gap: 10px;';

  // Botón FINALIZAR PAGO
  const btnFinalizar = document.createElement('button');
  btnFinalizar.type = 'button';
  btnFinalizar.className = 'btn-finalizar-pago';
  btnFinalizar.textContent = 'FINALIZAR PAGO';
  btnFinalizar.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
  `;

  btnFinalizar.onmouseover = () => btnFinalizar.style.background = '#1a1a1a';
  btnFinalizar.onmouseout = () => btnFinalizar.style.background = '#000';

  btnFinalizar.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Detectar si estamos en la página de pago
    const currentHash = window.location.hash;
    const isOnPaymentPage = currentHash.includes('/payment');
    
    if (isOnPaymentPage) {
      // En página de pago: disparar el evento de submit del formulario de pago
      // Buscar y hacer click en el botón de submit del formulario de pago
      const paymentForm = document.querySelector('#payment-data form');
      if (paymentForm) {
        // Disparar submit del formulario
        const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
        paymentForm.dispatchEvent(submitEvent);
      }
      
      // También intentar disparar el evento de VTEX
      $(document).trigger('checkout.paymentSubmit');
      $(window).trigger('checkout.paymentSubmit');
    } else {
      // No estamos en página de pago: navegar a ella
      window.location.href = '/checkout/#/payment';
    }
  };

  // Botón VOLVER AL CARRITO
  const btnVolver = document.createElement('a');
  btnVolver.href = '/checkout/#/cart';
  btnVolver.className = 'btn-volver-carrito';
  btnVolver.textContent = 'VOLVER AL CARRITO';
  btnVolver.style.cssText = `
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    min-width: 100%;
    max-width: 100%;
    background: #fff;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 16px 20px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    transition: border-color 0.2s;
    box-sizing: border-box;
  `;

  btnVolver.onmouseover = () => btnVolver.style.borderColor = '#999';
  btnVolver.onmouseout = () => btnVolver.style.borderColor = '#ddd';

  buttonsContainer.appendChild(btnFinalizar);
  buttonsContainer.appendChild(btnVolver);

  // Ocultar el botón VOLVER AL CARRITO original y otros elementos de botones
  if (volverBtn) {
    volverBtn.style.display = 'none';
  }

  // Ocultar también payment-confirmation-wrap si existe
  const paymentWrap = miniCart.querySelector('.payment-confirmation-wrap');
  if (paymentWrap) {
    paymentWrap.style.display = 'none';
  }

  // Ocultar cart-links si existe
  const cartLinks = miniCart.querySelector('.cart-links');
  if (cartLinks) {
    cartLinks.style.display = 'none';
  }

  // Insertar AL FINAL del mini-cart (después de todo)
  miniCart.appendChild(buttonsContainer);
};

// Ejecutar cuando el mini-cart esté listo
isElementLoaded('.cart-template.mini-cart .cart-fixed').then(() => {
  setTimeout(addFinalizarPagoButton, 500);
  setTimeout(fixMiniCartProductNames, 600);
});

// También en cambios de hash
window.addEventListener('hashchange', () => {
  setTimeout(addFinalizarPagoButton, 500);
  setTimeout(fixMiniCartProductNames, 600);
});

// MINI-CART: Arreglar nombres de productos en vertical Y layout
// =====================================================
const fixMiniCartProductNames = () => {
  const miniCart = document.querySelector('.cart-template.mini-cart .cart-fixed, .mini-cart .cart-fixed');
  if (!miniCart) return;

  // Forzar que la tabla sea grid y SIN SCROLL - ALTURA AUTO
  const cartItems = miniCart.querySelector('.cart-items');
  if (cartItems) {
    cartItems.style.cssText = 'max-height: none !important; min-height: auto !important; height: auto !important; overflow: visible !important; overflow-y: visible !important; -ms-overflow-style: none !important; scrollbar-width: none !important;';
    
    // Forzar altura auto en el wrapper también
    const cartItemsWrapper = cartItems.parentElement;
    if (cartItemsWrapper) {
      cartItemsWrapper.style.cssText = 'max-height: none !important; min-height: auto !important; height: auto !important; overflow: visible !important;';
    }
    
    // Ocultar scrollbar con pseudo-elemento
    const style = document.createElement('style');
    style.textContent = `
      .mini-cart .cart-items::-webkit-scrollbar,
      .cart-template.mini-cart .cart-items::-webkit-scrollbar {
        display: none !important;
        width: 0 !important;
        height: 0 !important;
      }
    `;
    if (!document.querySelector('#hide-minicart-scrollbar')) {
      style.id = 'hide-minicart-scrollbar';
      document.head.appendChild(style);
    }
  }

  const table = miniCart.querySelector('.cart-items table');
  if (table) {
    table.style.cssText = 'display: block !important; width: 100% !important;';
  }

  const tbody = miniCart.querySelector('.cart-items tbody');
  if (tbody) {
    tbody.style.cssText = 'display: block !important; width: 100% !important;';
  }

  const products = miniCart.querySelectorAll('.hproduct, .product-item, tr.product-item, .cart-items tbody tr');
  
  products.forEach(product => {
    // Forzar FLEX layout en cada producto (imagen + columna)
    product.style.cssText = `
      display: flex !important;
      flex-direction: row !important;
      gap: 12px !important;
      padding: 12px 0 !important;
      border-bottom: 1px solid #eee !important;
      align-items: flex-start !important;
    `;

    // Imagen
    const img = product.querySelector('.product-image, td.product-image');
    if (img) {
      img.style.cssText = 'width: 70px !important; height: 70px !important; flex-shrink: 0 !important; order: -1 !important;';
      const imgTag = img.querySelector('img');
      if (imgTag) {
        imgTag.style.cssText = 'width: 70px !important; height: 70px !important; object-fit: contain !important;';
      }
    }

    // Contenedor de info (nombre + precio)
    const nameCell = product.querySelector('.product-name, td.product-name');
    const priceCell = product.querySelector('.product-price, td.product-price, .price, td.price');
    
    if (nameCell) {
      nameCell.style.cssText = 'display: flex !important; flex-direction: column !important; gap: 4px !important; flex: 1 !important; padding: 0 !important; order: 0 !important;';
      
      const link = nameCell.querySelector('a, .fn a');
      if (link) {
        const fullName = link.textContent.trim();
        
        // Buscar el talle en el orderForm de VTEX
        let sizeText = '';
        if (typeof vtexjs !== 'undefined' && vtexjs.checkout && vtexjs.checkout.orderForm) {
          const items = vtexjs.checkout.orderForm.items;
          const productIndex = Array.from(product.parentNode.children).indexOf(product);
          if (items[productIndex] && items[productIndex].additionalInfo) {
            const dimension = items[productIndex].additionalInfo.dimension;
            if (dimension && dimension.Tamaño) {
              sizeText = ` - Talle: ${dimension.Tamaño}`;
            } else if (dimension && dimension.Size) {
              sizeText = ` - Talle: ${dimension.Size}`;
            }
          }
        }
        
        link.textContent = fullName + sizeText;
        link.style.cssText = 'display: inline !important; font-size: 12px !important; color: #333 !important; line-height: 1.4 !important; white-space: normal !important; word-wrap: break-word !important; text-decoration: none !important;';
      }

      // Mover precio dentro del nombre
      if (priceCell && priceCell.parentNode !== nameCell) {
        nameCell.appendChild(priceCell);
      }
    }

    // Precio
    if (priceCell) {
      priceCell.style.cssText = 'display: block !important; text-align: left !important; margin: 0 !important; padding: 0 !important; order: 1 !important;';
    }

    // Forzar que todos los td sean block
    const allTds = product.querySelectorAll('td');
    allTds.forEach(td => {
      if (!td.classList.contains('product-image')) {
        td.style.display = 'block !important';
      }
    });
  });

  // Eliminar espacios en blanco AGRESIVAMENTE
  const emptyDivs = miniCart.querySelectorAll('div:empty, p:empty, br');
  emptyDivs.forEach(el => {
    el.style.cssText = 'display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important;';
  });

  // Forzar altura mínima 0 y ancho completo en todos los contenedores
  miniCart.style.cssText = 'min-height: auto !important; height: auto !important; padding-bottom: 0 !important; margin-bottom: 0 !important; width: 100% !important; max-width: 100% !important;';
  
  const cartFixed = miniCart.querySelector('.cart-fixed');
  if (cartFixed) {
    cartFixed.style.cssText = 'min-height: auto !important; height: auto !important; padding-bottom: 0 !important; margin-bottom: 0 !important; width: 100% !important; max-width: 100% !important; padding-left: 0 !important; padding-right: 0 !important;';
  }

  const summaryHolder = miniCart.querySelector('.summary-cart-template-holder');
  if (summaryHolder) {
    summaryHolder.style.cssText = 'min-height: auto !important; height: auto !important; padding: 0 !important; margin: 0 !important; width: 100% !important; max-width: 100% !important;';
  }

  // Forzar ancho completo en resumen de compra
  const totalizers = miniCart.querySelector('.totalizers, .summary-totalizers');
  if (totalizers) {
    totalizers.style.cssText = 'width: 100% !important; max-width: 100% !important; padding-left: 20px !important; padding-right: 20px !important; box-sizing: border-box !important;';
  }

  // Forzar ancho completo en botones y eliminar elementos después
  const customButtons = miniCart.querySelector('.custom-finalizar-pago');
  if (customButtons) {
    customButtons.style.cssText = 'padding: 10px 20px 20px !important; width: 100% !important; max-width: 100% !important; box-sizing: border-box !important; margin: 0 !important;';
    
    // Eliminar todo lo que esté después de los botones
    let nextEl = customButtons.nextElementSibling;
    while (nextEl) {
      nextEl.style.cssText = 'display: none !important; height: 0 !important; margin: 0 !important; padding: 0 !important;';
      nextEl = nextEl.nextElementSibling;
    }
  }
};

// Observer para detectar cambios en el mini-cart
const observeMiniCart = () => {
  const miniCart = document.querySelector('.cart-template.mini-cart .cart-fixed, .mini-cart .cart-fixed');
  if (!miniCart) {
    setTimeout(observeMiniCart, 500);
    return;
  }

  const observer = new MutationObserver(() => {
    fixMiniCartProductNames();
  });

  observer.observe(miniCart, {
    childList: true,
    subtree: true
  });
};

observeMiniCart();

// =====================================================
// MÉTODOS DE PAGO - Estructura .payment-card (IDEMPOTENTE)
// Icono + Título + Subtítulo verde
// =====================================================

// Limpiar restos de implementaciones anteriores
const cleanupPaymentMethods = () => {
  const paymentData = document.querySelector('#payment-data');
  if (!paymentData) return;
  
  // Eliminar subtítulos sueltos fuera de .payment-card
  paymentData.querySelectorAll('.payment-subtitle, .payment-method-subtitle').forEach(el => {
    if (!el.closest('.payment-card')) el.remove();
  });
};

// Función principal - IDEMPOTENTE
const enhancePaymentMethods = () => {
  const paymentData = document.querySelector('#payment-data');
  if (!paymentData) return;
  
  // Primero limpiar restos
  cleanupPaymentMethods();
  
  // FORZAR OCULTAR TODOS LOS FORMULARIOS al cargar
  const allForms = paymentData.querySelectorAll(`
    .payment-method-data,
    .payment-data-form,
    .payment-form,
    .payment-group-content,
    .payment-system-content,
    .payment-data-content,
    .steps-view .payment-data,
    .payment-data .box-info,
    #credit-card-payment-group,
    #debit-card-payment-group,
    .credit-card-payment-group,
    .debit-card-payment-group,
    .card-edit,
    .payment-data-card,
    .payment-data-new-card
  `);
  
  allForms.forEach(form => {
    form.style.display = 'none';
    form.style.opacity = '0';
    form.style.visibility = 'hidden';
    form.style.height = '0';
    form.style.overflow = 'hidden';
  });
  
  // Quitar selección por defecto primero
  const activeItems = paymentData.querySelectorAll('.payment-group-item.active, .payment-group-item.item-link-active');
  activeItems.forEach(item => {
    item.classList.remove('active', 'item-link-active');
    item.style.background = '#fff';
    item.style.borderLeft = 'none';
  });
  
  // Desmarcar todos los radio buttons
  const radioButtons = paymentData.querySelectorAll('.payment-group-item input[type="radio"]');
  radioButtons.forEach(radio => {
    radio.checked = false;
    // Ocultar los que vienen marcados por defecto
    if (radio.checked) {
      radio.style.display = 'none';
    }
  });
  
  // SELECCIONAR SAN MARTÍN 126 POR DEFECTO (PRIMERA OPCIÓN)
  let defaultItem = null;
  
  // Buscar el item de San Martín 126 primero
  const paymentItemsList = paymentData.querySelectorAll('.payment-group-item');
  
  // DIAGNÓSTICO: Mostrar todos los métodos de pago disponibles
  console.log('🔥 PAGO_CHECK Métodos de pago disponibles:');
  paymentItemsList.forEach((item, index) => {
    const classList = item.className || '';
    const itemText = item.textContent?.trim() || '';
    console.log(`[${index}] Clases: "${classList}" | Texto: "${itemText}"`);
  });
  
  paymentItemsList.forEach(item => {
    const classList = item.className || '';
    const itemText = item.textContent?.toLowerCase() || '';
    
    // Prioridad 1: San Martín 126
    if (!defaultItem && (
      itemText.includes('san martín') || 
      itemText.includes('san martin') || 
      itemText.includes('126') ||
      itemText.includes('sanmartin') ||
      itemText.includes('san-martin') ||
      classList.includes('sanmartin') ||
      classList.includes('custom') && itemText.includes('126')
    )) {
      defaultItem = item;
    }
    // Si no hay San Martín, buscar tarjeta de crédito
    else if (!defaultItem && (classList.includes('creditCard') || itemText.includes('crédito') || itemText.includes('credito'))) {
      defaultItem = item;
    }
    // Si no hay crédito, buscar débito
    else if (!defaultItem && (classList.includes('debitCard') || itemText.includes('débito') || itemText.includes('debito'))) {
      defaultItem = item;
    }
  });
  
  // Si encontramos un item, seleccionarlo
  if (defaultItem) {
    // Marcar como activo
    defaultItem.classList.add('active');
    defaultItem.style.background = '#f5f5f5';
    defaultItem.style.borderLeft = '3px solid #2e7d32';
    
    // Marcar el radio button si existe
    const defaultRadio = defaultItem.querySelector('input[type="radio"]');
    if (defaultRadio) {
      defaultRadio.checked = true;
    }
    
    // Mostrar el formulario
    const defaultForm = defaultItem.querySelector('.payment-method-data') ||
                       defaultItem.querySelector('.payment-data-form') ||
                       defaultItem.querySelector('.payment-form') ||
                       defaultItem.querySelector('.payment-group-content') ||
                       defaultItem.querySelector('.payment-system-content') ||
                       defaultItem.querySelector('.payment-data-content');
    
    if (defaultForm) {
      defaultForm.style.display = 'block';
      defaultForm.style.opacity = '1';
      defaultForm.style.visibility = 'visible';
      defaultForm.style.height = 'auto';
      defaultForm.style.overflow = 'visible';
    }
    
    console.log('🔥 PAGO_CHECK Método seleccionado por defecto:', defaultItem.textContent.trim());
  }
  
  // Mapa de subtítulos por identificador
  const subtitleConfig = {
    'creditCard': { subtitle: 'Hasta 3 cuotas sin interés y 6 cuotas fijas', icon: 'credit' },
    'debitCard': { subtitle: 'Hasta 3 cuotas sin interés y 6 cuotas fijas', icon: 'debit' },
    'MercadoPago': { subtitle: '3 cuotas sin interés', icon: 'mercadopago' },
    'MODO': { subtitle: '3 cuotas sin interés', icon: 'modo' },
    'custom201': { subtitle: 'Pago por transferencia', icon: 'transfer' },
    'bankInvoice': { subtitle: 'Pago por transferencia', icon: 'transfer' }
  };
  
  // Buscar todos los items de pago
  const paymentItems = paymentData.querySelectorAll('.payment-group-item');
  
  paymentItems.forEach(item => {
    // IDEMPOTENTE: si ya tiene .payment-card, no hacer nada
    if (item.querySelector('.payment-card')) return;
    
    // Ocultar GOcuotas
    const classList = item.className || '';
    if (classList.toLowerCase().includes('gocuotas')) {
      item.style.display = 'none';
      return;
    }
    
    // Detectar tipo de método
    let config = null;
    let methodType = null;
    
    for (const [key, value] of Object.entries(subtitleConfig)) {
      if (classList.includes(key)) {
        config = value;
        methodType = key;
        break;
      }
    }
    
    // Si no encontró por clase, detectar por texto
    if (!config) {
      const itemText = item.textContent?.toLowerCase() || '';
      if (itemText.includes('san martín') || itemText.includes('san martin') || itemText.includes('126')) {
        config = { subtitle: 'Retiro en efectivo', icon: 'sanmartin' };
        methodType = 'sanmartin';
      } else if (itemText.includes('crédito') || itemText.includes('credito')) {
        config = subtitleConfig.creditCard;
        methodType = 'creditCard';
      } else if (itemText.includes('débito') || itemText.includes('debito')) {
        config = subtitleConfig.debitCard;
        methodType = 'debitCard';
      } else if (itemText.includes('mercado pago') || itemText.includes('mercadopago')) {
        config = subtitleConfig.MercadoPago;
        methodType = 'MercadoPago';
      } else if (itemText.includes('modo')) {
        config = subtitleConfig.MODO;
        methodType = 'MODO';
      } else if (itemText.includes('transferencia') || itemText.includes('bancaria')) {
        config = subtitleConfig.custom201;
        methodType = 'custom201';
      }
    }
    
    if (!config) return;
    
    // Buscar el texto original
    const originalTextSpan = item.querySelector('.payment-group-item-text');
    const originalTitle = originalTextSpan ? originalTextSpan.textContent.trim() : item.textContent.trim();
    
    // Buscar icono existente en el DOM (img, svg, o span con icono)
    let existingIcon = item.querySelector('img, svg, .icon, [class*="icon"]');
    
    // Crear estructura .payment-card
    const card = document.createElement('div');
    card.className = 'payment-card';
    
    // Icono
    const iconDiv = document.createElement('div');
    iconDiv.className = 'payment-icon payment-icon-' + config.icon;
    
    // Si hay icono existente, moverlo (NO clonar)
    if (existingIcon && existingIcon.tagName !== 'I') {
      iconDiv.appendChild(existingIcon);
    }
    // Si no hay icono, el CSS lo pondrá con background-image
    
    // Contenedor de texto
    const textDiv = document.createElement('div');
    textDiv.className = 'payment-text';
    
    // Título
    const titleSpan = document.createElement('span');
    titleSpan.className = 'payment-title';
    titleSpan.textContent = originalTitle;
    
    // Subtítulo
    const subtitleSpan = document.createElement('span');
    subtitleSpan.className = 'payment-subtitle';
    subtitleSpan.textContent = config.subtitle;
    
    // Armar estructura
    textDiv.appendChild(titleSpan);
    textDiv.appendChild(subtitleSpan);
    card.appendChild(iconDiv);
    card.appendChild(textDiv);
    
    // Limpiar contenido original del item (pero mantener el item)
    if (originalTextSpan) {
      originalTextSpan.style.display = 'none';
    }
    
    // Insertar la card al inicio del item
    item.insertBefore(card, item.firstChild);
  });
  
  console.log('🔥 PAGO_CHECK enhancePaymentMethods ejecutado - items procesados:', paymentItems.length);
};

// Ejecutar cuando estemos en página de pago
const initPaymentEnhancement = () => {
  console.log('🔥 PAGO_CHECK initPaymentEnhancement ejecutado. Hash actual:', window.location.hash);
  if (window.location.hash.includes('/payment')) {
    console.log('🔥 PAGO_CHECK Estamos en página de pago, ejecutando enhancePaymentMethods...');
    setTimeout(enhancePaymentMethods, 500);
    setTimeout(enhancePaymentMethods, 1500);
    setTimeout(enhancePaymentMethods, 3000);
  } else {
    console.log('🔥 PAGO_CHECK No estamos en página de pago');
  }
};

// Forzar ejecución inmediata también
console.log('🔥 PAGO_CHECK Iniciando sistema de métodos de pago');
console.log('🔥 PAGO_CHECK URL actual:', window.location.href);
console.log('🔥 PAGO_CHECK Hash actual:', window.location.hash);

window.addEventListener('hashchange', initPaymentEnhancement);
initPaymentEnhancement();

// También forzar ejecución después de 2 segundos sin importar el hash
setTimeout(() => {
  console.log('🔥 PAGO_CHECK Forzando ejecución de enhancePaymentMethods después de 2 segundos');
  enhancePaymentMethods();
}, 2000);

// =====================================================
// SELECCIONAR SAN MARTÍN 126 POR DEFECTO EN RETIRO
// =====================================================
const selectSanMartin126Pickup = () => {
  if (!window.location.hash.includes('/shipping')) return;
  
  console.log('🔥 PAGO_CHECK Buscando opciones de retiro...');
  
  // Buscar todas las opciones de envío/retiro
  const shippingOptions = document.querySelectorAll('.shipping-options, .pickup-point, .delivery-option, .shipping-method, .pickup-option');
  
  shippingOptions.forEach((option, index) => {
    const optionText = option.textContent?.trim() || '';
    console.log(`🔥 PAGO_CHECK Opción ${index}: "${optionText}"`);
    
    // Si esta opción contiene "San Martín" o "126", seleccionarla
    if (optionText.includes('San Martín') || optionText.includes('126')) {
      console.log('🔥 PAGO_CHECK Encontrado San Martín 126, seleccionando...');
      
      // Hacer click en la opción
      option.click();
      
      // Marcar como activa visualmente
      option.classList.add('active', 'selected');
      option.style.background = '#f5f5f5';
      option.style.borderLeft = '3px solid #2e7d32';
      
      // Buscar y marcar el radio button si existe
      const radio = option.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
      }
      
      console.log('🔥 PAGO_CHECK San Martín 126 seleccionado como opción de retiro');
    }
  });
};

// Ejecutar cuando estemos en página de envío
const initShippingEnhancement = () => {
  console.log('🔥 PAGO_CHECK initShippingEnhancement ejecutado. Hash actual:', window.location.hash);
  if (window.location.hash.includes('/shipping')) {
    console.log('🔥 PAGO_CHECK Estamos en página de envío, ejecutando selectSanMartin126Pickup...');
    setTimeout(selectSanMartin126Pickup, 500);
    setTimeout(selectSanMartin126Pickup, 1500);
    setTimeout(selectSanMartin126Pickup, 3000);
  }
};

window.addEventListener('hashchange', initShippingEnhancement);
initShippingEnhancement();

// También en eventos de VTEX
$(document).on('paymentLoaded.vtex', () => setTimeout(enhancePaymentMethods, 300));
$(window).on('orderFormUpdated.vtex', () => {
  if (window.location.hash.includes('/payment')) {
    setTimeout(enhancePaymentMethods, 300);
  }
});

// =====================================================
// FORZAR OCULTAR FORMULARIOS CONTINUAMENTE
// =====================================================
const forceHidePaymentForms = () => {
  if (!window.location.hash.includes('/payment')) return;

  const paymentData = document.querySelector('#payment-data');
  if (!paymentData) return;

  // Obtener el item activo
  const activeItem = paymentData.querySelector('.payment-group-item.active, .payment-group-item.item-link-active');

  // Si no hay item activo, ocultar todos los formularios
  if (!activeItem) {
    const allForms = paymentData.querySelectorAll(`
      .payment-method-data,
      .payment-data-form,
      .payment-form,
      .payment-group-content,
      .payment-system-content,
      .payment-data-content,
      .steps-view .payment-data,
      .payment-data .box-info,
      #credit-card-payment-group,
      #debit-card-payment-group,
      .credit-card-payment-group,
      .debit-card-payment-group,
      .card-edit,
      .payment-data-card,
      .payment-data-new-card
    `);

    allForms.forEach(form => {
      form.style.display = 'none';
      form.style.opacity = '0';
      form.style.visibility = 'hidden';
      form.style.height = '0';
      form.style.overflow = 'hidden';
    });
  } else {
    // Si hay un item activo, ocultar todos los formularios MENOS el del item activo
    const allForms = paymentData.querySelectorAll(`
      .payment-method-data,
      .payment-data-form,
      .payment-form,
      .payment-group-content,
      .payment-system-content,
      .payment-data-content,
      .steps-view .payment-data,
      .payment-data .box-info,
      #credit-card-payment-group,
      #debit-card-payment-group,
      .credit-card-payment-group,
      .debit-card-payment-group,
      .card-edit,
      .payment-data-card,
      .payment-data-new-card
    `);

    allForms.forEach(form => {
      // Si el formulario NO está dentro del item activo, ocultarlo
      if (!activeItem.contains(form) && !form.contains(activeItem)) {
        form.style.display = 'none';
        form.style.opacity = '0';
        form.style.visibility = 'hidden';
        form.style.height = '0';
        form.style.overflow = 'hidden';
      }
    });

    // Asegurar que el formulario del item activo esté visible
    const activeForm = activeItem.querySelector('.payment-method-data') ||
                      activeItem.querySelector('.payment-data-form') ||
                      activeItem.querySelector('.payment-form') ||
                      activeItem.querySelector('.payment-group-content') ||
                      activeItem.querySelector('.payment-system-content') ||
                      activeItem.querySelector('.payment-data-content');

    if (activeForm) {
      activeForm.style.display = 'block';
      activeForm.style.opacity = '1';
      activeForm.style.visibility = 'visible';
      activeForm.style.height = 'auto';
      activeForm.style.overflow = 'visible';
    }
  }
};

// Ejecutar cada 500ms para asegurar que los formularios permanezcan ocultos
setInterval(forceHidePaymentForms, 500);

// =====================================================
// AUTO-SCROLL AL FORMULARIO AL SELECCIONAR MÉTODO DE PAGO
// =====================================================
document.addEventListener("click", function (e) {
  const item = e.target.closest("#payment-data .payment-group-item");
  if (!item) return;

  // Esperar a que VTEX procese el click y muestre el formulario
  setTimeout(() => {
    // Buscar el formulario del método seleccionado (más específico)
    let form = null;
    
    // Intentar encontrar el formulario relacionado con el item clickeado
    const itemIndex = Array.from(item.parentNode.children).indexOf(item);
    const allForms = document.querySelectorAll("#payment-data .payment-method-data, #payment-data .payment-data-form, #payment-data .payment-form, #payment-data .payment-group-content, #payment-data .payment-system-content, #payment-data .payment-data-content");
    
    if (allForms[itemIndex]) {
      form = allForms[itemIndex];
    } else {
      // Fallback: buscar cualquier formulario visible
      form = document.querySelector("#payment-data .payment-method-data:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-data-form:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-form:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-group-content:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-system-content:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-data-content:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .steps-view .payment-data:not([style*='display: none']):not([style*='display: none;'])")
            || document.querySelector("#payment-data .payment-data .box-info:not([style*='display: none']):not([style*='display: none;'])");
    }

    if (form) {
      // Forzar que sea visible
      form.style.display = 'block';
      form.style.opacity = '1';
      form.style.visibility = 'visible';
      
      // Scroll suave al formulario con offset para que no quede pegado arriba
      const offset = 80; // píxeles desde arriba
      const elementPosition = form.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      // Scroll de respaldo por si hay animaciones
      setTimeout(() => {
        form.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
      
      console.log('🔥 PAGO_CHECK Auto-scroll al formulario de pago ejecutado');
    } else {
      console.log('🔥 PAGO_CHECK No se encontró formulario visible para hacer scroll');
    }
  }, 300); // Aumenté el delay para dar más tiempo a VTEX
});