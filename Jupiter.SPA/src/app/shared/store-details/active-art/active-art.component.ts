import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoredetailsService } from 'src/app/core/services/storedetails.service';

declare var $: any;

@Component({
  selector: 'app-active-art',
  templateUrl: './active-art.component.html',
  styleUrls: ['./active-art.component.scss']
})
export class ActiveArtComponent implements OnInit {

  artList: string[] = [];
  teamStoreId: any;
  constructor(private storeDetailsService: StoredetailsService,
    private route: ActivatedRoute,
    private commonService: CommonService) { }

  ngOnInit () {
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));
    this.getArtList();
  }

  getArtList () {
    this.storeDetailsService.getStoreArtList(this.teamStoreId).subscribe((response) => {
      var artList = response.data;
      this.artList = artList.filter(function (item, pos) {
        return artList.indexOf(item) == pos;
      });
    });
  }

  // addArt(){
  //    var url : string = $('#addArt').val();
  //   this.storeDetailsService.addArtLink(url,this.teamStoreId).subscribe((response) => {
  //    if(response.status==1){
  //      this.commonService.openSuccessSnackBar(response.message,'');
  //      this.artList.push(url);
  //      $('#addArtModal').modal('toggle');
  //    }
  //    else{
  //     this.commonService.openErrorSnackBar(response.message,'');
  //    }
  //   });
  // }

}
