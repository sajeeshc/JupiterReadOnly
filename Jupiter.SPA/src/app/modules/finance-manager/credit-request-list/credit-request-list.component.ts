import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { FinanceManagerService } from 'src/app/core/services/finance-manager.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-credit-request-list',
  templateUrl: './credit-request-list.component.html',
  styleUrls: ['./credit-request-list.component.scss']
})
export class CreditRequestListComponent implements OnInit {

  dataSource: any[];
  displayedColumns: string[] = [
    "customerName",
    "customerEmail",
    "organization",
    "creditStatus",
    "creditAmount",
    "appliedDate",
    "updatedDate",
    "updatedBy",
    "notes",
    "action"
  ];  
  filterParams = {
    customerName: '',
    customerEmail: '',
    organization: '',
    creditStatus: '',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0
  }
  applicationHistory = []

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private financeManagerService: FinanceManagerService,
    private commonServie: CommonService) { }

  ngOnInit() {
    this.getCreditApplications();
  }

  getCreditApplications() {
    this.financeManagerService.getCreditApplications(this.filterParams).subscribe(
      (response) => {
        this.dataSource = response.body.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      },
      (error) => {
        // this.commonServie.openSuccessSnackBar(error.message, '');
      }
    );
  }

  approveCreditApplication(id, i) {
    let notes = document.getElementById("notes_" + id) as HTMLInputElement
    let credit = document.getElementById("credit_" + id) as HTMLTextAreaElement
    let obj = {
      id,
      creditStatus: 1,
      notes: notes.value,
      credit: credit.value
    }
    if (credit.value) {
      this.userService.userCredit(obj).subscribe(
        (response) => {
          this.commonServie.openSuccessSnackBar("Credit approved successfully!", '');
          this.dataSource[i].creditStatus = 1
          this.dataSource[i].notes = notes.value
          this.dataSource[i].credit = credit.value
        },
        (error) => {
          this.commonServie.openErrorSnackBar("Unable to approve", '');
        }
      );
    } else {
      this.commonServie.openWarningSnackBar("Enter credit limit to continue", "")
    }
  }

  rejectCreditApplication(id, i) {
    let notes = document.getElementById("notes_" + id) as HTMLInputElement
    let obj = {
      id,
      creditStatus: 2,
      notes: notes.value,
    }
    this.userService.userCredit(obj).subscribe(
      (response) => {
        this.commonServie.openSuccessSnackBar("Credit rejected successfully!", '');
        this.dataSource[i].creditStatus = 2
        this.dataSource[i].notes = notes.value
      },
      (error) => {
        this.commonServie.openErrorSnackBar("Unable to reject", '');
      }
    );
  }

  showLogs(id) {
    this.applicationHistory = null
    this.financeManagerService.getCreditApplicationHistory(id).subscribe(res => {
      this.applicationHistory = res.body.data
    },err=>{
      console.log(err)
      this.applicationHistory = []
    })
  }
  
  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getCreditApplications()
  }

}
