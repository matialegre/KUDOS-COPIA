import React, { useEffect, useState } from 'react';

// COMPONENTS 
import CreateUrl from './CreateUrl';

const GetData = ( { setOpenModal, productData, searchData, imageUrl } ) => {

    const team_id = 54;

    return (
        
        <CreateUrl setOpenModal={setOpenModal} searchData={searchData} team_id={team_id} imageUrl={imageUrl}/>
            
    )
    
}

export default GetData;