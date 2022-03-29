import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
  styleUrls: ['./create-store.component.scss']
})
export class CreateStoreComponent implements OnInit {

  constructor(
    private storeService: StoreService,
  ) { }

  templateList = []
  itemsToShow = 10

  ngOnInit() {
    this.getStoreTemplates();
  }

  getStoreTemplates () {
    this.storeService.getStoreTemplates("9,10,11").subscribe(//9=published,10=live,11=takedown
      (response) => {
        this.templateList = response.data;
      }
    );
  }
}
