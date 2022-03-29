import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-store-style-editor',
  templateUrl: './store-style-editor.component.html',
  styleUrls: ['./store-style-editor.component.scss']
})
export class StoreStyleEditorComponent implements OnInit {

  teamStoreId: any;
  array: any;
  selectedComponent: any;
  layoutData: any = {};
  logoHeight: any = 100;

  constructor(
    private storeDetailsService: StoredetailsService,
    private commonService: CommonService
  ) { }

  ngOnInit () {
    this.array = [{ "id": 1, "imageSrc": "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/cb8016c2-9ff2-4174-b654-afb5780b6ba6-637496776359248797.png", "componentId": 1, "componentName": "Component1" },
    { "id": 2, "imageSrc": "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/cb8016c2-9ff2-4174-b654-afb5780b6ba6-637496776359248797.png", "componentId": 2, "componentName": "Component2" }];

    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getLayoutSettings();
  }

  switchNav () {
    if (document.getElementById("mySidenav").style.width == "350px") {
      document.getElementById("mySidenav").style.width = "0";
    }
    else {
      document.getElementById("mySidenav").style.width = "350px";
    }
  }

  componentSelected (option) {
    this.selectedComponent = option.componentId;
    this.switchNav();
  }

  logoSelected (file) {
    let formData = new FormData();
    formData.append("file", file.item(0));
    this.storeDetailsService.uploadImage(formData)
      .subscribe(
        (response) => {
          this.layoutData.header.logoUrl = response.data;
        },
        (error) => {
        }
      );
  }

  getLayoutSettings () {
    this.storeDetailsService.getLayoutSettings(this.teamStoreId).subscribe((response) => {
      this.setLayoutData(response.data);
    },
      (error) => {
        this.setLayoutData(null);
      });
  }

  setLayoutData (data) {
    if (data) {
      this.selectedComponent = data.layout.componentId;
      this.layoutData = JSON.parse(data.style);
      this.layoutData["closeDate"] = data.closeDate
    } else {
      this.selectedComponent = this.array[0].componentId;
      this.layoutData = {
        componentId: 1,
        storeId: 38,
        header: {
          backgroundColor: "grey",
          fontColor: "black",
          showHomeLink: true,
          showProductsLink: true,
          showStoreLink: true,
          showContactLink: true,
          logoUrl: "",
          logoHeight: "100px"
        },
        layout: {
          backgroundColor: "grey",
          fontColor: "black",
          displayColor: true,
          displayPrice: true
        },
        footer: {
          backgroundColor: "grey",
          fontColor: "black",
          showHomeLink: true,
          showProductCatalogsLink: true
        }
      }
    }
    this.logoHeight = this.layoutData.header.logoHeight.replace("px", "");
  }

  saveLayoutSettings () {
    var object = {
      layoutId: this.selectedComponent,
      style: JSON.stringify(this.layoutData),
    }

    this.storeDetailsService.updateLayoutSettings(object, this.teamStoreId).subscribe((response) => {
      var result = response;
      if (result.status == 1) {
        this.commonService.openSuccessSnackBar('Layout updated successfully', '');
      }
    },
      (error) => {
      });
  }

  heightChanged () {
    this.layoutData.header.logoHeight = this.logoHeight + "px";
  }

}
