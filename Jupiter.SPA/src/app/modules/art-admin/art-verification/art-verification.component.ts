import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from "file-saver";
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-art-verification',
  templateUrl: './art-verification.component.html',
  styleUrls: ['./art-verification.component.scss']
})
export class ArtVerificationComponent implements OnInit {

  mappingId: any;
  formData: FormData = new FormData();
  artId: any;
  artImgList: any[] = [];
  reasonList: any[] = [];
  customerReasonList: any[] = [];
  artApprovalObj: any;
  notes: String;
  user: any;
  reasonIds: any[] = [];
  artReasonIds = '1,2,4,5';

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit () {
    this.artApprovalObj = JSON.parse(localStorage.getItem('artApprovalObj'));
    this.getReasonList();
    this.getCustomerReasonList();
    this.getArtImgList();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  getReasonList () {
    this.storeService.getReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  getCustomerReasonList () {
    this.storeService.getCustomerReasonList().subscribe(response => {
      if (response.data != null) {
        this.customerReasonList = response.data;
      }
    });
  }

  getArtImgList () {
    this.storeService.getArtImgList(this.artApprovalObj.id,0).subscribe(res => {
      if (res) {
        this.artImgList = res.data;
        this.updateReasonsAndComment();
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  updateReasonsAndComment(){
    this.artImgList.forEach((item)=>{
      if(item.customerRejectionReasonIds != '' && item.customerRejectionReasonIds != null){
        item.artReasons = item.customerRejectionReasonIds.split(',').map(Number);
      }
    });
  }

  updateArtRequest () {
    let approvedCount = 0;
    let imgObj = {
      artId: 0,
      artMappingId: 0,
      isApproved: false,
      note: "",
      artReasonId: null,
      artMappingStatus: 4
    };
    let imgList = [];

    this.artImgList.forEach((item) => {
      imgObj.artId = item.id;
      imgObj.artMappingId = item.artMappingId;
      imgObj.isApproved = item.artMappingStatus == 10 ? true : false;//todo status
      item.isApproved = item.artMappingStatus == 10 ? true : false;//todo status
      imgObj.artReasonId = item.artReasonId;
      imgObj.note = item.note;
      imgObj.artMappingStatus = item.artMappingStatus;
      imgList.push(JSON.parse(JSON.stringify(imgObj)));
      if (item.isApproved == true)
        approvedCount = approvedCount + 1;
    })

    this.artApprovalObj.artQueueStatus = approvedCount == this.artImgList.length ? 10 : 5;

    let reqObj = {
      artQueueId: this.artApprovalObj.id,
      artQueueStatus: this.artApprovalObj.artQueueStatus,
      artMappings: this.artImgList
    };

    this.storeService.updateArtQueueStatusWithImg(reqObj).subscribe(res => {
      if (res) {
        this.commonService.openSuccessSnackBar(res.message, "");
        this.router.navigateByUrl('artadmin/artpendingapproval');
        // this.commonService.setPageHeader('Manage Created Store');
        // if (this.user.roles[0].id == 7) {
        //   this.commonService.setPageHeader('Store Management');
        //   this.router.navigateByUrl('/storemanager/storelist/' + 0);
        // } else if (this.user.roles[0].id == 4) {
        //   this.router.navigateByUrl('/storebuilder/artlist')
        // }
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  downloadImg (url) {
    let urlSplit = url.split('/');
    saveAs(url, urlSplit[urlSplit.length - 1]);
  }


  changeStatus (notes, artReasonId, value, index) {
    this.artImgList[index].artReasonId = artReasonId;
    this.artImgList[index].note = notes;
    this.artImgList[index].artMappingStatus = value != false ? 10 : 5;//todo status
    this.artImgList[index].updated = true;
    this.artImgList[index].isDigitized = value;
  }
}
