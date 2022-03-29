import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';

declare var $: any;

@Component({
  selector: 'app-storeselection',
  templateUrl: './storeselection.component.html',
  styleUrls: ['./storeselection.component.scss']
})
export class StoreselectionComponent implements OnInit {
  userId: String;
  token: String;
  selectedStore: any;
  selectedInstitution: any;
  institutionArray: any[];
  storeArray: any[];


  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit () {
    // let thisObj = {} = this;
    //Signal te parent
    // window.parent.postMessage("loaded", "*")
    // listen for messages from the parent.
    // window.addEventListener("message", function (e) {
    //   thisObj.userId = new String(e.data.userid).toString();
    //   thisObj.token = new String(e.data.usertoken).toString();
    //   if (thisObj.userId !== undefined) {
    //     console.log(thisObj.token);
    //     localStorage.setItem("userId", thisObj.userId.toString());
    //     localStorage.setItem("token", thisObj.token.toString());
    //   }
    // }, false)

    this.getInstitutions();
  }

  getInstitutions () {
    this.userService.getInstitutions().subscribe(
      (response) => {
        this.institutionArray = response.data;
        this.selectedInstitution = this.institutionArray[0];
        this.getStores(this.selectedInstitution);
      },
      (error) => {
        console.log(error);

      }
    );
  }

  getStores (institution: any) {
    this.userService.getStores(institution).subscribe(
      (response) => {
        this.storeArray = response.data;
        this.selectedStore = this.storeArray[0];
        this.setStoreImage(this.selectedStore);
      },
      (error) => {
        console.log(error);

      }
    );
  }

  setStoreImage (store: any) {
    $(".store-img-holder").attr("src", store.previewImage);
  }

  storeSelected (teamstoreId) {
    localStorage.setItem("purchaseType", '3');
    this.router.navigateByUrl('/enduser/buyfromlivestore/store/'+teamstoreId);
  }

}
