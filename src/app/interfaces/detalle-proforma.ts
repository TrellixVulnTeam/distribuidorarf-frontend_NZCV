import { DetalleProducto } from "./detalle-producto";
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
    codigoResponsable: string;
    cantidad: number;
    precioInicial: number;
    url: string;
    detalleProfoma: number;
    borrado: boolean;
    lineaSeparada: boolean;

    // -- Relaciones --
    proforma: Proforma;
    detalleProducto: DetalleProducto;
    factura: Factura;
    versiones: VersionProforma[];
}
