import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreCartService } from 'src/app/core/services/storeCart.service';
import Swal from 'sweetalert2'
declare var $ : any;

@Component({
  selector: 'app-verify-art',
  templateUrl: './verify-art.component.html',
  styleUrls: ['./verify-art.component.scss']
})
export class VerifyArtComponent implements OnInit {
  artId: any;
  storeId: any;
  artQueueId:any;
  designedUrl:any;
  designImgList: any[] = [];
  artImgList: any[] = [];
  productList = []
  rejectionReason: any = "";
  rejectionCode: any = 0;
  rejectionBody: any = {};
  reasonList: any[] = [];
  isInteracted = false;
  reasonIds: any[] = [];
  isRejected = false;
  userAgreed = false;

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private storeCartService: StoreCartService
  ) { }

  ngOnInit() {
    this.artId = this.route.snapshot.params['artId'];
    this.artQueueId = this.route.snapshot.params['artQueueId'];
    this.designedUrl = this.route.snapshot.queryParams['files'];
    this.getImages();
    this.getArtImgList();
    this.getCustomerReasonList();
  }

  getImages(){
    let imgTempList = this.designedUrl;
    this.storeService.getArtDesignImagesForVerification(imgTempList).subscribe(res => {
      this.designImgList = res.data;
    },
    error =>{
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  getArtImgList () {
    this.storeService.getArtImgList(this.artQueueId, this.artId).subscribe(res => {
      if (res) {
        this.artImgList = res.data;
        if(this.artImgList[0].artMappingStatus == 6){
          this.isInteracted = true;
          Swal.fire({
            title: "Approved",
            text: "Art Already Approved",
            icon: "success",
          }).then(() => {
            // this.router.navigate([' ']);
          })
        }
        else if (this.artImgList[0].artMappingStatus === 11) {
          this.isInteracted = true;
          Swal.fire({
            title: "Rejected",
            text: "Art Already Rejected",
            icon: "success",
          }).then(() => {
            // this.router.navigate([' ']);
          })
        }
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }
  getCustomerReasonList () {
    this.storeService.getCustomerReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  toggleModal(){
    $('#rejectionModal').modal('toggle');
  }

  updateStatus (value) {
    if (value == 11) {
      this.isRejected = true;
      this.toggleModal();
    } else {
      this.isRejected = false;
      this.toggleModal();
    }
  }

  onUserAgreementChecked(event){
    this.userAgreed = event.srcElement.checked ? true : false;    
  }

  checkUserAgreement(){
    if(this.userAgreed){
      this.toggleModal();
      this.submit(6);
    }
    else{
      Swal.fire({
        title: "Warning",
        text: "Please read and accept the terms.",
        icon: "error",
      });
    }
  }

  confirmRejection (rejectionReason, rejectionCode) {
    let reason = '';
    this.reasonIds.forEach((item)=>{
      reason +=  item + ',';
    });
    reason = reason.slice(0, -1);

    this.rejectionBody = {
      rejectionReasonIds: reason,
      rejectionReason: rejectionReason
    }
    this.toggleModal();
    this.submit(11);
  }

  cancelRejection () {
    this.rejectionBody = {};
    this.rejectionCode = 0;
    this.rejectionReason = "";
    this.toggleModal();
  }

  reasonSelected (event, item) {
    if (event.srcElement.checked) {
      this.reasonIds.push(Number(item.id));
    } else {
      const index = this.reasonIds.indexOf(item.id);
      if (index > -1) {
        this.reasonIds.splice(index, 1);
      }
    }
  }

  submit (value) {
    if(value == 6)
    this.rejectionBody = null;

    this.storeService.userVerifyArtQueue(this.artQueueId,this.artId, value,this.rejectionBody).subscribe((response) => {
     
      if (response.statusCode == 200) {
        if (value === 6) {
          Swal.fire({
            title: "Approved",
            text: "Art Approval successfully!",
            icon: "success",
          }).then(() => {
            this.isInteracted = true;
            // this.router.navigate([' ']);
          })
        } else if (value === 11) {
          Swal.fire({
            title: "Rejected",
            text: "Art Rejected successfully!",
            icon: "success",
          }).then(() => {
            this.isInteracted = true;
            // this.router.navigate([' ']);
          })
        }
      }
    });
  }
}
