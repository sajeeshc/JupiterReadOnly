import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  dashBoardDetailCount:any;
  user:any;
  teamStoreList:any;

  constructor(private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService) { }

  ngOnInit () {
   this.user =JSON.parse(localStorage.getItem('user')); 
   this.getDashboardDetailsCount();
   this.getStoreRequestList();
   this.commonService.setPageHeader('Super Admin Dashboard');
  }

  getDashboardDetailsCount () {
    this.storeBuilderService.getDashboardDetailsCount(this.user.id).subscribe(
      (response) => {
        this.dashBoardDetailCount = response.data;
        console.log(this.dashBoardDetailCount);
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getStoreRequestList () {
    this.storeBuilderService.getStoreRequestList({orderBy:'date', order:'desc', type:'2,4,7',assignedTo:this.user.id}).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'date', 'desc', '2,4,7',this.user.id).subscribe(
      (response) => {
        this.teamStoreList = response.body.data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  setHeader(header){
    this.commonService.setPageHeader(header);
  }

  onCellClick (id: any) {
    localStorage.setItem("teamStoreId", id);
    this.router.navigateByUrl('/storebuilder/storerequest');
  }


}
