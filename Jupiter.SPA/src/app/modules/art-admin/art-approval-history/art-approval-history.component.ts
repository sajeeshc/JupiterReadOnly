import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-art-approval-history',
  templateUrl: './art-approval-history.component.html',
  styleUrls: ['./art-approval-history.component.scss']
})
export class ArtApprovalHistoryComponent implements OnInit {
  
  columnsToDisplay = ['artTask', 'contactName', 'orderId', 'dueDate','dueTime', 'artist','status'];
  artList:any[]=[];
  status : any;

  constructor(
    private storeService: StoreService,
    private commonService: CommonService,
    private route : ActivatedRoute
  ) { }

  ngOnInit () {
    this.status = this.route.snapshot.queryParams['status'];
    console.log(this.status)
    this.getArtList();
  }

  getArtList () {
    var status = this.status != undefined ? this.status : "6,5,11,7,10";
    if(status =="11"||status =="7"||status == "5"){
      this.storeService.getRejectedArtList("5,7,11").subscribe(response => {
        if (response.data != null) {
          this.artList = response.data;
          this.artList = this.artList.filter(item => item.artQueueStatus == "11");
        }
      });
    }else{
      this.storeService.getArtList({startDate:'',endDate:'',type:status,artist:'',artType:'',serviceId:0}).subscribe(response => {
        if (response.data != null) {
          this.artList = response.data;
        }
      });
    }
  }
}
