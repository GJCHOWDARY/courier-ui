import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { TicketsService } from "../tickets.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-ticket-info',
  templateUrl: './ticket-info.component.html',
  styleUrls: ['./ticket-info.component.css']
})
export class TicketInfoComponent implements OnInit {
  isLoading = true;
  ticket: any=[]; 
  data: any= [];
  sankBardata: any={};
  assignedUsers: any=[];
  mode : string;
  isEdit =true;
  userId: string;

  constructor(public ticketsService: TicketsService,
              public route: ActivatedRoute,              
              private dialogRef: MatDialogRef<TicketInfoComponent>,
              private router: Router,private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
            }

  ngOnInit(): void {
    this.isLoading = true;
    this.ticketsService.getTicketById(this.data.id).subscribe( (resData: any) => {
      this.isLoading = false;
      this.ticket = resData.data[0]
    });
  }

close() {
   this.dialogRef.close();
  }


}
