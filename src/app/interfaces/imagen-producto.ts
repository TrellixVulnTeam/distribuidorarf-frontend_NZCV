import { Producto } from "./producto";

export interface ImagenProducto {
    idImagenProducto: number;
    URL: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones --
    producto: Producto;
}
