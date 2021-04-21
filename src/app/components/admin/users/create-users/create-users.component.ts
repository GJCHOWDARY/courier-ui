import { Component, OnInit, Inject, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { NgForm } from "@angular/forms";
import { UsersService } from "../../users/user.service";
import { User } from "../../users/user.model";
import { AuthService } from "../../../../auth/auth.service";
import { MatDialog, MatDialogRef, MatDialogConfig, MAT_DIALOG_DATA } from "@angular/material/dialog";


@Component({
  selector: "app-dataset-create",
  templateUrl: "./create-users.component.html",
  styleUrls: ["./create-users.component.css"]
})

export class CreateUsersComponent implements OnInit, OnDestroy {
  searchTerm : FormControl = new FormControl();
  searchUser: any=[];
  user: User;
  data: any =[];
  isLoading = true;
  rolesdata: any=[];subCatData: any=[];
  userData: any=[]; jobsData: any=[];catData: any=[]
  isEdit = false;  
  mode = "create";
  disabledLabel = false;
  private userId: string;
  private authStatusSub: Subscription;
  currentPage = 1; 
  empStatus:any=[{title:"Freelance",value:0},{title:"Full time Contract",value:1},{title:"Full-Time Permanent",value:2},{title:"Full-Time Probation",value:3},
                 {title:"Part-Time Contract",value:4},{title:"Part-Time Internship",value:5}]

  workShift:any=[{title:"Full Day Work",value:0},{title:"Half Day Work",value:1}]
  
  constructor(
    public userService: UsersService,
    private dialogRef: MatDialogRef<CreateUsersComponent>,
    public route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data) {
      console.log(data,"0000000")
      this.data = data;   
       this.userService.getRoles().subscribe((roleData:any) => {this.rolesdata=roleData.data; }) ;
       this.userService.getCategories().subscribe((resData:any) => {this.catData=resData.data; }) 
       this.userService.getJobs().subscribe((resData:any) => {this.jobsData=resData.data; }) 
    }

ngOnInit() {      
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus => {});
    this.userData = this.authService.getUserData();
    this.user = { id:'', email:'', personal_email:'', first_name:'', last_name:'', work_shift:'', employment_status:'', job_specification:'',
    job_location:'', leave_balance:'', address1:'',address2:'', join_date: '', categoryId:'', subcategoryId:'', jobId:'' , role:'',  mobile:'',
    country: '', state: '', city: '', zip_code: '', jobDetailsId:'', userAddressId:'', assignee:'' }   
    
    if(this.data.id && this.data.mode=='edit'){
        this.mode = "edit";
        this.disabledLabel=true;
        this.isEdit = false;
          this.userService.getUser(this.data.id).subscribe( (userData: any) => {
            this.isLoading = false;
            userData=userData.user[0];
            this.onChangeUser(userData.jobDetailsId.categoryId._id) 
            this.user = {
              id: userData._id, email: userData.email,
              first_name: userData.first_name, last_name: userData.last_name,
              role:userData.role, mobile: userData.mobile, 
              work_shift: userData.jobDetailsId.work_shift, 
              employment_status: userData.jobDetailsId.employment_status, 
              job_specification: userData.jobDetailsId.job_specification,
              job_location: userData.jobDetailsId.job_location, 
              leave_balance: userData.leave_balance, 
              join_date: userData.jobDetailsId.join_date, 
              categoryId: userData.jobDetailsId.categoryId._id, 
              subcategoryId: userData.jobDetailsId.subcategoryId._id, 
              jobId: userData.jobDetailsId.jobId._id,
              jobDetailsId: userData.jobDetailsId._id,
              userAddressId: userData.userAddressId._id,
              city: userData.userAddressId.city,
              state: userData.userAddressId.state,
              country: userData.userAddressId.country,
              address1: userData.userAddressId.address1,
              address2: userData.userAddressId.address2,
              zip_code: userData.userAddressId.zip_code,
              personal_email: userData.personal_email,
              assignee: userData.assignee
              };
          });
      } else {
        this.isLoading = false;
        this.mode = "create";
        this.isEdit =true;
        this.userId = null;
      }
  }

// TODO: User
onSaveUser(form: NgForm) {
 if (form.invalid) {
     return;
   }
   this.isLoading = true;
   if (this.mode === "create") {
     this.userService.addUser(form).subscribe(responseData => {
        this.dialogRef.close();
          form.reset();
        },error => {  
          this.isLoading = false;
      });
    } else {
     this.userService.updateUser(this.data.id,form, this.user.jobDetailsId, this.user.userAddressId)
        .subscribe(responseData => {
          this.dialogRef.close();
          form.reset();
        },error => {
          this.isLoading = false;
      });
   }
 }

 onChangeUser(id){
    this.userService.getSubcatByCatId(id).subscribe((resData:any) => {
      this.subCatData=resData.data; 
    }) 
 }

searchUsers(term: string){
  this.userService.search(term).subscribe(
    data => {
      this.searchUser = data.users;
  })
}

displayFn(user: any): string {
  return user ? user.first_name+' '+user.last_name : '';
}

close() {
    this.dialogRef.close();
}

ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
