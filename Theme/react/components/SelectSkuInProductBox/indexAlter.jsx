// Necesita en manifest.json las dependencias "vtex.product-context": "0.x" y "vtex.order-items": "0.x" 
// Este componente se debe insertar donde va el boton agregar al carrito

import React, { useRef, useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";
import { useOrderItems } from "vtex.order-items/OrderItems";
import { useRuntime, canUseDOM } from 'vtex.render-runtime';

// COMPONENTS 
import ListaTalles from './ListaTalles/ListaTalles';
import ListaColores from './ListaColores/ListaColores';

// STYLE 
import style from './index.css';

const Modal = ( { component, nodeDOM, context, set, hints } ) => {

  return ReactDOM.createPortal(

    React.createElement( component, { productContext: context, set: set, hints: hints } ),
    nodeDOM

  );

};

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
      
      // // ingresar nombre de la clase del contenedor padre de este componente
      const contenedorColores = ".vtex-flex-layout-0-x-flexRowContent--sku-selector-color-container";
      
      const tallesContainer2 = myRef.current.parentElement.querySelector( contenedorTalles );
      const coloresContainer2 = myRef.current.parentElement.querySelector( contenedorColores );

      // //ESTA CLASE NO SE DEBE MODIFICAR, REPLICA LA NOTIFICACION NATIVA DE VTEX QUE DA AVISO DE PRODUCTO AGREGADO AL CARRITO
      const footerContainer2 = document.querySelector(".vtex-store-footer-2-x-footerLayout");

      myRef.current.classList.add("vtex-button-add-to-cart-custom");
      
      if( tallesContainer2 && coloresContainer2 ) {
        
        setTallesContainer( tallesContainer2 );
        setColoresContainer( coloresContainer2 );
        // setFooterContainer( footerContainer2 );

      }

    }

  })
  
  const customAddToCart = productContext?.product?.items?.length > 1;

  const array = [
    { "component": ListaTalles, "nodeDOM": tallesContainer, "context": productContext, "set": setTalleSeleccionado  },
    { "component": ListaColores, "nodeDOM": coloresContainer, "context": productContext, "set": setColorSeleccionado  }
  ]
  
  if ( customAddToCart ) {
    
    if ( tallesContainer && coloresContainer ) {

      return (

        <>

          {/* {
          
            canUseDOM ?

              ReactDOM.createPortal(
    
                <ListaTalles productContext={productContext} setTalleSeleccionado={setTalleSeleccionado} hints={hints}/>,
                tallesContainer
              
              )

              // ReactDOM.createPortal(
      
              //   <ListaColores productContext={productContext} setColorSeleccionado={setColorSeleccionado} hints={hints}/>,
              //   coloresContainer
    
              // ) &&

              // ReactDOM.createPortal(
      
              //   <div className={ activeNotifyAddToCart ? `${style.notifyAddToCartContainer} ${style.show}` : style.notifyAddToCartContainer }>

              //     <p>{nootifyAddToCartText}</p>

              //   </div>,

              //   footerContainer
      
              // )

            :

              <></>

          } */}

          {
          
            array.map( item => {

              return (

                React.createElement( Modal, { component: item.component, nodeDOM: item.nodeDOM, context: item.context, set: item.set, hints: hints } )

              )

            })
            
          }
  
          <button className={style.buttonAddToCartCustom} ref={myRef} onClick={ e => addToCart( e ) }>Comprar 2</button>
  
        </>
    
      )

    }

    return <button className={style.buttonAddToCartCustom} ref={myRef} onClick={ e => addToCart( e ) }>Comprar 1</button>

  }

  return (

    <AddToCartButton text="Comprar"/>

  )

}

export default SelectSkuInProductBox;
