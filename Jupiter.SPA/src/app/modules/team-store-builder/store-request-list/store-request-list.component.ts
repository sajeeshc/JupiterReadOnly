import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AlertService } from "src/app/core/services/alert.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { CommonService } from "src/app/core/services/common.service";
import { StoreService } from "src/app/core/services/store.service";

@Component({
  selector: "app-store-request-list",
  templateUrl: "./store-request-list.component.html",
  styleUrls: ["./store-request-list.component.scss"],
})
export class StoreRequestlistComponent implements OnInit {
  dataSource: any;
  filterFormGroup:FormGroup;
  user: any;

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder : FormBuilder,
    private commonService : CommonService,
    private storeServie : StoreService
  ) { }

  ngOnInit () {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.createFilterFormGroup();
    this.getStoreRequestList();
  }


  createFilterFormGroup(){
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  displayedColumns: string[] = [
    "storeName",
    "storeOwner",
    "orderNumber",
    "accountManager",
    "assignedTo",
    "dueDate",
    "symbol",
  ];

  getStoreRequestList () {
    console.log('here')
    this.storeBuilderService.getStoreRequestList({name:this.filterFormGroup.get('name').value, orderBy:'date', order:'desc', type:'4,15', per_page:0}).subscribe(
      // this.storeBuilderService.getStoreRequestList(this.filterFormGroup.get('name').value, null, null, 'date', 'desc', '2,4',null).subscribe(
      (response) => {
        this.dataSource = response.body.data;
      },
      (error) => {
      }
    );
  }

  onCellClick (id: any) {
    localStorage.setItem("teamStoreId", id);
    this.commonService.setPageHeader('Create Store Request - Store Definition');
    this.router.navigateByUrl('/storebuilder/storerequest');
  }

  assignToMe(element){
    this.storeBuilderService.assignTeamstoreToMe(element.id).subscribe(
      (response) => {
        // this.commonService.setPageHeader("My Art List");
        this.router.navigateByUrl("/storebuilder/storerequestmanagement/myqueue");
      },
      (error) => {
      }
    );
  }

  reAssignToMe(element){
    this.storeServie.reAssignArtOrTeamStore(element.id,1).subscribe(
      (response) => {
        this.commonService.openSuccessSnackBar(response.message, "");
        this.getStoreRequestList();
      },
      (error) => {
      }
    );
  }
}
