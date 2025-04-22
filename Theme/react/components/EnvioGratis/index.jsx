import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';

// STYLES
import style from "./index.css";

const EnvioGratis = () => {
    
    const productData = useProduct();

    const [ priceFreeShipping, setPriceFreeShipping ] = useState();
    
    // FUNCTIONS
    const cleanAmount = value => {

      // Quitar el signo de peso y los separadores de miles
      let resultado = value.toString().replace(/\$/g, '').replace(/\./g, '').replace(/,/g, '');
      return resultado;

    }
    // FIN FUNCTIONS

    useEffect( () => {

      let textFreeShipping = document.querySelector(".vtex-rich-text-0-x-paragraph--post-header").innerHTML;
      
      if ( textFreeShipping ) {

        // Usar una expresión regular para encontrar el valor después de "ENVÍO GRATIS"
        const regex = /ENVÍO GRATIS EN COMPRAS MAYORES A \$(\d+(\.\d{3})*(,\d{2})?)/;
        
        // Ejecutar la expresión regular en el texto
        let resultado = textFreeShipping.match(regex);

        if ( resultado && resultado.length > 0 && resultado[1] ) {

          resultado = cleanAmount(resultado[1]);
          
        }
        
        if (resultado) { 
          
          setPriceFreeShipping( parseInt(resultado) );

        } else {

            console.log("No se encontró el valor.");

        }

      }
      
    })

    let productPrice = parseInt( cleanAmount( productData?.selectedItem?.sellers?.[0]?.commertialOffer?.Price.toString() ) );
    
    if ( priceFreeShipping && productPrice && productPrice >= priceFreeShipping ){

      return (
  
          <div className={style.freeShippingText}>Envío Gratis</div>
  
      )

    }

    return <></>

}

export default EnvioGratis;