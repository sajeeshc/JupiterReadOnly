import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from "file-saver";
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

declare var $: any;

@Component({
  selector: 'app-art-img-list',
  templateUrl: './art-img-list.component.html',
  styleUrls: ['./art-img-list.component.scss']
})
export class ArtImgListComponent implements OnInit {

  mappingId: any;
  formData: FormData = new FormData();


  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
    private router: Router) { }

  artId: any;
  artImgList: any[] = [];
  artReqObj: any;
  positionArray: any[] = [];
  serviceArray: any[] = [];
  sizeArray: any[] = [];
  colorList: any[] = [];
  inkColors = []
  uploadForm: FormGroup;
  selectedImageFileName: any = "";
  selectedPdfFileName: any = "";
  uploadedImageFile: any;
  uploadedPdfFile: any;
  user: any;
  reasonList: any[] = [];

  ngOnInit () {
    this.commonService.setPageHeader("Store Art List")
    this.artId = this.route.snapshot.params['artId'];
    this.artReqObj = JSON.parse(localStorage.getItem('artReqObj'));
    this.getArtImgList();
    this.getCustomerReasonList();
    this.createUploadForm();
    this.getAvailableProductSizes();
    this.getProductLocations();
    this.getcolorList();
    this.getAvailableStoreServices();
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  downloadImg (url) {
    saveAs(url,"art."+url.split(".").pop());
  }

  createUploadForm () {
    this.uploadForm = this.formBuilder.group({
      noOfColors: [''],
      artServiceTypeId: [''],
      artSizeId: [''],
      artPositionId: [''],
      mappingId: [''],
      colorIdList: ['']
    })
  }

  getArtImgList () {
    this.storeService.getArtImgList(this.artId, 0).subscribe(res => {
      if (res) {
        this.artImgList = res.data
        this.updateReasonsAndComment();
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

  updateReasonsAndComment(){
    this.artImgList.forEach((item)=>{
      if(item.customerRejectionReasonIds != '' && item.customerRejectionReasonIds != null){
        item.artReasons = item.customerRejectionReasonIds.split(',').map(Number);
      }
    });
  }

  selectImageFile (event) {
    let selectedFiles = event.target.files;
    this.uploadedImageFile = selectedFiles.item(0);
    this.selectedImageFileName = this.uploadedImageFile.name;
    event.target.value = '';
  }

  selectPdfFile (event) {
    let selectedFiles = event.target.files;
    this.uploadedPdfFile = selectedFiles.item(0);
    this.selectedPdfFileName = this.uploadedPdfFile.name;
    event.target.value = '';
  }

  uploadImage () {
    if (this.selectedImageFileName == "") {
      this.commonService.openErrorSnackBar("Please upload an image file.", "");
    } else if (this.selectedPdfFileName == "") {
      this.commonService.openErrorSnackBar("Please upload a PDF file.", "");
    } else if(this.uploadForm.controls['colorIdList'].value.length == 0){
      this.commonService.openErrorSnackBar("Please select colors", "");
    } else if(!this.uploadForm.controls['artSizeId'].value){
      this.commonService.openErrorSnackBar("Please select a size", "");
    } else if(this.uploadForm.controls['noOfColors'].value != this.uploadForm.controls['colorIdList'].value.length){
      this.commonService.openErrorSnackBar("Color count and selected number of colors doesn't match", "");
    } else if(!this.uploadForm.controls['noOfColors'].value){
      this.commonService.openErrorSnackBar("Please enter number of colors", "");
    } else {
      let colorList = (this.uploadForm.controls['colorIdList'].value).toString();
      let obj = {
        noOfColors: this.uploadForm.controls['noOfColors'].value,
        artServiceTypeId: this.uploadForm.controls['artServiceTypeId'].value,
        artSizeId: this.uploadForm.controls['artSizeId'].value,
        artPositionId: this.uploadForm.controls['artPositionId'].value,
        colors: colorList
      }
      this.mappingId = this.uploadForm.controls['mappingId'].value;

      this.formData = new FormData();
      this.formData.append("artMetaDataJson", JSON.stringify(obj));
      this.formData.append("file", this.uploadedImageFile);
      this.formData.append("pdfFile", this.uploadedPdfFile);
      // this.formData.append("name", this.uploadedImageFile.name);

      this.storeService.uploadImgFile(this.formData, this.mappingId).subscribe(res => {
        if (res) {
          this.commonService.openSuccessSnackBar(res.message, "");
          this.getArtImgList();
          $('#uploadModal').modal('hide');
          this.createUploadForm();
          this.selectedImageFileName = "";
          this.selectedPdfFileName = "";
        }
      }, (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
    }
  }

  openUploadDataModal (mappingId, i) {
    this.uploadForm.controls['mappingId'].setValue(mappingId);
    let selectedImg = this.artImgList[i];
    if (selectedImg.metaData != null) {
      let colorList = selectedImg.metaData.colors;
      let colorArray = colorList.split(",").map(color=>{return color.trim()});
      this.uploadForm.controls['noOfColors'].setValue(selectedImg.metaData.noOfColors);
      this.uploadForm.controls['artServiceTypeId'].setValue(selectedImg.metaData.artServiceTypeId);
      this.uploadForm.controls['artSizeId'].setValue(selectedImg.metaData.artSizeId);
      this.uploadForm.controls['artPositionId'].setValue(selectedImg.metaData.artPositionId);
      this.uploadForm.controls['colorIdList'].setValue(colorArray);
    }
    this.selectedImageFileName = "";
    this.selectedPdfFileName = "";
    this.setColorByService()
    $('#uploadModal').modal('show');
  }

  updateArtRequest () {
    let allActive = true;
    for (let i = 0; i < this.artImgList.length; i++) {
      if (this.artImgList[i].artMappingStatus != 6) {
        if (!this.artImgList[i].isDigitized) {
          allActive = false;
        }
        else {
          this.artImgList[i].artMappingStatus = 4;
        }
      }
    }
    if (allActive) {
      let teamStoreId = Number(localStorage.getItem("teamStoreId"))
      let artQueueStatus = 0
      if (!teamStoreId) {
        artQueueStatus = 4;
      } else {
        artQueueStatus = 9;
      }
      let artQueueId = this.artId
      let data = {
        artMappings:this.artImgList,
        artQueueStatus,
        artQueueId
      }
      // this.artReqObj.artQueueId = this.artReqObj.id;
      this.storeService.updateArtQueueStatusWithImg(data).subscribe(res => {
        if (res) {
          this.commonService.openSuccessSnackBar(res.message, "");
          this.router.navigateByUrl('/storebuilder/storerequest');
          // if (this.artReqObj.teamStoreId == 0) {
          //   this.router.navigateByUrl('/storebuilder/artlist')
          // } else {
          //   if (this.user.roles[0].id == 3) {
          //     // localStorage.setItem("teamStoreId", this.artReqObj.teamStoreId);
          //     // this.setHeader('Store Creation');
          //     this.router.navigateByUrl('/storebuilder/storerequest');
          //   } else if (this.user.roles[0].id == 5) {
          //     this.router.navigateByUrl('/storebuilder/artlist')
          //   }
          // }
        }
      }, (error) => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
    } else {
      this.commonService.openErrorSnackBar("Please make all art files production ready before continuing.", "");
    }


  }

  getAvailableStoreServices () {
    this.storeService.getAvailableStoreServices().subscribe(
      (response) => {
        this.serviceArray = response.data;
      },
      (error) => {

      }
    );
  }

  getProductLocations () {
    this.storeService.getAllLocations().subscribe(
      (response) => {
        this.positionArray = response.data;
      },
      (error) => {
        this.positionArray = [];
      }
    );
  }

  getAvailableProductSizes () {
    this.storeService.getAvailableProductSizes().subscribe(
      (response) => {
        this.sizeArray = response.designsizes;
      },
      (error) => {

      }
    );
  }

  getcolorList () {
    this.storeService.getAvailableInkColors({internal:true}).subscribe(
      (response) => {
        this.inkColors = response.data;
      }
    );
  }

  closeModal () {
    this.createUploadForm();
    $('#uploadModal').modal('toggle');
  }

  setHeader (header) {
    this.commonService.setPageHeader(header);
  }

  setColorByService(){
    let serviceId = this.uploadForm.value.artServiceTypeId
    this.colorList = this.inkColors.find(inkColor => inkColor.serviceId == serviceId).colors
  }
}
