// Necesita en manifest.json las dependencias "vtex.product-context": "0.x" y "vtex.order-items": "0.x" 
// Este componente se debe insertar donde va el boton agregar al carrito

import React, { useState } from 'react';
import { useProduct } from "vtex.product-context";
import SizeColorContext from './ContextSizeColor/SizeColorContext';
import { useRuntime } from 'vtex.render-runtime';

// COMPONENTS 
import ListaTalles from './ListaTalles/ListaTalles';
import ListaColores from './ListaColores/ListaColores';
import Button from './Button';

// STYLE 
import style from './index.css';

const SelectSkuInProductBox = ( { AddToCartButton } ) => {

  const productContext = useProduct();
  const { hints } = useRuntime();
  
  const [ tallesContainer, setTallesContainer ] = useState();
  const [ coloresContainer, setColoresContainer ] = useState();
  const [ footerContainer, setFooterContainer ] = useState();
  const [ activeNotifyAddToCart, setActiveNotifyAddToCart ] = useState( false );
  const [ nootifyAddToCartText, setNootifyAddToCartText ] = useState("");

  const customAddToCart = productContext?.product?.items?.length > 0;
  const availableQuantity = productContext?.selectedItem?.sellers?.[0]?.commertialOffer?.AvailableQuantity;
  
  if ( availableQuantity > 0 && customAddToCart && productContext?.product?.items?.[0]?.variations?.[0]?.values[0] != "ST" ) {

    if ( tallesContainer && coloresContainer && footerContainer ) {
      
      return (

        <SizeColorContext setActiveNotifyAddToCart={setActiveNotifyAddToCart} setNootifyAddToCartText={setNootifyAddToCartText}>

          <>

            {ReactDOM.createPortal(
      
              <ListaTalles productContext={productContext} hints={hints}/>,
              tallesContainer
                
            )}
    
            {ReactDOM.createPortal(
        
              <ListaColores hints={hints}/>,
              coloresContainer

            )}

            {ReactDOM.createPortal(
        
              <div className={ activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer }>

                <p>{nootifyAddToCartText}</p>

              </div>,

              footerContainer
    
            )}
    
            <Button productContext={productContext} setFooterContainer={setFooterContainer} setTallesContainer={setTallesContainer} setColoresContainer={setColoresContainer}/>
    
          </>

        </SizeColorContext>
    
      )

    }

    return <Button productContext={productContext} setFooterContainer={setFooterContainer} setTallesContainer={setTallesContainer} setColoresContainer={setColoresContainer}/>

  }

  return (

    <AddToCartButton text="Comprar"/>

  )

}

export default SelectSkuInProductBox;
