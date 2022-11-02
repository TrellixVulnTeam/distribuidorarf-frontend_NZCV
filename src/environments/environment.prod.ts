import { config } from "config";

export const environment = {
  production: true,
  apiURL: config.apiUrl,
  BASE_URL: 'https://distribuidorarf-dev.herokuapp.com',
  //BASE_URL: 'http://localhost:8000',
  SERVICE_LOGIN_API: 'auth/login',
  API_USER: '$2a$10$DxmWIbRRh7XfGuMUPG3NWuPa0Km.SGB1xZX10h8rbSrDsLxtSjSDu',
  API_PASS: '$2a$10$IJUBNcP/iErqDeAErUK4geppyO8pw2ua6maopcRKFh5MFYG1qY9Ri',  
  ADMIN: 3,
  PRECIO1: 1,
  PRECIO2: 2,
  PRECIO3: 3,
  PRECIO4: 4,
  TIEMPO_NOTIFICACION: 5000,
};