import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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

  public photoGallery: any[] = [{url: '', state: '0'}];
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params['id'];
    this.getProduct(this.productID);
    this.getCart();
    this.cartData = this.shopService.cartData;
  }

  ngOnDestroy() {
    this.productSub.unsubscribe();
  }

  getProduct(id) {
    this.productSub = this.shopService.getProductDetails(id)
    .subscribe(res => {
      this.product = res;
      this.initGallery(this.product)
    }, err => {
      this.product = {
        _id: '',
        name: '',
        price: { sale: 0 }
      };
    })
  }
  getCart() {
    this.shopService
    .getCart()
    .subscribe(cart => {
      this.cart = cart;
    })
  }
  addToCart() {
    let cartItem: CartItem = {
      product: this.product,
      data: {
        quantity: this.quantity,
        options: {}
      }
    };

    this.shopService
    .addToCart(cartItem)
    .subscribe(res => {
      this.cart = res;
      this.quantity = 1;
      this.snackBar.open('Product added to cart', 'OK', { duration: 4000 });
    })
  }

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

  public uploader: FileUploader = new FileUploader({ url: 'https://evening-anchorage-315.herokuapp.com/api/' });
  public hasBaseDropZoneOver: boolean = false;
  console = console;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

}
