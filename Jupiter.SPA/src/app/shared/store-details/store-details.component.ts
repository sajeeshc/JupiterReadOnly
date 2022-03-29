import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";

@Component({
  selector: "app-store-details",
  templateUrl: "./store-details.component.html",
  styleUrls: ["./store-details.component.scss"],
})
export class StoreDetailsComponent implements OnInit {

  teamStoreId : number;
  teamStoreName : string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private commonService : CommonService,
    private storeBuilderService : StorebuilderService
  ) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getTeamStore(this.teamStoreId);
  }

  getTeamStore (teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      this.teamStoreName = response.data.name;
    });
  }

  redirect(redirectionUrl:string, header: string){
    let baseUrl = this.router.url;
    let url = this.commonService.createUrl(baseUrl,redirectionUrl,1);   
    this.commonService.setPageHeader(this.teamStoreName + ' - ' + header);
    this.router.navigateByUrl(url);
  }

}
