import { Component, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { Subject } from "rxjs";
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  hide: boolean = true;
  isAuthenticated: boolean = false;
  isDisabled: boolean = false;
  constructor(public authService: AuthService, private router: Router,) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    if (this.isAuthenticated) {
      this.router.navigate(["/authorized/emp"]);
    }
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isDisabled = true;
    this.authService.login(form.value.email, form.value.password).subscribe((response) => {
      this.authService.saveLoginInfo(response);
      this.router.navigate(["/authorized/emp"]);
      // this.isDisabled=false;
    },
      error => {
        this.isDisabled = false;
      });
  }
  test() {
    this.router.navigate(['/auth/reset'], { queryParams: { token: '289108f3024f84a6b6e798ea59c9d1bac4069c77' } })

  }
}
