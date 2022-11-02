import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FacturasRoutingModule } from './facturas-routing.module';
import { SharedMaterialModule } from 'app/shared/shared-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedComponentsModule } from 'app/shared/components/shared-components.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ListadoFacturasComponent } from './listado-facturas/listado-facturas.component';
import { FormularioFacturaComponent } from './formulario-factura/formulario-factura.component';
import { PagoFacturaComponent } from './pago-factura/pago-factura.component';



@NgModule({
  declarations: [
    ListadoFacturasComponent,
    FormularioFacturaComponent,
    PagoFacturaComponent
  ],
  imports: [
    CommonModule,
    FacturasRoutingModule,
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
export class FacturasModule { }
