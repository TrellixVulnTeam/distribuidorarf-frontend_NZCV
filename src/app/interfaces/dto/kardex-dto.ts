export interface KardexDto {
    // -- Relaciones --
    producto: string;
    persona: string;

    unidades: number;
    balance: number;    
    concepto: string;
    idDetalleProducto: string;
    precioVenta: number;    
    costo: number;    
    esRetiro: boolean;
    codigoResponsable: string;
    esRetiroTemporal: boolean;
    fechaReIngreso: Date;
    finalizadoReingreso: boolean;    
    detalleProforma: number;
}
