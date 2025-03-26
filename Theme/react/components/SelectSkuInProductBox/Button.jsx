import React, { useEffect, useRef } from 'react';
import { useContext } from "react";
import { context } from './ContextSizeColor/SizeColorContext';

// STYLE 
import style from './index.css';

const Button = ( { productContext, setFooterContainer, setTallesContainer, setColoresContainer} ) => {

    const myRef = useRef();

    const allContextExport = useContext(context);

    useEffect( () => {
    
        if ( myRef.current ) {
          
          // ingresar nombre de la clase del contenedor padre de este componente
          const contenedorTalles = ".vtex-flex-layout-0-x-flexRowContent--sku-selector-talles-container";
          
          // ingresar nombre de la clase del contenedor padre de este componente
          const contenedorColores = ".vtex-flex-layout-0-x-flexRowContent--sku-selector-color-container";
          
          const tallesContainer = myRef.current.parentElement.querySelector( contenedorTalles );
          const coloresContainer = myRef.current.parentElement.querySelector( contenedorColores );
    
          //ESTA CLASE NO SE DEBE MODIFICAR, REPLICA LA NOTIFICACION NATIVA DE VTEX QUE DA AVISO DE PRODUCTO AGREGADO AL CARRITO
          const searchFooter = setInterval(() => {
            
            const footerContainer = document.querySelector(".vtex-store-footer-2-x-footerLayout");
            
            if ( footerContainer ) {
              
              setFooterContainer( footerContainer );
              clearInterval( searchFooter );
    
            }
    
          }, 200);
    
          myRef.current.classList.add("vtex-button-add-to-cart-custom");
          
          if( tallesContainer && coloresContainer ) {
    
            setTallesContainer( tallesContainer );
            setColoresContainer( coloresContainer );
          
          }
    
        }
    
    })

    return (

        <button className={style.buttonAddToCartCustom} ref={myRef} onClick={ e => allContextExport.addToCart( e, productContext ) }>Comprar</button>

    )

}

export default Button;