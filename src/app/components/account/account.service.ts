import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";
import { NgForm } from '@angular/forms';
import { AuthService } from "../../auth/auth.service"

const BACKEND_URL_USER = environment.apiUrl + "/users";
const BACKEND_URL_LEAVE = environment.apiUrl + "/leave";
const BACKEND_URL_TASKS= environment.apiUrl + "/tasks";
const BACKEND_URL_COURIER= environment.apiUrl + "/courierOrders";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private http: HttpClient,private authService:AuthService, private router: Router) {}
  
getUserInfo(userId) { 
    return this.http.get(BACKEND_URL_USER+'/'+userId);
  }

updateProfileInfo(id, form: NgForm) {
    let profileData = {
      id: id,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      personal_email: form.value.personal_email,
      date_of_birth: form.value.date_of_birth,
      marital_status: form.value.marital_status,
      nationality: form.value.nationality,
      aadhar_no: form.value.aadhar_no,
      pan_no: form.value.pan_no,
      gender: form.value.gender,
      married_date: form.value.married_date,
      mobile: form.value.mobile,
     };
     return this.http.put(BACKEND_URL_USER+"/updateprofileinfo/"+id, profileData) 
  }

updateContactInfo(id:string, contactData: any) {
    console.log(contactData)
    contactData.id=id;
     console.log(contactData)
     return this.http.put(BACKEND_URL_USER+"/updatecontactinfo/"+id, contactData) 
  }

  resetPassword(id, currenPasswprd: string, password: string,confirmPassword: string) {
    return this.http.post(BACKEND_URL_USER + "/change_password", {id,currenPasswprd,confirmPassword,password})
  }

getUserId(){
    return this.authService.getUserId()
  }
  
getChartData(){
    return this.http.get(BACKEND_URL_LEAVE+'/chartdata');
  }
  
getUsers(currentPage:number,size:number){
  var queryParams = `?page=${currentPage}&pagesize=${size}`;
    return this.http.get(BACKEND_URL_USER+'/allusers'+queryParams);
  }

getDetails(){
    return this.http.get(BACKEND_URL_TASKS+'/getdetails');
  }

getOrderDetails(){
  return this.http.get(BACKEND_URL_COURIER+'/getOrderDetials');
}

getAppliedLeaves(start_date: Date, end_date: Date) {
  var queryParams = `?start_date=${start_date}&end_date=${end_date}`;

    return this.http.get(BACKEND_URL_LEAVE+'/getappliedleaves/'+queryParams);
  }

}
