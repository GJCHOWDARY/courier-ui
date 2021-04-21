import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../auth/auth.service"

const BACKEND_URL = environment.apiUrl + "/users";
const BACKEND_URL_ATTACH = environment.apiUrl + "/attachment";
 
@Injectable({ providedIn: "root" })

export class AttachmentService { 

  constructor(private http: HttpClient, private authService:AuthService, private router: Router) {}

getAttachments(perPage: number, currentPage: number, search: string,userId: string, type: string) {
    var queryParams = `?pagesize=${perPage}&page=${currentPage}&userId=${userId}&type=${type}`;
    console.log(search);
    if(search){
      queryParams+=`&search=${search}`
    }
    return this.http.get(BACKEND_URL_ATTACH+'/getattachments'+queryParams);
  }

addAttachment(attachment_name: string, attachment_desc: string,selectedFile:File,fileName:string,type: string) {
  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("filename", fileName);
  formData.append("attachment_name", attachment_name);
  formData.append("attachment_desc", attachment_desc);
  formData.append("type", type);
    return this.http.post(BACKEND_URL_ATTACH+"/create", formData)
  }

getAttachmentById(id: string) {
     return this.http.get(BACKEND_URL_ATTACH+'/'+ id);
  }

updateAttachment(id: string, attachment_name: string, attachment_desc: string,selectedFile:File,fileName:string) {
  const formData = new FormData();
  formData.append("id", id);
  formData.append("file", selectedFile);
  formData.append("filename", fileName);
  formData.append("attachment_name", attachment_name);
  formData.append("attachment_desc", attachment_desc);

     return this.http.put(BACKEND_URL_ATTACH+"/"+id, formData) 
  }

deleteAttachment(id: string) {
    return this.http.delete(BACKEND_URL_ATTACH+"/"+ id);
  }

getUserId(){
    return this.authService.getUserId()
  }

}
