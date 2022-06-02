import { number } from "ngx-custom-validators/src/app/number/validator";
import { Lote } from "./lote";
import { Producto } from "./producto";

export interface DetalleLote {
    idDetalleLote: string;
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
    cantidadAsignada: number;
}
