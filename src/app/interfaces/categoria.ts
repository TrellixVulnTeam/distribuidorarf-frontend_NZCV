export interface Categoria {
    idCategoria: number;
    nombre: string;
    descripcion: string;
    idCategoriaPadre: number;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones --
    categorias: Categoria[];
}
