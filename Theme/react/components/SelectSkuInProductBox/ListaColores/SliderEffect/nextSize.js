export const nextSize = ( e, contSlider ) => {

    e.preventDefault();
    e.stopPropagation();

    // FALTA PARAR LOS BOTONES PARA QUE ESPERE MOVERSE

    let moveUntil = ( -1 * ( contSlider.childElementCount - 4 ) ) * 44 + "px";

    if ( getComputedStyle( contSlider ).marginLeft !== moveUntil ) {

        contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) - 44 + "px";

    }

}