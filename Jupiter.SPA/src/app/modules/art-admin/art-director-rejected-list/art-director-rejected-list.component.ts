import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

declare var $ : any;

@Component({
  selector: 'app-art-director-rejected-list',
  templateUrl: './art-director-rejected-list.component.html',
  styleUrls: ['./art-director-rejected-list.component.scss']
})
export class ArtDirectorRejectedListComponent implements OnInit {

  dataSource: any;
  columnsToDisplay = ['artTask', 'contactName', 'orderId', 'dueDate','dueTime', 'artist','status'];
  expandedElement: any = null;
  artList: any[] = [];
  artImgList:any[]=[];
  selectedArtReqObj:any;

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private httpClient: HttpClient
  ) { }

  ngOnInit () {
    this.getArtList();
  }

  getArtList () {
    var type = 7 ;//art-director rejected list
    this.storeService.getArtList({startDate:'',endDate:'',type,artist:'',artType:'',serviceId:0}).subscribe(response => {
      // this.storeService.getArtList('','',type,'','',0).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }
     openArtApprovalList(item:any){
      localStorage.setItem('artApprovalObj',JSON.stringify(item));
      this.router.navigateByUrl("/artadmin/artapprovallist")
    }


}