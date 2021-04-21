import { Component, OnInit, Inject, ElementRef, ViewChild  } from '@angular/core';
import { TicketsService } from "../../tickets/tickets.service";
import { CommentService } from "../comment.service";
import { TaskService } from "../task.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { ProjectsService } from "../../projects/projects.service";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonPopupComponent } from '../common-popup/common-popup.component'
import { environment } from "../../../../../environments/environment";

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  ticket: any= [];comments: any=[]; tasks: any=[];
  data: any=[]; viewpage: string='tasks';
  isLoading: boolean =true;
  host_ip: string=environment.ip;
  visible = false; isEdit: boolean=false;
  selectable = true;
  removable = true; selectionFilter: string='all';
  editable=true; fileType: String;
  selectedFiles :any=[];
  selectedFileName: string;
  attachment: any=[];
  editSingleTaskForm:any={task_name:'', assignedUsers:[], id:''};
  commentDataForm:any={comment:'', assignedUsers:[], id:''};
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl(); 
  isLoadingComments: boolean=true;
  isLoadingTask: boolean=true;  
  search:string; userId: string;
  perPage = 50; currentPage = 1;  Count = 0;
  pid: string; searchUser: any=[];
  assignedUsers: any=[]; clearFilter:boolean= false;
  sizeOptions = [10, 20, 50];
  sankBardata: any={}; commentEdit:string;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  taskList:any=['To Do', 'Inprogress', 'Done', 'Closed']
  tags:any=[{color:'#49b560',name:'Frontend'},{color:'#f44336', name:'Backend'}, {color:'#ffb300',name:'API'},
   {color:'#0729ca', name:'Issue'}, {color:'#d700ff',name:'Mobile'}, {color:'#009cb5',name:'Future'}, {color:'#000',name:'Other'}]

  @ViewChild('assigneeInput') assigneeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private ticketsService:TicketsService,
              private commentService:CommentService,
              private projectsService:ProjectsService,
              private taskService:TaskService,
              private _snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<CommentsComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
                this.userId=this.commentService.getUserId();
                this.viewpage='comments'
            }

ngOnInit(): void {
    this.isLoading = true;
        this.ticketsService.getTicketById(this.data.tid).subscribe((resTData:any) => {
          this.ticket=resTData.data[0];
            this.isLoading = false;
            this.getComments();
            // this.getTasks();
        })
  }

getComments(){
   this.commentService.getCommentsByTicketId(this.perPage, this.currentPage, this.search, this.data.tid)
        .subscribe((resCData:any) => {
          this.comments=resCData.data;
          this.isLoadingComments=false;
     })
 }

 selectFile(event) {
  this.selectedFiles= event.target.files[0];
  console.log(this.selectedFiles)
   this.selectedFileName= this.selectedFiles.name
   this.fileType= this.selectedFiles.name.split('.')[1] 
}

deleteAttachment(id: string,file_url: string){
 console.log(id,file_url)
 this.commentService.deleteFile(id,file_url).subscribe((resCData:any) => {
        this.comments=resCData.data;
        this.getComments();
    })
}

changeFilter(filter: string){
  this.isLoadingTask=true;
  this.selectionFilter=filter;
  let filterData:any={ userId: null,
                       filter: filter
                    }
    this.taskService.getTaskByTicketId(this.perPage, this.currentPage, this.search, this.data.tid, filterData)
        .subscribe((resCData:any) => {
             this.tasks=resCData.data;
             this.isLoadingTask=false;
             this.clearFilter=false;
             document.getElementById("task").scrollIntoView();  
    })
}

changeTage(tage: any){
  this.isLoadingTask=true;
  this.clearFilter=true;
  this.selectionFilter=tage.name;
  let filterData:any={ userId: null,
                       filter: null,
                       tage: tage.name
                    }
    this.taskService.getTaskByTicketId(this.perPage, this.currentPage, this.search, this.data.tid, filterData)
          .subscribe((resCData:any) => {
           this.tasks=resCData.data;
           this.isLoadingTask=false;
           document.getElementById("task").scrollIntoView();  
    })
}

