import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LeaveService } from "../leave.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-leave-type',
  templateUrl: './create-leave-type.component.html',
  styleUrls: ['./create-leave-type.component.css']
})
export class CreateLeaveTypeComponent implements OnInit {

  isLoading = false;
  leave: any=[]; 
  disablerole = true;
  data: any= [];
  leaveId: string;
  mode : string;
  isEdit =true;
  userId = null;
  validations: any=[{title:"No",value:false},{title:"Yes",value:true}];
  leaveType:any=[{title:"Annual",value:0},{title:"Comp off",value:1},{title:"Maternity Leave",value:2},
  {title:"Optional Holiday",value:3},{title:"Paternity",value:4}]

  constructor(public leaveService: LeaveService,
              private dialogRef: MatDialogRef<CreateLeaveTypeComponent>,
              public route: ActivatedRoute,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                console.log(data,"0000000")
                this.data = data;
                this.leave = { _id: '', leave_type: '', message:'', any_validation:false, leave_desc:'', no_of_days:''};
            }

  ngOnInit() {
    this.isLoading = true; 
    if (this.data.id  && this.data.mode=='edit') {
          this.leaveService.getLeaveTypeById(this.data.id).subscribe( (resData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
             this.leave = {
              _id: resData.data[0]._id,
              leave_type: resData.data[0].leave_type,
              leave_desc: resData.data[0].leave_desc,
              no_of_days: resData.data[0].no_of_days,
              any_validation: resData.data[0].any_validation,
              message: resData.data[0].message,
              allowed_days: resData.data[0].allowed_days
             };
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
      }

onSaveLeave(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.leaveService.addLeaveType(form.value).subscribe(responseData => { 
            this.dialogRef.close();
            this.isLoading = false; 
        },
        error => {
          this.isLoading = false;           
        });
     } else {
      this.leaveService.updateLeaveType( this.leave._id,form.value).subscribe(responseData => { 
              this.dialogRef.close();
              this.isLoading = false; 
        },error => {
          this.isLoading = false; 
       });
    }
 }

 close() {
    this.dialogRef.close();
  }

}
