import { Component, OnInit } from '@angular/core';
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from "rxjs";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { OrderService } from "../courier.service";
import { CreateCouriersComponent } from '../create-courier/create-courier.component';
import { CourierInfoComponent } from '../courier-info/courier-info.component';
import { AuthService } from "../../../../auth/auth.service"

@Component({
  selector: 'app-couriers',
  templateUrl: './couriers.component.html',
  styleUrls: ['./couriers.component.css']
})
export class CouriersComponent implements OnInit {

  orders: any = []
  userData: any;
  isLoading = false;
  search: string;
  filter: string;
  viewType: boolean = false;
  perPage = 10;
  currentPage = 1;
  Count = 0;
  sizeOptions = [10, 20, 50];
  start_date: Date; end_date: Date;
  displayedColumns: string[] = ['Name', 'Description', 'Mobile', 'Amount', 'Status', 'CreatedAt', 'UpdatedAt', 'Action'];

  filterTypes: any = [
    { title: 'Confirmed', id: 1 },
    { title: 'Shipped', id: 2 },
    { title: 'Faild to Ship', id: 3 },
    { title: 'Out for Delivery', id: 4 },
    { title: 'Delivered', id: 5 },
    { title: 'Failed to Deliver', id: 4 }]

  constructor(
    public orderService: OrderService,
    public route: ActivatedRoute,
    private authService: AuthService,
    public dialog: MatDialog,
    private router: Router,
  ) {
    const d = new Date(),
      month = d.getMonth(),
      year = d.getFullYear(),
      day = d.getDate();
    this.start_date = new Date(`${year}/01/01`);
    this.end_date = new Date(`${year}/12/31`);
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.userData = this.authService.getUserData()
    this.orderService.getOrders(this.perPage, this.currentPage, this.filter, this.start_date, this.end_date).subscribe((resData: any) => {
      this.orders = resData.data;
      this.Count = resData.count;
      this.isLoading = false;
    })
  }

  onDelete(id: string) {
    this.orderService.deleteOrder(id)
      .subscribe((resData: any) => {
        this.ngOnInit();
      })
  }

  onSearch() {
    this.ngOnInit();
  }

  changeView() {
    this.viewType = !this.viewType;
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

  openDialog(id: number, mode: string) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '948px';
    dialogConfig.data = { id: id, mode: mode };
    const dialogRef = this.dialog.open(CreateCouriersComponent, dialogConfig);
    //------After close the dialog dataset Description will be changed
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  projectInfoDialog(pid: number) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = '598px';
    dialogConfig.data = { id: pid };
    const dialogRef = this.dialog.open(CourierInfoComponent, dialogConfig);
    //------After close the dialog dataset Description will be changed
    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }
}