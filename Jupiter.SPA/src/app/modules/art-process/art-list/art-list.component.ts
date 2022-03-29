import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { saveAs } from "file-saver";

declare var $: any;

@Component({
  selector: 'app-art-list',
  templateUrl: './art-list.component.html',
  styleUrls: ['./art-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ArtListComponent implements OnInit {
  dataSource: any;
  columnsToDisplay = ['artTask', 'contactName', 'orderId', 'artCount', 'dueDate', 'dueTime', 'status'];
  //columnsToDisplay = ['name', 'contactName', 'storeId', 'accountManager', 'stage'];
  expandedElement: any = null;
  artList: any[] = [];
  user: any;

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
    // this.getStoreRequestList();
    this.getArtList();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  verifyStoreBuild (storeId) {
    this.router.navigateByUrl('/storemanager/verifystore/' + storeId + '/0');
  }

  updateStoreStage (storeId, stage) {
    this.storeService.updateStoreStatus(storeId, stage).subscribe(
      (response) => {
        this.commonService.openSuccessSnackBar('Store published successfully', '');
      },
      (error) => {
        this.commonService.openErrorSnackBar('Failed to publish store', '');
      }
    );
  }

  getArtList () {
    this.storeService.getArtList({startDate:'',endDate:'',type:'3,5,11,7',artist:'',artType:'',serviceId:0}).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }

  extendStoreClosureDate (storeId) {
    console.log(storeId);
  }

  openArtList (item: any) {
    localStorage.setItem('artReqObj', JSON.stringify(item));
    if (this.user.roles[0].id == 3) {
      this.router.navigateByUrl("/storebuilder/artImglist/" + item.id)
    } else if (this.user.roles[0].id == 5) {
      this.router.navigateByUrl("/artprocess/artImglist/" + item.id)
    }
  }

  downloadImg (url) {
    saveAs(url, `img.png`);
  }
}
