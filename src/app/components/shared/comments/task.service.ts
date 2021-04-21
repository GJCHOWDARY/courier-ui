import { Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_TASKS = environment.apiUrl + "/tasks";


@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}

  getTaskByTicketId(perPage: number, currentPage: number, search: string, tid, filter: any) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}&date=${new Date()}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    if(filter.userId&&filter.userId!=null){
      queryParams+=`&userId=${filter.userId}`
    }
    if(filter.filter){
      queryParams+=`&filter=${filter.filter}`
    }
    if(filter.tage){
      queryParams+=`&tage=${filter.tage}`
    }
    return this.http.get(BACKEND_URL_TASKS+'/gettasks/'+tid+queryParams);
  }

 getUserId(){
   return this.authService.getUserId();
 }
 
  addTask(data: any) {
    const comment ={
      task_name: data.task_name,
      tags: data.tags,
      task_desc: data.task_desc,
      start_date: new Date(data.start_date),
      end_date: new Date(data.end_date),
      assignedUsers : data.assignedUsers,
      projectId: data.pid,
      ticketId: data.tid,
      userId: this.authService.getUserId(),
    }
    return this.http.post(BACKEND_URL_TASKS+"/create", comment)
  }

  getTaskById(id: string) {
     return this.http.get(BACKEND_URL_TASKS+'/'+ id);
  }

  updateTaskStatus(data:any){ 
    data.userId= this.authService.getUserId();
      return this.http.put(BACKEND_URL_TASKS+"/updatestatus/"+data.id, data) 
  }

  moveTasktoTicket(data: any,form: any) {
    console.log(data,form)
    let updateData = {
      id: data._id,  
      ticketId: form.ticketId._id,
      userId: this.authService.getUserId()
     };
     return this.http.put(BACKEND_URL_TASKS+"/movetask/"+data._id, updateData) 
  }

  updateTask(data: any) { 
     return this.http.put(BACKEND_URL_TASKS+"/"+data._id, data) 
  }

  deleteTask(id: string) {
    return this.http.delete(BACKEND_URL_TASKS+"/"+ id);
  }
}
