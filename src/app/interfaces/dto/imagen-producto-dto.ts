export interface ImagenProductoDto {
    idImagenProducto: number;
    URL: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones --
    producto: string;
}
