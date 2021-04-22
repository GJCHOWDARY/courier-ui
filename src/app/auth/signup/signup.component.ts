import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  hide: boolean = true;
  horizontalPos: MatSnackBarHorizontalPosition = 'right';
  verticalPos: MatSnackBarVerticalPosition = 'top';
  sankBardata: any = {};
  private authStatusSub = new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (form.value.password !== form.value.cpassword) {
      alert(`Password & confirm password don't match.`);
      return;
    }
    this.isLoading = true;
    this.authService.createCustomer(form.value).subscribe((response) => {
      this.sankBardata.message = 'Your profile created!';
      this.openSnakBar()
      this.router.navigate(["/auth/login"]);
    });
  }


  openSnakBar() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration = 8000;
    this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}