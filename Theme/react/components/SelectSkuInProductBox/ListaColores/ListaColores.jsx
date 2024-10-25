import React, { useRef } from 'react';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaColores.css');

const ListaColores = ( { productContext, setColorSeleccionado, hints } ) => {

    // FUNCTIONS 
    const clickInColor = ( e, color, classNameItem ) => {

        e.preventDefault();
        e.stopPropagation();

        let items = document.querySelectorAll( `.${classNameItem}` );
        
        for ( let index = 0; index < items.length; index++ ) {

            items[index].classList.remove( style.active );
            
        }

        e.target.classList.add( style.active );

        setColorSeleccionado( color );

    }
    // FIN FUNCTIONS 

    const contSliderRef = useRef();
    const btnMoveItemLeftRef = useRef();
    const btnMoveItemRightRef = useRef();

    let allColors = [];
    let allImageColors = [];
    
    productContext?.product?.items.forEach( item => {

        let color = item.variations?.filter( item => item.name === "Color" )?.[0]?.values?.[0];

        if ( !allColors.includes( color ) ) {
            
            allColors.push( color );

        }
        
    } );

    allColors.forEach( color => {

        let objectImageContainer = productContext?.product?.items.find( item => item.variations?.find( item2 => item2.name === "Color" && item2.values?.[0] === color ) );
        
        let imageColorUrl = objectImageContainer.images?.[0]?.imageUrl;

        allImageColors.push( imageColorUrl );
            
    })
    
    return (

        <div className={style.contGralSliderColor}>

            { 
            
                allColors.length > 2 ? 
                
                    <div className={`${style.btn_move_item_color} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                
            }
            
            <div className={style.wrapperSliderColor}>

                <div className={style.contSliderColor} ref={contSliderRef}>

                    {

                        allColors.map( ( color, index ) => {

                            return (

                                <div className={style.itemColor} onClick={ e => clickInColor( e, color, style.itemColor ) }>

                                    <img src={ allImageColors[ index ] }/>

                                </div>

                            )

                        })

                    }

                </div>

            </div>

            { 
            
                allColors.length > 2 ? 
                
                    <div className={`${style.btn_move_item_color} ${style.right}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => nextSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemRightRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                
            }

        </div>

    )

}

export default ListaColores;