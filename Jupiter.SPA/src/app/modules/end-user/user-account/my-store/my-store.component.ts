import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';

@Component({
  selector: 'app-my-store',
  templateUrl: './my-store.component.html',
  styleUrls: ['./my-store.component.scss']
})
export class MyStoreComponent implements OnInit {

  minDate = new Date();
  filterMyStoreForm:FormGroup;
  stage:number=1;
  dateFrom:string="";
  dateTo:string="";
  name:string="";
  teamStoreList:any[]=[];

  paginatorLength: number
  paginatorPageSize: number = 15
  paginatorPageSizeOptions: number[] = [5, 10, 15, 25, 100]
  paginatorIndex: number = 0

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private endUserService : EnduserService
    ) { }

  ngOnInit() {
    
    this.createFilterForm();
    this.completedFilter(true);
    this.getTeamStoreList();
  }


  createFilterForm(){
    //creates a form to enter filter keyword for the table.
    this.filterMyStoreForm = this.formBuilder.group({
      name:new FormControl(''),
      fromDate:new FormControl(''),
      toDate:new FormControl('')
    });
  }

  getTeamStoreList(){
    //fetches data for filling the table.
    let params = {
      page: (this.paginatorIndex + 1),
      per_page: this.paginatorPageSize,
    }
    this.endUserService.getUserTeamStores(this.name,this.dateFrom,this.dateTo,this.stage,params).subscribe((response)=>{
      if(response.status==0){
        this.teamStoreList = [];
        this.commonService.openErrorSnackBar(response.message,"")
      }
      else{
        this.teamStoreList = response.body.data;
        this.paginatorLength = JSON.parse(response.headers.get("Pagination")).totalItems
      }
      
    },
    (error)=>{
      this.teamStoreList = [];
      this.commonService.openErrorSnackBar("No Team Stores were found","")
    });
  }

  filter(){
    //fetches filter keyword data from form and converts it and calls the filtered list.
    this.name = this.filterMyStoreForm.get('name').value;
    var datePipe = new DatePipe('en-US');
    var fromDate = datePipe.transform(this.filterMyStoreForm.get('fromDate').value, 'MM/dd/yyyy');
    var toDate = datePipe.transform(this.filterMyStoreForm.get('toDate').value, 'MM/dd/yyyy');
    this.dateFrom = fromDate != null ? fromDate : '';
    this.dateTo = toDate != null ? toDate : '';

    if((this.dateFrom == null || this.dateFrom == "") || (this.dateTo == null || this.dateTo == "")){
      this.commonService.openErrorSnackBar("Please select a from/to date","")
    }
    else{
      this.paginatorIndex = 0;
      this.getTeamStoreList();
    }
    
  }

  completedFilter(isCompleted:boolean){
    
    if(isCompleted){
      this.stage=1;
    }
    else{
      this.stage=2;
    }
    
  }
  
  clearFilter(){
    this.createFilterForm();
    this.name = '';
    this.dateFrom = '';
    this.dateTo = '';
    this.paginatorIndex = 0;
    this.getTeamStoreList();
  }

  tabClick(tab){
    //sets the stage value of filter.
    if(tab.index == 0){
      this.stage=1;
      this.clearFilter();
      //this.filter();
    }
    else{
      this.stage=2;
      this.clearFilter();
      //this.filter();
    }
  }

  pageEvent(event) {
    this.paginatorPageSize = event.pageSize
    this.paginatorIndex = event.pageIndex
    this.getTeamStoreList();
  }
}
