import { Producto } from "./producto";

export interface PrecioProducto {
    idPrecioProducto: number;
    nombre: string;
    utilidad: number;
    porcentajeUtilidad: number;
    precioVenta: number;
    esLiquidacion: boolean;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones -- 
    producto: Producto;
}