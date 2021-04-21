import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import { AuthService } from "../../auth/auth.service";
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  private token: string;
  isLoading = false; 
  passwordnotmatch: boolean;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  sankBardata: any={};

  constructor(private authService:AuthService,private _snackBar: MatSnackBar,
    public route: ActivatedRoute,private router: Router,) { 
      this.route.queryParams.subscribe((params) => {
        console.log(params);
        if (params.token){
        this.token = params.token;
        this.authService.checkResetToken(params.token)
        } 
      })
    }

  ngOnInit(): void {
  }

  onUpdatePassword(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if(form.value.Newpassword == form.value.Confirmpassword){
        this.isLoading = true;
        this.passwordnotmatch = false;
        let email = localStorage.getItem("emailid");
        this.authService.updatePassword(email, form.value.Newpassword,form.value.Confirmpassword,this.token)
            .subscribe(
              (response: any) => {
                this.isLoading = false;
                if(response.status == false)
                {
                  this.sankBardata.message=response.message;
                  this.openSnakBar();
                  this.router.navigate(['/auth/login']); 
                }
                else{
                  this.sankBardata.message=response.message;
                  this.openSnakBar();
                  this.router.navigate(['/auth/login']); 
                }
              },
              error => {
                this.isLoading = false;
              }
            );
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
