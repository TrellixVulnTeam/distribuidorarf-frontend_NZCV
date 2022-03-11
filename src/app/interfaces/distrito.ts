import { Canton } from "./canton";
import { Persona } from "./persona";

export interface Distrito {
    codDistrito: number;
    provincia: string;
    canton: Canton;
    distrito: string
    nombre: string;
    personas: Persona[];
}
