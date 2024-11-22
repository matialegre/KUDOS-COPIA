
export const getUrl = searchData => {

    let productType;
    let gener;
    let brand;
    
    /**Definir productType */
    if ( searchData[0] ) {

        productType = searchData[0];

    }
    /**Fin Definir productType */

    /**Definir gener */
    let switchGener = {

        'masculino': 'Masculino',
        'caballero': 'Masculino',
        'hombre': 'Masculino',

        'femenino': 'Femenino',
        'dama': 'Femenino',
        'mujer': 'Femenino',

        'niño': 'Niño',
        'chica': 'Niño',
        'chico': 'Niño',
        'niña': 'Niño',

        'unisex': 'Unisex'

    }

    if ( searchData[1] ) {

        if ( switchGener[ searchData[1].toLowerCase() ] !== undefined ) {

            gener = switchGener[ searchData[1].toLowerCase() ];

        }

    }
    /**Fin Definir gener */

    /**Definir brand */
    if ( searchData[2] ) {
        
        brand = searchData[2];

    }
    /**Fin Definir brand */

    return `https://control.kudosestudio.com/api/tool/29/team/54?brand=${brand}&gener=${gener}&productType=${productType}`;
            
    
    /**Fin Crear url para hacer el fetch */

}
