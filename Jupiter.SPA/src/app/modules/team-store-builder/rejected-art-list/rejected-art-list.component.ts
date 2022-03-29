import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { saveAs } from "file-saver";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

declare var $: any;

@Component({
  selector: 'app-rejected-art-list',
  templateUrl: './rejected-art-list.component.html',
  styleUrls: ['./rejected-art-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class RejectedArtListComponent implements OnInit {
  dataSource: any;
  columnsToDisplay = ['artTask', 'contactName', 'orderId', 'dueDate', 'dueTime', 'status'];
  //columnsToDisplay = ['name', 'contactName', 'storeId', 'accountManager', 'stage'];
  expandedElement: any = null;
  artList: any[] = [];
  user: any;
  filterFormGroup:FormGroup;
  

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private httpClient: HttpClient,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit () {
    // this.getStoreRequestList();
    this.createFilterFormGroup();
    this.getRejectedArtList();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      startDate : new FormControl(''),
      endDate : new FormControl(''),
      type : new FormControl('5,7,11')
    });
  }

  // displayedColumns: string[] = [
  //   "storeName",
  //   "storeOwner",
  //   "orderNumber",
  //   "accountManager",
  //   "storeStatus",
  //   "closingDate",
  // ];

  // getStoreRequestList () {
  //   this.dataSource = [{ "artTask": "Dublin Jerome Football Logo", "customerName": "James", "orderId": "124578", "dueDate": "20/04/2021", "artist": "Jibin" },{ "artTask": "Dublin Jerome Basketball Logo", "customerName": "George", "orderId": "124579", "dueDate": "27/04/2021", "artist": "Jibin" }];
  // }

  verifyStoreBuild (storeId) {
    this.router.navigateByUrl('/storemanager/verifystore/' + storeId + '/0');
  }

  updateStoreStage (storeId, stage) {
    this.storeService.updateStoreStatus(storeId, stage).subscribe(
      (response) => {
        this.commonService.openSuccessSnackBar('Store published successfully', '');
      },
      (error) => {
        this.commonService.openErrorSnackBar('Failed to publish store', '');
      }
    );
  }

  getRejectedArtList () {
    let datePipe = new DatePipe('en-US');
    let startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    let endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    startDate = startDate == null ? '' : startDate;
    endDate = endDate == null ? '' : endDate;
    let type = this.filterFormGroup.get('type').value  == null ? '5,7,11' : this.filterFormGroup.get('type').value;
    this.storeService.getRejectedArtList(type,startDate,endDate).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }

  extendStoreClosureDate (storeId) {
    console.log(storeId);
  }

  openArtList (item: any) {
    localStorage.setItem('artReqObj', JSON.stringify(item));
    if (this.user.roles[0].id == 3) {
      this.router.navigateByUrl("/storebuilder/artImglist/" + item.id)
    } else if (this.user.roles[0].id == 5) {
      this.router.navigateByUrl("/artprocess/artImglist/" + item.id)
    }
  }

  downloadImg (url) {
    saveAs(url, `img.png`);
  }
}
