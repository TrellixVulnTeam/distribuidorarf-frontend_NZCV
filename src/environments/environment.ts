// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular.json`.

import { config } from "config";

export const environment = {
  production: false,
  apiURL: config.apiUrl,
  //BASE_URL: 'https://distribuidorarf.azurewebsites.net',  
  BASE_URL: 'http://localhost:8000',  
  //BASE_URL: 'https://distribuidorarf-dev.herokuapp.com',    
  SERVICE_LOGIN_API: 'auth/login',
  SERVICE_PRODUCTOS: 'productos',
  API_USER: '$2a$10$DxmWIbRRh7XfGuMUPG3NWuPa0Km.SGB1xZX10h8rbSrDsLxtSjSDu',
  API_PASS: '$2a$10$IJUBNcP/iErqDeAErUK4geppyO8pw2ua6maopcRKFh5MFYG1qY9Ri',
  SERVICE_PROVINCIAS: 'provincias',
  SERVICE_CANTONES: 'cantones',
  SERVICE_TIPOS_IDENTIFICACION: 'tipos-identificacion',
  SERVICE_TERMINOS: "terminos",
  SERVICE_TIPOS_PERSONA: "tipos-persona",
  SERVICE_FUNCIONES: "funciones",
  SERVICE_PERSONAS: "personas",
  SERVICE_CATEGORIAS: "categorias",
  SERVICE_MARCAS: "marcas",  
  SERVICE_LOTES: 'lotes',
  SERVICE_PROVEEDORES: "proveedores",
  SERVICE_PRECIOS_PRODUCTO: "precios-productos",
  SERVICE_DETALLES_PRODUCTO: "detalles-productos",
  SERVICE_IMAGENES_PRODUCTO: "imagenes-producto",
  AZURESASTOKEN: 'sp=racwdli&st=2022-03-17T18:40:05Z&se=2032-03-18T02:40:05Z&spr=https&sv=2020-08-04&sr=c&sig=W%2BVCKSAuPdyhMIwfn2hl0tQeP9hz2ToZd%2F%2BeJZqsufk%3D',
  AZUREACCOUNTNAME: 'distribuidorarf',
  AZURECONTAINERNAME: 'productos',
  SERVICE_GALERIA_PRODUCTO: "galeria-productos",
  SERVICE_KARDEX: "kardex",
  ADMIN: 3
};