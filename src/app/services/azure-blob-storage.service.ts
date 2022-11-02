import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';
import { ServiceManager } from 'app/managers/service-manager';

@Injectable({
  providedIn: 'root'
})
export class AzureBlobStorageService {

  services = ServiceManager;
  accountName = this.services.AZUREACCOUNTNAME;
  containerName = this.services.AZURECONTAINERNAME;

  constructor() { }

  public async listImages(): Promise<string[]>{
    let result: string[] = [];

    let blobs = this.containerClient().listBlobsFlat();
    for await (const blob of blobs){
      result.push(blob.name);
    }

    return result;
  }

  public downloadImage(name: string, handler: (blob: Blob) => void){
    const blobClient = this.containerClient().getBlobClient(name);
    blobClient.download().then(
      resp =>{
        resp.blobBody.then(
        blob =>{
          handler(blob);
        });
      });
  }

  public deleteImage(sas: string, name: string, handler: () => void){
    this.containerClient(sas).deleteBlob(name).then(
      () =>{
        handler();
      }
    );
  }

  public uploadImage(sas: string, content: Blob, name: string, handler: () => void){
    const blockBlobClient = this.containerClient(sas).getBlockBlobClient(name);
    blockBlobClient
    .uploadData(content, {blobHTTPHeaders:{ blobContentType: content.type}})
    .then(() => handler());
  }

  private containerClient(sas?: string): ContainerClient{
    let token = "";
    if(sas){
      token = sas;
    }
    return new BlobServiceClient(`https://${this.accountName}.blob.core.windows.net?${token}`).getContainerClient(this.containerName.toString());
  }
}
