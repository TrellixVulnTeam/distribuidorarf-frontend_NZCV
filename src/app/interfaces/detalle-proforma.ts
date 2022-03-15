import { Factura } from "./factura";
import { Producto } from "./producto";
import { Proforma } from "./proforma";
import { VersionProforma } from "./version-proforma";

export interface DetalleProforma {
    idDetalleProforma: number;
    precioVenta: number;
    descuento: number;
    porcentajeDescuento: number;
    totalLinea: number;    
    yaEnFactura: boolean;
    fechaCreacion: Date;    
    fechaUltimaModificacion: Date;

    // -- Relaciones --
    proforma: Proforma;
    producto: Producto;
    factura: Factura;
    versiones: VersionProforma[];
}
