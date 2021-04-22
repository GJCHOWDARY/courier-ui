import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  hide: boolean = true;
  private authStatusSub= new Subscription();

  constructor(
    public authService: AuthService,
    private router: Router,
    ) {}

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
    if(form.value.password!==form.value.cpassword){
      alert(`Password & confirm password don't match.`);
      return;
    }
    this.isLoading = true;
    this.authService.createUser(form.value.email, form.value.password, form.value.name).subscribe((response) => {
      this.router.navigate(["/auth/login"]);
    });     
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}