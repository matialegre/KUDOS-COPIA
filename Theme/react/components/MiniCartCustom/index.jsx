/* Este componente "MiniCartCustom" lo que hace es agregar el boton "Seguir comprando" al minicart
esto ahorra mucho tiempo de desarrollo, ya que para incorporarlo nativamente se debe crear cada elemento
del minicart de manera manual. */

import React from 'react';

// STYLES 
import style from './index.css';

const MiniCartCustom = ( { MiniCart } ) => {

    const clickInMiniCart = () => {

        const existButton = document.querySelector( `.${style.buttonSeguirComprando}` );

        if ( !existButton ) {
            
            const intervalContainer = setInterval( () => {

                const buttonsContainer = document.querySelector( ".vtex-minicart-2-x-minicartCheckoutButton" );

                if ( buttonsContainer ) {

                    clearInterval( intervalContainer );

                    const buttonSeguirComprando = document.createElement( "div" );
                    buttonSeguirComprando.classList.add( style.buttonSeguirComprando );
                    buttonSeguirComprando.innerText = "Seguir comprando";

                    buttonsContainer.append( buttonSeguirComprando );

                    buttonsContainer.addEventListener( "click", () => {

                        const closeButton = document.querySelector( ".vtex-minicart-2-x-closeIconButton" );
                        
                        if ( closeButton ) {

                            closeButton.click();

                        }

                    })

                }
                
            }, 200 );

        }
        
    }

    return (

        <div onClick={clickInMiniCart}>

            <MiniCart/>

        </div>

    )

}

export default MiniCartCustom;