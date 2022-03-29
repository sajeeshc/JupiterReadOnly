import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from "file-saver";
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

declare var $: any;

@Component({
  selector: 'app-art-approval-list',
  templateUrl: './art-approval-list.component.html',
  styleUrls: ['./art-approval-list.component.scss']
})
export class ArtApprovalListComponent implements OnInit {
  mappingId: any;
  formData: FormData = new FormData();
  artId: any;
  artImgList: any[] = [];
  artApprovalObj: any;
  notes: String;
  user: any;
  reasonList:any[];

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit () {
    this.artApprovalObj = JSON.parse(localStorage.getItem('artApprovalObj'));
    this.getArtImgList();
    this.getReasonList();
    this.user = JSON.parse(localStorage.getItem('user'));
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

  getReasonList () {
    this.storeService.getReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  updateArtRequest () {
    var approvedCount = 0;
    var imgObj = {
      artId: 0,
      artMappingId: 0,
      isApproved: false,
      note: "",
      artMappingStatus: 4
    };
    var imgList = [];

    this.artImgList.forEach((item) => {
      imgObj.artId = item.id;
      imgObj.artMappingId = item.artMappingId;
      imgObj.isApproved = item.isApproved;
      imgObj.note = item.note;
      imgObj.artMappingStatus = item.artMappingStatus;
      imgList.push(imgObj);
      if (item.isApproved == true)
        approvedCount = approvedCount + 1;
    })

    this.artApprovalObj.artQueueStatus = approvedCount == this.artImgList.length ? 6 : 5;


    var reqObj = {
      artQueueId: this.artApprovalObj.artQueueId,
      artQueueStatus: this.artApprovalObj.artQueueStatus,
      artMappings: this.artImgList
    };

    this.storeService.updateArtQueueStatusWithImg(reqObj).subscribe(res => {
      if (res) {
        this.commonService.openSuccessSnackBar(res.message, "");
        // this.commonService.setPageHeader('Manage Created Store');
        this.router.navigateByUrl('artadmin/artpendingapproval');

        // else{
        //   if (this.user.roles[0].id == 7) {
        //     this.commonService.setPageHeader('Store Management');
        //     this.router.navigateByUrl('/storemanager/storelist/' + 0);
        //   } else if (this.user.roles[0].id == 4) {
        //     this.router.navigateByUrl('/artprocess/artlist')
        //   }
        // }        
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
    this.artImgList[index].isDigitized = false == value ? false : true;
    this.artImgList[index].artMappingStatus = false == value ? 5 : 6;
  }

}
