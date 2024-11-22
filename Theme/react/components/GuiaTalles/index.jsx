import React, { useState, useEffect } from 'react';
import { useProduct } from 'vtex.product-context';

// COMPONENTS 
import TriggerTalles from './components/TriggerTalles/TriggerTalles';
import GetData from './components/ModalTalles/GetData';

// STYLES 
import style from './index.css';

const GuiaTalles = () => {

    const [ searchData, setSearchData ] = useState( [] );
    
    const [ tallesContainer, setTallesContainer ] = useState();
    const [ openModal, setOpenModal ] = useState( false );
    const productData = useProduct();
    
    useEffect( () => {
        
        const containerToTalles = document.querySelector('.vtex-store-components-3-x-skuSelectorSubcontainer--talle .vtex-store-components-3-x-skuSelectorNameContainer');
        
        if ( containerToTalles ) {

            setTallesContainer( containerToTalles );

        }

        /////
        let productType;
        let gener;
        let brand;
        
        /**asigno marca */
        
        if( productData.product?.brand ) {
                    
            brand = productData.product.brand;

        }
        
        /**asigno productType */
        
        if ( productData.product?.categoryTree && productData.product?.categoryTree.length > 0 ) {

            productType = productData.product.categoryTree[ productData.product.categoryTree.length - 1 ]?.name;

        }
        
        if ( productData.product?.properties ) {

            productData.product.properties?.forEach( item => {
                
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
        /////

    }, [ productData ] )
    
    if ( searchData && searchData.length > 0 && tallesContainer ) {

        return (

            <>
    
                {ReactDOM.createPortal(
            
                    <TriggerTalles setOpenModal={setOpenModal}/>,
                    tallesContainer
    
                )}

                <div className={ openModal ? `${style.modalTalleWrapper} ${style.active}` : `${style.modalTalleWrapper}` }>

                    {/* <ModalTalles setOpenModal={setOpenModal} productData={productData}/> */}
                    <GetData setOpenModal={setOpenModal} productData={productData} searchData={searchData}/>

                </div>
    
            </>
            
        )

    }

    return (

        <></>

    )

}

export default GuiaTalles;