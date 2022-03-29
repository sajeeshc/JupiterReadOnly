import { Component, OnInit } from "@angular/core";
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoreService } from "src/app/core/services/store.service";
import { CommonService } from "src/app/core/services/common.service";
import Swal from 'sweetalert2'
import { StoreManagerService } from "src/app/core/services/store-manager.service";
import { environment } from "src/environments/environment";
const moment = require('moment')
declare var $: any;

@Component({
  selector: 'app-store-list',
  templateUrl: './store-list.component.html',
  styleUrls: ['./store-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class StoreListComponent implements OnInit {
  dataSource: any;
  columnsToDisplay = [
    'storeId', 'name', 'contactName', 'accountManager',
    'stage', 'userVerified', 'createdDate', 'publishedDate', 'openDate', 'closeDate', 'viewStore'];
  expandedElement: any = null;
  filterFormGroup: FormGroup;
  storeForm: FormGroup;
  stage: any;
  minDate: Date = new Date();
  storeRejectionForm: FormGroup;
  rejectionCodes = [];
  selectedRejectionCodes: any[];
  filterParams: any
  dateFilters:any
  reasonList = []
  customerRejectionForm
  closeDateExceeded = false;
  managerList = []
  roles = []
  constructor(
    private formBuilder: FormBuilder,
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private managerService: StoreManagerService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.roles = JSON.parse(localStorage.getItem('user')).roles
    this.route.paramMap.subscribe(params => {
      this.stage = params.get('stage');
    });
    this.clearFilters()
    this.createStoreForm();
    this.createFilterFormGroup();
    this.createStoreRejectionForm();
    this.getStoreRequestList();
    this.getStoreRejectionCodes();
    this.getAllStoreManagerList()
    this.getReasonList()
    this.createCustomerRejectionForm()
  }

  // updateStatus (value) {
  //   if (value == 1) {
  //     $('#rejectionModal').modal('show');
  //   } else {
  //     this.submit(value);
  //   }
  // }
  createCustomerRejectionForm() {
    this.customerRejectionForm = this.formBuilder.group({
      rejectionCode: '',
      rejectionCodeArray: '',
      rejectionReason: '',
      storeId: '',
      value: 1
    });
  }

  confirmRejection() {
    // this.rejectionBody = {
    //   rejectionCode: this.storeRejectionForm.controls['amRejectionCodes'].value.toString()
    //   rejectionReason: this.storeRejectionForm.controls['amRejectionText'].value,
    // }
    // this.submit(1);
  }

  closeRejectModal() {
    $('#rejectStoreModal').modal('hide');
    this.createCustomerRejectionForm()
  }

  openRejectModal(storeId) {
    // $('#addArtModal').modal('hide');
    $('#rejectStoreModal').modal('show');
    this.createCustomerRejectionForm()
    this.customerRejectionForm.get('storeId').setValue(storeId)
  }

  // cancelRejection () {
  //   this.rejectionBody = {};
  //   this.rejectionCode = 0;
  //   this.rejectionReason = "";
  //   $('#rejectStoreModal').modal('hide');
  // }

  rejectionForCustomer() {
    let { storeId, value } = this.customerRejectionForm.value
    this.customerRejectionForm.get('rejectionCode').setValue(this.customerRejectionForm.get('rejectionCodeArray').value.toString())
    this.storeService.userVerifyTeamStore(storeId, value, this.customerRejectionForm.value).subscribe((response) => {
      // this.cancelRejection();
      this.closeRejectModal()
      this.getStoreRequestList()
      if (response.statusCode == 200) {
        Swal.fire({
          title: "Rejected",
          text: "Rejection request has been sent successfully!",
          icon: "success",
        })
      }
    });
  }

  getReasonList() {
    this.storeService.getReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  createFilterFormGroup() {
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl(''),
      stage: new FormControl(this.stage),
      startDate: new FormControl(''),
      endDate: new FormControl('')
    });
  }

  clearFilters() {
    this.createFilterFormGroup();
    this.filterParams = {
      storeId: '',
      name: '',
      contactName: '',
      accountManagerId: 0,
      userVerified: '',
      type: '6,9,10,11,19,20',
      createdDate: '',
      publishedDate: '',
      openDate: '',
      closeDateFrom: '',
      closeDateTo: '',
      isUserVerified: '0,1,2',
      page: 1,
      per_page: 10,
      pageSizeOptions: [5, 10, 25, 100],
      totalLength: 0,
      orderBy: 'date',
      order: 'desc',
    }
    this.dateFilters = {
      closeDateFrom: "",
      closeDateTo: "",
    }
    this.getStoreRequestList();
  }

  createStoreForm() {
    this.storeForm = this.formBuilder.group({
      id: 0,
      closeDate: '04/30/2021',
      minDate: new Date()
    });
  }

  createStoreRejectionForm() {
    this.storeRejectionForm = this.formBuilder.group({
      amRejectionCodes: '',
      amRejectionText: ''
    });
  }

  getStoreRequestList() {
    // let name = this.filterFormGroup.get('name').value;
    let stage = this.filterFormGroup.get('stage').value;//'6,9,10,11'
    this.filterParams.type = (stage == "0") ? this.filterParams.type : stage;
    let datePipe = new DatePipe('en-US');
    let startDate = datePipe.transform(this.dateFilters.closeDateFrom, 'MM/dd/yyyy');
    let endDate = datePipe.transform(this.dateFilters.closeDateTo, 'MM/dd/yyyy');
    // let startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    // let endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    this.filterParams.closeDateFrom = startDate ? startDate : ''
    this.filterParams.closeDateTo = endDate ? endDate : ''
    this.storeBuilderService.getStoreRequestList(this.filterParams, this.closeDateExceeded).subscribe(
      (response) => {
        this.dataSource = response.body.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
        this.dataSource.forEach(element => {
          var tempDate = new Date(Date.parse(element.createdDate));
          element.createdDate = tempDate.toLocaleString();
        });

      },
      (error) => {
        this.dataSource = [];
        this.alertService.error(error);
      }
    );
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

  closeStore(store) {
    Swal.fire({
      icon: 'info',
      title: 'Are you sure that you want to close this store?',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Yes',
      showCancelButton: true,
      reverseButtons: true
    }).then(result => {
      if (result.isConfirmed) {
        this.updateStoreStage(store, 11);
      }
    })
  }

  verifyStoreBuild(storeId) {
    this.commonService.setPageHeader('Create Store Request - Store Definition');
    this.router.navigateByUrl('/storemanager/verifystore/' + storeId + '/0');
  }

  updateStoreStage(store, stage) {
    // if (store.artQueueInfo.artQueueStatus == 4) {
    this.storeService.updateStoreStatus(store.id, stage).subscribe(
      (response) => {
        this.getStoreRequestList();
        if (stage == 11) {
          this.commonService.openSuccessSnackBar("Store is now closed", '');
          this.commonService.setPageHeader('Closed Stores');
          this.router.navigateByUrl('/storemanager/allstores/11');
        } else {
          this.commonService.openSuccessSnackBar(response.message, '');
        }
      },
      (error) => {
        this.commonService.openErrorSnackBar(error.message, '');
      }
    );
    // }
    // else {
    //   this.commonService.openErrorSnackBar('Please verify the art related to the teamstore', '');
    // }

  }

  openStoreClosureModal(storeDetail) {

    // this.storeForm.patchValue({
    //   id: storeDetail.id,
    //   closeDate: this.setDateToDatepicker(storeDetail.closeDate),
    //   minDate: moment(storeDetail.openDate).add(2, 'weeks').startOf('day')
    // });
    this.storeForm = this.formBuilder.group({
      id: storeDetail.id,
      closeDate: this.setDateToDatepicker(storeDetail.closeDate),
      minDate: moment(storeDetail.openDate).add(1, 'day').endOf('day').toDate()
    });
    $('#storeClosureModal').modal('show');
  }

  setDateToDatepicker(date: any) {
    return moment(date, "MM/DD/YYYY HH:mm:ss").toDate()
    // let dateArr = date.split("/"); 
    // let dateMonth: number = +dateArr[0];
    // let dateDay: number = +dateArr[1];
    // let dateYear: number = +dateArr[2];
    // return new Date(dateYear, dateMonth - 1, dateDay);
  }

  updateStoreClosure() {
    let datePipe = new DatePipe('en-US');
    console.log(this.storeForm.value)
    this.storeForm.value.closeDate = moment(this.storeForm.get('closeDate').value).format("MM/DD/YYYY HH:mm:ss")
    this.storeService.updateStoreCloseDate(this.storeForm.value).subscribe(
    // this.storeService.updateStore(this.storeForm.value).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar('Store closure date updated successfully', '');
          this.getStoreRequestList();
        } else {
          this.commonService.openErrorSnackBar('Failed to update store closure', '');
        }
        $('#storeClosureModal').modal('hide');
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewStoreBuild(teamstore) {
    // if (teamstore.storeUrl) {
    //   window.open(teamstore.storeUrl, "_blank");
    // } else {
    window.open("/store/" + teamstore.storeUrl, "_blank");
    // }
  }

  verifyArt(element) {
    // this.commonService.setPageHeader('Art Pending Approval');
    // element.artQueueInfo.id = element.artQueueInfo.artQueueId;
    // localStorage.setItem('artApprovalObj', JSON.stringify(element.artQueueInfo));
    // this.router.navigateByUrl('/storemanager/viewartlist');
    // this.router.navigateByUrl('/viewart/'+element.artQueueInfo.artQueueId);
    const URL = '/viewart/' + element.artQueueInfo.artQueueId
    window.open(URL, '_blank');
  }

  invalidClosingDay() {
    // return true if day is friday or saturday
    let date = this.storeForm.controls.closeDate.value
    if (moment(date).day() >= 5) {
      this.storeForm.controls.closeDate.setErrors({ invalidDay: "true" })
      this.commonService.openWarningSnackBar("Close Date cannot be Friday or Saturday", "");
      return true
    } else {
      return false
    }
  }

  copyLayout(teamStoreId: any) {
    this.storeService.copyStoreLayout(teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          let copiedStoreId = response.data.id;
          this.router.navigateByUrl('/storemanager/copylayout/' + copiedStoreId + '/2/true');
        }
      },
      (error) => {
        console.log(error);

      }
    );
  }

  openInfoModal(item) {
    this.createStoreRejectionForm();
    this.selectedRejectionCodes = [];

    if (item.stage == 7) {
      this.selectedRejectionCodes = this.filterRejectionCodes(item.amStoreRejectionCodes);
      this.storeRejectionForm.controls['amRejectionText'].setValue(item.amStoreRejectionText);
    }
    else if (item.stage == 19) {
      this.selectedRejectionCodes = this.filterRejectionCodes(item.customerStoreRejectionCodes);
      this.storeRejectionForm.controls['amRejectionText'].setValue(item.customerStoreRejectionText);
    }

    $('#rejectionInfoModal').modal('toggle');
  }

  filterRejectionCodes(codes): any[] {
    let tempCodes = codes ? codes.split(',').map(function (item) {
      return parseInt(item, 10);
    }) : []

    let rejCodesArray = [];

    tempCodes.forEach((item) => {
      let code = this.rejectionCodes.filter((obj) => obj.id == item);
      rejCodesArray.push(code[0]);
    })

    return rejCodesArray;
  }

  closeInfoModal() {
    this.createStoreRejectionForm();
    $('#rejectionInfoModal').modal('toggle')
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getStoreRequestList()
  }

  getAllStoreManagerList() {
    this.managerService.getAllManagerList().subscribe((res: any) => {
      this.managerList = res.data
    })
  }

  republishStore(element) {
    this.commonService.toggleLoading(true)
    this.managerService.republishStore(element.id).subscribe((res:any) => {
      this.commonService.toggleLoading(false)
      let storeId = res.data.id
      this.router.navigateByUrl('storemanager/storerequest/'+storeId+'/2')
    }, err => {
      this.commonService.toggleLoading(false)
    })
  }

  hasAccess(roleId){
    if(this.roles && this.roles.length){
      if(this.roles.find(role=>role.id == roleId))
        return true
      else
        return false
    }
    return true
  }
}
