import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';
import { environment } from 'src/environments/environment';
import { NavigationStart } from '@angular/router';
import 'rxjs/add/operator/filter';
import Swal from 'sweetalert2'
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
  teamStoreData: any = {};
  private wpUrl = `${environment.wpUrl}`;

  constructor(
    private storeDetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService,
    private router: Router
  ) {
    // router.events
    //   .filter(event => event instanceof NavigationStart)
    //   .subscribe((event:NavigationStart) => {
    //     Swal.fire({
    //       html: '<h5>Do you want to save the changes done , otherwise data will be lost!</h5>',
    //       showCancelButton: true,
    //       confirmButtonText: 'Yes',
    //     }).then((result) => {
    //       if (result.isConfirmed) {
    //       } else {

    //       }
    //     })
    //   });
  }
  

  ngOnInit () {
    this.array = [{ "id": 1, "imageSrc": "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/cb8016c2-9ff2-4174-b654-afb5780b6ba6-637496776359248797.png", "componentId": 1, "componentName": "Component1" },
    { "id": 2, "imageSrc": "https://jupiterstorage01.blob.core.windows.net/jupiterblob01/cb8016c2-9ff2-4174-b654-afb5780b6ba6-637496776359248797.png", "componentId": 2, "componentName": "Component2" }];

    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getLayoutSettings();
    this.setLayoutData(null);
    this.getTeamStore(this.teamStoreId);
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
      this.layoutData["disclaimer"] = data.disclaimer
    } else {
      this.selectedComponent = this.array[0].componentId;
      this.layoutData = {
        componentId: 1,
        storeId: 38,
        header: {
          backgroundColor: "#FFFFFF",
          fontColor: "#000000",
          showHomeLink: true,
          showProductsLink: true,
          showStoreLink: true,
          showContactLink: true,
          logoUrl: this.teamStoreData.logo || "",
          logoHeight: "100px"
        },
        timer: {
          backgroundColor: "#000000",
          fontColor: "#FFFFFF"
        },
        layout: {
          backgroundColor: "#FFFFFF",
          fontColor: "#000000",
          displayColor: true,
          displayPrice: true
        },
        footer: {
          backgroundColor: "#000000",
          fontColor: "#FFFFFF",
          showHomeLink: true,
          showProductCatalogsLink: true
        }
      }
    }
    this.logoHeight = this.layoutData.header.logoHeight.replace("px", "");
  }

  saveLayoutSettings () {
    let object = {
      layoutId: this.selectedComponent,
      style: JSON.stringify(this.layoutData),
    }

    this.storeDetailsService.updateLayoutSettings(object, this.teamStoreId).subscribe((response) => {
      let result = response;
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

  getTeamStore (teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe(response => {
      this.teamStoreData = response.data;
      if(!this.layoutData.closeDate){
        this.layoutData['closeDate'] = this.teamStoreData.closeDate
      }
      if(!this.layoutData.header.logoUrl)
        this.layoutData.header.logoUrl = this.teamStoreData.logo
    },
      error => {
        this.commonService.openErrorSnackBar(error.message, "");
      });
  }


  eventHandler (eventType) {
    // console.log(eventType);
    switch (eventType.type) {
      case 'home':
        window.location.href = this.wpUrl;
        break;
      case 'productList':
        window.location.href = this.wpUrl + 'product-list';
        break;
      case 'productSelected':
        localStorage.setItem('teamStoreId', this.teamStoreId);
        this.router.navigateByUrl('/enduser/buyfromlivestore/productview/' + eventType.value);
      default:
        break;
    }
  }

}
