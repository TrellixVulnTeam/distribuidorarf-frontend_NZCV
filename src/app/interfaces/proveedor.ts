import { Distrito } from "./distrito";
import { Producto } from "./producto";
import { TipoIdentificacion } from "./tipo-identificacion";

export interface Proveedor {
    identificacion: number;
    nombre: string;
    telefono: string;
    correoElectronico: string;
    direccion: string;
    comentarios: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    estaActivo: boolean;
    latLongDireccion: string;
    url: string;
    otrasSenas: string;
    codigoResponsable: string;
    
    // -- Relaciones --    
    productos: Producto[];
}