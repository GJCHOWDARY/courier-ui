import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service'
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from "@angular/router";


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  isLoading: boolean=true;
  horizontalPos:MatSnackBarHorizontalPosition ='right';
  verticalPos:MatSnackBarVerticalPosition ='top'; 
  sankBardata: any={};
  
  constructor(private authService:AuthService, private router:Router, private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isLoading = false;
  }
  
  onForgot(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.forgotPassword(form.value.email).subscribe(
      (response: any) => { 
        this.isLoading = false;
        this.sankBardata.message='Rest Password Link Send to Your Email.';
        this.openSnakBar()
        localStorage.setItem("emailid", form.value.email);
        this.router.navigate(["/"]);
      },
      error => {
        this.isLoading = false;
      }
    );
  }
  
 openSnakBar(){
  let config = new MatSnackBarConfig();
  config.verticalPosition = this.verticalPos;
  config.horizontalPosition = this.horizontalPos;
  config.duration=8000; 
   this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }
}
