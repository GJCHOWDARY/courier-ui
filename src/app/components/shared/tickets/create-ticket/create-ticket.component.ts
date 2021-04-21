import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TicketsService } from "../tickets.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css']
})
export class CreateTicketComponent implements OnInit {

  isLoading = true;
  ticket: any=[]; 
  disablerole = true;
  data: any= [];
  categoryId: string;
  mode : string;
  isEdit =true;
  userId: string;
  ticket_priority:any=['High', 'Medium','Low']

  constructor(public ticketsService: TicketsService,private dialogRef: MatDialogRef<CreateTicketComponent>,
              public route: ActivatedRoute, private router: Router,
              private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
                this.ticket = { _id: '', ticket_name: '', ticket_desc:'', projectId:{},ticket_priority:''};
            }

  ngOnInit() {
    if (this.data.id  && this.data.mode=='edit') {
          this.ticketsService.getTicketById(this.data.id).subscribe( (resData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            this.ticket = {
              _id: resData.data[0]._id,
              ticket_name: resData.data[0].ticket_name,
              ticket_desc: resData.data[0].ticket_desc,
              projectId: resData.data[0].projectId,
              ticket_priority: resData.data[0].ticket_priority
             };
          });
        }else {
          this.isLoading = false;
          this.mode = "create";
          this.isEdit =false;
          this.userId = null;
        }
      }

  onSave(form: NgForm) {
  if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.ticketsService.addTicket(form.value, this.data.pid).subscribe(responseData => { 
        this.dialogRef.close();
        },
        error => {
          this.isLoading = false;
      });
     } else {
      this.ticketsService.updateTicket( this.ticket, form.value ).subscribe(responseData => { 
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
