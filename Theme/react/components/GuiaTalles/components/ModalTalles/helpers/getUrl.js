
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

        'caballero': 'Masculino',
        'caballeros': 'Masculino',
        'hombre': 'Masculino',
        'hombres': 'Masculino',

        'dama': 'Femenino',
        'damas': 'Femenino',
        'mujer': 'Femenino',
        'mujeres': 'Femenino',

        'chica': 'Niño',
        'chicas': 'Niño',
        'chico': 'Niño',
        'chicos': 'Niño',
        'niña': 'Niño',
        'niñas': 'Niño',
        'niño': 'Niño',
        'niños': 'Niño',

        'bebé': 'Bebé',
        'bebe': 'Bebé',
        'bebes': 'Bebé',

        'unisex': 'Unisex',
        'unisexs': 'Unisex',

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

    return `https://control.kudosestudio.com/api/tool/29/team/14?brand=${brand}&gener=${gener}&productType=${productType}`;
            
    
    /**Fin Crear url para hacer el fetch */

}
