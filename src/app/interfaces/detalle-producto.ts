import { Producto } from "./producto";

export interface DetalleProducto {
    idDetalleProducto: string;
    colorNombre: string;
    colorHexadecimal: string;
    talla: string;
    cantidad: number;
    codigoResponsable: string;

    // -- Relaciones --    
    producto: Producto;
}
