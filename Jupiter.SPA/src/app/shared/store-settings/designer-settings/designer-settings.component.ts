import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-designer-settings',
  templateUrl: './designer-settings.component.html',
  styleUrls: ['./designer-settings.component.scss']
})
export class DesignerSettingsComponent implements OnInit {

  designerGroup: FormGroup;
  isDesignerSettingsVisible: boolean = true;
  designerPopupTitle: string;
  storeId: number

  constructor(
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private storebuilderService: StorebuilderService,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.storeId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpDesignerFormGroup();
    this.getDesignerSettings()
  }

  setUpDesignerFormGroup() {
    this.designerGroup = this.formBuilder.group({
      allowDesigner: ["false"],
      revealBlankPricinginCatalog: [false],
      requireApprovalforDesignerOrder: [false],
      allowDistressedFiles: [false],
      allowShareDesign: [false],
      enforceBoundaries: [false],
      allowDesignIdeas: [false],
      allowClipArt: [false],
      uploadArt: [false],
      uploadVectorOnly: [false],
      artTerms: [""]
    });
  }

  changeDesignerSettingsHidden(value: boolean) {
    this.isDesignerSettingsVisible = value;
  }

  changeDesignerPopupTitle(value: string) {
    this.designerPopupTitle = value;
  }


  getDesignerSettings() {
    this.storebuilderService.getTeamStore(this.storeId).subscribe(
      (response) => {
        this.setDesignerSettings(response.data)
      },
      (error) => {
        console.log(error)
        // this.alertService.error("Unable to get data");
      }
    );
  }

  setDesignerSettings(data) {
    const displaySettings = data.designerDisplaySettings
    const allowDesigner = data.allowDesigner
    if (displaySettings) {
      this.designerGroup.setValue({
        allowDesigner: allowDesigner.toString(),
        revealBlankPricinginCatalog: displaySettings.revealBlankPricinginCatalog,
        requireApprovalforDesignerOrder: displaySettings.requireApprovalforDesignerOrder,
        allowDistressedFiles: displaySettings.allowDistressedFiles,
        allowShareDesign: displaySettings.allowShareDesign,
        enforceBoundaries: displaySettings.enforceBoundaries,
        allowDesignIdeas: displaySettings.allowDesignIdeas,
        allowClipArt: displaySettings.allowClipArt,
        uploadArt: displaySettings.uploadArt,
        uploadVectorOnly: displaySettings.uploadVectorOnly,
        artTerms: displaySettings.artTerms
      })
    }
    this.changeDesignerSettingsHidden(!allowDesigner);
  }
  submit() {
    const allowDesigner = this.designerGroup.get("allowDesigner").value === 'true'
    let displaySettings = this.designerGroup.value
    delete displaySettings["allowDesigner"]
    const model = {
      allowDesigner, displaySettings
    }
    this.storeService.updateDesignerDisplaySettings(this.storeId, model).subscribe(
      (response) => {
        if (response.status == 1) {
          this.commonService.openSuccessSnackBar(response.message, '');
          const url = this.commonService.createUrl(this.router.url, '/productionschedule', 2);
          this.router.navigateByUrl(url);
        } else {
          this.commonService.openErrorSnackBar(response.message, '');
        }

      },
      (error) => {
        console.log(error)
        // this.alertService.error("Error while updating privacy settings");
      }
    );
  }

}
