import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap,Params } from "@angular/router";
import { AccountService } from '../account.service'
import { NgForm } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
 userId: String;
 user: any;
 isLoading: boolean=true;
 passwordnotmatch: boolean= false;
 sankBardata: any={};
 horizontalPos:MatSnackBarHorizontalPosition ='right';
 verticalPos:MatSnackBarVerticalPosition ='top';

  constructor(private activatedRoute: ActivatedRoute,
     private router: Router, 
     private _snackBar: MatSnackBar,
     private accountService:AccountService) {
    this.activatedRoute.paramMap.subscribe((paramMap: ParamMap) => {
      this.userId= paramMap.get("userId");
     })
   }

  ngOnInit(): void {
    this.isLoading=true;
    if(!this.userId||this.userId==null){
      this.userId=this.accountService.getUserId();
    }
    this.accountService.getUserInfo(this.userId).subscribe((resData:any) => {
      this.user=resData.user[0];
      this.isLoading=false;
         console.log("role-",this.user);
    })
  }

  updatePassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(form.value.Newpassword == form.value.Confirmpassword){
      this.isLoading = true;
      this.passwordnotmatch = false;
      this.accountService.resetPassword(this.userId,form.value.Currentpassword,form.value.Newpassword,form.value.Confirmpassword)
          .subscribe((resData:any) => {       
            this.isLoading = false;
            this.sankBardata.message="Password Updated."
            this.openSnakBar();
            this.router.navigate(['/authorized/emp/'])
        },
        error => {
          this.isLoading = false;
      });
    }else{
      console.log("password not match")
      this.passwordnotmatch = true;
    }
  }

openSnakBar(){
let config = new MatSnackBarConfig();
config.verticalPosition = this.verticalPos;
config.horizontalPosition = this.horizontalPos;
config.duration=8000; 
 this._snackBar.open(this.sankBardata.message, 'Ok', config);
}

}
