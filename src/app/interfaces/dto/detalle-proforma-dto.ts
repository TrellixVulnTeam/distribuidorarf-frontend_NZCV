export interface DetalleProformaDto {
    idDetalleProforma?: number;
    precioVenta: number;
    descuento: number;
    porcentajeDescuento: number;
    totalLinea: number;    
    yaEnFactura: boolean;    
    codigoResponsable: string;
    cantidad: number;
    precioInicial: number;
    url: string;
    detalleProfoma: number;
    lineaSeparada: boolean;

    // -- Relaciones --
    proforma: number;
    producto: string;
    factura?: number;
    versiones?: number[];
}
