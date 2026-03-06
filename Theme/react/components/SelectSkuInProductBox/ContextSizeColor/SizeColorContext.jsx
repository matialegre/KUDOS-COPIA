import {createContext, useState} from 'react';
import { useOrderItems } from "vtex.order-items/OrderItems";

export const context = createContext();
const {Provider} = context;

const SizeColorContext = ( { children, setActiveNotifyAddToCart, setNootifyAddToCartText } ) => {
    
    const { addItems } = useOrderItems();

    const [ SizeColorObject, setSizeColorObject ] = useState({});
    const [ ShowThisSizes, setShowThisSizes ] = useState([]);
    const [ ShowThisColors, setShowThisColors ] = useState([]);
    
    /*FUNCIONES*/
    const createSizeColorObject = data => {

        let obj = {};
        let sizes = [];
        let colors = [];
        
        data.product.items.forEach( item => {
            
            // Verificar que existan al menos 2 variaciones antes de acceder
            if ( item.variations?.length >= 2 && item.variations[0]?.values?.[0] && item.variations[1]?.values?.[0] ) {

                if ( !obj.hasOwnProperty( item.variations[0].values[0] ) ) {

                    sizes.push( [ item.variations[0].values[0] ] );
                    obj[ item.variations[0].values[0] ] = [ [ item.variations[1].values[0], item.images?.[0]?.imageUrl || '' ] ];
    
                } else {
    
                    obj[ item.variations[0].values[0] ].push( [ item.variations[1].values[0], item.images?.[0]?.imageUrl || '' ] );
    
                }

            } else if ( item.variations?.length === 1 && item.variations[0]?.values?.[0] ) {
                // Producto con solo 1 variación (solo talle o solo color)
                if ( !obj.hasOwnProperty( item.variations[0].values[0] ) ) {
                    sizes.push( [ item.variations[0].values[0] ] );
                    obj[ item.variations[0].values[0] ] = [ [ 'default', item.images?.[0]?.imageUrl || '' ] ];
                }
            }
        
        })

        data.product.items.forEach( item => {

            // Verificar que existan al menos 2 variaciones antes de acceder
            if ( item.variations?.length >= 2 && item.variations[0]?.values?.[0] && item.variations[1]?.values?.[0] ) { 

                if ( !obj.hasOwnProperty( item.variations[1].values[0] ) ) {

                    colors.push( [ item.variations[1].values[0], item.images?.[0]?.imageUrl || '' ] );
                    obj[ item.variations[1].values[0] ] = [ [ item.variations[0].values[0] ] ];

                } else {

                    obj[ item.variations[1].values[0] ].push( [ item.variations[0].values[0] ] );

                }

            }

        })

        obj[ "sizeSelected" ] = "";
        obj[ "colorSelected" ] = "";
        setShowThisSizes( ordenarArraySizes( sizes ) );
        setShowThisColors( colors );
        setSizeColorObject( obj );

    }

    const clickInSize = ( e, size, productContext ) => {

        e.preventDefault();
        e.stopPropagation();
        
        const newState = {
            ...SizeColorObject,
            sizeSelected: size
        };
        
        setSizeColorObject( newState );
        
        //muestro los colores que tienen este talle disponible
        setShowThisColors( SizeColorObject[ size ] );

        // Si ya hay un color seleccionado, agregar al carrito y abrir checkout
        if ( newState.colorSelected && productContext ) {
            autoAddToCartAndCheckout( newState.sizeSelected, newState.colorSelected, productContext );
        }

    }

    const clickInColor = ( e, color, productContext ) => {

        e.preventDefault();
        e.stopPropagation();
        
        const newState = {
            ...SizeColorObject,
            colorSelected: color
        };
        
        setSizeColorObject( newState );
        
        //muestro los colores que tienen este talle disponible
        setShowThisSizes( SizeColorObject[ color ] );

        // Si ya hay un talle seleccionado, agregar al carrito y abrir checkout
        if ( newState.sizeSelected && productContext ) {
            autoAddToCartAndCheckout( newState.sizeSelected, newState.colorSelected, productContext );
        }

    }

    const autoAddToCartAndCheckout = ( size, color, productContext ) => {
        let skuId = "";

        productContext.product?.items?.forEach( item => {
            let sizeSelected = false;
            let colorSelected = false;

            item.variations?.forEach( variation => {
                if ( variation.name === 'Talle' && variation.values[0] === size ) {
                    sizeSelected = true;
                }
                if ( variation.name === 'Color' && variation.values[0] === color ) {
                    colorSelected = true;
                }
                if ( sizeSelected && colorSelected ) {
                    skuId = item.itemId;
                }
            })
        })

        if ( skuId ) {
            addItems([{ id: skuId, quantity: 1, seller: 1 }]);
            
            // Redirigir al checkout después de agregar
            setTimeout(() => {
                window.location.href = '/checkout/#/cart';
            }, 500);
        }
    }

    const addToCart = ( e, productContext ) => {

        e.preventDefault();
        e.stopPropagation();

        let size = SizeColorObject[ "sizeSelected" ];
        let color = SizeColorObject[ "colorSelected" ];
        let skuId = "";

        productContext.product?.items?.forEach( item => {
            
            let sizeSelected = false;
            let colorSelected = false;

            item.variations?.forEach( variation => {
                
                if ( variation.name === 'Talle' ) {
                    
                    if ( variation.values[0] === size ) {

                        sizeSelected = true;

                    }

                }

                if ( variation.name === 'Color' ) {
                    
                    if ( variation.values[0] === color ) {

                        colorSelected = true;

                    }

                }

                if ( sizeSelected && colorSelected ) {

                    skuId = item.itemId;

                }

            })

        })

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

    const ordenarArraySizes = array => {

        const ordenTexto = ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

        const indiceOrden = ordenTexto.reduce( (acc, talla, index) => {
          acc[talla] = index;
          return acc;
        }, {} );
      
        return array.sort((a, b) => {
          const valA = a[0] !== undefined ? a[0] : a;
          const valB = b[0] !== undefined ? b[0] : b;
          
          // Si ambos son numéricos, ordenar numéricamente
          const numA = parseFloat(valA);
          const numB = parseFloat(valB);
          
          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          }
          
          // Si ambos son texto (XS, S, M, etc.), usar el orden predefinido
          if (indiceOrden[valA] !== undefined && indiceOrden[valB] !== undefined) {
            return indiceOrden[valA] - indiceOrden[valB];
          }
          
          // Si uno es numérico y otro texto, el numérico va primero
          if (!isNaN(numA)) return -1;
          if (!isNaN(numB)) return 1;
          
          // Fallback: orden alfabético
          return String(valA).localeCompare(String(valB));
        });

    };
    /*FIN FUNCIONES*/
    
    const sizeColorValue = { createSizeColorObject, SizeColorObject, ShowThisSizes, ShowThisColors, clickInSize, clickInColor, addToCart };
    
    return (
        <Provider value={sizeColorValue}>
            {children}
        </Provider>
    )
}

export default SizeColorContext;