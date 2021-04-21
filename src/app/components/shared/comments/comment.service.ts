import { Injectable, PLATFORM_ID } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_COMMENT = environment.apiUrl + "/comments";


@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient, private router: Router, private authService:AuthService) {}

  getCommentsByTicketId(perPage: number, currentPage: number, search: string, tid) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}`;
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_COMMENT+'/getcomments/'+tid+queryParams);
  }

 getUserId(){
   return this.authService.getUserId();
 }
 
  addComment(data: any) {
    const formData = new FormData();
          formData.append("file", data.file);
          formData.append("filename", data.filename);
          formData.append("comment", data.comment);
          formData.append("projectId", data.pid);
          formData.append("ticketId", data.tid);
          formData.append("userId", this.authService.getUserId());
          formData.append("fileType", data.fileType);
          console.log(data)
    return this.http.post(BACKEND_URL_COMMENT+"/create", formData)
  }

  getCommentById(id: string) {
     return this.http.get(BACKEND_URL_COMMENT+'/'+ id);
  }

  updateComment(data: any, formData: any, userId: string) {
    console.log(data)
    let updateData = {
      id: data._id,
      ticket_name: data.ticket_name,
      ticket_desc: formData.ticket_desc,
      projectId: data.projectId._id,
      ticket_priority: formData.ticket_priority,
      userId: userId
     };
     return this.http.put(BACKEND_URL_COMMENT+"/"+data._id, updateData) 
  }

  deleteFile(id: string,file_url:string) {
    let data = {
      id: id,
      file_url: file_url
     };
     return this.http.put(BACKEND_URL_COMMENT+"/deletefile/"+id, data) 
  }

  deleteComment(id: string) {
    return this.http.delete(BACKEND_URL_COMMENT+"/"+ id);
  }
}
