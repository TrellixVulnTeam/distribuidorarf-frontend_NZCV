export interface DetalleProductoDto {
    idDetalleProducto: string;
    colorNombre: string;
    colorHexadecimal: string;
    talla: string;
    cantidad: number;

    // -- Relaciones --    
    producto: string;
}
