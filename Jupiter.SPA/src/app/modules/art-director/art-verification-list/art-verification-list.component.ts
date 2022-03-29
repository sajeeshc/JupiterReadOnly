
import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { saveAs } from "file-saver";

declare var $: any;

@Component({
  selector: 'app-art-verification-list',
  templateUrl: './art-verification-list.component.html',
  styleUrls: ['./art-verification-list.component.scss']
})
export class ArtVerificationListComponent implements OnInit {

  mappingId: any;
  formData: FormData = new FormData();


  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router) { }

  artId: any;
  artImgList: any[] = [];
  artApprovalObj: any;
  notes: String;
  orderArtList: any[] = [];
  reasonList:any[];

  ngOnInit () {
    this.artApprovalObj = JSON.parse(localStorage.getItem('artApprovalObj'));
    this.getArtImgList();
    this.getReasonList();
    this.getOrderArtDetails();
  }


  getOrderArtDetails () {
    this.storeService.getOrderArtDetails(this.artApprovalObj.id).subscribe(res => {
      if (res) {
        this.orderArtList = res.data;
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  getReasonList () {
    this.storeService.getReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  getArtImgList () {
    this.storeService.getArtImgList(this.artApprovalObj.id, this.artApprovalObj.artId).subscribe(res => {
      if (res) {
        this.artImgList = res.data;
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  updateArtRequest () {
    var rejectedCount = 0;
    var imgObj = {
      artId: 0,
      artMappingId: 0,
      isApproved: false,
      note: "",
      artReasonId: null,
    };
    var imgList = [];

    this.artImgList.forEach((item) => {
      imgObj.artReasonId = item.artReasonId;
      imgObj.artId = item.id;
      imgObj.artMappingId = item.artMappingId;
      item.isApproved = item.artMappingStatus == 7 ? false : item.isApproved;
      if (imgObj.isApproved == false)
        rejectedCount = rejectedCount + 1;
      imgObj.note = item.note;
      imgList.push(imgObj);
    })


    if (rejectedCount > 0) {
      this.artApprovalObj.artQueueStatus = 7;
    }
    else {
      return;
    }

    var reqObj = {
      artQueueId: this.artApprovalObj.id,
      artQueueStatus: this.artApprovalObj.artQueueStatus,
      artMappings: this.artImgList
    };

    this.storeService.updateArtQueueStatusWithImg(reqObj).subscribe(res => {
      if (res) {
        this.commonService.openSuccessSnackBar(res.message, "");
        this.router.navigateByUrl('/artdirector/orderArtList');
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  downloadImg (url, type, id) {
    var urlSplit = url.split('/');
    saveAs(url, urlSplit[urlSplit.length - 1]);
    if (type == 'pdf') {
      this.storeService.updatePdfDownloadStatus(this.artApprovalObj.orderArtMappingId).subscribe(res => {
        if (res) {
          this.getArtImgList();
        }
      }, (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
    }
  }

  // downloadAi (url) {
  //   saveAs(url, `img.png`);
  // }

  // downloadPdf (url) {
  //   saveAs(url, `img.png`);
  // }

  changeStatus (notes, value, index, artReasonId) {
    this.artImgList[index].artReasonId = artReasonId;   
    this.artImgList[index].note = notes;
    this.artImgList[index].artMappingStatus = value != false ? 6 : 7;
    this.artImgList[index].updated = true;
    this.artImgList[index].isDigitized = value;
  }
}
