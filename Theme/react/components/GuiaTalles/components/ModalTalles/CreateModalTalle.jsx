// COMPONENTS 
import ModalTalles from './ModalTalles';

// HOOKS 
import useFetch from './hooks/useFetch';

const CreateModalTalle = ( { setOpenModal, url, team_id } ) => {
    
    const { data } = useFetch( url, team_id );

    if ( data && url ) {

        return (

            <ModalTalles setOpenModal={setOpenModal} data={data}/>

        )

    }
    
    return <div>NO SE RECIBIERON DATOS CreateModalTalle</div>

}

export default CreateModalTalle;