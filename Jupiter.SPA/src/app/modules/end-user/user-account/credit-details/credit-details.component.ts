import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-credit-details',
  templateUrl: './credit-details.component.html',
  styleUrls: ['./credit-details.component.scss']
})
export class CreditDetailsComponent implements OnInit {

  constructor(private userService: UserService, private commonService: CommonService) { }

  userObj
  orgArray = []
  selectedOrg = -1
  dataSource = []
  displayedColumns: string[] = [
    "organization",
    "creditAmount",
    "creditStatus",
    "action"
  ];
  ngOnInit() {
    let userId = localStorage.getItem("userId")
    let token = localStorage.getItem("token")
    this.getProfile(userId, token)
    this.getCreditInfo(userId)
    this.getOrganizations()
  }

  getProfile(userId: string, token: string) {
    this.userService.getProfileDetails(userId.toString(), token.toString()).subscribe(response => {
      this.userObj = response.data;
    }, error => {
      console.log(error);
    })
  }

  getCreditInfo(userId) {
    this.userService.getUserCreditInfo(userId.toString()).subscribe(response => {
      if (response.data.length)
        this.dataSource = response.data;
      else
        this.dataSource = null
    }, error => {
      console.log(error);
    })
  }

  applyForCredit() {
    if (this.selectedOrg > -1) {
      this.userService.userCredit({ organizationId: this.selectedOrg, creditStatus: 1 }).subscribe(res => {
        this.getCreditInfo(this.userObj.id)
        this.commonService.openSuccessSnackBar("Credit application submitted successfully", "")
      }, err => {
        this.commonService.openErrorSnackBar("Unable to submit request", "")
      })
    } else {
      this.commonService.openWarningSnackBar("Select organization to apply for credit", "")
    }
  }

  reApplyForCredit(id, organizationId) {
    if (organizationId) {
      this.userService.userCredit({
        id,
        organizationId,
        creditStatus: 3
      }).subscribe(res => {
        this.getCreditInfo(this.userObj.id)
        this.commonService.openSuccessSnackBar("Credit application submitted successfully", "")
      }, err => {
        this.commonService.openErrorSnackBar("Unable to submit request", "")
      })
    } else {
      this.commonService.openWarningSnackBar("Select organization to apply for credit", "")
    }
  }

  getOrganizations(){
    this.userService.getCreditOrganizations({isNotApplied:true}).subscribe(res=>{
      this.orgArray = res.data
    })
  }

}
