import { Component, OnInit } from '@angular/core';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoreService } from 'src/app/core/services/store.service'
import { CommonService } from 'src/app/core/services/common.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-summary',
  templateUrl: './store-summary.component.html',
  styleUrls: ['./store-summary.component.scss']
})
export class StoreSummaryComponent implements OnInit {

  constructor(
    private storeBuilderService: StorebuilderService,
    private storeService: StoreService,
    private commonService: CommonService,
    private router: Router,
  ) { }

  storeId: number
  name: string = ""
  contactName: string = ""
  storeUrl: string = ""
  createdBy: string = ""
  customerNotes: string = ""

  ngOnInit () {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.getSummary()
  }

  getSummary () {
    this.storeBuilderService.getTeamStore(this.storeId).subscribe(response => {
      this.name = response.data.name;
      this.contactName = response.data.contactName;
      this.storeUrl = response.data.storeUrl;
      this.createdBy = response.data.createdBy.name;
      this.customerNotes = response.data.customerNotes;

      if (response.data.storeUrl == '' || response.data.storeUrl == null) {
        var baseUrl = document.location.href;
        var splittedUrl = baseUrl.split("/");
        var url = splittedUrl[0] + '//' + splittedUrl[2] + '/store/' + response.data.id
        this.storeUrl = url;
      }
    })
  }

  submit () {
    const model = {
      id: this.storeId,
      customerNotes: this.customerNotes,
      storeUrl: this.storeUrl,
      stage: 6
    }
    this.storeService.updateStore(model).subscribe(
      response => {
        this.commonService.openSuccessSnackBar(response.message, '');
        this.router.navigateByUrl("/storebuilder/storerequestlist");
        var data = { replaceHome: true };
        window.parent.postMessage(data, "*");
      },
      error => {
        this.commonService.openErrorSnackBar(error.message, '');
      }
    )
  }
}
