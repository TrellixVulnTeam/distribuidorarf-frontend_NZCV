export interface PersonaDto {
    identificacion: string;    
    nombre: string;    
    apellidos: string;
    telefono1: string;
    telefono2: string;    
    correoElectronico: string;
    direccion: string;
    comentarios: string;
    fechaCreacion: Date;
    fechaUltimaModificacion: Date;
    fechaCumpleannos: Date    
    estaActivo: boolean;    
    codigoAutorizacion: string;
    otrasSenas: string;

    // -------------- Cliente --------------
    //Waze o google maps si tiene, es la url que se guarda
    latLongDireccion: string;

    // -------------- Usuario --------------    
    usuario:string;
    contrasena: string;

    // -- Contacto Referencia --
    telefonoRef: string;
    contactoRef: string;

    // -- Saldos --
    maxCredito: number;
    saldoFavor: number;

    // -- Relaciones --
    tipoPersona: number;
    tipoIdentificacion: number;
    distrito: number;
    termino: number;
}
