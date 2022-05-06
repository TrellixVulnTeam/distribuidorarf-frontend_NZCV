import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-detalle-producto-lote-popup',
  templateUrl: './detalle-producto-lote-popup.component.html',
  styleUrls: ['./detalle-producto-lote-popup.component.scss']
})
export class DetalleProductoLotePopupComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DetalleProductoLotePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
  }

  finalizaProceso(){
    this.dialogRef.close(this.data);         
  }

  calculaPrecioTotal(){
    this.data.precioTotal = this.data.cantidad * this.data.precioUnitario;
  }

}
