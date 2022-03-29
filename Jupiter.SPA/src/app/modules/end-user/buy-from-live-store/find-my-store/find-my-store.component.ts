import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-find-my-store',
  templateUrl: './find-my-store.component.html',
  styleUrls: ['./find-my-store.component.scss']
})
export class FindMyStoreComponent implements OnInit {

  constructor(
    private storeService: StoreService,
  ) { }

  templateList = []
  itemsToShow = 10

  ngOnInit() {
    this.getStoreTemplates();
  }

  getStoreTemplates () {
    this.storeService.getStoreTemplates("10").subscribe(//9=published,10=live,11=takedown
      (response) => {
        this.templateList = response.data;
      }
    );
  }
}
