import React, { useRef } from 'react';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaColores.css');

const ListaColores = ( { productContext, setColorSeleccionado } ) => {

    // FUNCTIONS 
    const clickInColor = ( e, color ) => {

        e.preventDefault();
        e.stopPropagation();

        setColorSeleccionado( color );

    }
    // FIN FUNCTIONS 

    const contSliderRef = useRef();

    let allColors = [];
    
    productContext?.product?.items.forEach( item => {

        let color = item.variations?.filter( item => item.name === "Color")?.[0]?.values?.[0];

        if ( !allColors.includes( color ) ) {

            allColors.push( color );

        }
        

    } );
    
    return (

        <div className={style.contGralSlider}>

            { allColors.length > 4 ? <div className={`${style.btn_move_item} ${style.left}`} onClick={ e => previousSize( e, contSliderRef.current ) }>+</div> : <></> }
            
            <div className={style.wrapperSlider}>

                <div className={style.contSlider} ref={contSliderRef}>

                    {

                        allColors.map( color => {

                            return (

                                <div className={style.item} onClick={ e => clickInColor( e, color ) }>

                                    {/* <div className={style.productBox}>{color}</div> */}
                                    <img src=""/>
                                    <div className={style.productBox}>{color}</div>

                                </div>

                            )

                        })

                    }

                </div>

            </div>

            { allColors.length > 4 ? <div className={`${style.btn_move_item} ${style.right}`} onClick={ e => nextSize( e, contSliderRef.current ) }>+</div> : <></> }

        </div>

    )

}

export default ListaColores;