import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/core/services/common.service';
import { EnduserService } from 'src/app/core/services/enduser.service';
const clipboardy = require('clipboardy');

@Component({
  selector: 'app-my-art',
  templateUrl: './my-art.component.html',
  styleUrls: ['./my-art.component.scss']
})
export class MyArtComponent implements OnInit {

  minDate = new Date();
  filterMyArtForm:FormGroup;
  keyword:string="";
  teamStoreList:any[]=[];
  artType:number=1;
  userId: number 
  artDigitized: any[]
  artNonDigitized: any[]

  paginatorLengthNonDigitized: number
  paginatorLengthDigitized: number
  paginatorPageSizeDigitized: number = 10
  paginatorPageSizeNonDigitized: number = 10
  paginatorPageSizeOptions: number [] = [5, 10, 25, 100]
  paginatorIndexDigitized: number = 0
  paginatorIndexNonDigitized: number = 0

  constructor(private formBuilder: FormBuilder,
    private commonService: CommonService,
    private endUserService : EnduserService) { }

  ngOnInit() {
    this.userId = Number(localStorage.getItem("userId"))
    this.createFilterForm();
    this.getArtList()
  }

  createFilterForm(){
    //creates a form to enter filter keyword for the table.
    this.filterMyArtForm = this.formBuilder.group({
      keyword:new FormControl(''),
    });
  }

  getArtList(){
    let params = {
      userId: this.userId,
      value: true,
      // page:(this.paginatorIndexDigitized+1),
      // per_page:this.paginatorPageSizeDigitized,
    }
    this.endUserService.getArtQueue(params).subscribe(res => {
      if(res){
        this.artDigitized = res.data
        this.paginatorLengthDigitized = JSON.parse(res.headers.get("Pagination")).totalItems || 0
      }
    })
    params.value = false
    this.endUserService.getArtQueue(params).subscribe(res => {
      if(res){
        this.artNonDigitized = res.data
        this.paginatorLengthNonDigitized = JSON.parse(res.headers.get("Pagination")).totalItems || 0
      }
    })
    //fetches data for filling the table.
    // this.endUserService.getUserTeamStores(this.name,this.dateFrom,this.dateTo,this.stage).subscribe((response)=>{
    //   this.teamStoreList = response.data;
    // },
    // (error)=>{

    // });
  }

  filter(){
    //fetches filter keyword data from form and converts it and calls the filtered list.
    this.keyword = this.filterMyArtForm.get('keyword').value;
    this.getArtList();
  }

  completedFilter(tab){
    //sets the background color and stage value of filter.
    if(tab.index == 0){
      this.artType=1;
      this.filter();
    }
    else{
      this.artType=2;
      this.filter();
    }
  }

  handleImageInput(files: FileList){
    const file: File = files.item(0)
    let formData = new FormData()
    formData.append('file',file)
    this.endUserService.uploadArt(formData).subscribe(res=>{
      if(res){
        this.commonService.openSuccessSnackBar("Art uploaded succesfully","")
        this.getArtList()
      }
    })
  }

  copyURL(url){
    clipboardy.write(url);
  }

  // pageEvent(event){
  //   this.paginatorPageSizeDigitized = event.pageSize
  //   this.paginatorIndexDigitized = event.pageIndex
  //   this.getArtList()
  // }
}
