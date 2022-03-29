import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StoredetailsService } from '../../core/services/storedetails.service';
import { StoreService } from 'src/app/core/services/store.service';
import Swal from 'sweetalert2'
import { FormBuilder, FormGroup } from '@angular/forms';
declare var $: any;

@Component({
  selector: 'app-verify-teamstore',
  templateUrl: './verify-teamstore.component.html',
  styleUrls: ['./verify-teamstore.component.scss']
})
export class VerifyTeamstoreComponent implements OnInit {
  teamStoreId: any;
  layoutData: any;
  selectedComponent: any = 0;
  rejectionReason: any = "";
  rejectionCode: any = 0;
  rejectionBody: any = {};
  reasonList: any[] = [];
  isInteracted = false;
  storeRejectionForm: FormGroup;
  rejectionCodes = [];
  loading = false
  constructor(
    private storeDetailsService: StoredetailsService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.teamStoreId = this.route.snapshot.params['storeId'];
    this.createStoreRejectionForm();
    this.getLayoutSettings();
    this.getReasonList();
    this.getStoreRejectionCodes();
  }

  createStoreRejectionForm() {
    this.storeRejectionForm = this.formBuilder.group({
      amRejectionCodes: '',
      amRejectionText: ''
    });
  }

  getLayoutSettings() {
    this.loading = true
    this.storeDetailsService.getLayoutSettings(this.teamStoreId).subscribe((response) => {
      this.selectedComponent = response.data.layout.componentId;
      this.layoutData = JSON.parse(response.data.style);
      this.layoutData["closeDate"] = response.data.closeDate
      this.layoutData["disclaimer"] = response.data.disclaimer
      this.loading = false
    }, (err)=>{
      this.loading = false
      this.layoutData = null
    });
  }

  getStoreRejectionCodes() {
    this.storeService.getTeamStoreRejectionCodes().subscribe(
      (response) => {
        this.rejectionCodes = response.data;
      },
      (error) => {

      }
    );
  }

  isStoreVerified(value) {
    if (value == 2) {
      this.isInteracted = true;
      Swal.fire({
        title: "Approved",
        text: "Store Already Approved",
        icon: "success",
      })
    }
    else if (value == 1) {
      this.isInteracted = true;
      Swal.fire({
        title: "Rejected",
        text: "Store Already Rejected",
        icon: "success",
      })
    }
  }

  getReasonList() {
    this.storeService.getReasonList().subscribe(response => {
      if (response.data != null) {
        this.reasonList = response.data;
      }
    });
  }

  updateStatus(value) {
    if (value == 1) {
      $('#rejectionModal').modal('show');
    } else {
      this.submit(value);
    }
  }

  confirmRejection() {
    this.rejectionBody = {
      rejectionReason: this.storeRejectionForm.controls['amRejectionText'].value,
      rejectionCode: this.storeRejectionForm.controls['amRejectionCodes'].value.toString()
    }
    this.submit(1);
  }

  closeStoreModal() {
    $('#addArtModal').modal('hide');
  }

  cancelRejection() {
    this.rejectionBody = {};
    this.rejectionCode = 0;
    this.rejectionReason = "";
    $('#rejectStoreModal').modal('hide');
  }

  submit(value) {
    this.storeService.userVerifyTeamStore(this.teamStoreId, value, this.rejectionBody).subscribe((response) => {
      this.cancelRejection();
      if (response.statusCode == 200) {
        if (value === 2) {
          Swal.fire({
            title: "Approved",
            text: "You have approved the store build. Your account manager will contact you soon",
            icon: "success",
          }).then(() => {
            this.isInteracted = true;
            // this.router.navigate([' ']);
          })
        } else if (value === 1) {
          Swal.fire({
            title: "Rejected",
            text: "You have rejected the store build. Your account manager will contact you soon",
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
