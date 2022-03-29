import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { StorebuilderService } from "src/app/core/services/storebuilder.service";
import { StoredetailsService } from "src/app/core/services/storedetails.service";

@Component({
  selector: "app-store-productdisplay",
  templateUrl: "./store-productdisplay.component.html",
  styleUrls: ["./store-productdisplay.component.scss"],
})
export class StoreProductdisplayComponent implements OnInit {
  productDisplaySettingsGroup: FormGroup;
  teamStoreId: number;
  isInventoryChecked: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpProductDisplayFormGroup();
    this.getTeamStore(this.teamStoreId);
  }

  setUpProductDisplayFormGroup() {
    this.productDisplaySettingsGroup = this.formBuilder.group({
      productSortOrderType: new FormControl("1", Validators.required),
      showAvailableInventory: new FormControl(false),
      displaySku: new FormControl(true),
      displayManufacturer: new FormControl(true),
      inventoryThreshold: new FormControl(false),
    });
  }

  updateDisplaySetting() {
    if (this.productDisplaySettingsGroup.valid) {
      this.storedetailsService.updateStoreDisplaySettings(this.productDisplaySettingsGroup.value, this.teamStoreId).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            const url = this.commonService.createUrl(this.router.url, '/storeclosedpage', 2);
            this.router.navigateByUrl(url);

          } else {
            this.commonService.openErrorSnackBar(response.message, '');
          }

        },
        (error) => {
          console.log(error);
        }
      );
    }

  }


  change() {
    if (this.isInventoryChecked == true) {
      this.isInventoryChecked = false;
    }
    else {
      this.isInventoryChecked = true;
    }

  }

  getTeamStore(teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      if (teamStore.productDisplaySettings != null) {
        this.productDisplaySettingsGroup.setValue({
          productSortOrderType: teamStore.productDisplaySettings.productSortOrderType == null ? "1" : teamStore.productDisplaySettings.productSortOrderType,
          showAvailableInventory:
            teamStore.productDisplaySettings.showAvailableInventory,
          displaySku: teamStore.productDisplaySettings.displaySku,
          displayManufacturer:
            teamStore.productDisplaySettings.displayManufacturer,
          inventoryThreshold: teamStore.productDisplaySettings.inventoryThreshold == "" ? "0" : teamStore.productDisplaySettings.inventoryThreshold,
        });
      }

    });
  }
}
