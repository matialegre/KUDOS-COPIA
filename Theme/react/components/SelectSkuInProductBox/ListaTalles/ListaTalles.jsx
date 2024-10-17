import React, { useRef } from 'react';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaTalles.css');

const ListaTalles = ( { productContext, setTalleSeleccionado } ) => {

    // FUNCTIONS 
    const clickInSize = ( e, size ) => {

        e.preventDefault();
        e.stopPropagation();

        setTalleSeleccionado( size );

    }
    // FIN FUNCTIONS 

    const contSliderRef = useRef();

    let allSizes = [];
    
    productContext?.product?.items.forEach( item => {

        let size = item.variations?.filter( item => item.name === "Talle")?.[0]?.values?.[0];

        if ( !allSizes.includes( size ) ) {

            allSizes.push( size );

        }
        

    } );
    
    return (

        <div className={style.contGralSlider}>

            { allSizes.length > 4 ? <div className={`${style.btn_move_item} ${style.left}`} onClick={ e => previousSize( e, contSliderRef.current ) }>+</div> : <></> }
            
            <div className={style.wrapperSlider}>

                <div className={style.contSlider} ref={contSliderRef}>

                    {

                        allSizes.map( size => {

                            return (

                                <div className={style.item} onClick={ e => clickInSize( e, size ) }>

                                    <div className={style.productBox}>{size}</div>

                                </div>

                            )

                        })

                    }

                </div>

            </div>

            { allSizes.length > 4 ? <div className={`${style.btn_move_item} ${style.right}`} onClick={ e => nextSize( e, contSliderRef.current ) }>+</div> : <></> }

        </div>

    )

}

export default ListaTalles;