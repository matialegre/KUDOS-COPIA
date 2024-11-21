export class SucursalesClass {

    _sucursales = {};

    get listadoSucursales () {

        return this._sucursales;

    }

    get listadoSucursalesArray () {

        let listadoSucursalesArray = [];

        Object.keys( this._sucursales ).forEach( key => {

            const eachSucursal = this._sucursales[ key ];

            listadoSucursalesArray.push( eachSucursal );

        })

        return listadoSucursalesArray;

    }

    constructor () {
        
        this._sucursales = {};

    }

    crearSucursalPorEstado( sucursalesData ) {
        
        for ( const sucursal of sucursalesData ) {

            if ( this._sucursales.hasOwnProperty( sucursal.address.state ) ) {

                this._sucursales[ sucursal.address.state ].push( sucursal );

            } else {

                this._sucursales[ sucursal.address.state ] = [ sucursal ];

            }

        }

    }

}