import { DetalleProforma } from "./detalle-proforma";
import { Proforma } from "./proforma";
import { Termino } from "./termino";

export interface Factura {    
    idFactura: number;

    // -- Relaciones --
    proforma: Proforma;
    termino: Termino;
    detallesProforma: DetalleProforma[];
    
    fechaEmision: Date;    
    fechaVencimiento: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
}
