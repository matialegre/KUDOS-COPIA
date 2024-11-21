import React from 'react';
import { useRuntime } from 'vtex.render-runtime';

/*estilos*/
import styles from './index.css';
/*fin estilos*/

const BreadcrumbCustom = () => {

    const { route, navigate } = useRuntime();

    return (

        <div className={styles.breadcrumbContainer}>
            <p onClick={ () => navigate( { to: '/' }) }>Inicio</p>
            <p>/</p>
            <p>{route.title}</p>
        </div>

    )

}

export default BreadcrumbCustom;