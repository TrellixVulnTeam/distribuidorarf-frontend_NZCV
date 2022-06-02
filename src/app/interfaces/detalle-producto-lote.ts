import { DetalleLote } from "./detalle-lote";
import { DetalleProducto } from "./detalle-producto";

export interface DetalleProductoLote {
    detalleLote: DetalleLote;
    detalleProducto: DetalleProducto;
    cantidad: number;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
}