getTasks(){
  let filterData:any={ userId: null,
                       filter: null,
                       tage: null
                    }
  this.taskService.getTaskByTicketId(this.perPage, this.currentPage, this.search, this.data.tid, filterData)
        .subscribe((resCData:any) => {
           this.tasks=resCData.data;
           this.isLoadingTask=false;
      })
  }

viewPage(value: string){
    this.viewpage=value;
    if(value=='comments'){
      this.isLoadingComments=true;
      this.getComments();
      }else if(value=='attachments'){
        this.getTasks();
      }else if(value=='tasks'){
        this.isLoadingTask=true;
        this.getTasks();
    }
  }

assignUsers(value: boolean){
    this.visible=!value;
  }

onComment(form: NgForm){
  this.isLoadingComments=true
  let data: any={};
    data.comment=form.value.comment;
    data.pid= this.ticket.projectId._id;
    data.tid= this.ticket._id;
    data.file= this.selectedFiles;  
    data.filename= this.selectedFiles.name;
    data.fileType=this.fileType;
    this.commentService.addComment(data).subscribe((resCData:any) => {
      this.isLoadingComments = false; 
      this.selectedFileName='';
      this.selectedFiles=[]
      this.fileType=''
      this.getComments();
      form.reset();
    },error => {
      this.isLoadingComments = false;       
    });
  }

searchUsers(term: string){
    if(term){ 
      var filteredArray = this.ticket.projectId.assignedUsers.filter(x=> 
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

close() {
    this.dialogRef.close();
}

filter(user: any){
  this.isLoadingTask=true;
  let filter:any={userId: user._id}
  this.taskService.getTaskByTicketId(this.perPage, this.currentPage, this.search, this.data.tid, filter)
      .subscribe((resCData:any) => {
         this.tasks=resCData.data;
         this.isLoadingTask=false;
         this.clearFilter=true;
         document.getElementById("task").scrollIntoView();  
    })
}

removeFilter(){
  this.isLoadingTask=true;
  this.clearFilter=false
  this.getTasks();
}

openSnakBar(){
  let config = new MatSnackBarConfig();
  config.verticalPosition = this.verticalPos;
  config.horizontalPosition = this.horizontalPos;
  config.duration=8000; 
   this._snackBar.open(this.sankBardata.message, 'Ok', config);
}

formateName(a,b){
    var l1=a.charAt(0).toUpperCase();
    var l2=b.charAt(0).toUpperCase();
    return l1+l2;
  }

editTask(data: any) {
    console.log(data)
    this.editSingleTaskForm=data; 
    this.isEdit = true;
  }

onEdit(data:any,value){
  console.log(data,value.target.innerText,"000000")
  data.task_name=value.target.innerText;
  this.taskService.updateTask(data).subscribe((resCData:any) => {
    this.assignedUsers=[];
    this.sankBardata.message="Task Updated."
    this.openSnakBar();
    this.visible=false;
    this.getTasks();
  }) 
}

onChangeStatus(task: any, type: string,value: string){
  let data: any={ id: task._id };     
  console.log(task,value,type)
      if(type=='priority'){
          data.task_priority=!task.task_priority;
          data.status=task.status;
          data.starred= task.starred;
        }else if(type=='starred'){
          data.starred=!task.starred;
          data.task_priority=task.task_priority;
          data.status=task.status;
        }else{
          data.starred= task.starred
          data.status=value;
          data.task_priority=task.task_priority;
        }
       this.taskService.updateTaskStatus(data).subscribe((resData :any) => { 
        this.getTasks();
     })
 }

openDialog(task: any, mode:string) {
  const dialogConfig: any = new MatDialogConfig();
      dialogConfig.disableClose = false;
      dialogConfig.autoFocus = true;
      dialogConfig.width = '620px';
      dialogConfig.backdropClass = 'background-color:#000';
      dialogConfig.data = {task, mode: mode};
      const dialogRef = this.dialog.open(CommonPopupComponent, dialogConfig);
      //------After close the dialog dataset Description will be changed
      dialogRef.afterClosed().subscribe(result => {
      this.isLoadingTask=true;
      this.getTasks();
   });
 }
}
