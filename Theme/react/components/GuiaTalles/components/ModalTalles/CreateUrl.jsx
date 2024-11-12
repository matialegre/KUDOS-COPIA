// COMPONENTS 
import { getUrl } from './helpers/getUrl';
import CreateModalTalle from './CreateModalTalle';

const CreateUrl = ( { setOpenModal, searchData, team_id } ) => {
    
    /**obtener la url con los datos de searchData */
    
    let url = getUrl( searchData );
    
    return (
        
        <CreateModalTalle setOpenModal={setOpenModal} url={url} team_id={team_id}/>

    )

}

export default CreateUrl;