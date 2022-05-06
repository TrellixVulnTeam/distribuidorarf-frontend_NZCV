import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from 'app/interfaces/categoria';
import { GproductoDto } from 'app/interfaces/dto/gproducto-dto';
import { Token } from 'app/interfaces/token';
import { CategoriasService } from 'app/services/categorias.service';
import { GaleriaProductosService } from 'app/services/galeria-productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Product } from 'app/shared/models/product.model';
import { AppLoaderService } from 'app/shared/services/app-loader/app-loader.service';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, ShopService } from '../shop.service';
import { FormularioProductoComponent } from './formulario-producto/formulario-producto.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.scss'],
  animations: [egretAnimations]
})
export class ProductosComponent implements OnInit {
  public isSideNavOpen: boolean;
  public viewMode: string = 'grid-view';
  public currentPage: any;
  @ViewChild(MatSidenav) private sideNav: MatSidenav;

  public products$: Observable<Product[]>;
  public categories$: Observable<Categoria[]>;
  public activeCategory: string = 'all';
  public filterForm: FormGroup;
  public cart: CartItem[];
  public cartData: any;

  token: Token = {
    access_token: null
  }

  gProductos: GproductoDto[] = []; 

  constructor(
    private shopService: ShopService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private loader: AppLoaderService,
    private userAPIService: UserApiService,
    private categoriasService: CategoriasService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {    
    this.categories$ = this.shopService.getCategories();
    this.buildFilterForm(this.shopService.initialFilters);
    
    setTimeout(() => {
      this.loader.open();
    });    

    this.products$ = this.shopService
      .getFilteredProduct(this.filterForm)
      .pipe(
        map(products => {
          this.loader.close(); 
          console.log("PRODUCTOS");         
          console.log(products);
          return products;
        })
      );  

    this.getCart();
    this.cartData = this.shopService.cartData;
  }
  ngOnDestroy() {

  }
  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
  }
  addToCart(product) {
    let cartItem: CartItem = {
      product: product,
      data: {
        quantity: 1
      }
    };
    this.shopService
    .addToCart(cartItem)
    .subscribe(cart => {
      this.cart = cart;
      this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
    })
  }

  buildFilterForm(filterData:any = {}) {
    this.filterForm = this.fb.group({
      search: [''],
      category: ['all'],
      minPrice: [filterData.minPrice],
      maxPrice: [filterData.maxPrice],
      minRating: [filterData.minRating],
      maxRating: [filterData.maxRating]
    })
  }
  setActiveCategory(category) {
    this.activeCategory = category;
    console.log(this.activeCategory);
    this.filterForm.controls['category'].setValue(category)
  }

  toggleSideNav() {
    this.sideNav.opened = !this.sideNav.opened;
  }

  openPopUp(data: any = {}, isNew?) {
    let title = isNew ? 'Agragar Cliente' : 'Modificar Cliente';
    let dialogRef: MatDialogRef<any> = this.dialog.open(FormularioProductoComponent, {
      width: '1020px',
      disableClose: true,
      data: { title: title, payload: data }
    })
    dialogRef.afterClosed()
      .subscribe(res => {
        if(!res) {
          // If user press cancel
          return;
        }
        this.loader.open();
        if (isNew) {
          this.products$ = this.shopService
          .getFilteredProduct(this.filterForm)
          .pipe(
            map(products => {
              this.loader.close();  
              return products;
            })
          );
        } else {          
          this.products$ = this.shopService
          .getFilteredProduct(this.filterForm)
          .pipe(
            map(products => {
              this.loader.close();  
              return products;
            })
          );               
        }
      })
  }  
}
