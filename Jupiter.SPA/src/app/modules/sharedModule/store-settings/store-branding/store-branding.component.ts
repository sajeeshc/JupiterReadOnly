import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder } from "@angular/forms";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { StoredetailsService } from "src/app/core/services/storedetails.service";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";

declare var $: any;

@Component({
  selector: "app-store-branding",
  templateUrl: "./store-branding.component.html",
  styleUrls: ["./store-branding.component.scss"],
})
export class StoreBrandingComponent implements OnInit {
  storeBrandingGroup: FormGroup;
  logoToUpload: File = null;
  iconToUpload: File = null;
  imageToUpload: File = null;

  logoStatus: string = "2";
  iconStatus: string = "2";
  imageStatus: string = "2";

  icon: File = null;
  teamStoreId: number;

  constructor(
    private formBuilder: FormBuilder,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService : CommonService
  ) {}

  ngOnInit() {
    this.teamStoreId=parseInt(localStorage.getItem("teamStoreId"));
    this.getTeamStore(this.teamStoreId);
    this.setUpStoreBrandingFormGroup();
    
  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      if(teamStore.logo!=null){
        this.logoToUpload = new File([""], "");
        $("#logo").attr("src",teamStore.logo);
        $('#logoBtn').hide();
      }
      if(teamStore.icon!=null){
        this.iconToUpload = new File([""], "");;
        $("#icon").attr("src",teamStore.icon);
        $('#iconBtn').hide();
      }
      if(teamStore.previewImage!=null){
        this.imageToUpload = new File([""], "");;
        $("#image").attr("src",teamStore.previewImage);
        $('#imgBtn').hide();
      }

    });
  }

  setUpStoreBrandingFormGroup() {
    this.storeBrandingGroup = this.formBuilder.group({});
  }

  handleImageInput(files: FileList, type: string) {
    switch (type) {
      case "logo":
        this.logoToUpload = files.item(0);
        this.showImg(files.item(0), "logo");
        this.logoStatus = "1";
        $('#logoBtn').hide();
        break;
      case "icon":
        this.iconToUpload = files.item(0);
        this.showImg(files.item(0), "icon");
        this.iconStatus = "1";
        $('#iconBtn').hide();
        break;
      case "image":
        this.imageToUpload = files.item(0);
        this.showImg(files.item(0), "image");
        this.imageStatus = "1";
        $('#imgBtn').hide();
        break;
    }
  }

  showImg(file: any, type: string) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (_event) => {
      switch (type) {
        case "logo":
          $("#logo").attr("src", reader.result);
          break;
        case "icon":
          $("#icon").attr("src", reader.result);
          break;
        case "image":
          $("#image").attr("src", reader.result);
          break;
      }
    };
  }

  removeImg(type: string) {
    switch (type) {
      case "logo":
        this.logoToUpload = null;
        this.logoStatus = "0";
        $('#logoBtn').show();
        break;
      case "icon":
        this.iconToUpload = null;
        this.iconStatus = "0";
        $('#iconBtn').show();
        break;
      case "image":
        this.imageToUpload = null;
        this.imageStatus = "0";
        $('#imgBtn').show();
        break;
    }
  }

  save() {
    const formData = new FormData();
    if (this.logoStatus != "0" && this.logoStatus != "2") {
      formData.append("storeLogo", this.logoToUpload);
    }
    if (this.iconStatus != "0" && this.iconStatus != "2") {
      formData.append("storeIcon", this.iconToUpload);
    }
    if (this.imageStatus != "0" && this.imageStatus != "2") {
      formData.append("storePreviewImage", this.imageToUpload);
    }
    formData.append(
      "fileStatus",
      JSON.stringify({
        storeLogoStatus: this.logoStatus,
        storeIconStatus: this.iconStatus,
        storePreviewImageStatus: this.imageStatus,
      })
    );

    this.storedetailsService
      .updateStoreBrandings(formData, this.teamStoreId)
      .subscribe(
        (response) => {
          if(response.status==1){
            this.commonService.openSuccessSnackBar(response.message,'');
          }
          else{
           this.commonService.openErrorSnackBar(response.message,'');
          }
          //todo
        },
        (error) => {
        }
      );
  }
}
