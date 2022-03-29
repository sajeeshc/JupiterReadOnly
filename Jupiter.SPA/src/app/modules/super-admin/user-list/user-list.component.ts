import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from 'src/app/core/services/alert.service';
import { SuperAdminService } from 'src/app/core/services/super-admin.service';

declare var $ : any;

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  dataSource: any;
  filterFormGroup:FormGroup;
  selectedUser:any;

  constructor(
    private superAdminService: SuperAdminService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder : FormBuilder
  ) { }

  ngOnInit () {
    this.createFilterFormGroup();
    this.getUsersWithRoles();
  }


  createFilterFormGroup(){
    this.filterFormGroup = this.formBuilder.group({
      name: new FormControl('')
    });
  }

  displayedColumns: string[] = [
    "name",
    "email",
    "role",
    "symbol1",
    "symbol2"
  ];

  getUsersWithRoles() {
    this.superAdminService.getUserWithRoles().subscribe(
      (response) => {
        this.dataSource = response;
      },
      (error) => {
        this.alertService.error(error);
      }
    );
  }

  redirectToAddUser(id){
    this.router.navigateByUrl('/superadmin/edituser/'+id);
  }

  openConfirmation(user){
    this.selectedUser = user;
  $('#deleteModal').modal('toggle');
  }

  closeModal(){
    $('#deleteModal').modal('toggle');
  }

  deleteUser(user){
        this.superAdminService.deleteUser(user.id).subscribe(
          (response) => {
            this.selectedUser={};
            this.getUsersWithRoles();
            this.closeModal();
          },
          (error) => {
          }
        );
  }
}
