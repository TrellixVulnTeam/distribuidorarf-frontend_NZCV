import { config } from "config";

export const environment = {
  production: true,
  apiURL: config.apiUrl,
  BASE_URL: 'https://distribuidorarf-test.herokuapp.com',
  SERVICE_LOGIN_API: 'auth/login',
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
  SERVICE_PRODUCTOS: "productos",
  SERVICE_PROVEEDORES: "proveedores"
};