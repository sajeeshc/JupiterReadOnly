import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { CommonService } from "src/app/core/services/common.service";
import { StoreManagerService } from "src/app/core/services/store-manager.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";

@Component({
  selector: 'app-pending-store-request',
  templateUrl: './pending-store-request.component.html',
  styleUrls: ['./pending-store-request.component.scss']
})
export class PendingStoreRequestComponent implements OnInit {

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder : FormBuilder,
    private commonService: CommonService,
    private managerService: StoreManagerService,
    ) { }
  dataSource: any;
  filterParams
  filterFormGroup: FormGroup;
  managerList = []
  type:any = 1
  ngOnInit() {
    this.type  = this.route.snapshot.params["type"] || this.type
    if(this.type == 1)
      this.commonService.setPageHeader("Pending Store Requests")
    else
      this.commonService.setPageHeader("New Customer Store Requests")
    this.clearFilters()
    this.getStoreRequestList();
    this.getAllStoreManagerList()
  }

  displayedColumns: string[] = [
    "storeId",
    "storeName",
    "storeOwner",
    "accountManager",
    "createdDate",
    "openDate",
    "closeDate",
    "symbol",
  ];


  clearFilters() {
    this.filterParams = {
      storeId: '',
      name: '',
      contactName: '',
      accountManagerId: 0,
      type: this.type || 1,
      createdDate: '',
      openDate: '',
      closeDateFrom: '',
      closeDateTo: '',
      page: 1,
      per_page: 10,
      pageSizeOptions: [5, 10, 25, 100],
      totalLength: 0,
      orderBy: 'id',
      order: 'desc',
    }
  }
  
  getStoreRequestList () {
    this.storeBuilderService.getStoreRequestList(this.filterParams).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'id', 'desc', '1,2').subscribe(
      (response) => {
        this.dataSource = response.body.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      },
      (error) => {
        this.dataSource = []
        // this.alertService.error(error);
      }
    );
  }

  onCellClick (id: any) {
    localStorage.setItem("teamStoreId", id);
    this.router.navigateByUrl('/storemanager/storerequest/'+id+'/2');
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getStoreRequestList()
  }

  getAllStoreManagerList(){
    this.managerService.getAllManagerList().subscribe((res:any)=>{
      this.managerList = res.data
    })
  }

}
