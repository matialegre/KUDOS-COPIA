import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';

// COMPONENTS 
import TriggerTalles from './components/TriggerTalles/TriggerTalles';
import GetData from './components/ModalTalles/GetData';
import ModalTalles from './components/ModalTalles/ModalTalles';

// STYLES 
import style from './index.css';

const GuiaTalles = () => {
    
    const [ tallesContainer, setTallesContainer ] = useState();
    const [ openModal, setOpenModal ] = useState( false );
    const productData = useProduct();
    
    useEffect( () => {
        
        const containerToTalles = document.querySelector('.vtex-store-components-3-x-skuSelectorSubcontainer--talle .vtex-store-components-3-x-skuSelectorNameContainer');
        
        if ( containerToTalles ) {

            setTallesContainer( containerToTalles );

        }

    })
    
    if ( tallesContainer ) {

        return (

            <>
    
                {ReactDOM.createPortal(
            
                    <TriggerTalles setOpenModal={setOpenModal}/>,
                    tallesContainer
    
                )}

                <div className={ openModal ? `${style.modalTalleWrapper} ${style.active}` : `${style.modalTalleWrapper}` }>

                    {/* <ModalTalles setOpenModal={setOpenModal} productData={productData}/> */}
                    <GetData setOpenModal={setOpenModal} productData={productData}/>

                </div>
    
            </>
            
        )

    }

    return (

        <></>

    )

}

export default GuiaTalles;