import { Categoria } from "./categoria";
import { DetalleProducto } from "./detalle-producto";
import { DetalleProforma } from "./detalle-proforma";
import { ImagenProducto } from "./imagen-producto";
import { Kardex } from "./kardex";
import { Marca } from "./marca";
import { PrecioProducto } from "./precio-producto";
import { Proveedor } from "./proveedor";

export interface Producto {
    idProducto: string;
    codigoExterno: string;
    nombre: string;
    descripcion: string;
    cantidadExistencias: number;
    cantidadMinima: number;
    esLiquidacion: boolean;
    costo: number;    
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;

    // -- Relaciones --
    marca: Marca;
    categoria: Categoria;
    proveedor: Proveedor;
    imagenes: ImagenProducto[];
    detalles: DetalleProducto[];
    precios: PrecioProducto[];
    detallesProformas: DetalleProforma[];
    kardexes: Kardex[];
}
