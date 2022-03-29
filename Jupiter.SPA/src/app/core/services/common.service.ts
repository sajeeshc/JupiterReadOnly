import { Injectable } from "@angular/core";
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from "@angular/material/snack-bar";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";

declare var $: any;

@Injectable({
  providedIn: "root",
})
export class CommonService {
  durationInSeconds = 3;
  horizontalPosition: MatSnackBarHorizontalPosition = "right";
  verticalPosition: MatSnackBarVerticalPosition = "top";

  private baseUrl = `${environment.apiUrl}`;

  private header = new BehaviorSubject(localStorage.getItem("pageHeader"));
  data$ = this.header.asObservable();

  private changesSaved = new BehaviorSubject(true);
  changesSaved$ = this.changesSaved.asObservable();

  private showBackButton = new BehaviorSubject(true);
  showBackButton$ = this.showBackButton.asObservable();

  private loading = new BehaviorSubject(false);
  loading$ = this.loading.asObservable()

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getFormattedDate(value) {
    // Date format correction on date select
    let formattedDate = "0001-01-01T00:00:00";
    if (value) {
      let d = new Date(value),
        month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;
      formattedDate = [month, day, year].join("/");
    }
    return formattedDate;
  }

  createUrl(baseUrl, redirectionUrl, type) {
    let splittedUrl = baseUrl.split("/");
    let urlVariables;
    if (
      (type == 1 && splittedUrl[splittedUrl.length - 2] == "storesettings") ||
      type == 3
    ) {
      urlVariables = splittedUrl.slice(1, splittedUrl.length - 2);
    } else {
      urlVariables = splittedUrl.slice(1, splittedUrl.length - 1);
    }
    let url = urlVariables.join("/") + redirectionUrl;
    return url;
  }

  openWarningSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ["snackbarWarning"],
    });
  }

  openSuccessSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ["snackbarSuccess"],
    });
  }

  openErrorSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: this.durationInSeconds * 1000,
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      panelClass: ["snackbarError"],
    });
  }

  autocompleteFilter(value: string, list): any[] {
    if ($.type(value) === "string") {
      // it's a string
      const filterValue = value ? value.toLowerCase() : "";
      return list.filter(
        (option) => option.searchByName.toLowerCase().indexOf(filterValue) != -1
      );
    }
  }

  setPageHeader(header: string) {
    localStorage.setItem("pageHeader", header);
    this.header.next(header);
  }

  getAllStates() {
    return this.http.get(this.baseUrl + "v1/state/all").pipe(
      map((response: any) => {
        const user = response;
        if (user) {
          return response;
        }
      })
    );
  }

  backButtonToggle(value) {
    setTimeout(() => {
      this.showBackButton.next(value);
    }, 0);
  }

  setChangesSavedValue(value) {
    this.changesSaved.next(value);
  }

  // async getChangesSavedValue() {
  //   let value = true
  //   new Promise((resolve, reject)=>{
  //     this.changesSaved$.subscribe(val=>{
  //       value =  val
  //     })
  //   })
  //   return value
  // }

  toggleLoading(value){
    this.loading.next(value)
  }
}
