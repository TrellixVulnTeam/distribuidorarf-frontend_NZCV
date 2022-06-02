export interface DetalleLoteDto {
    idDetalleLote: string;
    lote: number;
    producto: string;
    descripcion: string;
    composicion: string;
    cantidad: number;
    costo: number;    
    precioTotal: number;
    codigoResponsable: string;
    cantidadAsignada: number;
}
