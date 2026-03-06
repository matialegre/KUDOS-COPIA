import React, { useRef, useCallback } from 'react';
import { useContext } from "react";
import { context } from '../ContextSizeColor/SizeColorContext';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaColores.css');

const ListaColores = ( { productContext, hints } ) => {

    const allContextExport = useContext(context);

    const contSliderRef = useRef();
    const btnMoveItemLeftRef = useRef();
    const btnMoveItemRightRef = useRef();

    // Función para cambiar la imagen principal del product box al hacer hover/click
    const handleColorHover = useCallback((imageUrl) => {
        const productBox = contSliderRef.current?.closest('.vtex-product-summary-2-x-container');
        if (productBox) {
            const mainImage = productBox.querySelector('.vtex-product-summary-2-x-imageNormal');
            if (mainImage && imageUrl) {
                mainImage.src = imageUrl;
            }
        }
    }, []);
    
    return (

        <div className={style.contGralSliderColor}>

            { 
            
                allContextExport.ShowThisColors.length > 4 ? 
                
                    <div className={`${style.btn_move_item_color} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                
            }
            
            <div className={style.wrapperSliderColor}>

                <div className={style.contSliderColor} ref={contSliderRef}>

                    {

                        allContextExport.ShowThisColors.map( (color, index) => {
                            
                            return (

                                color[0] === allContextExport.SizeColorObject[ "colorSelected" ] ?

                                    <div 
                                        key={`color-${color[0]}-${index}`} 
                                        className={`${style.itemColor} ${style.active}`} 
                                        onClick={ e => { allContextExport.clickInColor( e, color[0], productContext ); handleColorHover(color[1]); } }
                                        onMouseEnter={ () => handleColorHover(color[1]) }
                                    >
                                        <img src={ color[1] } alt={color[0]}/>
                                    </div>

                                :

                                    <div 
                                        key={`color-${color[0]}-${index}`} 
                                        className={style.itemColor} 
                                        onClick={ e => { allContextExport.clickInColor( e, color[0], productContext ); handleColorHover(color[1]); } }
                                        onMouseEnter={ () => handleColorHover(color[1]) }
                                    >
                                        <img src={ color[1] } alt={color[0]}/>
                                    </div>

                            )

                        })

                    }

                </div>

            </div>

            { 
            
                allContextExport.ShowThisColors.length > 4 ? 
                
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