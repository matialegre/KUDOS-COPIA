import React, { useRef, useEffect } from 'react';
import { useContext } from "react";
import { context } from '../ContextSizeColor/SizeColorContext';

// FUNCTIONS 
import { previousSize } from './SliderEffect/previousSize';
import { nextSize } from './SliderEffect/nextSize';

// STYLES 
const style = require('./ListaTalles.css');

const ListaTalles = ( { productContext, hints } ) => {

    const allContextExport = useContext(context);

    useEffect( () => {
      
        allContextExport.createSizeColorObject( productContext );

    }, [ JSON.stringify( productContext ) ] )

    const contSliderRef = useRef();
    const btnMoveItemLeftRef = useRef();
    const btnMoveItemRightRef = useRef();

    // let allSizes = [];
    
    // productContext?.product?.items.forEach( item => {

    //     let size = item.variations?.filter( item => item.name === "Talle")?.[0]?.values?.[0];

    //     if ( !allSizes.includes( size ) ) {

    //         allSizes.push( size );

    //     }
        

    // } );
    
    return (

        <div className={`${style.contGralSlider} vtex-contGralSlider`}>

            {/* { 
            
                allSizes.length > 5 ? 
                
                    <div className={`${style.btn_move_item} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                        
            } */}

            { 
            
                allContextExport.ShowThisSizes.length > 5 ? 
                
                    <div className={`${style.btn_move_item} ${style.left}`} onClick={ e => { e.preventDefault(); e.stopPropagation(); } }>
                        <div onClick={ e => previousSize( e, contSliderRef.current, btnMoveItemLeftRef.current, btnMoveItemRightRef.current, hints ) } ref={btnMoveItemLeftRef}></div>
                    </div> 
                
                : 
                
                    <></> 
                        
            }
            
            <div className={style.wrapperSlider}>

                <div className={style.contSlider} ref={contSliderRef}>

                    {

                        allContextExport.ShowThisSizes.map( size => {
                            
                            return (

                                size[0] === allContextExport.SizeColorObject[ "sizeSelected" ] ?

                                    <div className={`${style.item} ${style.active}`} onClick={ e => allContextExport.clickInSize( e, size[0] ) }>{size[0]}</div>

                                :

                                    <div className={style.item} onClick={ e => allContextExport.clickInSize( e, size[0] ) }>{size[0]}</div>

                            )

                        })

                    }

                </div>

            </div>

            { 
            
                allContextExport.ShowThisSizes.length > 5 ? 
                
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