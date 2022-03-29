import { Component, OnInit } from "@angular/core";
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { animate, state, style, transition, trigger } from '@angular/animations';
import { StoreService } from "src/app/core/services/store.service";
import { CommonService } from "src/app/core/services/common.service";

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
  columnsToDisplay = ['name', 'contactName', 'storeId', 'accountManager', 'userVerified', 'stage', 'closeDate', 'viewStore'];
  expandedElement: any = null;
  filterFormGroup: FormGroup;
  storeForm: FormGroup;
  stage: any;
  minDate: Date = new Date();

  constructor(
    private formBuilder: FormBuilder,
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService
  ) { }

  ngOnInit () {

    this.route.paramMap.subscribe(params => {
      this.stage = params.get('stage');
    });
    this.createFilterFormGroup();
    this.createStoreForm();
    this.getStoreRequestList();
  }

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl(''),
      stage: new FormControl(this.stage),
    });
  }

  createStoreForm () {
    this.storeForm = this.formBuilder.group({
      id: 0,
      closeDate: '04/30/2021'
    });
  }

  getStoreRequestList () {
    var name = this.filterFormGroup.get('name').value;
    var stage = this.filterFormGroup.get('stage').value;//'6,9,10,11'
    var stage = (stage == 0) ? '6,9,10,11,18,19,20' : stage;
    this.storeBuilderService.getStoreRequestList({name, orderBy:'date', order:'desc', type:stage}).subscribe(
      (response) => {
        this.dataSource = response.body.data;
      },
      (error) => {
        this.dataSource = []
        this.alertService.error(error);
      }
    );
  }

  verifyStoreBuild (storeId) {
    this.commonService.setPageHeader('Create Store Request - Store Definition');
    this.router.navigateByUrl('/storemanager/verifystore/' + storeId + '/0');
  }

  updateStoreStage (store, stage) {
    // if (store.artQueueInfo.artQueueStatus == 4) {
    this.storeService.updateStoreStatus(store.id, stage).subscribe(
      (response) => {
        this.getStoreRequestList();
        this.commonService.openSuccessSnackBar('Store published successfully', '');
      },
      (error) => {
        this.commonService.openErrorSnackBar('Failed to publish store', '');
      }
    );
    // }
    // else {
    //   this.commonService.openErrorSnackBar('Please verify the art related to the teamstore', '');
    // }

  }

  openStoreClosureModal (storeDetail) {
    this.storeForm.patchValue({
      id: storeDetail.id,
      closeDate: this.setDateToDatepicker(storeDetail.closeDate)
    });
    $('#storeClosureModal').modal('show');
  }

  setDateToDatepicker (date: any) {
    let dateArr = date.split("/"); //dd/mm/yyyy
    let dateMonth: number = +dateArr[0];
    let dateDay: number = +dateArr[1];
    let dateYear: number = +dateArr[2];
    return new Date(dateYear, dateMonth - 1, dateDay);
  }

  updateStoreClosure () {
    var datePipe = new DatePipe('en-US');
    this.storeForm.value.closeDate = datePipe.transform(this.storeForm.get('closeDate').value, 'MM/dd/yyyy');
    this.storeService.updateStore(this.storeForm.value).subscribe(
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

  viewStoreBuild (teamstore) {
    if (teamstore.storeUrl) {
      window.open(teamstore.storeUrl, "_blank");
    } else {
      window.open(window.location.origin + "/store/" + teamstore.id, "_blank");
    }
  }

  verifyArt (element) {
    // this.commonService.setPageHeader('Art Pending Approval');
    // element.artQueueInfo.id = element.artQueueInfo.artQueueId;
    // localStorage.setItem('artApprovalObj', JSON.stringify(element.artQueueInfo));
    // this.router.navigateByUrl('/viewart/'+element.artQueueInfo.artQueueId);
    const URL = '/viewart/'+element.artQueueInfo.artQueueId
    window.open(URL, '_blank');
  }
}
