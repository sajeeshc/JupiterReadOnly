import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-art-queuelist',
  templateUrl: './art-queuelist.component.html',
  styleUrls: ['./art-queuelist.component.scss']
})
export class ArtQueuelistComponent implements OnInit {

  dataSource: any;
  artList: any[] = [];

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService
  ) { }

  user: any;

  ngOnInit () {
    //this.getStoreRequestList();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.getArtList();
  }

  displayedColumns: string[] = [
    "id",
    "artName",
    "customerName",
    "assignedTo",
    "artCount",
    "dueDate",
    "dueTime",
    "symbol",
  ];

  filterParams = {
    artName:'',
    artCount:'',
    customerName:'',
    orderNumber:'',
    dueDate:'',
    dueTime:'',
    assignedTo:'',
    symbol:'',
    type: "1,3",
    artType:2,
    serviceId:0,
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0,
  }

  getStoreRequestList () {
    this.storeBuilderService.getStoreRequestList({orderBy:'date', order:'desc', type:'2,4,5'}).subscribe(
      // this.storeBuilderService.getStoreRequestList(null, null, null, 'date', 'desc', '2,4,5').subscribe(
      (response) => {
        this.dataSource = response.body.data;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  getArtList () {
    // let type = "1,3";//to get only requested list
    this.storeService.getArtList(this.filterParams).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
        this.filterParams.totalLength = JSON.parse(response.headers.get("Pagination")).totalItems || 0
      }
      else {
      }
    });
  }


  assignToArtist (item) {
    item.assignedToId = this.user.id;
    item.artQueueStatus = 3;
    this.storeService.updateArtQueueStatus(item).subscribe(response => {
      if (response.data != null) {
        this.commonService.openSuccessSnackBar(response.message, "");
        this.router.navigateByUrl('/storebuilder/artlist');
      }
    });
  }

  reAssignToArtist (item) {
    this.storeService.reAssignArtOrTeamStore(item.id,2).subscribe(response => {
      if (response.data != null) {
        this.commonService.openSuccessSnackBar(response.message, "");
        this.getArtList();
      }
    });
  }

    
  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getArtList()
  }
}



