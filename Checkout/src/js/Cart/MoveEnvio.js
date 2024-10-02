export const MoveEnvio = () => {

  if (window.innerWidth > 768) {
    
    const objectCart = document.querySelector(".cart-template");

    let config = { attributes: true, subtree: true };

    const callback = (mutationList, observer) => {

      if (document.querySelector("#shipping-preview-container")) {
    
        const shipping = document.querySelector("#shipping-preview-container");
    
        document.querySelector(".cart-template").append(shipping);

        if (!document.querySelector(".summary-template-holder #shipping-preview-container")) {
         
          observer.disconnect();
          
        }
        
      }
    };

    let observer = new MutationObserver(callback);

    observer.observe(objectCart, config);
    
  }

};