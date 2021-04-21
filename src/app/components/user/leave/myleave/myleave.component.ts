import { Component, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LeaveService } from "../leave.service";
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-myleave',
  templateUrl: './myleave.component.html',
  styleUrls: ['./myleave.component.css']
})

export class MyleaveComponent implements OnInit {
  leaves: any= []
  isLoading = true;
  host_ip: string=environment.ip;
  leaveBalance: any;
  filter:string; perPage = 10;
  start_date;  end_date;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50, 100];
  displayedColumns1: string[] = [ 'Leave Type', 'Applied Date', 'Start Date', 'End Date', 'No of Days Taken', 'Loss of Pay', 'Status', 'Action'];
  userId;
  filterTypes: any=[{title:'Approved',id:1},{title:'Rejected',id:2},{title:'Pending',id:3},{title:'Canceled',id:4}]
  pageEvent: PageEvent;

  
  constructor(public leaveService: LeaveService,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              private router: Router,) {
              this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
              this.userId= paramMap.get("userId");
            })
            let d= new Date(), month = d.getMonth(),
            year = d.getFullYear(), day = d.getDate();
            this.start_date=new Date(`${year}/01/01`);
            this.end_date=new Date(`${year}/12/31`);
          }

ngOnInit(): void {          
   this.isLoading = true;
   if(!this.userId||this.userId==null){
    this.userId=this.leaveService.getUserId();
  }
   this.getLeaveBalance();
    this.leaveService.getLeaves(this.perPage, this.currentPage, this.filter, this.userId, this.start_date, this.end_date).subscribe((catData:any) => {
          this.leaves=catData.data;
          this.isLoading = false;
          this.Count = catData.count;
      })
  }

onDeleteLeave(id: string){
    this.leaveService.deleteLeave(id).subscribe((resData :any) => { 
            this.ngOnInit();
      })
}

updateLeaveStatus(data: any, status: string){
  this.leaveService.updateLeaveStatus(data,status).subscribe((resData :any) => { 
          this.ngOnInit();
    })
}

getLeaveBalance(){
  this.leaveService.getLeaveBalanceUser(this.userId).subscribe((leaveData:any)=>{
    this.leaveBalance=leaveData.balance[0];            
    this.isLoading = false;
  })
}

checkChangesDates(type: string, event) {
  console.log('changeeee')
  if(type=='startDate'){
    this.start_date= event.value;
  }
  if(type=='endDate'){
   this.end_date= event.value; 
  } 
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
  dialogConfig.data = { data, balance: this.leaveBalance };
  const dialogRef = this.dialog.open( LeaveDetailsComponent, dialogConfig );
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

calHours(n:number){
    let s:any=Math.abs(n);
    let s1=s-Math.floor(s);
    let s2:any=s1*9.5*60
    let hours = Math.floor(s2/60);  
    let minutes = Math.round(s2%60);
    // console.log(s,s1,s2,"====",hours,Math.round(minutes),"++++")
    // let num:any = (s1*9.5*60).toFixed(2);
    // var hours = (num / 60);
    // var rhours = Math.floor(hours);
    // var minutes = (hours - rhours) * 60;
    // var rminutes = Math.round(minutes);
    // console.log(Math.floor(s),n,num + ',,,'+ hours+ " minutes = " + rhours + " hour(s) and " + rminutes + " minute(s).");
    return Math.floor(s)+" days "+ hours + " hour(s) and " + minutes + " minute(s)."
  }

}