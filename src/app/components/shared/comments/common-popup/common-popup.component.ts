import { Component, OnInit, Inject, ElementRef, ViewChild  } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TicketsService } from "../../tickets/tickets.service";
import { CommentService } from "../comment.service";
import { TaskService } from "../task.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProjectsService } from "../../projects/projects.service";
import { FormBuilder, FormGroup,FormControl,Validators } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-common-popup',
  templateUrl: './common-popup.component.html',
  styleUrls: ['./common-popup.component.css']
})

export class CommonPopupComponent implements OnInit {
  data: any=[];  toppings = new FormControl();
  viewpage: string; isLoading: boolean=true;
  userId: string; tickets:any =[];
  sankBardata: any={}; 
  minDate: Date;  maxDate: Date; minforEndDate: Date;
  fruitCtrl = new FormControl(); 
  rightMostPos: any; searchUser: any=[];
  assignedUsers: any=[]; task:any={};
  tags:any=[{color:'#49b560',name:'Frontend'},{color:'#f44336', name:'Backend'}, {color:'#ffb300',name:'API'}, {color:'#0729ca', name:'Issue'},
   {color:'#d700ff',name:'Mobile'}, {color:'#009cb5',name:'Future'}, {color:'#000',name:'Other'}]
  taskList:any=['To Do', 'Inprogress', 'Done', 'Closed']
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  selectable = true; page: boolean=true;
  removable = true;ticketId: any;
  selectedTage: any=[];

  @ViewChild('assigneeInput') assigneeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private ticketsService:TicketsService, private commentService:CommentService,
              private projectsService:ProjectsService, private taskService:TaskService,
              private _snackBar: MatSnackBar, private dialogRef: MatDialogRef<CommonPopupComponent>,
              private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
                this.task = { _id: '', task_name: '', task_desc:'', assignedUsers:[], start_date:'', end_date:''};
                this.userId=this.commentService.getUserId();
                this.viewpage='comments'
                console.log(this.data)
                const currentYear = new Date().getFullYear();
                this.minDate = new Date();
                this.maxDate = new Date(currentYear + 0, 11, 31);
                console.log(this.maxDate,this.minDate);
            }

  ngOnInit(): void {
    if (this.data.task._id  && this.data.mode=='update') {
        this.task =this.data.task; 
        this.selectedTage=this.data.task.tags;   
        this.assignedUsers=this.data.task.assignedUsers
     } 
     this.isLoading=false
  }

  comparer(o1: any, o2: any): boolean {
    // if possible compare by object's name, and not by reference.
    return o1 && o2 ? o1.name === o2.name : o2 === o2;
  }

  searchTickets(term: string){
    this.isLoading=true;
    if(term){ 
      this.ticketsService.getTicketsByProjectId(0,1, term, this.data.task.projectId._id).subscribe((resData:any) => {
          this.tickets=resData.data; 
          this.isLoading=false;
        })
    }
  }

  searchUsers(term: string){
    if(term){ 
      var filteredArray = this.data.task.projectId.assignedUsers.filter(x=> 
        x.first_name.toLowerCase().includes(term)||x.last_name.toLowerCase().includes(term) );
       console.log(filteredArray);
      this.searchUser = filteredArray;
    }
  }

  displayFn(user: any) {
    return user ? user.first_name+' '+user.last_name : '';
    }
  
  onSelection(event: MatAutocompleteSelectedEvent): void {
    const value:any = event.option.value;
    let index = this.assignedUsers.findIndex(option => option._id === value._id);
    console.log(index,value)
    if (index == -1) {
      // Add our fruit 
        this.assignedUsers.push(event.option.value);   
        this.assigneeInput.nativeElement.value = '';
        this.fruitCtrl.setValue(null);
      } else{
        this.sankBardata.message="User Allready Exist in this Task."
        this.openSnakBar();
        this.fruitCtrl.setValue(null);
      }
   } 

  displayFn1(ticket: any) { 
    return ticket ? ticket.ticket_name : '';
  }
  

  selected(event: MatAutocompleteSelectedEvent): void {
    this.assignedUsers.push(event.option.viewValue);
    this.assignedUsers.nativeElement.value = '';
    this.assignedUsers.setValue(null);
  }
  
  remove(user: string): void {
    const index = this.assignedUsers.indexOf(user);
  
    if (index >= 0) {
      this.assignedUsers.splice(index, 1);
    }
  }

  openSnakBar(){
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration=8000; 
     this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }
  
  onCreate(form: NgForm){
    if (form.invalid) {
        return;
      }
    this.isLoading=true;
    if(this.data.mode=='update'){
        this.data.task.assignedUsers=this.assignedUsers;
        this.data.task.tags=this.selectedTage;
        this.taskService.updateTask(this.data.task).subscribe((resData :any) => { 
            this.isLoading = false; 
            this.sankBardata.message="Task Updated."
            this.openSnakBar(); 
            this.dialogRef.close();      
          },error => {
            this.isLoading = false;       
        });
      }else{
        let data: any={}
        data.task_name=form.value.task_name;
        data.task_desc=form.value.task_desc;
        data.tags=this.selectedTage;
        data.start_date=new Date(form.value.start_date);
        data.end_date=new Date(form.value.end_date);
        data.assignedUsers=this.assignedUsers;
        data.pid= this.data.task.projectId._id;
        data.tid= this.data.task._id;
          this.taskService.addTask(data).subscribe((resCData:any) => {
              this.isLoading = false; 
              this.sankBardata.message="Task Created."
              this.openSnakBar(); 
              this.dialogRef.close();  
          },error => {
            this.isLoading = false;       
        });
      }
   }

  moveTask(form: NgForm){ 
    if (form.invalid) {
        return;
      }
      this.isLoading = true; 
      this.taskService.moveTasktoTicket(this.data.task,form.value).subscribe((resData :any) => { 
          this.sankBardata.message="Task Updated."
          this.openSnakBar();       
          this.dialogRef.close();
        },error => {
          this.isLoading = false;       
    });
  }

  viewPage(){
    this.page=!this.page;
   }

  close() {
    this.dialogRef.close();
  }

}
