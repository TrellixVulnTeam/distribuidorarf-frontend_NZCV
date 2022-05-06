export interface ProveedorDto {
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
        
}
