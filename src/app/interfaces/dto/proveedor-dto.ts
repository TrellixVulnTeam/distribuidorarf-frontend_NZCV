export interface ProveedorDto {
    identificacion: string;
    tipoIdentificacion: number;
    nombre: string;
    telefono: string;
    correoElectronico: string;
    direccion: string;
    comentarios: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    estaActivo: boolean;
    latLongDireccion: string;
    
    // -- Relaciones --
    distrito: number;
}
