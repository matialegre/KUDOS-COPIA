import React, {useState} from 'react';
import sucursalesData from './Data/sucursalesData'
import SucDescription from "./SucDescription";
import Map from './Map/Map'
import styles from './sucursales.css';

import { SucursalesClass } from './Data/sucurcalesOrdenadas';

const Sucursales = () => {

  const sucursalesInstance = new SucursalesClass();
  sucursalesInstance.crearSucursalPorEstado( sucursalesData );
  let sucursalesEnVistaPorDefecto = sucursalesInstance.listadoSucursales[ Object.keys( sucursalesInstance.listadoSucursales )[0] ];
  
  // Listado de sucursales activas en vista
  const [ sucursalesEnVista, setSucursalesEnVista ] = useState( sucursalesEnVistaPorDefecto );
  
  // POSITION
  const [ position, setPosition ] = useState(

    {
      lat: sucursalesEnVistaPorDefecto[0].address.location.latitude,
      lng: sucursalesEnVistaPorDefecto[0].address.location.longitude,
      zoom: 9
    }

  );

  // RETURN
  return (

    <>

      <div className={styles.sucursales}>

        {/* COLUMN LEFT */}
        <div className={styles.columLeft}>

          {/* FILTER */}
          <div className={styles.filter}>

            <select className={styles.select} onInput={ e => {

              let nuevasSucursalesParaListar = sucursalesInstance.listadoSucursales[ e.target.value ];

              setSucursalesEnVista ( nuevasSucursalesParaListar );

              Object.keys( sucursalesInstance.listadoSucursales ).find( ( key, index ) => {

                if ( key === e.target.value ) {

                  return setPosition(

                    {
                      lat: sucursalesInstance.listadoSucursales[key][0].address.location.latitude,
                      lng: sucursalesInstance.listadoSucursales[key][0].address.location.longitude,
                      zoom: 9
                    }

                  )

                };

              });
              
            }}>
              
              {

                Object.keys( sucursalesInstance.listadoSucursales ).map( ( key, index ) => {

                  let stateName = key;

                  return (

                    <option className={styles.option} value={stateName} key={stateName.toLowerCase().replace(' ', '_')}>{stateName}</option>

                  )

                })

              }

            </select>

          </div>

          {/* SUCURSALES */}
          <div className={styles.sucursalesList}>

            {

              sucursalesEnVista.map( sucursal => {

                return (

                  <SucDescription sucursal={sucursal} key={sucursal.name} setPosition={setPosition}/>

                )

              })

            }

          </div>

        </div>

        {/* COLUMN RIGHT */}
        <div className={styles.columnRight}>

          {/* MAP */}
          <Map latitud={position.lat} longitud={position.lng} zoomVal={position.zoom}/>

          <div className={styles.comingsoonContainer}>
            <p className={styles.comingsoonTitle}>Próximamente:</p>
            <p className={styles.comingsoonName}>Avenida Santa Fé 4830, Buenos Aires</p>
          </div>

        </div>
        
      </div>

    </>

  )

};

export default Sucursales;