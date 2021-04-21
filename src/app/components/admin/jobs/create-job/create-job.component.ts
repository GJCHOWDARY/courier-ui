import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { JobService } from "../job.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-job',
  templateUrl: './create-job.component.html',
  styleUrls: ['./create-job.component.css']
})
export class CreateJobComponent implements OnInit {

  isLoading = false;
  jobs: any=[]; 
  disablerole = true;
  data: any= [];
  jobId: string;
  mode : string;
  isEdit =true;
  userId = null;

  constructor(public jobService: JobService,
              private dialogRef: MatDialogRef<CreateJobComponent>,
              public route: ActivatedRoute,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
                this.jobs = { _id: '', job_name: '', job_desc:''};
            }

  ngOnInit() {
    this.isLoading=true;
    if (this.data.id  && this.data.mode=='edit') {
          this.jobService.getJobById(this.data.id).subscribe( (resData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            console.log('ttt',resData)
            this.jobs = {
              _id: resData.data[0]._id,
              job_name: resData.data[0].job_name,
              job_desc: resData.data[0].job_desc,
             };
          });
        }else {
          console.log("Create")
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
    // this.isLoading = true;
    if (this.mode === "create") {
      this.isLoading = true;
      this.jobService.addJob(form.value.job_name,form.value.job_desc)
          .subscribe(responseData => { 
            this.isLoading = false;
            this.dialogRef.close();
        },
        error => {
          this.isLoading = false;       
        });
     } else {
      this.jobService.updateJob(this.jobs._id, this.jobs.job_name, form.value.job_desc)
          .subscribe(responseData => { 
              this.isLoading = false;
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
