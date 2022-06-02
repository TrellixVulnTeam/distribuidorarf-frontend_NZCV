import { DetalleLote } from "../detalle-lote";
import { DetalleProducto } from "../detalle-producto";

export interface DetalleProductoLoteDto {
    detalleLote: string;
    detalleProducto: string;
    cantidad: number;
}
