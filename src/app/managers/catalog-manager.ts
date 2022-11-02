export class CatalogManager {
    static formasDePago(){
        return [
            {id: 1, name: "Efectivo"},
            {id: 2, name: "Tarjeta"},
            {id: 3, name: "Cheque"},
            {id: 4, name: "Transferencia"},
            {id: 5, name: "Depósito"},
        ]                
    }    
}

export interface FormaPago {
    id: number;
    nombre: string;
  }