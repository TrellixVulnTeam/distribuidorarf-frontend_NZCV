import { Producto } from "./producto";

export interface Kardex {
    idKardex: number;

    // -- Relaciones --
    producto: string;
    persona: string;

    unidades: number;
    balance: number;
    costo: number;    
    concepto: string;
    idDetalleProducto: string;
    precioVenta: string;    
    fechaCreacion: Date,
    fechaUltimaModificacion: Date;
    esRetiro: boolean;
    codigoResponsable: string;
}
