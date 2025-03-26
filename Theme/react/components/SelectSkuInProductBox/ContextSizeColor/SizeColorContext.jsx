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
            
            if ( item.variations?.length > 0 ) {

                if ( !obj.hasOwnProperty( item.variations[0].values[0] ) ) {

                    sizes.push( [ item.variations[0].values[0] ] );
                    obj[ item.variations[0].values[0] ] = [ [ item.variations[1].values[0], item.images[0].imageUrl ] ];
    
                } else {
    
                    obj[ item.variations[0].values[0] ].push( [ item.variations[1].values[0], item.images[0].imageUrl ] );
    
                }

            }
        
        })

        data.product.items.forEach( item => {

            if ( item.variations?.length > 0 ) { 

                if ( !obj.hasOwnProperty( item.variations[1].values[0] ) ) {

                    colors.push( [ item.variations[1].values[0], item.images[0].imageUrl ] );
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

    const clickInSize = ( e, size ) => {

        e.preventDefault();
        e.stopPropagation();
        
        setSizeColorObject( {
            ...SizeColorObject,
            sizeSelected: size
        } );
        
        //muestro los colores que tienen este talle disponible
        setShowThisColors( SizeColorObject[ size ] );

    }

    const clickInColor = ( e, color ) => {

        e.preventDefault();
        e.stopPropagation();
        
        setSizeColorObject( {
            ...SizeColorObject,
            colorSelected: color
        } );
        
        //muestro los colores que tienen este talle disponible
        setShowThisSizes( SizeColorObject[ color ] );

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

        const orden = ["3XS", "2XS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"];

        const indiceOrden = orden.reduce( (acc, talla, index) => {
          acc[talla] = index;
          return acc;
        }, {} );
      
        return array.sort((a, b) => {
          return (indiceOrden[a] || Infinity) - (indiceOrden[b] || Infinity);
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