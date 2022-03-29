import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router,
    private storeService: StoreService,
    private commonService: CommonService) { }

    artList:any[]=[];
    artQueueList:any[]=[];
    columnsToDisplay = ['name', 'dueDate'];
    expandedElement: any = null;
    user:any;

  ngOnInit() {
   this.commonService.setPageHeader('Artist Dashboard');
   this.user = JSON.parse(localStorage.getItem('user'));
    this.getArtList(1);
    this.getArtList(3);
  }

  getArtList (type) {
    this.storeService.getArtList({startDate:'',endDate:'',type,artist:'',artType:'',serviceId:0}).subscribe(response => {
      if (response.data != null) {
        switch(type){
          case 2:
          this.artList = response.data;
          break;
          case 1:
            this.artQueueList = response.data;
        }
        
      }
    });
  }
  setHeader(header){
    this.commonService.setPageHeader(header);
  }

  assignToArtist(item){
    item.assignedToId = this.user.id;
    item.artQueueStatus = 3;
    this.storeService.updateArtQueueStatus(item).subscribe(response => {
      if (response.data != null) {
        this.commonService.openSuccessSnackBar(response.message,"");
        this.router.navigateByUrl('/artprocess/artlist');
      }
    });
  }

  openArtList(item:any){
    localStorage.setItem('artReqObj',JSON.stringify(item));
    this.router.navigateByUrl("/artprocess/artImglist/"+item.id)
  }

}
