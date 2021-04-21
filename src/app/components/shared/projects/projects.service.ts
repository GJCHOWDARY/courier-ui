import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_PROJECT = environment.apiUrl + "/projects";
 
@Injectable({ providedIn: "root" })

export class ProjectsService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}
  // TODO: Roles
  getProjects(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_PROJECT+'/getprojects'+queryParams);
  }

  addProject(data: any, userId: string) {
    const jobCategory ={
      project_name: data.project_name,
      project_desc: data.project_desc,
      assignedUsers: data.assignedUsers,
      userId: this.authService.getUserId()
    }
    return this.http.post(BACKEND_URL_PROJECT+"/create", jobCategory)
  }

  getProjectById(id: string) {
     return this.http.get(BACKEND_URL_PROJECT+'/'+ id);
  }

  updateProject(data: any, formData: any) {
    let categoryData = {
      id: data._id,
      project_name: data.project_name,
      project_desc: formData.project_desc,
      assignedUsers: formData.assignedUsers,
     };
     return this.http.put(BACKEND_URL_PROJECT+"/"+data._id, categoryData) 
  }

  deleteProject(id: string) {
    return this.http.delete(BACKEND_URL_PROJECT+"/"+ id);
  }

  search(search) {
    var queryParams='?'
      if(search){
        queryParams+=`search=${search}`
      }
      var listOfBooks = this.http.get(BACKEND_URL+'/search'+ queryParams)
      .pipe(
          debounceTime(500),  // WAIT FOR 500 MILISECONDS ATER EACH KEY STROKE.
          map(
              (data: any) => {
                  return data; 
              }
      ));
      return listOfBooks;  
  } 
}
