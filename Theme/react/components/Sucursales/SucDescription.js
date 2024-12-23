import React, {useState} from 'react';
import styles from './sucursales.css';

const SucDescription = ( { sucursal, setPosition } ) => {
  
  const [ state, setState ] = useState(false);

  // RETURN COMPONENT
  return (

    <div className={`${styles.sucursal} ${state === true ? styles.active : styles.disabled}`} onClick={ () => {

      setPosition(
        {
          "lat": sucursal.address.location.latitude,
          "lng": sucursal.address.location.longitude,
          "zoom": 15
        }
      );

      state === false ?  setState(true) : setState(false)

    }}>

      <h4 className={styles.surcursalName}>{sucursal.name}</h4>

      <div className={`${styles.details}`}>
        <p className={styles.dates}>{sucursal.address.street} {sucursal.address.number}, {sucursal.address.city}</p>
        <p className={styles.dates}>{sucursal.address.state}, {sucursal.address.postalCode}</p>
        <p className={styles.dates}><b>Horarios:</b> {sucursal.horarios}</p>
        <p className={styles.dates}>{sucursal.telefono}</p>
      </div>
      
    </div>

  )

};

export default SucDescription;