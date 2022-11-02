import { DetalleProforma } from "./detalle-proforma";
import { Factura } from "./factura";
import { Persona } from "./persona";
import { Termino } from "./termino";

export interface Proforma {
    idProforma: number;
    fechaEmision: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    cantidadProductos: number;
    subTotal: number;
    comentario: string;
    fechaVencimiento: Date;    
    porcentajeDescuento: number;
    total: number;    
    estado: string;
    vendedor: string;

    // -- Relaciones --
    persona: Persona;
    detallesProforma: DetalleProforma[];
    facturas: Factura[];
    termino: Termino;
}
