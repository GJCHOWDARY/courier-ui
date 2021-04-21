import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_CAT = environment.apiUrl + "/job";
 
@Injectable({ providedIn: "root" })
export class JobService { 
  constructor(private http: HttpClient, private router: Router) {}
  // TODO: Roles
  getJobs(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    console.log(search);
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_CAT+'/getjobs'+queryParams);
  }

  addJob(job_name: string, job_desc: string) {
    const jobCategory ={
      job_name: job_name,
      job_desc: job_desc
    }
    return this.http.post(BACKEND_URL_CAT+"/create", jobCategory)
  }

  getJobById(id: string) {
     return this.http.get(BACKEND_URL_CAT+'/'+ id);
  }

  updateJob(id: string, job_name: string, job_desc: string) {
    let categoryData = {
      id: id,
      job_name: job_name,
      job_desc: job_desc,
     };
     return this.http.put(BACKEND_URL_CAT+"/"+id, categoryData) 
  }

  deleteJob(id: string) {
    return this.http.delete(BACKEND_URL_CAT+"/"+ id);
  }
}
