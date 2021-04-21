import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_LEAVE = environment.apiUrl + "/leavetypes";
 
@Injectable({ providedIn: "root" })

export class LeaveService {
  constructor(private http: HttpClient, private router: Router) {}
  // TODO: Roles
  getLeaveTypes(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    console.log(search);
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_LEAVE+'/getleavetypes'+queryParams);
  }

  addLeaveType(createData:any) { 
    return this.http.post(BACKEND_URL_LEAVE+"/create", createData)
  }

  getLeaveTypeById(id: string) {
     return this.http.get(BACKEND_URL_LEAVE+'/'+ id);
  }

  updateLeaveType(id: string,updateData: any) {
    updateData.id=id;
     return this.http.put(BACKEND_URL_LEAVE+"/"+id, updateData) 
  }

  deleteLeaveType(id: string) {
    return this.http.delete(BACKEND_URL_LEAVE+"/"+ id);
  }
}
