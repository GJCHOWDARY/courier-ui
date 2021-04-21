import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { ProjectsService } from "../projects.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { NgForm } from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {FormControl} from '@angular/forms';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.css']
})
export class CreateProjectComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl(); 
  isLoading = true;
  project: any=[]; 
  data: any= [];searchUser: any;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  sankBardata: any={};
  assignedUsers: any=[];
  mode : string;
  isEdit =true;
  userId: string;
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  @ViewChild('assigneeInput') assigneeInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(public projectsService: ProjectsService, private dialogRef: MatDialogRef<CreateProjectComponent>,
              public route: ActivatedRoute, private _snackBar: MatSnackBar,
              private router: Router,private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) data) {
                this.data = data;
                this.project = { _id: '', project_name: '', project_desc:'', assignedUsers:[]};
            }

  ngOnInit() {
    if (this.data.id  && this.data.mode=='edit') {
          this.projectsService.getProjectById(this.data.id).subscribe( (resData: any) => {
            this.isLoading = false;
            this.isEdit =true;
            this.mode = "edit";
            console.log('ttt',resData)
            this.project = {
              _id: resData.data[0]._id,
              project_name: resData.data[0].project_name,
              project_desc: resData.data[0].project_desc,
              assignedUsers: resData.data[0].assignedUsers
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
      this.projectsService.addProject(form.value, this.userId)
          .subscribe(responseData => { 
            this.dialogRef.close();
           },error => {
           this.isLoading = false;
       });
     } else {
      this.projectsService.updateProject( this.project, form.value )
          .subscribe(responseData => { 
              this.dialogRef.close();
         },error => {
          this.isLoading = false;
      });
    }
 }

 searchUsers(term: string){
  if(term){
  this.projectsService.search(term).subscribe(
    data => {
      this.searchUser = data.users;
    })
  }
}

displayFn(user: any) {
  return user ? user.first_name+' '+user.last_name : '';
  }

onSelection(event: MatAutocompleteSelectedEvent): void {
  const value:any = event.option.value;
  let index = this.project.assignedUsers.findIndex(option => option._id === value._id);
  console.log(index,value)
  if (index == -1) {
    // Add our fruit 
      this.project.assignedUsers.push(event.option.value);   
      this.assigneeInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
    } else{
      this.sankBardata.message="User Allready Exist in this Project."
      this.openSnakBar();
      this.fruitCtrl.setValue(null);
    }
 } 

selected(event: MatAutocompleteSelectedEvent): void {
  this.project.assignedUsers.push(event.option.viewValue);
  this.project.assignedUsers.nativeElement.value = '';
  this.project.assignedUsers.setValue(null);
}

remove(user: string): void {
  const index = this.project.assignedUsers.indexOf(user);

  if (index >= 0) {
    this.project.assignedUsers.splice(index, 1);
  }
}

close() {
   this.dialogRef.close();
  }

openSnakBar(){
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration=8000; 
     this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }
}
