import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { saveAs } from "file-saver";

declare var $: any;

@Component({
  selector: 'app-order-art-detail',
  templateUrl: './order-art-detail.component.html',
  styleUrls: ['./order-art-detail.component.scss']
})
export class OrderArtDetailComponent implements OnInit {

  mappingId: any;
  formData: FormData = new FormData();
  artId: any;
  artImgList: any[] = [];
  artApprovalObj: any;
  notes: String;
  orderArtList: any[] = [];
  personalizationDetails: any;

  constructor(
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit () {
    this.artApprovalObj = JSON.parse(localStorage.getItem('artApprovalObj'));
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

  updateArtRequest () {
    var rejectedCount = 0;
    var imgObj = {
      artId: 0,
      artMappingId: 0,
      isApproved: false,
      note: ""
    };
    var imgList = [];

    this.artImgList.forEach((item) => {
      imgObj.artId = item.id;
      imgObj.artMappingId = item.artMappingId;
      if (item.isApproved == false)
        rejectedCount = rejectedCount + 1;
      imgObj.isApproved = item.isApproved;
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
        this.router.navigateByUrl('/artdirector/downloadart');
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  downloadImg (url) {
    var urlSplit = url.split('/');
    saveAs(url, urlSplit[urlSplit.length - 1]);
  }

  changeStatus (notes, value, index) {
    this.artImgList[index].note = notes;
    this.artImgList[index].isApproved = value;
    this.artImgList[index].updated = true;
    if (value == false)
      this.artImgList[index].isDigitized = false;
  }

  openPersonalizationDetails (data) {
    this.personalizationDetails = data;
    $('#personalizationDetails').modal('show');
  }

  closeMOdal () {
    this.personalizationDetails = [];
    $('#personalizationDetails').modal('hide');
  }

}
