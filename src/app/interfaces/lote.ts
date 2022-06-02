import { DetalleLote } from "./detalle-lote";

export interface Lote {
    codigoLote: number;
    fecha: Date;
    descripcion: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    codigoResponsable: string;
    fase: number;
    costoTotal: number;
    cantidadTotal: number;
    moneda: string;
    tipoCambio: number;

    // -- Relaciones --    
    detalles: DetalleLote[];
}
