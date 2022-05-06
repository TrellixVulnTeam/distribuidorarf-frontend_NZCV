import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { GproductoDto } from 'app/interfaces/dto/gproducto-dto';
import { Producto } from 'app/interfaces/producto';
import { Token } from 'app/interfaces/token';
import { GaleriaProductosService } from 'app/services/galeria-productos.service';
import { ProductosService } from 'app/services/productos.service';
import { UserApiService } from 'app/services/user-api.service';
import { egretAnimations } from 'app/shared/animations/egret-animations';
import { Product } from 'app/shared/models/product.model';
import { FileUploader } from 'ng2-file-upload';
import { Subscription } from 'rxjs';
import { CartItem, ShopService } from '../../shop.service';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
  styleUrls: ['./detalle-producto.component.scss'],
  animations: egretAnimations
})
export class DetalleProductoComponent implements OnInit {

  public productID;
  public product: Product;
  public quantity: number = 1;
  public cart: CartItem[];
  public cartData: any;
  private productSub: Subscription;

  producto: Producto = {
    cantidadExistencias: null,
    cantidadMinima: null,
    categoria: null,
    codigoExterno: null,
    costo: null,
    descripcion: null,
    detalles: null,
    detallesProformas: null,
    esLiquidacion: null,
    fechaCreacion: null,
    fechaUltimaModificacion: null,
    idProducto: null,
    imagenes: null,
    kardexes: null,
    marca: null,
    nombre: null,
    precios: null,
    proveedor: null,
    codigoResponsable: null
  }

  gProductos: GproductoDto[] = [];

  public photoGallery: any[] = [{url: '', state: '0'}];
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private galeriaProductosService: GaleriaProductosService,
    private tokenService: UserApiService,
    private productosService: ProductosService
  ) { }

  token: Token = {
    access_token: null
  }

  ngOnInit() {
    this.productID = this.route.snapshot.params['id'];
    this.tokenService.login().subscribe(
      res => {
        this.token = res;
        this.getProduct(this.productID);
        // this.getCart();
        // this.cartData = this.shopService.cartData;
      },
      err => {
        this.snackBar.open(err.message, "ERROR", { duration: 4000 });              
      }
    );    
  }

  ngOnDestroy() {
    // this.productSub.unsubscribe();
  }

  getProduct(id) {
    // this.productSub = this.shopService.getProductDetails(id)
    // .subscribe(res => {
    //   this.product = res;
    //   this.initGallery(this.product)
    // }, err => {
    //   this.product = {
    //     _id: '',
    //     name: '',
    //     price: { sale: 0 }
    //   };
    // });
    this.galeriaProductosService.getAll2(this.token.access_token).subscribe(
      res => {
        this.gProductos = res;              
        this.product = this.gProductos.find(x => x._id === id);        
        this.productosService.getOne(this.token.access_token, this.product._id).subscribe(
          res => {
            this.producto = res;
          }
        );
        this.initGallery(this.product);
        if(!this.product) {
          this.snackBar.open('Product not found!');
        }
      }
    ); 
  }
  // getCart() {
  //   this.shopService
  //   .getCart()
  //   .subscribe(cart => {
  //     this.cart = cart;
  //   })
  // }
  // addToCart() {
  //   let cartItem: CartItem = {
  //     product: this.product,
  //     data: {
  //       quantity: this.quantity,
  //       options: {}
  //     }
  //   };

  //   this.shopService
  //   .addToCart(cartItem)
  //   .subscribe(res => {
  //     this.cart = res;
  //     this.quantity = 1;
  //     this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
  //   })
  // }

  initGallery(product: Product) {
    if(!product.gallery) {
      return;
    }
    this.photoGallery = product.gallery.map(i => {
      return {
        url: i,
        state: '0'
      }
    });
    if (this.photoGallery[0])  {
      this.photoGallery[0].state = '1';
    }
  }
  changeState(photo) {
    if (photo.state === '1') {
      return;
    }
    this.photoGallery = this.photoGallery.map(p => {
      if (photo.url === p.url) {
        setTimeout(() => {
          p.state = '1';
          return p;
        }, 290)
      }
      p.state = '0';
      return p;
    })
  } 
  
  // volver(){
  //   this.router.navigate(['./']);
  // }

}
