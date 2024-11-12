import React, { useEffect, useState } from 'react';

// COMPONENTS 
import CreateUrl from './CreateUrl';

const GetData = ( { setOpenModal, productData } ) => {

    const team_id = 54;

    const [ searchData, setSearchData ] = useState( [] );
    
    useEffect( () => {

        let productType;
        let gener;
        let brand;

        /**asigno marca */
        if( productData.product?.brand ) {
                    
            brand = productData.product.brand;

        }

        /**asigno productType */
        if ( productData.product?.categoryTree ) {

            productType = productData.product.categoryTree[0]?.name;

        }

        if ( productData.product?.properties ) {

            productData.product.properties.forEach( item => {
                
                /**asigno genero */
                if( item.name === 'Genero' ) {
    
                    if ( item.values[0] ) {

                        gener = item.values[0];

                    }
    
                }

            })

        }
        
        if ( productType && gener && brand ) {

            setSearchData( [ productType, gener, brand ] )

        }

    }, [ productData ] )
    
    return (
            
        <CreateUrl setOpenModal={setOpenModal} searchData={searchData} team_id={team_id}/>
            
    )

}

export default GetData;