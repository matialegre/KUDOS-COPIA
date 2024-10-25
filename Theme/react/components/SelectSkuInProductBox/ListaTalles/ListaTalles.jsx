import React, { useRef } from 'react';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaTalles.css');

const ListaTalles = ( { productContext, setTalleSeleccionado, hints } ) => {

    // FUNCTIONS 
    const clickInSize = ( e, size, classNameItem ) => {
        
        e.preventDefault();
        e.stopPropagation();
        
        let items = document.querySelectorAll( `.${classNameItem}` );
        
        for ( let index = 0; index < items.length; index++ ) {

            items[index].classList.remove( style.active );
            
        }

        e.target.classList.add( style.active );

        setTalleSeleccionado( size );

    }
    // FIN FUNCTIONS 

    const contSliderRef = useRef();
    const btnMoveItemLeftRef = useRef();
    const btnMoveItemRightRef = useRef();

    let allSizes = [];
    
    productContext?.product?.items.forEach( item => {

        let size = item.variations?.filter( item => item.name === "Talle")?.[0]?.values?.[0];

        if ( !allSizes.includes( size ) ) {

            allSizes.push( size );

        }
        

    } );
    
    return (

        <div className={`${style.contGralSlider} vtex-contGralSlider`}>

            { 
            
                allSizes.length > 5 ? 
                
                    <div className={`${style.btn_move_item} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                        
            }
            
            <div className={style.wrapperSlider}>

                <div className={style.contSlider} ref={contSliderRef}>

                    {

                        allSizes.map( size => {

                            return (

                                <div className={style.item} onClick={ e => clickInSize( e, size, style.item ) }>{size}</div>

                            )

                        })

                    }

                </div>

            </div>

            { 
            
                allSizes.length > 5 ? 
                
                    <div className={`${style.btn_move_item} ${style.right}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => nextSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemRightRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                    
            }

        </div>

    )

}

export default ListaTalles;