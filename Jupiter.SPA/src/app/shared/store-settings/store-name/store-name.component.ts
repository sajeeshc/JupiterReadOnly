import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

@Component({
  selector: 'app-store-name',
  templateUrl: './store-name.component.html',
  styleUrls: ['./store-name.component.scss']
})
export class StoreNameComponent implements OnInit {

  nameAndDirectoryGroup: FormGroup;
  teamStoreId: number;
  reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private storedetailsService: StoredetailsService,
    private storeBuilderService: StorebuilderService,
    private commonService: CommonService) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.setUpNameAndDirectoryFormGroup();
    this.getTeamStore(this.teamStoreId);
  }

  setUpNameAndDirectoryFormGroup () {    
    this.nameAndDirectoryGroup = this.formBuilder.group({
      storeName: new FormControl('',Validators.required),
      storeDirectory: new FormControl('',Validators.pattern(this.reg))
    });
  }

  save () {
    if (this.nameAndDirectoryGroup.valid) {
      var model = {
        id: this.teamStoreId,
        name: this.nameAndDirectoryGroup.get('storeName').value,
        storeDirectory: this.nameAndDirectoryGroup.get('storeDirectory').value
      };
      this.storedetailsService.updateStoreName(model).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            const url = this.commonService.createUrl(this.router.url, '/storecontact', 2);
            this.router.navigateByUrl(url);

          }
          else {
            this.commonService.openErrorSnackBar(response.message, '');
          }
        },
        (error) => {
        }
      );
    }
  }



  getTeamStore (teamStoreId) {
    this.storeBuilderService.getTeamStore(teamStoreId).subscribe((response) => {
      var teamStore = response.data;
      this.nameAndDirectoryGroup.get('storeName').setValue(teamStore.name);
      this.nameAndDirectoryGroup.get('storeDirectory').setValue(teamStore.storeDirectory);      
    });
  }
}
