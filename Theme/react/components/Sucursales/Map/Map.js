import React, {useState} from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import sucursalesData from '../Data/sucursalesData';
import { SucursalesClass } from '../Data/sucurcalesOrdenadas';

// COMPONENT
const Map = ( { latitud, longitud, zoomVal } ) => {

  // SIZE MAP
  const containerStyle = {
    width: '543px',
    height: '400px'
  };

  // MAP POSITION
  const center = {
    lat: latitud,
    lng: longitud
  };

// ALL COORDINATES
const allCoordinates = [];

const sucursalesInstance = new SucursalesClass();
sucursalesInstance.crearSucursalPorEstado( sucursalesData );
let listadoSucursales  = sucursalesInstance.listadoSucursales;
  
Object.keys( listadoSucursales ).forEach( ( key, index ) => {

  for ( const sucursal of listadoSucursales[ key ] ) {

    allCoordinates.push(

      {
        "coordinates": {
          "lat": sucursal.address.location.latitude,
          "lng": sucursal.address.location.longitude
        },
        "dates": {
          "nombre": sucursal.name,
          "direccion": `${sucursal.address.street} ${sucursal.address.number}`,
        }
      }
  
    );
    
  }

})

  // sucursalesData.map( zona => {

  //   sucursales.map( suc  => {

  //     allCoordinates.push(
  //       {
  //         "coordinates": {
  //           "lat": suc.coordenadas[0].lat,
  //           "lng": suc.coordenadas[0].lng
  //         },
  //         "dates": {
  //           "nombre": suc.nombre,
  //           "direccion": suc.direccion,
  //         }
  //       }
  //     );
      
  // })

  // RETURN COMPONENT
  return (

    // MAP INIT
    <LoadScript
      googleMapsApiKey="AIzaSyAmiar7vQTJPt9VF416lAXAMqKroR5cuMc"
    >

      {/* MAP */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoomVal}
      >

        {
          allCoordinates.map((sucursal) => {
            const [state, setstate] = useState(false);

            return <>
            
              {/* MARKERS */}
              <Marker position={sucursal.coordinates} onClick={() => {
                setstate(true)
              }} />

              {
                // INFO WINDOW
                state === true
                  ?
                <InfoWindow position={sucursal.coordinates} onCloseClick={ () => {setstate(false)}}>
                  <div>
                    <h3>{sucursal.dates.nombre}</h3>
                    <p style={{marginTop: "5px"}}>{sucursal.dates.direccion}</p>
                  </div>
                </InfoWindow>
                  :
                false
              }
            </>
          })
        }
      
      </GoogleMap>

    </LoadScript>
  )
};

export default Map;