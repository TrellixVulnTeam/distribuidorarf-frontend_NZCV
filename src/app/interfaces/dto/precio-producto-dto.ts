export interface PrecioProductoDto {        
    idPrecioProducto: number;
    nombre: string;
    utilidad: number;    
    precioVenta: number;
    esLiquidacion: boolean;    
    utilidadLiquidacion: number;
    precioVentaLiquidacion: number;

    // -- Relaciones -- 
    producto: string;
}
