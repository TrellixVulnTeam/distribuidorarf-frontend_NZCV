export interface KardexDto {
    idKardex: number;

    // -- Relaciones --
    producto: string;

    fecha: Date;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    unidades: number;
    balance: number;
    costo: number;    
    concepto: string;
}
