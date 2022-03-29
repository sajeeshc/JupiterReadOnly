import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-view',
  templateUrl: './view-art.component.html',
  styleUrls: ['./view-art.component.scss']
})
export class ViewArtComponent implements OnInit {

  artImgList: any[] = [];
  artApprovalObj: any;

  constructor(
    private commonService: CommonService,
    private storeService: StoreService
  ) { }

  ngOnInit () {
    this.artApprovalObj = JSON.parse(localStorage.getItem('artApprovalObj'));
    this.getArtImgList();
  }

  getArtImgList () {
    this.storeService.getArtImgList(this.artApprovalObj.id,0).subscribe(res => {
      if (res) {
        this.artImgList = res.data;
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }
}
