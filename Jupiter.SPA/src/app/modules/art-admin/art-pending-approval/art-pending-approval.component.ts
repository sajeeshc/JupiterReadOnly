import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

declare var $: any;

@Component({
  selector: 'app-art-pending-approval',
  templateUrl: './art-pending-approval.component.html',
  styleUrls: ['./art-pending-approval.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class ArtPendingApprovalComponent implements OnInit {
  dataSource: any;
  columnsToDisplay = ['artTask', 'contactName', 'orderId', 'dueDate','dueTime', 'artist', 'symbol1'];
  expandedElement: any = null;
  artList: any[] = [];
  artImgList: any[] = [];
  selectedArtReqObj: any;
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
    this.getArtList();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getArtList () {
    var type = 4;//submitted list
    this.storeService.getArtList({startDate:'', endDate:'', type, artist:'', artType:'',serviceId:0}).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
      }
    });
  }

  viewArtList (item: any) {
    this.selectedArtReqObj = item;
    this.storeService.getArtImgList(item.id,0).subscribe(res => {
      if (res) {
        this.artImgList = res.data
        $('#artModal').modal('toggle');
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  } 

  updateArtRequest () {
    var approvedCount = 0;
    var imgObj = {
      artId: 0,
      artMappingId: 0,
      isApproved: false
    };
    var imgList = [];

    this.artImgList.forEach((item) => {
      if (item.isApproved) {
        approvedCount += 1;
        imgObj.artId = item.id,
          imgObj.artMappingId = item.artMappingId;
        imgObj.isApproved = item.isApproved;
        imgList.push(imgObj);
      }
      ;
    })

    if (approvedCount == this.artImgList.length) {
      this.selectedArtReqObj.artQueueStatus = 6;
    }
    else {
      this.selectedArtReqObj.artQueueStatus = 5;
    }

    var reqObj = {
      artQueueId: this.selectedArtReqObj.id,
      artQueueStatus: this.selectedArtReqObj.artQueueStatus,
      artMappings: imgList
    };

    this.storeService.updateArtQueueStatusWithImg(reqObj).subscribe(res => {
      if (res) {
        this.commonService.openSuccessSnackBar(res.message, "");
        $('#artModal').modal('toggle');
        this.getArtList();
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  closeModal () {
    $('#artModal').modal('toggle');
  }

  openArtApprovalList (item: any) {
    localStorage.setItem('artApprovalObj', JSON.stringify(item));
    if (this.user.roles[0].id == 7) {
      this.router.navigateByUrl("/storemanager/artapprovallist")
    } else if (this.user.roles[0].id == 4) {
      this.router.navigateByUrl("/artadmin/artverification")
    }
  }

  onChange (value: boolean, index) {
    if (value == true) {
      this.artImgList[index].isApproved = true;
    }
    else {
      this.artImgList[index].isApproved = false;
    }
  }

}
