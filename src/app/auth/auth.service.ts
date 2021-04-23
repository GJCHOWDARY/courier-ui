import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthData } from "./auth-data.model";
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
const BACKEND_URL = environment.apiUrl + "/auth";
const BACKEND_USER_URL = environment.apiUrl + "/users";

@Injectable({ providedIn: "root" })
export class AuthService {
  sankBardata: any = {};
  private isAuthenticated = false;
  private isAdmin = false;
  private isResetPassword = false;
  private token: string;
  private email: string;
  private name: string;
  private role: number;
  private tokenTimer: any;
  private userId: string;
  private authStatusListener = new Subject<boolean>();

  horizontalPos: MatSnackBarHorizontalPosition = 'right';
  verticalPos: MatSnackBarVerticalPosition = 'top';

  constructor(private http: HttpClient, private router: Router,
    private _snackBar: MatSnackBar) { }

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }
  getIsAdmin() {
    return this.isAdmin;
  }

  getUserId() {
    return this.userId;
  }

  getUserEmail() {
    return this.email;
  }

  getUserRole() {
    return this.role;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getResetPassword() {
    return this.isResetPassword;
  }

  checkResetToken(token: string) {
    this.http.get(BACKEND_URL + `/reset_password/${token}`).subscribe(
      (response: any) => {
        if (response.status) {
          return response.status
        } else {
          this.sankBardata.message = response.message;
          this.openSnakBar()
          this.router.navigate(['/'])
        }
      })
  }

  verifyUserEmail(email: string) {
    return this.http.put(BACKEND_URL + `/verifyemail/${email}`, { email })
  }

  login(email: string, password: string) {
    localStorage.clear();
    const authData: AuthData = { email: email, password: password };
    return this.http
      .post<{ token: string; expiresIn: number; userId: string; password_update: number; role: string, email: string, name: string }>(
        BACKEND_URL + "/login",
        authData
      )
  }

  createCustomer(customer: any) {
    localStorage.clear();
    console.log(customer, ":00000000")
    return this.http.post(BACKEND_URL + "/customer_signup", customer)
  }

  sendemail(email: string, name: string, organisation: string, message: string) {
    const saveData = { email: email, name: name, organization: organisation, message: message };
    // return this.http
    // .post(
    //   BACKEND_URL + "/sendmessage",
    //   saveData
    // )
  }

  saveLoginInfo(response: any) {
    const token = response.token;
    if (token) {
      this.token = token;
      const expiresInDuration = response.expiresIn;
      this.setAuthTimer(expiresInDuration);
      this.isAuthenticated = true;
      this.userId = response.userId;
      this.email = response.email;
      this.name = response.name;
      this.role = response.role;
      this.authStatusListener.next(true);
      const now = new Date();
      const expirationDate = new Date(
        now.getTime() + expiresInDuration * 1000
      );
      this.saveAuthData(token, expirationDate, this.userId, response.role, response.email, response.name);
    }
  }

  updateProfileImg(data: any) {
    this.http.post(BACKEND_USER_URL + `/changeprofileimg`, data).subscribe(
      (res: any) => {
        this.authStatusListener.next(true);
        this.sankBardata.message = 'Profile Picture Updated!';
        this.openSnakBar()
      },
      error => {
      }
    );
  }

  forgotPassword(email: string) {
    return this.http.post(BACKEND_URL + "/forgot_password", { email })
  }

  updatePassword(email: string, password: string, confirmPassword: string, token: string) {
    return this.http.post(BACKEND_URL + "/update_reset_password", { email, password, confirmPassword, token })
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.email = authInformation.email;
      this.role = Number(authInformation.role);
      this.name = authInformation.name;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    return this.http.post(BACKEND_URL + "/logout", { userId: this.userId })
      .subscribe((response: any) => {
        this.token = null;
        this.isAuthenticated = false;
        this.authStatusListener.next(false);
        this.clearAuthData();
        localStorage.clear();
        this.userId = null;
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/auth/login']);
      })
  }

  private setAuthTimer(duration: number) {
     this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, role: string, email: string, name: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    localStorage.setItem("username", String(name));
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("username");
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      email: email,
      role: role,
      name: name
    };
  }

  getUserData() {
    return {
      token: this.token,
      userId: this.userId,
      name: this.name,
      email: this.email,
      role: this.role,
    };
  }

  getUserDetails() {
    return this.http.get(BACKEND_USER_URL + `/getuserdetials/` + this.userId)
  } 
  
  trackOrders(orderIds: string) {
    let queryParams = `?orderIds=${orderIds}`;

    return this.http.get(BACKEND_URL + `/trackOrders` + queryParams)
  }
  
  getUserSkills(userId: string) {
    return this.http.get(BACKEND_USER_URL + `/getuserskills/` + userId)
  }

  getEmpAnniversaries() {
    return this.http.get(BACKEND_USER_URL + `/getanniversaries/`)
  }

  openSnakBar() {
    let config = new MatSnackBarConfig();
    config.verticalPosition = this.verticalPos;
    config.horizontalPosition = this.horizontalPos;
    config.duration = 8000;
    this._snackBar.open(this.sankBardata.message, 'Ok', config);
  }
}
