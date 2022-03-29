import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";

@Component({
  selector: "app-store-settings",
  templateUrl: "./store-settings.component.html",
  styleUrls: ["./store-settings.component.scss"],
})

export class StoreSettingsComponent implements OnInit {

  redirectionUrl: String = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit () { }

  showForm (valueForm: number) {
    switch (valueForm) {
      case 1:
        this.redirectionUrl = '/storename';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storename"
        // );
        break;
      case 2:
        this.redirectionUrl = '/storecontact';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storecontact"
        // );
        break;
      case 3:
        this.redirectionUrl = '/storebranding';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storebranding"
        // );
        break;
      case 8:
        this.redirectionUrl = '/storedisplay';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storedisplay"
        // );
        break;
      case 10:
        this.redirectionUrl = '/designer';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/designer"
        // );
        break;
      case 13:
        this.redirectionUrl = '/storepickup';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storepickup"
        // );
        break;

      case 16:
        this.redirectionUrl = '/customorderfields';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/customorderfields"
        // );
        break;

      case 18:
        this.redirectionUrl = '/storedomain';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storedomain"
        // );
        break;
      case 20:
        this.redirectionUrl = '/storedeveloper';
        // this.router.navigateByUrl(
        //   "/storebuilder/storedetails/storesettings/storedeveloper"
        // );
        break;
    }

    this.redirect()
  }


  redirect () {
    var baseUrl = this.router.url;
    var url = this.commonService.createUrl(baseUrl, this.redirectionUrl,2);
    this.router.navigateByUrl(url);
  }
}
