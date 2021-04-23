import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { LeaveService } from "../leave.service";
import { Router, ActivatedRoute, ParamMap, Params } from "@angular/router";
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { LeaveDetailsComponent } from '../leave-details/leave-details.component';


@Component({
  selector: 'app-myleave',
  templateUrl: './all-leaves.component.html',
  styleUrls: ['./all-leaves.component.css']
})

export class AllLeavesComponent implements OnInit {
  @Component({
    selector: 'app-myleave',
    templateUrl: './myleave.component.html',
    styleUrls: ['./myleave.component.css']
  })

  leaves: any = []
  isLoading = true;
  leaveBalance: any;
  filter: string; perPage = 10;
  start_date: Date; end_date: Date;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50, 100];
  displayedColumns1: string[] = ['Leave Type', 'Applied Date', 'Start Date', 'End Date', 'No of Days Taken', 'Loss of Pay', 'Status', 'Action'];
  userId;
  filterTypes: any = [{ title: 'Approved', id: 1 }, { title: 'Rejected', id: 2 }, { title: 'Pending', id: 3 }, { title: 'Canceled', id: 4 }]
  pageEvent: PageEvent;


  constructor(public leaveService: LeaveService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId = paramMap.get("userId");
    })
    const d = new Date(),
      month = d.getMonth(),
      year = d.getFullYear(),
      day = d.getDate();
    this.start_date = new Date(`${year}/01/01`);
    this.end_date = new Date(`${year}/12/31`);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.leaveService.getAllLeaves(this.perPage, this.currentPage, this.filter, this.start_date, this.end_date).subscribe((catData: any) => {
      this.leaves = catData.data;
      this.isLoading = false;
      this.Count = catData.count;
    })
  }

  onDeleteLeave(id: string) {
    this.leaveService.deleteLeave(id).subscribe((resData: any) => {
      this.ngOnInit();
    })
  }

  updateLeaveStatus(data: any, status: string) {
    this.leaveService.updateLeaveStatus(data, status).subscribe((resData: any) => {
      this.ngOnInit();
    })
  }

  approveLeave(data: any, status: string) {
    this.leaveService.approveLeave(data, status).subscribe((resData: any) => {
      this.ngOnInit();
    })
  }

  checkChangesDates(type: string, event) {
    console.log('changeeee')
    if (type == 'startDate') {
      this.start_date = event.value;
    }
    if (type == 'endDate') {
      this.end_date = event.value;
    }
    this.ngOnInit();
  }

  onChangeFilter() {
    this.isLoading = true;
    this.ngOnInit();
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.perPage = pageData.pageSize;
    this.ngOnInit();
  }

  openDialog(data: any) {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '610px';
    dialogConfig.data = { data };
    const dialogRef = this.dialog.open(LeaveDetailsComponent, dialogConfig);
    //------After close the dialog dataset Description will be changed
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

}