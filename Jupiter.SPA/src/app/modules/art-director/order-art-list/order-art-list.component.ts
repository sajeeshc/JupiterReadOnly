import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import * as JSZip from 'jszip';
import * as FileSaver from 'file-saver';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-order-art-list',
  templateUrl: './order-art-list.component.html',
  styleUrls: ['./order-art-list.component.scss']
})
export class OrderArtListComponent implements OnInit {

  dataSource: any;
  artList: any[] = [];
  jsonHeader = 'application/json; odata=verbose';
  headersOld = new Headers({ 'Content-Type': this.jsonHeader, Accept: this.jsonHeader });
  headers = { 'Content-Type': this.jsonHeader, Accept: this.jsonHeader };
  // filesArray: [];
  showFileArray: [];
  serviceId: any = 0;
  filterFormGroup: FormGroup;
  serviceArray: any[] = [];
  customerSearch: any;
  orderIdSearch: any;

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit () {
    this.createFilterFormGroup();
    this.getServiceList();
    this.getArtList();
    this.commonService.setPageHeader('Production-Ready Art Queue');
  }

  setHeader (header) {
    this.commonService.setPageHeader(header);
  }

  displayedColumns: string[] = [
    "burnt",
    "storeName",
    "storeOwner",
    "orderNumber",
    "storeid",
    "orderType",
    "service",
    "dueDate",
    "dueTime",
    "downloadArt",
    "verifyArt",
    "downloadStatus"
  ];

  getArtList () {
    var datePipe = new DatePipe('en-US');
    var startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    var endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    startDate = startDate == null ? '' : startDate;
    endDate = endDate == null ? '' : endDate;
    var keyword = this.filterFormGroup.get('keyword').value;
    var artType = this.filterFormGroup.get('artType').value;

    this.onServiceChange();

    if (this.serviceId == 0) {

      this.storeService.getOrderArtList(startDate, endDate, '', '', '', this.serviceId, keyword, artType, this.customerSearch, this.orderIdSearch).subscribe(response => {
        if (response.data != null) {
          this.artList = response.data;
        }
        else {
          this.artList = [];
        }
      });
    }
    else {
      // this.storeService.getArtList(startDate,endDate,'6','','',this.serviceId).subscribe(response => {
      //   if (response.data != null) {
      //     this.artList = response.data;
      //   }
      //   else {
      //     this.artList = [];
      //   }
      // });

      this.storeService.getOrderArtListV2(6, startDate, endDate, '6', '', artType, this.serviceId, keyword, this.customerSearch, this.orderIdSearch).subscribe(response => {
        if (response.data != null) {
          this.artList = response.data;
        }
        else {
          this.artList = [];
        }
      });
    }
  }

  onServiceChange () {
    this.serviceId = this.filterFormGroup.get('service')
      .value == null ? 0 : this.filterFormGroup.get('service').value;
  }

  getServiceList () {
    this.storeService.getAvailableStoreServices().subscribe(response => {
      if (response.data != null) {
        this.serviceArray = response.data;
      }
    });
  }

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      startDate: new FormControl(''),
      endDate: new FormControl(''),
      service: new FormControl(0),
      keyword: new FormControl(''),
      artType: new FormControl(0)
    });
    this.customerSearch = '';
    this.orderIdSearch = '';
  }

  downloadArt (row) {
    window.open(environment.apiUrl + "v1/order/" + row.orderArt.orderId + "/download/pdf");
    this.setDownloadStatus(row, row.orderArt.orderId)
  }

  setDownloadStatus (row, orderId) {
    this.storeService.updateVinylDownloadStatus(orderId).subscribe(res => {
      var result = res.data;
      row.isDownloaded = true;
      // this.getArtList();
    },
      (error) => {

      });
  }

  goToArtVerification (item: any) {
    localStorage.setItem('artApprovalObj', JSON.stringify(item));
    if (this.serviceId == 0) {
      this.router.navigateByUrl('/artdirector/orderArtDetail');
    } else {
      this.router.navigateByUrl('/artdirector/artverification');
    }
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
      if (element.isApproved == true) {
        const fileData: any = await this.getFile(element.url);
        const b: any = new Blob([fileData], { type: '' + fileData.type + '' });
        zip.file(element.substring(element.lastIndexOf('/') + 1), b);
      }
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      if (content) {
        FileSaver.saveAs(content, name);
      }
    });
  }

  clearFilter () {
    this.createFilterFormGroup();
    this.getArtList();
  }

}
