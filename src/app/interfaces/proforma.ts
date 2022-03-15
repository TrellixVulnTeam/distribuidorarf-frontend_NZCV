import { DetalleProforma } from "./detalle-proforma";
import { Factura } from "./factura";
import { Persona } from "./persona";

export interface Proforma {
    idProforma: number;
    fechaEmision: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    cantidadProductos: number;
    subTotal: number;
    comentario: string;

    // -- Relaciones --
    persona: Persona;
    detallesProforma: DetalleProforma[];
    facturas: Factura[];
}
