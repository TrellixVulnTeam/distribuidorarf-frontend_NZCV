export interface PrecioProductoDto {    
    nombre: string;
    utilidad: number;    
    precioVenta: number;
    esLiquidacion: boolean;    
    utilidadLiquidacion: number;
    precioVentaLiquidacion: number;

    // -- Relaciones -- 
    producto: string;
}