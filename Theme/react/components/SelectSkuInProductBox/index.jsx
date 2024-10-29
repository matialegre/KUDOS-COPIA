// Necesita en manifest.json las dependencias "vtex.product-context": "0.x" y "vtex.order-items": "0.x" 
// Este componente se debe insertar donde va el boton agregar al carrito

import React, { useRef, useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";
import { useOrderItems } from "vtex.order-items/OrderItems";
import { useRuntime } from 'vtex.render-runtime';

// COMPONENTS 
import ListaTalles from './ListaTalles/ListaTalles';
import ListaColores from './ListaColores/ListaColores';

// STYLE 
import style from './index.css';

const SelectSkuInProductBox = ( { AddToCartButton } ) => {

  const productContext = useProduct();
  const { addItems } = useOrderItems();
  const { hints } = useRuntime();
  const myRef = useRef();

  const [ tallesContainer, setTallesContainer ] = useState();
  const [ coloresContainer, setColoresContainer ] = useState();
  const [ footerContainer, setFooterContainer ] = useState();
  const [ activeNotifyAddToCart, setActiveNotifyAddToCart ] = useState( false );
  const [ nootifyAddToCartText, setNootifyAddToCartText ] = useState("");

  const [ talleSeleccionado, setTalleSeleccionado ] = useState();
  const [ colorSeleccionado, setColorSeleccionado ] = useState();

  
  // FUNCIONES 
  const addToCart = e => {

    e.preventDefault();
    e.stopPropagation();

    let skuId = "";
    
    for ( let index = 0; index < productContext?.product?.items.length; index++ ) {

      const item = productContext?.product?.items[ index ];

      let productWithSku = "false"; // no - candidate - itis

      for ( let index2 = 0; index2 < item.variations.length; index2++ ) {
        
        if ( item.variations[ index2 ].name === "Talle" && item.variations[ index2 ].values?.[0] === talleSeleccionado ) {

          if ( productWithSku === "false" ) {

            productWithSku = "candidate";

          } else if ( "candidate" ) {

            productWithSku = item;

            break;

          }

        }

        if ( item.variations[ index2 ].name === "Color" && item.variations[ index2 ].values?.[0] === colorSeleccionado ) {

          if ( productWithSku === "false" ) {

            productWithSku = "candidate";

          } else if ( "candidate" ) {

            productWithSku = item;

            break;

          }

        }
        
      }

      if ( productWithSku !== "false" && productWithSku !== "candidate" ) {
        
        skuId = productWithSku.itemId;
        break;

      } else {

        productWithSku === "false";

      }
      
    }

    if ( skuId ) {

      addItems([
    
        {
          id: skuId,
          quantity: 1,
          seller: 1
        }

      ])

      setNootifyAddToCartText( "Ítem agregado al carrito");

      setActiveNotifyAddToCart( true );

      setTimeout( () => {

        setActiveNotifyAddToCart( false );
        
      }, 3000 );

    } else {

      setNootifyAddToCartText( "Seleccione talle y color");
      
      setActiveNotifyAddToCart( true );

      setTimeout( () => {

        setActiveNotifyAddToCart( false );
        
      }, 3000 );

    }

  }
  // FIN FUNCIONES 

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
  
  const customAddToCart = productContext?.product?.items?.length > 1;
  
  if ( customAddToCart ) {

    if ( tallesContainer && coloresContainer && footerContainer ) {
      
      return (

        <>

          {ReactDOM.createPortal(
    
            <ListaTalles productContext={productContext} setTalleSeleccionado={setTalleSeleccionado} hints={hints}/>,
            tallesContainer
              
          )}
  
          {ReactDOM.createPortal(
      
            <ListaColores productContext={productContext} setColorSeleccionado={setColorSeleccionado} hints={hints}/>,
            coloresContainer

          )}

          {ReactDOM.createPortal(
      
            <div className={ activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer }>

              <p>{nootifyAddToCartText}</p>

            </div>,

            footerContainer
  
          )}
  
          <button className={style.buttonAddToCartCustom} ref={myRef} onClick={ e => addToCart( e ) }>Comprar</button>
  
        </>
    
      )

    }

    return <button className={style.buttonAddToCartCustom} ref={myRef} onClick={ e => addToCart( e ) }>Comprar</button>

  }

  return (

    <AddToCartButton text="Comprar"/>

  )

}

export default SelectSkuInProductBox;
