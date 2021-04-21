import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { QualifcationService } from '../qualification.service';
import { AuthService } from "../../../../auth/auth.service";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-qualification',
  templateUrl: './create-qualification.component.html',
  styleUrls: ['./create-qualification.component.css']
})
export class CreateQualificationComponent implements OnInit {
  data:any; userId: string; 
  viewpage: string;project_name: string;
  selectable = true;
  removable = true;
  isLoading:boolean=true;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  edu:any ={ _id: '', level: '', institute:'', specialization:'', score: '', start_date:'', end_date:''};
  work:any ={ _id: '', company_name: '', job_title:'', work_desc:'', team_size:'', projects:[], start_date:'', end_date:''};
  levels:any = [{name:"Master's Degree"},{name:"Bachelor's Degree"},{name:"College Undergraduate"}];

  constructor(private QService:QualifcationService, private _snackBar: MatSnackBar,
    private authService:AuthService, private dialogRef: MatDialogRef<CreateQualificationComponent>,
    private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
        this.data = data;
        this.userId=this.authService.getUserId();
        this.viewpage=data.page;
      if(this.data.page=='Work'&&this.data.mode=='update'){
        this.work=this.data;
        }else if(this.data.page=='Education'&&this.data.mode=='update'){
          this.edu=this.data;
      }
  }

  ngOnInit(): void {
    this.isLoading=false;
  }

  addEdu(form: NgForm){
    if (form.invalid) {
        return;
      }
    this.isLoading=true;
    if(this.data.mode=='add'){
        this.QService.addEducation(form.value).subscribe((res:any)=>{
           this.dialogRef.close();
        },error => {
          this.isLoading = false;
       });
    }else {
      this.QService.updateEducation(this.data._id, form.value).subscribe((res:any)=>{
          this.dialogRef.close();
        },error => {
          this.isLoading = false;
      });
    }
  }

  addWork(form: NgForm){
    if (form.invalid) {
        return;
      }
    this.isLoading=true;
    if(this.data.mode=='add'){
        form.value.projects=this.work.projects;
        this.QService.addWork(form.value).subscribe((res:any)=>{
          this.dialogRef.close();
        },error => {
          this.isLoading = false;
       });
    }else{
      form.value.projects=this.work.projects;
      this.QService.updateWork(this.data._id, form.value).subscribe((res:any)=>{
        this.dialogRef.close();
      },error => {
        this.isLoading = false;
     });
    }
  }

close() {
  this.dialogRef.close();
}

remove(project: string): void {
const index = this.work.projects.indexOf(project);
  if (index >= 0) {
      this.work.projects.splice(index, 1);
    }
  }

addProject(name:string){
  this.work.projects.push({project_name:name});
  this.project_name='';
}

}
