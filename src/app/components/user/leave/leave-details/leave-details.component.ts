import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { LeaveService } from "../leave.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-leave-details',
  templateUrl: './leave-details.component.html',
  styleUrls: ['./leave-details.component.css']
})
export class LeaveDetailsComponent implements OnInit {

  isLoading = true;
  category: any=[]; 
  disablerole = true;
  data: any= []; leave: any=[];
  categoryId: string;
  mode : string;
  isEdit =true;
  userId = null;

  constructor(public leaveService: LeaveService,
              private dialogRef: MatDialogRef<LeaveDetailsComponent>,
              public route: ActivatedRoute,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                console.log(data,"0000000")
                this.data = data.data;
                this.leave=data.balance;
             }

ngOnInit(): void { 
      this.isLoading=false;
     }

close() {
        this.dialogRef.close();
    }

}
