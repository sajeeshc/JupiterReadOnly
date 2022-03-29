import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-download-art',
  templateUrl: './download-art.component.html',
  styleUrls: ['./download-art.component.scss']
})
export class DownloadArtComponent implements OnInit {

  dataSource: any;
  artList: any[] = [];

  jsonHeader = 'application/json; odata=verbose';
  headersOld = new Headers({ 'Content-Type': this.jsonHeader, Accept: this.jsonHeader });
  headers = { 'Content-Type': this.jsonHeader, Accept: this.jsonHeader };
  // filesArray: [];
  showFileArray: [];

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private httpClient: HttpClient) { }

  ngOnInit () {
    this.getArtList();
    this.commonService.setPageHeader('Screen Room - Art Download Page');
  }

  setHeader(header){
    this.commonService.setPageHeader(header);
  }

  displayedColumns: string[] = [
    "storeName",
    "storeOwner",
    "orderNumber",
    "dueDate",
    "dueTime",
    "downloadArt",
    "verifyArt"
  ];

  getArtList () {
    this.storeService.getArtList({startDate:'',endDate:'',type:6,artist:'',artType:'',serviceId:0}).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }

  downloadArt (row) {
    this.storeService.getArtImgList(row.id,0).subscribe(res => {
      var filesArray = res.data;
      this.createZip(filesArray.map(c => c.url), row.name);
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  goToArtVerification(item:any){
    localStorage.setItem('artApprovalObj',JSON.stringify(item));
    this.router.navigateByUrl('/artdirector/artverification')
  }

  async getFile (url: string) {
    const httpOptions = {
      responseType: 'blob' as 'json'
    };
    const res = await this.httpClient.get(url, httpOptions).toPromise().catch((err: HttpErrorResponse) => {
      const error = err.error;
      return error;
    });
    return res;
  }

  async createZip (files: any[], zipName: string) {
    const zip = new JSZip();
    const name = zipName + '.zip';
    for (let counter = 0; counter < files.length; counter++) {
      const element = files[counter];
      const fileData: any = await this.getFile(element);
      const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
      zip.file(element.substring(element.lastIndexOf('/') + 1), b);
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });
  }

}
