import { Persona } from "./persona";

export interface TipoIdentificacion {
    idTipoIdetificacion: number;
    descripcion: string;    
    personas: Persona[];
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
}
