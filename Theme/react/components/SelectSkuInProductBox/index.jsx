import React, { useRef, useState, useEffect } from 'react';
import { useProduct } from "vtex.product-context";
import { useOrderItems } from "vtex.order-items/OrderItems";

// COMPONENTS 
import ListaTalles from './ListaTalles/ListaTalles';
import ListaColores from './ListaColores/ListaColores';

const SelectSkuInProductBox = ( { AddToCartButton } ) => {

  const myRef = useRef();
  const [ tallesContainer, setTallesContainer ] = useState();
  const [ coloresContainer, setColoresContainer ] = useState();
  const [ skuId, setSkuId ] = useState();
  const [ talleSeleccionado, setTalleSeleccionado ] = useState();
  const [ colorSeleccionado, setColorSeleccionado ] = useState();
  const productContext = useProduct();
  const { addItems } = useOrderItems();

  console.log("CONTEXT", productContext)
  console.log("TALLE CLICKED", talleSeleccionado)
  console.log("COLOR CLICKED", colorSeleccionado)

  // FUNCIONES 
  const addToCart = ( e, skuId ) => {

    e.preventDefault();
    e.stopPropagation();

    addItems([
  
      {
        id: skuId,
        quantity: 1,
        seller: 1
      }

    ])

  }
  // FIN FUNCIONES 

  useEffect( () => {

    if ( myRef.current ) {

      const tallesContainer = myRef.current.parentElement.querySelector(".vtex-flex-layout-0-x-flexRowContent--sku-selector-talles-container");
      const coloresContainer = myRef.current.parentElement.querySelector(".vtex-flex-layout-0-x-flexRowContent--sku-selector-color-container");
      
      setTallesContainer( tallesContainer );
      setColoresContainer( coloresContainer );

    }

    // CUANDO CAMBIA COLOR O TALLE SETEO SKU 
    const skuIdContext = productContext?.selectedItem?.itemId;
    
    if ( skuId !== skuIdContext ) {

      setSkuId( skuIdContext );
  
    }
    // FIN CUANDO CAMBIA COLOR O TALLE SETEO SKU 

  })
  
  const customAddToCart = productContext?.product?.items?.length > 1;
  
  if ( customAddToCart && skuId ) {

    if ( tallesContainer && coloresContainer ) {

      return (

        <>
        
          {ReactDOM.createPortal(
  
            <ListaTalles productContext={productContext} setTalleSeleccionado={setTalleSeleccionado}/>,
            tallesContainer
            
          )}
  
          {ReactDOM.createPortal(
  
            <ListaColores productContext={productContext} setColorSeleccionado={setColorSeleccionado}/>,
            coloresContainer
  
          )}
  
          <button ref={myRef}onClick={ e => addToCart( e, skuId ) }>Comprar {skuId}</button>
  
        </>
    
      )

    }

    return (

      <button ref={myRef}onClick={ e => addToCart( e, skuId ) }>Comprar {skuId}</button>
  
    )

  }

  return (

    <AddToCartButton/>

  )

}

export default SelectSkuInProductBox;
