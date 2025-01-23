import React, { useRef } from 'react';
import { useContext } from "react";
import { context } from '../ContextSizeColor/SizeColorContext';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaColores.css');

const ListaColores = ( { hints } ) => {

    const allContextExport = useContext(context);

    const contSliderRef = useRef();
    const btnMoveItemLeftRef = useRef();
    const btnMoveItemRightRef = useRef();
    
    return (

        <div className={style.contGralSliderColor}>

            { 
            
                allContextExport.ShowThisColors.length > 2 ? 
                
                    <div className={`${style.btn_move_item_color} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                
            }
            
            <div className={style.wrapperSliderColor}>

                <div className={style.contSliderColor} ref={contSliderRef}>

                    {

                        allContextExport.ShowThisColors.map( color => {
                            
                            return (

                                color[0] === allContextExport.SizeColorObject[ "colorSelected" ] ?

                                    <div className={`${style.itemColor} ${style.active}`} onClick={ e => allContextExport.clickInColor( e, color[0] ) }>

                                        <img src={ color[1] }/>

                                    </div>

                                :

                                    <div className={style.itemColor} onClick={ e => allContextExport.clickInColor( e, color[0] ) }>

                                        <img src={ color[1] }/>

                                    </div>

                            )

                        })

                    }

                </div>

            </div>

            { 
            
                allContextExport.ShowThisColors.length > 2 ? 
                
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