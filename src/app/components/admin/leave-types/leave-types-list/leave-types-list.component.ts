import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LeaveService } from "../leave.service";
import { CreateLeaveTypeComponent } from '../create-leave-type/create-leave-type.component';
import { Router } from "@angular/router";


@Component({
  selector: 'app-leave-types-list',
  templateUrl: './leave-types-list.component.html',
  styleUrls: ['./leave-types-list.component.css']
})

export class LeaveTypesListComponent implements OnInit {
  leaves: any= []
  isLoading = false;
  search:string;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  displayedColumns1: string[] = [ 'Leave Type', 'No of Days','Description', 'Carry Forward', 'Action']; 
  
  constructor(public leaveService: LeaveService,
               public dialog: MatDialog,
              private router: Router) { 
          }

ngOnInit(): void {
    this.isLoading = true;
        this.leaveService.getLeaveTypes(this.perPage, this.currentPage, this.search).subscribe((resData:any) => {
          this.leaves=resData.data;
          this.isLoading = false;
          this.Count = resData.count;
         })
  }

onDeleteLeave(id: string){
    this.leaveService.deleteLeaveType(id)
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
  dialogConfig.width= "580px";
  dialogConfig.data = {id: id,mode: mode};
  const dialogRef = this.dialog.open(CreateLeaveTypeComponent, dialogConfig);
  //------After close the dialog dataset Description will be changed
  dialogRef.afterClosed().subscribe(result => {
    this.ngOnInit();
  });
}

}