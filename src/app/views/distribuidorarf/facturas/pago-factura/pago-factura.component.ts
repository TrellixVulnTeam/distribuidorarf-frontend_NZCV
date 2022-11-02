import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorBk } from 'app/interfaces/error-bk';
import { CatalogManager } from 'app/managers/catalog-manager';
import { StringManager } from 'app/managers/string-manager';

@Component({
  selector: 'app-pago-factura',
  templateUrl: './pago-factura.component.html',
  styleUrls: ['./pago-factura.component.scss']
})
export class PagoFacturaComponent implements OnInit {

  strings = StringManager;
  catalogos = CatalogManager;
  public itemForm: FormGroup;
  error: ErrorBk = {
    statusCode: null,
    message: null
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PagoFacturaComponent>,
  ) { }

  ngOnInit(): void {
      this.catalogos.formasDePago();
  }

  submit(){}

}
