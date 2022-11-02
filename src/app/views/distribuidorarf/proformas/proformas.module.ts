import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListadoProformasComponent } from './listado-proformas/listado-proformas.component';
import { DetalleProformaComponent } from './detalle-proforma/detalle-proforma.component';
import { ProformasRoutingModule } from './proformas-routing.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { BuscarClienteComponent } from './detalle-proforma/buscar-cliente/buscar-cliente.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BuscarProductoComponent } from './detalle-proforma/buscar-producto/buscar-producto.component';
import { VersionesProformaComponent } from './versiones-proforma/versiones-proforma.component';



@NgModule({
  declarations: [
    ListadoProformasComponent,
    DetalleProformaComponent,
    BuscarClienteComponent,
    BuscarProductoComponent,
    VersionesProformaComponent
  ],
  imports: [
    CommonModule,
    ProformasRoutingModule,
    SharedMaterialModule,
    ReactiveFormsModule,
    SharedComponentsModule,
    FlexLayoutModule,
    NgxDatatableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ProformasModule { }
