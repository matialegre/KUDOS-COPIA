import React from 'react';

// STYLES 
import style from './TriggerTalles.css';

const TriggerTalles = (  { setOpenModal } ) => {

    const clickInTrigger = () => {

        setOpenModal( true );

    }

    return (

        <div className={style.triggerTallesContainer} onClick={ clickInTrigger }>
            <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='16' viewBox='0 0 17 16' fill='none'%3E%3Cg clip-path='url(%23clip0_6688_53567)'%3E%3Cpath d='M4.29295 9.81822L2.40733 11.7039L4.76435 14.0609L13.7211 5.10419L11.364 2.74717L9.9498 4.16139L10.8926 5.10419L9.9498 6.04701L9.007 5.10419L7.5928 6.51841L9.007 7.93262L8.0642 8.87542L6.64997 7.46122L5.23576 8.87542L6.17856 9.81822L5.23576 10.761L4.29295 9.81822ZM11.8354 1.33296L15.1353 4.63279C15.3956 4.89314 15.3956 5.31525 15.1353 5.5756L5.23576 15.4751C4.97541 15.7354 4.5533 15.7354 4.29295 15.4751L0.993117 12.1753C0.732763 11.9149 0.732763 11.4928 0.993117 11.2325L10.8926 1.33296C11.1529 1.07261 11.5751 1.07261 11.8354 1.33296Z' fill='%232680EB'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='clip0_6688_53567'%3E%3Crect width='16' height='16' fill='white' transform='translate(0.0639648)'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E"/>
            <p>Guía de talles</p>
        </div>

    )

}

export default TriggerTalles;