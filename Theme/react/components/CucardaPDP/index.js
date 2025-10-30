import React, { useEffect, useState } from 'react';

// COMPONENTS
import MountCucardas from './MountCucardas';

const CucardaPDP = ( { CucardasContainer, CucardaDiscount } ) => {
    
    const [ containerCreated, setContainerCreated] = useState(false);

    useEffect( () => {
        
        const imageContainer = document.querySelector(".vtex-store-components-3-x-productImagesGallerySwiperContainer");
        
        if ( imageContainer ) {

            setContainerCreated( true );

        }

    })

    if ( containerCreated ) {

        return (
            
            <>

                {ReactDOM.createPortal(
                    <CucardasContainer/>,
                    document.querySelector(".vtex-store-components-3-x-productImagesGallerySwiperContainer")
                )}

                <MountCucardas cucardas={[CucardaDiscount]}/>

            </>

        )

    }
    
    return <></>
  
}

export default CucardaPDP;
