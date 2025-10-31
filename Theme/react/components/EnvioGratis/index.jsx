import React, { useEffect, useState } from 'react';
import { useProduct } from 'vtex.product-context';

// STYLES
import style from "./index.css";

const EnvioGratis = () => {
    
    const productData = useProduct();

    const [ priceFreeShipping, setPriceFreeShipping ] = useState();
    
    // FUNCTIONS
    const cleanAmount = (value) => {
      if (value === null || value === undefined) {
        return '0'
      }

      // Quitar el signo de peso y los separadores de miles
      return value
        .toString()
        .replace(/\$/g, '')
        .replace(/\./g, '')
        .replace(/,/g, '')
    }
    // FIN FUNCTIONS

    useEffect(() => {
      const element = document.querySelector('.vtex-rich-text-0-x-paragraph--post-header')

      if (!element) {
        return
      }

      const textFreeShipping = element.innerText || element.textContent || element.innerHTML

      if (!textFreeShipping) {
        return
      }

      const regex = /ENVÍO GRATIS EN COMPRAS MAYORES A \$(\d+(\.\d{3})*(,\d{2})?)/

      let resultado = textFreeShipping.match(regex)

      if (resultado && resultado.length > 0 && resultado[1]) {
        resultado = cleanAmount(resultado[1])
      }

      if (resultado) {
        setPriceFreeShipping(parseInt(resultado, 10))
      }
    }, [])

    const rawProductPrice = productData?.selectedItem?.sellers?.[0]?.commertialOffer?.Price

    if (!priceFreeShipping || !rawProductPrice) {
        return <></>
    }

    const productPrice = parseInt(cleanAmount(rawProductPrice), 10)

    if ( priceFreeShipping && productPrice && productPrice >= priceFreeShipping ){

      return (
  
          <div className={style.freeShippingText}>Envío Gratis</div>
  
      )

    }

    return <></>

}

export default EnvioGratis;