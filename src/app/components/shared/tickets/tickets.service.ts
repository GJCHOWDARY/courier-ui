import { Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_PROJECT = environment.apiUrl + "/projects";
const BACKEND_URL_TICKET = environment.apiUrl + "/tickets";
const BACKEND_URL_TASKS = environment.apiUrl + "/tasks";


@Injectable({
  providedIn: 'root'
})

export class TicketsService {
  
  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}

  getTicketsByProjectId(perPage: number, currentPage: number, search: string, pid) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_TICKET+'/gettickets/'+pid+queryParams);
  }

  getTickets(perPage: number, currentPage: number, search: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_TICKET+'/gettickets'+queryParams);
  }

  getUserData(){
   return this.authService.getUserData();
  }

  addTicket(data: any, pid: string) {
    const jobCategory ={
      ticket_name: data.ticket_name,
      ticket_desc: data.ticket_desc,
      ticket_priority: data.ticket_priority,
      projectId: pid,
      userId: this.authService.getUserId()
    }
    return this.http.post(BACKEND_URL_TICKET+"/create", jobCategory)
  }

  getTicketById(id: string) {
     return this.http.get(BACKEND_URL_TICKET+'/'+ id);
  }

  updateTicket(data: any, formData: any) {
    console.log(data)
    let updateData = {
      id: data._id,
      ticket_name: data.ticket_name,
      ticket_desc: formData.ticket_desc,
      projectId: data.projectId._id,
      userId: this.authService.getUserId()
     };
     return this.http.put(BACKEND_URL_TICKET+"/"+data._id, updateData) 
  }

  updateTicketStatus(data: any) {
    console.log(data)
    let updateData = {
      id: data.id,
      status: data.status,
      ticket_priority: data.ticket_priority,
      userId: this.authService.getUserId()
     };
     return this.http.put(BACKEND_URL_TICKET+"/updatestatus/"+data.id, updateData) 
  }

  deleteTicket(id: string) {
    return this.http.delete(BACKEND_URL_TICKET+"/"+ id);
  }

  getTicketTages(id: string) {
    return this.http.get(BACKEND_URL_TASKS+"/gettasktages/"+ id);
  }
}
