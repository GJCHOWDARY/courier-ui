import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { ManagerService } from "../manager.service";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';

@Component({
  selector: 'app-myleave',
  templateUrl: './approve-user-leaves.component.html',
  styleUrls: ['./approve-user-leaves.component.css']
})

export class ApproveUserLeaveComponent implements OnInit {

  leaves: any= []
  isLoading = true;
  leaveBalance: any;
  filter:string; perPage = 10;
  start_date;  end_date;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50, 100];
  displayedColumns1: string[] = [ 'Leave Type', 'Applied Date', 'Start Date', 'End Date', 'No of Days Taken', 'Loss of Pay', 'Status', 'Action'];
  userId: String; assigneeId: String;
  filterTypes: any=[{title:'Approved',id:1},{title:'Rejected',id:2},{title:'Pending',id:3},{title:'Canceled',id:4}]
  pageEvent: PageEvent;
  isDisabled:boolean=false;
  
  constructor(public managerService: ManagerService, private activatedRoute: ActivatedRoute,
              public dialog: MatDialog, private router: Router,) {
              this.userId = this.managerService.getUserId(); 
              this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
              this.userId= paramMap.get("userId");
            })
 
      let d= new Date(), month = d.getMonth(),
          year = d.getFullYear(), day = d.getDate();

      this.start_date=new Date(`${year}/01/01`);
      this.end_date=new Date(`${year}/12/31`);             
    }

ngOnInit(): void {         
   this.assigneeId = this.managerService.getUserId();  
   let data: any={
    assigneeId:this.assigneeId
    }    
    if(this.userId){
      data.userId= this.userId;
    }
    this.managerService.getAssignedLeaves(this.perPage, this.currentPage, this.filter, this.start_date, this.end_date, data).subscribe((catData:any) => {
          this.leaves=catData.data;
          this.isLoading = false;
          this.Count = catData.count;
      })
  }

  updateLeaveStatus(data: any, status: string){
    this.isDisabled = true; 
    this.managerService.updateLeaveStatus(data,status).subscribe((resData :any) => {  
        this.ngOnInit();
      },error => {
        this.isDisabled = false;       
      });
  }
  
  approveLeave(data: any, status: string){
    this.isDisabled = true; 
    this.managerService.approveLeave(data,status).subscribe((resData :any) => {  
      this.isLoading = true; 
        this.ngOnInit();
      },error => {
        this.isDisabled = false;       
      });
  }
  
  checkChangesDates(type: string, event) {
    console.log('changeeee')
    if(type=='startDate'){
      this.start_date= event.value;
    }
    if(type=='endDate'){
     this.end_date= event.value; 
    }  
    this.isLoading = true; 
    this.ngOnInit();
  }
  
  onChangeFilter(){
    this.isLoading = true;
    this.ngOnInit();
  }
  
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize; 
    this.ngOnInit();
   }
  
   openDialog(data:any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width='610px';
    dialogConfig.data = { data };
    const dialogRef = this.dialog.open( LeaveDetailsComponent, dialogConfig );
    //------After close the dialog dataset Description will be changed
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}