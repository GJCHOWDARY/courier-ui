import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service";

const BACKEND_URL_EDU = environment.apiUrl + "/education";
const BACKEND_URL_USER = environment.apiUrl + "/users";
const BACKEND_URL_WORK = environment.apiUrl + "/work";
 
@Injectable({ providedIn: "root" })
export class QualifcationService { 

  constructor(private http: HttpClient, private authService:AuthService, private router: Router) {}
 
  getEducations(userId: string) { 
    return this.http.get(BACKEND_URL_EDU+'/geteducations/'+userId);
  }

  addEducation(data: any) {
    data.userId=this.authService.getUserId();
    return this.http.post(BACKEND_URL_EDU+"/create", data)
  }

  getEducationById(id: string) {
     return this.http.get(BACKEND_URL_EDU+'/'+ id);
  }

  updateEducation(id: string, data:any) {
     data.id=id;
     data.userId=this.authService.getUserId();
     return this.http.put(BACKEND_URL_EDU+"/"+id, data) 
  }

  deleteEducation(id: string) {
    return this.http.delete(BACKEND_URL_EDU+"/"+ id);
  }

  addSkill(userid:string, skill:any){
    return this.http.post(BACKEND_URL_USER+"/addskill/"+userid, skill)
  }

  updateSkills(userid: string, data:any) {
     return this.http.put(BACKEND_URL_USER+"/updateskills/"+userid, data) 
  }
  
  updateSocial(userid: string, data:any) {
    return this.http.put(BACKEND_URL_USER+"/updatesociallinks/"+userid, data) 
 }
 
  //TODO: User Work Services

  getWorks(userId:string) { 
    return this.http.get(BACKEND_URL_WORK+'/getworks/'+userId);
  }

  addWork(data: any) {
    data.userId=this.authService.getUserId();
    return this.http.post(BACKEND_URL_WORK+"/create", data)
  }

  getWorkById(id: string) {
     return this.http.get(BACKEND_URL_WORK+'/'+ id);
  }

  updateWork(id: string,data: any) {
    data.id=id
    data.userId=this.authService.getUserId();
     return this.http.put(BACKEND_URL_WORK+"/"+id, data) 
  }

  deleteWork(id: string) {
    return this.http.delete(BACKEND_URL_WORK+"/"+ id);
  }

}
