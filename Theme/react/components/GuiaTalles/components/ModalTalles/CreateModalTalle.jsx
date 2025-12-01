import React, { useState } from 'react';

// COMPONENTS 
import ModalTalles from './ModalTalles';

// HOOKS 
import useFetch from './hooks/useFetch';

// STYLE 
import style from './ModalTalles.css';

const CreateModalTalle = ( { setOpenModal, url, team_id, imageUrl } ) => {
    
    const [isZoomed, setIsZoomed] = useState(false);
    const [hoverOrigin, setHoverOrigin] = useState({ x: 50, y: 50 });

    const clickInTrigger = () => {

        setOpenModal( false );

    }

    const handleMouseEnter = () => {
        setIsZoomed(true);
    }

    const handleMouseLeave = () => {
        setIsZoomed(false);
        setHoverOrigin({ x: 50, y: 50 });
    }

    const handleMouseMove = (event) => {
        if (!isZoomed) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const relativeX = ((event.clientX - rect.left) / rect.width) * 100;
        const relativeY = ((event.clientY - rect.top) / rect.height) * 100;

        const clampedX = Math.min(100, Math.max(0, relativeX));
        const clampedY = Math.min(100, Math.max(0, relativeY));

        setHoverOrigin({ x: clampedX, y: clampedY });
    }

    /**
     * Si tenemos una imageUrl, priorizamos mostrar la imagen
     * y un mensaje de NO DISPONIBLE para tablas dinámicas.
     */
    if ( imageUrl ) {

        return (

            <div className={style.modalTalleContainerImage}>

                <img onClick={ clickInTrigger } className={style.closeModal} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='28' viewBox='0 0 29 28' fill='none'%3E%3Crect width='28' height='28' transform='translate(0.0644531)' fill='%2309344D'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.6383 8.43466C19.2932 8.08957 18.7358 8.08957 18.3907 8.43466L14.0638 12.7527L9.73692 8.42581C9.39183 8.08072 8.83437 8.08072 8.48929 8.42581C8.1442 8.7709 8.1442 9.32835 8.48929 9.67344L12.8162 14.0003L8.48929 18.3272C8.1442 18.6723 8.1442 19.2298 8.48929 19.5748C8.83437 19.9199 9.39183 19.9199 9.73692 19.5748L14.0638 15.248L18.3907 19.5748C18.7358 19.9199 19.2932 19.9199 19.6383 19.5748C19.9834 19.2298 19.9834 18.6723 19.6383 18.3272L15.3114 14.0003L19.6383 9.67344C19.9746 9.3372 19.9746 8.7709 19.6383 8.43466Z' fill='white'/%3E%3C/svg%3E"/>

                <div
                    className={style.modalTalleImageWrapper}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                >
                    <img
                        src={imageUrl}
                        alt="Guía de talles"
                        className={`${style.modalTalleImage} ${isZoomed ? style.modalTalleImageZoomed : ''}`}
                        style={
                            isZoomed
                                ? {
                                      transform: 'scale(1.4)',
                                      transformOrigin: `${hoverOrigin.x}% ${hoverOrigin.y}%`,
                                  }
                                : undefined
                        }
                    />
                </div>

            </div>

        )

    }

    const { data } = useFetch( url, team_id );

    const hasValidData = Array.isArray( data ) && data.length > 0;

    if ( hasValidData && url ) {

        return (

            <ModalTalles setOpenModal={setOpenModal} data={data}/>

        )

    } else {

        console.error("Este producto no tiene cargado talles en Kudos Control o la respuesta no es válida", url, data);
        
        return (
        
            <div className={style.alertNotify}>
                <img onClick={ clickInTrigger } className={style.closeModal} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M13.4115 12L18.6952 6.71628C18.7906 6.62419 18.8666 6.51404 18.919 6.39225C18.9713 6.27046 18.9988 6.13947 19 6.00692C19.0011 5.87438 18.9759 5.74293 18.9257 5.62025C18.8755 5.49756 18.8013 5.38611 18.7076 5.29238C18.6139 5.19865 18.5024 5.12453 18.3798 5.07434C18.2571 5.02414 18.1256 4.99889 17.9931 5.00004C17.8605 5.00119 17.7295 5.02873 17.6078 5.08104C17.486 5.13336 17.3758 5.20941 17.2837 5.30475L12 10.5885L6.71628 5.30475C6.528 5.12291 6.27584 5.0223 6.01411 5.02457C5.75237 5.02685 5.502 5.13183 5.31691 5.31691C5.13183 5.502 5.02685 5.75237 5.02457 6.01411C5.0223 6.27584 5.12291 6.528 5.30475 6.71628L10.5885 12L5.30475 17.2837C5.20941 17.3758 5.13336 17.486 5.08104 17.6078C5.02873 17.7295 5.00119 17.8605 5.00004 17.9931C4.99889 18.1256 5.02414 18.2571 5.07434 18.3798C5.12453 18.5024 5.19865 18.6139 5.29238 18.7076C5.38611 18.8013 5.49756 18.8755 5.62025 18.9257C5.74293 18.9759 5.87438 19.0011 6.00692 19C6.13947 18.9988 6.27046 18.9713 6.39225 18.919C6.51404 18.8666 6.62419 18.7906 6.71628 18.6952L12 13.4115L17.2837 18.6952C17.472 18.8771 17.7242 18.9777 17.9859 18.9754C18.2476 18.9732 18.498 18.8682 18.6831 18.6831C18.8682 18.498 18.9732 18.2476 18.9754 17.9859C18.9777 17.7242 18.8771 17.472 18.6952 17.2837L13.4115 12Z' fill='%23434343'/%3E%3C/svg%3E"/>
                <p>Guía de talles NO DISPONIBLE para este producto.</p>
            </div>
    
        )

    }
    

}

export default CreateModalTalle;