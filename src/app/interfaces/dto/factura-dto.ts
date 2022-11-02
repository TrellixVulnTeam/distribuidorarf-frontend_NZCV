export interface FacturaDto {
    idFactura: number;

    // -- Relaciones --
    proforma: number;
    termino: number;    
    
    fechaEmision: Date;    
    fechaVencimiento: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    codigoResponsable: string;
    monto: number;
    montoPagado: number;
    montoPendiente: number;
    pagada: boolean;
}
