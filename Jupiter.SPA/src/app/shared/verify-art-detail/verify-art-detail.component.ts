import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-verify-art-detail',
  templateUrl: './verify-art-detail.component.html',
  styleUrls: ['./verify-art-detail.component.scss']
})
export class VerifyArtDetailComponent implements OnInit {

  artId: any;
  artQueueId: any;
  designedId: any;
  orderId: any;
  slideIndex = 1;
  product: any = [];
  userAgreed = false;
  userReadyToApprove: false;
  rejectionBody: any = {};
  isRejected = false;
  rejectionReason: any = "";
  rejectionCode: any = 0;
  reasonList: any[] = [];
  reasonIds: any[] = [];
  todaysDate = new Date();

  constructor(private storeService: StoreService,
    private route: ActivatedRoute,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getDataFromRoute();
    this.getProductData();
    this.getCustomerReasonList();
    //this.showSlides(this.slideIndex);
  }

  getDataFromRoute() {
    this.artId = this.route.snapshot.params['artId'];
    this.artQueueId = this.route.snapshot.params['artQueueId'];
    this.designedId = this.route.snapshot.queryParams['files'];
    this.orderId = this.route.snapshot.params['orderId'];
  }

  onUserAgreementChecked(event) {
    this.userAgreed = event.srcElement.checked ? true : false;
  }

  getCustomerReasonList() {
    this.storeService.getCustomerReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  getProductData() {
    this.storeService.getUserArtVerificationDetails(this.artQueueId, this.artId, this.designedId, this.orderId).subscribe(res => {
      this.product = res.data;
      this.showSlides(1)
      // this.plusSlides(1)
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }

  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    var i;

    var slides = document.getElementsByClassName("mySlides");
    // var dots = document.getElementsByClassName("dot");

    if (n > slides.length) {
      this.slideIndex = 1;
    }

    if (n < 1) {
      this.slideIndex = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
      let s = slides[i] as HTMLElement
      s.style.display = "none";
    }
    // for (i = 0; i < dots.length; i++) {
    //     dots[i].className = dots[i].className.replace("active", "");
    // }
    let curSlide = slides[this.slideIndex - 1] as HTMLElement
    curSlide.style.display = "block";
    curSlide.style.opacity = '1'
    //dots[this.slideIndex-1].className += "active";
  }

  checkUserAgreement() {
    if (this.userAgreed) {
      this.toggleModal();
      this.submit(6);
    }
    else {
      Swal.fire({
        title: "Warning",
        text: "Please read and accept the terms.",
        icon: "error",
      });
    }
  }

  updateStatus(value) {
    if (value == 11) {
      this.isRejected = true;
      this.toggleModal();
    } else {
      this.submit(6)
    }
  }

  toggleModal() {
    $('#rejectionModal').modal('toggle');
  }

  confirmRejection(rejectionReason, rejectionCode) {
    let reason = '';
    this.reasonIds.forEach((item) => {
      reason += item + ',';
    });
    reason = reason.slice(0, -1);

    this.rejectionBody = {
      rejectionReasonIds: reason,
      rejectionReason: rejectionReason
    }
    this.toggleModal();
    this.submit(11);
  }

  cancelRejection() {
    this.rejectionBody = {};
    this.rejectionCode = 0;
    this.rejectionReason = "";
    this.toggleModal();
  }

  reasonSelected(event, item) {
    if (event.srcElement.checked) {
      this.reasonIds.push(Number(item.id));
    } else {
      const index = this.reasonIds.indexOf(item.id);
      if (index > -1) {
        this.reasonIds.splice(index, 1);
      }
    }
  }

  submit(value) {
    if (this.userAgreed) {
      let name = $('#name').val();
      let signature = $('#signature').val();

      if ((name != null && name != '') && (signature != null && signature != '')) {
        if (value == 6)
          this.rejectionBody = null;

        this.storeService.userVerifyArtQueue(this.artQueueId, this.artId, value, this.rejectionBody).subscribe((response) => {

          if (response.statusCode == 200) {
            if (value === 6) {
              Swal.fire({
                title: "Approved",
                text: "Art Approval successfully!",
                icon: "success",
              }).then(() => {
                // this.router.navigate([' ']);
              })
            } else if (value === 11) {
              Swal.fire({
                title: "Rejected",
                text: "Art Rejected successfully!",
                icon: "success",
              }).then(() => {
                
                // this.router.navigate([' ']);
              })
            }
          }
        });
      }
      else {
        Swal.fire({
          title: "Warning",
          text: "Please enter name and signature to continue",
          icon: "error",
        });
      }
    }
    else {
      Swal.fire({
        title: "Warning",
        text: "Please read and accept the terms.",
        icon: "error",
      });
    }

  }

}
