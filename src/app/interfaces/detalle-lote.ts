import { Lote } from "./lote";
import { Producto } from "./producto";

export interface DetalleLote {
    // -- Relaciones --
    lote: Lote;
    producto: Producto;
    descripcion: string;
    composicion: string;
    cantidad: number;
    costo: number;    
    precioTotal: number;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    codigoResponsable: string;
}
