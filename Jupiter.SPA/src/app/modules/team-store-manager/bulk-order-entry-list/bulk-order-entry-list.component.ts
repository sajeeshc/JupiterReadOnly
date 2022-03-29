import { Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-bulk-order-entry-list',
  templateUrl: './bulk-order-entry-list.component.html',
  styleUrls: ['./bulk-order-entry-list.component.scss']
})
export class BulkOrderEntryListComponent implements OnInit {

  constructor(
    private storeService: StoreService
    ) { }

  dataSource = []
  displayedColumns = [
    "userName",
    "email",
    "phone",
    "organization",
    "type",
    "status",
    "ref",
    "createdDate",
    "action"
  ];
  filterParams={
    userName:'',
    email:'',
    phone:'',
    organization:'',
    type:'',
    status:'',
    ref:'',
    createdDate:'',
    page: 1,
    per_page: 10,
    pageSizeOptions: [5, 10, 25, 100],
    totalLength: 0,
  }
  cartType = 0
  ngOnInit() {
    this.getEntries()
  }

  getEntries() {
    this.storeService.getBulkOrderEntries(this.filterParams).subscribe(res => {
      this.dataSource = res.data
      this.filterParams.totalLength = JSON.parse(res.headers.get("Pagination")).totalItems || 0
    })
  }

    
  onPage(event) {
    this.filterParams.per_page = event.pageSize
    this.filterParams.page = event.pageIndex + 1
    this.getEntries()
  }
}
