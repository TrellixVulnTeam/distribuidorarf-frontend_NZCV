import { Routes } from '@angular/router';
import { CategoriasComponent } from './categorias/categorias.component';
import { ClientesComponent } from './clientes/clientes.component';
import { MarcasComponent } from './marcas/marcas.component';
import { DetalleProductoComponent } from './productos/detalle-producto/detalle-producto.component';
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
        data: { title: 'Products', breadcrumb: 'PRODUCTS' }
      },
      {
        path: 'products/:id',
        component: DetalleProductoComponent,
        data: { title: 'Detail', breadcrumb: 'Detail' }
      },
      {
        path: 'branches',
        component: MarcasComponent,
        data: { title: 'Branches', breadcrumb: 'BRANCHES' }
      },
      {
        path: 'categories',
        component: CategoriasComponent,
        data: { title: 'Categories', breadcrumb: 'CATEGORIES' }
      },
      {
        path: 'providers',
        component: ProveedoresComponent,
        data: { title: 'Providers', breadcrumb: 'PROVIDERS' }
      },
    ]
  }
];