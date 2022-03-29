import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

declare var $ : any;

@Component({
  selector: 'app-store-request-management',
  templateUrl: './store-request-management.component.html',
  styleUrls: ['./store-request-management.component.scss']
})
export class StoreRequestManagementComponent implements OnInit {

  dataSource: any;
  filterFormGroup: FormGroup;
  user: any;
  type: string;
  typeIds: string;
  status: string;
  storeRejectionForm: FormGroup;
  rejectionCodes = [];
  selectedRejectionCodes : any[];

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService
  ) { }

  ngOnInit () {
    this.commonService.setPageHeader("Store Build Queue")
    this.user = JSON.parse(localStorage.getItem('user'));
    this.createStoreRejectionForm();
    this.route.paramMap.subscribe(params => {
      this.type = params.get('type');
      this.status = params.get('status')
    });
    if (this.type == 'myqueue') {
      this.typeIds = "3,4,7,15,19";
      if(this.status == "7,19")
      this.typeIds = "7,19"
    } else if (this.type == 'customerrejectedqueue') {
      this.typeIds = "19";
    }
    this.getAssignedRequestList();
    this.getStoreRejectionCodes();
    this.createFilterFormGroup();
  }

  createStoreRejectionForm() {
    this.storeRejectionForm = this.formBuilder.group({
      amRejectionCodes : '',
      amRejectionText : ''
    });
  }

  displayedColumns: string[] = [
    "storeName",
    "storeOwner",
    "orderNumber",
    "accountManager",
    "createdDate",
    "openDate",
    "closeDate",
    "dueDate",
    "status",
    "symbol",
    "symbol1"
  ];

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  getStoreRejectionCodes() {
    this.storeService.getTeamStoreRejectionCodes().subscribe(
      (response) => {
        this.rejectionCodes = response.data;
      },
      (error) => {

      }
    );
  }

  getAssignedRequestList () {
    this.storeBuilderService.getAssignedRequests(this.user.id, this.typeIds).subscribe(
      (response) => {
        this.dataSource = response.data;
      },
      (error) => {
        this.commonService.openWarningSnackBar("No requests available in queue","")
        // this.alertService.error(error);
      }
    );
  }

  openInfoModal(item){
    this.createStoreRejectionForm();
    this.selectedRejectionCodes = [];

    if(item.stage == 7){
      this.selectedRejectionCodes = this.filterRejectionCodes(item.amStoreRejectionCodes);
      this.storeRejectionForm.controls['amRejectionText'].setValue(item.amStoreRejectionText || '');
    }
    else if( item.stage == 19){
      this.selectedRejectionCodes = this.filterRejectionCodes(item.customerStoreRejectionCodes);
      this.storeRejectionForm.controls['amRejectionText'].setValue(item.customerStoreRejectionText || '');
    }

    $('#rejectionInfoModal').modal('toggle');
  }

  filterRejectionCodes(codes):any[] {
    let rejCodesArray  = [];
    if(!codes) return rejCodesArray
    
    let tempCodes = codes.split(',').map(function(item) {
      return parseInt(item, 10);
    });


    tempCodes.forEach((item)=>{
      let code = this.rejectionCodes.filter((obj)=> obj.id == item);
      rejCodesArray.push(code[0]);
    })

    return rejCodesArray;
  }

  closeInfoModal(){
    this.createStoreRejectionForm();
    $('#rejectionInfoModal').modal('toggle')
  }

  onCellClick (element) {
    localStorage.setItem("teamStoreId", element.id);
    // this.commonService.setPageHeader('Store Build Request Details - Store Definition');
    if(element.artQueueInfo && element.artQueueInfo.artQueueId)
      this.router.navigateByUrl('/storebuilder/artImglist/'+element.artQueueInfo.artQueueId);
    else
      this.router.navigateByUrl('/storebuilder/storerequest');
  }
}
