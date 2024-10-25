export const previousSize = ( e, contSlider, btnMoveItemLeftRef, btnMoveItemRightRef, hints ) => {

    e.preventDefault();
    e.stopPropagation();

    btnMoveItemLeftRef.style.pointerEvents = "none";
    btnMoveItemRightRef.style.pointerEvents = "none";

    if ( parseInt( getComputedStyle( contSlider ).marginLeft ) !== 0 ) {

        if ( hints.desktop ) {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) + 44 + "px"; // EL 44 CORRESPONDE CON AL WIDTH DE CADA ITEM, 32px EN ESTE CASO, Y EL ESPACIO ENTRE ELLOS, 12px EN ESTE CASO

        } else {

            contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) + 33 + "px"; // EL 44 CORRESPONDE CON AL WIDTH DE CADA ITEM, 25px EN ESTE CASO, Y EL ESPACIO ENTRE ELLOS, 8px EN ESTE CASO

        }

        
    }

    setTimeout( () => {

        btnMoveItemLeftRef.style.pointerEvents = "auto";
        btnMoveItemRightRef.style.pointerEvents = "auto";
        
    }, 500 );


}