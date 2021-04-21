import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"
const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_LEAVE = environment.apiUrl + "/leave";
const BACKEND_URL_LEAVE_TYPES = environment.apiUrl + "/leavetypes";
const BACKEND_URL_USER = environment.apiUrl + "/users";

@Injectable({ providedIn: "root" })

export class LeaveService {
  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}
  // TODO: Roles
getLeaves(perPage: number, currentPage: number, filter: string, start_date: Date, end_date: Date) {
   var queryParams = `?pagesize=${perPage}&page=${currentPage}&start_date=${start_date}&end_date=${end_date}`;
    if(filter){
      queryParams+=`&filter=${filter}`
    }
    return this.http.get(BACKEND_URL_LEAVE+'/getleaves'+queryParams);
  }

getAllLeaves(perPage: number, currentPage: number, filter: string, start_date: Date, end_date: Date) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}&start_date=${start_date}&end_date=${end_date}`;
     if(filter){
      queryParams+=`&filter=${filter}`
    }
    return this.http.get(BACKEND_URL_LEAVE+'/getall'+queryParams);
  }

getLeaveTypes(){
    return this.http.get(BACKEND_URL_LEAVE_TYPES+'/getleavetypes');
  }
  
getUserId(){
    return this.authService.getUserId()
  }

addLeave(data: any){ 
    return this.http.post(BACKEND_URL_LEAVE+"/create", data)
  }

getLeaveById(id: string) {
     return this.http.get(BACKEND_URL_LEAVE+'/'+ id);
  }

getLeaveBalance(id: string,type:number) {
    return this.http.get(BACKEND_URL_USER+'/leavebalace/'+ id+'/'+type);
 }

getLeaveBalanceUser(id: string) {
  return this.http.get(BACKEND_URL_USER+'/userleavebalace/'+ id);
}

updateLeaveStatus(data: any, status) { 
  data.status=status;
   return this.http.put(BACKEND_URL_LEAVE+"/cancelleave/"+data._id, data) 
}

approveLeave(data: any, status) { 
  data.status=status;
   return this.http.put(BACKEND_URL_LEAVE+"/approveleave/"+data._id, data) 
}

updateLeave(id: string,data: any) {
    data.id=id; 
     return this.http.put(BACKEND_URL_LEAVE+"/"+id, data) 
  }

  deleteLeave(id: string) {
    return this.http.delete(BACKEND_URL_LEAVE+"/"+ id);
  }
}
