import { Component, OnInit } from "@angular/core";
import { DatePipe } from "@angular/common";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "src/app/core/services/alert.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { StoreService } from "src/app/core/services/store.service";
import { CommonService } from "src/app/core/services/common.service";
import { StoreManagerService } from "src/app/core/services/store-manager.service";

import Swal from "sweetalert2";
const moment = require("moment");
declare var $: any;

@Component({
  selector: "app-all-store-list",
  templateUrl: "./all-store-list.component.html",
  styleUrls: ["./all-store-list.component.scss"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class AllStoreListComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private managerService: StoreManagerService
  ) {}

  rejectionInfo = { text: "", codes: [] };
  rejectionCodes;
  dataSource: any;
  columnsToDisplay = [
    "storeId",
    "name",
    "contactName",
    "accountManager",
    "stage",
    "isUserVerified",
    "closeDate",
    "viewStore",
  ];
  expandedElement: any = null;
  filterFormGroup: FormGroup;
  storeForm: FormGroup;
  stage: any = 0;
  minDate: Date = new Date();
  filterParams: any
  dateFilters:any
  managerList = [];
  managerId;
  closeDateExceeded = false;

  ngOnInit() {
    this.clearFilters()
    this.managerId = Number(localStorage.getItem("userId")) || 0;
    this.route.paramMap.subscribe((params) => {
      this.stage = params.get("stage");
    });
    this.createFilterFormGroup();
    this.createStoreForm();
    this.getStoreRequestList();
    this.getAllStoreManagerList();
    this.getStoreRejectionCodes();
  }

  createFilterFormGroup() {
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl(""),
      stage: new FormControl(this.stage),
      startDate: new FormControl(""),
      endDate: new FormControl(""),
      manager: new FormControl(this.managerId),
    });
  }

  getAllStoreManagerList() {
    this.managerService.getAllManagerList().subscribe((res: any) => {
      this.managerList = res.data;
    });
  }

  clearFilters() {
    // this.createFilterFormGroup();
    this.filterParams = {
      storeId: "",
      name: "",
      contactName: "",
      accountManagerId: 0,
      type: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 15, 19, 20],
      isUserVerified: 0,
      createdDate: "",
      publishedDate: "",
      openDate: "",
      closeDateFrom: "",
      closeDateTo: "",
      page: 1,
      per_page: 10,
      pageSizeOptions: [5, 10, 25, 100],
      totalLength: 0,
      orderBy: "date",
      order: "desc",
    };
    this.dateFilters = {
      closeDateFrom: "",
      closeDateTo: "",
    }
  }

  createStoreForm() {
    this.storeForm = this.formBuilder.group({
      id: 0,
      closeDate: "04/30/2021",
      minDate: new Date(),
    });
  }

  getStoreRequestList() {
    let name = this.filterFormGroup.get("name").value;
    let stage = this.filterFormGroup.get("stage").value; //'6,9,10,11'
    let mgrId = this.filterFormGroup.get("manager").value;
    this.filterParams.type =
      stage == "0"
        ? this.filterParams.type
        : stage.split(",").map(function (item) {
            return parseInt(item, 10);
          });
    let datePipe = new DatePipe("en-US");
    let startDate = datePipe.transform(
      // this.filterFormGroup.get("startDate").value,
      this.dateFilters.closeDateFrom,
      "MM/dd/yyyy"
    );
    let endDate = datePipe.transform(
      // this.filterFormGroup.get("endDate").value,
      this.dateFilters.closeDateTo,
      "MM/dd/yyyy"
    );
    this.filterParams.closeDateFrom = startDate ? startDate : "";
    this.filterParams.closeDateTo = endDate ? endDate : "";

    if (stage == "50") {
      this.closeDateExceeded = true;
      this.filterParams.type = [];
    }
    this.storeBuilderService
      .getStoreRequestList(this.filterParams, this.closeDateExceeded)
      .subscribe(
        // this.storeBuilderService.getStoreRequestList(name, startDate, endDate, 'date', 'desc', stage, null, mgrId).subscribe(
        (response) => {
          this.dataSource = response.body.data;
          this.filterParams.totalLength =
            JSON.parse(response.headers.get("Pagination")).totalItems || 0;
          this.dataSource.forEach((element) => {
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

  verifyStoreBuild(storeId) {
    this.commonService.setPageHeader("Create Store Request - Store Definition");
    this.router.navigateByUrl("/storemanager/verifystore/" + storeId + "/0");
  }

  closeStore(store) {
    Swal.fire({
      icon: "info",
      title: "Are you sure that you want to close this store?",
      cancelButtonText: "Cancel",
      confirmButtonText: "Yes",
      showCancelButton: true,
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.updateStoreStage(store, 11);
      }
    });
  }

  updateStoreStage(store, stage) {
    // if (store.artQueueInfo.artQueueStatus == 4) {
    this.storeService.updateStoreStatus(store.id, stage).subscribe(
      (response) => {
        this.getStoreRequestList();
        if (stage == 11) {
          this.commonService.openSuccessSnackBar("Store is now closed", "");
          this.commonService.setPageHeader("Closed Stores");
          this.router.navigateByUrl("/storemanager/allstores/11");
        } else {
          this.commonService.openSuccessSnackBar(
            "Store published successfully",
            ""
          );
        }
      },
      (error) => {
        this.commonService.openErrorSnackBar("Failed to update store", "");
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
      minDate: moment(storeDetail.openDate)
        .add(2, "weeks")
        .startOf("day")
        .toDate(),
    });
    $("#storeClosureModal").modal("show");
  }

  setDateToDatepicker(date: any) {
    return moment(date, "MM/DD/YYYY HH:mm:ss").toDate();
    // let dateArr = date.split("/");
    // let dateMonth: number = +dateArr[0];
    // let dateDay: number = +dateArr[1];
    // let dateYear: number = +dateArr[2];
    // return new Date(dateYear, dateMonth - 1, dateDay);
  }

  updateStoreClosure() {
    let datePipe = new DatePipe("en-US");
    console.log(this.storeForm.value);
    this.storeForm.value.closeDate = moment(
      this.storeForm.get("closeDate").value
    ).format("MM/DD/YYYY HH:mm:ss");
    this.storeService.updateStore(this.storeForm.value).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(
            "Store closure date updated successfully",
            ""
          );
          this.getStoreRequestList();
        } else {
          this.commonService.openErrorSnackBar(
            "Failed to update store closure",
            ""
          );
        }
        $("#storeClosureModal").modal("hide");
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
    window.open(window.location.origin + "/store/" + teamstore.id, "_blank");
    // }
  }

  verifyArt(element) {
    this.commonService.setPageHeader("Art Pending Approval");
    element.artQueueInfo.id = element.artQueueInfo.artQueueId;
    localStorage.setItem(
      "artApprovalObj",
      JSON.stringify(element.artQueueInfo)
    );
    this.router.navigateByUrl("/storemanager/viewartlist");
  }

  invalidClosingDay() {
    // return true if day is friday or saturday
    let date = this.storeForm.controls.closeDate.value;
    if (moment(date).day() >= 5) {
      this.storeForm.controls.closeDate.setErrors({ invalidDay: "true" });
      this.commonService.openWarningSnackBar(
        "Close Date cannot be Friday or Saturday",
        ""
      );
      return true;
    } else {
      return false;
    }
  }

  copyLayout(teamStoreId: any) {
    this.storeService.copyStoreLayout(teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          let copiedStoreId = response.data.id;
          this.router.navigateByUrl(
            "/storemanager/copylayout/" + copiedStoreId + "/2/true"
          );
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  viewOrderStatus(storeId) {
    this.router.navigateByUrl("/storemanager/storeorderstatus/" + storeId);
  }

  onPage(event) {
    this.filterParams.per_page = event.pageSize;
    this.filterParams.page = event.pageIndex + 1;
    this.getStoreRequestList();
  }

  getStoreRejectionCodes() {
    this.storeService.getTeamStoreRejectionCodes().subscribe((response) => {
      this.rejectionCodes = response.data;
    });
  }

  viewRejectionNotes(store) {
    if (store.stage == 19) {
      // customer rejected
      this.rejectionInfo = {
        text: store.customerStoreRejectionText,
        codes: [],
      };
      store.customerStoreRejectionCodes.split(",").forEach((code) => {
        this.rejectionInfo.codes.push(
          this.rejectionCodes.find((codeObj) => codeObj.id == code).code
        );
      });
    } else if (store.stage == 7) {
      // manager rejected
      this.rejectionInfo = {
        text: store.amStoreRejectionText,
        codes: [],
      };
      store.amStoreRejectionCodes.split(",").forEach((code) => {
        this.rejectionInfo.codes.push(
          this.rejectionCodes.find((codeObj) => codeObj.id == code).code
        );
      });
    }
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
}
