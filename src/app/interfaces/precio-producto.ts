import { Producto } from "./producto";

export interface PrecioProducto {
    idPrecioProducto: number;
    nombre: string;
    utilidad: number;    
    precioVenta: number;
    esLiquidacion: boolean;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    utilidadLiquidacion: number;
    precioVentaLiquidacion: number;

    // -- Relaciones -- 
    producto: Producto;
}