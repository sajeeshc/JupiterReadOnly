import { DatePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { CommonService } from "src/app/core/services/common.service";
import { StoreManagerService } from "src/app/core/services/store-manager.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";

@Component({
  selector: 'app-store-request-list',
  templateUrl: './store-request-list.component.html',
  styleUrls: ['./store-request-list.component.scss']
})
export class StoreRequestListComponent implements OnInit {
  dataSource: any;
  filterParams
  filterFormGroup: FormGroup;
  managerList = []
  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private managerService: StoreManagerService,
  ) { }

  ngOnInit() {
    this.commonService.setPageHeader("Assigned to Builder Queue")
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
      type: '4',
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

  getAllStoreManagerList(){
    this.managerService.getAllManagerList().subscribe((res:any)=>{
      this.managerList = res.data
    })
  }

  getStoreRequestList() {
    this.storeBuilderService.getStoreRequestList(this.filterParams).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'id', 'desc', '2,4').subscribe(
      (response) => {
        this.dataSource = response.body.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  onCellClick(id: any) {
    localStorage.setItem("teamStoreId", id);
    this.router.navigateByUrl('/storemanager/storerequest/' + id + '/2');
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getStoreRequestList()
  }

}
