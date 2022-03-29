import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-suggested-store-list',
  templateUrl: './suggested-store-list.component.html',
  styleUrls: ['./suggested-store-list.component.scss']
})
export class SuggestedStoreListComponent implements OnInit {
  userId: String;
  token: String;
  templateList: any[] = [];
  copiedStoreId: any;
  constructor(private storeService: StoreService,
    private router: Router) { }

  ngOnInit () {
    // let thisObj = {} = this;
    //Signal te parent
    // window.parent.postMessage("loaded", "*")
    // listen for messages from the parent.
    // window.addEventListener("message", function (e) {
    //   thisObj.userId = new String(e.data.userid).toString();
    //   thisObj.token = new String(e.data.usertoken).toString();
    //   if (thisObj.userId !== undefined) {
    //     localStorage.setItem("userId", thisObj.userId.toString());
    //     localStorage.setItem("token", thisObj.token.toString());
    //   }
    // }, false)

    this.getStoreTemplates();
  }


  getStoreTemplates () {
    this.storeService.getStoreTemplates("9,10,11").subscribe(//9=published,10=live,11=takedown
      (response) => {
        this.templateList = response.data;
      },
      (error) => {
        console.log(error);

      }
    );
  }
  copyLayout (teamStoreId: any) {
    this.storeService.copyStoreLayout(teamStoreId).subscribe(
      (response) => {
        if (response.status == 1) {
          this.copiedStoreId = response.data.id;
          this.router.navigateByUrl('/enduser/suggestedtemplate/storerequest/' + this.copiedStoreId);
        }
      },
      (error) => {
        console.log(error);

      }
    );
  }

}
