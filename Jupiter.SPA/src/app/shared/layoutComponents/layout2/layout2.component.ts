import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-layout2',
  templateUrl: './layout2.component.html',
  styleUrls: ['./layout2.component.scss']
})
export class Layout2Component implements OnInit {

  @Input() layoutData: any;
  @Input() teamStoreId: number;
  @Input() teamStoreData: any;
  @Output() eventType: EventEmitter<any> = new EventEmitter();
  @Output() isStoreVerified: EventEmitter<number> = new EventEmitter()
  
  selectedImage = []
  productsByCategory = []
  // teamStoreId: number
  noImagePlaceholder = "../../../../../assets/images/default-image.jpg"
  constructor(
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.getCatagoryWiseProducts()
  }

  getCatagoryWiseProducts() {
    this.storeService.getCategoriesWithProducts(this.teamStoreId).subscribe(
      (response) => {
        this.productsByCategory = response.data;
        let userVerified : number = this.productsByCategory[0].isUserVerified;
        this.isStoreVerified.emit(userVerified);
        for(let i=0; i<this.productsByCategory.length; i++){
          this.selectedImage[i]=[]
        }
      },
      (error) => {
        console.log(error)
      });
  }

  clickEvent (type, value, colorId = null, mapCode) {
    let event = {
      type, value, colorId, mapCode
    }
    this.eventType.emit(event);
  }
}
