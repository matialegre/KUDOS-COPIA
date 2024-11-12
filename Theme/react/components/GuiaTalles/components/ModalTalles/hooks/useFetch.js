import { useState, useEffect } from 'react';

const useFetch = ( url, team_id ) => {
    
    const [ state, setState ] = useState({
        data: null
    });

    const getFetch = async () => {

        try {
            
            let resp = await fetch( url );
            let data = await resp.json();

            let obj = {

                team_id: team_id,
                date_fetch: new Date().getTime(),
                petitionFetch: [ ...data ]
    
            }   
    
            let petitionFetchLocal = [];
            petitionFetchLocal.push( obj );

            sessionStorage.setItem( url + team_id , JSON.stringify( petitionFetchLocal ) );
            
            setState({
                ...state,
                data
            })

        } catch (error) {

            console.log("Error en useFetch.js", error );

            setState({
                ...state,
                data: 'failedFetch'
            })

        }

    }

    useEffect(() => {

        if ( url && url !== 'noData' ) {

            //tiempo, en horas, despues del cual se debe realizar un nuevo fetch a Kudos Control
            let time_kc_fetch = 12;
        
            if(sessionStorage){

                if ( sessionStorage.getItem( url + team_id ) ) {
                    
                    //busco menu en sessionStorage y no realizo fetch
                    let arrStorage = JSON.parse( sessionStorage.getItem( url + team_id ) );
                    
                    let time_between_load = (new Date().getTime() - arrStorage[0].date_fetch) / 3600000;
                    
                    if(time_between_load < time_kc_fetch){
        
                        console.log("Aun no han pasado 12 horas desde el fetch a KC");
                        
                        setState({
                            ...state,
                            data: arrStorage[0].petitionFetch
                        })
                        
                    }else{
        
                        console.log("Han pasado mas de 12 horas del fetch a KC");
                        
                        getFetch();
                        
                    }
                        
                }else{
                    
                    getFetch();
                    
                }
        
            }else{
        
                /**Navegador no compatible con sessionStorage (ergo, con tabla de talles)*/
                
            }

        }

        if ( url === 'noData' ) {

            setState({
                ...state,
                data: []
            })

        }

    }, [ url ] )
    

    return {
        data: state.data
    }

}

export default useFetch