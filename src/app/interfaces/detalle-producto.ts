import { Producto } from "./producto";

export interface DetalleProducto {
    idDetalleProducto: string;
    colorNombre: string;
    colorHexadecimal: string;
    talla: string;
    cantidad: number;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones --    
    producto: Producto;
}
