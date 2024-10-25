export const nextSize = ( e, contSlider, btnMoveItemLeftRef, btnMoveItemRightRef, hints ) => {

    e.preventDefault();
    e.stopPropagation();
    
    btnMoveItemLeftRef.style.pointerEvents = "none";
    btnMoveItemRightRef.style.pointerEvents = "none";
    
    if ( hints.desktop ) {

        let moveUntil = ( -1 * ( contSlider.childElementCount - 4 ) ) * 44 + "px"; // EL 4 ES LA CANTIDAD DE ITEM QUE SE MUESTRAN EN EL SLIDER Y EL 44 ES LA SUMA DEL ANCHO DE ESOS ITEMS, 32px EN ESTE CASO, Y LA SEPARACION ENTRE ELLOS QUE ES DE 12px

        if ( getComputedStyle( contSlider ).marginLeft !== moveUntil ) {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) - 44 + "px";
            
        }

    } else {

        let moveUntil = ( -1 * ( contSlider.childElementCount - 4 ) ) * 33 + "px"; // EL 4 ES LA CANTIDAD DE ITEM QUE SE MUESTRAN EN EL SLIDER Y EL 44 ES LA SUMA DEL ANCHO DE ESOS ITEMS, 25px EN ESTE CASO, Y LA SEPARACION ENTRE ELLOS QUE ES DE 8px

        if ( getComputedStyle( contSlider ).marginLeft !== moveUntil ) {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) - 33 + "px";
            
        }

    }

    setTimeout( () => {

        btnMoveItemLeftRef.style.pointerEvents = "auto";
        btnMoveItemRightRef.style.pointerEvents = "auto";
        
    }, 500 );

}