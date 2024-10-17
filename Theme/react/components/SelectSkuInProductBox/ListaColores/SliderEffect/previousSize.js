export const previousSize = ( e, contSlider ) => {

    e.preventDefault();
    e.stopPropagation();

    if ( parseInt( getComputedStyle( contSlider ).marginLeft ) !== 0 ) {

        contSlider.style.marginLeft = parseInt( getComputedStyle( contSlider ).marginLeft ) + 44 + "px";

    }


}