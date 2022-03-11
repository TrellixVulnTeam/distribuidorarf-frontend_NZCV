import { Canton } from "./canton";

export interface Provincia {
    cod: string;
    nombre: string;    
    cantones: Canton[];
}
