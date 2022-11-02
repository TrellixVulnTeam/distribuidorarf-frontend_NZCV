import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormularioFacturaComponent } from "./formulario-factura/formulario-factura.component";
import { ListadoFacturasComponent } from "./listado-facturas/listado-facturas.component";

const routes: Routes = [
  {
    path: 'listado-facturas', 
    component: ListadoFacturasComponent,
    pathMatch: 'full'
  },
   {
    path: 'add',
    component: FormularioFacturaComponent,
    pathMatch: 'full'
  },
  {
    path: ':id/:convertToInvoice',
    component: FormularioFacturaComponent,
    pathMatch: 'full'
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class FacturasRoutingModule { }
