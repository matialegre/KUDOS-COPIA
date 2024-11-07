import React, { useEffect, useState } from 'react';

const MountCucardas = ( { cucardas } ) => {

    // const CucardaPrimaveraVerano = cucardas[0];
    const CucardaDiscount = cucardas[0];
    
    const [ containerCreated, setContainerCreated] = useState(false);

    useEffect( () => {
        
        const imageContainer = document.querySelector(".vtex-flex-layout-0-x-flexRowContent--cucardas-container-pdp");

        if ( imageContainer ) {

            setContainerCreated( true );

        }

    })

    if ( containerCreated ) {

        return (

            <>

                {/* {ReactDOM.createPortal(
                    <CucardaPrimaveraVerano/>,
                    document.querySelector(".vtex-flex-layout-0-x-flexRowContent--cucardas-container-pdp")
                )} */}
                
                {ReactDOM.createPortal(
                    <CucardaDiscount/>,
                    document.querySelector(".vtex-flex-layout-0-x-flexRowContent--cucardas-container-pdp")
                )}

            </>

        )

    }
    
    return <></>

}

export default MountCucardas;