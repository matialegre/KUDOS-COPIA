import React, { useState } from 'react';

//STYLE
const style = require('./index.css');

const SearchBarCustom = ( { SearchBar } ) => {

    const [ showSearchBar, setShowSearchBar ] = useState( false );

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