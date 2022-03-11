import { Distrito } from "./distrito";
import { Provincia } from "./provincia";

export interface Canton {
    idCanton: number;
    codCanton: string;
    provincia: Provincia;
    nombre: string;

    // ---------- Relations ----------    
    distritos: Distrito[];
}
