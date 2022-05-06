export interface DetalleProductoDto {
    idDetalleProducto: string;
    colorNombre: string;
    colorHexadecimal: string;
    talla: string;
    cantidad: number;
    codigoResponsable: string;

    // -- Relaciones --    
    producto: string;
}
