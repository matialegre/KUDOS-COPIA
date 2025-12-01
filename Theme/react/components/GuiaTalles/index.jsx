import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useProduct } from 'vtex.product-context';

// COMPONENTS 
import TriggerTalles from './components/TriggerTalles/TriggerTalles';
import GetData from './components/ModalTalles/GetData';

// HELPERS 
import { getProductType } from './helpers/getProductType';
import { getGuideImageUrl } from './helpers/getGuideImageUrl';

// STYLES 
import style from './index.css';

const GuiaTalles = () => {

    const [ searchData, setSearchData ] = useState( [] );
    
    const [ tallesContainer, setTallesContainer ] = useState();
    const [ openModal, setOpenModal ] = useState( false );
    const productData = useProduct();
    
    const brandFromProduct = productData?.product?.brand || '';
    let debugGender = '';
    let debugType = '';

    const categories = productData?.product?.categories || [];

    if (categories.length > 0) {
        const genderMap = {
            HOMBRE: 'Hombre',
            MUJER: 'Mujer',
            NIÑOS: 'Niños',
            NIÑO: 'Niños',
            NIÑA: 'Niños',
            UNISEX: 'Unisex'
        };

        categories.forEach(path => {
            const segments = path.split('/').filter(Boolean);
            if (segments.length === 0) return;
            const first = segments[0].toUpperCase();
            if (genderMap[first]) {
                if (!debugGender) {
                    debugGender = genderMap[first];
                }
                const candidateType = segments[segments.length - 1];
                // Evitar tomar solo la raíz de género como tipo (por ejemplo "/MUJER/")
                if (segments.length > 1 && candidateType.toUpperCase() !== first) {
                    debugType = candidateType;
                }
            }
        });
    }

    // Fallback de género usando la propiedad "Genero / Género" del producto
    let genderFromProps = '';
    const properties = productData?.product?.properties || [];

    properties.forEach((item) => {
        if (item?.name === 'Genero' || item?.name === 'Género') {
            if (Array.isArray(item.values) && item.values[0]) {
                genderFromProps = item.values[0];
            }
        }
    });

    const productName = productData?.product?.productName || '';

    const guideImageUrl = getGuideImageUrl({
        brand: brandFromProduct,
        gender: debugGender || genderFromProps,
        type: debugType,
        categories,
        productName,
    });

    useEffect( () => {
        
        console.log('GuiaTalles productData', productData?.product);

        const containerToTalles = document.querySelector('.vtex-store-components-3-x-skuSelectorSubcontainer--talle .vtex-store-components-3-x-skuSelectorNameContainer');
        
        if ( containerToTalles ) {

            setTallesContainer( containerToTalles );

        }

        /////
        let productType;
        let gener = 'Unisex';
        let brand;
        
        /**asigno marca */
        
        if( productData.product?.brand ) {
                    
            brand = productData.product.brand;

        }
        
        /**asigno productType */
        
        if ( productData.product?.categoryTree && productData.product?.categoryTree.length > 0 ) {

            // productType = productData.product.categoryTree[ productData.product.categoryTree.length - 1 ]?.name;
            productType = getProductType( productData.product?.categoryTree );

        }
        
        if ( productData.product?.properties ) {

            productData.product.properties?.forEach( item => {
                
                /**asigno genero */
                if( item.name === 'Genero' || item.name === 'Género' ) {
    
                    if ( item.values && item.values[0] ) {
                        
                        gener = item.values[0];

                    }
    
                }

            })

        }
        
        if ( productType && brand ) {

            setSearchData( [ productType, gener, brand ] )

        }
        /////

    }, [ productData ] )
    
    if ( searchData && searchData.length > 0 ) {

        const triggerContent = (

            <>

                <TriggerTalles setOpenModal={setOpenModal} hasImage={!!guideImageUrl} />
            </>

        )

        return (

            <>

                {tallesContainer
                    ? ReactDOM.createPortal(
            
                        triggerContent,
                        tallesContainer
    
                    )
                    : triggerContent
                }

                <div className={ openModal ? `${style.modalTalleWrapper} ${style.active}` : `${style.modalTalleWrapper}` }>

                    {/* <ModalTalles setOpenModal={setOpenModal} productData={productData}/> */}
                    <GetData
                        setOpenModal={setOpenModal}
                        productData={productData}
                        searchData={searchData}
                        imageUrl={guideImageUrl}
                    />

                </div>
    
            </>
            
        )

    }

    return (

        <></>

    )

}

export default GuiaTalles;