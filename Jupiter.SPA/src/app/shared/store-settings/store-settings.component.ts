import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";

@Component({
  selector: "app-store-settings",
  templateUrl: "./store-settings.component.html",
  styleUrls: ["./store-settings.component.scss"],
})
export class StoreSettingsComponent implements OnInit {
  redirectionUrl: String = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() { }

  showForm(valueForm: number) {
    switch (valueForm) {
      case 1:
        this.redirectionUrl = "/storename";
        break;
      case 2:
        this.redirectionUrl = "/storecontact";
        break;
      case 3:
        this.redirectionUrl = "/storebranding";
        break;
      case 4:
        this.redirectionUrl = "/storenotifications";
        break;
      case 5:
        this.redirectionUrl = "/storepolicies";
        break;
      case 6:
        this.redirectionUrl = "/privacysettings";
        break;
      case 7:
        this.redirectionUrl = "/socialmedia";
        break;
      case 8:
        this.redirectionUrl = "/storedisplay";
        break;
      case 9:
        this.redirectionUrl = "/storeclosedpage";
        break;
      case 10:
        this.redirectionUrl = "/designer";
        break;
      case 11:
        this.redirectionUrl = "/productionschedule";
        break;
      case 12:
        this.redirectionUrl = "/shippingmethods";
        break;
      case 13:
        this.redirectionUrl = "/storepickup";
        break;
      case 14:
        this.redirectionUrl = "/checkoutsettings";
        break;

      case 15:
        this.redirectionUrl = "/customorderfields";
        break;
      case 16:
        this.redirectionUrl = "/storecommission";
        break;

      case 17:
        this.redirectionUrl = "/seosettings";
        break;
      case 18:
        this.redirectionUrl = "/storedomain";
        break;
      case 20:
        this.redirectionUrl = "/storedeveloper";
        break;
      case 21:
        this.redirectionUrl = "/shippingandpickupmethods";
        break;
      case 22:
        this.redirectionUrl = "/orderreceipt";
        break;
      case 23:
        this.redirectionUrl = "/storelive";
        break;
      case 24:
        this.redirectionUrl = "/storeverification";
        break;
      case 25:
        this.redirectionUrl = "/banner-top";
        break;
    }

    this.redirect();
  }

  redirect() {
    let baseUrl = this.router.url;
    let url = this.commonService.createUrl(baseUrl, this.redirectionUrl, 2);
    this.router.navigateByUrl(url);
  }
}
