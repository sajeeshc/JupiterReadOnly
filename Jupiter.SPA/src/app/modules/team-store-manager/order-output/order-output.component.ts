import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/core/services/common.service';
import { StoreManagerService } from 'src/app/core/services/store-manager.service';
import { StorebuilderService } from 'src/app/core/services/storebuilder.service';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver'
import { SharedService } from 'src/app/core/services/shared.service';
declare var $: any
@Component({
  selector: 'app-order-output',
  templateUrl: './order-output.component.html',
  styleUrls: ['./order-output.component.scss']
})
export class OrderOutputComponent implements OnInit {

  constructor(
    private storeManagerService: StoreManagerService,
    private commonService: CommonService,
    private sharedService: SharedService,
  ) { }

  noImage = "../../../../assets/images/default-image.jpg"
  webOrders = []
  openStores = []
  closedStores = []
  pagination = {
    webOrders: {
      pageSize: 10,
      length: 100
    }
  }
  selectedOrder
  states = []
  displayedColumnsClosedStores: string[] = ['name', 'id', 'artsCount', 'openDate', 'closeDate', 'exportStatus', 'herculesId', 'action'];
  displayedColumnsOpenStores: string[] = ['name', 'contactName', 'id', 'closeDate', 'exportStatus', 'herculesId', 'action'];
  displayedColumnsWebOrders: string[] = ['contactName', 'orderId', 'institution', 'orderDate', 'exportStatus', 'herculesId', 'action'];

  excelUrl = environment.storage + "bcf16b8f-b53e-472a-a138-05b71a12476f-637711014415305051.xlsx"

  ngOnInit() {
    this.commonService.setPageHeader("Order Output")
    this.getClosedStores()
    this.getOpenStores()
    this.getWebOrderList()
    this.getAllStates()
    
  }

  getOpenStores() {
    this.storeManagerService.getOrderOutputStoresList({stage:10}).subscribe(
      (response:any) => {
        this.openStores = response.data;
      }
    );
  }

  getClosedStores() {
    this.storeManagerService.getOrderOutputStoresList({}).subscribe(
      (response: any) => {
        this.closedStores = response.data;
      },
    );
  }

  getWebOrderList() {
    // var datePipe = new DatePipe('en-US');
    // var startDate = datePipe.transform(this.filterFormGroup.get('startDate').value, 'MM/dd/yyyy');
    // var endDate = datePipe.transform(this.filterFormGroup.get('endDate').value, 'MM/dd/yyyy');
    // startDate = startDate == null ? '' : startDate;
    // endDate = endDate == null ? '' : endDate;
    // var orderType = this.filterFormGroup.get('orderType').value  == null ? '' : this.filterFormGroup.get('orderType').value;
    // var paymentMode = this.filterFormGroup.get('paymentMode').value  == null ? '' : this.filterFormGroup.get('paymentMode').value;
    // const params = {
    //   orderId:this.orderIdSearch,
    //   customerName:this.customerSearch,
    //   institution:this.instituteSearch,
    //   customerEmail:this.customerEmailSearch,
    //   customerPhone:this.customerPhoneSearch,
    //   startDate,endDate,
    //   orderType,
    //   paymentMode
    // }
    this.storeManagerService.getOrderList({}).subscribe(response => {
      this.webOrders = response.body.data;
    });
  }

  viewOrder(order) {
    this.storeManagerService.getOrder(order.orderId).subscribe(res => {
      this.selectedOrder = res.body.data
      $('#view-order-modal').modal('show')
    })
  }

  getOrderOutput(teamstoreId, i, live?) {
    const ele = document.getElementById(teamstoreId) as HTMLInputElement
    const hercId = ele.value
    if (hercId) {
      this.storeManagerService.getOrderOutput(teamstoreId, hercId, live).subscribe((res: any) => {
        if (res.data != "N") {
          saveAs(res.data, teamstoreId + "_orderExport.xlsx")
          this.closedStores[i].exportStatus = true
          this.closedStores[i].herculesId = hercId
        } else {
          this.commonService.openErrorSnackBar("This store has no orders", "")
        }
      })
    } else {
      this.commonService.openErrorSnackBar("Enter hercules id to export", "")
    }
  }

  copyUrl(id) {
    let copyText = document.getElementById(id) as HTMLInputElement
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    this.commonService.openSuccessSnackBar("Url copied to clipboard","")
  }

  getAllStates(){
    this.sharedService.getAllStates().subscribe(res=>{
      this.states = res.data
      console.log(res)
    })
  }

  saveHerculesId(){
    const ele = document.getElementById("web_"+this.selectedOrder.id) as HTMLInputElement
    const hercId = ele.value
    if(hercId){
      this.storeManagerService.updateHercIdWebForOrders(this.selectedOrder.id, hercId).subscribe(res=>{
        this.commonService.openSuccessSnackBar("Hercules Id updated successfully","")
        this.selectedOrder.herculesId = hercId
        for(let i=0; i<this.webOrders.length;i++){
          if(this.webOrders[i].orderId == this.selectedOrder.id){
            this.webOrders[i].herculesId = hercId
            this.webOrders[i].isWebOrderExported = true
            break
          }
        }
      })
    }else{
      this.commonService.openErrorSnackBar("Enter hercules id","")
    }
  }

  getStateById(id){
    return this.states.find(state=>state.id==id)
  }

}
