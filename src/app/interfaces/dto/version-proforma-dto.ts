export interface VersionProformaDto {
    version: number;
    cantidadAnterior: number;
    cantidadActual: number;
    accion: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    totalLinea: number;
    precioUnitario: number;

    // -- Relaciones -- (La relacion con el detalle forma parte de la llave)    
    detalleProforma: number;    
}
