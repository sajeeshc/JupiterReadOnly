import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';

@Component({
  selector: 'app-art-queue-list',
  templateUrl: './art-queue-list.component.html',
  styleUrls: ['./art-queue-list.component.scss']
})
export class ArtQueueListComponent implements OnInit {

  dataSource: any;
  artList: any[] = [];
  filterFormGroup: FormGroup;
  stage: any;
  artists:any[]=[];

  constructor(
    private storeBuilderService: StorebuilderService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private storeService: StoreService,
    private commonService: CommonService,
    private formBuilder: FormBuilder
  ) { }

  user: any;

  ngOnInit () {
    //this.getStoreRequestList();
    this.user = JSON.parse(localStorage.getItem('user'));
    this.createFilterFormGroup();
    this.getArtList();
    this.getArtists()
  }

  displayedColumns: string[] = [
    "artName",
    "artCount",
    "storeOwner",
    "orderNumber",
    "orderType",
    "dueDate",
    "dueTime",
    // "services",
    "status",
    "artist"
  ];

  createFilterFormGroup () {
    this.filterFormGroup = this.formBuilder.group({
      artist: new FormControl(''),
      stage: new FormControl(this.stage),
      startDate : new FormControl(''),
      endDate : new FormControl(''),
      artType : new FormControl(''),
      keyword : new FormControl('')
    });
  }

  getArtList () {
    var datePipe = new DatePipe('en-US');
    var startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    var endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    startDate = startDate == null ? '' : startDate;
    endDate = endDate == null ? '' : endDate;
    var artist = this.filterFormGroup.get('artist').value  == null ? '' : this.filterFormGroup.get('artist').value;
    var artType = this.filterFormGroup.get('artType').value  == null ? '' : this.filterFormGroup.get('artType').value;
    var stage = this.filterFormGroup.get('stage').value  == null ? '1,2,3,4,5,6,7,10,11' : this.filterFormGroup.get('stage').value;//'all status

    this.storeService.getArtList({startDate:startDate,endDate:endDate,type:stage,artist:artist,artType:artType,serviceId:0}).subscribe(response => {
      if (response.data != null) {
        this.artList = response.data;
      }
      else {
        this.artList = [];
        this.commonService.openErrorSnackBar(response.message,'');
      }
    });
  }

  getArtists(){
    this.storeService.getArtists().subscribe(response => {
      if (response.data != null) {
        this.artists = response.data;
      }
      else {
      }
    });
  }


  assignToArtist (item) {
    item.assignedToId = this.user.id;
    item.artQueueStatus = 3;
    this.storeService.updateArtQueueStatus(item).subscribe(response => {
      if (response.data != null) {
        this.commonService.openSuccessSnackBar(response.message, "");
        this.router.navigateByUrl('/artprocess/artlist');
      }
    });
  }
}
