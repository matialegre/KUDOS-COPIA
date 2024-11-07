import React, { useRef, useEffect, useState } from 'react';

import { useProduct } from 'vtex.product-context';

import style from './index.css';

const EspecificacionesPDP = () => {

    const refColumnContainer = useRef();
    const [description, setDescription] = useState(null);

    const productData = useProduct();
    
    //ARMAR ARRAY PARA COLUMNA IZQUIERDA DE ESPECIFICACIONES
    let desc = productData.product?.description;
    desc = desc.replaceAll("<p>", "");
    desc = desc.replaceAll("</p>", "");
    desc = desc.replaceAll("/\n/g", "");
    const string = desc;
    const regex = /<strong>(.*?)<\/strong>/g;
    const matches = string.match(regex);
    let leftColumn;
    
    if ( matches ) {

        leftColumn = matches.map(match => match.replace(/<strong>|<\/strong>/g, ""));
        leftColumn.shift();
        
    }
    //FIN ARMAR ARRAY PARA COLUMNA IZQUIERDA DE ESPECIFICACIONES

    //ARAMAR ARRAY PARA COLUMNA DERECHA DE ESPECIFICACIONES
    const string2 = desc;
    const regex2 = /<strong>.*?<\/strong>/g;
    let newString = string2.replace(regex2, "");
    newString = newString.replaceAll( "\n", "" );
    const string3 = newString;
    const separator1 = "<br />";
    const separator2 = "<br /><br />";
    const regex3 = new RegExp(`${separator1}|${separator2}`, "g");
    const result2 = string3.split(regex3);
    const arr = result2;
    let rightColumn = arr.filter( item => item !== "" );
    rightColumn.shift();
    //ARAMAR ARRAY PARA COLUMNA DERECHA DE ESPECIFICACIONES

    // FUNCION ABRIR CERRAR ESPECIFICACIONES
    const openSpecification = event => {
        
        let containerSpecification = event.target.parentElement;
        
        if ( containerSpecification.style.height && containerSpecification.style.height !== "27px" ) {

            containerSpecification.style.height = "27px";
            containerSpecification.children[0].children[1].style.transform = "rotate(0deg)";

        } else {

            containerSpecification.style.height = refColumnContainer.current.clientHeight + 49 + "px";
            containerSpecification.children[0].children[1].style.transform = "rotate(90deg)";

        }

    }
    // FIN FUNCION ABRIR CERRAR ESPECIFICACIONES

    if ( !productData || !leftColumn || !rightColumn ) {
        
        return (
    
            // <div className={`${style.contSpecification}`}>Cargando especificaciones...</div>
            <></>
    
        )

    } else {

        console.log(productData.product?.description)

        return (
            
            <div className={style.propertiresContainer}>

                <div className={style.descriptionContainer}>
                    <h2>Descripción</h2>
                    <div className={style.productDescription} dangerouslySetInnerHTML={{__html: productData.product?.description}}></div>
                </div>

                {/* <div className={style.specificationContainer}>

                    <div className={style.drawerColumContainer} onClick={ event => openSpecification( event ) }>
                        <p>Especificaciones</p>
                        <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15' fill='none'%3E%3Cg clip-path='url(%23clip0_6357_17289)'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M4.41724 15L3.375 13.946L9.57092 7.49016L8.91028 6.8016L8.91357 6.80539L3.40833 1.06991L4.43555 -8.57334e-08C5.95713 1.5852 10.2051 6.0109 11.625 7.49016C10.5704 8.58959 11.5989 7.51816 4.41724 15Z' fill='black'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_6357_17289'%3E%3Crect width='15' height='15' fill='white' transform='matrix(1.19249e-08 -1 -1 -1.19249e-08 15 15)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E"/>
                    </div>

                    <div className={style.columnContainer} ref={refColumnContainer}>

                        {

                            leftColumn.map( ( item, index ) => {

                                return (
                                    
                                    <div className={style.rowContainer}>
                                        <p>{item}</p>
                                        <p>{rightColumn[index]}</p>
                                    </div>

                                )

                            })

                        }

                    </div>
                    
                </div> */}

            </div>
        
        )

    }

}

export default EspecificacionesPDP;