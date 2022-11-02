export interface ProformaDto {
    idProforma: number;
    fechaEmision: Date;    
    cantidadProductos: number;
    subTotal: number;
    comentario: string;
    fechaVencimiento: Date;    
    porcentajeDescuento: number;
    total: number;    
    estado: string;
    borrado: boolean;
    codigoResponsable: string;
    vendedor: string;
    termino: number;

    // -- Relaciones --
    persona: string;    
}
