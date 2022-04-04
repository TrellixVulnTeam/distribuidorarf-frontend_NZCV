
import {throwError as observableThrowError,  Observable, pipe } from 'rxjs';
import { Injectable } from '@angular/core';
import { ProductDB } from '../../shared/inmemory-db/products';
import { CountryDB } from '../../shared/inmemory-db/countries';
import { Product } from '../../shared/models/product.model';
import { FormGroup } from '@angular/forms';

import { of, combineLatest } from 'rxjs';
import { startWith, debounceTime, delay, map, switchMap } from 'rxjs/operators';
import { Categoria } from 'app/interfaces/categoria';
import { CategoriasService } from 'app/services/categorias.service';
import { UserApiService } from 'app/services/user-api.service';
import { Token } from 'app/interfaces/token';
import { ProductosService } from 'app/services/productos.service';
import { Producto } from 'app/interfaces/producto';
import { GaleriaProductosService } from 'app/services/galeria-productos.service';
import { GproductoDto } from 'app/interfaces/dto/gproducto-dto';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';



export interface CartItem {
  product: Product;
  data: {
    quantity: number,
    options?: any
  };
}

@Injectable()
export class ShopService {
  token: Token = {
    access_token: null
  }
  public products: Product[] = [];
  public initialFilters = {
    minPrice: 10,
    maxPrice: 10000,
    minRating: 1,
    maxRating: 5
  };

  public cart: CartItem[] = [];
  public cartData = {
    itemCount: 0
  }
  constructor(
    private userAPIService: UserApiService,
    private categoriasService: CategoriasService,
    private productosService: ProductosService,
    private galeriaProductosService: GaleriaProductosService,
    private http: HttpClient
  ) { }
  public getCart(): Observable<CartItem[]> {
    return of(this.cart)
  }
  public addToCart(cartItem: CartItem): Observable<CartItem[]> {
    let index = -1;
    this.cart.forEach((item, i) => {
      if(item.product._id === cartItem.product._id) {
        index = i;
      }
    })
    if(index !== -1) {
      this.cart[index].data.quantity += cartItem.data.quantity;
      this.updateCount();
      return of(this.cart)
    } else {
      this.cart.push(cartItem);
      this.updateCount();
      return of(this.cart)
    }
  }
  private updateCount() {
    this.cartData.itemCount = 0;
    this.cart.forEach(item => {
      this.cartData.itemCount += item.data.quantity;
    })
  }
  public removeFromCart(cartItem: CartItem): Observable<CartItem[]> {
    this.cart = this.cart.filter(item => {
      if(item.product._id == cartItem.product._id) {
        return false;
      }
      return true;
    });
    this.updateCount();
    return of(this.cart)
  }

  productos: Producto[] = [];
  gProductos: GproductoDto[] = [];
  productosTienda: Product[] = [];

  BASE_URL: string = environment.BASE_URL;
  entity: string = environment.SERVICE_GALERIA_PRODUCTO;

  public getProducts(): Observable<Product[]> {
    let productDB = new ProductDB();

    this.galeriaProductosService.getAll2(this.token.access_token).subscribe(
      res => {
        this.gProductos = res;      
        this.gProductos.forEach(element => {
          productDB.products.push(element);
        });
      }
    );    

    return of(productDB.products)
      .pipe(
        delay(500),
        map((data: Product[]) => {
          this.products = data;
          return data;
        })
      )
    
  }

  public getProductDetails(productID): Observable<Product> {
    let productDB = new ProductDB();
    let product = productDB.products.filter(p => p._id === productID)[0];
    if(!product) {
      return observableThrowError(new Error('Product not found!'));
    }
    return of(product)
  }

  public getCategories(): Observable<Categoria[]> {
    let categories= [];

    this.userAPIService.login().subscribe(
      res => {
        this.token = res;

        this.categoriasService.getAll(this.token.access_token).subscribe(
          res => {         
            res.forEach(element => {
              categories.push(element.nombre);
            });            
          },
          err => {          
            console.log(err);
          }
        );
      },
      err => {
        console.log(err);
      }
    );    
    return of(categories);
  }

  // public getFilteredProduct2(filterForm: FormGroup): Observable<Product[]> {            
  //   return combineLatest(
  //     this.getProducts(),
  //     filterForm.valueChanges
  //     .pipe(
  //       startWith(this.initialFilters),
  //       debounceTime(400)
  //     )
  //   )
  //   .pipe(
  //     switchMap(([products, filterData]) => {
  //       return this.filterProducts(products, filterData);
  //     })
  //   )
  // }

  public getFilteredProduct(filterForm: FormGroup): Observable<Product[]> {            
    return combineLatest(
      this.getProducts(),
      filterForm.valueChanges
      .pipe(
        startWith(this.initialFilters),
        debounceTime(400)
      )
    )
    .pipe(
      switchMap(([products, filterData]) => {
        return this.filterProducts(products, filterData);
      })
    )
  }
  /*
  * If your data set is too big this may raise performance issue.
  * You should implement server side filtering instead.
  */ 
  private filterProducts(products: Product[], filterData): Observable<Product[]> {        
    let filteredProducts = products.filter(p => {
      let isMatch: Boolean;
      let match = {
        search: false,
        caterory: false,
        price: false,
        rating: false
      };      
      // Search
      if (
        !filterData.search
        || p.name.toLowerCase().indexOf(filterData.search.toLowerCase()) > -1
        || p.description.indexOf(filterData.search) > -1
        || p.tags.indexOf(filterData.search) > -1
      ) {
        match.search = true;
      } else {
        match.search = false;
      }
      // Category filter
      if (
        filterData.category === p.category 
        || !filterData.category 
        || filterData.category === 'all'
      ) {
        match.caterory = true;
      } else {
        match.caterory = false;
      }
      // Price filter
      if (
        p.price.sale >= filterData.minPrice 
        && p.price.sale <= filterData.maxPrice
      ) {
        match.price = true;
      } else {
        match.price = false;
      }
      // Rating filter
      if(
        p.ratings.rating >= filterData.minRating 
        && p.ratings.rating <= filterData.maxRating
      ) {
        match.rating = true;
      } else {
        match.rating = false;
      }
      
      for(let m in match) {
        if(!match[m]) return false;
      }

      return true;
    })

    console.log("filterproductos")
      console.log(products);
      console.log(filteredProducts);

    return of(filteredProducts)
  }
}
