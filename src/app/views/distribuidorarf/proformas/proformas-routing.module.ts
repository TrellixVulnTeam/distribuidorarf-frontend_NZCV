import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DetalleProformaComponent } from "./detalle-proforma/detalle-proforma.component";
import { ListadoProformasComponent } from "./listado-proformas/listado-proformas.component";
import { VersionesProformaComponent } from "./versiones-proforma/versiones-proforma.component";

const routes: Routes = [
  {
    path: 'listado-proformas', 
    component: ListadoProformasComponent,
    pathMatch: 'full'
  },
  {
    path: 'versiones-proforma',
    component: VersionesProformaComponent,
    pathMatch: 'full'
  },
  {
    path: 'add',
    component: DetalleProformaComponent,
    pathMatch: 'full'
  },
  // {
  //   path: ':id',
  //   component: DetalleProformaComponent,
  //   pathMatch: 'full'
  // }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProformasRoutingModule { }
