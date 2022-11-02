import { DetalleProforma } from "./detalle-proforma";
import { PagoFactura } from "./pago-factura";
import { Proforma } from "./proforma";
import { Termino } from "./termino";

export interface Factura {    
    idFactura: number;

    // -- Relaciones --
    proforma: Proforma;
    termino: Termino;
    detallesProforma: DetalleProforma[];
    pagosFactura: PagoFactura[];
    
    fechaEmision: Date;    
    fechaVencimiento: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    codigoResponsable: string;
    monto: number;
    montoPagado: number;
    montoPendiente: number;
    pagada: boolean;
}
