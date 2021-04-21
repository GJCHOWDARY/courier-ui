import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { RolesService } from "../roles.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.css']
})
export class CreateRolesComponent implements OnInit {

  isLoading = false;
  role: any=[]; disablerole = true;
  data: any= [];
  roleId: string;
  mode : string;
  isEdit =true;
  userId = null;

  constructor(public rolesService: RolesService,
              private dialogRef: MatDialogRef<CreateRolesComponent>,
              public route: ActivatedRoute,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                console.log(data,"0000000")
                this.data = data;
                this.role = { _id: '', role_name: '', role_desc:'', role_id:''};
            }

  ngOnInit() {
    if (this.data.id  && this.data.mode=='edit') {
          this.rolesService.getRoleById(this.data.id).subscribe( (roleData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            console.log('ttt',roleData)
            this.role = {
              _id: roleData.role[0]._id,
              role_name: roleData.role[0].role_name,
              role_desc: roleData.role[0].role_desc,
              role_id:roleData.role[0].role_id
            };
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
      }

onSaveRole(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.rolesService.addRole(form.value.role_name,form.value.role_desc)
          .subscribe(responseData => { 
            this.dialogRef.close();
        },error => {
          this.isLoading = false;
       });
     } else {
      this.rolesService.updateRole(this.role._id, this.role.role_id, this.role.role_name, form.value.role_desc)
          .subscribe(responseData => { 
              this.dialogRef.close();
        },error => {
          this.isLoading = false;
       });
    }
 }

 close() {
  this.dialogRef.close();
   }
}
