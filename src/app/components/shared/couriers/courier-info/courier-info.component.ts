import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { OrderService } from "../courier.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-courier-info',
  templateUrl: './courier-info.component.html',
  styleUrls: ['./courier-info.component.css']
})

export class CourierInfoComponent implements OnInit {
  isLoading = true;
  project: any = [];
  data: any = [];
  sankBardata: any = {};
  assignedUsers: any = [];
  mode: string;
  isEdit = true;
  userId: string;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(public orderService: OrderService,
    public route: ActivatedRoute,
    private dialogRef: MatDialogRef<CourierInfoComponent>,
    private router: Router, private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
    this.data = data;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.orderService.getOrderById(this.data.id).subscribe((resData: any) => {
      this.isLoading = false;
      this.project = resData.data[0]
    });
  }

  close() {
    this.dialogRef.close();
  }


}
