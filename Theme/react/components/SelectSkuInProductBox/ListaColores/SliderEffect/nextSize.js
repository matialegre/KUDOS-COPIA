export const nextSize = ( e, contSlider, btnMoveItemLeftRef, btnMoveItemRightRef, hints ) => {

    e.preventDefault();
    e.stopPropagation();

    btnMoveItemLeftRef.style.pointerEvents = "none";
    btnMoveItemRightRef.style.pointerEvents = "none";

    if ( hints.desktop ) {

        let moveUntil = ( -1 * ( contSlider.childElementCount - 2 ) ) * 49 + "px"; // EL 2 ES LA CANTIDAD DE ITEM QUE SE MUESTRAN EN EL SLIDER Y EL 49 ES LA SUMA DEL ANCHO DE ESOS ITEMS, 37px EN ESTE CASO, Y LA SEPARACION ENTRE ELLOS QUE ES DE 12px

        if ( getComputedStyle( contSlider ).marginLeft !== moveUntil ) {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) - 49 + "px";
    
        }

    } else {

        let moveUntil = ( -1 * ( contSlider.childElementCount - 2 ) ) * 49 + "px";

        if ( getComputedStyle( contSlider ).marginLeft !== moveUntil ) {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) - 49 + "px"; // ESTE 51 es la cantidad pixels que el slider se moverá hacia la izquierda
    
        }

    }
    
    setTimeout( () => {

        btnMoveItemLeftRef.style.pointerEvents = "auto";
        btnMoveItemRightRef.style.pointerEvents = "auto";
        
    }, 500 );

}