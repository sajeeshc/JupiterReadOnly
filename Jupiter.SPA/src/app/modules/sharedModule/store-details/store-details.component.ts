import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";

@Component({
  selector: "app-store-details",
  templateUrl: "./store-details.component.html",
  styleUrls: ["./store-details.component.scss"],
})
export class StoreDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService
  ) { }

  ngOnInit () {

  }

  redirect(redirectionUrl:string){
    var baseUrl = this.router.url;
    var url = this.commonService.createUrl(baseUrl,redirectionUrl,1);   
    this.router.navigateByUrl(url);
  }

}
