import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreService } from 'src/app/core/services/store.service';

@Component({
  selector: 'app-store-notifications',
  templateUrl: './store-notifications.component.html',
  styleUrls: ['./store-notifications.component.scss']
})
export class StoreNotificationsComponent implements OnInit {

  notificationGroup: FormGroup;
  notificationArray: FormArray;
  notificationData: any;
  teamStoreId: number;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    // this.setUpStoreNotificationsFormGroup();
    this.createNotificationForm();
    this.teamStoreId = parseInt(localStorage.getItem("teamStoreId"));;
    //this.initializeValues();
    this.getStore();
  }

  createNotificationForm() {
    this.notificationGroup = this.formBuilder.group({
      notificationArray: this.formBuilder.array([]),
    });
  }

  createNotificationArray(): FormGroup {
    return this.formBuilder.group({
      email: new FormControl(''),
      instantOrderNotification: new FormControl(false),
      dailyOrderSummary: new FormControl(false),
      shippingNotification: new FormControl(false),
      contactUsNotification: new FormControl(false),
      savedDesignNotification: new FormControl(false)
    });
  }

  setNotificationForm(row): FormGroup {
    return this.formBuilder.group({
      email: row.email,
      instantOrderNotification: row.instantOrderNotification,
      dailyOrderSummary: row.dailyOrderSummary,
      shippingNotification: row.shippingNotification,
      contactUsNotification: row.contactUsNotification,
      savedDesignNotification: row.savedDesignNotification
    });
  }

  addRow() {
    this.notificationArray = this.notificationGroup.get('notificationArray') as FormArray;
    this.notificationArray.push(this.createNotificationArray());
  }

  saveEmailNotificationSettings() {

    var resultArray = [];
    var resultObject = {};
    this.notificationGroup.get('notificationArray')['controls'].forEach((myObject, i) => {
      var email = this.notificationGroup.get('notificationArray')['controls'][i].value.email;
      if (this.notificationGroup.get('notificationArray')['controls'][i].value.instantOrderNotification) {
        resultObject = this.createNotificationObject(email, 0);
        resultArray.push(resultObject)
      }
      if (this.notificationGroup.get('notificationArray')['controls'][i].value.dailyOrderSummary) {
        resultObject = this.createNotificationObject(email, 1);
        resultArray.push(resultObject)
      }
      if (this.notificationGroup.get('notificationArray')['controls'][i].value.shippingNotification) {
        resultObject = this.createNotificationObject(email, 2);
        resultArray.push(resultObject)
      }
      if (this.notificationGroup.get('notificationArray')['controls'][i].value.contactUsNotification) {
        resultObject = this.createNotificationObject(email, 3);
        resultArray.push(resultObject)
      }
      if (this.notificationGroup.get('notificationArray')['controls'][i].value.savedDesignNotification) {
        resultObject = this.createNotificationObject(email, 4);
        resultArray.push(resultObject)
      }
    });
    this.saveNotification(resultArray);
  }

  createNotificationObject(email, type) {
    var resultObject = {};
    resultObject = {
      email: email,
      storeNotificationType: type
    }
    return resultObject;
  }

  saveNotification(obj) {
    if (this.notificationGroup.valid) {
      this.storeService.updateStoreNotifications(obj, this.teamStoreId).subscribe(
        (response) => {
          if (response.status == 1) {
            this.commonService.openSuccessSnackBar(response.message, '');
            const url = this.commonService.createUrl(this.router.url, '/storepolicies', 2);
            this.router.navigateByUrl(url);
          }
          else {
            this.commonService.openErrorSnackBar(response.message, '');
          }
        },
        (error) => {
          console.log(error);

        }
      );
    }

  }



  getStore() {
    this.storeService.getStore(this.teamStoreId).subscribe(
      (response) => {
        this.notificationData = response.data.notifications;
        (<FormArray>this.notificationGroup.get('notificationArray')).clear();
        this.formatData(this.notificationData)
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getDistinctEmail(notificaitonData) {
    var flags = [], output = [], l = notificaitonData.length, i;
    for (i = 0; i < l; i++) {
      if (flags[notificaitonData[i].email]) continue;
      flags[notificaitonData[i].email] = true;
      output.push(notificaitonData[i].email);
    }
    return output;
  }

  formatData(notificaitonData) {
    let obj;
    let emailArray = this.getDistinctEmail(notificaitonData);
    this.notificationArray = this.notificationGroup.get('notificationArray') as FormArray;
    for (var i = 0; i < emailArray.length; i++) {
      obj = {
        email: '',
        instantOrderNotification: false,
        dailyOrderSummary: false,
        shippingNotification: false,
        contactUsNotification: false,
        savedDesignNotification: false
      }
      obj.email = emailArray[i];
      for (var j = 0; j < notificaitonData.length; j++) {
        if (notificaitonData[j].email == emailArray[i])
          switch (notificaitonData[j].storeNotificationType) {
            case 0:
              obj.instantOrderNotification = true;
              break;
            case 1:
              obj.dailyOrderSummary = true;
              break;
            case 2:
              obj.shippingNotification = true;
              break;
            case 3:
              obj.contactUsNotification = true;
              break;
            case 4:
              obj.savedDesignNotification = true;
              break;
          }
      }
      this.notificationArray.push(this.setNotificationForm(obj));
    }
  }

  deleteRow(index) {
    this.notificationArray.removeAt(index);
  }

}

