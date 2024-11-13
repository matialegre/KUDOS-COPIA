import React from 'react';

// STYLE 
import style from './TableTalle.css';

const TableTalle = ( { data } ) => {

    let tallesGroup = {};

    data.forEach( attribute => {

        if ( tallesGroup.hasOwnProperty( attribute.key ) ) {

            tallesGroup[ attribute.key ].push(

                {
                    [ attribute.attribute.name ]: attribute.value
                }

            )

        } else {

            tallesGroup[ attribute.key ] = [

                {
                    [ attribute.attribute.name ]: attribute.value
                }

            ]

        }
        
    });

    let switchCellName = {
        'Calzado': "CM",
        'Cuerpo inferior': "Talle",
        'Cuerpo superior': "Talle",
        'Guantes': "Talle",
        'Gorro': "Talle"
    }

    tallesGroup = Object.entries( tallesGroup );

    return (

        <div className={style.wrapperTable}>

            <div className={style.columnFixed}>
                
                <div className={style.cellNameStaticHeader}>{ switchCellName[ data[0].attribute.product_type.name ] }</div>

                {

                    tallesGroup.map( item => {

                        return (

                            <div className={style.cellDinamic}>{item[0]}</div>

                        )

                    })

                }

            </div>

            <div className={style.rightContainerCells}>

                <div className={style.cellNameDinamicHeader}>

                    {
                    
                        tallesGroup[0][1].map( attribute => {

                            return (

                                <div className={style.cellDinamicHeader}>{ Object.keys( attribute )[0] }</div>

                            )

                        })
                    
                    }

                </div>

                <div className={style.containerCellsDinamics}>

                    {
                        
                        tallesGroup.map( ( item, index ) => {
                            
                            return (

                                <>

                                    {

                                        item[1].map( values => {
                                            
                                            return (

                                                <div className={ index % 2 === 0 ? `${style.cellDinamic} ${style.gray}` : `${style.cellDinamic} ${style.white}` }>{ Object.values( values )[0] }</div>
                    
                                            )

                                        })

                                    }
                                    
                                </>

                            )

                        })
                    
                    }

                </div>

            </div>

        </div>

    )

}

export default TableTalle;