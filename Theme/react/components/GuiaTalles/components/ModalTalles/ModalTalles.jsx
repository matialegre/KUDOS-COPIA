import React, { useState } from 'react';

// COMPONENTS 
import ShowTalleOf from './ShowTalleOf';

// STYLES 
import style from './ModalTalles.css';

const ModalTalles = ( { setOpenModal, data } ) => {

    const clickInTrigger = () => {

        setOpenModal( false );

    }

    return (

        <div className={style.modalTalleContainer}>

            <img onClick={ clickInTrigger } className={style.closeModal} src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='28' viewBox='0 0 29 28' fill='none'%3E%3Crect width='28' height='28' transform='translate(0.0644531)' fill='%2309344D'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M19.6383 8.43466C19.2932 8.08957 18.7358 8.08957 18.3907 8.43466L14.0638 12.7527L9.73692 8.42581C9.39183 8.08072 8.83437 8.08072 8.48929 8.42581C8.1442 8.7709 8.1442 9.32835 8.48929 9.67344L12.8162 14.0003L8.48929 18.3272C8.1442 18.6723 8.1442 19.2298 8.48929 19.5748C8.83437 19.9199 9.39183 19.9199 9.73692 19.5748L14.0638 15.248L18.3907 19.5748C18.7358 19.9199 19.2932 19.9199 19.6383 19.5748C19.9834 19.2298 19.9834 18.6723 19.6383 18.3272L15.3114 14.0003L19.6383 9.67344C19.9746 9.3372 19.9746 8.7709 19.6383 8.43466Z' fill='white'/%3E%3C/svg%3E"/>

            <h3 className={style.titleModalTalle}>Guía de talles</h3>

            <p className={style.subTitleModalTalle}>Cómo tomar tus medidas</p>

            <ShowTalleOf data={data}/>

        </div>

    )

}

export default ModalTalles;