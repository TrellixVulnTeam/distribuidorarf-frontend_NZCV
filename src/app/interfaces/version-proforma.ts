import { DetalleProforma } from "./detalle-proforma";

export interface VersionProforma {
    version: number;
    cantidadAnterior: number;
    cantidadActual: number;
    accion: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones -- (La relacion con el detalle forma parte de la llave)    
    detalleProforma: DetalleProforma;    
}
