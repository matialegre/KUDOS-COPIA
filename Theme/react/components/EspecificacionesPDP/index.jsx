import React, { useRef, useEffect } from 'react';

import { useProduct } from 'vtex.product-context';

import style from './index.css';

const EspecificacionesPDP = () => {

    const containerDescriptionPDP = useRef();
    const containerSpecificationPDP = useRef();

    const productData = useProduct();
    let description = productData.product?.description;
    let specifications = productData.product?.properties;
    
    // FUNCIONES 
    const expandDescription = () => {

        const divExpand = containerDescriptionPDP.current;
        
        if ( divExpand ) {

            const heightDivHidden = divExpand.querySelector(`.${style.descriptionExpandableModal}`);
            const iconExpand = divExpand.querySelector(`.${style.descriptionExpandableHeader} img`);
            
            if ( parseInt( getComputedStyle( divExpand ).height ) > 48 ) {

                divExpand.style.height = "48px";
                iconExpand.style.transform = "rotate(0deg)";

            } else {

                const newHeight = parseFloat( getComputedStyle( heightDivHidden ).height );
                
                divExpand.style.height = 48 + newHeight + "px";
                iconExpand.style.transform = "rotate(-180deg)";

            }

        }
        
    }

    useEffect( () => {
        
        expandDescription();
      
    }, [containerDescriptionPDP.current] )
    

    const expandSpecification = () => {

        const divExpand = containerSpecificationPDP.current;
        const heightDivHidden = divExpand.querySelector(`.${style.specificationExpandableModal}`);
        const iconExpand = divExpand.querySelector(`.${style.specificationExpandableHeader} img`);
        
        if ( parseInt( getComputedStyle( divExpand ).height ) > 48 ) {

            divExpand.style.height = "48px";
            iconExpand.style.transform = "rotate(0deg)";

        } else {

            const newHeight = parseFloat( getComputedStyle( heightDivHidden ).height );
            
            divExpand.style.height = 48 + newHeight + "px";
            iconExpand.style.transform = "rotate(-180deg)";

        }
        

    }
    // FIN FUNCIONES 

    if ( description && specifications ) {

        return (

            <div className={style.wrapperDescriptionSpecification}>

                <div className={style.containerDescriptionPDP} ref={containerDescriptionPDP}>

                    {/* <div className={style.descriptionExpandableHeader} onClick={ expandDescription }> */}
                    <div className={style.descriptionExpandableHeader} onClick={ expandDescription }>

                        <p>Descripción</p>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='18' viewBox='0 0 19 18' fill='none'%3E%3Cpath d='M8.37662 11.1968L8.37648 11.1967L4.38218 6.92116C4.38216 6.92115 4.38215 6.92113 4.38213 6.92112C4.28735 6.81949 4.29318 6.66122 4.39296 6.56738C4.49472 6.47319 4.65373 6.47996 4.74603 6.57889L4.74629 6.57916L8.69879 10.8092L9.06412 11.2001L9.42945 10.8092L13.382 6.57916L13.3826 6.57843C13.4752 6.47894 13.6343 6.47298 13.7348 6.56693C13.8357 6.66135 13.8412 6.82005 13.7468 6.92116L9.75284 11.1964C9.75275 11.1965 9.75265 11.1965 9.75256 11.1966C9.75254 11.1967 9.75252 11.1967 9.7525 11.1967C9.57046 11.391 9.31783 11.5 9.06412 11.5C8.81014 11.5 8.55766 11.3908 8.37662 11.1968Z' fill='%23676F79' stroke='%23676F79'/%3E%3C/svg%3E"/>

                    </div>

                    <div className={style.descriptionExpandableModal}>

                    <div dangerouslySetInnerHTML={{__html: description}}></div>
                        {/* <p>{description}</p> */}

                    </div>

                </div>

                <div className={style.containerSpecificationPDP} ref={containerSpecificationPDP}>

                    <div className={style.specificationExpandableHeader} onClick={ expandSpecification }>

                        <p>Especificaciones</p>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='19' height='18' viewBox='0 0 19 18' fill='none'%3E%3Cpath d='M8.37662 11.1968L8.37648 11.1967L4.38218 6.92116C4.38216 6.92115 4.38215 6.92113 4.38213 6.92112C4.28735 6.81949 4.29318 6.66122 4.39296 6.56738C4.49472 6.47319 4.65373 6.47996 4.74603 6.57889L4.74629 6.57916L8.69879 10.8092L9.06412 11.2001L9.42945 10.8092L13.382 6.57916L13.3826 6.57843C13.4752 6.47894 13.6343 6.47298 13.7348 6.56693C13.8357 6.66135 13.8412 6.82005 13.7468 6.92116L9.75284 11.1964C9.75275 11.1965 9.75265 11.1965 9.75256 11.1966C9.75254 11.1967 9.75252 11.1967 9.7525 11.1967C9.57046 11.391 9.31783 11.5 9.06412 11.5C8.81014 11.5 8.55766 11.3908 8.37662 11.1968Z' fill='%23676F79' stroke='%23676F79'/%3E%3C/svg%3E"/>

                    </div>

                    <div className={style.specificationExpandableModal}>
                        
                        <div className={style.specificationColumnLeft}>

                            {

                                specifications.map( item => {

                                    return (

                                        <div>{item.name}</div>

                                    )

                                })

                            }

                        </div>

                        <div className={style.specificationColumnRight}>

                            {

                                specifications.map( item => {

                                    return (

                                        <div>{item.values[0]}</div>

                                    )

                                })

                            }

                        </div>

                    </div>

                </div>

            </div>

        )

    }
    
    return <></>

}

export default EspecificacionesPDP;