export interface ProductoDto {
    idProducto: string;
    codigoExterno: string;
    nombre: string;
    descripcion: string;
    cantidadExistencias: number;
    cantidadMinima: number;
    esLiquidacion: boolean;
    costo: number;   
    // -- Relaciones --
    marca: number;
    categoria: number;
    proveedor: number;
}
