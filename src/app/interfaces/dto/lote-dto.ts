export interface LoteDto {
    codigoLote: number;
    fecha: Date;
    descripcion: string;    
    codigoResponsable: string;
    fase: number;
    costoTotal: number;
    cantidadTotal: number;
    moneda: string;
    tipoCambio: number;
}
