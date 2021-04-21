import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_ROLES = environment.apiUrl + "/roles";
 
@Injectable({ providedIn: "root" })
export class RolesService { 
  constructor(private http: HttpClient, private router: Router) {}
  // TODO: Roles
  getRoles(rolePerPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${rolePerPage}&page=${currentPage}`;
    console.log(search);
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_ROLES+'/getroles'+queryParams);
  }

  addRole(role_name: string, role_desc: string) {
    const role ={
      role_name: role_name,
      role_desc: role_desc
    }
    return this.http.post(BACKEND_URL_ROLES+"/createrole", role)
  }

  getRoleById(id: string) {
     return this.http.get(BACKEND_URL_ROLES+'/'+ id);
  }

  updateRole(id: string, role_id: string, role_name: string, role_desc: string) {
    let roleData;
    roleData = {
      id: id,
      role_name: role_name,
      role_desc: role_desc,
      role_id: role_id
    };
    console.log(roleData)
    return this.http.put(BACKEND_URL_ROLES+"/"+id, roleData) 
  }

  deleteRole(id: string) {
    return this.http.delete(BACKEND_URL_ROLES+"/"+ id);
  }
}
