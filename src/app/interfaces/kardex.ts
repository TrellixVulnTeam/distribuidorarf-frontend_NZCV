import { Producto } from "./producto";

export interface Kardex {
    idKardex: number;

    // -- Relaciones --
    producto: Producto;
    persona: string;

    unidades: number;
    balance: number;
    costo: number;    
    concepto: string;
    idDetalleProducto: string;
    precioVenta: number;    
    fechaCreacion: Date,
    fechaUltimaModificacion: Date;
    esRetiro: boolean;
    codigoResponsable: string;
    esRetiroTemporal: boolean;
    fechaReIngreso: Date;
    finalizadoReingreso: boolean;
    detalleProforma: number;
}
