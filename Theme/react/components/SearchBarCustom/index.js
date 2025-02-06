import React, { useState, useEffect } from 'react';
import { useRuntime } from 'vtex.render-runtime';

//STYLE
const style = require('./index.css');

const SearchBarCustom = ( { SearchBar } ) => {

    const { route } = useRuntime();

    const [ showSearchBar, setShowSearchBar ] = useState( false );
    
    useEffect( () => {

        setShowSearchBar( false );

    }, [ route.path ] )
    

    return (

        <div className={style.containerSearchBar}>

            <div className={style.drawerSearchBar} onClick={ () => setShowSearchBar( true ) }></div>

            {
                showSearchBar ?

                    <div className={style.modalSearchBar}>

                        <div className={style.closeModalSearchBar} onClick={ () => setShowSearchBar( false ) }></div>

                        <SearchBar/>

                    </div>

                :

                    <></>

            }

        </div>

    )

}

export default SearchBarCustom;