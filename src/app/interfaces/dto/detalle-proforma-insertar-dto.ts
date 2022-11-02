export interface DetalleProformaInsertarDto {
    detalleProducto: string;
    precioVenta: number;
    descuento: number;
    porcentajeDescuento: number;
    totalLinea: number;
    proforma: number;
    codigoResponsable: string;
    cantidad: number;
    persona: string;
    precioInicial: number;
    url: string;
    detalleProforma: number;
    version: number;
    nombre: string;
    lineaSeparada: boolean;
    indice: number,
    cantidadExistencias: number
}