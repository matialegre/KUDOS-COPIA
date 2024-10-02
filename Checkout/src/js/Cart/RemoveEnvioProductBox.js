export const RemoveEnvioProductBox = () => {

  if (document.querySelector(".cart-template-holder .cart-items .shipping-date")) {
    
    document.querySelector(".cart-template-holder .cart-items .shipping-date").remove();
    document.querySelector(".cart-template-holder .product-item .shipping-date").remove();
  
  }

}