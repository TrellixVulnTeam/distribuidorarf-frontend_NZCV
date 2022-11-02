import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesComponent } from './clientes/clientes.component';
import { RouterModule } from '@angular/router';
import { DistribuidorarfRoutes } from './distribuidorarf.routing';
import { ProductosComponent } from './productos/productos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ClientePopupComponent } from './clientes/cliente-popup/cliente-popup.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { AgmCoreModule } from '@agm/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MarcasComponent } from './marcas/marcas.component';
import { CategoriasComponent } from './categorias/categorias.component';
import { CategoriaPopupComponent } from './categorias/categoria-popup/categoria-popup.component';
import { MarcaPopupComponent } from './marcas/marca-popup/marca-popup.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { ProveedoresPopupComponent } from './proveedores/proveedores-popup/proveedores-popup.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedDirectivesModule } from 'app/shared/directives/shared-directives.module';
import { ShopService } from './shop.service';
import { StarRatingModule } from 'angular-star-rating';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
import { FileUploadModule } from 'ng2-file-upload';
import { FormularioProductoComponent } from './productos/formulario-producto/formulario-producto.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { KardexComponent } from './kardex/kardex.component';
import { FormularioKardexComponent } from './kardex/formulario-kardex/formulario-kardex.component';
import { BusquedaComponent } from './kardex/busqueda/busqueda.component';
import { LotesComponent } from './lotes/lotes.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { EmpleadoPopupComponent } from './empleados/empleado-popup/empleado-popup.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormularioLotesComponent } from './lotes/formulario-lotes/formulario-lotes.component';
import { DetalleProductoLotePopupComponent } from './lotes/formulario-lotes/detalle-producto-lote-popup/detalle-producto-lote-popup.component';
import { AsignacionDetalleProductosComponent } from './lotes/asignacion-detalle-productos/asignacion-detalle-productos.component';
import { ActualizaProductosComponent } from './lotes/asignacion-detalle-productos/actualiza-productos/actualiza-productos.component';
import { CreacionRapidaProductoComponent } from './productos/creacion-rapida-producto/creacion-rapida-producto.component';


@NgModule({
  declarations: [
    ClientesComponent,
    ProductosComponent,
    ClientePopupComponent,
    MarcasComponent,
    CategoriasComponent,
    CategoriaPopupComponent,
    MarcaPopupComponent,
    ProveedoresComponent,
    ProveedoresPopupComponent,
    DetalleProductoComponent,
    FormularioProductoComponent,
    KardexComponent,
    FormularioKardexComponent,
    BusquedaComponent,
    LotesComponent,
    EmpleadosComponent,
    EmpleadoPopupComponent,
    FormularioLotesComponent,
    DetalleProductoLotePopupComponent,
    AsignacionDetalleProductosComponent,    
    ActualizaProductosComponent, 
    CreacionRapidaProductoComponent
  ],
  imports: [
    DragDropModule,
    CommonModule,
    ColorPickerModule,
    RouterModule.forChild(DistribuidorarfRoutes),
    ReactiveFormsModule,
    FlexLayoutModule,
    NgxDatatableModule,        
    MatInputModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSliderModule,
    NgxPaginationModule, 
    TranslateModule,
    MatStepperModule,
    MatSelectModule,
    MatProgressBarModule,
    FormsModule,
    MatDatepickerModule,
    SharedDirectivesModule,
    FileUploadModule,
    StarRatingModule.forRoot(),  
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyD8JelhoeQz_I4NtIKyghdvZO7_ssFsLGM', libraries: ['places'] })   
  ],
  providers: [ShopService]
})
export class DistribuidorarfModule { }
