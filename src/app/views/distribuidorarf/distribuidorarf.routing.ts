import { Routes } from '@angular/router';
import { CategoriasComponent } from './categorias/categorias.component';
import { ClientesComponent } from './clientes/clientes.component';
import { EmpleadosComponent } from './empleados/empleados.component';
import { KardexComponent } from './kardex/kardex.component';
import { FormularioLotesComponent } from './lotes/formulario-lotes/formulario-lotes.component';
import { LotesComponent } from './lotes/lotes.component';
import { MarcasComponent } from './marcas/marcas.component';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
import { FormularioProductoComponent } from './productos/formulario-producto/formulario-producto.component';
import { ProductosComponent } from './productos/productos.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';

export const DistribuidorarfRoutes: Routes = [
  {
    path: '',
    children: [
      {
      path: 'customers',
      component: ClientesComponent,
      data: { title: 'Customers', breadcrumb: 'CUSTOMERS' }
      },
      {
        path: 'products',
        component: ProductosComponent,
        data: { title: 'Products', breadcrumb: 'PRODUCTS' },        
      },
      {
        path: 'detalle/:id',
        component: DetalleProductoComponent,
        data: { title: 'Detalle', breadcrumb: 'DETALLES' }
      },
      {
        path: 'product-form',
        component: FormularioProductoComponent,
        data: { title: 'Product-Form', breadcrumb: 'Product-Form' }
      },
      {
        path: 'product-form/:id',
        component: FormularioProductoComponent,
        data: { title: 'Product-Form', breadcrumb: 'Product-Form' }
      },
      {
        path: 'branches',
        component: MarcasComponent,
        data: { title: 'Branches', breadcrumb: 'BRANCHES' }
      },
      {
        path: 'categories',
        component: CategoriasComponent,
        data: { title: 'Categories', breadcrumb: 'CATEGORIES                                                                                                                      ' }
      },
      {
        path: 'providers',
        component: ProveedoresComponent,
        data: { title: 'Providers', breadcrumb: 'PROVIDERS' }
      },
      {
        path: 'kardex',
        component: KardexComponent,
        data: { title: 'Kardex', breadcrumb: 'KARDEX' }
      },
      {
        path: 'employees',
        component: EmpleadosComponent,
        data: { title: 'Employees', breadcrumb: 'EMPLOYEES' }
      },
      {
        path: 'lots',
        component: LotesComponent,
        data: { title: 'Lots', breadcrumb: 'LOTS' }
      },
      {
        path: 'lots/lots-form',
        component: FormularioLotesComponent,
        data: { title: 'Lots Form', breadcrumb: 'LOTSFORM' }
      },
    ]
  }
];