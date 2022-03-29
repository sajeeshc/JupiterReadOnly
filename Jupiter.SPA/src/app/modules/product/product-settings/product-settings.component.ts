import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';

@Component({
  selector: 'app-product-settings',
  templateUrl: './product-settings.component.html',
  styleUrls: ['./product-settings.component.scss']
})
export class ProductSettingsComponent implements OnInit {

  constructor(private router: Router, private commonService: CommonService) { }

  ngOnInit() {
    this.commonService.setPageHeader("Settings")
  }
}
