import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/core/services/common.service";
import { SuperAdminService } from "src/app/core/services/super-admin.service";

@Component({
  selector: "app-add-user",
  templateUrl: "./add-user.component.html",
  styleUrls: ["./add-user.component.scss"],
})
export class AddUserComponent implements OnInit {
  addUserForm: FormGroup;
  userId: any;
  public emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  user:any;
  roleArray:any[]=[];
  existingUser:boolean=false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private superAdminService: SuperAdminService,
    private commonService : CommonService
  ) {}

  ngOnInit() {
    this.userId = parseInt(this.route.snapshot.paramMap.get("userId"));
    this.createUserForm();
    this.getRoles();
    this.checkingUserId();
  }

  createUserForm() {
    this.addUserForm = this.formBuilder.group({
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(this.emailPattern),
      ]),
      name: new FormControl("", Validators.required),
      roleId: new FormControl("", Validators.required),
    });
  }

  fetchUserInfo() {
    this.superAdminService.getUserInfo(this.userId).subscribe(
      (response) => {
        this.user = response.data;
        this.addUserForm.setValue({
          email: this.user.email,
          name: this.user.firstName,
          roleId: this.user.roles[0].id,
        });
      },
      (error) => {
      }
    );

    
  }

  getRoles(){
    this.superAdminService.getRoles().subscribe(
      (response) => {
        var list = response;
        list.forEach((item)=>{
          if(item.normalizedName !== "ENDUSER")
          this.roleArray.push(item)
        });
      },
      (error) => {
      }
    );
  }

  checkingUserId(){
    if(this.userId != null && this.userId!=0){
      this.existingUser= true;
      this.addUserForm.controls['email'].disable();
      this.fetchUserInfo();
    }
  }

  addUser(){
    if(this.addUserForm.valid){
      if(this.existingUser){
        var updatedUser = {
          name:this.addUserForm.controls['name'].value,
          roleId:this.addUserForm.controls['roleId'].value
        }
        this.superAdminService.updateUserWithRole(updatedUser,this.userId).subscribe(
          (response) => {
            if(response.status == 1){
              this.router.navigateByUrl('superadmin/userlist');
            }
          },
          (error) => {
          }
        );
      }
      else{
        this.superAdminService.createUserWithRole(this.addUserForm.value).subscribe(
          (response) => {
            if(response.status == 1){
              this.router.navigateByUrl('superadmin/userlist');
            }
          },
          (error) => {
            this.commonService.openErrorSnackBar(error,'');
          }
        );
      }
      
    }
  }
}
