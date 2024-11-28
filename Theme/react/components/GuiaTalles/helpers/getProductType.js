export const getProductType = categoryTree => {
    
    let productType;

    let repeatedWordsAtLevel3 = {
        "Ski y Snowboard": true,
        "Trekking": true,
        "Alta Montaña": true,
        "Impermeables": true,
        "Pluma": true,
        "Rompevientos": true,
        "Softshell": true,
        "Urbano": true
    };

    if ( categoryTree.length === 3 && repeatedWordsAtLevel3[ categoryTree[ categoryTree.length - 1 ]?.name ] ) {

        //devuelvo level 2
        productType = categoryTree[ 1 ]?.name;

    } else {

        // devuelvo level 3
        productType = categoryTree[ categoryTree.length - 1 ]?.name;

    }

    return productType;

}