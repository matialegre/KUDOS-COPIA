// COMPONENTS 
import { getUrl } from './helpers/getUrl';
import CreateModalTalle from './CreateModalTalle';

const CreateUrl = ( { setOpenModal, searchData, team_id, imageUrl } ) => {
    
    /**obtener la url con los datos de searchData */
    
    let url = getUrl( searchData );

    /**
     * Si tenemos una imageUrl válida para la guía de talles,
     * evitamos pedir datos a Kudos y dejamos que CreateModalTalle
     * muestre solo la imagen o el mensaje de NO DISPONIBLE.
     */
    if (imageUrl) {

        return (

            <CreateModalTalle setOpenModal={setOpenModal} url={null} team_id={team_id} imageUrl={imageUrl} />

        )

    }
    
    return (
        
        <CreateModalTalle setOpenModal={setOpenModal} url={url} team_id={team_id} />

    )

}

export default CreateUrl;