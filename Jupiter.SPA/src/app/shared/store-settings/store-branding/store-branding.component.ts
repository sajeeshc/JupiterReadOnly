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

  imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'svg']
  icon: File = null;
  teamStoreId: number;
  noImagePlaceholder = "../../../../../assets/images/default-image.jpg"

  constructor(
    private formBuilder: FormBuilder,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService : CommonService,
    private router :  Router
  ) {}

  ngOnInit() {
    this.teamStoreId=parseInt(localStorage.getItem("teamStoreId"));
    this.getTeamStore(this.teamStoreId);
    this.setUpStoreBrandingFormGroup();
    console.log($('#logo').attr("src"))
  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      this.logoToUpload = new File([""], "");
      this.iconToUpload = new File([""], "");
      this.imageToUpload = new File([""], "");
      if(teamStore.logo!=null){
        $("#logo").attr("src",teamStore.logo);
        $('#logoBtn').hide();
      }else{
        $("#logo").attr("src",this.noImagePlaceholder);
      }
      if(teamStore.icon!=null){
        $("#icon").attr("src",teamStore.icon);
        $('#iconBtn').hide();
      }
      else{
        $("#icon").attr("src",this.noImagePlaceholder);
      }
      if(teamStore.previewImage!=null){
        $("#image").attr("src",teamStore.previewImage);
        $('#imgBtn').hide();
      }
      else{
        $("#image").attr("src",this.noImagePlaceholder);
      }

    });
  }

  setUpStoreBrandingFormGroup() {
    this.storeBrandingGroup = this.formBuilder.group({});
  }

  handleImageInput(files: FileList, type: string) {
    console.log(files.item(0).name.split('.').pop())
    if(this.imageFormats.includes(files.item(0).name.split('.').pop()) == false){
      this.commonService.openErrorSnackBar("Unsupported image format","")
      return
    } else if(files.item(0).size > 100000){
      this.commonService.openErrorSnackBar("File size exceeds 100kb","")
      return
    }
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
        $("#logo").attr("src",this.noImagePlaceholder);
        $('#logoBtn').show();
        break;
      case "icon":
        this.iconToUpload = null;
        this.iconStatus = "0";
        $("#icon").attr("src",this.noImagePlaceholder);
        $('#iconBtn').show();
        break;
      case "image":
        this.imageToUpload = null;
        this.imageStatus = "0";
        $("#image").attr("src",this.noImagePlaceholder);
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
            const url = this.commonService.createUrl(this.router.url, '/storenotifications', 2);
            this.router.navigateByUrl(url);
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
