import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { stringify } from 'querystring';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-developer-settings',
  templateUrl: './developer-settings.component.html',
  styleUrls: ['./developer-settings.component.scss']
})
export class DeveloperSettingsComponent implements OnInit {
  developerSettingsGroup: FormGroup;
  developerSettingsObj: any;
  teamStoreId: number;
  formdata: FormData=new FormData();
  fileObj: File;
  fileStatus: number=2;
  customCssUrl: string;
  constructor(private formBuilder: FormBuilder, private storeService: StoreService) { }

  ngOnInit() {
    this.setUpDeveloperSettingsFormGroup();
    this.teamStoreId=42;
    this.getDeveloperSettings();
  }

  setUpDeveloperSettingsFormGroup(){
    this.developerSettingsGroup= this.formBuilder.group({
      activateEmbeddedScript: new FormControl(''),
      embeddedScriptCode: new FormControl('')
    });
  }

  saveTeamStoreChanges(){
    if(!this.developerSettingsGroup.value.activateEmbeddedScript){
      this.developerSettingsGroup.value.embeddedScriptCode="";
    }
    this.storeService.updateDeveloperSettings(this.developerSettingsGroup.value, this.teamStoreId, this.fileObj, this.fileStatus).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getDeveloperSettings(){
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.onSuccessResponse(response.data);
        
      },
      (error) => {
        console.log(error);

      }
    );
  }

  onSuccessResponse(response: any){
    this.fileStatus=2;
    this.developerSettingsObj= response.developerSettings;
    this.customCssUrl= this.developerSettingsObj.customCSS===null||this.developerSettingsObj.customCSS===""||
                        this.developerSettingsObj.customCSS===undefined?"":
                        (this.developerSettingsObj.customCSS);
    if(this.customCssUrl!=""){
      let index= this.customCssUrl.lastIndexOf("/");
      this.customCssUrl= this.customCssUrl.slice(++index);
    }
        this.developerSettingsGroup.setValue({
          activateEmbeddedScript: this.developerSettingsObj.activateEmbeddedScript,
          embeddedScriptCode: this.developerSettingsObj.embeddedScriptCode,
        });
  }

  onFileSelect(event) {
    if (event.target.files.length > 0) {
      this.fileObj = event.target.files[0];
      this.fileStatus=1;
      this.customCssUrl=this.fileObj.name; 
    }
  }

  RemoveFile(){
    this.fileObj=null;
    this.fileStatus=0;
    this.customCssUrl="";
  }
}
