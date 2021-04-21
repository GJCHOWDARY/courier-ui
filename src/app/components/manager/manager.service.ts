import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from "@angular/router";
import { AuthService } from '../../auth/auth.service'
import { NgForm } from "@angular/forms";
import { environment } from "../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users"; 
const BACKEND_URL_LEAVE = environment.apiUrl + "/leave";

@Injectable({ providedIn: "root" })
export class ManagerService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}

getAssignedUsers(usersPerPage: number, currentPage: number, search: string, userId: string) {
  var queryParams = `?pagesize=${usersPerPage}&page=${currentPage}`;
  if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL+'/getassignedusers/'+userId + queryParams)
  }

getUser(id: string) {
  return this.http.get(BACKEND_URL+'/'+ id);
  }

getAssignedLeaves(perPage: number, currentPage: number, filter: string, start_date: Date, end_date: Date, data:any) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}&start_date=${start_date}&end_date=${end_date}`;
     if(filter){
      queryParams+=`&filter=${filter}`
    }
    if(data.userId&&data.userId!=null){
      queryParams+=`&userId=${data.userId}`
    }
    return this.http.get(BACKEND_URL_LEAVE+'/getassigneduserleaves/'+data.assigneeId+queryParams);
  }

updateLeaveStatus(data: any, status) { 
  data.status=status;
   return this.http.put(BACKEND_URL_LEAVE+"/cancelleave/"+data._id, data) 
}

approveLeave(data: any, status) { 
    data.status=status;
     return this.http.put(BACKEND_URL_LEAVE+"/approveleave/"+data._id, data) 
  }

getUserId(){
  return this.authService.getUserId();
}

}
