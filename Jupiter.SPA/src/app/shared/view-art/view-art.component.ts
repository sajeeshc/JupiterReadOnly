import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { saveAs } from "file-saver";
import * as FileSaver from 'file-saver';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-view-art',
  templateUrl: './view-art.component.html',
  styleUrls: ['./view-art.component.scss']
})
export class ViewArtComponent implements OnInit {

  constructor(
    private commonService: CommonService,
    private storeService: StoreService,
    private route: ActivatedRoute,
  ) { }

  artImgList: any[] = [];

  ngOnInit() {
    let id = this.route.snapshot.params["artQueueId"]
    // let id=1010
    this.getArtImgList(id);
  }

  getArtImgList (id) {
    this.storeService.getArtImgList(id,0).subscribe(res => {
      if (res) {
        this.artImgList = res.data;
      }
    }, (error) => {
      this.commonService.openErrorSnackBar(error.message, "");
    });
  }

  
  downloadImg (url) {
    let urlSplit = url.split('/');
    FileSaver.saveAs(url, urlSplit[urlSplit.length - 1]);
  }
}
