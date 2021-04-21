import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { JobService } from "../job.service";
import { CreateJobComponent } from '../create-job/create-job.component';


@Component({
  selector: 'app-jobs-list',
  templateUrl: './jobs-list.component.html',
  styleUrls: ['./jobs-list.component.css']
})
export class JobsListComponent implements OnInit {
  jobs: any= []
  isLoading = true;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Job Title','Description' ,'Action'];
  
  
  constructor(
    public jobService: JobService,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
   ) {}

ngOnInit(): void {
    this.isLoading = true;
        this.jobService.getJobs(this.perPage, this.currentPage, this.search).subscribe((catData:any) => {
          this.jobs=catData.data;
          this.isLoading = false;
          this.Count = catData.count;
            console.log("role-",this.Count);
        })
  }

onDelete(id: string){
    this.jobService.deleteJob(id)
        .subscribe((resData :any) => { 
            this.ngOnInit();
      })
}
 
onChangedPage(pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.perPage = pageData.pageSize; 
  this.ngOnInit();
 }
 
 onSearch(){
  this.ngOnInit();
  }

 openDialog(id: number, mode:string) {
  const dialogConfig = new MatDialogConfig();

  dialogConfig.disableClose = true;
  dialogConfig.autoFocus = true;
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateJobComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

}