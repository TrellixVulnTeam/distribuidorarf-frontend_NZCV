import { Producto } from "./producto";

export interface Kardex {
    idKardex: number;

    // -- Relaciones --
    producto: Producto;

    fecha: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    unidades: number;
    balance: number;
    costo: number;    
    concepto: string;
}
