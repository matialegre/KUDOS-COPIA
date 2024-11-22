import React from 'react';

// COMPONENTS 
import DescriptionShowTalle from './DescriptionShowTalle';
import TableTalle from './TableTalle';

const ShowTalleOf = ( { data } ) => {
    
    if ( data ) {

        return (

            <div>
                <DescriptionShowTalle productType={data[0].attribute.product_type.name}/>
                <TableTalle data={data}/>
            </div>
    
        )

    } else {

        console.error("No se obtienen datos desde KC, revisar url de peticion");

        return <></>

    }

}

export default ShowTalleOf;